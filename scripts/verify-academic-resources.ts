import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_TOPICS } from '../src/data/curriculumData';
import {
  CURATED_RESOURCE_MAP,
  CuratedManifestResource,
  CuratedTopicManifest,
} from '../src/data/curatedResourceManifest';
import {
  AcademicResourceStatus,
  AcademicResourceVerification,
} from '../src/types/resources';

export interface ResourceIntegrityIssue {
  code: string;
  severity: 'error' | 'review';
  message: string;
}

export interface ResourceIntegrityRecord extends AcademicResourceVerification {
  topicId: string;
  topicTitle: string;
  title: string;
  authors: string[];
  declaredVerificationStatus: CuratedManifestResource['verificationStatus'];
}

export interface ResourceIntegrityAudit {
  timestamp: string;
  summary: {
    totalTopics: number;
    totalResourcesAudited: number;
    verifiedResources: number;
    needsReviewResources: number;
    invalidResources: number;
    duplicateUrls: number;
    conflictingDuplicateUrls: number;
    productionVerified: false;
  };
  inventory: ResourceIntegrityRecord[];
}

const normalizeText = (value: string) => value.trim().toLocaleLowerCase();

function parseHttpUrl(value: string): URL | undefined {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function meaningfulTitleTokens(title: string): Set<string> {
  return new Set(
    normalizeText(title)
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((token) => token.length > 2 && !['and', 'the', 'for', 'with'].includes(token))
  );
}

function metadataIsCompatible(
  left: CuratedManifestResource,
  right: CuratedManifestResource
): boolean {
  const leftAuthors = new Set(left.authors.map(normalizeText));
  const sharesAuthor = right.authors.some((author) => leftAuthors.has(normalizeText(author)));
  const leftTitleTokens = meaningfulTitleTokens(left.title);
  const sharedTitleTokens = [...meaningfulTitleTokens(right.title)].filter((token) =>
    leftTitleTokens.has(token)
  );

  return sharesAuthor && sharedTitleTokens.length >= 2;
}

function createRecord(
  topic: CuratedTopicManifest,
  resource: CuratedManifestResource,
  verifiedAt: string
): ResourceIntegrityRecord {
  const issues: ResourceIntegrityIssue[] = [];
  const parsedUrl = parseHttpUrl(resource.url);

  if (!resource.title.trim()) {
    issues.push({ code: 'missing-title', severity: 'error', message: 'Title is required.' });
  }
  if (!Array.isArray(resource.authors) || resource.authors.length === 0 || resource.authors.some((author) => !author.trim())) {
    issues.push({ code: 'missing-authors', severity: 'error', message: 'At least one named author or institution is required.' });
  }
  if (!parsedUrl) {
    issues.push({ code: 'invalid-url', severity: 'error', message: 'Resource URL must be a valid HTTP(S) URL.' });
  } else if (parsedUrl.protocol !== 'https:') {
    issues.push({ code: 'insecure-url', severity: 'review', message: 'Resource uses HTTP and should be reviewed for an HTTPS canonical URL.' });
  }

  if (resource.kind === 'research-paper') {
    if (!resource.year || resource.year < 1600 || resource.year > new Date().getFullYear() + 1) {
      issues.push({ code: 'missing-or-invalid-year', severity: 'error', message: 'Research papers require a plausible publication year.' });
    }
    if (!resource.venue?.trim()) {
      issues.push({ code: 'missing-venue', severity: 'error', message: 'Research papers require venue or publisher metadata.' });
    }
    issues.push({
      code: 'identifier-review-required',
      severity: 'review',
      message: 'DOI or arXiv provenance is not represented by the current manifest schema.',
    });
  }

  issues.push({
    code: 'license-review-required',
    severity: 'review',
    message: 'Open-access intent is recorded, but a license identifier or evidence URL is not.',
  });
  issues.push({
    code: 'runtime-evidence-required',
    severity: 'review',
    message: 'Final URL, response metadata, fingerprint, and rendered-file checks require external verification evidence.',
  });

  const status: AcademicResourceStatus = issues.some((issue) => issue.severity === 'error')
    ? 'invalid'
    : 'needs-review';

  return {
    resourceId: resource.id,
    topicId: topic.topicId,
    topicTitle: topic.topicTitle,
    title: resource.title,
    authors: resource.authors,
    declaredVerificationStatus: resource.verificationStatus,
    verifiedAt,
    status,
    verificationMethod: 'deterministic-manifest-integrity-audit',
    finalUrl: resource.url,
    metadataVerified: !issues.some((issue) => issue.severity === 'error'),
    licenseVerified: false,
    replacementRequired: status === 'invalid',
    issues,
    notes:
      'This audit validates stored metadata and duplicate relationships only; it does not perform or simulate network, file, fingerprint, or rendering verification.',
  };
}

export function auditResourceManifest(
  topics: Iterable<CuratedTopicManifest>,
  verifiedAt = new Date().toISOString()
): ResourceIntegrityAudit {
  const topicList = Array.from(topics);
  const inventory = topicList.flatMap((topic) =>
    topic.resources.map((resource) => createRecord(topic, resource, verifiedAt))
  );
  const resourcesById = new Map<string, ResourceIntegrityRecord[]>();
  const resourcesByUrl = new Map<string, ResourceIntegrityRecord[]>();
  const sourceById = new Map<string, CuratedManifestResource>();

  for (const topic of topicList) {
    for (const resource of topic.resources) {
      sourceById.set(resource.id, resource);
    }
  }

  for (const record of inventory) {
    const idGroup = resourcesById.get(record.resourceId) ?? [];
    idGroup.push(record);
    resourcesById.set(record.resourceId, idGroup);

    const parsedUrl = parseHttpUrl(record.finalUrl);
    if (parsedUrl) {
      parsedUrl.hash = '';
      const urlKey = parsedUrl.toString();
      const urlGroup = resourcesByUrl.get(urlKey) ?? [];
      urlGroup.push(record);
      resourcesByUrl.set(urlKey, urlGroup);
    }
  }

  for (const group of resourcesById.values()) {
    if (group.length < 2) continue;
    for (const record of group) {
      record.issues?.push({
        code: 'duplicate-resource-id',
        severity: 'error',
        message: `Resource ID is used ${group.length} times.`,
      });
      record.status = 'invalid';
      record.replacementRequired = true;
    }
  }

  let duplicateUrls = 0;
  let conflictingDuplicateUrls = 0;
  for (const group of resourcesByUrl.values()) {
    if (group.length < 2) continue;
    duplicateUrls++;
    const sources = group
      .map((record) => sourceById.get(record.resourceId))
      .filter((resource): resource is CuratedManifestResource => Boolean(resource));
    const conflicts = sources.some((source, index) =>
      sources.slice(index + 1).some((other) => !metadataIsCompatible(source, other))
    );
    if (conflicts) conflictingDuplicateUrls++;

    for (const record of group) {
      record.issues?.push({
        code: conflicts ? 'conflicting-duplicate-url' : 'duplicate-url',
        severity: conflicts ? 'error' : 'review',
        message: conflicts
          ? `The same URL is assigned to ${group.length} resources with conflicting bibliographic metadata.`
          : `The same URL is assigned to ${group.length} resource records and should be consolidated or explicitly justified.`,
      });
      if (conflicts) {
        record.status = 'invalid';
        record.replacementRequired = true;
      }
    }
  }

  const countStatus = (status: AcademicResourceStatus) =>
    inventory.filter((record) => record.status === status).length;

  return {
    timestamp: verifiedAt,
    summary: {
      totalTopics: topicList.length,
      totalResourcesAudited: inventory.length,
      verifiedResources: countStatus('verified'),
      needsReviewResources: countStatus('needs-review'),
      invalidResources: countStatus('invalid'),
      duplicateUrls,
      conflictingDuplicateUrls,
      productionVerified: false,
    },
    inventory,
  };
}

async function runAcademicVerification() {
  const args = process.argv.slice(2);
  const writeReport = args.includes('--report');
  const audit = auditResourceManifest(CURATED_RESOURCE_MAP.values());

  console.log('================================================================');
  console.log('  COMPUTERSCIFY - ACADEMIC RESOURCE INTEGRITY AUDIT');
  console.log('================================================================\n');
  console.log(`Published topics in curriculum : ${ALL_TOPICS.length}`);
  console.log(`Manifest topics audited        : ${audit.summary.totalTopics}`);
  console.log(`Resources audited              : ${audit.summary.totalResourcesAudited}`);
  console.log(`Verified with full evidence    : ${audit.summary.verifiedResources}`);
  console.log(`Needs external review          : ${audit.summary.needsReviewResources}`);
  console.log(`Invalid records                : ${audit.summary.invalidResources}`);
  console.log(`Duplicate URLs                 : ${audit.summary.duplicateUrls}`);
  console.log(`Conflicting duplicate URLs     : ${audit.summary.conflictingDuplicateUrls}\n`);

  if (writeReport) {
    const reportPath = path.join(process.cwd(), 'academic-resource-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2), 'utf8');
    console.log(`Audit report saved to: ${reportPath}\n`);
  }

  if (audit.summary.invalidResources > 0) {
    console.error(
      `RESOURCE INTEGRITY FAILURE: ${audit.summary.invalidResources} record(s) contain invalid or conflicting metadata.`
    );
    process.exitCode = writeReport ? 0 : 1;
    return;
  }

  console.log(
    'Manifest integrity passed. Resources remain Needs review until external provenance, license, final URL, fingerprint, and rendering evidence is recorded.'
  );
}

const cliEntry = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (cliEntry === fileURLToPath(import.meta.url)) {
  runAcademicVerification().catch((error) => {
    console.error('Academic resource integrity audit failed:', error);
    process.exit(1);
  });
}
