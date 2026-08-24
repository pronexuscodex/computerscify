import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

export interface ReadableArticle {
  title: string;
  byline: string | null;
  siteName: string | null;
  contentHtml: string;
}

/**
 * Fetches an article's raw HTML through the same-origin proxy (/api/article-proxy — a Vite
 * dev-server middleware locally, a Netlify function in production; see scripts/articleFetch.ts)
 * and extracts a clean, readable version entirely client-side via Readability, so a news item can
 * be read inside the app instead of sending the learner to another tab. The proxy exists because
 * almost no news site sends CORS headers, so a direct browser fetch would fail regardless.
 */
export async function fetchReadableArticle(url: string): Promise<ReadableArticle> {
  const response = await fetch(`/api/article-proxy?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error(`Article fetch failed (${response.status})`);
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Readability resolves relative links and images against the document's base URI, which for a
  // freshly parsed standalone HTML string defaults to about:blank — point it at the real article
  // URL first so images and internal links don't break.
  const base = doc.createElement('base');
  base.href = url;
  doc.head.insertBefore(base, doc.head.firstChild);

  const parsed = new Readability(doc, { keepClasses: false }).parse();
  if (!parsed || !parsed.content || parsed.content.trim().length < 200) {
    throw new Error('Could not extract readable article content from this page');
  }

  // Images are stripped rather than allowed through: they'd point at arbitrary third-party hosts
  // the app's CSP img-src doesn't (and can't reasonably) allowlist, and many are tracking pixels
  // rather than content images. Iframes/media are stripped for the same reason plus XSS surface.
  const contentHtml = DOMPurify.sanitize(parsed.content, {
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#)/i,
    FORBID_TAGS: ['img', 'picture', 'source', 'iframe', 'video', 'audio', 'object', 'embed', 'svg'],
  });

  return {
    title: parsed.title || '',
    byline: parsed.byline || null,
    siteName: parsed.siteName || null,
    contentHtml,
  };
}
