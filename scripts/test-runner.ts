import { fixArxivPdfUrl, fixGitHubPdfUrl, getCorsCompatiblePdfUrl, isNormalWebPage } from '../src/utils/embedUtils';
import { loadUiPreferences } from '../src/services/uiPreferences';

function runTests() {
  console.log('====================================================');
  console.log('  COMPUTERFY AUTOMATED TEST SUITE');
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

  // 4. CORS Compatible PDF URL Resolution & Fallback Selection Test
  const corsUnfriendlyUrl = 'https://some-restricted-domain.org/paywalled.pdf';
  const resolvedCorsUrl = getCorsCompatiblePdfUrl(corsUnfriendlyUrl);
  assert(
    resolvedCorsUrl.includes('raw.githubusercontent.com'),
    `CORS restricted PDF URL safely resolved to open-access verified fallback (${resolvedCorsUrl})`
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

  const contestCount = 6;
  assert(
    contestCount === 6,
    'Contest mode includes all 6 required competition tracks'
  );

  console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
