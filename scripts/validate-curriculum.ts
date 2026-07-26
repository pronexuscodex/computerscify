import { validateCurriculum } from '../src/curriculum/validation';
import {
  CANONICAL_COURSES,
  getCanonicalCoursesForProgram,
  SHARED_COURSES,
  getCourseById,
} from '../src/curriculum/index';

function runCurriculumValidation() {
  const args = process.argv.slice(2);
  const csOnly = args.includes('--cs');
  const dsOnly = args.includes('--ds');

  console.log('================================================================');
  console.log('  COMPUTERFY - ACADEMIC CURRICULUM INTEGRITY AUDITOR');
  console.log('================================================================\n');

  const csCourses = getCanonicalCoursesForProgram('computer-science');
  const dsCourses = getCanonicalCoursesForProgram('data-science');

  let targetCourses = CANONICAL_COURSES;
  if (csOnly) {
    console.log('Auditing Target: Computer Science Program\n');
  } else if (dsOnly) {
    console.log('Auditing Target: Data Science Program\n');
  } else {
    console.log('Auditing Target: Complete Dual-Program Curriculum (CS + DS)\n');
  }

  const errors = validateCurriculum();

  console.log(`Canonical Courses Analyzed  : ${CANONICAL_COURSES.length}`);
  console.log(`Computer Science Courses    : ${csCourses.length}`);
  console.log(`Data Science Courses        : ${dsCourses.length}`);
  console.log(`Shared Equivalent Rules     : ${SHARED_COURSES.length}`);
  console.log(`Validation Errors Found     : ${errors.length}\n`);

  if (errors.length > 0) {
    console.error('❌ CURRICULUM VALIDATION ERRORS DETECTED:');
    errors.forEach((err, idx) => {
      console.error(`  [${idx + 1}] [${err.type.toUpperCase()}] Course ${err.courseId}: ${err.message}`);
    });
    process.exit(1);
  }

  // Cross-program check for shared equivalencies
  SHARED_COURSES.forEach((shared) => {
    const csCourse = getCourseById(shared.csCourseId, 'computer-science');
    const dsCourse = getCourseById(shared.dsCourseId, 'data-science');

    if (!csCourse || !dsCourse) {
      console.error(`❌ Shared course mismatch: CS (${shared.csCourseId}) or DS (${shared.dsCourseId}) not found in program projections!`);
      process.exit(1);
    }
  });

  console.log('🎉 SUCCESS: All courses, sections, prerequisites, and shared credit mappings are 100% valid!\n');
}

runCurriculumValidation();

