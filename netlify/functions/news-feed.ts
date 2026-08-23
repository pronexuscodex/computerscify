import type { Config, Context } from '@netlify/functions';
import { fetchAllFeeds, NewsField } from '../../scripts/newsFeedSources';

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

export default async (req: Request, _context: Context): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const url = new URL(req.url);
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
};

export const config: Config = {
  path: '/api/news-feed',
};
