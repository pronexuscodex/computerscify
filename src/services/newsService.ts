import { NewsField, NewsFeedResponse, NewsItem } from '../types/news';

const CACHE_KEY_PREFIX = 'computerfy_news_cache_';
// Within this window, cached data is treated as current — fetchNews skips the network entirely.
// Matches the server's Cache-Control max-age, so refetching sooner couldn't return anything newer.
const FRESH_TTL_MS = 30 * 60 * 1000;
// Beyond FRESH_TTL but within this window, cached data is stale but still worth showing instantly
// while a fresh copy loads in the background — better than a blank skeleton for a returning
// learner. Past this, it's old enough that showing it first would be misleading.
const STALE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachedPayload {
  items: NewsItem[];
  fetchedAt: string;
  cachedAt: number;
}

interface NewsFetchResult {
  items: NewsItem[];
  fetchedAt: string;
  /** true when this data is past FRESH_TTL — the caller should keep showing it but expect an update. */
  stale: boolean;
}

function cacheKey(fields?: NewsField[]): string {
  return CACHE_KEY_PREFIX + (fields?.length ? [...fields].sort().join(',') : 'all');
}

function readCache(fields?: NewsField[]): CachedPayload | null {
  try {
    // localStorage (not sessionStorage): the point of this cache is to paint something instantly
    // even on a brand-new tab/session — a returning learner's last-seen headlines are still more
    // useful than a blank skeleton while a fresh copy loads in the background.
    const raw = localStorage.getItem(cacheKey(fields));
    if (!raw) return null;
    return JSON.parse(raw) as CachedPayload;
  } catch {
    return null;
  }
}

function writeCache(fields: NewsField[] | undefined, items: NewsItem[], fetchedAt: string): void {
  try {
    const payload: CachedPayload = { items, fetchedAt, cachedAt: Date.now() };
    localStorage.setItem(cacheKey(fields), JSON.stringify(payload));
  } catch {
    // localStorage can be unavailable (private browsing) or full — caching is an optimization, not required.
  }
}

/**
 * Synchronous cache read for instant first paint — call this on mount, before the network request
 * resolves, so a returning learner sees their last-fetched feed immediately instead of a loading
 * skeleton. Returns null if there's nothing cached or it's old enough (>24h) to not be worth
 * showing as a placeholder.
 */
export function peekCachedNews(fields?: NewsField[]): NewsFetchResult | null {
  const cached = readCache(fields);
  if (!cached) return null;
  const age = Date.now() - cached.cachedAt;
  if (age > STALE_TTL_MS) return null;
  return { items: cached.items, fetchedAt: cached.fetchedAt, stale: age > FRESH_TTL_MS };
}

/**
 * Fetches curated field news via the same-origin proxy (/api/news-feed — a Vite dev-server
 * middleware locally, a Vercel function in production; see scripts/newsFeedSources.ts).
 * Skips the network entirely when a fresh (<30min) cache entry exists, unless `force` is set.
 */
export async function fetchNews(options?: { fields?: NewsField[]; force?: boolean }): Promise<NewsFetchResult> {
  const fields = options?.fields;
  if (!options?.force) {
    const cached = readCache(fields);
    if (cached && Date.now() - cached.cachedAt <= FRESH_TTL_MS) {
      return { items: cached.items, fetchedAt: cached.fetchedAt, stale: false };
    }
  }

  const query = fields?.length ? `?fields=${fields.join(',')}` : '';
  const response = await fetch(`/api/news-feed${query}`);
  if (!response.ok) {
    throw new Error(`News feed request failed (${response.status})`);
  }
  const data: NewsFeedResponse = await response.json();
  writeCache(fields, data.items, data.fetchedAt);
  return { items: data.items, fetchedAt: data.fetchedAt, stale: false };
}
