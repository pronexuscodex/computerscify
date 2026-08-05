import { Academy } from '../types/academies';
import { Competency } from '../types/competencies';
import { LearningPath, LearningPathLevel } from '../types/learningPaths';

export const COMPETENCIES: Competency[] = [
  { id: 'computational-thinking', title: 'Computational thinking', description: 'Break problems into precise, testable steps.', domain: 'foundations', evidence: ['Working programs', 'Written problem decomposition'] },
  { id: 'programming-fluency', title: 'Programming fluency', description: 'Write, debug, and maintain programs with confidence.', domain: 'software-engineering', evidence: ['Tested code', 'Code review notes'] },
  { id: 'software-design', title: 'Software design', description: 'Design maintainable modules, interfaces, and systems.', domain: 'software-engineering', evidence: ['Architecture decision record', 'System implementation'] },
  { id: 'data-systems', title: 'Data systems', description: 'Model, query, transform, and govern reliable data.', domain: 'data', evidence: ['Data model', 'Validated pipeline'] },
  { id: 'statistical-reasoning', title: 'Statistical reasoning', description: 'Select and interpret statistical methods responsibly.', domain: 'data', evidence: ['Analysis report', 'Reproducible notebook'] },
  { id: 'machine-learning', title: 'Machine learning', description: 'Train, evaluate, and communicate model behavior.', domain: 'ai', evidence: ['Evaluation card', 'Model implementation'] },
  { id: 'production-ml', title: 'Production ML', description: 'Deploy and monitor dependable machine-learning systems.', domain: 'ai', evidence: ['Serving endpoint', 'Monitoring plan'] },
  { id: 'distributed-systems', title: 'Distributed systems', description: 'Reason about networked services, failure, and scale.', domain: 'cloud', evidence: ['Service design', 'Failure analysis'] },
  { id: 'delivery-automation', title: 'Delivery automation', description: 'Build repeatable testing, delivery, and operations workflows.', domain: 'cloud', evidence: ['CI/CD workflow', 'Runbook'] },
  { id: 'defensive-security', title: 'Defensive security', description: 'Identify risk and apply lawful, defensive controls.', domain: 'security', evidence: ['Threat model', 'Defensive lab report'] },
  { id: 'research-literacy', title: 'Research literacy', description: 'Read, reproduce, and critique technical research.', domain: 'research', evidence: ['Paper review', 'Reproduction report'] },
  { id: 'portfolio-communication', title: 'Portfolio communication', description: 'Explain technical decisions and outcomes to others.', domain: 'career', evidence: ['Case study', 'Project presentation'] },
];

type PathDefinition = Omit<LearningPath, 'stages'> & {
  courses: string[][];
  competencies: string[][];
  stageTitles?: string[];
};

const path = ({ courses, competencies, stageTitles, ...definition }: PathDefinition): LearningPath => ({
  ...definition,
  stages: courses.map((requiredCourseIds, index) => ({
    id: `${definition.id}-stage-${index + 1}`,
    title: stageTitles?.[index] ?? ['Foundations', 'Core practice', 'Applied depth'][index] ?? `Stage ${index + 1}`,
    order: index + 1,
    requiredCourseIds,
    competencyIds: competencies[index] ?? [],
  })),
});

const level = (value: LearningPathLevel) => value;

export const LEARNING_PATHS: LearningPath[] = [
  path({ id: 'computer-science-foundations', slug: 'computer-science-foundations', title: 'Computer Science Foundations', description: 'Build first-principles knowledge of programming, algorithms, systems, and theory.', academyId: 'computer-science', level: level('beginner'), estimatedHours: 420, careerOutcomes: ['Strong undergraduate CS foundation', 'Prepared for a technical specialization'], courses: [['cs-101', 'cs-102'], ['math-101', 'cs-201', 'math-201'], ['cs-301', 'cs-303']], competencies: [['computational-thinking', 'programming-fluency'], ['statistical-reasoning'], ['distributed-systems', 'research-literacy']] }),
  path({ id: 'frontend-engineer', slug: 'frontend-engineer', title: 'Frontend Engineer', description: 'Develop robust user-facing software from programming fundamentals through software architecture.', academyId: 'software-engineering', level: level('beginner'), estimatedHours: 220, careerOutcomes: ['Frontend engineer', 'UI engineer'], courses: [['cs-102', 'cs-201'], ['cs-304']], competencies: [['programming-fluency'], ['software-design', 'portfolio-communication']] }),
  path({ id: 'backend-engineer', slug: 'backend-engineer', title: 'Backend Engineer', description: 'Design reliable application services, databases, and networked systems.', academyId: 'software-engineering', level: level('intermediate'), estimatedHours: 320, careerOutcomes: ['Backend engineer', 'Platform engineer'], courses: [['cs-102', 'cs-201', 'ds-202'], ['cs-304', 'cs-302'], ['cs-301']], competencies: [['programming-fluency', 'data-systems'], ['software-design', 'distributed-systems'], ['delivery-automation']] }),
  path({ id: 'full-stack-engineer', slug: 'full-stack-engineer', title: 'Full-Stack Engineer', description: 'Combine product-facing development with service, database, and delivery skills.', academyId: 'software-engineering', level: level('intermediate'), estimatedHours: 360, careerOutcomes: ['Full-stack engineer', 'Product engineer'], courses: [['cs-102', 'cs-201'], ['ds-202', 'cs-304'], ['cs-302']], competencies: [['programming-fluency'], ['software-design', 'data-systems'], ['distributed-systems', 'portfolio-communication']] }),
  path({ id: 'mobile-engineer', slug: 'mobile-engineer', title: 'Mobile Engineer', description: 'Build maintainable application foundations for mobile product development.', academyId: 'software-engineering', level: level('intermediate'), estimatedHours: 240, careerOutcomes: ['Mobile engineer', 'Application engineer'], courses: [['cs-102', 'cs-201'], ['cs-304', 'cs-302']], competencies: [['programming-fluency'], ['software-design', 'distributed-systems']] }),
  path({ id: 'ai-engineer', slug: 'ai-engineer', title: 'AI Engineer', description: 'Progress from responsible AI foundations through deep learning, generative systems, evaluation, safety, and production.', academyId: 'ai-engineering', level: level('intermediate'), estimatedHours: 720, careerOutcomes: ['AI engineer', 'Applied AI engineer'], stageTitles: ['Orientation and code', 'Mathematics and data', 'Machine learning', 'Deep and generative AI', 'Production, evaluation and safety'], courses: [['ai-100', 'cs-102'], ['math-101', 'math-201', 'stat-201', 'ds-101'], ['cs-305'], ['ai-410', 'ds-403', 'ds-405', 'ai-420', 'ai-430'], ['ds-402', 'ai-440', 'cs-403', 'ai-450']], competencies: [['computational-thinking', 'programming-fluency'], ['statistical-reasoning', 'data-systems'], ['machine-learning'], ['machine-learning', 'software-design'], ['production-ml', 'defensive-security', 'portfolio-communication']] }),
  path({ id: 'machine-learning-engineer', slug: 'machine-learning-engineer', title: 'Machine Learning Engineer', description: 'Develop statistical, modeling, deep-learning, evaluation, and production skills for dependable ML systems.', academyId: 'ai-engineering', level: level('advanced'), estimatedHours: 680, careerOutcomes: ['Machine learning engineer', 'Applied scientist'], stageTitles: ['Orientation and programming', 'Mathematics and data', 'Modeling foundations', 'Deep learning and specialization', 'Production and reliability'], courses: [['ai-100', 'cs-102'], ['math-201', 'stat-201', 'ds-101'], ['cs-305', 'ds-304'], ['ai-410', 'ds-403', 'ds-405'], ['ds-402', 'ai-440', 'cs-403', 'ai-450']], competencies: [['programming-fluency'], ['statistical-reasoning', 'data-systems'], ['machine-learning'], ['machine-learning', 'research-literacy'], ['production-ml', 'defensive-security']] }),
  path({ id: 'mlops-engineer', slug: 'mlops-engineer', title: 'MLOps Engineer', description: 'Operationalize models with dependable data, deployment, monitoring, evaluation, governance, and recovery practices.', academyId: 'ai-engineering', level: level('advanced'), estimatedHours: 520, careerOutcomes: ['MLOps engineer', 'ML platform engineer'], stageTitles: ['Programming and data', 'Model lifecycle', 'Platform foundations', 'Production operations', 'Reliability and governance'], courses: [['cs-102', 'ds-202', 'math-201', 'stat-201'], ['cs-305', 'ai-100'], ['cs-304', 'ds-303'], ['ds-402', 'ai-410'], ['ai-440', 'cs-403', 'ai-450']], competencies: [['programming-fluency', 'data-systems'], ['machine-learning'], ['delivery-automation'], ['production-ml'], ['defensive-security', 'portfolio-communication']] }),
  path({ id: 'data-engineer', slug: 'data-engineer', title: 'Data Engineer', description: 'Design databases, transformations, and production data platforms.', academyId: 'data-engineering', level: level('intermediate'), estimatedHours: 340, careerOutcomes: ['Data engineer', 'Analytics engineer'], courses: [['cs-102', 'ds-101'], ['ds-202', 'ds-303'], ['ds-401']], competencies: [['programming-fluency'], ['data-systems', 'delivery-automation'], ['portfolio-communication']] }),
  path({ id: 'cloud-engineer', slug: 'cloud-engineer', title: 'Cloud Engineer', description: 'Build the systems and delivery foundations behind scalable cloud services.', academyId: 'cloud-devops', level: level('intermediate'), estimatedHours: 300, careerOutcomes: ['Cloud engineer', 'Platform engineer'], courses: [['cs-102', 'cs-201'], ['cs-302', 'cs-304'], ['cs-301']], competencies: [['programming-fluency'], ['distributed-systems', 'software-design'], ['delivery-automation']] }),
  path({ id: 'devops-engineer', slug: 'devops-engineer', title: 'DevOps Engineer', description: 'Connect software engineering, networking, and delivery automation.', academyId: 'cloud-devops', level: level('intermediate'), estimatedHours: 300, careerOutcomes: ['DevOps engineer', 'Site reliability engineer'], courses: [['cs-102', 'cs-304'], ['cs-302', 'cs-301'], ['ds-402']], competencies: [['software-design'], ['distributed-systems', 'delivery-automation'], ['production-ml']] }),
  path({ id: 'cybersecurity-defender', slug: 'cybersecurity-defender', title: 'Cybersecurity Defender', description: 'Progress from authorization and hardening through network defense, secure delivery, operations, cloud, memory safety, and incident response.', academyId: 'cybersecurity', level: level('intermediate'), estimatedHours: 620, careerOutcomes: ['Cybersecurity analyst', 'Defensive security engineer'], stageTitles: ['Ethics and systems', 'Network and application defense', 'Secure operations', 'Cloud and systems depth'], courses: [['cs-101', 'cyber-100', 'cs-301'], ['cs-302', 'cyber-210', 'cs-403'], ['cs-304', 'cyber-310', 'cyber-320'], ['cyber-410', 'cyber-420', 'cs-404']], competencies: [['computational-thinking', 'defensive-security'], ['distributed-systems', 'defensive-security'], ['software-design', 'delivery-automation'], ['defensive-security', 'portfolio-communication']] }),
  path({ id: 'security-operations-analyst', slug: 'security-operations-analyst', title: 'Security Operations Analyst', description: 'Develop systems, evidence, detection, triage, forensics, reporting, and recovery skills for defensive operations.', academyId: 'cybersecurity', level: level('intermediate'), estimatedHours: 420, careerOutcomes: ['SOC analyst', 'Incident response analyst'], stageTitles: ['Security foundation', 'Network visibility', 'Detection and response'], courses: [['cs-101', 'cyber-100'], ['cs-301', 'cs-302', 'cyber-210'], ['cyber-320', 'cs-403']], competencies: [['computational-thinking', 'defensive-security'], ['distributed-systems'], ['defensive-security', 'portfolio-communication']] }),
  path({ id: 'application-security-engineer', slug: 'application-security-engineer', title: 'Application Security Engineer', description: 'Apply threat modeling, secure design, defensive testing, supply-chain controls, and memory-safety reasoning to software systems.', academyId: 'cybersecurity', level: level('advanced'), estimatedHours: 480, careerOutcomes: ['Application security engineer', 'Product security engineer'], stageTitles: ['Programming and authorization', 'Web and software defense', 'Systems security'], courses: [['cs-102', 'cs-201', 'cyber-100'], ['cs-304', 'cyber-210', 'cyber-310'], ['cs-403', 'cyber-420']], competencies: [['programming-fluency', 'defensive-security'], ['software-design', 'delivery-automation'], ['defensive-security', 'research-literacy']] }),
  path({ id: 'cloud-security-engineer', slug: 'cloud-security-engineer', title: 'Cloud Security Engineer', description: 'Combine systems, network defense, secure delivery, IAM, monitoring, and incident response for cloud environments.', academyId: 'cybersecurity', level: level('advanced'), estimatedHours: 500, careerOutcomes: ['Cloud security engineer', 'Security platform engineer'], stageTitles: ['Systems and authorization', 'Secure delivery and cloud', 'Detection and governance'], courses: [['cs-301', 'cs-302', 'cyber-100'], ['cs-304', 'cyber-310', 'cyber-410'], ['cyber-320', 'cs-403', 'cs-404']], competencies: [['distributed-systems', 'defensive-security'], ['delivery-automation', 'software-design'], ['defensive-security', 'portfolio-communication']] }),
  path({ id: 'ai-security-engineer', slug: 'ai-security-engineer', title: 'AI Security Engineer', description: 'Combine AI evaluation, systems security, defensive operations, and responsible capability research.', academyId: 'cybersecurity', level: level('advanced'), estimatedHours: 680, careerOutcomes: ['AI security engineer', 'ML security researcher'], stageTitles: ['Programming, mathematics and ethics', 'AI and defensive foundations', 'Evaluation and secure architecture', 'Responsible capability research'], courses: [['cs-102', 'math-201', 'stat-201', 'cyber-100'], ['cs-305', 'ai-100', 'cyber-210', 'cyber-320'], ['ai-440', 'ai-450', 'cyber-420'], ['ai-460', 'cs-404']], competencies: [['programming-fluency', 'statistical-reasoning'], ['machine-learning', 'defensive-security'], ['production-ml', 'defensive-security'], ['research-literacy', 'portfolio-communication']] }),
  path({ id: 'research-engineer', slug: 'research-engineer', title: 'Research Engineer', description: 'Connect mathematical depth, experimental practice, and robust implementation.', academyId: 'research-paper-reading', level: level('advanced'), estimatedHours: 420, careerOutcomes: ['Research engineer', 'Research software engineer'], courses: [['math-201', 'stat-201'], ['cs-303', 'cs-305'], ['ds-304', 'ds-401']], competencies: [['statistical-reasoning'], ['computational-thinking', 'machine-learning'], ['research-literacy', 'portfolio-communication']] }),
  path({ id: 'portfolio-builder', slug: 'portfolio-builder', title: 'Career Portfolio Builder', description: 'Turn completed technical work into clear, evidence-based case studies.', academyId: 'career-portfolio', level: level('beginner'), estimatedHours: 140, careerOutcomes: ['Job-ready technical portfolio', 'Stronger project communication'], courses: [['cs-102', 'cs-201'], ['cs-304'], ['cs-401']], competencies: [['programming-fluency'], ['software-design'], ['portfolio-communication']] }),
];

const academyDefinitions: Array<Omit<Academy, 'learningPathIds' | 'canonicalCourseIds'>> = [
  { id: 'computer-science', slug: 'computer-science', title: 'Computer Science', description: 'First-principles foundations in programming, algorithms, systems, and theory.', icon: 'cpu', colorToken: 'var(--ds-primary)' },
  { id: 'software-engineering', slug: 'software-engineering', title: 'Software Engineering', description: 'Role-focused routes for designing and delivering maintainable software.', icon: 'code', colorToken: 'var(--ds-learning)' },
  { id: 'ai-engineering', slug: 'ai-engineering', title: 'AI Engineering', description: 'Mathematics, machine learning, and production foundations for AI work.', icon: 'brain', colorToken: 'var(--ds-ai)' },
  { id: 'cybersecurity', slug: 'cybersecurity', title: 'Cybersecurity', description: 'Lawful, defensive pathways grounded in systems and security engineering.', icon: 'shield', colorToken: 'var(--ds-security)' },
  { id: 'cloud-devops', slug: 'cloud-devops', title: 'Cloud and DevOps', description: 'Distributed systems, operations, and automated software delivery.', icon: 'cloud', colorToken: 'var(--ds-cloud)' },
  { id: 'data-engineering', slug: 'data-engineering', title: 'Data Engineering', description: 'Reliable databases, transformations, governance, and data platforms.', icon: 'database', colorToken: 'var(--ds-data)' },
  { id: 'research-paper-reading', slug: 'research-paper-reading', title: 'Research and Paper Reading', description: 'Read, reproduce, critique, and communicate technical research.', icon: 'book-open', colorToken: 'var(--ds-research)' },
  { id: 'career-portfolio', slug: 'career-portfolio', title: 'Career and Portfolio', description: 'Translate learning and projects into credible professional evidence.', icon: 'briefcase', colorToken: 'var(--ds-success)' },
];

export const ACADEMIES: Academy[] = academyDefinitions.map((academy) => {
  const academyPaths = LEARNING_PATHS.filter((learningPath) => learningPath.academyId === academy.id);
  return {
    ...academy,
    learningPathIds: academyPaths.map((learningPath) => learningPath.id),
    canonicalCourseIds: [...new Set(academyPaths.flatMap((learningPath) => learningPath.stages.flatMap((stage) => [
      ...stage.requiredCourseIds,
      ...(stage.optionalCourseIds ?? []),
    ])))],
  };
});

export const getAcademyById = (academyId: string): Academy | undefined =>
  ACADEMIES.find((academy) => academy.id === academyId || academy.slug === academyId);

export const getLearningPathById = (learningPathId: string): LearningPath | undefined =>
  LEARNING_PATHS.find((learningPath) => learningPath.id === learningPathId || learningPath.slug === learningPathId);

export const getLearningPathsForAcademy = (academyId: string): LearningPath[] => {
  const academy = getAcademyById(academyId);
  if (!academy) return [];
  return academy.learningPathIds.flatMap((id) => {
    const learningPath = getLearningPathById(id);
    return learningPath ? [learningPath] : [];
  });
};
