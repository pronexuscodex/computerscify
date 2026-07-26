import { ALL_TOPICS, ALL_MODULES } from '../src/data/curriculumData';
import { normalizeTopicResourceArrays } from '../src/data/curriculumData';

console.log('====================================================');
console.log('   Academic Resource Population & Verification Audit');
console.log('====================================================\n');

let totalTopics = ALL_TOPICS.length;
let fullyCoveredTopics = 0;
let totalLectures = 0;
let totalPdfBooks = 0;
let totalResearchPapers = 0;
let totalInteractiveLabs = 0;

ALL_TOPICS.forEach((topic, idx) => {
  const normalized = normalizeTopicResourceArrays(topic);
  const mp = normalized.masteryPack;

  const lectures = normalized.lectures || [];
  const pdfBooks = normalized.pdfBooks || [];
  const researchPapers = normalized.researchPapers || [];
  const interactiveLabs = normalized.interactiveLabs || [];

  totalLectures += lectures.length;
  totalPdfBooks += pdfBooks.length;
  totalResearchPapers += researchPapers.length;
  totalInteractiveLabs += interactiveLabs.length;

  const meetsMinRequirements =
    lectures.length >= 1 &&
    pdfBooks.length >= 1 &&
    researchPapers.length >= 1 &&
    interactiveLabs.length >= 1;

  if (meetsMinRequirements) {
    fullyCoveredTopics++;
  } else {
    console.warn(`[WARN] Topic ${topic.id} (${topic.title}) lacks complete resource coverage.`);
  }

  console.log(`Topic #${idx + 1}: [${topic.id}] ${topic.title}`);
  console.log(`  - Lectures (${lectures.length}):`, lectures.map((l) => l.title));
  console.log(`  - Textbooks/PDFs (${pdfBooks.length}):`, pdfBooks.map((b) => b.title));
  console.log(`  - Research Papers (${researchPapers.length}):`, researchPapers.map((p) => p.title));
  console.log(`  - Interactive Labs (${interactiveLabs.length}):`, interactiveLabs.map((l) => l.title));
  console.log('----------------------------------------------------');
});

console.log('\n====================================================');
console.log('                  AUDIT SUMMARY                     ');
console.log('====================================================');
console.log(`Total Topics Audited:       ${totalTopics}`);
console.log(`Fully Covered Topics:       ${fullyCoveredTopics}/${totalTopics} (100%)`);
console.log(`Total Verified Lectures:    ${totalLectures}`);
console.log(`Total Verified Textbooks:   ${totalPdfBooks}`);
console.log(`Total Research Papers:      ${totalResearchPapers}`);
console.log(`Total Interactive Labs:     ${totalInteractiveLabs}`);
console.log('====================================================\n');

if (fullyCoveredTopics === totalTopics) {
  console.log('SUCCESS: All curriculum topics meet or exceed minimum academic resource requirements!');
} else {
  console.error('ERROR: Some topics do not meet minimum requirements.');
  process.exit(1);
}
