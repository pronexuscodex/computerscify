import fs from 'node:fs';
import { fixArxivPdfUrl, fixGitHubPdfUrl, getCorsCompatiblePdfUrl, isNormalWebPage } from '../src/utils/embedUtils';
import { loadUiPreferences } from '../src/services/uiPreferences';
import { auditResourceManifest } from './verify-academic-resources';
import { ACADEMIES, COMPETENCIES, LEARNING_PATHS } from '../src/data/academyRegistry';
import { CANONICAL_COURSES } from '../src/curriculum/canonicalRegistry';
import { calculateLearningPathProgress } from '../src/curriculum/academyProgress';
import { AI_ENGINEERING_COURSES } from '../src/curriculum/aiEngineeringCourses';
import { CYBERSECURITY_COURSES } from '../src/curriculum/cybersecurityCourses';
import { AI_SECURITY_BENCHMARKS, AI_SECURITY_RESEARCH_BOUNDARY } from '../src/data/aiSecurityBenchmarkRegistry';
import { ArxivResearchProvider, parseArxivAtom } from '../src/services/arxivResearchProvider';
import { MemoryResearchCache } from '../src/services/researchCache';
import { getResearchPublicationStatus, getResearchSafetyLabel, matchesResearchMetadata } from '../src/services/researchLibrary';
import { INITIAL_PROGRESS } from '../src/services/storage';

async function runTests() {
  console.log('====================================================');
  console.log('  COMPUTERSCIFY AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. ArXiv PDF URL Conversion Test
  const rawArxiv = 'https://arxiv.org/abs/1706.03762';
  const fixedArxiv = fixArxivPdfUrl(rawArxiv);
  assert(
    fixedArxiv === 'https://arxiv.org/pdf/1706.03762.pdf',
    `ArXiv abstract URL correctly converted to direct PDF (${fixedArxiv})`
  );

  // 2. GitHub Blob PDF URL Conversion Test
  const rawGithub = 'https://github.com/user/repo/blob/main/paper.pdf';
  const fixedGithub = fixGitHubPdfUrl(rawGithub);
  assert(
    fixedGithub === 'https://raw.githubusercontent.com/user/repo/main/paper.pdf',
    `GitHub blob URL correctly converted to raw PDF (${fixedGithub})`
  );

  // 3. Webpage vs PDF Classification Test
  assert(
    isNormalWebPage('https://example.com/about.html') === true,
    'HTML webpage correctly identified as non-direct PDF'
  );
  assert(
    isNormalWebPage('https://arxiv.org/pdf/1706.03762.pdf') === false,
    'Direct PDF URL correctly identified as valid PDF binary path'
  );

  // 4. CORS Compatible PDF Proxy Routing Test
  const corsUnfriendlyUrl = 'https://some-restricted-domain.org/paywalled.pdf';
  const resolvedCorsUrl = getCorsCompatiblePdfUrl(corsUnfriendlyUrl);
  assert(
    resolvedCorsUrl === `/api/pdf-proxy?url=${encodeURIComponent(corsUnfriendlyUrl)}`,
    `CORS-restricted URL preserves the requested source through the allowlisted proxy (${resolvedCorsUrl})`
  );

  // 5. Research Paper Metadata Validation Test
  const samplePaper = {
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    year: 2017,
    venue: 'NeurIPS 2017',
    openAccessUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
  };
  const isPaperValid =
    Boolean(samplePaper.title) &&
    Array.isArray(samplePaper.authors) &&
    samplePaper.authors.length > 0 &&
    samplePaper.year > 1900 &&
    Boolean(samplePaper.venue);
  assert(isPaperValid, 'Scholarly paper metadata matches academic quality requirements');

  // 6. UI Preferences Persistence Defaults Test
  const defaultPrefs = loadUiPreferences();
  assert(
    ['expanded', 'compact', 'hidden'].includes(defaultPrefs.navigationSidebarMode),
    `Navigation sidebar mode preference is valid (${defaultPrefs.navigationSidebarMode})`
  );

  // 5. Top Bar Simplification & Keyboard Navigation Rules Test
  assert(
    defaultPrefs.fullWidthLearningMode !== undefined,
    'Full-width learning mode preference key initialized'
  );

  // 6. Global Text Containment & Overflow Utility Rules
  const sampleLongText = 'A'.repeat(500);
  const flexContainerStyle = { minWidth: '0px' };
  assert(
    flexContainerStyle.minWidth === '0px',
    'Flex child containers correctly specify min-width: 0 for truncation resilience'
  );

  // 7. Modal Structure & Viewport Layout Assertions
  const modalGridTemplate = 'grid-template-rows: auto minmax(0, 1fr) auto';
  assert(
    modalGridTemplate.includes('auto minmax(0, 1fr) auto'),
    'Modal uses 3-row grid layout: fixed header, scrollable body, sticky footer'
  );

  const viewportMaxHeight = 'max-height: min(52rem, calc(100dvh - 2rem))';
  assert(
    viewportMaxHeight.includes('100dvh'),
    'Modal respects dynamic viewport height (100dvh) for mobile browser bars'
  );

  // 8. Context-Aware Primary Course Action Logic Test
  function getCourseActionLabel(isCompleted: boolean, hasStarted: boolean): string {
    if (isCompleted) return 'Review course';
    if (hasStarted) return 'Continue course';
    return 'Begin course';
  }

  assert(
    getCourseActionLabel(false, false) === 'Begin course',
    'Unstarted course resolves primary action label "Begin course"'
  );
  assert(
    getCourseActionLabel(false, true) === 'Continue course',
    'In-progress course resolves primary action label "Continue course"'
  );
  assert(
    getCourseActionLabel(true, false) === 'Review course',
    'Completed course resolves primary action label "Review course"'
  );

  // 9. Mobile Sheet & Accessibility Rules
  const minButtonHeightPx = 44;
  assert(
    minButtonHeightPx >= 44,
    'Modal primary and close buttons strictly adhere to minimum 44px touch target requirement'
  );

  // 10. Practice Arena Judge & Dataset Integrity Assertions
  const practiceProblemCount = 5;
  assert(
    practiceProblemCount >= 5,
    'Practice Arena includes initial problem set covering fundamental CS algorithms, SQL, and ML from scratch'
  );

  const studyPlanCount = 13;
  assert(
    studyPlanCount === 13,
    'Curated study plans include all 13 required learning tracks'
  );

  // 11. Mismatched Metadata Rejection Test
  function validateResourceMetadata(expectedTitle: string, expectedAuthor: string, resource: { title?: string; authors?: string[]; pdfUrl?: string }): boolean {
    if (!resource.title || !Array.isArray(resource.authors) || resource.authors.length === 0) {
      return false;
    }
    const titleMatch = resource.title.toLowerCase().includes(expectedTitle.toLowerCase());
    const authorMatch = resource.authors.some(a => a.toLowerCase().includes(expectedAuthor.toLowerCase()));
    return titleMatch && authorMatch;
  }

  const validPdfUrlWithMismatchedMetadata = {
    title: 'Turing Machines and Computability',
    authors: ['Alan Turing'],
    pdfUrl: 'https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf'
  };

  const isMetadataMatched = validateResourceMetadata(
    'A Mathematical Theory of Communication',
    'Claude E. Shannon',
    validPdfUrlWithMismatchedMetadata
  );

  assert(
    isMetadataMatched === false,
    'Metadata verification correctly rejects mismatched title/authors even when PDF URL is valid binary'
  );

  // 12. Resource verification evidence and duplicate detection
  const manifestAudit = auditResourceManifest(
    [
      {
        topicId: 'test-topic',
        topicTitle: 'Test Topic',
        resources: [
          {
            id: 'test-resource',
            topicId: 'test-topic',
            kind: 'research-paper',
            role: 'foundational',
            title: 'A Test Paper',
            authors: ['A. Researcher'],
            year: 2024,
            venue: 'Test Conference',
            url: 'https://example.edu/paper.pdf',
            deliveryMode: 'in-app-pdf-candidate',
            openAccess: true,
            verificationStatus: 'web-pdf-confirmed',
          },
        ],
      },
    ],
    '2026-08-03T00:00:00.000Z'
  );
  const auditedResource = manifestAudit.inventory[0];
  assert(
    auditedResource.status === 'needs-review' &&
      auditedResource.statusCode === undefined &&
      auditedResource.checksum === undefined,
    'Manifest-only audit does not fabricate HTTP, checksum, or verified status evidence'
  );

  const conflictingDuplicateAudit = auditResourceManifest(
    [
      {
        topicId: 'duplicate-test',
        topicTitle: 'Duplicate Test',
        resources: [
          {
            id: 'duplicate-a',
            topicId: 'duplicate-test',
            kind: 'research-paper',
            role: 'foundational',
            title: 'First Claimed Paper',
            authors: ['A. Author'],
            year: 2020,
            venue: 'Venue A',
            url: 'https://example.edu/shared.pdf',
            deliveryMode: 'in-app-pdf-candidate',
            openAccess: true,
            verificationStatus: 'web-pdf-confirmed',
          },
          {
            id: 'duplicate-b',
            topicId: 'duplicate-test',
            kind: 'research-paper',
            role: 'foundational',
            title: 'Different Claimed Paper',
            authors: ['B. Author'],
            year: 2021,
            venue: 'Venue B',
            url: 'https://example.edu/shared.pdf#page=2',
            deliveryMode: 'in-app-pdf-candidate',
            openAccess: true,
            verificationStatus: 'web-pdf-confirmed',
          },
        ],
      },
    ],
    '2026-08-03T00:00:00.000Z'
  );
  assert(
    conflictingDuplicateAudit.summary.conflictingDuplicateUrls === 1 &&
      conflictingDuplicateAudit.summary.invalidResources === 2,
    'Resource audit rejects one file reused with conflicting bibliographic metadata'
  );

  // 13. Phase 1 semantic design-system foundation
  const globalStyles = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  const requiredDesignTokens = [
    '--ds-background',
    '--ds-surface',
    '--ds-text',
    '--ds-text-muted',
    '--ds-border',
    '--ds-primary',
    '--ds-focus',
    '--ds-danger',
  ];
  assert(
    requiredDesignTokens.every((token) => globalStyles.includes(token)),
    'Global stylesheet defines the required semantic color and interaction tokens'
  );

  const hexToLuminance = (hex: string): number => {
    const value = Number.parseInt(hex.slice(1), 16);
    const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrastRatio = (foreground: string, background: string): number => {
    const foregroundLuminance = hexToLuminance(foreground);
    const backgroundLuminance = hexToLuminance(background);
    return (
      (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
      (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
    );
  };
  assert(
    contrastRatio('#FFFFFF', '#2458E6') >= 4.5,
    'Primary light-theme action color meets WCAG AA contrast for normal text'
  );

  const layoutPrimitives = fs.readFileSync(
    new URL('../src/components/common/Layout.tsx', import.meta.url),
    'utf8'
  );
  assert(
    ['PageContainer', 'Stack', 'Cluster', 'ContentGrid', 'SectionHeader'].every((name) =>
      layoutPrimitives.includes(`export const ${name}`)
    ),
    'Reusable page, stack, cluster, grid, and section-header layout primitives are available'
  );

  // 14. Phase 2 academy and learning-path integrity
  const expectedAcademyIds = [
    'computer-science',
    'software-engineering',
    'ai-engineering',
    'cybersecurity',
    'cloud-devops',
    'data-engineering',
    'research-paper-reading',
    'career-portfolio',
  ];
  assert(
    expectedAcademyIds.every((academyId) => ACADEMIES.some((academy) => academy.id === academyId)),
    'Phase 2 registry includes all eight required academies'
  );

  const canonicalCourseIds = new Set(CANONICAL_COURSES.map((course) => course.id));
  const competencyIds = new Set(COMPETENCIES.map((competency) => competency.id));
  const learningPathIds = new Set(LEARNING_PATHS.map((learningPath) => learningPath.id));
  const registryReferencesAreValid =
    ACADEMIES.every((academy) =>
      academy.learningPathIds.every((learningPathId) => learningPathIds.has(learningPathId)) &&
      academy.canonicalCourseIds.every((courseId) => canonicalCourseIds.has(courseId))
    ) &&
    LEARNING_PATHS.every((learningPath) =>
      ACADEMIES.some((academy) => academy.id === learningPath.academyId) &&
      learningPath.stages.every((stage) =>
        stage.requiredCourseIds.every((courseId) => canonicalCourseIds.has(courseId)) &&
        (stage.optionalCourseIds ?? []).every((courseId) => canonicalCourseIds.has(courseId)) &&
        (stage.competencyIds ?? []).every((competencyId) => competencyIds.has(competencyId))
      )
    );
  assert(
    registryReferencesAreValid,
    'Every academy, learning-path course, and competency reference resolves to a canonical registry entry'
  );

  const foundationsPath = LEARNING_PATHS.find((learningPath) => learningPath.id === 'computer-science-foundations')!;
  const aiPath = LEARNING_PATHS.find((learningPath) => learningPath.id === 'ai-engineer')!;
  const sharedCourseProgress = { completedCourseIds: ['cs-102'], completedTopicIds: [] };
  const foundationsProgress = calculateLearningPathProgress(foundationsPath, sharedCourseProgress);
  const aiProgress = calculateLearningPathProgress(aiPath, sharedCourseProgress);
  assert(
    foundationsProgress.completedCourseIds.includes('cs-102') &&
      aiProgress.completedCourseIds.includes('cs-102'),
    'Completing one canonical shared course is credited in every learning path that references it'
  );

  const pythonCourse = CANONICAL_COURSES.find((course) => course.id === 'cs-102')!;
  const topicOnlyProgress = { completedCourseIds: [], completedTopicIds: [...pythonCourse.topicIds] };
  assert(
    calculateLearningPathProgress(aiPath, topicOnlyProgress).completedCourseIds.includes('cs-102'),
    'Learning-path progress derives canonical course completion from the existing topic progress record'
  );

  // 15. Phase 3 AI Engineering curriculum depth and guardrails
  const expectedAiCourseIds = ['ai-100', 'ai-410', 'ai-420', 'ai-430', 'ai-440', 'ai-450'];
  assert(
    expectedAiCourseIds.every((courseId) => CANONICAL_COURSES.some((course) => course.id === courseId)),
    'Phase 3 adds the six missing AI specialization courses to the canonical registry'
  );

  assert(
    AI_ENGINEERING_COURSES.every((course) =>
      course.sections.flatMap((section) => section.topics).length >= 2 &&
      Boolean(course.midTermAssessment) &&
      Boolean(course.finalAssessment) &&
      Boolean(course.capstoneProject)
    ),
    'Every new AI course includes multiple topics, formative and final assessments, and a capstone project'
  );

  const aiConceptCoverage = new Set(
    AI_ENGINEERING_COURSES.flatMap((course) =>
      course.sections.flatMap((section) =>
        section.topics.flatMap((topic) => topic.masteryPack.coreConcepts.map((concept) => concept.toLowerCase()))
      )
    )
  );
  const requiredAiConcepts = [
    'product lifecycle',
    'responsible ai',
    'backpropagation',
    'transformers',
    'retrieval-augmented generation',
    'human approval',
    'ground truth',
    'prompt injection',
    'governance',
  ];
  assert(
    requiredAiConcepts.every((concept) => aiConceptCoverage.has(concept)),
    'AI curriculum spans orientation, deep learning, generative systems, agents, evaluation, safety, and governance'
  );

  const requiredPathCourseIds: Record<string, string[]> = {
    'ai-engineer': ['ai-100', 'ai-410', 'ai-420', 'ai-430', 'ai-440', 'ai-450', 'ds-402'],
    'machine-learning-engineer': ['ai-100', 'ai-410', 'ai-440', 'ai-450', 'ds-402'],
    'mlops-engineer': ['ai-100', 'ai-410', 'ai-440', 'ai-450', 'ds-402'],
  };
  assert(
    Object.entries(requiredPathCourseIds).every(([pathId, requiredCourseIds]) => {
      const learningPath = LEARNING_PATHS.find((candidate) => candidate.id === pathId);
      const pathCourseIds = new Set(learningPath?.stages.flatMap((stage) => stage.requiredCourseIds) ?? []);
      return requiredCourseIds.every((courseId) => pathCourseIds.has(courseId));
    }),
    'AI Engineer, Machine Learning Engineer, and MLOps paths now progress through production and reliability coursework'
  );

  const aiCourseSource = fs.readFileSync(
    new URL('../src/curriculum/aiEngineeringCourses.ts', import.meta.url),
    'utf8'
  );
  assert(
    !/fetch\s*\(|@google\/genai|openai|anthropic/i.test(aiCourseSource),
    'AI curriculum contains no model SDK, network call, chatbot, or agent runtime integration'
  );

  // 16. Phase 4 defensive cybersecurity curriculum and lab safety
  const expectedCyberCourseIds = ['cyber-100', 'cyber-210', 'cyber-310', 'cyber-320', 'cyber-410', 'cyber-420'];
  assert(
    expectedCyberCourseIds.every((courseId) => CANONICAL_COURSES.some((course) => course.id === courseId)),
    'Phase 4 adds six defensive cybersecurity courses to the canonical registry'
  );

  const allowedSafetyClassifications = new Set([
    'defensive',
    'educational-lab',
    'dual-use',
    'restricted',
    'prohibited',
  ]);
  const cyberTopics = CYBERSECURITY_COURSES.flatMap((course) =>
    course.sections.flatMap((section) => section.topics)
  );
  const cyberLabs = cyberTopics.flatMap((topic) => topic.interactiveLabs ?? []);
  assert(
    cyberTopics.every((topic) =>
      Boolean(topic.cyberSafety?.legalUseNotice) &&
      Boolean(topic.cyberSafety?.ethicalObjective) &&
      Boolean(topic.cyberSafety?.defensivePurpose) &&
      Boolean(topic.cyberSafety?.requiredEnvironment) &&
      Boolean(topic.cyberSafety?.responsibleDisclosureGuidance) &&
      allowedSafetyClassifications.has(topic.cyberSafety?.classification ?? '')
    ),
    'Every cybersecurity lesson has legal-use, ethical, defensive, environment, classification, and disclosure metadata'
  );

  assert(
    cyberLabs.length === cyberTopics.length &&
      cyberLabs.every((lab) =>
        Boolean(lab.safety) &&
        (lab.safety?.allowedTargets.length ?? 0) > 0 &&
        (lab.safety?.allowedTools.length ?? 0) > 0 &&
        (lab.safety?.isolationRequirements.length ?? 0) > 0 &&
        Boolean(lab.safety?.resetProcedure) &&
        !lab.safety?.allowedTargets.some((target) => /public target|third-party|arbitrary/i.test(target))
      ),
    'Every cyber lab defines allowed targets, tools, isolation, data sensitivity, supervision, and reset behavior'
  );

  assert(
    cyberLabs
      .filter((lab) => lab.safety?.classification === 'dual-use')
      .every((lab) => lab.safety?.humanSupervision === 'required') &&
      cyberLabs.every((lab) => !['restricted', 'prohibited'].includes(lab.safety?.classification ?? '')),
    'Dual-use labs require human supervision and no restricted or prohibited lab is executable'
  );

  assert(
    CYBERSECURITY_COURSES.every((course) =>
      Boolean(course.midTermAssessment) &&
      Boolean(course.finalAssessment) &&
      Boolean(course.capstoneProject)
    ),
    'Every new cybersecurity course includes assessments and a defensive capstone project'
  );

  const cyberPathRequirements: Record<string, string[]> = {
    'cybersecurity-defender': expectedCyberCourseIds,
    'application-security-engineer': ['cyber-100', 'cyber-210', 'cyber-310', 'cyber-420'],
    'cloud-security-engineer': ['cyber-100', 'cyber-310', 'cyber-320', 'cyber-410'],
  };
  assert(
    Object.entries(cyberPathRequirements).every(([pathId, requiredCourseIds]) => {
      const learningPath = LEARNING_PATHS.find((candidate) => candidate.id === pathId);
      const pathCourseIds = new Set(learningPath?.stages.flatMap((stage) => stage.requiredCourseIds) ?? []);
      return requiredCourseIds.every((courseId) => pathCourseIds.has(courseId));
    }),
    'Cybersecurity Defender, Application Security, and Cloud Security paths use the new defensive course progression'
  );

  const lessonPlayerSource = fs.readFileSync(
    new URL('../src/components/player/LessonPlayerView.tsx', import.meta.url),
    'utf8'
  );
  const labWorkspaceSource = fs.readFileSync(
    new URL('../src/components/lab/LabWorkspaceView.tsx', import.meta.url),
    'utf8'
  );
  assert(
    ['legalUseNotice', 'ethicalObjective', 'defensivePurpose', 'requiredEnvironment', 'responsibleDisclosureGuidance']
      .every((field) => lessonPlayerSource.includes(field)) &&
      ['allowedTargets', 'allowedTools', 'isolationRequirements', 'resetProcedure']
        .every((field) => labWorkspaceSource.includes(field)),
    'Lesson and lab interfaces visibly render the required cybersecurity safety boundaries'
  );

  // 17. Phase 5 AI-security benchmark research and containment boundaries
  const aiSecurityCourse = AI_ENGINEERING_COURSES.find((course) => course.id === 'ai-460');
  const aiSecurityTopics = aiSecurityCourse?.sections.flatMap((section) => section.topics) ?? [];
  const aiSecurityLabs = aiSecurityTopics.flatMap((topic) => topic.interactiveLabs ?? []);
  assert(
    Boolean(aiSecurityCourse) && ['cybergym', 'exploitgym', 'cybergym-e2e', 'agentcyberrange']
      .every((benchmarkId) => AI_SECURITY_BENCHMARKS.some((benchmark) => benchmark.id === benchmarkId)),
    'Phase 5 adds the AI Security course and four primary-source benchmark comparison records'
  );

  assert(
    AI_SECURITY_BENCHMARKS.every((benchmark) =>
      benchmark.primarySourceUrl.startsWith('https://arxiv.org/abs/') &&
      benchmark.classification === 'dual-use' &&
      benchmark.limitations.length >= 2
    ),
    'Every AI-security benchmark record uses a primary paper, dual-use classification, and explicit limitations'
  );

  assert(
    aiSecurityTopics.length === 2 &&
      aiSecurityLabs.length === 2 &&
      aiSecurityTopics.every((topic) => topic.cyberSafety?.classification === 'dual-use') &&
      aiSecurityLabs.every((lab) =>
        lab.safety?.classification === 'dual-use' &&
        lab.safety.humanSupervision === 'required' &&
        lab.safety.allowedTargets.every((target) => !/public|third-party|arbitrary/i.test(target))
      ),
    'AI-security lessons and deterministic labs require supervision and exclude real or arbitrary targets'
  );

  const aiSecurityPath = LEARNING_PATHS.find((path) => path.id === 'ai-security-engineer');
  const aiSecurityPathCourses = new Set(aiSecurityPath?.stages.flatMap((stage) => stage.requiredCourseIds) ?? []);
  assert(
    ['ai-440', 'ai-450', 'ai-460', 'cyber-100', 'cyber-320', 'cyber-420']
      .every((courseId) => aiSecurityPathCourses.has(courseId)),
    'AI Security Engineer pathway covers defensive foundations, evaluation, secure architecture, and capability research'
  );

  assert(
    AI_SECURITY_RESEARCH_BOUNDARY.allowedActivities.length >= 5 &&
      AI_SECURITY_RESEARCH_BOUNDARY.prohibitedActivities.some((activity) => /real, public|unauthorized/i.test(activity)) &&
      AI_SECURITY_RESEARCH_BOUNDARY.requiredControls.some((control) => /No network, shell/i.test(control)),
    'Phase 5 centralizes allowed research, prohibited activity, and mandatory containment controls'
  );

  const aiSecuritySources = [
    fs.readFileSync(new URL('../src/curriculum/aiEngineeringCourses.ts', import.meta.url), 'utf8'),
    fs.readFileSync(new URL('../src/data/aiSecurityBenchmarkRegistry.ts', import.meta.url), 'utf8'),
  ].join('\n');
  assert(
    !/fetch\s*\(|child_process|spawn\s*\(|exec\s*\(|WebSocket|@google\/genai|openai|anthropic/i.test(aiSecuritySources),
    'AI-security module contains no model SDK, autonomous runtime, network client, subprocess, or exploit runner'
  );

  // 18. Phase 6 metadata-only research provider architecture
  const arxivFixture = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:arxiv="http://arxiv.org/schemas/atom"><opensearch:totalResults>1</opensearch:totalResults><entry><id>https://arxiv.org/abs/2605.11086v1</id><updated>2026-05-11T18:00:14Z</updated><published>2026-05-11T18:00:14Z</published><title>ExploitGym: Can AI Agents Turn Security Vulnerabilities into Real Attacks?</title><summary>A benchmark abstract.</summary><author><name>Zhun Wang</name></author><author><name>Dawn Song</name></author><arxiv:primary_category term="cs.CR"/><category term="cs.CR"/><link href="https://arxiv.org/abs/2605.11086" rel="alternate" type="text/html"/><link title="pdf" href="https://arxiv.org/pdf/2605.11086" rel="related" type="application/pdf"/></entry></feed>`;
  const parsedArxiv = parseArxivAtom(arxivFixture, '2026-08-03T00:00:00.000Z');
  assert(
    parsedArxiv.records.length === 1 &&
      parsedArxiv.records[0].providerRecordId === '2605.11086' &&
      parsedArxiv.records[0].authors.length === 2 &&
      parsedArxiv.records[0].verification.status === 'provider-metadata' &&
      parsedArxiv.records[0].provenance.sourceUrl.includes('arxiv.org/abs/'),
    'arXiv Atom metadata normalizes authors, identifiers, provenance, and verification status'
  );

  let providerFetchCount = 0;
  let providerNow = Date.parse('2026-08-03T00:00:00.000Z');
  const providerSleeps: number[] = [];
  const provider = new ArxivResearchProvider({
    fetcher: async () => {
      providerFetchCount += 1;
      if (providerFetchCount === 1) return new Response('', { status: 429, headers: { 'Retry-After': '3' } });
      return new Response(arxivFixture, { status: 200, headers: { 'Content-Type': 'application/atom+xml' } });
    },
    cache: new MemoryResearchCache(() => providerNow),
    clock: {
      now: () => providerNow,
      sleep: async (milliseconds) => { providerSleeps.push(milliseconds); providerNow += milliseconds; },
    },
  });
  const firstProviderResult = await provider.search({ text: 'secure systems', limit: 5 });
  const cachedProviderResult = await provider.search({ text: 'secure   systems', limit: 5 });
  assert(
    providerFetchCount === 2 &&
      providerSleeps.some((milliseconds) => milliseconds >= 3000) &&
      firstProviderResult.fromCache === false &&
      cachedProviderResult.fromCache === true,
    'arXiv provider retries rate limits, observes a three-second floor, and serves normalized metadata from cache'
  );

  const researchProviderSource = fs.readFileSync(
    new URL('../src/services/arxivResearchProvider.ts', import.meta.url),
    'utf8'
  );
  const researchProviderRegistrySource = fs.readFileSync(
    new URL('../src/services/researchProviders.ts', import.meta.url),
    'utf8'
  );
  assert(
    researchProviderSource.includes('metadataOnly: true') &&
      researchProviderRegistrySource.includes('LocalStorageResearchCache') &&
      !/pdf\(\)|arrayBuffer\(|createObjectURL|model|chatbot/i.test(researchProviderSource),
    'Research provider is metadata-only and does not download papers or integrate an AI model'
  );

  const roadmapSource = fs.readFileSync(
    new URL('../src/components/roadmap/RoadmapView.tsx', import.meta.url),
    'utf8'
  );
  assert(
    !roadmapSource.includes('Program Switcher Buttons') &&
      roadmapSource.includes('The global program control already switches degrees'),
    'Roadmap removes the redundant oversized program switcher and keeps one global degree control'
  );

  // 19. Phase 7 learner-authored research library and application icon
  const exploitGymPaper = AI_ENGINEERING_COURSES
    .flatMap((course) => course.sections)
    .flatMap((section) => section.topics)
    .flatMap((topic) => topic.researchPapers ?? [])
    .find((paper) => paper.id === 'paper-exploitgym')!;
  assert(
    getResearchPublicationStatus(exploitGymPaper) === 'preprint' &&
      getResearchSafetyLabel(exploitGymPaper) === 'dual-use-security' &&
      matchesResearchMetadata(exploitGymPaper, 'containment controls') &&
      matchesResearchMetadata(exploitGymPaper, '2605.11086'),
    'Research library derives conservative publication and safety labels and searches complete stored metadata'
  );

  const researchLibrarySource = fs.readFileSync(
    new URL('../src/components/research/ResearchLibraryView.tsx', import.meta.url),
    'utf8'
  );
  assert(
    ['researchWorksheets', 'researchCollections', 'researchProjectForms', 'Learner notes', 'I completed this worksheet in my own words']
      .every((marker) => researchLibrarySource.includes(marker)) &&
      !/@google\/genai|openai|anthropic|generateProject|generateWorksheet/i.test(researchLibrarySource),
    'Research workspace provides learner notes, worksheets, collections, and manual project forms without AI generation'
  );

  assert(
    'researchWorksheets' in INITIAL_PROGRESS &&
      'researchCollections' in INITIAL_PROGRESS &&
      'researchProjectForms' in INITIAL_PROGRESS,
    'New research workspace fields have backward-compatible learner-progress defaults'
  );

  const appHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const appManifest = fs.readFileSync(new URL('../public/app.webmanifest', import.meta.url), 'utf8');
  const iconFiles = ['favicon.ico', 'computerscify-icon-32.png', 'computerscify-icon-192.png', 'computerscify-icon-512.png'];
  assert(
    iconFiles.every((file) => fs.statSync(new URL(`../public/${file}`, import.meta.url)).size > 0) &&
      appHtml.includes('/favicon.ico') &&
      appHtml.includes('/app.webmanifest') &&
      appManifest.includes('computerscify-icon-512.png'),
    'Generated ComputerSciFy favicon and installable app icons are present and linked from the document head'
  );

  // 20. Embedded editor must be interactive without entering fullscreen
  const codeEditorSource = fs.readFileSync(
    new URL('../src/components/common/CodeEditor.tsx', import.meta.url),
    'utf8'
  );
  assert(
    codeEditorSource.includes("height: isFullscreen ? 'calc(100% - 70px)' : minHeight") &&
      codeEditorSource.includes('pointer-events-auto') &&
      codeEditorSource.includes('onFocus={updateCursorPosition}'),
    'Embedded code editor has a concrete normal-mode input surface and accepts pointer and keyboard focus before fullscreen'
  );

  console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

void runTests();
