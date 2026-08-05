export type LearningPathLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPathStage {
  id: string;
  title: string;
  order: number;
  requiredCourseIds: string[];
  optionalCourseIds?: string[];
  projectIds?: string[];
  competencyIds?: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  academyId: string;
  level: LearningPathLevel;
  stages: LearningPathStage[];
  careerOutcomes: string[];
  estimatedHours?: number;
}
