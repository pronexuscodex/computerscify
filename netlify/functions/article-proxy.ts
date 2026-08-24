import type { Config, Context } from '@netlify/functions';
import { fetchArticleHtml } from '../../scripts/articleFetch';

// Production equivalent of vite.config.ts's articleProxyPlugin. Vite's dev/preview-server
// middleware only exists locally — a Netlify deploy is a static site with no Node server behind
// it, so this serverless function is what actually serves /api/article-proxy once deployed. Keep
// this logic in sync with vite.config.ts's registerArticleMiddleware; both share fetchArticleHtml.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default async (req: Request, _context: Context): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const requestUrl = new URL(req.url);
    const targetUrl = requestUrl.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing url query parameter', { status: 400 });
    }

    const { html } = await fetchArticleHtml(targetUrl);

    return new Response(html, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=1800',
      },
    });
  } catch (err: unknown) {
    return new Response(`Article Proxy exception: ${err instanceof Error ? err.message : 'Unknown error'}`, {
      status: 502,
    });
  }
};

export const config: Config = {
  path: '/api/article-proxy',
};
