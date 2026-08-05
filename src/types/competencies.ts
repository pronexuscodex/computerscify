export type CompetencyDomain =
  | 'foundations'
  | 'software-engineering'
  | 'data'
  | 'ai'
  | 'cloud'
  | 'security'
  | 'research'
  | 'career';

export interface Competency {
  id: string;
  title: string;
  description: string;
  domain: CompetencyDomain;
  evidence: string[];
}
