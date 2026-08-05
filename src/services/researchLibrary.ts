import type { ResearchPaper } from '../types/curriculum';
import type {
  ResearchPublicationStatus,
  ResearchSafetyLabel,
} from '../types/researchLibrary';

export const getResearchPublicationStatus = (
  paper: ResearchPaper
): ResearchPublicationStatus => {
  const source = `${paper.venue} ${paper.doiOrArxiv ?? ''} ${paper.canonicalUrl ?? ''} ${paper.openAccessUrl}`.toLowerCase();
  if (/arxiv|preprint/.test(source) && !/published at|proceedings|journal|conference|neurips|icml|iclr|acm|ieee/.test(source)) {
    return 'preprint';
  }
  if (paper.venue.trim() && !/unknown|unverified|n\/a/i.test(paper.venue)) return 'published';
  return 'status-unknown';
};

export const getResearchSafetyLabel = (paper: ResearchPaper): ResearchSafetyLabel => {
  const metadata = `${paper.title} ${paper.summary} ${paper.whyItMatters}`.toLowerCase();
  return /cyber|security vulnerab|exploit|malware|attack capability|penetration test/.test(metadata)
    ? 'dual-use-security'
    : 'general-research';
};

export const matchesResearchMetadata = (paper: ResearchPaper, rawQuery: string): boolean => {
  const query = rawQuery.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!query) return true;
  const searchableMetadata = [
    paper.title,
    paper.authors.join(' '),
    paper.venue,
    paper.summary,
    paper.whyItMatters,
    paper.sectionsToRead,
    paper.prerequisites.join(' '),
    paper.readingQuestions.join(' '),
    paper.doiOrArxiv ?? '',
  ].join(' ').toLowerCase();
  return query.split(' ').every((term) => searchableMetadata.includes(term));
};
