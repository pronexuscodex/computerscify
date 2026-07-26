import { UniversityProgram, Course, ProgramType, Topic } from '../types/curriculum';
import { COMPUTER_SCIENCE_PROGRAM } from './programs/computerScience';
import { DATA_SCIENCE_PROGRAM } from './programs/dataScience';
import {
  CANONICAL_COURSES,
  SPECIALIZATION_TRACKS,
  getCanonicalCoursesForProgram,
  projectCourseForProgram,
} from './canonicalRegistry';
import { LEGACY_TO_CANONICAL_COURSE_MAP } from '../services/progressMigration';
import { SHARED_COURSES, getCrossProgramCompletedCourses } from './sharedCourses';
import { ALL_TOPICS } from '../data/curriculumData';

export const PROGRAMS: Record<ProgramType, UniversityProgram> = {
  'computer-science': COMPUTER_SCIENCE_PROGRAM,
  'data-science': DATA_SCIENCE_PROGRAM,
};

// All projected courses from the canonical registry
export const ALL_COURSES: Course[] = CANONICAL_COURSES.map(c => projectCourseForProgram(c, c.programAssignments[0].programId)!);

export function getProgram(programId: ProgramType): UniversityProgram {
  return PROGRAMS[programId] || COMPUTER_SCIENCE_PROGRAM;
}

export function getCourseById(courseId: string, activeProgram?: ProgramType): Course | undefined {
  const canonicalId = LEGACY_TO_CANONICAL_COURSE_MAP[courseId] || courseId;
  const canonical = CANONICAL_COURSES.find(c =>
    c.id === canonicalId ||
    c.code.toLowerCase().replace(/\s+/g, '-') === courseId.toLowerCase() ||
    c.programAssignments.some(pa => pa.displayCode?.toLowerCase().replace(/\s+/g, '-') === courseId.toLowerCase())
  );

  if (!canonical) return undefined;

  const targetProgram = activeProgram || canonical.programAssignments[0].programId;
  return projectCourseForProgram(canonical, targetProgram) || projectCourseForProgram(canonical, canonical.programAssignments[0].programId);
}

export function getCourseByCode(courseCode: string, activeProgram?: ProgramType): Course | undefined {
  const normalized = courseCode.toLowerCase().trim();
  const canonical = CANONICAL_COURSES.find(c =>
    c.code.toLowerCase() === normalized ||
    c.programAssignments.some(pa => pa.displayCode?.toLowerCase() === normalized)
  );

  if (!canonical) return undefined;

  const targetProgram = activeProgram || canonical.programAssignments[0].programId;
  return projectCourseForProgram(canonical, targetProgram) || projectCourseForProgram(canonical, canonical.programAssignments[0].programId);
}

export function getCoursesForProgram(programId: ProgramType): Course[] {
  return getCanonicalCoursesForProgram(programId);
}

export function getTopicsForProgram(programId: ProgramType): Topic[] {
  const programCourses = getCanonicalCoursesForProgram(programId);
  const topics: Topic[] = [];
  const seen = new Set<string>();

  programCourses.forEach(course => {
    if (course.sections) {
      course.sections.forEach(section => {
        if (section.topics) {
          section.topics.forEach(t => {
            if (!seen.has(t.id)) {
              seen.add(t.id);
              topics.push(t);
            }
          });
        }
      });
    }
  });

  if (programId === 'computer-science') {
    ALL_TOPICS.forEach(t => {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        topics.push(t);
      }
    });
  }

  return topics;
}

export function getDefaultCourseIdForProgram(programId: ProgramType): string {
  return programId === 'data-science' ? 'ds-101' : 'cs-101';
}

export function getDefaultTopicIdForProgram(programId: ProgramType): string {
  if (programId === 'data-science') {
    return 'ds101-t1';
  }
  const csTopics = getTopicsForProgram('computer-science');
  return csTopics[0]?.id || 'p0-m1-t1';
}

export function isTopicInProgram(topicId: string, programId: ProgramType): boolean {
  if (!topicId) return false;
  const programTopics = getTopicsForProgram(programId);
  return programTopics.some(t => t.id === topicId || t.slug === topicId);
}

export function isCourseInProgram(courseId: string, programId: ProgramType): boolean {
  if (!courseId) return false;
  const programCourses = getCanonicalCoursesForProgram(programId);
  const cleanId = courseId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return programCourses.some(c =>
    c.id === courseId ||
    c.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
    c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId
  );
}

export function resolveValidTopicForProgram(
  requestedTopicId: string | undefined,
  programId: ProgramType,
  fallbackTopicId?: string
): Topic {
  const programTopics = getTopicsForProgram(programId);

  if (requestedTopicId) {
    const found = programTopics.find(t => t.id === requestedTopicId || t.slug === requestedTopicId);
    if (found) return found;

    const cleanId = requestedTopicId.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanFound = programTopics.find(
      t => t.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId
    );
    if (cleanFound) return cleanFound;
  }

  if (fallbackTopicId) {
    const fallbackFound = programTopics.find(t => t.id === fallbackTopicId || t.slug === fallbackTopicId);
    if (fallbackFound) return fallbackFound;
  }

  const defaultId = getDefaultTopicIdForProgram(programId);
  const defaultTopic = programTopics.find(t => t.id === defaultId) || programTopics[0] || ALL_TOPICS[0];
  return defaultTopic;
}

export function resolveValidCourseForProgram(
  requestedCourseId: string | undefined,
  programId: ProgramType
): Course | undefined {
  const programCourses = getCanonicalCoursesForProgram(programId);
  if (!requestedCourseId) {
    return programCourses[0];
  }

  const cleanId = requestedCourseId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const found = programCourses.find(
    c =>
      c.id === requestedCourseId ||
      c.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
      c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId
  );

  return found || programCourses[0];
}

/**
 * Calculates student progress for a given program, taking into account
 * cross-program canonical course equivalencies.
 */
export function calculateProgramProgress(
  programId: ProgramType,
  completedCourseIds: string[]
) {
  // Expand completed course IDs using canonical mapping and shared course rules
  const canonicalCompleted = completedCourseIds.map(id => LEGACY_TO_CANONICAL_COURSE_MAP[id] || id);
  const expandedCompleted = getCrossProgramCompletedCourses(canonicalCompleted);
  const programCourses = getCoursesForProgram(programId);

  const completedProgramCourses = programCourses.filter(c => expandedCompleted.includes(c.id));
  const totalCoursesCount = programCourses.length;
  const completedCount = completedProgramCourses.length;
  const totalCredits = programCourses.reduce((acc, c) => acc + c.creditHours, 0);
  const earnedCredits = completedProgramCourses.reduce((acc, c) => acc + c.creditHours, 0);

  const percentage = totalCoursesCount > 0 ? Math.round((completedCount / totalCoursesCount) * 100) : 0;

  return {
    completedCount,
    totalCoursesCount,
    earnedCredits,
    totalCredits,
    percentage,
    expandedCompletedIds: expandedCompleted,
  };
}

export function getEquivalentCourseInOtherProgram(courseId: string): Course | undefined {
  const canonicalId = LEGACY_TO_CANONICAL_COURSE_MAP[courseId] || courseId;
  const canonical = CANONICAL_COURSES.find(c => c.id === canonicalId);
  if (!canonical) return undefined;

  const otherAssignment = canonical.programAssignments.find(pa => pa.programId !== canonical.programAssignments[0].programId);
  if (!otherAssignment) {
    const shared = SHARED_COURSES.find(s => s.csCourseId === courseId || s.dsCourseId === courseId);
    if (!shared) return undefined;
    const otherId = shared.csCourseId === courseId ? shared.dsCourseId : shared.csCourseId;
    return getCourseById(otherId);
  }

  return projectCourseForProgram(canonical, otherAssignment.programId);
}

export {
  CANONICAL_COURSES,
  SPECIALIZATION_TRACKS,
  SHARED_COURSES,
  getCrossProgramCompletedCourses,
  getCanonicalCoursesForProgram,
  projectCourseForProgram,
};
