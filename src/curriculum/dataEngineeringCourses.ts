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
  additionalExercises: PracticeExercise[];
  readingQuestions: string[];
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
  practicalExercises: [topic.exercise, ...topic.additionalExercises],
  interactiveLab: topic.lab,
  primaryLecture: (VERIFIED_VIDEOS as Record<string, MasteryPack['primaryLecture']>)[topic.id],
  primaryText: topic.primaryText,
  readingQuestions: topic.readingQuestions,
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
          'A star schema organizes a warehouse around a central fact table connected directly to denormalized dimension tables, trading some data redundancy for simpler, faster analytical queries.',
          'A snowflake schema normalizes dimension tables into multiple related tables, reducing redundancy at the cost of more joins per query, which matters when a dimension is very large or shares data across many facts.',
          'Fact tables store the measurable events or transactions of a business process (an order, a page view) along with foreign keys to the dimensions that describe the context of each event.',
          'Dimension tables store the descriptive context for facts — who, what, where, when — and are what analysts filter, group, and slice by when building reports.',
          'Grain is the precise definition of what a single row in a fact table represents, and getting it wrong (mixing rows at different levels of detail) silently breaks every aggregation built on top of the table.',
          'Slowly changing dimensions (SCDs) are techniques for handling the fact that dimension attributes (like a customer\'s address) change over time, and the chosen technique determines whether historical facts still reflect the value that was true when the event happened.',
          'Surrogate keys are warehouse-generated, meaningless identifiers (usually integers) assigned to dimension rows, used instead of natural business keys so that keys remain stable even as source-system identifiers change or get reused.',
          'Normalization vs. denormalization is a fundamental trade-off between minimizing data redundancy (normalization, common in transactional systems) and optimizing for read performance and query simplicity (denormalization, common in analytical warehouses).',
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
          'Misconception: A star schema is always fully denormalized with no exceptions. Reality: real-world star schemas often include a few normalized "outrigger" or snowflaked dimensions (for example, a large, slowly changing product-category hierarchy) when full denormalization would create excessive redundancy.',
          'Misconception: Type 2 slowly changing dimensions are only needed for customer data. Reality: any dimension attribute whose historical value matters for correctly interpreting past facts — product price tier, sales territory, employee department — is a candidate for Type 2 tracking, not just customer attributes.',
          'Misconception: Surrogate keys are just an arbitrary extra step and natural keys would work fine. Reality: natural keys from source systems can be reused, changed, or be composite and slow to join on; surrogate keys give the warehouse a stable, simple, and performant join key independent of source-system quirks.',
          'Misconception: A fact table should store every possible measure someone might eventually want, regardless of grain. Reality: adding a measure that does not exist at the fact table\'s grain (for example, a monthly total mixed into a daily-grain table) breaks aggregation correctness — measures must be added at their table\'s stated grain or in a separate, appropriately grained table.',
        ],
        glossary: [
          {
            term: 'Grain',
            definition:
              'The precise meaning of a single row in a fact table (for example, one row per order line item), which determines what can and cannot be correctly aggregated.',
          },
          {
            term: 'Fact table',
            definition: 'A table that stores quantitative, measurable events of a business process along with foreign keys linking each row to its descriptive dimensions.',
          },
          {
            term: 'Additive measure',
            definition: 'A numeric fact (like revenue) that can be correctly summed across every dimension, including time — the simplest and most common type of measure.',
          },
          {
            term: 'Semi-additive measure',
            definition: 'A numeric fact (like an account balance) that can be summed across most dimensions but not across time, since summing balances across days produces a meaningless number; such measures are typically averaged or taken at a point in time instead.',
          },
          {
            term: 'Slowly changing dimension (SCD) Type 1',
            definition: 'An SCD technique that overwrites the old attribute value with the new one in place, losing history but keeping the dimension simple — appropriate when historical accuracy for that attribute does not matter.',
          },
          {
            term: 'Slowly changing dimension (SCD) Type 2',
            definition: 'An SCD technique that inserts a new dimension row with an effective-date range whenever an attribute changes, preserving full history so facts can be correctly joined to the attribute value that was true at the time of the event.',
          },
          {
            term: 'Conformed dimension',
            definition: 'A dimension (like Date or Customer) that is built once with a consistent structure and meaning, then shared across multiple fact tables and subject areas so reports agree with each other.',
          },
          {
            term: 'Junk dimension',
            definition: 'A dimension table that groups several small, low-cardinality flags or indicators together into a single table, avoiding the clutter of many tiny separate dimensions in the fact table.',
          },
        ],
        additionalExercises: [
          {
            id: 'de100-t1-ex2',
            type: 'multiple-choice',
            question: 'A fact table has a grain of "one row per order" but a new requirement needs line-item-level discount data. What is the correct fix?',
            options: [
              'Add the discount as a new column averaged across all line items',
              'Change the grain to one row per order line item, or create a separate fact table at that finer grain',
              'Store the discount in the customer dimension instead',
              'Ignore the requirement since the fact table already exists',
            ],
            correctAnswer: 'Change the grain to one row per order line item, or create a separate fact table at that finer grain',
            explanation: 'Adding a finer-grained measure to a coarser-grained fact table breaks the one-clear-meaning-per-row rule. The grain must match the data being stored, so either the existing table is re-graded to line-item level or a new fact table is created at that grain.',
          },
          {
            id: 'de100-t1-ex3',
            type: 'free-response',
            question: 'Explain why a normalized (3NF) schema, which works well for a transactional order-entry system, is usually a poor fit for an analytical dashboard that aggregates millions of orders.',
            explanation: 'A normalized schema minimizes redundancy and optimizes for fast, safe single-row writes, which requires many small tables and joins to reconstruct a full record. Analytical queries instead scan and aggregate large numbers of rows, where many joins across normalized tables become slow; a denormalized star schema reduces the number of joins needed for typical analytical queries.',
          },
          {
            id: 'de100-t1-ex4',
            type: 'multiple-choice',
            question: 'Why use a surrogate key instead of a source system\'s natural key (like a customer email address) as a dimension\'s primary key?',
            options: [
              'Surrogate keys are always shorter to type',
              'Natural keys can change, be reused, or be null, while surrogate keys remain stable and are unaffected by source-system changes',
              'Surrogate keys are required by SQL syntax',
              'Natural keys cannot be indexed',
            ],
            correctAnswer: 'Natural keys can change, be reused, or be null, while surrogate keys remain stable and are unaffected by source-system changes',
            explanation: 'Business keys can be reassigned, corrected, merged, or missing, which would break foreign-key relationships built directly on them. A warehouse-generated surrogate key provides a stable join target unaffected by upstream data quality or business-process changes.',
          },
        ],
        readingQuestions: [
          'What evidence would demonstrate that dimensional modeling and warehouse schema design works as intended?',
          'Which assumptions or failure modes should be documented before deployment?',
          'Why does defining the grain of a fact table before writing any DDL prevent downstream aggregation bugs?',
          'How would you decide between a Type 1 and Type 2 slowly changing dimension for a given attribute?',
          'What practical query-performance difference would you expect between a star schema and a snowflake schema on the same data, and why?',
          'Why do conformed dimensions matter when an organization has multiple fact tables covering different business processes?',
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
          'ETL (extract, transform, load) transforms data before it reaches the warehouse, while ELT (extract, load, transform) loads raw data first and transforms it inside the warehouse using its compute power — the right choice depends on where transformation compute is cheapest and how raw data needs to be preserved.',
          'Idempotency means re-running the same pipeline step with the same input always produces the same result, which is what makes it safe to retry a failed job without manually cleaning up partial or duplicated data first.',
          'DAG (directed acyclic graph) orchestration models a pipeline as tasks with explicit dependencies and no cycles, letting an orchestrator like Airflow determine execution order, parallelism, and what to retry on failure.',
          'Schema evolution is the process of handling changes to a data source\'s structure (added, removed, or renamed columns) over time without silently corrupting or losing data already flowing through the pipeline.',
          'Backfills are the process of reprocessing historical data — after a bug fix, a schema change, or a new metric definition — so that historical output is consistent with current pipeline logic.',
          'Data quality checks are automated, codified assertions about data (row counts, null rates, referential integrity, freshness) that catch bad data before it reaches dashboards or downstream consumers.',
          'Pipeline monitoring tracks the operational health of a pipeline itself (run duration, failure rate, data freshness) so that failures are caught by alerts rather than discovered by a confused business stakeholder.',
          'Data lineage traces how a given piece of data moved and transformed from its source to its final destination, which is essential for debugging, impact analysis, and compliance.',
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
          'Misconception: A pipeline that ran successfully once will always produce correct output. Reality: upstream source changes, schema drift, and edge cases in rarely-seen data can silently break a previously working pipeline, which is why ongoing data-quality checks and monitoring are necessary, not just an initial validation.',
          'Misconception: Schema evolution can be handled by silently dropping unrecognized columns. Reality: silently dropping columns can quietly delete data a downstream consumer depends on without anyone noticing until a report looks wrong; schema changes should be detected, logged, and explicitly handled (or the pipeline should fail loudly) rather than dropped silently.',
          'Misconception: Idempotency just means "the pipeline does not crash on a retry." Reality: idempotency specifically means a retry produces the exact same output as a single successful run — a retry that appends duplicate rows without crashing is not idempotent, even though it "succeeded."',
          'Misconception: ELT is simply a newer, strictly better replacement for ETL. Reality: ELT shifts transformation cost and complexity into the warehouse, which works well when the warehouse has abundant compute, but ETL can still be preferable when transformations must happen before data lands (e.g., for compliance-driven masking) or when the warehouse\'s compute is a bottleneck.',
        ],
        glossary: [
          {
            term: 'Idempotency',
            definition:
              'A property where running the same pipeline step multiple times with the same input produces the same result as running it once, making retries safe.',
          },
          {
            term: 'DAG (directed acyclic graph)',
            definition: 'A set of tasks connected by dependency edges with no cycles, used to represent a pipeline\'s execution order so an orchestrator knows what can run in parallel and what must wait.',
          },
          {
            term: 'Backfill',
            definition: 'The controlled reprocessing of historical data through updated pipeline logic, so that past output matches what the current logic would have produced.',
          },
          {
            term: 'Upsert / MERGE',
            definition: 'A database operation that inserts a row if it does not exist or updates it if it does, based on a key — a common technique for making a load step idempotent.',
          },
          {
            term: 'Data freshness',
            definition: 'A measure of how up to date a dataset is relative to its source, typically tracked as the time elapsed since the most recent successful load.',
          },
          {
            term: 'Referential integrity check',
            definition: 'A data-quality check confirming that foreign-key-like references in a dataset (e.g., every order\'s customer_id) actually correspond to an existing record in the referenced table.',
          },
          {
            term: 'Dead-letter queue',
            definition: 'A holding location for records that fail processing or validation, so they can be inspected and reprocessed later instead of silently being dropped or crashing the whole pipeline.',
          },
          {
            term: 'Data lineage graph',
            definition: 'A visual or structured representation of how data flows and transforms from source tables through intermediate steps to final outputs, used for debugging and impact analysis.',
          },
        ],
        additionalExercises: [
          {
            id: 'de100-t2-ex2',
            type: 'multiple-choice',
            question: 'Which load pattern makes a daily pipeline step idempotent?',
            options: [
              'Always run INSERT INTO fact_orders SELECT ... FROM staging',
              'DELETE FROM fact_orders WHERE load_date = :date, then INSERT the day\'s data (or use MERGE/UPSERT on the natural key)',
              'Append new rows without checking whether the date has already been loaded',
              'Truncate the entire fact table before every run, regardless of date',
            ],
            correctAnswer: 'DELETE FROM fact_orders WHERE load_date = :date, then INSERT the day\'s data (or use MERGE/UPSERT on the natural key)',
            explanation: 'Deleting the specific partition before inserting (or using an upsert keyed on the natural/business key) means re-running the same day\'s load produces the same final state every time, rather than duplicating rows on retry.',
          },
          {
            id: 'de100-t2-ex3',
            type: 'free-response',
            question: 'A source system silently renames a column from "cust_id" to "customer_id". Describe what should happen in a well-designed pipeline when this occurs, versus what happens in a fragile one.',
            explanation: 'A well-designed pipeline detects the schema change (via a schema-validation step) and either fails loudly with a clear error, routes the affected batch to a dead-letter queue for review, or has an explicit, tested mapping step to handle the rename. A fragile pipeline either silently drops the now-unrecognized old column\'s data or crashes with an unhelpful error deep in downstream transformation logic, making the root cause hard to diagnose.',
          },
          {
            id: 'de100-t2-ex4',
            type: 'multiple-choice',
            question: 'Why is a backfill considered risky if the pipeline\'s load steps are not idempotent?',
            options: [
              'Backfills are never risky regardless of idempotency',
              'A non-idempotent backfill re-run can duplicate or corrupt data that was already correctly loaded, rather than cleanly replacing it',
              'Backfills only affect future data, not historical data',
              'Idempotency has no relationship to backfills',
            ],
            correctAnswer: 'A non-idempotent backfill re-run can duplicate or corrupt data that was already correctly loaded, rather than cleanly replacing it',
            explanation: 'A backfill is fundamentally a controlled re-run of historical processing; if the underlying load step is not idempotent, re-running it over already-loaded historical partitions will duplicate or otherwise corrupt data instead of safely producing the corrected result.',
          },
        ],
        readingQuestions: [
          'What evidence would demonstrate that pipeline orchestration, data quality, and reliability engineering works as intended?',
          'Which assumptions or failure modes should be documented before deployment?',
          'Why does idempotency matter specifically for retry behavior, and what could go wrong in a pipeline that lacks it?',
          'How would a DAG-based orchestrator decide which tasks can run in parallel versus which must wait for a dependency?',
          'What is the difference between a pipeline failing loudly on a schema change versus silently adapting to it, and which is usually safer?',
          'Why is data lineage useful even when a pipeline is running successfully, not just when something breaks?',
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
