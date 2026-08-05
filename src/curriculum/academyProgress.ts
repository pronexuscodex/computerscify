import { CANONICAL_COURSES } from './canonicalRegistry';
import { LearnerProgress } from '../types/curriculum';
import { LearningPath } from '../types/learningPaths';

export interface LearningPathProgress {
  completedCourseIds: string[];
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export const isCanonicalCourseComplete = (
  courseId: string,
  progress: Pick<LearnerProgress, 'completedCourseIds' | 'completedTopicIds'>
): boolean => {
  const course = CANONICAL_COURSES.find((candidate) => candidate.id === courseId);
  if (!course) return false;
  if (progress.completedCourseIds.includes(course.id)) return true;
  return course.topicIds.length > 0 && course.topicIds.every((topicId) => progress.completedTopicIds.includes(topicId));
};

export const calculateLearningPathProgress = (
  learningPath: LearningPath,
  progress: Pick<LearnerProgress, 'completedCourseIds' | 'completedTopicIds'>
): LearningPathProgress => {
  const courseIds = [...new Set(learningPath.stages.flatMap((stage) => stage.requiredCourseIds))];
  const completedCourseIds = courseIds.filter((courseId) => isCanonicalCourseComplete(courseId, progress));
  return {
    completedCourseIds,
    completedCount: completedCourseIds.length,
    totalCount: courseIds.length,
    percentage: courseIds.length > 0 ? Math.round((completedCourseIds.length / courseIds.length) * 100) : 0,
  };
};
