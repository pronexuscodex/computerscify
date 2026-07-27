import { CurriculumPhase, CurriculumModule, Topic, ResearchPaper, BookResource } from '../types/curriculum';
import { CANONICAL_COURSES } from '../curriculum/canonicalRegistry';
import { getCuratedResourcesForTopic } from './curatedResourceManifest';
import { getCorsCompatiblePdfUrl } from '../utils/embedUtils';
import { phase0Modules } from './modules/phase0';
import { phase1MathModules } from './modules/phase1_math';
import { phase2ProgrammingModules } from './modules/phase2_programming';
import { phase3CSModules } from './modules/phase3_cs';
import { phase4DSModules } from './modules/phase4_ds';
import { phase5MLModules } from './modules/phase5_ml';
import { phase6DLModules } from './modules/phase6_dl';
import { phase7MLOpsModules } from './modules/phase7_mlops';
import { phase8SpecializationModules } from './modules/phase8_specializations';

export const ALL_CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    phaseNumber: 0,
    title: 'Phase 0 — Learning & Digital Foundations',
    subtitle: 'From Bits to Operating Systems',
    description: 'Understand how computers represent information, execute binary logic, store data in memory, and process information from absolute first principles.',
    modules: phase0Modules,
  },
  {
    phaseNumber: 1,
    title: 'Phase 1 — Foundational Mathematics',
    subtitle: 'The Mathematical Language of Computing',
    description: 'Master algebra, discrete logic, linear vector spaces, multivariable calculus, and probability required for rigorous Computer Science and Machine Learning.',
    modules: phase1MathModules,
  },
  {
    phaseNumber: 2,
    title: 'Phase 2 — Introductory Programming',
    subtitle: 'Computational Thinking & Data Wrangling',
    description: 'Build algorithmic mastery with Python, vectorized NumPy arrays, tabular pandas, relational SQL, and version-controlled Git workflows.',
    modules: phase2ProgrammingModules,
  },
  {
    phaseNumber: 3,
    title: 'Phase 3 — Core Computer Science',
    subtitle: 'Data Structures, Algorithms & Systems',
    description: 'Analyze time/space complexity, implement trees, graphs, heaps, and shortest path algorithms alongside fundamental OS concepts.',
    modules: phase3CSModules,
  },
  {
    phaseNumber: 4,
    title: 'Phase 4 — Applied Data Science',
    subtitle: 'Analytics, Experiments & Feature Engineering',
    description: 'Conduct A/B testing statistical inference, clean multi-column data, build ETL pipelines, and engineer features.',
    modules: phase4DSModules,
  },
  {
    phaseNumber: 5,
    title: 'Phase 5 — Machine Learning',
    subtitle: 'Statistical Learning Theory from Scratch',
    description: 'Derive loss gradients and build Linear Regression, Logistic Regression, Decision Trees, SVMs, and Clustering from scratch.',
    modules: phase5MLModules,
  },
  {
    phaseNumber: 6,
    title: 'Phase 6 — Deep Learning',
    subtitle: 'Neural Architectures & Transformers',
    description: 'Derive backpropagation computational graphs, activation derivatives, and implement Transformer Scaled Dot-Product Self-Attention.',
    modules: phase6DLModules,
  },
  {
    phaseNumber: 7,
    title: 'Phase 7 — Production Engineering & MLOps',
    subtitle: 'APIs, Containers & Model Deployment',
    description: 'Package models into REST APIs, build Docker containers, automate CI/CD pipelines, and monitor Population Stability Index data drift.',
    modules: phase7MLOpsModules,
  },
  {
    phaseNumber: 8,
    title: 'Phase 8 — Specializations',
    subtitle: 'Distributed Systems & Advanced AI',
    description: 'Explore Raft consensus protocols, CAP theorem trade-offs, scalable data engineering, and responsible AI architectures.',
    modules: phase8SpecializationModules,
  },
];

const rawPhaseModules: CurriculumModule[] = ALL_CURRICULUM_PHASES.flatMap(p => p.modules);

// Convert CanonicalCourses into CurriculumModule representation
const canonicalCourseModules: CurriculumModule[] = CANONICAL_COURSES.map(course => {
  const topics = course.sections ? course.sections.flatMap(s => s.topics) : [];
  return {
    id: course.id,
    phaseId: course.year,
    title: `${course.code}: ${course.title}`,
    slug: course.id,
    category: course.category,
    summary: course.description,
    objective: course.learningOutcomes?.[0] || course.description,
    prerequisiteModuleIds: course.prerequisiteCourseIds || [],
    estimatedHours: course.estimatedHours || 40,
    difficulty: course.year <= 1 ? 'beginner' : course.year <= 2 ? 'intermediate' : 'advanced',
    colorAccent: course.category === 'ds' ? 'coral' : course.category === 'ml' ? 'mint' : course.category === 'math' ? 'lavender' : 'softblue',
    topics: topics,
    capstone: course.capstoneProject || {
      id: `capstone-${course.id}`,
      title: `${course.code} Capstone Milestone`,
      description: course.description,
      constraints: ['Complete all course topics', 'Submit working implementation'],
      expectedDeliverables: ['Verified code repository', 'Technical report'],
      evaluationRubric: [
        { criterion: 'Implementation Correctness', weight: '50%', description: 'Passes automated tests and satisfies spec.' },
        { criterion: 'Code Quality & Documentation', weight: '50%', description: 'Clean architecture and clear documentation.' }
      ]
    }
  };
});

export function normalizeTopicResourceArrays(topic: Topic): Topic {
  const mp = topic.masteryPack;
  const curated = getCuratedResourcesForTopic(topic.id);

  let pdfBooks: BookResource[] = [];
  let researchPapers: ResearchPaper[] = [];

  if (curated && curated.length > 0) {
    const curatedBooksRaw = curated.filter((r) => r.kind !== 'research-paper' && r.kind !== 'academic-notes');
    const curatedPapersRaw = curated.filter((r) => r.kind === 'research-paper' || r.kind === 'academic-notes');

    pdfBooks = curatedBooksRaw.map((r) => {
      const isDirectPdf = r.deliveryMode === 'in-app-pdf-candidate';
      return {
        id: r.id,
        title: r.title,
        authors: r.authors,
        url: r.url,
        pdfUrl: isDirectPdf ? getCorsCompatiblePdfUrl(r.url) : r.url,
        recommendedChapter: mp?.recommendedChapter || 'Full Textbook / Course Materials',
        publisherOrInstitution: r.authors.join(', '),
        openAccess: r.openAccess,
        deliveryMode: r.deliveryMode,
        accessStatus: isDirectPdf ? 'verified' : 'official-web-book',
      };
    });

    researchPapers = curatedPapersRaw.map((r) => {
      const isDirectPdf = r.deliveryMode === 'in-app-pdf-candidate';
      const authoredPaper = [
        mp?.authoritativeResearchSource,
        mp?.modernSurveyOrTutorial,
      ].find(
        (paper) =>
          paper?.title.toLocaleLowerCase() === r.title.toLocaleLowerCase() ||
          (paper?.year === r.year &&
            paper?.authors?.some((author) => r.authors.includes(author)))
      );

      return {
        ...authoredPaper,
        id: r.id,
        topicIds: [topic.id],
        title: r.title,
        authors: r.authors,
        year: r.year || 2020,
        venue: r.venue || 'Academic Repository',
        openAccessUrl: r.url,
        pdfUrl: isDirectPdf ? getCorsCompatiblePdfUrl(r.url) : r.url,
        paperType: r.role === 'foundational' ? 'seminal' : 'applied',
        difficulty: 'intermediate',
        prerequisites: [],
        summary:
          authoredPaper?.summary ||
          `A primary research source selected to connect ${topic.title} with its original academic foundations.`,
        whyItMatters:
          authoredPaper?.whyItMatters ||
          `Shows how the central ideas in ${topic.title} were developed, evaluated, or applied in the research literature.`,
        sectionsToRead:
          authoredPaper?.sectionsToRead || 'Abstract, introduction, and conclusion',
        readingQuestions:
          authoredPaper?.readingQuestions?.length
            ? authoredPaper.readingQuestions
            : [
                `What problem does this work address, and how does its contribution connect to ${topic.title}?`,
              ],
        relatedTopicIds: [topic.id],
        openAccess: r.openAccess,
        deliveryMode: r.deliveryMode,
        accessStatus: 'verified',
        lastVerifiedAt: '2026-07-27',
      };
    });
  }

  if (pdfBooks.length === 0) {
    pdfBooks = topic.pdfBooks?.length
      ? topic.pdfBooks
      : topic.books?.length
      ? topic.books
      : mp?.primaryText
      ? [mp.primaryText]
      : [];
  }

  if (researchPapers.length === 0) {
    researchPapers = topic.researchPapers?.length
      ? topic.researchPapers
      : topic.foundationalPapers?.length
      ? topic.foundationalPapers
      : [
          ...(mp?.authoritativeResearchSource ? [mp.authoritativeResearchSource] : []),
          ...(mp?.modernSurveyOrTutorial ? [mp.modernSurveyOrTutorial] : []),
        ];
  }

  const books = pdfBooks;
  const foundationalPapers = researchPapers;

  const lectureIds = topic.lectureIds?.length
    ? topic.lectureIds
    : mp?.lectureIds?.length
    ? mp.lectureIds
    : [mp?.primaryLecture?.id || `lec-${topic.id}`].filter(Boolean);

  const bookIds = pdfBooks.map((b) => b.id || `book-${topic.id}`);
  const pdfIds = bookIds;
  const foundationalPaperIds = researchPapers.map((p) => p.id || `paper-${topic.id}`);
  const researchPaperIds = foundationalPaperIds;

  const labIds = topic.labIds?.length
    ? topic.labIds
    : mp?.labIds?.length
    ? mp.labIds
    : [mp?.interactiveLab?.id || `lab-${topic.id}`].filter(Boolean);

  const lectures = topic.lectures?.length ? topic.lectures : mp?.primaryLecture ? [mp.primaryLecture] : [];
  const interactiveLabs = topic.interactiveLabs?.length ? topic.interactiveLabs : mp?.interactiveLab ? [mp.interactiveLab] : [];

  if (mp) {
    mp.lectureIds = lectureIds;
    mp.bookIds = bookIds;
    mp.pdfIds = pdfIds;
    mp.foundationalPaperIds = foundationalPaperIds;
    mp.researchPaperIds = researchPaperIds;
    mp.labIds = labIds;
    mp.lectures = lectures;
    mp.pdfBooks = pdfBooks;
    mp.books = books;
    mp.researchPapers = researchPapers;
    mp.foundationalPapers = foundationalPapers;
    mp.interactiveLabs = interactiveLabs;
    if (pdfBooks.length > 0) {
      mp.primaryText = pdfBooks[0];
    }
    if (researchPapers.length > 0) {
      mp.authoritativeResearchSource = researchPapers[0];
    }
  }

  return {
    ...topic,
    lectureIds,
    bookIds,
    pdfIds,
    foundationalPaperIds,
    researchPaperIds,
    labIds,
    lectures,
    pdfBooks,
    books,
    researchPapers,
    foundationalPapers,
    interactiveLabs,
  };
}

// Combine raw phase modules and canonical course modules (deduplicated by ID)
const moduleMap = new Map<string, CurriculumModule>();
rawPhaseModules.forEach(m => moduleMap.set(m.id, m));
canonicalCourseModules.forEach(m => moduleMap.set(m.id, m));

export const ALL_MODULES: CurriculumModule[] = Array.from(moduleMap.values()).map(m => {
  if (m.topics) {
    return {
      ...m,
      topics: m.topics.map(normalizeTopicResourceArrays)
    };
  }
  return m;
});

// Collect all topics from all modules (deduplicated by ID)
const topicMap = new Map<string, Topic>();
ALL_MODULES.forEach(m => {
  if (m.topics) {
    m.topics.forEach(t => {
      const normalized = normalizeTopicResourceArrays(t);
      topicMap.set(normalized.id, normalized);
    });
  }
});

export const ALL_TOPICS: Topic[] = Array.from(topicMap.values());

export function getModuleById(id: string): CurriculumModule | undefined {
  return ALL_MODULES.find(m => m.id === id);
}

export function getTopicById(id: string): Topic | undefined {
  return topicMap.get(id) || ALL_TOPICS.find(t => t.id === id);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return ALL_TOPICS.find(t => t.slug === slug);
}

export function getModuleBySlug(slug: string): CurriculumModule | undefined {
  return ALL_MODULES.find(m => m.slug === slug);
}

export function getAllResearchPapers(): ResearchPaper[] {
  const papers: ResearchPaper[] = [];
  const seenIds = new Set<string>();

  ALL_TOPICS.forEach(topic => {
    const mp = topic.masteryPack;
    const topicPapers = topic.researchPapers || mp?.researchPapers || [];
    topicPapers.forEach(p => {
      if (p && p.id && !seenIds.has(p.id)) {
        seenIds.add(p.id);
        papers.push(p);
      }
    });

    if (mp) {
      if (mp.authoritativeResearchSource && mp.authoritativeResearchSource.id && !seenIds.has(mp.authoritativeResearchSource.id)) {
        seenIds.add(mp.authoritativeResearchSource.id);
        papers.push(mp.authoritativeResearchSource);
      }
      if (mp.modernSurveyOrTutorial && mp.modernSurveyOrTutorial.id && !seenIds.has(mp.modernSurveyOrTutorial.id)) {
        seenIds.add(mp.modernSurveyOrTutorial.id);
        papers.push(mp.modernSurveyOrTutorial);
      }
    }
  });

  return papers;
}

export function getLecturesForTopic(topicOrId: Topic | string) {
  const topic = typeof topicOrId === 'string' ? getTopicById(topicOrId) : topicOrId;
  if (!topic) return [];
  const normalized = normalizeTopicResourceArrays(topic);
  return normalized.lectures || [];
}

export function getPdfBooksForTopic(topicOrId: Topic | string) {
  const topic = typeof topicOrId === 'string' ? getTopicById(topicOrId) : topicOrId;
  if (!topic) return [];
  const normalized = normalizeTopicResourceArrays(topic);
  return normalized.pdfBooks || [];
}

export function getResearchPapersForTopic(topicOrId: Topic | string) {
  const topic = typeof topicOrId === 'string' ? getTopicById(topicOrId) : topicOrId;
  if (!topic) return [];
  const normalized = normalizeTopicResourceArrays(topic);
  return normalized.researchPapers || [];
}

export function getInteractiveLabsForTopic(topicOrId: Topic | string) {
  const topic = typeof topicOrId === 'string' ? getTopicById(topicOrId) : topicOrId;
  if (!topic) return [];
  const normalized = normalizeTopicResourceArrays(topic);
  return normalized.interactiveLabs || [];
}

export function getTopicResources(topicOrId: Topic | string) {
  return {
    lectures: getLecturesForTopic(topicOrId),
    pdfBooks: getPdfBooksForTopic(topicOrId),
    researchPapers: getResearchPapersForTopic(topicOrId),
    interactiveLabs: getInteractiveLabsForTopic(topicOrId),
  };
}
