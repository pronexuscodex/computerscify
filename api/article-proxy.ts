import { fetchArticleHtml } from '../scripts/articleFetch';

// Production equivalent of vite.config.ts's articleProxyPlugin. Vite's dev/preview-server
// middleware only exists locally — a Vercel deploy is a static site with no Node server behind
// it, so this serverless function is what actually serves /api/article-proxy once deployed. Keep
// this logic in sync with vite.config.ts's registerArticleMiddleware; both share fetchArticleHtml.
//
// Must run on the Node.js runtime (the default — do not add `export const config = { runtime:
// 'edge' }` here): fetchArticleHtml's SSRF guard uses node:dns, which Edge Runtime doesn't support.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const requestUrl = new URL(request.url);
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
}
