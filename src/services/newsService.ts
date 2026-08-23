import { NewsField, NewsFeedResponse, NewsItem } from '../types/news';

const CACHE_KEY_PREFIX = 'computerfy_news_cache_';
const CACHE_TTL_MS = 30 * 60 * 1000; // matches the server's Cache-Control max-age

interface CachedPayload {
  items: NewsItem[];
  fetchedAt: string;
  cachedAt: number;
}

function cacheKey(fields?: NewsField[]): string {
  return CACHE_KEY_PREFIX + (fields?.length ? [...fields].sort().join(',') : 'all');
}

function readCache(fields?: NewsField[]): CachedPayload | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(fields));
    if (!raw) return null;
    const parsed: CachedPayload = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(fields: NewsField[] | undefined, items: NewsItem[], fetchedAt: string): void {
  try {
    const payload: CachedPayload = { items, fetchedAt, cachedAt: Date.now() };
    sessionStorage.setItem(cacheKey(fields), JSON.stringify(payload));
  } catch {
    // sessionStorage can be unavailable (private browsing) or full — caching is an optimization, not required.
  }
}

/**
 * Fetches curated field news via the same-origin proxy (/api/news-feed — a Vite dev-server
 * middleware locally, a Netlify function in production; see scripts/newsFeedSources.ts).
 * Cached client-side per session so navigating away and back doesn't always refetch.
 */
export async function fetchNews(options?: { fields?: NewsField[]; force?: boolean }): Promise<{ items: NewsItem[]; fetchedAt: string }> {
  const fields = options?.fields;
  if (!options?.force) {
    const cached = readCache(fields);
    if (cached) return { items: cached.items, fetchedAt: cached.fetchedAt };
  }

  const query = fields?.length ? `?fields=${fields.join(',')}` : '';
  const response = await fetch(`/api/news-feed${query}`);
  if (!response.ok) {
    throw new Error(`News feed request failed (${response.status})`);
  }
  const data: NewsFeedResponse = await response.json();
  writeCache(fields, data.items, data.fetchedAt);
  return { items: data.items, fetchedAt: data.fetchedAt };
}
