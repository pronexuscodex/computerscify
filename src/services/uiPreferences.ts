export type NavigationSidebarMode = 'expanded' | 'collapsed' | 'compact' | 'hidden';

export interface ComputerfyUiPreferences {
  navigationSidebarMode: NavigationSidebarMode;
  courseOutlineOpen: boolean;
  pdfThumbnailPanelOpen: boolean;
  fullWidthLearningMode: boolean;
}

const STORAGE_KEY = 'computerfy_ui_preferences';

const DEFAULT_PREFERENCES: ComputerfyUiPreferences = {
  navigationSidebarMode: 'expanded',
  courseOutlineOpen: true,
  pdfThumbnailPanelOpen: true,
  fullWidthLearningMode: false,
};

export function loadUiPreferences(): ComputerfyUiPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    let mode: NavigationSidebarMode = 'expanded';
    if (parsed.navigationSidebarMode === 'collapsed' || parsed.navigationSidebarMode === 'compact') {
      mode = 'collapsed';
    } else if (parsed.navigationSidebarMode === 'hidden') {
      mode = 'collapsed';
    } else {
      mode = 'expanded';
    }
    return {
      navigationSidebarMode: mode,
      courseOutlineOpen: typeof parsed.courseOutlineOpen === 'boolean' ? parsed.courseOutlineOpen : true,
      pdfThumbnailPanelOpen: typeof parsed.pdfThumbnailPanelOpen === 'boolean' ? parsed.pdfThumbnailPanelOpen : true,
      fullWidthLearningMode: typeof parsed.fullWidthLearningMode === 'boolean' ? parsed.fullWidthLearningMode : false,
    };
  } catch (e) {
    console.warn('Failed to parse UI preferences:', e);
    return DEFAULT_PREFERENCES;
  }
}

export function saveUiPreferences(prefs: Partial<ComputerfyUiPreferences>): ComputerfyUiPreferences {
  const current = loadUiPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save UI preferences:', e);
    }
  }
  return updated;
}
