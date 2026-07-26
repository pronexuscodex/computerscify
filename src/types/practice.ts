export type ProblemDifficulty =
  | 'foundation'
  | 'easy'
  | 'developing'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export type ProblemTrack = 'cs' | 'ds' | 'math' | 'systems' | 'ml' | 'engineering';

export type JudgeOutcomeStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Compilation Error'
  | 'Time Limit Exceeded';

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
  isHidden?: boolean;
}

export interface Editorial {
  coreInsight: string;
  bruteForceApproach: string;
  optimalApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonMistakes: string[];
  referenceCodeByLanguage: Partial<Record<'python' | 'javascript' | 'typescript' | 'sql', string>>;
}

export interface PracticeProblem {
  id: string;
  slug: string;
  title: string;
  track: ProblemTrack;
  topics: string[];
  difficulty: ProblemDifficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCodeByLanguage: Partial<Record<'python' | 'javascript' | 'typescript' | 'sql', string>>;
  visibleTests: TestCase[];
  hiddenTests: TestCase[];
  timeLimitMs: number;
  hints: string[];
  editorial: Editorial;
  relatedLessons: string[];
  nextProblems: string[];
  authoringSource: string;
}

export interface SingleTestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
  error?: string;
}

export interface JudgeResult {
  status: JudgeOutcomeStatus;
  passCount: number;
  totalTests: number;
  testResults: SingleTestCaseResult[];
  totalExecutionTimeMs: number;
  errorMessage?: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  category: 'foundations' | 'algorithms' | 'data-science' | 'systems' | 'advanced';
  problemIds: string[];
  prerequisites: string[];
  milestoneMarkers: { problemCount: number; milestoneTitle: string }[];
}

export interface ContestDefinition {
  id: string;
  title: string;
  description: string;
  category: 'sprint' | 'weekly' | 'sql' | 'debugging' | 'ds' | 'mixed';
  durationMinutes: number;
  problemIds: string[];
  rules: string[];
  scoringModel: 'binary' | 'partial-points' | 'penalty-time';
}

export interface ContestAttemptRecord {
  contestId: string;
  timestamp: string;
  durationSpentSeconds: number;
  problemsSolvedCount: number;
  totalScore: number;
  submissions: Record<string, { status: JudgeOutcomeStatus; attempts: number; score: number }>;
}

export interface SpacedReviewCard {
  id: string;
  topicId: string;
  courseTitle: string;
  conceptTitle: string;
  questionPrompt: string;
  answerSummary: string;
  codeExample?: string;
  intervalDays: number;
  nextReviewDate: string; // ISO date string
  lastReviewedDate?: string;
  easeFactor: number; // default 2.5
  reviewCount: number;
}

export interface MistakeJournalEntry {
  id: string;
  problemOrTopicId: string;
  title: string;
  category: 'logic' | 'syntax' | 'edge-case' | 'off-by-one' | 'timeout' | 'conceptual';
  failedApproachNotes: string;
  correctedInsight: string;
  createdAt: string;
  bookmarkedForReview: boolean;
}

export interface ProjectPortfolioEntry {
  id: string;
  title: string;
  courseCode: string;
  problemStatement: string;
  solutionSummary: string;
  technologiesUsed: string[];
  testingEvidence: string;
  reflectionNotes: string;
  completedAt: string;
  codeSnippetOrArtifact?: string;
}
