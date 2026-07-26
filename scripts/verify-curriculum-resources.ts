import { verifyResource } from '../src/services/resourceVerifier';
import { ALL_MODULES } from '../src/data/curriculumData';

async function runVerification() {
  const args = process.argv.slice(2);
  const isReportOnly = args.includes('--report');

  console.log('====================================================');
  console.log('  COMPUTERFY CURRICULUM RESOURCE VERIFIER PIPELINE');
  console.log('====================================================\n');

  let totalResources = 0;
  let verifiedCount = 0;
  let issuesCount = 0;
  const resultsList: any[] = [];

  for (const mod of ALL_MODULES) {
    if (!mod || !mod.topics) continue;
    for (const topic of mod.topics) {
      if (topic.masteryPack?.primaryLecture) {
        const lec = topic.masteryPack.primaryLecture;
        totalResources++;
        const res = verifyResource({ id: lec.id, title: lec.title, type: 'video', url: lec.url } as any);
        resultsList.push({ module: mod.title, topic: topic.title, ...res });
        if (res.status === 'verified') verifiedCount++;
        else issuesCount++;
      }
      const extraLectures = (topic as any).lectures;
      if (extraLectures && Array.isArray(extraLectures)) {
        for (const lec of extraLectures) {
          totalResources++;
          const res = verifyResource({ id: lec.id, title: lec.title, type: 'video', url: lec.url } as any);
          resultsList.push({ module: mod.title, topic: topic.title, ...res });
          if (res.status === 'verified') verifiedCount++;
          else issuesCount++;
        }
      }
    }
  }

  console.log(`Total Resources Checked: ${totalResources}`);
  console.log(`Verified & Embeddable:   ${verifiedCount}`);
  console.log(`Issues / Webpages:       ${issuesCount}\n`);

  if (issuesCount > 0) {
    console.log('--- ISSUES DETECTED ---');
    resultsList
      .filter((r) => r.status !== 'verified')
      .forEach((r) => {
        console.log(`[${r.module}] ${r.topic} -> ${r.title}`);
        console.log(`  Url: ${r.url}`);
        console.log(`  Issues: ${r.issues.join('; ')}`);
        if (r.suggestedAction) console.log(`  Fix: ${r.suggestedAction}`);
        console.log('');
      });
  } else {
    console.log('All curriculum resources are 100% verified and embeddable!');
  }

  if (issuesCount > 0 && !isReportOnly) {
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error('Resource verification script failed:', err);
  process.exit(1);
});
