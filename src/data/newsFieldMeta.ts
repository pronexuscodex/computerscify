import { NewsField } from '../types/news';

// Client-side display metadata only — the actual feed source list/URLs stay server-side
// (scripts/newsFeedSources.ts), fetched through /api/news-feed.
export const NEWS_FIELDS: { id: NewsField; label: string }[] = [
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'data-engineering', label: 'Data Engineering' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'computer-science', label: 'Computer Science' },
];

export function labelForField(field: NewsField): string {
  return NEWS_FIELDS.find((f) => f.id === field)?.label ?? field;
}
