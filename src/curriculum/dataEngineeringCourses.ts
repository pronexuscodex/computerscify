import {
  AssessmentDefinition,
  BookResource,
  CapstoneProjectMilestone,
  Course,
  DifficultyLevel,
  InteractiveLabDefinition,
  MasteryPack,
  PracticeExercise,
  ResearchPaper,
  Topic,
} from '../types/curriculum';
import { VERIFIED_VIDEOS } from '../data/verifiedVideoRegistry';

interface DeTopicDefinition {
  id: string;
  title: string;
  summary: string;
  objective: string;
  concepts: string[];
  prerequisites: string[];
  exercise: PracticeExercise;
  lab: InteractiveLabDefinition;
  checklist: string[];
  misconceptions: string[];
  glossary: Array<{ term: string; definition: string }>;
  primaryText?: BookResource;
  researchPapers?: ResearchPaper[];
}

interface DeCourseDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  prerequisiteCourseIds: string[];
  learningOutcomes: string[];
  topics: DeTopicDefinition[];
  project: Omit<CapstoneProjectMilestone, 'id'>;
}

const makeMasteryPack = (
  course: DeCourseDefinition,
  topic: DeTopicDefinition,
  topicIndex: number
): MasteryPack => ({
  learningObjective: topic.objective,
  prerequisites: topic.prerequisites,
  coreConcepts: topic.concepts,
  recommendedChapter: `Course unit ${topicIndex + 1}: ${topic.title}`,
  practicalExercises: [topic.exercise],
  interactiveLab: topic.lab,
  primaryLecture: (VERIFIED_VIDEOS as Record<string, MasteryPack['primaryLecture']>)[topic.id],
  primaryText: topic.primaryText,
  readingQuestions: [
    `What evidence would demonstrate that ${topic.title.toLowerCase()} works as intended?`,
    'Which assumptions or failure modes should be documented before deployment?',
  ],
  masteryChecklist: topic.checklist,
  capstoneMilestone: course.project.title,
  estimatedStudyMinutes: Math.round((course.estimatedHours * 60) / course.topics.length),
  difficulty: course.difficulty,
  glossary: topic.glossary,
  commonMisconceptions: topic.misconceptions,
  connectionsToLaterModules: ['Analytics engineering', 'Streaming systems', 'Data governance'],
  citation: {
    text: 'ComputerSciFy Data Engineering curriculum — internally authored course notes and exercises.',
  },
  accessStatus: 'needsVerification',
});

const makeAssessment = (
  course: DeCourseDefinition,
  type: AssessmentDefinition['type']
): AssessmentDefinition => ({
  id: `${course.id}-${type}`,
  title: `${course.code} ${type === 'midterm' ? 'Design Review' : 'Final Assessment'}`,
  type,
  instructions:
    type === 'midterm'
      ? 'Explain the engineering trade-offs in writing before checking the reference explanation.'
      : 'Complete the questions and connect each answer to evidence from the course project.',
  questions: course.topics.map((topic, index) => ({
    ...topic.exercise,
    id: `${course.id}-${type}-q${index + 1}`,
  })),
  passScorePercentage: type === 'midterm' ? 70 : 80,
});

const makeCourse = (definition: DeCourseDefinition): Course => ({
  id: definition.id,
  code: definition.code,
  title: definition.title,
  program: 'data-science',
  year: 4,
  semester: 7,
  creditHours: 3,
  estimatedHours: definition.estimatedHours,
  isRequired: false,
  isElective: true,
  category: 'ds',
  prerequisiteCourseIds: definition.prerequisiteCourseIds,
  description: definition.description,
  learningOutcomes: definition.learningOutcomes,
  sections: [
    {
      id: `${definition.id}-s1`,
      title: `Section 1: ${definition.title}`,
      summary: definition.description,
      order: 1,
      topics: definition.topics.map((topic, index): Topic => ({
        id: topic.id,
        moduleId: definition.id,
        title: topic.title,
        slug: topic.id,
        summary: topic.summary,
        order: index + 1,
        masteryPack: makeMasteryPack(definition, topic, index),
        labIds: [topic.lab.id],
        interactiveLabs: [topic.lab],
        researchPapers: topic.researchPapers,
      })),
    },
  ],
  books: [],
  papers: [],
  lectures: [],
  labs: definition.topics.map((topic) => topic.lab),
  midTermAssessment: makeAssessment(definition, 'midterm'),
  finalAssessment: makeAssessment(definition, 'final'),
  capstoneProject: {
    ...definition.project,
    id: `${definition.id}-capstone`,
  },
});

const definitions: DeCourseDefinition[] = [
  {
    id: 'de-100',
    code: 'DE 100',
    title: 'Data Modeling, Warehousing, and Pipeline Reliability',
    description:
      'Dimensional modeling, warehouse schema design, ETL/ELT pipeline orchestration, data quality, schema evolution, and reliability engineering for analytical data platforms.',
    estimatedHours: 48,
    difficulty: 'intermediate',
    prerequisiteCourseIds: ['ds-101'],
    learningOutcomes: [
      'Design a dimensional warehouse schema with an explicit grain and slowly-changing-dimension strategy',
      'Distinguish ETL from ELT and choose orchestration patterns that support idempotent reprocessing',
      'Build automated data-quality checks and a monitoring plan that catches pipeline failures before they reach dashboards',
    ],
    topics: [
      {
        id: 'de100-t1',
        title: 'Dimensional Modeling and Warehouse Schema Design',
        summary:
          'Star and snowflake schemas, fact and dimension tables, grain, slowly changing dimensions, surrogate keys, and normalization trade-offs for analytical workloads.',
        objective:
          'Design a dimensional schema for an analytical workload and justify its grain, keys, and slowly-changing-dimension strategy.',
        concepts: [
          'Star schema',
          'Snowflake schema',
          'Fact tables',
          'Dimension tables',
          'Grain',
          'Slowly changing dimensions',
          'Surrogate keys',
          'Normalization vs denormalization',
        ],
        prerequisites: ['Relational databases', 'SQL fundamentals'],
        exercise: {
          id: 'de100-ex1',
          type: 'multiple-choice',
          question:
            'A retailer wants to track historical changes to a customer\'s home region without losing prior order history tied to the old region. Which dimensional technique fits?',
          options: [
            'Overwrite the region column in place (Type 1)',
            'Add a new dimension row with effective-date range (Type 2)',
            'Store region only in the fact table',
            'Delete the customer record and recreate it',
          ],
          correctAnswer: 'Add a new dimension row with effective-date range (Type 2)',
          explanation:
            'A Type 2 slowly changing dimension preserves history by versioning dimension rows, so facts joined to the old row still reflect the region at the time of the order.',
        },
        lab: {
          id: 'de100-lab1',
          title: 'Star Schema Design from a Raw Order Feed',
          type: 'sql',
          language: 'sql',
          practiceMode: 'guided-lesson',
          level: 'level-2',
          estimatedMinutes: 100,
          instructions:
            'Given a supplied flat orders export, design fact_orders and supporting dimension tables (customer, product, date), choose a grain, and write the CREATE TABLE statements with explicit surrogate and natural keys.',
          objective: 'Translate a denormalized source export into a queryable dimensional schema.',
          starterCode:
            '-- Define the grain of fact_orders in a comment, then create the fact and dimension tables.\nCREATE TABLE dim_customer (\n  customer_key INTEGER PRIMARY KEY,\n  customer_id TEXT NOT NULL\n  -- add SCD columns\n);\n',
        },
        checklist: [
          'State the grain of the fact table in one sentence',
          'Separate additive, semi-additive, and non-additive measures',
          'Choose Type 1 or Type 2 for each dimension attribute and justify it',
          'Use surrogate keys in dimensions instead of relying solely on natural keys',
        ],
        misconceptions: [
          'A star schema is always fully denormalized with no exceptions',
          'Type 2 slowly changing dimensions are only needed for customer data',
        ],
        glossary: [
          {
            term: 'Grain',
            definition:
              'The precise meaning of a single row in a fact table (for example, one row per order line item), which determines what can and cannot be correctly aggregated.',
          },
        ],
        primaryText: {
          id: 'book-kimball-dimensional-modeling-techniques',
          title: 'Kimball Dimensional Modeling Techniques',
          authors: ['Ralph Kimball', 'Margy Ross', 'Kimball Group'],
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/',
          pdfUrl: 'https://www.kimballgroup.com/wp-content/uploads/2013/08/2013.09-Kimball-Dimensional-Modeling-Techniques11.pdf',
          canonicalUrl: 'https://www.kimballgroup.com/wp-content/uploads/2013/08/2013.09-Kimball-Dimensional-Modeling-Techniques11.pdf',
          recommendedChapter: 'Grain, Star Schemas, and Slowly Changing Dimensions',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Kimball Group',
        },
        researchPapers: [
          {
            id: 'paper-enterprise-data-modelling-methodologies',
            title: 'Enterprise Data Modelling Methodologies: A Comparative Analysis of Inmon, Kimball, and Data Vault',
            authors: ['Issar Arab'],
            year: 2026,
            venue: 'arXiv preprint',
            doiOrArxiv: 'arXiv:2606.29355',
            openAccessUrl: 'https://arxiv.org/pdf/2606.29355',
            canonicalUrl: 'https://arxiv.org/abs/2606.29355',
            paperType: 'survey',
            difficulty: 'intermediate',
            prerequisites: ['Relational databases'],
            summary:
              'Compares the three dominant enterprise data-warehouse design methodologies — Inmon, Kimball dimensional modeling, and Data Vault — across architectural philosophy, modeling technique, scalability, agility, query performance, and organizational fit.',
            whyItMatters:
              'Places this topic\'s dimensional-modeling approach in context against the two other methodologies a learner is likely to encounter on the job, clarifying when a star schema is the right choice versus when it is not.',
            sectionsToRead: 'The comparative analysis sections covering architecture, scalability, and query performance.',
            readingQuestions: [
              'What distinguishes the Kimball approach from Inmon\'s at the architectural level?',
              'Under what conditions does the paper suggest Data Vault outperforms dimensional modeling?',
              'Which trade-off from the paper most directly justifies this topic\'s grain-and-SCD design choices?',
            ],
            relatedTopicIds: ['de100-t1'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
      },
      {
        id: 'de100-t2',
        title: 'Pipeline Orchestration, Data Quality, and Reliability',
        summary:
          'ETL versus ELT, idempotent pipeline design, DAG-based orchestration, schema evolution, backfills, automated data-quality checks, and pipeline monitoring.',
        objective:
          'Design an idempotent, monitored data pipeline with explicit data-quality gates and a documented backfill strategy.',
        concepts: [
          'ETL vs ELT',
          'Idempotency',
          'DAG orchestration',
          'Schema evolution',
          'Backfills',
          'Data quality checks',
          'Pipeline monitoring',
          'Data lineage',
        ],
        prerequisites: ['Dimensional modeling'],
        exercise: {
          id: 'de100-ex2',
          type: 'free-response',
          question:
            'Explain why a daily pipeline step that runs "INSERT INTO fact_orders SELECT ... FROM staging" is not idempotent, and describe a rewrite that is.',
          explanation:
            'Re-running a plain INSERT duplicates rows on retry. An idempotent rewrite deletes or upserts by the partition/grain key before inserting (e.g. DELETE WHERE load_date = :date THEN INSERT, or MERGE/UPSERT on the natural key), so the same run can be safely repeated.',
        },
        lab: {
          id: 'de100-lab2',
          title: 'Data Quality Gate Evaluator',
          type: 'python',
          language: 'python',
          practiceMode: 'test-writing',
          level: 'level-3',
          estimatedMinutes: 110,
          instructions:
            'Implement deterministic data-quality checks (row-count bounds, null-rate thresholds, referential-integrity spot checks, freshness) against supplied fixture batches, and decide whether each batch should be allowed to load or should be quarantined.',
          objective: 'Turn informal "the pipeline looks fine" checks into automated, testable gates.',
          starterCode:
            'def evaluate_batch(batch, previous_batch_stats):\n    """Return a dict with pass/fail per check and an overall load/quarantine decision."""\n    findings = {\n        "row_count_in_range": None,\n        "null_rate_ok": None,\n        "referential_integrity_ok": None,\n        "freshness_ok": None,\n    }\n    return findings',
        },
        checklist: [
          'Make each pipeline step safe to re-run without duplicating or corrupting data',
          'Define at least three automated data-quality checks with explicit thresholds',
          'Document a backfill procedure that does not require manual row-by-row fixes',
          'Specify what gets alerted on and who is notified when a quality gate fails',
        ],
        misconceptions: [
          'A pipeline that ran successfully once will always produce correct output',
          'Schema evolution can be handled by silently dropping unrecognized columns',
        ],
        glossary: [
          {
            term: 'Idempotency',
            definition:
              'A property where running the same pipeline step multiple times with the same input produces the same result as running it once, making retries safe.',
          },
        ],
        primaryText: {
          id: 'book-cloudera-orchestrate-workflows-airflow',
          title: 'Orchestrating Workflows and Pipelines with Apache Airflow',
          authors: ['Cloudera'],
          url: 'https://docs.cloudera.com/data-engineering/cloud/orchestrate-workflows/topics/cde-orchestrate-workflows.html',
          pdfUrl: 'https://docs.cloudera.com/data-engineering/cloud/orchestrate-workflows/cde-orchestrate-workflows.pdf',
          canonicalUrl: 'https://docs.cloudera.com/data-engineering/cloud/orchestrate-workflows/cde-orchestrate-workflows.pdf',
          recommendedChapter: 'Building and Orchestrating DAGs, Task Dependencies, and Monitoring',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Cloudera',
        },
        researchPapers: [
          {
            id: 'paper-data-pipeline-quality-factors',
            title: 'Data pipeline quality: Influencing factors, root causes of data-related issues, and processing problem areas for developers',
            authors: ['Harald Foidl', 'Valentina Golendukhina', 'Rudolf Ramler', 'Michael Felderer'],
            year: 2023,
            venue: 'Journal of Systems and Software, Vol. 207',
            doiOrArxiv: '10.1016/j.jss.2023.111855',
            openAccessUrl: 'https://elib.dlr.de/201688/1/Data%20Pipeline%20Quality%20Influencing%20Factors%2C%20Root%20Causes%20of%20Data-related%20Issues%2C%20and%20Processing%20Problem%20Areas%20for%20Developers.pdf',
            canonicalUrl: 'https://doi.org/10.1016/j.jss.2023.111855',
            paperType: 'survey',
            difficulty: 'intermediate',
            prerequisites: ['Data pipeline fundamentals'],
            summary:
              'A literature review and expert-interview study identifying factors that influence data pipeline quality, common root causes of data-related issues, and where in the processing lifecycle developers most often introduce problems.',
            whyItMatters:
              'Grounds this topic\'s data-quality-gate checklist in an empirically derived taxonomy of real pipeline failure factors, rather than an ad hoc list.',
            sectionsToRead: 'The taxonomy of quality-influencing factors and the root-cause classification of data-related issues.',
            readingQuestions: [
              'Which quality-influencing factors identified in the paper map onto this topic\'s automated data-quality checks?',
              'How does the paper distinguish a data-related issue from a processing-related issue?',
              'What does the paper say about where in the pipeline lifecycle developers most often introduce defects?',
            ],
            relatedTopicIds: ['de100-t2'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
      },
    ],
    project: {
      title: 'Analytical Data Platform Design',
      description:
        'Design a dimensional warehouse schema and a reliable, monitored ingestion pipeline for a supplied raw data source.',
      constraints: [
        'Use a supplied or self-generated synthetic dataset — no production or personal data',
        'Every pipeline step must be idempotent and independently re-runnable',
        'Data-quality gates must be automated, not manual review',
      ],
      expectedDeliverables: [
        'Dimensional schema (fact and dimension DDL)',
        'Pipeline architecture diagram',
        'Data-quality check suite',
        'Monitoring and alerting plan',
        'Backfill runbook',
      ],
      evaluationRubric: [
        {
          criterion: 'Schema design',
          weight: '35%',
          description: 'Grain, keys, and slowly-changing-dimension choices are explicit and justified.',
        },
        {
          criterion: 'Reliability engineering',
          weight: '40%',
          description: 'Pipeline is idempotent, monitored, and has a tested backfill path.',
        },
        {
          criterion: 'Data quality',
          weight: '25%',
          description: 'Automated checks catch realistic failure modes before they reach downstream consumers.',
        },
      ],
    },
  },
];

export const DATA_ENGINEERING_COURSES: Course[] = definitions.map(makeCourse);
