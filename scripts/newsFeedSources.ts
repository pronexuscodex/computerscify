import { XMLParser } from 'fast-xml-parser';

// Curated, verified RSS/Atom feeds (checked live before inclusion — real HTTP 200 responses with
// actual <item>/<entry> content, not guessed URLs) grouped by curriculum field. Shared between the
// Vite dev-server middleware (vite.config.ts) and the Netlify function (netlify/functions/news-feed.ts)
// so local dev and production never drift out of sync — mirrors scripts/pdfProxyAllowlist.ts's role.
export type NewsField = 'ai' | 'data-science' | 'data-engineering' | 'cybersecurity' | 'computer-science';

export interface NewsFeedSource {
  id: string;
  name: string;
  url: string;
  field: NewsField;
}

export const NEWS_FEED_SOURCES: NewsFeedSource[] = [
  { id: 'mit-ai', name: 'MIT News — Artificial Intelligence', url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', field: 'ai' },
  { id: 'bair', name: 'Berkeley Artificial Intelligence Research (BAIR)', url: 'https://bair.berkeley.edu/blog/feed.xml', field: 'ai' },
  { id: 'openai', name: 'OpenAI News', url: 'https://openai.com/blog/rss.xml', field: 'ai' },

  { id: 'kdnuggets', name: 'KDnuggets', url: 'https://kdnuggets.com/feed', field: 'data-science' },
  { id: 'mit-data', name: 'MIT News — Data', url: 'https://news.mit.edu/rss/topic/data', field: 'data-science' },

  { id: 'netflix-eng', name: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/feed', field: 'data-engineering' },
  { id: 'oreilly-radar', name: "O'Reilly Radar", url: 'https://www.oreilly.com/radar/feed/index.xml', field: 'data-engineering' },

  { id: 'krebs', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', field: 'cybersecurity' },
  { id: 'schneier', name: 'Schneier on Security', url: 'https://www.schneier.com/feed/atom/', field: 'cybersecurity' },

  { id: 'hn-frontpage', name: 'Hacker News — Front Page', url: 'https://hnrss.org/frontpage', field: 'computer-science' },
  { id: 'mit-techreview', name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', field: 'computer-science' },
];

export interface NormalizedNewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  source: string;
  sourceId: string;
  field: NewsField;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  textNodeName: '__text',
});

// XML parsers decode standard entities in plain text nodes, but content inside a CDATA section —
// how most WordPress/blog feeds wrap their <description> — is left completely literal by design,
// so an author's own already-HTML-encoded "&#8217;" for an apostrophe survives untouched and would
// otherwise show up verbatim in the feed ("today&#8217;s edition"). Decode the small set of named
// and numeric entities that actually show up in RSS prose; this isn't a full HTML-entity table, but
// covers everything WordPress's default encoding emits.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint = entity[1]?.toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    const lower = entity.toLowerCase();
    return lower in NAMED_ENTITIES ? NAMED_ENTITIES[lower] : match;
  });
}

function stripHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  return decodeHtmlEntities(
    input
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// hnrss.org (and similar link-aggregator feeds) publish a fixed metadata block as the item
// "description" instead of any real article text — e.g. "Article URL: https://... Comments URL:
// https://... Points: 123 # Comments: 45" — which otherwise shows up verbatim as the story's
// summary. Strip that known boilerplate; if nothing else is left, leave the summary empty rather
// than showing raw metadata.
function stripAggregatorBoilerplate(text: string): string {
  return text
    .replace(/Article URL:\s*\S+/gi, '')
    .replace(/Comments URL:\s*\S+/gi, '')
    .replace(/Points:\s*\d+/gi, '')
    .replace(/#?\s*Comments:\s*\d+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function textOf(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    if (typeof obj.__cdata === 'string') return obj.__cdata;
    if (typeof obj.__text === 'string') return obj.__text;
  }
  return '';
}

function linkOf(node: unknown): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) {
    // Atom feeds: prefer rel="alternate" or the first entry with an href.
    const alt = node.find((l) => typeof l === 'object' && l !== null && (l as Record<string, unknown>)['@_rel'] !== 'self');
    const chosen = (alt ?? node[0]) as Record<string, unknown> | undefined;
    return (chosen?.['@_href'] as string) || '';
  }
  if (node && typeof node === 'object') {
    return ((node as Record<string, unknown>)['@_href'] as string) || textOf(node);
  }
  return '';
}

/** Parses either RSS 2.0 (<rss><channel><item>) or Atom (<feed><entry>) XML into normalized items. */
export function parseFeedXml(xml: string, source: NewsFeedSource): NormalizedNewsItem[] {
  let parsed: any;
  try {
    parsed = xmlParser.parse(xml);
  } catch {
    return [];
  }

  const rssItems = parsed?.rss?.channel?.item;
  const atomEntries = parsed?.feed?.entry;
  const rawItems: any[] = Array.isArray(rssItems) ? rssItems : rssItems ? [rssItems] : Array.isArray(atomEntries) ? atomEntries : atomEntries ? [atomEntries] : [];

  // Some sources (e.g. openai.com/blog/rss.xml) publish their entire historical archive in one feed
  // rather than just recent posts — capping keeps a "news" panel about what's recent, and keeps one
  // large feed from drowning out every other source in the same field.
  const MAX_ITEMS_PER_SOURCE = 20;

  return rawItems
    .slice(0, MAX_ITEMS_PER_SOURCE)
    .map((item, idx): NormalizedNewsItem | null => {
      const title = stripHtml(textOf(item.title)) || 'Untitled';
      const link = linkOf(item.link) || (typeof item.guid === 'string' ? item.guid : textOf(item.guid));
      if (!link) return null;
      const summaryRaw = textOf(item.description) || textOf(item.summary) || textOf(item.content) || '';
      const summary = stripAggregatorBoilerplate(stripHtml(summaryRaw)).slice(0, 320);
      const pubDateRaw = textOf(item.pubDate) || textOf(item.published) || textOf(item.updated) || null;
      const publishedAt = pubDateRaw ? new Date(pubDateRaw).toISOString() : null;

      return {
        id: `${source.id}-${idx}-${link}`,
        title,
        link,
        summary,
        publishedAt: publishedAt && !Number.isNaN(new Date(publishedAt).getTime()) ? publishedAt : null,
        source: source.name,
        sourceId: source.id,
        field: source.field,
      };
    })
    .filter((item): item is NormalizedNewsItem => item !== null);
}

const FETCH_TIMEOUT_MS = 12000;
// A retry exists for transient blips (see fetchOneFeed below), not to give a second full-length
// attempt to a source that's genuinely down — a dead host times out identically on both tries, so
// waiting another 12s just to confirm that doubles how long one broken source can stall the whole
// batch (fetchAllFeeds awaits every source before returning anything). Fail the retry fast instead.
const RETRY_TIMEOUT_MS = 5000;

async function fetchOnce(source: NewsFeedSource, timeoutMs: number): Promise<NormalizedNewsItem[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ComputerSciFyNewsBot/1.0 (+https://github.com/pronexuscodex/computerscify)' },
    });
    if (!response.ok) return null;
    const xml = await response.text();
    return parseFeedXml(xml, source);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches and parses one feed, never throwing — a single dead/slow source must not break the panel.
 * One retry: under concurrent load (11 feeds fetched in parallel), an individual slow-but-healthy
 * source can occasionally miss the timeout window even though it would succeed on its own. The
 * retry uses a shorter timeout than the first attempt (see RETRY_TIMEOUT_MS) since by this point
 * it's a "confirm it's actually down" check, not a second real chance.
 */
export async function fetchOneFeed(source: NewsFeedSource): Promise<NormalizedNewsItem[]> {
  const first = await fetchOnce(source, FETCH_TIMEOUT_MS);
  if (first !== null) return first;
  const retry = await fetchOnce(source, RETRY_TIMEOUT_MS);
  return retry ?? [];
}

// Netlify's synchronous Functions have a hard 10s execution limit on the plan this site runs on
// (the underlying issue behind the "Couldn't load news right now" error learners were hitting in
// production — fine locally under `vite dev`, which has no such cap). fetchOneFeed's own retry
// logic can legitimately take up to FETCH_TIMEOUT_MS + RETRY_TIMEOUT_MS (17s) for a single dead
// source, and Promise.all waits for the slowest one — so one broken source was silently timing
// out the *entire* feed for every learner, not just degrading that one source's contribution.
// Race each source against this hard aggregate deadline so a slow/dead source can never delay the
// response past what Netlify allows; a source that hasn't resolved by then just contributes
// nothing to this response (its own fetchOneFeed call is abandoned, not cancelled, but that's
// harmless — the request just isn't awaited).
// Deliberately conservative: local testing showed some sources occasionally need close to 8-9s
// under concurrent load, but pushing the deadline that high leaves too little margin below
// Netlify's 10s ceiling once cold-start and response-serialization overhead are added on top in
// production. A response that's occasionally missing one source's items is graceful degradation;
// a response that occasionally exceeds Netlify's timeout is a total failure for every learner —
// the latter is what this whole mechanism exists to prevent, so it gets priority over completeness.
const AGGREGATE_DEADLINE_MS = 7500;

export async function fetchAllFeeds(fields?: NewsField[]): Promise<NormalizedNewsItem[]> {
  const sources = fields?.length ? NEWS_FEED_SOURCES.filter((s) => fields.includes(s.field)) : NEWS_FEED_SOURCES;
  const results = await Promise.all(
    sources.map((source) =>
      Promise.race([
        fetchOneFeed(source),
        new Promise<NormalizedNewsItem[]>((resolve) => setTimeout(() => resolve([]), AGGREGATE_DEADLINE_MS)),
      ])
    )
  );
  return results
    .flat()
    .sort((a, b) => {
      const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bt - at;
    });
}
