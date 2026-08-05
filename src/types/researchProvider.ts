export type ResearchProviderId = 'arxiv';
export type ResearchVerificationStatus =
  | 'provider-metadata'
  | 'needs-review'
  | 'manually-verified'
  | 'rejected';

export interface ResearchAuthor {
  name: string;
}

export interface ResearchProvenance {
  provider: ResearchProviderId;
  providerRecordId: string;
  sourceUrl: string;
  retrievedAt: string;
  responseFormat: 'atom';
  schemaVersion: '1.0';
}

export interface ResearchVerification {
  status: ResearchVerificationStatus;
  checks: Array<{
    name: 'provider-id' | 'title' | 'authors' | 'canonical-url' | 'publication-date';
    passed: boolean;
  }>;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface NormalizedResearchRecord {
  id: string;
  provider: ResearchProviderId;
  providerRecordId: string;
  title: string;
  authors: ResearchAuthor[];
  abstract: string;
  publishedAt: string;
  updatedAt: string;
  categories: string[];
  primaryCategory?: string;
  doi?: string;
  journalReference?: string;
  canonicalUrl: string;
  pdfUrl?: string;
  provenance: ResearchProvenance;
  verification: ResearchVerification;
}

export interface ResearchSearchQuery {
  text: string;
  start?: number;
  limit?: number;
  sortBy?: 'relevance' | 'submittedDate' | 'lastUpdatedDate';
  sortOrder?: 'ascending' | 'descending';
}

export interface ResearchProviderResult {
  records: NormalizedResearchRecord[];
  totalResults?: number;
  fromCache: boolean;
  retrievedAt: string;
}

export interface ResearchProvider {
  readonly id: ResearchProviderId;
  readonly displayName: string;
  readonly capabilities: {
    metadataOnly: true;
    search: boolean;
    lookupById: boolean;
  };
  search(query: ResearchSearchQuery): Promise<ResearchProviderResult>;
  getById(providerRecordId: string): Promise<NormalizedResearchRecord | undefined>;
}

export interface ResearchCache {
  get(key: string): ResearchProviderResult | undefined;
  set(key: string, value: ResearchProviderResult, ttlMs: number): void;
  delete(key: string): void;
}

export interface ResearchProviderClock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}
