import { fetchAllFeeds, NewsField } from '../scripts/newsFeedSources';

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

// fetchAllFeeds internally caps itself at ~7.5s (see AGGREGATE_DEADLINE_MS in newsFeedSources.ts),
// but that number was tuned against Netlify's fixed 10s ceiling. Vercel's default is also ~10s but
// is configurable per-function, so give this one real headroom rather than relying on the internal
// cap alone to land safely under whatever the platform default turns out to be.
export const config = { maxDuration: 15 };

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
