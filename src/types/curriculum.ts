import type { CyberLabSafetyMetadata, CyberLessonSafetyMetadata } from './cyberSafety';
import type { PaperProjectForm, PaperReadingWorksheet, ResearchCollection } from './researchLibrary';

export type ProgramType = 'computer-science' | 'data-science';

export type AcademicYear = 1 | 2 | 3 | 4;

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TrackCategory = 'cs' | 'math' | 'ds' | 'systems' | 'engineering' | 'ml' | 'security' | 'theory' | 'ethics';

export type ResourceAccessStatus =
  | 'verified'
  | 'open-access'
  | 'needsVerification'
  | 'official-web-book';

export type ResourceDeliveryMode =
  | 'official-web-resource'
  | 'in-app-pdf-candidate'
  | 'official-web-book'
  | 'official-web-book-with-pdf-download'
  | 'official-web-book-with-free-personal-copy'
  | 'official-web-course'
  | 'official-web-download'
  | 'official-download-page-personal-use';

export type PaperType = 'seminal' | 'survey' | 'applied' | 'theoretical' | 'historical' | 'implementation';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'research';

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doiOrArxiv?: string;
  openAccessUrl: string;
  url?: string;
  canonicalUrl?: string;
  sourcePageUrl?: string;
  paperType: PaperType;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  summary: string;
  whyItMatters: string;
  sectionsToRead: string;
  readingQuestions: string[];
  relatedTopicIds: string[];
  accessStatus: ResourceAccessStatus;
  deliveryMode?: ResourceDeliveryMode;
}

export interface BookResource {
  id: string;
  title: string;
  authors: string[];
  url: string;
  pdfUrl?: string; // Direct or open PDF link
  canonicalUrl?: string;
  sourcePageUrl?: string;
  recommendedChapter: string;
  accessStatus: ResourceAccessStatus;
  publisherOrInstitution?: string;
  deliveryMode?: ResourceDeliveryMode;
}

export interface VideoResource {
  id: string;
  title: string;
  provider: string; // e.g., MIT OCW, Harvard CS50, Stanford, Berkeley
  url: string;
  videoId?: string;
  embedUrl?: string;
  canonicalUrl?: string;
  sourcePageUrl?: string;
  institution?: string;
  embeddingAllowed?: boolean;
  durationMinutes: number;
  accessStatus: ResourceAccessStatus;
  instructor?: string;
  transcriptText?: string;
  chapters?: { timestampSeconds: number; title: string }[];
  fallbackResourceIds?: string[];
  fallbackResources?: VideoResource[];
}

export type LabLevel = 'level-0' | 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5';
export type LabLanguage = 'python' | 'javascript' | 'typescript' | 'c' | 'cpp' | 'sql' | 'html-css' | 'json';
export type LabPracticeMode =
  | 'guided-lesson'
  | 'independent'
  | 'debugging-challenge'
  | 'code-reading'
  | 'refactoring'
  | 'test-writing';

export interface InteractiveLabDefinition {
  id: string;
  title: string;
  type: 'python' | 'sql' | 'math-matrix' | 'algo-viz' | 'js' | 'ts' | 'html-css';
  language?: LabLanguage;
  level?: LabLevel;
  pathId?: string;
  practiceMode?: LabPracticeMode;
  estimatedMinutes?: number;
  instructions: string;
  objective?: string;
  starterCode: string;
  solutionCode?: string;
  solutionHint?: string;
  hints?: string[];
  testCases?: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  safety?: CyberLabSafetyMetadata;
}

export interface WorkedExample {
  id: string;
  title: string;
  problem: string;
  stepByStepSolution: string[];
  finalAnswer: string;
  explanation: string;
}

export interface VisualModel {
  id: string;
  type: 'diagram' | 'tree' | 'graph' | 'matrix' | 'flowchart' | 'state-machine';
  title: string;
  description: string;
  svgOrAsciiRepresentation: string;
}

export interface CodeExample {
  id: string;
  language: LabLanguage;
  title: string;
  code: string;
  explanation: string;
  output?: string;
}

export interface CurriculumConcept {
  id: string;
  topicId: string;
  title: string;
  prerequisites: string[];
  learningObjective: string;
  intuition: string;
  formalDefinition: string;
  whyItMatters: string;
  detailedExplanation: string;
  derivationOrProof?: string;
  workedExamples: WorkedExample[];
  counterExamples?: WorkedExample[];
  visualModels?: VisualModel[];
  codeExamples?: CodeExample[];
  complexityDiscussion?: string;
  commonMistakes: string[];
  misconceptions: string[];
  glossaryTerms: string[];
  practiceQuestions: string[];
  masteryCriteria: string[];
  relatedConceptIds: string[];
  resourceIds: string[];
}

export interface PracticeExercise {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
  type: 'multiple-choice' | 'free-response' | 'code-snippet';
}

export interface RealWorldApplication {
  /** A specific, named system/product/situation — not a generic category. */
  title: string;
  /** 1-3 sentences on how this topic's concept is actually used there. */
  description: string;
}

export interface MasteryPack {
  learningObjective: string;
  prerequisites: string[];
  coreConcepts: string[];
  /**
   * A ground-up, no-jargon explanation of the topic — written so someone with zero background
   * could follow it, using concrete analogies rather than restating the formal definition more
   * simply. Multiple paragraphs, separated by a blank line.
   */
  simpleExplanation?: string;
  /** Concrete, named real-world systems/products/situations where this topic is actually used. */
  realWorldApplications?: RealWorldApplication[];
  primaryLecture?: VideoResource;
  primaryText?: BookResource;
  recommendedChapter: string;
  authoritativeResearchSource?: ResearchPaper;
  modernSurveyOrTutorial?: ResearchPaper;
  practicalExercises: PracticeExercise[];
  interactiveLab?: InteractiveLabDefinition;
  readingQuestions: string[];
  masteryChecklist: string[];
  capstoneMilestone: string;
  estimatedStudyMinutes: number;
  difficulty: DifficultyLevel;
  glossary: { term: string; definition: string }[];
  commonMisconceptions: string[];
  connectionsToLaterModules: string[];
  citation: {
    text: string;
    bibtex?: string;
  };
  accessStatus: ResourceAccessStatus;

  // Plural resource arrays for multi-resource support per topic
  lectureIds?: string[];
  pdfIds?: string[];
  bookIds?: string[];
  foundationalPaperIds?: string[];
  researchPaperIds?: string[];
  labIds?: string[];
  lectures?: VideoResource[];
  pdfBooks?: BookResource[];
  books?: BookResource[];
  foundationalPapers?: ResearchPaper[];
  researchPapers?: ResearchPaper[];
  interactiveLabs?: InteractiveLabDefinition[];
}

export interface Topic {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  summary: string;
  order: number;
  masteryPack: MasteryPack;
  concepts?: CurriculumConcept[];
  cyberSafety?: CyberLessonSafetyMetadata;

  // Resource array identifiers
  lectureIds?: string[];
  pdfIds?: string[];
  bookIds?: string[];
  foundationalPaperIds?: string[];
  researchPaperIds?: string[];
  labIds?: string[];

  // Optional loaded resource arrays
  lectures?: VideoResource[];
  pdfBooks?: BookResource[];
  books?: BookResource[];
  foundationalPapers?: ResearchPaper[];
  researchPapers?: ResearchPaper[];
  interactiveLabs?: InteractiveLabDefinition[];
}

export interface CourseSection {
  id: string;
  title: string;
  summary: string;
  order: number;
  topics: Topic[];
}

export interface CapstoneProjectMilestone {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  expectedDeliverables: string[];
  evaluationRubric: {
    criterion: string;
    weight: string;
    description: string;
  }[];
  starterCodeOrTemplate?: string;
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  type: 'midterm' | 'final' | 'problem-set';
  instructions: string;
  questions: PracticeExercise[];
  passScorePercentage: number;
}

export type ProgramId = 'computer-science' | 'data-science';

export type CourseRole =
  | 'required'
  | 'shared-required'
  | 'elective'
  | 'specialization'
  | 'bridge'
  | 'capstone';

export interface ProgramAssignment {
  programId: ProgramId;
  role: CourseRole;
  year: AcademicYear;
  semester: SemesterNumber;
  displayCode?: string;
  specializationId?: string;
}

export interface CanonicalCourse extends Course {
  academicLevel: AcademicYear;
  programAssignments: ProgramAssignment[];
  topicIds: string[];
  assessmentIds: string[];
  projectIds: string[];
  sharedProgressKey?: string;
}

export interface SpecializationTrack {
  id: string;
  programId: ProgramId;
  title: string;
  description: string;
  category: TrackCategory;
  recommendedCourseIds: string[];
}

export interface Course {
  id: string; // e.g. 'cs-101'
  code: string; // e.g. 'CS 101'
  title: string;
  program: ProgramType;
  year: AcademicYear;
  semester: SemesterNumber;
  creditHours: number;
  estimatedHours: number;
  isRequired: boolean;
  isElective: boolean;
  category: TrackCategory;
  role?: CourseRole;
  programAssignments?: ProgramAssignment[];
  prerequisiteCourseIds: string[]; // e.g. ['cs-101']
  coRequisiteCourseIds?: string[];
  sharedWithCourseId?: string; // Equivalent course code in other program
  displayCodeForProgram?: Record<ProgramType, string>;
  description: string;
  learningOutcomes: string[];
  sections: CourseSection[];
  books: BookResource[];
  papers: ResearchPaper[];
  lectures: VideoResource[];
  labs: InteractiveLabDefinition[];
  midTermAssessment?: AssessmentDefinition;
  finalAssessment?: AssessmentDefinition;
  capstoneProject?: CapstoneProjectMilestone;
}

export interface AcademicSemester {
  semesterNumber: SemesterNumber;
  yearNumber: AcademicYear;
  title: string;
  subtitle: string;
  courses: Course[];
}

export interface AcademicYearGroup {
  yearNumber: AcademicYear;
  title: string;
  semesters: AcademicSemester[];
}

export interface UniversityProgram {
  id: ProgramType;
  name: string;
  shortName: string;
  degreeTitle: string;
  description: string;
  totalCredits: number;
  estimatedTotalHours: number;
  years: AcademicYearGroup[];
  electives: Course[];
}

export interface CurriculumModule {
  id: string;
  phaseId: number;
  title: string;
  slug: string;
  category: TrackCategory;
  summary: string;
  objective: string;
  prerequisiteModuleIds: string[];
  estimatedHours: number;
  difficulty: DifficultyLevel;
  colorAccent: 'yellow' | 'lavender' | 'softblue' | 'coral' | 'mint' | 'offwhite';
  topics: Topic[];
  capstone: CapstoneProjectMilestone;
}

export interface CurriculumPhase {
  phaseNumber: number;
  title: string;
  subtitle: string;
  description: string;
  modules: CurriculumModule[];
}

export interface LearnerProgress {
  completedCourseIds: string[];
  completedTopicIds: string[];
  completedModuleIds: string[];
  bookmarkedResourceIds: string[];
  readPaperIds: string[];
  notes: Record<string, string>; // key: topicId or paperId or courseId, value: note
  researchWorksheets: Record<string, PaperReadingWorksheet>;
  researchCollections: ResearchCollection[];
  researchProjectForms: PaperProjectForm[];
  labCodes: Record<string, string>; // key: labId, value: code string
  capstoneNotes: Record<string, string>; // key: capstoneId, value: notes/submission
  masteryChecklistStatus: Record<string, boolean>; // key: `${topicId}_${criterionIndex}`
  pdfReadingState: Record<string, { lastPage: number; totalPages: number; percentage: number; bookmarkedPages: number[] }>;
  videoPlaybackState: Record<string, { lastPositionSeconds: number; durationSeconds: number; completed: boolean }>;
  assessmentScores: Record<string, number>; // key: assessmentId, value: percentage score
  lastVisitedTopicId?: string;
  lastVisitedCourseId?: string;
  selectedProgram: ProgramType;
  studyStreakDays: number;
  lastActiveDate: string;
  displayName: string;
  preferredTheme: 'light' | 'editorial-dark';
  fontSize: 'normal' | 'large';
  reducedMotion: boolean;
}

export interface GlossaryItem {
  id: string;
  term: string;
  category: TrackCategory;
  definition: string;
  relatedTopicIds: string[];
}
