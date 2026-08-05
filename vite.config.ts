import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

import correctedManifest from './academic-resource-report.corrected.json';

const ALLOWED_HOSTS = new Set([
  'raw.githubusercontent.com',
  'people.math.harvard.edu',
  'arxiv.org',
  'd2l.ai',
  'ocw.mit.edu',
  'pages.cs.wisc.edu',
  'resources.saylor.org',
  'opendatastructures.org',
  'www.statlearning.com',
  'greenteapress.com',
  'www.cs.virginia.edu',
  'dsf.berkeley.edu',
  'homepages.dcc.ufmg.br',
  'www.seas.upenn.edu',
  'ir.cwi.nl',
  'www.biostat.jhsph.edu',
  'www.exp-platform.com',
  'papers.neurips.cc',
  'research.google.com',
  'web.stanford.edu',
  'www.cs.cmu.edu',
  'jhanley.biostat.mcgill.ca',
  'people.eecs.berkeley.edu',
  'courses.cs.duke.edu',
  'www.cs.utexas.edu',
  'www.stat.cmu.edu',
  'davidcard.berkeley.edu',
  'www.cis.upenn.edu',
  'www.microsoft.com',
  'wstomv.win.tue.nl',
  'textbookequity.org',
  'jeapostrophe.github.io',
  'llvm.org',
  'files.boazbarak.org',
  'www.cs.toronto.edu',
  'crypto.stanford.edu',
  'ee.stanford.edu',
  'www.vldb.org',
  'vldb.org',
  'peerj.com',
  'numpy.org',
  'abseil.io',
  'docs.getdbt.com',
  'szeliski.org',
  'mixtape.scunning.com',
  'info.deeplearning.ai',
  'mlsysbook.ai',
  'otexts.com',
  'danluu.com',
  'rasmuspagh.net',
  'mml-book.github.io',
  'jstatsoft.org',
  'nand2tetris.org',
  'distributed-systems.net',
  'nasa.gov',
]);

function pdfProxyPlugin(): Plugin {
  return {
    name: 'pdf-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/pdf-proxy', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const resourceId = urlObj.searchParams.get('resourceId');
          let targetUrl = urlObj.searchParams.get('url');

          if (resourceId) {
            for (const t of correctedManifest.topics) {
              for (const r of t.resources) {
                if ((r as { id?: string }).id === resourceId || resourceId.includes(t.topicId)) {
                  targetUrl = r.url;
                  break;
                }
              }
            }
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

          const isAllowedHost = Array.from(ALLOWED_HOSTS).some(
            (ah) => parsedHost === ah || parsedHost.endsWith('.' + ah)
          );

          if (!isAllowedHost) {
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
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pdfProxyPlugin()],
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
            if (normalizedId.includes('/src/data/modules/')) {
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
