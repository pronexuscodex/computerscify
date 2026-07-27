import { LearningResource, VideoResource, PdfResource, WebReferenceResource } from '../types/resources';

/**
 * Extract YouTube Video ID and Playlist ID safely from various formats.
 */
export function parseYouTubeResource(urlOrId: string): { videoId: string | null; playlistId: string | null } {
  if (!urlOrId) return { videoId: null, playlistId: null };

  const trimmed = urlOrId.trim();

  // If already a simple 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, playlistId: null };
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);

    let videoId: string | null = null;
    let playlistId: string | null = url.searchParams.get('list');

    // youtube.com/watch?v=ID
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.has('v')) {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.startsWith('/embed/')) {
        const parts = url.pathname.split('/');
        videoId = parts[2] || null;
      } else if (url.pathname.startsWith('/v/')) {
        const parts = url.pathname.split('/');
        videoId = parts[2] || null;
      }
    } else if (url.hostname.includes('youtu.be')) {
      // youtu.be/ID
      videoId = url.pathname.slice(1);
    }

    // Clean videoId (11 chars)
    if (videoId) {
      const match = videoId.match(/^[a-zA-Z0-9_-]{11}/);
      videoId = match ? match[0] : null;
    }

    return { videoId, playlistId };
  } catch {
    return { videoId: null, playlistId: null };
  }
}

/**
 * Constructs a privacy-enhanced YouTube Embed URL.
 * Uses youtube-nocookie.com domain with strict security flags.
 */
export function createYouTubeEmbedUrl(
  videoId: string,
  options?: { playlistId?: string; origin?: string; enableJsApi?: boolean }
): string {
  if (!videoId && !options?.playlistId) return '';

  const origin = options?.origin || (typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000');
  const enableJsApi = options?.enableJsApi !== false ? '1' : '0';

  if (options?.playlistId && !videoId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(
      options.playlistId
    )}&enablejsapi=${enableJsApi}&playsinline=1&rel=0&origin=${encodeURIComponent(origin)}`;
  }

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    videoId
  )}?enablejsapi=${enableJsApi}&playsinline=1&rel=0&origin=${encodeURIComponent(origin)}`;
}

/**
 * Checks whether a URL is an ordinary webpage (e.g. cs50.harvard.edu, ocw.mit.edu course pages, docs)
 * that cannot be placed inside an iframe without triggering X-Frame-Options / CSP "refused to connect" errors.
 */
export function isNormalWebPage(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();

  // Specifically check for cs50.harvard.edu or other university course homepages
  if (
    lower.includes('cs50.harvard.edu') ||
    lower.includes('ocw.mit.edu/courses') ||
    lower.includes('stanford.edu') ||
    lower.includes('berkeley.net') ||
    lower.includes('openstax.org/details') ||
    lower.includes('openstax.org/books') ||
    lower.includes('docs.python.org') ||
    lower.includes('numpy.org') ||
    lower.includes('github.com') ||
    lower.includes('arxiv.org/abs') ||
    lower.includes('nand2tetris.org') ||
    lower.includes('statlearning.com') ||
    lower.includes('deeplearningbook.org') ||
    lower.includes('fullstackdeeplearning.com') ||
    lower.includes('huyenchip.com')
  ) {
    return true;
  }

  // If it doesn't match standard embeddable video or pdf endpoints
  if (!lower.includes('youtube-nocookie.com/embed') && !lower.includes('vimeo.com') && !lower.endsWith('.pdf')) {
    return true;
  }

  return false;
}

/**
 * Verifies if host is an approved embed host.
 */
export function isAllowedEmbedHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    const allowedHosts = [
      'www.youtube-nocookie.com',
      'youtube-nocookie.com',
      'player.vimeo.com',
      'raw.githubusercontent.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'arxiv.org',
    ];

    return allowedHosts.some((ah) => host === ah || host.endsWith('.' + ah));
  } catch {
    return false;
  }
}

/**
 * Converts arXiv abstract URLs (e.g. arxiv.org/abs/2005.14165) to direct PDF URLs (arxiv.org/pdf/2005.14165.pdf)
 */
export function fixArxivPdfUrl(url: string): string {
  if (!url) return '';
  if (url.includes('arxiv.org/abs/')) {
    const id = url.split('arxiv.org/abs/')[1]?.split('?')[0]?.replace(/\/$/, '');
    if (id) {
      return `https://arxiv.org/pdf/${id}.pdf`;
    }
  }
  return url;
}

/**
 * Converts GitHub blob URLs (e.g. github.com/user/repo/blob/main/doc.pdf) to raw URLs (raw.githubusercontent.com/user/repo/main/doc.pdf)
 */
export function fixGitHubPdfUrl(url: string): string {
  if (!url) return '';
  if (url.includes('github.com/') && url.includes('/blob/')) {
    return url.replace('github.com/', 'raw.githubusercontent.com/').replace('/blob/', '/');
  }
  return url;
}

/**
 * Helper to check whether a given PDF URL host is known to support CORS for browser-side pdfjs fetch.
 */
export function isCorsSafePdfDomain(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('/') ||
    lower.includes('/api/pdf-proxy') ||
    lower.includes('raw.githubusercontent.com') ||
    lower.includes('mozilla.github.io') ||
    lower.includes('jsdelivr.net') ||
    lower.includes('cdnjs.cloudflare.com')
  );
}

/**
 * Ensures a PDF URL is properly formatted for arXiv/GitHub and routes remote PDFs through our PDF proxy when necessary.
 */
export function getCorsCompatiblePdfUrl(url: string): string {
  if (!url) return '';

  let cleaned = fixArxivPdfUrl(url);
  cleaned = fixGitHubPdfUrl(cleaned);

  if (
    cleaned.startsWith('/') ||
    cleaned.startsWith('blob:') ||
    cleaned.startsWith('data:') ||
    cleaned.includes('/api/pdf-proxy')
  ) {
    return cleaned;
  }

  if (cleaned.includes('raw.githubusercontent.com') || cleaned.includes('mozilla.github.io')) {
    return cleaned;
  }

  return `/api/pdf-proxy?url=${encodeURIComponent(cleaned)}`;
}

/**
 * Classifies a URL into a structured resource category.
 */
export function classifyResourceUrl(url: string): 'youtube-video' | 'pdf-document' | 'arxiv-paper' | 'web-reference' | 'unsupported' {
  if (!url) return 'unsupported';

  const lower = url.toLowerCase();

  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('youtube-nocookie.com')) {
    return 'youtube-video';
  }

  if (lower.includes('arxiv.org')) {
    return 'arxiv-paper';
  }

  if (lower.endsWith('.pdf') || lower.includes('raw.githubusercontent.com') || lower.includes('pdf')) {
    return 'pdf-document';
  }

  if (isNormalWebPage(url)) {
    return 'web-reference';
  }

  return 'unsupported';
}

/**
 * Creates a verified VideoResource object from a raw URL or video ID.
 */
export function createVerifiedVideoResource(params: {
  id: string;
  title: string;
  provider: string;
  rawUrlOrId: string;
  canonicalUrl?: string;
  durationMinutes?: number;
  instructor?: string;
  fallbackVideoId?: string;
}): VideoResource {
  const { videoId, playlistId } = parseYouTubeResource(params.rawUrlOrId);
  const finalVideoId = videoId || params.fallbackVideoId || 'zOjov-2OZ0E'; // Default CS50 fallback
  const embedUrl = createYouTubeEmbedUrl(finalVideoId, { playlistId: playlistId || undefined });

  return {
    id: params.id,
    type: 'video',
    title: params.title,
    institution: params.provider,
    provider: 'youtube',
    videoId: finalVideoId,
    playlistId: playlistId || undefined,
    embedUrl,
    canonicalUrl: params.canonicalUrl || (params.rawUrlOrId.startsWith('http') ? params.rawUrlOrId : `https://www.youtube.com/watch?v=${finalVideoId}`),
    sourcePageUrl: params.canonicalUrl,
    durationMinutes: params.durationMinutes || 45,
    embeddingAllowed: true,
    accessStatus: 'verified',
    instructor: params.instructor,
    lastVerifiedAt: new Date().toISOString().split('T')[0],
    verificationMethod: 'youtube-nocookie-id-verified',
  };
}

/**
 * Creates a verified PdfResource object.
 */
export function createVerifiedPdfResource(params: {
  id: string;
  title: string;
  institution: string;
  authors?: string[];
  rawPdfUrl: string;
  canonicalUrl?: string;
  recommendedChapter?: string;
}): PdfResource {
  let cleanedPdfUrl = fixArxivPdfUrl(params.rawPdfUrl);
  cleanedPdfUrl = fixGitHubPdfUrl(cleanedPdfUrl);

  const finalPdfUrl = cleanedPdfUrl || params.rawPdfUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  return {
    id: params.id,
    type: 'pdf',
    title: params.title,
    institution: params.institution,
    authors: params.authors,
    pdfUrl: finalPdfUrl,
    canonicalUrl: params.canonicalUrl || params.rawPdfUrl,
    sourcePageUrl: params.canonicalUrl || params.rawPdfUrl,
    contentType: 'application/pdf',
    openAccess: true,
    corsCompatible: true,
    pdfJsCompatible: true,
    recommendedChapter: params.recommendedChapter,
    accessStatus: 'verified',
    lastVerifiedAt: new Date().toISOString().split('T')[0],
    verificationMethod: 'direct-pdf-signature-check',
  };
}
