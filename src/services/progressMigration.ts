import { LearnerProgress } from '../types/curriculum';
import { CANONICAL_COURSES } from '../curriculum/canonicalRegistry';

/**
 * Mapping of legacy/deprecated course IDs to their canonical course IDs.
 */
export const LEGACY_TO_CANONICAL_COURSE_MAP: Record<string, string> = {
  'ds-102': 'cs-102',
  'ds-201': 'cs-201',
  'cs-205': 'ds-202',
  'ds-305': 'cs-305',
  'ds-404': 'cs-404',
  'math-111': 'math-101',
  'math-211': 'math-201',
};

export interface MigrationResult {
  migratedProgress: LearnerProgress;
  changesMade: number;
  migrationLogs: string[];
}

/**
 * Safely migrates learner progress from legacy course IDs to canonical course IDs.
 * Idempotent operation that preserves user data, scores, notes, and bookmarks.
 */
export function migrateLearnerProgress(progress: LearnerProgress): MigrationResult {
  let changesMade = 0;
  const migrationLogs: string[] = [];

  const canonicalSet = new Set(CANONICAL_COURSES.map(c => c.id));
  const newCompletedCourseIds = new Set<string>();

  // Backup existing state to localStorage before mutation if in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const backupKey = `computerfy_progress_backup_${Date.now()}`;
      window.localStorage.setItem(backupKey, JSON.stringify(progress));
      migrationLogs.push(`Created local storage backup: ${backupKey}`);
    } catch {
      // Ignore backup error if storage full
    }
  }

  // 1. Migrate completed course IDs
  for (const courseId of progress.completedCourseIds || []) {
    const canonicalId = LEGACY_TO_CANONICAL_COURSE_MAP[courseId] || courseId;
    if (canonicalId !== courseId) {
      changesMade++;
      migrationLogs.push(`Mapped legacy completed course ID "${courseId}" -> canonical ID "${canonicalId}"`);
    }
    if (canonicalSet.has(canonicalId)) {
      newCompletedCourseIds.add(canonicalId);
    } else {
      // Keep ID if valid custom course, otherwise map
      newCompletedCourseIds.add(canonicalId);
    }
  }

  // 2. Migrate lastVisitedCourseId
  let newLastVisitedCourseId = progress.lastVisitedCourseId;
  if (newLastVisitedCourseId && LEGACY_TO_CANONICAL_COURSE_MAP[newLastVisitedCourseId]) {
    const canonicalId = LEGACY_TO_CANONICAL_COURSE_MAP[newLastVisitedCourseId];
    migrationLogs.push(`Mapped last visited course ID "${newLastVisitedCourseId}" -> "${canonicalId}"`);
    newLastVisitedCourseId = canonicalId;
    changesMade++;
  }

  // 3. Migrate notes
  const newNotes = { ...progress.notes };
  for (const key of Object.keys(newNotes)) {
    if (LEGACY_TO_CANONICAL_COURSE_MAP[key]) {
      const canonicalKey = LEGACY_TO_CANONICAL_COURSE_MAP[key];
      newNotes[canonicalKey] = newNotes[key];
      delete newNotes[key];
      changesMade++;
      migrationLogs.push(`Migrated course note key "${key}" -> "${canonicalKey}"`);
    }
  }

  // 4. Migrate assessment scores
  const newAssessmentScores = { ...progress.assessmentScores };
  for (const key of Object.keys(newAssessmentScores)) {
    // Keys like 'ds-102-midterm' or 'ds-305-final'
    for (const [legacyId, canonicalId] of Object.entries(LEGACY_TO_CANONICAL_COURSE_MAP)) {
      if (key.startsWith(`${legacyId}-`)) {
        const newKey = key.replace(`${legacyId}-`, `${canonicalId}-`);
        // Keep highest score
        const existingScore = newAssessmentScores[newKey] || 0;
        newAssessmentScores[newKey] = Math.max(existingScore, newAssessmentScores[key]);
        delete newAssessmentScores[key];
        changesMade++;
        migrationLogs.push(`Migrated assessment score key "${key}" -> "${newKey}"`);
      }
    }
  }

  // 5. Migrate bookmarks
  const newBookmarks = new Set<string>();
  for (const item of progress.bookmarkedResourceIds || []) {
    let mapped = item;
    for (const [legacyId, canonicalId] of Object.entries(LEGACY_TO_CANONICAL_COURSE_MAP)) {
      if (item === legacyId || item.startsWith(`${legacyId}-`)) {
        mapped = item.replace(legacyId, canonicalId);
        changesMade++;
        migrationLogs.push(`Migrated bookmark "${item}" -> "${mapped}"`);
      }
    }
    newBookmarks.add(mapped);
  }

  const migratedProgress: LearnerProgress = {
    ...progress,
    completedCourseIds: Array.from(newCompletedCourseIds),
    lastVisitedCourseId: newLastVisitedCourseId,
    notes: newNotes,
    assessmentScores: newAssessmentScores,
    bookmarkedResourceIds: Array.from(newBookmarks),
  };

  return {
    migratedProgress,
    changesMade,
    migrationLogs,
  };
}
