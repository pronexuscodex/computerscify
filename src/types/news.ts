export type NewsField = 'ai' | 'data-science' | 'data-engineering' | 'cybersecurity' | 'computer-science';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  source: string;
  sourceId: string;
  field: NewsField;
}

export interface NewsFeedResponse {
  items: NewsItem[];
  fetchedAt: string;
  error?: string;
}
