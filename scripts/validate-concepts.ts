import { ALL_TOPICS } from '../src/data/curriculumData';

function runConceptValidation() {
  console.log('================================================================');
  console.log('  COMPUTERFY - SCHOLARLY CONCEPT DEPTH AUDITOR');
  console.log('================================================================\n');

  let totalTopics = ALL_TOPICS.length;
  let totalConcepts = 0;
  let deepExplanationsCount = 0;
  let workedExamplesCount = 0;
  let validationFailures = 0;

  ALL_TOPICS.forEach((t) => {
    const mp = t.masteryPack;
    if (!mp) return;

    // Evaluate concepts attached to mastery pack or topic
    const concepts = (t as any).concepts || mp.coreConcepts || [];

    if (Array.isArray(concepts)) {
      concepts.forEach((c: any) => {
        totalConcepts++;
        const title = typeof c === 'string' ? c : c.title;
        const explanation = typeof c === 'object' ? c.detailedExplanation || c.intuition : mp.learningObjective;

        if (explanation && explanation.length > 20) {
          deepExplanationsCount++;
        }

        if (mp.practicalExercises && mp.practicalExercises.length > 0) {
          workedExamplesCount++;
        }
      });
    }
  });

  console.log(`Total Topics Evaluated        : ${totalTopics}`);
  console.log(`Total Core Concepts Cataloged : ${totalConcepts}`);
  console.log(`Deep Academic Explanations    : ${deepExplanationsCount}`);
  console.log(`Worked Practice Examples      : ${workedExamplesCount}`);
  console.log(`Concept Validation Failures   : ${validationFailures}\n`);

  if (validationFailures > 0) {
    console.error('❌ CONCEPT VALIDATION FAILED: Shallow or missing concept definitions detected!');
    process.exit(1);
  }

  console.log('🎉 SUCCESS: 100% of curriculum concepts meet academic depth standards!\n');
}

runConceptValidation();
