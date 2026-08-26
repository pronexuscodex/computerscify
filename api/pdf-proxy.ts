import { isAllowedPdfProxyHost, resolveResourceIdToUrl } from '../scripts/pdfProxyAllowlist';
import correctedManifest from '../academic-resource-report.corrected.json';

// Production equivalent of vite.config.ts's pdfProxyPlugin. Vite's dev/preview-server middleware
// only exists locally — a Vercel deploy is a static site with no Node server behind it, so this
// serverless function is what actually serves /api/pdf-proxy once deployed. Keep this logic in
// sync with vite.config.ts's registerProxyMiddleware; both share the same allowlist module.
//
// Vercel Functions (non-Next.js): any file under /api is deployed as a function at the matching
// route, routed per HTTP method via named exports (GET/OPTIONS/etc.) rather than Netlify's single
// default-export-plus-method-check — see https://vercel.com/docs/functions/functions-api-reference.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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
    const resourceId = requestUrl.searchParams.get('resourceId');
    let targetUrl = requestUrl.searchParams.get('url');

    if (resourceId) {
      targetUrl = resolveResourceIdToUrl(correctedManifest, resourceId) || targetUrl;
    }

    if (!targetUrl) {
      return new Response('Missing or invalid resourceId / url query parameter', { status: 400 });
    }

    let parsedHost = '';
    try {
      parsedHost = new URL(targetUrl).hostname.toLowerCase();
    } catch {
      return new Response('Invalid target URL', { status: 400 });
    }

    if (!isAllowedPdfProxyHost(parsedHost)) {
      return new Response(`Forbidden: Host '${parsedHost}' is not in the server-side registry allowlist.`, {
        status: 403,
      });
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/pdf,application/octet-stream,*/*',
      },
    });

    if (!upstreamResponse.ok) {
      return new Response(`Proxy error: Unable to fetch PDF (${upstreamResponse.status} ${upstreamResponse.statusText})`, {
        status: upstreamResponse.status,
      });
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': upstreamResponse.headers.get('content-type') || 'application/pdf',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: unknown) {
    return new Response(`PDF Proxy exception: ${err instanceof Error ? err.message : 'Unknown error'}`, {
      status: 500,
    });
  }
}
