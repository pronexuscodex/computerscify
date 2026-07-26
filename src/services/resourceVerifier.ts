import { LearningResource, VideoResource, PdfResource, ResourceAccessStatus } from '../types/resources';
import { parseYouTubeResource, isNormalWebPage, fixArxivPdfUrl, fixGitHubPdfUrl } from '../utils/embedUtils';

export interface ResourceVerificationResult {
  resourceId: string;
  title: string;
  type: string;
  status: ResourceAccessStatus;
  embeddable: boolean;
  issues: string[];
  suggestedAction?: string;
  verifiedAt: string;
}

/**
 * Verifies a single learning resource.
 */
export function verifyResource(resource: Partial<LearningResource> & { id: string; title: string }): ResourceVerificationResult {
  const issues: string[] = [];
  let status: ResourceAccessStatus = 'verified';
  let embeddable = true;
  let suggestedAction: string | undefined;

  const resType = resource.type || ('videoId' in resource || 'embedUrl' in resource ? 'video' : 'pdf');

  if (resType === 'video') {
    const rawUrl = (resource as any).url || (resource as any).embedUrl || (resource as any).canonicalUrl || '';
    const { videoId } = parseYouTubeResource(rawUrl);

    if (isNormalWebPage(rawUrl) && !videoId) {
      issues.push(`Resource URL '${rawUrl}' points to an ordinary webpage (e.g. CS50/MIT course page) instead of a video embed ID.`);
      status = 'embedding-blocked';
      embeddable = false;
      suggestedAction = 'Replace webpage URL with verified YouTube videoId (e.g., zOjov-2OZ0E for CS50 Week 0).';
    } else if (!videoId) {
      issues.push(`Invalid or missing videoId for video resource '${resource.title}'.`);
      status = 'requires-replacement';
      embeddable = false;
      suggestedAction = 'Provide valid 11-character YouTube videoId.';
    }
  } else if (resType === 'pdf') {
    const pdfUrl = (resource as any).pdfUrl || (resource as any).url || '';
    const cleaned = fixGitHubPdfUrl(fixArxivPdfUrl(pdfUrl));

    if (isNormalWebPage(cleaned) && !cleaned.endsWith('.pdf')) {
      issues.push(`PDF resource URL '${pdfUrl}' points to an HTML webpage instead of a direct PDF file.`);
      status = 'embedding-blocked';
      embeddable = false;
      suggestedAction = 'Convert to direct open-access PDF link or raw GitHub file.';
    }
  }

  return {
    resourceId: resource.id,
    title: resource.title,
    type: resType,
    status,
    embeddable,
    issues,
    suggestedAction,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Verifies a list of resources.
 */
export function verifyResourceList(resources: any[]): ResourceVerificationResult[] {
  return resources.map(verifyResource);
}
