export type CyberSafetyClassification =
  | 'defensive'
  | 'educational-lab'
  | 'dual-use'
  | 'restricted'
  | 'prohibited';

export type CyberDataSensitivity = 'synthetic-only' | 'public-training-data' | 'local-lab-data';
export type HumanSupervisionRequirement = 'not-required' | 'recommended' | 'required';

export interface CyberLessonSafetyMetadata {
  legalUseNotice: string;
  ethicalObjective: string;
  defensivePurpose: string;
  requiredEnvironment: string;
  classification: CyberSafetyClassification;
  responsibleDisclosureGuidance: string;
}

export interface CyberLabSafetyMetadata extends CyberLessonSafetyMetadata {
  allowedTargets: string[];
  allowedTools: string[];
  isolationRequirements: string[];
  dataSensitivity: CyberDataSensitivity;
  humanSupervision: HumanSupervisionRequirement;
  resetProcedure: string;
}
