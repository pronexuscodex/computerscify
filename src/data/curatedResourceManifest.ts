import correctedManifest from '../../academic-resource-report.corrected.json';

export interface CuratedManifestResource {
  id: string;
  topicId: string;
  kind:
    | 'open-course'
    | 'research-paper'
    | 'open-book'
    | 'open-book-chapter'
    | 'academic-notes'
    | 'technical-manual'
    | 'official-guide'
    | 'official-handbook'
    | 'book';
  role: 'primary' | 'foundational' | 'secondary' | 'applied' | 'survey' | 'tutorial' | 'systems';
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  url: string;
  deliveryMode:
    | 'official-web-resource'
    | 'in-app-pdf-candidate'
    | 'official-web-book'
    | 'official-web-book-with-pdf-download'
    | 'official-web-book-with-free-personal-copy'
    | 'official-web-course'
    | 'official-web-download'
    | 'official-download-page-personal-use';
  openAccess: boolean;
  verificationStatus:
    | 'web-pdf-confirmed'
    | 'web-confirmed'
    | 'web-confirmed-large-pdf'
    | 'runtime-link-check-required'
    | 'production-verified';
}

export interface CuratedTopicManifest {
  topicId: string;
  topicTitle: string;
  resources: CuratedManifestResource[];
}

// Allowed external domains for proxy & CORS checks
export const ALLOWED_RESOURCE_HOSTS = [
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
  'distributed-systems.net'
];

function buildCuratedMap(): Map<string, CuratedTopicManifest> {
  const map = new Map<string, CuratedTopicManifest>();

  for (const rawTopic of correctedManifest.topics) {
    const topicId = rawTopic.topicId;
    const resources: CuratedManifestResource[] = rawTopic.resources.map((res: any, idx: number) => {
      const isPdfCandidate = res.deliveryMode === 'in-app-pdf-candidate';
      const id = `${res.kind === 'research-paper' ? 'paper' : 'book'}-${topicId}-${idx + 1}`;
      return {
        id,
        topicId,
        kind: res.kind,
        role: res.role,
        title: res.title,
        authors: res.authors,
        year: res.year,
        venue: res.venue,
        url: res.url,
        deliveryMode: res.deliveryMode,
        openAccess: res.openAccess,
        verificationStatus: res.verificationStatus as any,
      };
    });

    map.set(topicId, {
      topicId,
      topicTitle: rawTopic.topicTitle,
      resources,
    });
  }

  return map;
}

export const CURATED_RESOURCE_MAP = buildCuratedMap();

export function getCuratedResourcesForTopic(topicId: string): CuratedManifestResource[] {
  const manifest = CURATED_RESOURCE_MAP.get(topicId);
  return manifest ? manifest.resources : [];
}

export function getCuratedResourceById(resourceId: string): CuratedManifestResource | undefined {
  for (const manifest of CURATED_RESOURCE_MAP.values()) {
    const found = manifest.resources.find((r) => r.id === resourceId);
    if (found) return found;
  }
  return undefined;
}
