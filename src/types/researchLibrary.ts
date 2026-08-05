export type ResearchPublicationStatus = 'preprint' | 'published' | 'status-unknown';
export type ResearchSafetyLabel = 'general-research' | 'dual-use-security';

export interface PaperReadingWorksheet {
  paperId: string;
  researchQuestion: string;
  centralClaim: string;
  methodsAndEvidence: string;
  limitations: string;
  openQuestions: string;
  completedByLearner: boolean;
  updatedAt: string;
}

export interface ResearchCollection {
  id: string;
  title: string;
  paperIds: string[];
  createdAt: string;
}

export interface PaperProjectForm {
  id: string;
  paperId: string;
  title: string;
  objective: string;
  proposedMethod: string;
  expectedDeliverables: string;
  ethicsAndSafety: string;
  learnerConfirmedManualWork: boolean;
  updatedAt: string;
}
