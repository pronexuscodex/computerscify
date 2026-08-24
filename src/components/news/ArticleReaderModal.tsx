import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Dialog } from '../common/Dialog';
import { fetchReadableArticle, ReadableArticle } from '../../services/articleReader';
import { NewsItem } from '../../types/news';
import { labelForField } from '../../data/newsFieldMeta';

interface ArticleReaderModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

/**
 * Reads a news item inside the app instead of sending the learner to another tab: fetches the
 * article through /api/article-proxy and extracts a clean version with Readability. Falls back to
 * the RSS summary (with an explicit "Open Original Source" link) when extraction fails — some
 * sites are paywalled, JS-rendered, or otherwise unreadable from static HTML, and that's shown
 * honestly rather than presented as a broken reader.
 */
export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ item, onClose }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [article, setArticle] = useState<ReadableArticle | null>(null);

  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    setStatus('loading');
    setArticle(null);

    fetchReadableArticle(item.link)
      .then((result) => {
        if (cancelled) return;
        setArticle(result);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) return null;

  const displayTitle = (status === 'ready' && article?.title) || item.title;

  return (
    <Dialog
      isOpen={!!item}
      onClose={onClose}
      size="xl"
      title={displayTitle}
      description={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="rounded-full bg-[var(--ds-text)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--ds-background)]">
            {labelForField(item.field)}
          </span>
          <span>{article?.siteName || item.source}</span>
          {article?.byline && <span>· {article.byline}</span>}
        </span>
      }
      footer={
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] px-4 text-xs font-black uppercase tracking-wide text-[var(--ds-text-muted)] transition-colors hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]"
        >
          Open Original Source <ExternalLink className="h-3.5 w-3.5" />
        </a>
      }
    >
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--ds-text-muted)]">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--ds-primary)]" />
          <p className="text-sm font-bold">Fetching article…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-warning)] bg-[var(--ds-surface-muted)] p-4 text-sm font-bold">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--ds-warning)]" />
            <span>
              Couldn't load the full article in-app for this source — showing the preview instead. Use "Open
              Original Source" below to read it on the publisher's site.
            </span>
          </div>
          {item.summary && (
            <p className="ds-reading-width mx-auto text-sm leading-relaxed text-[var(--ds-text-muted)]">
              {item.summary}
            </p>
          )}
        </div>
      )}

      {status === 'ready' && article && (
        <div
          className="article-reader-content ds-reading-width mx-auto"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      )}
    </Dialog>
  );
};
