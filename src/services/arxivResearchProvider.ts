import type {
  NormalizedResearchRecord,
  ResearchCache,
  ResearchProvider,
  ResearchProviderClock,
  ResearchProviderResult,
  ResearchSearchQuery,
} from '../types/researchProvider';
import { MemoryResearchCache } from './researchCache';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface ArxivProviderOptions {
  fetcher?: FetchLike;
  cache?: ResearchCache;
  clock?: ResearchProviderClock;
  cacheTtlMs?: number;
  maxAttempts?: number;
  minimumRequestIntervalMs?: number;
  endpoint?: string;
}

const defaultClock: ResearchProviderClock = {
  now: () => Date.now(),
  sleep: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
};

const decodeXml = (value: string) => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const tagValue = (xml: string, tag: string): string | undefined => {
  const escapedTag = tag.replace(':', '\\:');
  const match = xml.match(new RegExp(`<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, 'i'));
  return match ? decodeXml(match[1]) : undefined;
};

const attributeValues = (xml: string, tag: string, attribute: string): string[] => {
  const escapedTag = tag.replace(':', '\\:');
  return [...xml.matchAll(new RegExp(`<${escapedTag}\\b[^>]*\\b${attribute}="([^"]+)"[^>]*/?>`, 'gi'))]
    .map((match) => decodeXml(match[1]));
};

const parseArxivId = (entryId: string) => entryId
  .replace(/^https?:\/\/(?:export\.)?arxiv\.org\/abs\//i, '')
  .replace(/v\d+$/i, '');

export const parseArxivAtom = (xml: string, retrievedAt: string): ResearchProviderResult => {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);
  const records = entries.map((entry): NormalizedResearchRecord => {
    const rawId = tagValue(entry, 'id') ?? '';
    const providerRecordId = parseArxivId(rawId);
    const title = tagValue(entry, 'title') ?? '';
    const authors = [...entry.matchAll(/<author>([\s\S]*?)<\/author>/gi)]
      .map((author) => ({ name: tagValue(author[1], 'name') ?? '' }))
      .filter((author) => author.name.length > 0);
    const links = [...entry.matchAll(/<link\b([^>]*)\/?\s*>/gi)].map((match) => match[1]);
    const linkByRel = (rel: string) => links.find((link) => new RegExp(`rel="${rel}"`, 'i').test(link));
    const href = (attributes?: string) => attributes?.match(/href="([^"]+)"/i)?.[1];
    const canonicalUrl = href(linkByRel('alternate')) ?? `https://arxiv.org/abs/${providerRecordId}`;
    const pdfUrl = href(links.find((link) => /title="pdf"|type="application\/pdf"/i.test(link)));
    const publishedAt = tagValue(entry, 'published') ?? '';
    const updatedAt = tagValue(entry, 'updated') ?? publishedAt;
    const checks: NormalizedResearchRecord['verification']['checks'] = [
      { name: 'provider-id', passed: providerRecordId.length > 0 },
      { name: 'title', passed: title.length > 0 },
      { name: 'authors', passed: authors.length > 0 },
      { name: 'canonical-url', passed: /^https:\/\/arxiv\.org\/abs\//.test(canonicalUrl) },
      { name: 'publication-date', passed: !Number.isNaN(Date.parse(publishedAt)) },
    ];

    return {
      id: `arxiv:${providerRecordId}`,
      provider: 'arxiv',
      providerRecordId,
      title,
      authors,
      abstract: tagValue(entry, 'summary') ?? '',
      publishedAt,
      updatedAt,
      categories: attributeValues(entry, 'category', 'term'),
      primaryCategory: entry.match(/<arxiv:primary_category\b[^>]*term="([^"]+)"/i)?.[1],
      doi: tagValue(entry, 'arxiv:doi'),
      journalReference: tagValue(entry, 'arxiv:journal_ref'),
      canonicalUrl,
      pdfUrl,
      provenance: {
        provider: 'arxiv',
        providerRecordId,
        sourceUrl: rawId || canonicalUrl,
        retrievedAt,
        responseFormat: 'atom',
        schemaVersion: '1.0',
      },
      verification: {
        status: checks.every((check) => check.passed) ? 'provider-metadata' : 'needs-review',
        checks,
        notes: 'Provider metadata is normalized but is not equivalent to manual bibliographic verification.',
      },
    };
  });

  return {
    records,
    totalResults: Number(tagValue(xml, 'opensearch:totalResults') ?? records.length),
    fromCache: false,
    retrievedAt,
  };
};

export class ArxivResearchProvider implements ResearchProvider {
  readonly id = 'arxiv' as const;
  readonly displayName = 'arXiv metadata';
  readonly capabilities = { metadataOnly: true, search: true, lookupById: true } as const;

  private readonly fetcher: FetchLike;
  private readonly cache: ResearchCache;
  private readonly clock: ResearchProviderClock;
  private readonly cacheTtlMs: number;
  private readonly maxAttempts: number;
  private readonly minimumRequestIntervalMs: number;
  private readonly endpoint: string;
  private requestQueue: Promise<void> = Promise.resolve();
  private lastRequestAt = Number.NEGATIVE_INFINITY;

  constructor(options: ArxivProviderOptions = {}) {
    if (!options.fetcher && typeof fetch === 'undefined') {
      throw new Error('ArxivResearchProvider requires a fetch implementation.');
    }
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
    this.cache = options.cache ?? new MemoryResearchCache();
    this.clock = options.clock ?? defaultClock;
    this.cacheTtlMs = options.cacheTtlMs ?? 6 * 60 * 60 * 1000;
    this.maxAttempts = Math.max(1, options.maxAttempts ?? 3);
    this.minimumRequestIntervalMs = Math.max(3000, options.minimumRequestIntervalMs ?? 3000);
    this.endpoint = options.endpoint ?? 'https://export.arxiv.org/api/query';
  }

  async search(query: ResearchSearchQuery): Promise<ResearchProviderResult> {
    const normalizedText = query.text.trim().replace(/\s+/g, ' ');
    if (!normalizedText) throw new Error('Research search text is required.');
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const start = Math.max(0, query.start ?? 0);
    const params = new URLSearchParams({
      search_query: `all:${normalizedText}`,
      start: String(start),
      max_results: String(limit),
      sortBy: query.sortBy ?? 'relevance',
      sortOrder: query.sortOrder ?? 'descending',
    });
    return this.load(`search:${params.toString()}`, params);
  }

  async getById(providerRecordId: string): Promise<NormalizedResearchRecord | undefined> {
    const normalizedId = providerRecordId.trim().replace(/^arxiv:/i, '').replace(/v\d+$/i, '');
    if (!/^(?:\d{4}\.\d{4,5}|[a-z-]+(?:\.[A-Z]{2})?\/\d{7})$/i.test(normalizedId)) {
      throw new Error('Invalid arXiv identifier.');
    }
    const result = await this.load(`id:${normalizedId}`, new URLSearchParams({ id_list: normalizedId }));
    return result.records[0];
  }

  private async load(cacheKey: string, params: URLSearchParams): Promise<ResearchProviderResult> {
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    const result = await this.enqueue(() => this.requestWithRetry(params));
    this.cache.set(cacheKey, result, this.cacheTtlMs);
    return result;
  }

  private async enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const previous = this.requestQueue;
    let release!: () => void;
    this.requestQueue = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    try {
      const remaining = this.minimumRequestIntervalMs - (this.clock.now() - this.lastRequestAt);
      if (remaining > 0) await this.clock.sleep(remaining);
      return await operation();
    } finally {
      release();
    }
  }

  private async requestWithRetry(params: URLSearchParams): Promise<ResearchProviderResult> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      this.lastRequestAt = this.clock.now();
      try {
        const response = await this.fetcher(`${this.endpoint}?${params.toString()}`, {
          method: 'GET',
          headers: { Accept: 'application/atom+xml' },
        });
        if (response.ok) {
          return parseArxivAtom(await response.text(), new Date(this.clock.now()).toISOString());
        }
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === this.maxAttempts) {
          throw new Error(`arXiv metadata request failed with HTTP ${response.status}.`);
        }
        const retryAfterSeconds = Number(response.headers.get('Retry-After'));
        await this.clock.sleep(Number.isFinite(retryAfterSeconds)
          ? Math.max(3000, retryAfterSeconds * 1000)
          : 3000 * (2 ** (attempt - 1)));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt === this.maxAttempts || /HTTP 4\d\d/.test(lastError.message)) throw lastError;
        await this.clock.sleep(3000 * (2 ** (attempt - 1)));
      }
    }
    throw lastError ?? new Error('arXiv metadata request failed.');
  }
}
