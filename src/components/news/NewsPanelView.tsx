import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Newspaper, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchNews } from '../../services/newsService';
import { NEWS_FIELDS, labelForField } from '../../data/newsFieldMeta';
import { NewsField, NewsItem } from '../../types/news';

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// A single row in the feed river — the layout real news apps use: a scannable vertical list, not
// a grid of boxed cards. Field tag + source/time sits above the headline so it reads left-to-right
// like a news ticker entry.
const NewsRow: React.FC<{ item: NewsItem; lead?: boolean }> = ({ item, lead = false }) => (
  <a
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex min-w-0 items-start gap-3 py-4 transition-colors hover:bg-[var(--ds-surface-muted)] sm:gap-4 sm:px-2 sm:-mx-2 rounded-[var(--ds-radius-md)]"
  >
    <div className="min-w-0 flex-1 space-y-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-wide">
        <span className="rounded-full bg-[var(--ds-text)] px-2.5 py-0.5 text-[var(--ds-background)]">{labelForField(item.field)}</span>
        <span className="text-[var(--ds-text-muted)]">{item.source}</span>
        {item.publishedAt && <span className="text-[var(--ds-text-muted)]">· {timeAgo(item.publishedAt)}</span>}
      </div>
      <h3 className={`break-words font-black leading-snug group-hover:underline ${lead ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>
        {item.title}
      </h3>
      {item.summary && (
        <p className={`text-[var(--ds-text-muted)] leading-relaxed ${lead ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'}`}>
          {item.summary}
        </p>
      )}
    </div>
    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-text-muted)] transition-colors group-hover:text-[var(--ds-primary)]" />
  </a>
);

interface NewsPanelViewProps {
  /** When set, renders as a compact embedded widget (e.g. on the Dashboard) instead of a full page. */
  compact?: boolean;
  maxItems?: number;
  /** Skip the built-in title/refresh row — for callers (like the Dashboard widget) that render their own. */
  hideHeader?: boolean;
}

export const NewsPanelView: React.FC<NewsPanelViewProps> = ({ compact = false, maxItems, hideHeader = false }) => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeField, setActiveField] = useState<NewsField | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = (force = false) => {
    setStatus((prev) => (prev === 'ready' ? prev : 'loading'));
    fetchNews({ force })
      .then(({ items: fetched, fetchedAt: at }) => {
        setItems(fetched);
        setFetchedAt(at);
        setStatus('ready');
      })
      .catch(() => setStatus('error'))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    load(true);
  };

  const filtered = useMemo(() => {
    const base = activeField === 'all' ? items : items.filter((i) => i.field === activeField);
    return maxItems ? base.slice(0, maxItems) : base;
  }, [items, activeField, maxItems]);

  const header = hideHeader ? null : (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-[var(--ds-primary)]" />
        <h2 className={compact ? 'text-lg font-black' : 'text-2xl font-black'}>Field News</h2>
        {status === 'ready' && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--ds-security-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--ds-security)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ds-security)]" /> Live
          </span>
        )}
      </div>
      {!compact && (
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] px-3 text-xs font-black disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      )}
    </div>
  );

  if (status === 'loading') {
    return (
      <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-3xl mx-auto space-y-6'}>
        {header}
        <div className="divide-y divide-[var(--ds-border)]">
          {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
            <div key={i} className="py-4 space-y-2">
              <div className="h-3 w-24 rounded-full bg-[var(--ds-surface-muted)] animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-[var(--ds-surface-muted)] animate-pulse" />
              <div className="h-3 w-full rounded bg-[var(--ds-surface-muted)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-3xl mx-auto space-y-6'}>
        {header}
        <div className="flex items-center gap-2 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-warning)] bg-[var(--ds-surface-muted)] p-4 text-sm font-bold">
          <AlertCircle className="h-4 w-4 shrink-0 text-[var(--ds-warning)]" />
          Couldn't load news right now — check your connection and try refreshing.
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-3xl mx-auto space-y-6'}>
      {header}

      {!compact && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          <button
            type="button"
            onClick={() => setActiveField('all')}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-black uppercase ${
              activeField === 'all' ? 'border-[var(--ds-primary)] bg-[var(--ds-surface-muted)]' : 'border-[var(--ds-border)] text-[var(--ds-text-muted)]'
            }`}
          >
            All
          </button>
          {NEWS_FIELDS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveField(f.id)}
              className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-black uppercase ${
                activeField === f.id ? 'border-[var(--ds-primary)] bg-[var(--ds-surface-muted)]' : 'border-[var(--ds-border)] text-[var(--ds-text-muted)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--ds-text-muted)] font-bold">No stories in this category right now — try again shortly.</p>
      ) : (
        <div className="divide-y divide-[var(--ds-border)]">
          {filtered.map((item, idx) => (
            <NewsRow key={item.id} item={item} lead={!compact && idx === 0} />
          ))}
        </div>
      )}

      {!compact && fetchedAt && (
        <p className="text-[11px] font-mono text-[var(--ds-text-muted)]">
          Updated {new Date(fetchedAt).toLocaleString()} · Sources: MIT News, BAIR, OpenAI, KDnuggets, Netflix Tech Blog, O'Reilly Radar, Krebs on Security, Schneier on Security, Hacker News, MIT Technology Review
        </p>
      )}
    </div>
  );
};
