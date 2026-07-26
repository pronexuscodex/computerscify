import { ALL_COURSES, PROGRAMS } from './index';

export interface CurriculumValidationError {
  type: 'missing_prerequisite' | 'duplicate_id' | 'empty_sections' | 'missing_resources' | 'invalid_link';
  courseId: string;
  message: string;
}

export function validateCurriculum(): CurriculumValidationError[] {
  const errors: CurriculumValidationError[] = [];
  const courseIds = new Set<string>();

  for (const course of ALL_COURSES) {
    // Check duplicate course IDs
    if (courseIds.has(course.id)) {
      errors.push({
        type: 'duplicate_id',
        courseId: course.id,
        message: `Duplicate course ID found: ${course.id}`,
      });
    }
    courseIds.add(course.id);

    // Check prerequisites exist
    for (const prereqId of course.prerequisiteCourseIds) {
      if (!ALL_COURSES.some(c => c.id === prereqId || c.code.toLowerCase().replace(/\s+/g, '-') === prereqId)) {
        errors.push({
          type: 'missing_prerequisite',
          courseId: course.id,
          message: `Course ${course.code} references non-existent prerequisite: ${prereqId}`,
        });
      }
    }

    // Check sections
    if (!course.sections || course.sections.length === 0) {
      errors.push({
        type: 'empty_sections',
        courseId: course.id,
        message: `Course ${course.code} has no sections or topics defined.`,
      });
    }
  }

  return errors;
}
