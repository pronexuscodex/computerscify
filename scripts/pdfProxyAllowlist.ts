// Single source of truth for which external hosts the PDF proxy is allowed to fetch from.
// Shared between the Vite dev/preview server middleware (vite.config.ts) and the Netlify
// serverless function (netlify/functions/pdf-proxy.ts) that serves the same role in production,
// so the two environments can never drift out of sync with each other.
export const ALLOWED_PDF_PROXY_HOSTS: readonly string[] = [
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
  'www.mlpowered.com',
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
  'nvlpubs.nist.gov',
  'csrc.nist.gov',
  'hai.stanford.edu',
  'ic3.gov',
  'www.ic3.gov',
  'cisecurity.org',
  'www.cisecurity.org',
  'owasp.org',
  'genai.owasp.org',
  'kimballgroup.com',
  'www.kimballgroup.com',
  'docs.cloudera.com',
  'elib.dlr.de',
  'mozilla.github.io',
];

export function isAllowedPdfProxyHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return ALLOWED_PDF_PROXY_HOSTS.some((allowed) => lower === allowed || lower.endsWith('.' + allowed));
}

export interface PdfProxyResourceManifest {
  topics: Array<{
    topicId: string;
    resources: Array<{ id?: string; url: string }>;
  }>;
}

/** Resolves a `resourceId` query param to its manifest URL, matching the Vite dev-server behavior. */
export function resolveResourceIdToUrl(
  manifest: PdfProxyResourceManifest,
  resourceId: string
): string | undefined {
  for (const topic of manifest.topics) {
    for (const resource of topic.resources) {
      if (resource.id === resourceId || resourceId.includes(topic.topicId)) {
        return resource.url;
      }
    }
  }
  return undefined;
}
