export type AcademicResourceStatus =
  | 'verified'
  | 'needs-review'
  | 'invalid'
  | 'deprecated'
  | 'replaced'
  | 'archived'
  | 'unverified'
  | 'temporarily-unavailable'
  | 'not-found'
  | 'redirect-broken'
  | 'html-instead-of-pdf'
  | 'cors-blocked'
  | 'reader-incompatible'
  | 'metadata-mismatch'
  | 'paywalled'
  | 'login-required'
  | 'license-unclear'
  | 'replacement-required'
  | 'bibliographic-only';

export type ResourceAccessStatus =
  | 'verified'
  | 'temporarily-unavailable'
  | 'embedding-blocked'
  | 'requires-replacement'
  | 'unverified'
  | AcademicResourceStatus;

export interface AcademicResourceVerification {
  resourceId: string;
  verifiedAt: string;
  status: AcademicResourceStatus;
  verificationMethod: string;
  finalUrl: string;
  statusCode?: number;
  contentType?: string;
  fileSizeBytes?: number;
  checksum?: string;
  pdfSignatureValid?: boolean;
  corsCompatible?: boolean;
  readerCompatible?: boolean;
  firstPageRendered?: boolean;
  middlePageRendered?: boolean;
  finalPageRendered?: boolean;
  metadataVerified?: boolean;
  licenseVerified?: boolean;
  replacementRequired: boolean;
  issues?: Array<{
    code: string;
    severity: 'error' | 'review';
    message: string;
  }>;
  notes?: string;
}

export interface ResearchPaperResource {
  id: string;
  topicIds: string[];
  title: string;
  authors: string[];
  year: number;
  venue: string;
  paperType:
    | 'seminal'
    | 'historical'
    | 'theoretical'
    | 'applied'
    | 'survey'
    | 'review'
    | 'tutorial'
    | 'benchmark'
    | 'systems'
    | 'implementation';
  doi?: string;
  arxivId?: string;
  abstractPageUrl?: string;
  pdfUrl: string;
  openAccess: boolean;
  difficulty:
    | 'introductory'
    | 'intermediate'
    | 'advanced'
    | 'research';
  prerequisites: string[];
  summary: string;
  whyItMatters: string;
  recommendedSections: string[];
  readingQuestions: string[];
  relatedTopicIds: string[];
  accessStatus: AcademicResourceStatus;
  lastVerifiedAt: string;
}

export interface BookResource {
  id: string;
  topicIds: string[];
  title: string;
  authors: string[];
  edition?: string;
  publicationYear?: number;
  publisher?: string;
  isbn?: string;
  license?: string;
  openAccess: boolean;
  canonicalUrl: string;
  pdfUrl?: string;
  chapterAssignments: {
    topicId: string;
    chapterTitle: string;
    chapterNumber?: string;
    pageRange?: string;
  }[];
  difficulty:
    | 'introductory'
    | 'intermediate'
    | 'advanced'
    | 'reference';
  accessStatus: AcademicResourceStatus;
  lastVerifiedAt: string;
}

export type VideoVerificationStatus =
  | 'verified'
  | 'not-found'
  | 'private'
  | 'removed'
  | 'embedding-disabled'
  | 'region-restricted'
  | 'invalid-id'
  | 'wrong-content'
  | 'temporary-error'
  | 'replacement-required'
  | 'unverified';

export interface VerifiedVideoResource {
  id: string;
  title: string;
  institution: string;
  provider: 'youtube' | 'vimeo' | 'native';
  videoId?: string;
  playlistId?: string;
  canonicalUrl: string;
  embedUrl: string;
  expectedChannel: string;
  officialCoursePage?: string;
  learningObjectiveIds: string[];
  status: VideoVerificationStatus;
  lastVerifiedAt: string;
  fallbackResourceIds: string[];
  fallbackResources?: VerifiedVideoResource[];
}

export interface VideoReplacementRecord {
  originalResourceId: string;
  replacementResourceId: string;
  replacementReason:
    | 'removed'
    | 'private'
    | 'embedding-disabled'
    | 'region-restricted'
    | 'outdated'
    | 'wrong-content'
    | 'better-maintained-source';
  objectiveMatch: string[];
  verifiedAt: string;
  verifiedInPlayer: boolean;
}

export interface ResourceBase {
  id: string;
  title: string;
  institution: string;
  authors?: string[];
  sourcePageUrl?: string;
  license?: string;
  accessStatus: ResourceAccessStatus;
  lastVerifiedAt?: string;
  verificationMethod?: string;
  fallbackResourceId?: string;
  replacementReason?: string;
}

export interface VideoResource extends ResourceBase {
  type: 'video';
  provider: 'youtube' | 'vimeo' | 'native';
  videoId: string;
  playlistId?: string;
  embedUrl: string;
  canonicalUrl: string;
  durationSeconds?: number;
  durationMinutes?: number;
  captionsAvailable?: boolean;
  embeddingAllowed: boolean;
  instructor?: string;
  transcriptText?: string;
  chapters?: { timestampSeconds: number; title: string }[];
  fallbackResourceIds?: string[];
  fallbackResources?: VideoResource[];
  url?: string;
}

export interface PdfResource extends ResourceBase {
  type: 'pdf';
  pdfUrl: string;
  canonicalUrl: string;
  contentType: 'application/pdf';
  openAccess: boolean;
  corsCompatible: boolean;
  pdfJsCompatible: boolean;
  expectedFileSizeBytes?: number;
  recommendedChapter?: string;
  publisherOrInstitution?: string;
}

export interface InteractiveResource extends ResourceBase {
  type: 'interactive';
  provider: string;
  embedUrl?: string;
  canonicalUrl: string;
  embeddingAllowed: boolean;
  starterCode?: string;
  instructions?: string;
}

export interface WebReferenceResource extends ResourceBase {
  type: 'web-reference';
  canonicalUrl: string;
  openInNewTab: true;
  embeddable: false;
}

export type LearningResource =
  | VideoResource
  | PdfResource
  | InteractiveResource
  | WebReferenceResource;
