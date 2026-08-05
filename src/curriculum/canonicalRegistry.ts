import { CanonicalCourse, ProgramId, SpecializationTrack, Course } from '../types/curriculum';
import { COMPUTER_SCIENCE_COURSES } from './programs/computerScience';
import { DATA_SCIENCE_COURSES } from './programs/dataScience';
import { AI_ENGINEERING_COURSES } from './aiEngineeringCourses';
import { CYBERSECURITY_COURSES } from './cybersecurityCourses';

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
              masteryPack: csMap.get('cs-101')!.sections[0].topics[0].masteryPack,
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
              masteryPack: dsMap.get('ds-101')!.sections[0].topics[0].masteryPack,
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
