import type { CyberSafetyClassification } from './cyberSafety';

export type AiSecurityBenchmarkStage =
  | 'vulnerability-discovery'
  | 'vulnerability-reproduction'
  | 'exploitation-evaluation'
  | 'patch-generation'
  | 'multi-host-range';

export interface AiSecurityBenchmark {
  id: 'cybergym' | 'exploitgym' | 'cybergym-e2e' | 'agentcyberrange';
  title: string;
  primarySourceUrl: string;
  publicationYear: number;
  scope: string;
  stages: AiSecurityBenchmarkStage[];
  unitOfEvaluation: string;
  environmentModel: string;
  defensiveValue: string;
  limitations: string[];
  classification: CyberSafetyClassification;
}

export interface AiSecurityResearchBoundary {
  allowedActivities: string[];
  prohibitedActivities: string[];
  requiredControls: string[];
}
