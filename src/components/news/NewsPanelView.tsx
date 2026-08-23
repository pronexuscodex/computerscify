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

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
  <a
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex min-w-0 flex-col justify-between gap-3 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface)] p-5 shadow-[var(--ds-shadow-sm)] transition-transform hover:-translate-y-0.5"
  >
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide">
        <span className="rounded-full bg-[var(--ds-text)] px-2.5 py-1 text-[var(--ds-background)]">{labelForField(item.field)}</span>
        <span className="text-[var(--ds-text-muted)]">{item.source}</span>
        {item.publishedAt && <span className="text-[var(--ds-text-muted)]">· {timeAgo(item.publishedAt)}</span>}
      </div>
      <h3 className="break-words text-base font-black leading-snug">{item.title}</h3>
      {item.summary && <p className="line-clamp-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">{item.summary}</p>}
    </div>
    <span className="inline-flex items-center gap-1 text-xs font-black text-[var(--ds-primary)]">
      Read more <ExternalLink className="h-3.5 w-3.5" />
    </span>
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
      <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-6xl mx-auto space-y-6'}>
        {header}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border)] bg-[var(--ds-surface-muted)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-6xl mx-auto space-y-6'}>
        {header}
        <div className="flex items-center gap-2 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-warning)] bg-[var(--ds-surface-muted)] p-4 text-sm font-bold">
          <AlertCircle className="h-4 w-4 shrink-0 text-[var(--ds-warning)]" />
          Couldn't load news right now — check your connection and try refreshing.
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'p-4 md:p-8 max-w-6xl mx-auto space-y-6'}>
      {header}

      {!compact && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveField('all')}
            className={`min-h-9 rounded-full border px-3 text-xs font-black uppercase ${
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
              className={`min-h-9 rounded-full border px-3 text-xs font-black uppercase ${
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
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
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
