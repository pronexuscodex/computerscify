import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { LearnerProgress } from '../types/curriculum';
import { migrateLearnerProgress } from './progressMigration';

interface ComputerfyDB extends DBSchema {
  progress: {
    key: string;
    value: LearnerProgress;
  };
  notes: {
    key: string;
    value: {
      id: string;
      targetId: string;
      targetType: 'topic' | 'paper' | 'module' | 'capstone';
      title: string;
      content: string;
      updatedAt: string;
    };
  };
  labDrafts: {
    key: string;
    value: {
      labId: string;
      code: string;
      savedAt: string;
    };
  };
}

const DB_NAME = 'computerfy_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ComputerfyDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ComputerfyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress');
        }
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('labDrafts')) {
          db.createObjectStore('labDrafts', { keyPath: 'labId' });
        }
      },
    });
  }
  return dbPromise;
}

export const INITIAL_PROGRESS: LearnerProgress = {
  completedCourseIds: [],
  completedTopicIds: [],
  completedModuleIds: [],
  bookmarkedResourceIds: [],
  readPaperIds: [],
  notes: {},
  researchWorksheets: {},
  researchCollections: [],
  researchProjectForms: [],
  labCodes: {},
  capstoneNotes: {},
  masteryChecklistStatus: {},
  pdfReadingState: {},
  videoPlaybackState: {},
  assessmentScores: {},
  lastVisitedTopicId: 'p0-m1-t1',
  lastVisitedCourseId: 'cs-101',
  selectedProgram: 'computer-science',
  studyStreakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  displayName: 'Learner',
  preferredTheme: 'light',
  fontSize: 'normal',
  reducedMotion: false,
};

export async function loadLearnerProgress(): Promise<LearnerProgress> {
  try {
    const db = await getDB();
    const stored = await db.get('progress', 'learner_state');
    if (!stored) {
      await saveLearnerProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }

    const { migratedProgress, changesMade } = migrateLearnerProgress(stored);
    let finalProgress = { ...INITIAL_PROGRESS, ...migratedProgress };

    // Check and update study streak
    const today = new Date().toISOString().split('T')[0];
    if (finalProgress.lastActiveDate !== today) {
      const lastDate = new Date(finalProgress.lastActiveDate);
      const currDate = new Date(today);
      const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      let updatedStreak = finalProgress.studyStreakDays;
      if (diffDays === 1) {
        updatedStreak += 1;
      } else if (diffDays > 1) {
        updatedStreak = 1;
      }

      finalProgress = {
        ...finalProgress,
        studyStreakDays: updatedStreak,
        lastActiveDate: today,
      };
      await saveLearnerProgress(finalProgress);
      return finalProgress;
    }

    if (changesMade > 0) {
      await saveLearnerProgress(finalProgress);
    }

    return finalProgress;
  } catch (err) {
    console.error('Failed to load progress from IndexedDB:', err);
    return INITIAL_PROGRESS;
  }
}

export async function saveLearnerProgress(progress: LearnerProgress): Promise<void> {
  try {
    const db = await getDB();
    await db.put('progress', progress, 'learner_state');
  } catch (err) {
    console.error('Failed to save progress to IndexedDB:', err);
  }
}

/**
 * Atomically updates learner progress using the latest persisted value.
 * Use this for partial updates so a stale component snapshot cannot overwrite
 * unrelated progress fields saved by another view.
 */
export async function updateLearnerProgress(
  updater: (current: LearnerProgress) => LearnerProgress
): Promise<LearnerProgress | null> {
  try {
    const db = await getDB();
    const transaction = db.transaction('progress', 'readwrite');
    const store = transaction.objectStore('progress');
    const stored = await store.get('learner_state');
    const current = stored ? { ...INITIAL_PROGRESS, ...stored } : { ...INITIAL_PROGRESS };
    const updated = updater(current);

    await store.put(updated, 'learner_state');
    await transaction.done;
    return updated;
  } catch (err) {
    console.error('Failed to update progress in IndexedDB:', err);
    return null;
  }
}

export async function saveLabDraft(labId: string, code: string): Promise<void> {
  try {
    const db = await getDB();
    await db.put('labDrafts', {
      labId,
      code,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to save lab code draft:', err);
  }
}

export async function getLabDraft(labId: string): Promise<string | null> {
  try {
    const db = await getDB();
    const item = await db.get('labDrafts', labId);
    return item ? item.code : null;
  } catch (err) {
    console.error('Failed to get lab draft:', err);
    return null;
  }
}

export async function clearAllLocalData(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('progress');
    await db.clear('notes');
    await db.clear('labDrafts');
    await saveLearnerProgress(INITIAL_PROGRESS);
  } catch (err) {
    console.error('Failed to clear local data:', err);
  }
}
