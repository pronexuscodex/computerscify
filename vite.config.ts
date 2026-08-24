import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

import correctedManifest from './academic-resource-report.corrected.json';
import { isAllowedPdfProxyHost, resolveResourceIdToUrl } from './scripts/pdfProxyAllowlist';
import { fetchAllFeeds, NewsField } from './scripts/newsFeedSources';
import { fetchArticleHtml } from './scripts/articleFetch';

// Shared between `vite dev` (configureServer) and `vite preview` (configurePreviewServer) so
// PDF fetching works the same way in both — `vite preview` serves the real production build and
// is the closest local approximation to a deployed site, so it must not silently lose the proxy.
function pdfProxyPlugin(): Plugin {
  function registerProxyMiddleware(server: { middlewares: { use: Function } }) {
    server.middlewares.use('/api/pdf-proxy', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const resourceId = urlObj.searchParams.get('resourceId');
          let targetUrl = urlObj.searchParams.get('url');

          if (resourceId) {
            targetUrl = resolveResourceIdToUrl(correctedManifest, resourceId) || targetUrl;
          }

          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing or invalid resourceId / url query parameter');
            return;
          }

          let parsedHost = '';
          try {
            parsedHost = new URL(targetUrl).hostname.toLowerCase();
          } catch {
            res.statusCode = 400;
            res.end('Invalid target URL');
            return;
          }

          if (!isAllowedPdfProxyHost(parsedHost)) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Forbidden: Host '${parsedHost}' is not in the server-side registry allowlist.`);
            return;
          }

          // Handle CORS preflight
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.statusCode = 204;
            res.end();
            return;
          }

          const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'application/pdf,application/octet-stream,*/*',
            },
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Proxy error: Unable to fetch PDF (${response.status} ${response.statusText})`);
            return;
          }

          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
          res.setHeader('Content-Length', buffer.length.toString());
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(buffer);
        } catch (err: unknown) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end(
            `PDF Proxy exception: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        }
      });
  }

  return {
    name: 'pdf-proxy-plugin',
    configureServer: registerProxyMiddleware,
    configurePreviewServer: registerProxyMiddleware,
  };
}

// Local dev/preview equivalent of netlify/functions/news-feed.ts. Fetching RSS/Atom feeds from the
// browser directly would fail for most sources (no CORS headers) and would leak each reader's IP to
// every source on every page view, so this proxies and normalizes them server-side, same as production.
function newsFeedProxyPlugin(): Plugin {
  const VALID_FIELDS: NewsField[] = ['ai', 'data-science', 'data-engineering', 'cybersecurity', 'computer-science'];

  function registerNewsMiddleware(server: { middlewares: { use: Function } }) {
    server.middlewares.use('/api/news-feed', async (req: any, res: any) => {
      try {
        const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const fieldsParam = urlObj.searchParams.get('fields');
        const requestedFields = fieldsParam
          ? fieldsParam.split(',').filter((f): f is NewsField => VALID_FIELDS.includes(f as NewsField))
          : undefined;

        const items = await fetchAllFeeds(requestedFields);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.end(JSON.stringify({ items, fetchedAt: new Date().toISOString() }));
      } catch (err: unknown) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error', items: [] }));
      }
    });
  }

  return {
    name: 'news-feed-proxy-plugin',
    configureServer: registerNewsMiddleware,
    configurePreviewServer: registerNewsMiddleware,
  };
}

// Local dev/preview equivalent of netlify/functions/article-proxy.ts. Reading a news item inside
// the app (rather than sending the learner to a new tab) requires the article's raw HTML, which
// the browser can't fetch directly — almost no news site sends CORS headers. The proxy fetches it
// server-side under SSRF protections (see scripts/articleFetch.ts); Readability extraction and
// sanitization happen client-side in src/services/articleReader.ts.
function articleProxyPlugin(): Plugin {
  function registerArticleMiddleware(server: { middlewares: { use: Function } }) {
    server.middlewares.use('/api/article-proxy', async (req: any, res: any) => {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.statusCode = 204;
        res.end();
        return;
      }
      try {
        const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const targetUrl = urlObj.searchParams.get('url');

        if (!targetUrl) {
          res.statusCode = 400;
          res.end('Missing url query parameter');
          return;
        }

        const { html } = await fetchArticleHtml(targetUrl);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.end(html);
      } catch (err: unknown) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Article Proxy exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    });
  }

  return {
    name: 'article-proxy-plugin',
    configureServer: registerArticleMiddleware,
    configurePreviewServer: registerArticleMiddleware,
  };
}

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Pyodide's wasm module requires this; no script executes from anywhere but our own origin.
  "script-src 'self' 'wasm-unsafe-eval'",
  // motion/tailwind set inline style attributes at runtime; this does not permit inline <script>.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://export.arxiv.org https://raw.githubusercontent.com https://mozilla.github.io https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
  // 'self' + blob: are required for the PDF reader's Simple View iframe (which loads /api/pdf-proxy
  // and, for offline-saved documents, a same-origin blob: URL) — without them the browser silently
  // blocks the iframe whenever the reader falls back from Rich View.
  "frame-src 'self' blob: https://www.youtube-nocookie.com https://docs.google.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// Only applied to the production build's index.html: the dev server injects its own inline
// React-Refresh preamble script, which a same-strictness CSP would block and break HMR.
function cspPlugin(): Plugin {
  return {
    name: 'csp-meta-plugin',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta name="theme-color" content="#101827" />',
        `<meta name="theme-color" content="#101827" />\n    <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      pdfProxyPlugin(),
      newsFeedProxyPlugin(),
      articleProxyPlugin(),
      cspPlugin(),
      VitePWA({
        // public/app.webmanifest + its <link> tag in index.html already exist; don't generate a second one.
        manifest: false,
        registerType: 'autoUpdate',
        injectRegister: false,
        // Service worker is inert during `vite dev` (devOptions.enabled defaults to false) so it never
        // interferes with HMR; it only activates in `vite build` / `vite preview` output.
        workbox: {
          // pdf.worker.min-*.mjs (react-pdf's worker) must be precached: without it, the PDF reader
          // cannot render any document — cached or not — while offline.
          globPatterns: ['**/*.{js,mjs,css,html,ico,png,svg,webmanifest}'],
          globIgnores: ['**/pyodide/**'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: '/index.html',
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              // Pyodide's Python runtime is large and only needed for interactive code labs, so it's
              // cached the first time it's used rather than forced into the initial SW install.
              urlPattern: ({ url }) => url.pathname.startsWith('/pyodide/'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'pyodide-runtime',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replaceAll('\\', '/');
            if (
              normalizedId.includes('/node_modules/pdfjs-dist/') ||
              normalizedId.includes('/node_modules/react-pdf/')
            ) {
              return 'pdf-viewer';
            }
            // The full curriculum (phase modules, degree programs, AI/security/data-eng courses,
            // the glossary, video/resource registries) is reachable synchronously from route
            // resolution (NavigationContext validates the topic/course on every URL change), so it
            // can't be behind a lazy() boundary — but nothing requires it to share a chunk with
            // app-shell code either. Splitting it out keeps the entry chunk cacheable independently
            // of curriculum content edits (which are far more frequent) and lets browsers fetch it
            // in parallel instead of parsing one ~1MB blocking bundle.
            if (normalizedId.includes('/src/data/') || normalizedId.includes('/src/curriculum/')) {
              return 'curriculum-content';
            }
            if (normalizedId.includes('/node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
    server: {
      // File watching can be disabled in constrained development environments.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
