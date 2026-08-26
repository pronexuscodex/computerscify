import { CanonicalCourse, ProgramId, SpecializationTrack, Course } from '../types/curriculum';
import { COMPUTER_SCIENCE_COURSES } from './programs/computerScience';
import { DATA_SCIENCE_COURSES } from './programs/dataScience';
import { AI_ENGINEERING_COURSES } from './aiEngineeringCourses';
import { CYBERSECURITY_COURSES } from './cybersecurityCourses';
import { DATA_ENGINEERING_COURSES } from './dataEngineeringCourses';

/**
 * SPECIALIZATION TRACKS
 */
export const SPECIALIZATION_TRACKS: SpecializationTrack[] = [
  // Computer Science Tracks
  {
    id: 'cs-systems',
    programId: 'computer-science',
    title: 'Systems & Distributed Computing',
    description: 'Deep dive into operating system kernels, distributed consensus (Raft), network protocol stacks, and high-performance concurrency.',
    category: 'systems',
    recommendedCourseIds: ['cs-301', 'cs-302', 'cs-303'],
  },
  {
    id: 'cs-software-eng',
    programId: 'computer-science',
    title: 'Software Engineering & Architecture',
    description: 'Design patterns, modular software design, testing frameworks, CI/CD pipelines, and enterprise system architecture.',
    category: 'engineering',
    recommendedCourseIds: ['cs-304', 'ds-202'],
  },
  {
    id: 'cs-ai',
    programId: 'computer-science',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Foundational AI, deep neural networks, transformer models, optimization algorithms, and statistical machine learning.',
    category: 'ml',
    recommendedCourseIds: ['cs-305', 'stat-201'],
  },
  {
    id: 'cs-security',
    programId: 'computer-science',
    title: 'Cybersecurity & Cryptography',
    description: 'Public-key cryptography, zero-knowledge proofs, system vulnerability mitigation, network security protocols, and privacy.',
    category: 'security',
    recommendedCourseIds: ['cs-403', 'cs-404'],
  },
  {
    id: 'cs-theory',
    programId: 'computer-science',
    title: 'Theoretical Computer Science',
    description: 'Automata theory, formal language grammars, NP-completeness reductions, computability, and algorithmic complexity limits.',
    category: 'theory',
    recommendedCourseIds: ['cs-402', 'cs-303'],
  },

  // Data Science Tracks
  {
    id: 'ds-ml',
    programId: 'data-science',
    title: 'Machine Learning & Deep Learning',
    description: 'Supervised learning models, ensemble methods, deep neural networks, transformer architectures, and hyperparameter tuning.',
    category: 'ml',
    recommendedCourseIds: ['cs-305', 'ds-402'],
  },
  {
    id: 'ds-data-eng',
    programId: 'data-science',
    title: 'Data Engineering & Analytics Infrastructure',
    description: 'Columnar warehouses, dbt analytics engineering, ETL pipeline orchestration, streaming data architectures, and SQL analytics.',
    category: 'ds',
    recommendedCourseIds: ['ds-202', 'ds-303'],
  },
  {
    id: 'ds-statistical-science',
    programId: 'data-science',
    title: 'Statistical Science & Inference',
    description: 'Rigorous probability theory, maximum likelihood estimation, Bayesian inference, hypothesis testing, and time series.',
    category: 'math',
    recommendedCourseIds: ['stat-201', 'ds-304'],
  },
  {
    id: 'ds-causal-analytics',
    programId: 'data-science',
    title: 'Applied Econometrics & Causal Inference',
    description: 'Potential outcomes framework, instrument variables, difference-in-differences, propensity score matching, and A/B testing.',
    category: 'ds',
    recommendedCourseIds: ['ds-302'],
  },
  {
    id: 'ds-nlp',
    programId: 'data-science',
    title: 'Natural Language Processing & LLMs',
    description: 'Text vectorization, tokenization, sequence-to-sequence models, fine-tuning large language models, and retrieval-augmented generation.',
    category: 'ml',
    recommendedCourseIds: ['ds-403'],
  },
  {
    id: 'ds-vision',
    programId: 'data-science',
    title: 'Computer Vision & Spatial Analytics',
    description: 'Convolutional networks, object detection, image segmentation, geospatial analysis, and spatial statistics.',
    category: 'ml',
    recommendedCourseIds: ['ds-405'],
  },
];

/**
 * CANONICAL COURSE REGISTRY
 * Each course has ONE canonical ID and explicit program assignments.
 */
function buildCanonicalRegistry(): CanonicalCourse[] {
  // Map of course id -> Course object
  const csMap = new Map(COMPUTER_SCIENCE_COURSES.map(c => [c.id, c]));
  const dsMap = new Map(DATA_SCIENCE_COURSES.map(c => [c.id, c]));
  const aiMap = new Map(AI_ENGINEERING_COURSES.map(c => [c.id, c]));
  const cyberMap = new Map(CYBERSECURITY_COURSES.map(c => [c.id, c]));
  const deMap = new Map(DATA_ENGINEERING_COURSES.map(c => [c.id, c]));

  // Helper to extract topics, assessments, projects IDs
  const extractAuxiliaryIds = (course: Course) => {
    const topicIds: string[] = [];
    const assessmentIds: string[] = [];
    const projectIds: string[] = [];

    course.sections.forEach(s => {
      s.topics.forEach(t => topicIds.push(t.id));
    });

    if (course.midTermAssessment) assessmentIds.push(course.midTermAssessment.id);
    if (course.finalAssessment) assessmentIds.push(course.finalAssessment.id);
    if (course.capstoneProject) projectIds.push(course.capstoneProject.id);

    return { topicIds, assessmentIds, projectIds };
  };

  const registry: CanonicalCourse[] = [
    // 1. CS 101 - Intro CS
    {
      ...csMap.get('cs-101')!,
      id: 'cs-101',
      academicLevel: 1,
      sharedProgressKey: 'canonical-cs-101',
      programAssignments: [
        { programId: 'computer-science', role: 'required', year: 1, semester: 1, displayCode: 'CS 101' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-101')!),
    },

    // 2. Python Programming (Shared: CS 102 / DS 102)
    {
      ...csMap.get('cs-102')!,
      id: 'cs-102',
      academicLevel: 1,
      sharedProgressKey: 'shared-python-programming',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 1, semester: 1, displayCode: 'CS 102' },
        { programId: 'data-science', role: 'shared-required', year: 1, semester: 1, displayCode: 'DS 102' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-102')!),
    },

    // 3. Calculus (Shared: MATH 101)
    {
      ...csMap.get('math-101')!,
      id: 'math-101',
      academicLevel: 1,
      sharedProgressKey: 'shared-calculus',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 1, semester: 1, displayCode: 'MATH 101' },
        { programId: 'data-science', role: 'shared-required', year: 1, semester: 1, displayCode: 'MATH 101' },
      ],
      ...extractAuxiliaryIds(csMap.get('math-101')!),
    },

    // 4. DS 101 - Exploratory Data Science
    {
      ...dsMap.get('ds-101')!,
      id: 'ds-101',
      academicLevel: 1,
      sharedProgressKey: 'canonical-ds-101',
      programAssignments: [
        { programId: 'data-science', role: 'required', year: 1, semester: 1, displayCode: 'DS 101' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-101')!),
    },

    // 5. Data Structures (Shared: CS 201 / DS 201)
    {
      ...csMap.get('cs-201')!,
      id: 'cs-201',
      academicLevel: 1,
      sharedProgressKey: 'shared-data-structures',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 1, semester: 2, displayCode: 'CS 201' },
        { programId: 'data-science', role: 'shared-required', year: 1, semester: 2, displayCode: 'DS 201' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-201')!),
    },

    // 6. Linear Algebra (Shared: MATH 201)
    {
      ...csMap.get('math-201')!,
      id: 'math-201',
      academicLevel: 2,
      sharedProgressKey: 'shared-linear-algebra',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 2, semester: 3, displayCode: 'MATH 201' },
        { programId: 'data-science', role: 'shared-required', year: 2, semester: 3, displayCode: 'MATH 201' },
      ],
      ...extractAuxiliaryIds(csMap.get('math-201')!),
    },

    // 7. STAT 201 - Probability & Statistics
    {
      ...dsMap.get('stat-201')!,
      id: 'stat-201',
      academicLevel: 2,
      sharedProgressKey: 'canonical-stat-201',
      programAssignments: [
        { programId: 'data-science', role: 'required', year: 2, semester: 3, displayCode: 'STAT 201' },
        { programId: 'computer-science', role: 'elective', year: 2, semester: 3, displayCode: 'STAT 201', specializationId: 'cs-ai' },
      ],
      ...extractAuxiliaryIds(dsMap.get('stat-201')!),
    },

    // 8. CS 204 - Computer Architecture & Assembly
    {
      ...csMap.get('cs-204')!,
      id: 'cs-204',
      academicLevel: 2,
      sharedProgressKey: 'canonical-cs-204',
      programAssignments: [
        { programId: 'computer-science', role: 'required', year: 2, semester: 4, displayCode: 'CS 204' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-204')!),
    },

    // 9. Relational Databases & SQL (Shared: DS 202 / CS 205)
    {
      ...dsMap.get('ds-202')!,
      id: 'ds-202',
      academicLevel: 2,
      sharedProgressKey: 'shared-databases-sql',
      programAssignments: [
        { programId: 'data-science', role: 'shared-required', year: 2, semester: 4, displayCode: 'DS 202' },
        { programId: 'computer-science', role: 'shared-required', year: 2, semester: 4, displayCode: 'CS 205' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-202')!),
    },

    // 10. CS 301 - Operating Systems
    {
      ...csMap.get('cs-301')!,
      id: 'cs-301',
      academicLevel: 3,
      sharedProgressKey: 'canonical-cs-301',
      programAssignments: [
        { programId: 'computer-science', role: 'required', year: 3, semester: 5, displayCode: 'CS 301' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-301')!),
    },

    // 11. DS 302 - Causal Inference & Econometrics
    {
      ...dsMap.get('ds-302')!,
      id: 'ds-302',
      academicLevel: 3,
      sharedProgressKey: 'canonical-ds-302',
      programAssignments: [
        { programId: 'data-science', role: 'required', year: 3, semester: 5, displayCode: 'DS 302' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-302')!),
    },

    // 12. Machine Learning Foundations (Shared: CS 305 / DS 305)
    {
      ...csMap.get('cs-305')!,
      id: 'cs-305',
      academicLevel: 3,
      sharedProgressKey: 'shared-machine-learning',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 3, semester: 6, displayCode: 'CS 305' },
        { programId: 'data-science', role: 'shared-required', year: 3, semester: 6, displayCode: 'DS 305' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-305')!),
    },

    // 13. Tech Ethics & Governance (Shared: CS 404 / DS 404)
    {
      ...csMap.get('cs-404')!,
      id: 'cs-404',
      academicLevel: 4,
      sharedProgressKey: 'shared-tech-ethics',
      programAssignments: [
        { programId: 'computer-science', role: 'shared-required', year: 4, semester: 7, displayCode: 'CS 404' },
        { programId: 'data-science', role: 'shared-required', year: 4, semester: 7, displayCode: 'DS 404' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-404')!),
    },

    // 14. CS Senior Capstone
    {
      ...csMap.get('cs-101')!, // Use full structure template
      id: 'cs-401',
      code: 'CS 401',
      title: 'Senior Computer Science Capstone Project',
      description: 'Design, implement, and defend a comprehensive software system, kernel module, or distributed protocol.',
      academicLevel: 4,
      creditHours: 4,
      estimatedHours: 60,
      isRequired: true,
      isElective: false,
      category: 'cs',
      prerequisiteCourseIds: ['cs-301', 'cs-305'],
      sharedProgressKey: 'canonical-cs-401',
      programAssignments: [
        { programId: 'computer-science', role: 'capstone', year: 4, semester: 8, displayCode: 'CS 401' },
      ],
      learningOutcomes: [
        'Architect an end-to-end software system from first principles',
        'Present and defend technical design choices before peer review',
        'Deploy production-ready code with complete test coverage',
      ],
      sections: [
        {
          id: 'cs401-s1',
          title: 'Section 1: Capstone Project Architecture & Defense',
          summary: 'Milestone execution, code reviews, and final technical defense.',
          order: 1,
          topics: [
            {
              id: 'cs401-t1',
              moduleId: 'cs-401',
              title: 'Capstone Proposal & System Specification',
              slug: 'cs-capstone-spec',
              summary: 'Define project requirements, architectural diagrams, and milestones.',
              order: 1,
              masteryPack: {
                learningObjective: 'Write a design document precise enough that a reviewer who has never seen the project can identify its scope, architecture, and risks without asking you to explain it out loud.',
                prerequisites: ['CS 301 Systems Programming', 'CS 305 Machine Learning'],
                coreConcepts: [
                  'Problem statement: a concrete description of what is broken or missing today and for whom, stated before any solution — a capstone proposal that jumps straight to "I will build X" without this is unreviewable, since a reader cannot judge whether X is the right thing to build.',
                  'Scope and non-goals: an explicit list of what the project will NOT attempt, written alongside what it will; without stated non-goals, scope creep is invisible until it has already happened, and reviewers cannot tell an intentional simplification from an oversight.',
                  'Architecture diagram: a visual decomposition of the system into its major components and the data/control flow between them, forcing decisions about boundaries and interfaces to be made explicit before code is written rather than discovered by accident during implementation.',
                  'Milestone sequencing: breaking a capstone into demonstrable, independently-verifiable checkpoints (not just "week 1, week 2...") so that if the project runs out of time, there is still a working, gradeable increment rather than a pile of unfinished parts.',
                  'Risk register: a short list of the specific things most likely to make the project fail or slip — an unproven algorithm, an external dependency, an unfamiliar tool — recorded up front with a mitigation or fallback for each, rather than discovered under deadline pressure.',
                  'Alternatives considered: a brief record of at least one other approach that was rejected and why, which is what separates a design document from a to-do list — it shows the author understood the tradeoff space, not just one path through it.',
                  'Success criteria: measurable, falsifiable conditions ("handles 10k requests/sec at p99 < 50ms", not "is fast") that let both the author and a reviewer agree, without debate, on whether the capstone met its own goals at the end.',
                ],
                simpleExplanation: 'Imagine you are about to build a treehouse, but instead of just grabbing wood and climbing up, your parent asks you to first draw a picture of what it will look like, write down how tall it will be, how many kids it needs to hold, and what you will do if it rains halfway through building it. That drawing-and-writing-first step feels slower, but it means that when your parent looks at the picture, they can say "wait, that branch looks too thin" before you have already nailed boards to it.\n\nA design document for a software capstone is the exact same idea. Before you write a single line of code, you write down: what problem you are solving and for whom, what you are deliberately NOT going to try to solve (so nobody is surprised later when some feature is missing), a picture of how the pieces of your system talk to each other, and a plan for what you will build first so that if you run out of time, you still have something that actually works instead of five half-finished things.\n\nThe trickiest but most important part is writing down the ways your plan might fail before you start — "I have never used this database before, so I might get stuck" — and having a backup plan ready, rather than discovering the problem for the first time three days before the deadline. And at the very end, you need a way to know, without arguing about it, whether you actually succeeded: not "it feels pretty fast" but "it handles this many users in this much time," a number you agreed on back at the beginning, before you knew whether you would hit it.',
                realWorldApplications: [
                  { title: 'Google\'s internal design doc process', description: 'Google requires engineers to write and circulate a design document for review before starting significant work, precisely so architectural mistakes and scope disagreements are caught on paper instead of after code is written — the same practice this capstone milestone teaches at a smaller scale.' },
                  { title: 'RFC (Request for Comments) processes at companies like Stripe and Uber', description: 'Large engineering orgs formalize the same problem-statement-plus-alternatives-plus-risks structure into an "RFC" document that must be approved before a project can proceed, making disagreements explicit before implementation begins.' },
                  { title: 'NSF and DARPA grant proposals', description: 'Research funding proposals require the same skeleton this topic teaches — problem statement, prior approaches and why they fall short, a concrete plan with milestones, and stated success criteria — because reviewers who were not in the room need to evaluate the plan from the document alone.' },
                  { title: 'Academic thesis proposals', description: 'A capstone proposal is structurally identical to a graduate thesis proposal defense: both require a committee to approve scope, method, and success criteria before substantial work begins, precisely to prevent months of work going toward an unreviewable or unfocused goal.' },
                ],
                primaryLecture: {
                  id: 'cs401-lec-1',
                  type: 'video',
                  title: 'What Is A Design Doc In Software Engineering? (full example)',
                  institution: 'AlgoExpert',
                  provider: 'youtube',
                  videoId: 'bgHL41e7vgI',
                  embedUrl: 'https://www.youtube-nocookie.com/embed/bgHL41e7vgI',
                  canonicalUrl: 'https://www.youtube.com/watch?v=bgHL41e7vgI',
                  sourcePageUrl: 'https://www.youtube.com/watch?v=bgHL41e7vgI',
                  url: 'https://www.youtube.com/watch?v=bgHL41e7vgI',
                  durationMinutes: 13,
                  embeddingAllowed: true,
                  accessStatus: 'verified',
                  instructor: 'Clément Mihailescu',
                } as any,
                primaryText: {
                  id: 'book-swe-at-google-cs401t1',
                  title: 'Software Engineering at Google',
                  authors: ['Titus Winters', 'Tom Manshreck', 'Hyrum Wright'],
                  url: 'https://abseil.io/resources/swe-book/html/toc.html',
                  canonicalUrl: 'https://abseil.io/resources/swe-book/html/toc.html',
                  recommendedChapter: 'Chapter 15: Documentation (design docs)',
                  accessStatus: 'open-access',
                  publisherOrInstitution: 'O\'Reilly Media',
                },
                recommendedChapter: 'Chapter 15: Documentation (design docs)',
                practicalExercises: [
                  {
                    id: 'ex-cs401t1-1',
                    question: 'Why does a strong design document explicitly list "non-goals" alongside goals?',
                    options: [
                      'To make the document longer for the reviewer',
                      'Because without stated non-goals, scope creep is invisible until it has already happened and reviewers cannot tell an intentional simplification from an oversight',
                      'Non-goals are only required for government contracts',
                      'To avoid having to write a risk register',
                    ],
                    correctAnswer: 'Because without stated non-goals, scope creep is invisible until it has already happened and reviewers cannot tell an intentional simplification from an oversight',
                    explanation: 'Stating non-goals up front turns an implicit assumption into an explicit, reviewable decision, which is exactly what separates a design document from an informal plan.',
                    type: 'multiple-choice',
                  },
                  {
                    id: 'ex-cs401t1-2',
                    question: 'A classmate\'s capstone proposal says its success criterion is "the system should be fast and reliable." Rewrite this as a measurable, falsifiable success criterion, and explain what specifically makes your version falsifiable and theirs not.',
                    explanation: 'A falsifiable version specifies a metric, a threshold, and a measurement condition — for example, "handles 500 concurrent connections with p99 latency under 200ms during a 10-minute load test." "Fast and reliable" is not falsifiable because no measurement could ever conclusively fail it or pass it; there is no agreed number to check against.',
                    type: 'free-response',
                  },
                  {
                    id: 'ex-cs401t1-3',
                    question: 'What is the primary purpose of milestone sequencing in a capstone plan?',
                    options: [
                      'To make the Gantt chart look impressive',
                      'So that if the project runs out of time, there is still a working, gradeable increment instead of several unfinished parts',
                      'To satisfy an unrelated university requirement',
                      'Milestones are optional and mostly ceremonial',
                    ],
                    correctAnswer: 'So that if the project runs out of time, there is still a working, gradeable increment instead of several unfinished parts',
                    explanation: 'Sequencing work into independently demonstrable checkpoints is a risk-management technique: it guarantees partial credit for real, working functionality rather than a pile of half-built pieces if time runs short.',
                    type: 'multiple-choice',
                  },
                ],
                readingQuestions: [
                  'What distinguishes a design document from an informal plan or a to-do list?',
                  'Why is recording rejected alternatives, not just the chosen approach, part of a strong design document?',
                  'How does a risk register change what a team does differently before starting work, versus not having one?',
                ],
                masteryChecklist: [
                  'Write a problem statement a stranger to the project could understand',
                  'State explicit non-goals, not just goals',
                  'Produce an architecture diagram showing component boundaries and data flow',
                  'Sequence the plan into independently demonstrable milestones',
                  'Record at least one rejected alternative and why',
                  'Write measurable, falsifiable success criteria',
                ],
                capstoneMilestone: 'Submit an approved capstone design document (problem statement, architecture diagram, milestones, risk register, and success criteria) before implementation begins.',
                estimatedStudyMinutes: 90,
                difficulty: 'advanced',
                glossary: [
                  { term: 'Design document', definition: 'A written proposal specifying a project\'s problem statement, scope, architecture, plan, risks, and success criteria, circulated for review before substantial implementation begins.' },
                  { term: 'Non-goal', definition: 'Something a project explicitly will not attempt, stated alongside its goals so scope decisions are visible and intentional rather than discovered by omission.' },
                  { term: 'Risk register', definition: 'A recorded list of the specific factors most likely to cause a project to fail or slip, each paired with a mitigation or fallback plan.' },
                  { term: 'Success criteria', definition: 'Measurable, falsifiable conditions agreed upon before implementation that determine whether a completed project met its stated goals.' },
                  { term: 'Milestone', definition: 'An independently demonstrable, verifiable checkpoint in a project plan, distinct from an arbitrary calendar date.' },
                ],
                commonMisconceptions: [
                  'Misconception: A design document is bureaucratic overhead that slows down real work. Reality: catching an architectural mistake on paper costs minutes; catching the same mistake after weeks of implementation costs weeks — the document is what makes the mistake cheap to catch.',
                  'Misconception: Only the final code matters for a capstone grade, not the proposal. Reality: an unreviewable or unscoped proposal is the single most common reason capstone projects run out of time or fail to demonstrate what they intended to; the proposal is where most preventable failure actually originates.',
                  'Misconception: Listing risks makes a proposal look weak or unconfident. Reality: reviewers trust a proposal MORE, not less, when it names its own weak points with a mitigation plan — omitting known risks reads as inexperience, not confidence.',
                  'Misconception: An architecture diagram is optional if the system is "simple enough to explain in words." Reality: the act of drawing forces boundary and interface decisions that prose can hide or leave ambiguous; nearly every system that turns out to be simple to diagram was, correspondingly, simpler to build correctly.',
                ],
                connectionsToLaterModules: [
                  'The capstone implementation and defense milestone directly builds on the architecture and milestones fixed here.',
                  'The same design-document discipline is expected in any production engineering role — this is the primary transfer skill of this topic beyond the capstone itself.',
                ],
                citation: {
                  text: 'Winters, T., Manshreck, T., & Wright, H. (2020). Software Engineering at Google: Lessons Learned from Programming Over Time. O\'Reilly Media. Chapter 15: Documentation.',
                },
                accessStatus: 'verified',
                interactiveLab: {
                  id: 'cs401-lab1',
                  title: 'Capstone Design Document Draft',
                  type: 'algo-viz',
                  practiceMode: 'independent',
                  level: 'level-5',
                  estimatedMinutes: 90,
                  instructions: 'Draft your own capstone design document as plain text: (1) a problem statement a stranger could understand, (2) explicit non-goals, (3) a text-based architecture sketch (component list + how they connect), (4) 3-5 sequenced milestones, each independently demonstrable, (5) a risk register of at least 3 specific risks with a mitigation for each, (6) at least one rejected alternative approach and why, and (7) measurable, falsifiable success criteria. Write it as if a reviewer who has never spoken with you will approve or reject it from this document alone.',
                  objective: 'Produce a reviewable capstone proposal before writing any implementation code.',
                  starterCode: '# CAPSTONE DESIGN DOCUMENT\n\n## 1. Problem Statement\n\n\n## 2. Goals and Non-Goals\n\n\n## 3. Architecture\n\n\n## 4. Milestones\n\n\n## 5. Risk Register\n\n\n## 6. Alternatives Considered\n\n\n## 7. Success Criteria\n',
                },
              },
            },
          ],
        },
      ],
      books: [],
      papers: [],
      lectures: [],
      labs: [],
      topicIds: ['cs401-t1'],
      assessmentIds: [],
      projectIds: ['capstone-cs-401'],
    },

    // 15. DS Senior Capstone
    {
      ...dsMap.get('ds-101')!, // Use full structure template
      id: 'ds-401',
      code: 'DS 401',
      title: 'Senior Data Science Capstone Project',
      description: 'End-to-end data pipeline, model training, Causal evaluation, MLOps deployment, and governance audit.',
      academicLevel: 4,
      creditHours: 4,
      estimatedHours: 60,
      isRequired: true,
      isElective: false,
      category: 'ds',
      prerequisiteCourseIds: ['ds-302', 'cs-305'],
      sharedProgressKey: 'canonical-ds-401',
      programAssignments: [
        { programId: 'data-science', role: 'capstone', year: 4, semester: 8, displayCode: 'DS 401' },
      ],
      learningOutcomes: [
        'Build an end-to-end data product with ETL and real-time inference',
        'Conduct rigorous causal impact analysis or A/B testing evaluation',
        'Perform algorithmic fairness and data privacy audit',
      ],
      sections: [
        {
          id: 'ds401-s1',
          title: 'Section 1: Data Product Execution & Portfolio Defense',
          summary: 'ETL development, model validation, and stakeholder presentation.',
          order: 1,
          topics: [
            {
              id: 'ds401-t1',
              moduleId: 'ds-401',
              title: 'Data Product Specification & Baseline Model',
              slug: 'ds-capstone-spec',
              summary: 'Formulate hypotheses, extract datasets, and establish benchmark performance.',
              order: 1,
              masteryPack: {
                learningObjective: 'Frame a data product as a falsifiable hypothesis with a measurable target, and build the simplest possible baseline before attempting any sophisticated model.',
                prerequisites: ['DS 302 Causal Inference', 'CS 305 Machine Learning'],
                coreConcepts: [
                  'Problem framing: translating a vague business or research question ("reduce churn") into a specific, measurable prediction or decision task with a defined input, output, and unit of prediction — most failed data science projects fail here, before any model is trained, because the wrong question was made precise instead of the right one.',
                  'Baseline model: the simplest model that could plausibly work — a majority-class predictor, a linear model, or even a hand-written rule — trained and measured FIRST, before any sophisticated approach, so every later improvement has a concrete number to prove it actually helped.',
                  'Success metric selection: choosing the metric (precision, recall, RMSE, calibration, business $ impact) that actually reflects what matters for the decision the model informs; optimizing the wrong metric can produce a model that scores well and is still useless in production.',
                  'Data availability audit: verifying, before committing to a model plan, that the data needed actually exists, is accessible, is labeled (or labelable), and reflects the population the product will actually see — discovering a data gap after the plan is set is one of the most common causes of capstone scope failure.',
                  'Leakage risk: information available at training time that would not be available at prediction time in production (e.g., a feature computed using future data), which inflates offline metrics while making the model useless or actively harmful once deployed.',
                  'Hypothesis statement: a specific, falsifiable claim ("Model X will predict churn with AUC > 0.75, beating the majority-class baseline of 0.50") written before training begins, so the project has a predetermined bar rather than a post-hoc rationalization of whatever number came out.',
                  'Error budget: an explicit tolerance for how wrong the baseline (and later, the final model) is allowed to be before the product is not viable, forcing an early conversation about whether the achievable accuracy is actually good enough for the intended use.',
                ],
                simpleExplanation: 'Imagine a friend asks you to guess how many jellybeans are in a jar, and instead of guessing wildly, the smartest first move is not a fancy formula — it is just guessing "the average jar has about 300 jellybeans" and seeing how close that gets you. That boring, simple guess is your baseline. Only after you know how good (or bad) that simple guess is can you tell whether a fancier method — counting layers, estimating jar volume — is actually worth the extra effort, because you can compare its answer to your simple baseline and see if it is really better.\n\nBefore you can even make that first guess, though, you have to turn a fuzzy question like "will customers stop using our app?" into something you can actually check with a number, like "for each customer, will they NOT open the app for 30 straight days?" That specific, checkable version of the question is called problem framing, and getting it wrong at the start means that no matter how good your model is later, you built something that answers a different question than the one anyone actually cared about.\n\nOne sneaky trap is called data leakage: imagine you are trying to predict, on Monday, whether it will rain on Friday, but you accidentally let your model peek at Friday\'s actual weather report while it is "learning." It will seem incredibly accurate during practice, because it is basically cheating, but the moment you ask it to predict a REAL future Friday, where no report exists yet, it falls apart. Data scientists have to be very careful that every piece of information the model uses would have genuinely been available at the moment it needs to make its real prediction.\n\nFinally, before writing any code, you write down exactly what "good enough" means — not "the model should work well," but "it needs to beat simply guessing the most common answer, by at least this much" — so that at the end of the project, nobody has to argue about whether it actually succeeded. The number was agreed on before anyone knew the answer.',
                realWorldApplications: [
                  { title: 'Netflix\'s recommendation baseline', description: 'Before deploying a sophisticated recommender, Netflix-style systems establish a baseline (e.g., "most popular in category") specifically so every subsequent model iteration can be judged by measurable lift over that number, not by intuition.' },
                  { title: 'Stripe\'s fraud-detection model rollout', description: 'Fraud models are validated against a simple rule-based baseline before a machine-learned model is trusted with real transaction decisions, because a baseline reveals whether added model complexity is actually earning its cost.' },
                  { title: 'Kaggle competition leaderboards', description: 'Every Kaggle competition publishes a baseline (often a simple mean or majority-class predictor) specifically so competitors — and observers — can judge how much genuine signal a leaderboard score represents above pure chance.' },
                  { title: 'Google\'s "Rules of Machine Learning" internal guide', description: 'Google\'s widely cited internal ML best-practices guide explicitly states the first rule of building an ML system is "don\'t be afraid to launch a product without machine learning" — i.e., ship the simplest baseline first — reflecting the exact discipline this topic teaches.' },
                ],
                primaryLecture: {
                  id: 'ds401-lec-1',
                  type: 'video',
                  title: '6. Baselines - ML Projects - Full Stack Deep Learning',
                  institution: 'The Full Stack',
                  provider: 'youtube',
                  videoId: 'wfTk7Lb9uPg',
                  embedUrl: 'https://www.youtube-nocookie.com/embed/wfTk7Lb9uPg',
                  canonicalUrl: 'https://www.youtube.com/watch?v=wfTk7Lb9uPg',
                  sourcePageUrl: 'https://www.youtube.com/watch?v=wfTk7Lb9uPg',
                  url: 'https://www.youtube.com/watch?v=wfTk7Lb9uPg',
                  durationMinutes: 14,
                  embeddingAllowed: true,
                  accessStatus: 'verified',
                  instructor: 'Josh Tobin',
                } as any,
                primaryText: {
                  id: 'book-bmlpa-ds401t1',
                  title: 'Building Machine Learning Powered Applications: Going from Idea to Product',
                  authors: ['Emmanuel Ameisen'],
                  url: 'https://www.oreilly.com/library/view/building-machine-learning/9781492045106/',
                  pdfUrl: 'https://www.mlpowered.com/pdf/BMLPA_Chapter_1.pdf',
                  canonicalUrl: 'https://www.oreilly.com/library/view/building-machine-learning/9781492045106/',
                  recommendedChapter: 'Chapter 1: Frame the Problem and Chapter 2: Select and Train a Model',
                  accessStatus: 'open-access',
                  publisherOrInstitution: 'O\'Reilly Media',
                },
                recommendedChapter: 'Chapter 1: Frame the Problem and Chapter 2: Select and Train a Model',
                practicalExercises: [
                  {
                    id: 'ex-ds401t1-1',
                    question: 'Why must a baseline model be built and measured BEFORE a sophisticated model, rather than afterward for comparison?',
                    options: [
                      'It is a formality with no real effect on the project',
                      'Without a baseline number established first, there is no way to prove a sophisticated model\'s added complexity actually earned its cost',
                      'Baselines are only needed for classification problems',
                      'Building the baseline first is faster to code, which is the only reason',
                    ],
                    correctAnswer: 'Without a baseline number established first, there is no way to prove a sophisticated model\'s added complexity actually earned its cost',
                    explanation: 'A baseline is the reference point that turns "our model got 82% accuracy" into a meaningful claim — 82% is only impressive (or not) relative to what a trivial approach would have achieved.',
                    type: 'multiple-choice',
                  },
                  {
                    id: 'ex-ds401t1-2',
                    question: 'A student is predicting hospital readmission and includes "total days hospitalized during this visit" as a feature, achieving 95% offline accuracy. Explain why this is very likely a leakage problem, and what question you would ask to check.',
                    explanation: 'Total days hospitalized during the CURRENT visit is only fully known once the visit is over — but the prediction is supposed to happen at admission or during the stay, before that total is known. The question to ask is: "would this exact feature value have been available at the real moment the prediction needs to be made in production?" If not, it is leakage, and the offline accuracy is inflated and will not hold up when deployed.',
                    type: 'free-response',
                  },
                  {
                    id: 'ex-ds401t1-3',
                    question: 'Why does problem framing matter more than model choice for whether a data science capstone succeeds?',
                    options: [
                      'It does not — model choice matters far more',
                      'A precisely-defined, measurable, and available-data-backed question can be answered by many different models, but no model can answer a vaguely-framed question correctly',
                      'Problem framing is only relevant for unsupervised learning',
                      'Framing only matters if the dataset is large',
                    ],
                    correctAnswer: 'A precisely-defined, measurable, and available-data-backed question can be answered by many different models, but no model can answer a vaguely-framed question correctly',
                    explanation: 'A well-framed problem can be solved by a simple model, a complex one, or several candidates compared fairly. A poorly-framed problem cannot be fixed by any amount of modeling sophistication, since the model would be optimizing the wrong target from the start.',
                    type: 'multiple-choice',
                  },
                ],
                readingQuestions: [
                  'What specifically distinguishes a baseline model from "the first model you happen to try"?',
                  'Why does a data availability audit belong at the specification stage rather than after model training begins?',
                  'How does stating a hypothesis and success metric before training change what counts as a legitimate result at the end of the project?',
                ],
                masteryChecklist: [
                  'State the prediction task with a specific input, output, and unit of prediction',
                  'Audit that the required data actually exists and is accessible before committing to a plan',
                  'Train and measure a trivial baseline before any sophisticated model',
                  'Select a success metric that reflects the real decision the model informs',
                  'Identify at least one potential leakage risk in the proposed features',
                  'Write a falsifiable hypothesis and target metric before training begins',
                ],
                capstoneMilestone: 'Submit an approved data product specification (problem framing, data availability audit, success metric, and measured baseline performance) before building the final model.',
                estimatedStudyMinutes: 90,
                difficulty: 'advanced',
                glossary: [
                  { term: 'Baseline model', definition: 'The simplest model that could plausibly work, trained and measured first so every later, more sophisticated model has a concrete number to beat.' },
                  { term: 'Problem framing', definition: 'Translating a vague question into a specific, measurable prediction or decision task with a defined input, output, and unit of prediction.' },
                  { term: 'Data leakage', definition: 'Information used by a model at training time that would not actually be available at real prediction time in production, which inflates offline metrics misleadingly.' },
                  { term: 'Success metric', definition: 'The specific, measurable quantity (e.g., AUC, RMSE, precision at a threshold) chosen to reflect what actually matters for the decision a model informs.' },
                  { term: 'Data availability audit', definition: 'Verifying, before committing to a model plan, that the required data exists, is accessible, and reflects the population the product will actually serve.' },
                ],
                commonMisconceptions: [
                  'Misconception: Skipping the baseline and going straight to the most sophisticated model saves time. Reality: without a baseline, there is no way to know whether the sophisticated model\'s complexity, training cost, and maintenance burden are actually justified — teams routinely ship complex models that turn out to barely beat a simple rule.',
                  'Misconception: A high offline accuracy number means the model is ready. Reality: an inflated offline score is one of the most common symptoms of data leakage; the number must be interrogated for whether every feature would genuinely be available at real prediction time before it is trusted.',
                  'Misconception: The success metric can be picked after seeing how the model performs, to make the results look good. Reality: choosing a metric after seeing results is a form of post-hoc rationalization, not evaluation — the metric must be fixed before training so the result is a genuine test of the hypothesis, not a story fit to whatever numbers came out.',
                  'Misconception: If the model math is correct, the data science project will succeed. Reality: most failed data science projects fail at problem framing or data availability, long before any model-quality issue — a technically correct model trained on the wrong target, or on data that will not exist in production, is still a failed project.',
                ],
                connectionsToLaterModules: [
                  'The final capstone deliverable and production pipeline directly build on the baseline and success metric fixed here.',
                  'The same framing-before-modeling discipline is expected throughout the DS 402 MLOps deployment work and in any applied data science role.',
                ],
                citation: {
                  text: 'Ameisen, E. (2020). Building Machine Learning Powered Applications: Going from Idea to Product. O\'Reilly Media. Chapters 1-2.',
                },
                accessStatus: 'verified',
                interactiveLab: {
                  id: 'ds401-lab1',
                  title: 'Data Product Specification & Baseline Report',
                  type: 'algo-viz',
                  practiceMode: 'independent',
                  level: 'level-5',
                  estimatedMinutes: 90,
                  instructions: 'Draft your own data product specification as plain text: (1) the business or research question reframed as a specific, measurable prediction task (input, output, unit of prediction), (2) a data availability audit confirming what data exists and whether it reflects your real target population, (3) your chosen success metric and why it reflects the actual decision the model informs, (4) a falsifiable hypothesis with a target number, (5) the simplest possible baseline you will build first and how you will measure it, and (6) at least one specific leakage risk in your proposed features and how you will check for it.',
                  objective: 'Specify a data product and its baseline evaluation plan before training any sophisticated model.',
                  starterCode: '# DATA PRODUCT SPECIFICATION\n\n## 1. Prediction Task\n\n\n## 2. Data Availability Audit\n\n\n## 3. Success Metric\n\n\n## 4. Hypothesis and Target\n\n\n## 5. Baseline Model Plan\n\n\n## 6. Leakage Risk Check\n',
                },
              },
            },
          ],
        },
      ],
      books: [],
      papers: [],
      lectures: [],
      labs: [],
      topicIds: ['ds401-t1'],
      assessmentIds: [],
      projectIds: ['capstone-ds-401'],
    },

    // 16. CS Elective: Computer Networks & Distributed Systems
    {
      ...csMap.get('cs-302')!,
      id: 'cs-302',
      academicLevel: 3,
      sharedProgressKey: 'canonical-cs-302',
      programAssignments: [
        { programId: 'computer-science', role: 'specialization', year: 3, semester: 5, displayCode: 'CS 302', specializationId: 'cs-systems' },
        { programId: 'data-science', role: 'elective', year: 3, semester: 5, displayCode: 'CS 302', specializationId: 'ds-data-eng' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-302')!),
    },

    // 17. CS Elective: Compiler Construction & Programming Languages
    {
      ...csMap.get('cs-303')!,
      id: 'cs-303',
      academicLevel: 3,
      sharedProgressKey: 'canonical-cs-303',
      programAssignments: [
        { programId: 'computer-science', role: 'specialization', year: 3, semester: 6, displayCode: 'CS 303', specializationId: 'cs-systems' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-303')!),
    },

    // 18. CS Elective: Software Engineering & Architecture
    {
      ...csMap.get('cs-304')!,
      id: 'cs-304',
      academicLevel: 3,
      sharedProgressKey: 'canonical-cs-304',
      programAssignments: [
        { programId: 'computer-science', role: 'specialization', year: 3, semester: 6, displayCode: 'CS 304', specializationId: 'cs-software-eng' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-304')!),
    },

    // 19. CS Elective: Formal Languages & Automata
    {
      ...csMap.get('cs-402')!,
      id: 'cs-402',
      academicLevel: 4,
      sharedProgressKey: 'canonical-cs-402',
      programAssignments: [
        { programId: 'computer-science', role: 'specialization', year: 4, semester: 7, displayCode: 'CS 402', specializationId: 'cs-theory' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-402')!),
    },

    // 20. CS Elective: Computer Security & Cryptography
    {
      ...csMap.get('cs-403')!,
      id: 'cs-403',
      academicLevel: 4,
      sharedProgressKey: 'canonical-cs-403',
      programAssignments: [
        { programId: 'computer-science', role: 'specialization', year: 4, semester: 7, displayCode: 'CS 403', specializationId: 'cs-security' },
      ],
      ...extractAuxiliaryIds(csMap.get('cs-403')!),
    },

    // 21. DS Elective: Analytics Engineering
    {
      ...dsMap.get('ds-303')!,
      id: 'ds-303',
      academicLevel: 3,
      sharedProgressKey: 'canonical-ds-303',
      programAssignments: [
        { programId: 'data-science', role: 'specialization', year: 3, semester: 5, displayCode: 'DS 303', specializationId: 'ds-data-eng' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-303')!),
    },

    // 22. DS Elective: Applied Time Series Analysis
    {
      ...dsMap.get('ds-304')!,
      id: 'ds-304',
      academicLevel: 3,
      sharedProgressKey: 'canonical-ds-304',
      programAssignments: [
        { programId: 'data-science', role: 'specialization', year: 3, semester: 6, displayCode: 'DS 304', specializationId: 'ds-statistical-science' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-304')!),
    },

    // 23. DS Elective: MLOps & Production ML
    {
      ...dsMap.get('ds-402')!,
      id: 'ds-402',
      academicLevel: 4,
      sharedProgressKey: 'canonical-ds-402',
      programAssignments: [
        { programId: 'data-science', role: 'specialization', year: 4, semester: 7, displayCode: 'DS 402', specializationId: 'ds-ml' },
        { programId: 'computer-science', role: 'elective', year: 4, semester: 7, displayCode: 'CS 405', specializationId: 'cs-ai' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-402')!),
    },

    // 24. DS Elective: Natural Language Processing
    {
      ...dsMap.get('ds-403')!,
      id: 'ds-403',
      academicLevel: 4,
      sharedProgressKey: 'canonical-ds-403',
      programAssignments: [
        { programId: 'data-science', role: 'specialization', year: 4, semester: 7, displayCode: 'DS 403', specializationId: 'ds-nlp' },
        { programId: 'computer-science', role: 'elective', year: 4, semester: 7, displayCode: 'CS 406', specializationId: 'cs-ai' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-403')!),
    },

    // 25. DS Elective: Computer Vision & Spatial Analytics
    {
      ...dsMap.get('ds-405')!,
      id: 'ds-405',
      academicLevel: 4,
      sharedProgressKey: 'canonical-ds-405',
      programAssignments: [
        { programId: 'data-science', role: 'specialization', year: 4, semester: 7, displayCode: 'DS 405', specializationId: 'ds-vision' },
      ],
      ...extractAuxiliaryIds(dsMap.get('ds-405')!),
    },

    ...AI_ENGINEERING_COURSES.map((course) => ({
      ...aiMap.get(course.id)!,
      academicLevel: 4 as const,
      sharedProgressKey: `canonical-${course.id}`,
      programAssignments: [
        {
          programId: 'data-science' as const,
          role: 'specialization' as const,
          year: 4 as const,
          semester: 8 as const,
          displayCode: course.code,
          specializationId: 'ds-ml',
        },
      ],
      ...extractAuxiliaryIds(course),
    })),

    ...CYBERSECURITY_COURSES.map((course) => ({
      ...cyberMap.get(course.id)!,
      academicLevel: 4 as const,
      sharedProgressKey: `canonical-${course.id}`,
      programAssignments: [
        {
          programId: 'computer-science' as const,
          role: 'specialization' as const,
          year: 4 as const,
          semester: 8 as const,
          displayCode: course.code,
          specializationId: 'cs-security',
        },
      ],
      ...extractAuxiliaryIds(course),
    })),

    ...DATA_ENGINEERING_COURSES.map((course) => ({
      ...deMap.get(course.id)!,
      academicLevel: 4 as const,
      sharedProgressKey: `canonical-${course.id}`,
      programAssignments: [
        {
          programId: 'data-science' as const,
          role: 'specialization' as const,
          year: 4 as const,
          semester: 7 as const,
          displayCode: course.code,
          specializationId: 'ds-data-eng',
        },
      ],
      ...extractAuxiliaryIds(course),
    })),
  ];

  return registry;
}

export const CANONICAL_COURSES: CanonicalCourse[] = buildCanonicalRegistry();

/**
 * Projects a CanonicalCourse to a Program-specific Course view.
 */
export function projectCourseForProgram(canonical: CanonicalCourse, programId: ProgramId): Course | undefined {
  const assignment = canonical.programAssignments.find(pa => pa.programId === programId);
  if (!assignment) return undefined;

  const code = assignment.displayCode || canonical.code;
  const isRequired = assignment.role === 'required' || assignment.role === 'shared-required' || assignment.role === 'capstone';
  const isElective = assignment.role === 'elective' || assignment.role === 'specialization';

  return {
    ...canonical,
    code,
    program: programId,
    year: assignment.year,
    semester: assignment.semester,
    isRequired,
    isElective,
    role: assignment.role,
    programAssignments: canonical.programAssignments,
  };
}

/**
 * Returns all projected courses for a specific program.
 */
export function getCanonicalCoursesForProgram(programId: ProgramId): Course[] {
  return CANONICAL_COURSES
    .map(c => projectCourseForProgram(c, programId))
    .filter((c): c is Course => c !== undefined);
}
