import { fetchAllFeeds, NewsField } from '../scripts/newsFeedSources.js';

// Production equivalent of vite.config.ts's newsFeedProxyPlugin. RSS/Atom feeds are fetched
// server-side (most sources don't set CORS headers permitting a browser fetch, and fetching from
// the client would also leak each reader's IP to every source on every page view). Cached at the
// CDN for 30 minutes — frequent enough to feel "daily updated" and then some, without hammering
// source servers on every visit.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const VALID_FIELDS: NewsField[] = ['ai', 'data-science', 'data-engineering', 'cybersecurity', 'computer-science'];

// fetchAllFeeds internally caps itself at ~7.5s (see AGGREGATE_DEADLINE_MS in newsFeedSources.ts).
// maxDuration is set for this function in vercel.json (rather than an `export const config` here,
// whose exact shape for non-Next.js "other" framework functions isn't consistently documented) to
// give it real headroom above that internal cap.

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const fieldsParam = url.searchParams.get('fields');
    const requestedFields = fieldsParam
      ? (fieldsParam.split(',').filter((f): f is NewsField => VALID_FIELDS.includes(f as NewsField)))
      : undefined;

    const items = await fetchAllFeeds(requestedFields);

    return new Response(JSON.stringify({ items, fetchedAt: new Date().toISOString() }), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800',
      },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error', items: [] }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}
