import React, { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavigationRail, NavView } from './NavigationRail';
import { TopBar } from './TopBar';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileBottomNav } from './MobileBottomNav';
import { DashboardView } from '../dashboard/DashboardView';
import {
  LearnerProgress,
  ProgramType,
  CurriculumModule,
} from '../../types/curriculum';
import {
  loadLearnerProgress,
  saveLearnerProgress,
  INITIAL_PROGRESS,
} from '../../services/storage';
import {
  resolveValidTopicForProgram,
  resolveValidCourseForProgram,
  getDefaultCourseIdForProgram,
  getTopicsForProgram,
} from '../../curriculum';
import { getModuleById } from '../../data/curriculumData';
import {
  NavigationSidebarMode,
  loadUiPreferences,
  saveUiPreferences
} from '../../services/uiPreferences';
import { NavigationProvider, useNavigation } from '../../context/NavigationContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

// Not on the initial critical path — opened only via Cmd/Ctrl+K or the search button — and it's
// the sole consumer of the (large, curriculum-content-chunked) glossary index, so keeping it lazy
// avoids evaluating that search-index-building work until a learner actually opens search.
const SearchCommandModal = lazy(() =>
  import('../search/SearchCommandModal').then((module) => ({ default: module.SearchCommandModal }))
);

const RoadmapView = lazy(() =>
  import('../roadmap/RoadmapView').then((module) => ({ default: module.RoadmapView }))
);
const AcademyExplorerView = lazy(() =>
  import('../academies/AcademyExplorerView').then((module) => ({
    default: module.AcademyExplorerView,
  }))
);
const ModuleOverviewView = lazy(() =>
  import('../module/ModuleOverviewView').then((module) => ({ default: module.ModuleOverviewView }))
);
const LessonPlayerView = lazy(() =>
  import('../player/LessonPlayerView').then((module) => ({ default: module.LessonPlayerView }))
);
const ResearchLibraryView = lazy(() =>
  import('../research/ResearchLibraryView').then((module) => ({ default: module.ResearchLibraryView }))
);
const NewsPanelView = lazy(() =>
  import('../news/NewsPanelView').then((module) => ({ default: module.NewsPanelView }))
);
const PracticeArenaView = lazy(() =>
  import('../practice/PracticeArenaView').then((module) => ({ default: module.PracticeArenaView }))
);
const SpacedReviewView = lazy(() =>
  import('../practice/SpacedReviewView').then((module) => ({ default: module.SpacedReviewView }))
);
const MistakeJournalView = lazy(() =>
  import('../practice/MistakeJournalView').then((module) => ({ default: module.MistakeJournalView }))
);
const ProjectPortfolioView = lazy(() =>
  import('../practice/ProjectPortfolioView').then((module) => ({ default: module.ProjectPortfolioView }))
);
const CapstoneView = lazy(() =>
  import('../capstone/CapstoneView').then((module) => ({ default: module.CapstoneView }))
);
const ProgressView = lazy(() =>
  import('../progress/ProgressView').then((module) => ({ default: module.ProgressView }))
);
const SettingsView = lazy(() =>
  import('../settings/SettingsView').then((module) => ({ default: module.SettingsView }))
);
const ResourceHealthDashboard = lazy(() =>
  import('../admin/ResourceHealthDashboard').then((module) => ({
    default: module.ResourceHealthDashboard,
  }))
);
const CurriculumAuditDashboard = lazy(() =>
  import('../admin/CurriculumAuditDashboard').then((module) => ({
    default: module.CurriculumAuditDashboard,
  }))
);

const ViewLoadingFallback: React.FC = () => (
  <div
    className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-5"
    role="status"
    aria-live="polite"
  >
    <span className="sr-only">Loading view</span>
    <div className="h-8 w-52 bg-[#F2C94C] border-2 border-[#000000] animate-pulse" />
    <div className="h-40 bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded animate-pulse" />
  </div>
);

const AppShellContent: React.FC = () => {
  const {
    activeProgram,
    currentView,
    selectedCourseId,
    selectedTopicId,
    currentCourse,
    currentTopic,
    navigateToView,
    selectTopic,
    selectModule,
    goBack,
  } = useNavigation();

  const [progress, setProgress] = useState<LearnerProgress>(INITIAL_PROGRESS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumedToast, setShowResumedToast] = useState(false);
  const mainScrollRef = useRef<HTMLElement>(null);

  const handleUpdateProgress = useCallback((updated: LearnerProgress) => {
    setProgress(updated);
    void saveLearnerProgress(updated);
  }, []);

  // Initialize progress state
  useEffect(() => {
    let isMounted = true;
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    async function initProgress() {
      const savedProgress = await loadLearnerProgress();
      if (!isMounted) return;

      setProgress(savedProgress);

      const wasSaved = localStorage.getItem('computerfy_last_view') !== null;
      if (wasSaved) {
        setShowResumedToast(true);
        toastTimer = setTimeout(() => setShowResumedToast(false), 3500);
      }
    }

    void initProgress();

    return () => {
      isMounted = false;
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({
      top: 0,
      behavior: progress.reducedMotion ? 'auto' : 'smooth',
    });
  }, [
    activeProgram,
    currentView,
    selectedCourseId,
    selectedTopicId,
    progress.reducedMotion,
  ]);

  // UI Preferences State
  const [sidebarMode, setSidebarMode] = useState<NavigationSidebarMode>(() => {
    return loadUiPreferences().navigationSidebarMode;
  });
  const [isFullWidth, setIsFullWidth] = useState<boolean>(() => {
    return loadUiPreferences().fullWidthLearningMode;
  });

  const handleToggleSidebarMode = useCallback(() => {
    setSidebarMode((prev) => {
      const next: NavigationSidebarMode = prev === 'expanded' ? 'collapsed' : 'expanded';
      saveUiPreferences({ navigationSidebarMode: next });
      return next;
    });
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        handleToggleSidebarMode();
      }

      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebarMode, isMobileMenuOpen]);

  const courseDirectTopics = currentCourse?.sections
    ? currentCourse.sections.flatMap((s) => s.topics)
    : [];
  
  const registeredModule = currentCourse?.id ? getModuleById(currentCourse.id) : undefined;
  const moduleDirectTopics = registeredModule?.topics || [];

  const activeProgramTopics = getTopicsForProgram(activeProgram);
  const matchedProgramTopics = activeProgramTopics.filter(
    (t) => t.moduleId === currentCourse?.id || t.id.startsWith((currentCourse?.id || '').replace(/[^a-z0-9]/g, ''))
  );

  const resolvedModuleTopics =
    courseDirectTopics.length > 0
      ? courseDirectTopics
      : moduleDirectTopics.length > 0
      ? moduleDirectTopics
      : matchedProgramTopics.length > 0
      ? matchedProgramTopics
      : [currentTopic];

  const currentModule: CurriculumModule = {
    id: currentCourse?.id || getDefaultCourseIdForProgram(activeProgram),
    phaseId: currentCourse?.year || 1,
    title: currentCourse?.title || 'Course Overview',
    slug: currentCourse?.id || 'course',
    category: currentCourse?.category || 'cs',
    summary: currentCourse?.description || '',
    objective: currentCourse?.description || '',
    estimatedHours: currentCourse?.estimatedHours || 20,
    prerequisiteModuleIds: currentCourse?.prerequisiteCourseIds || [],
    difficulty: 'intermediate',
    colorAccent: 'lavender',
    topics: resolvedModuleTopics,
    capstone: currentCourse?.capstoneProject || {
      id: `${currentCourse?.id || 'course'}-capstone`,
      title: `${currentCourse?.title || 'Course'} Capstone Project`,
      description: 'Apply course concepts in a practical capstone build.',
      constraints: ['Clean implementation', 'Documentation'],
      expectedDeliverables: ['Code Repository', 'Technical Report'],
      evaluationRubric: [
        {
          criterion: 'Correctness',
          weight: '50%',
          description: 'Implementation meets functional specifications',
        },
      ],
    },
  };

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex w-full min-w-0 overflow-x-hidden bg-[var(--color-background)] text-[var(--color-on-background)] transition-colors duration-200 ${
        progress.fontSize === 'large' ? 'text-base' : 'text-sm'
      } ${progress.reducedMotion ? 'reduce-motion' : ''}`}
    >
      {/* Persistent Left Navigation Rail (Desktop) */}
      {!isFullWidth && (
        <div className="hidden md:flex flex-col shrink-0 h-full z-40">
          <NavigationRail
            currentView={currentView}
            onNavigate={(view) => navigateToView(view)}
            progress={{ ...progress, selectedProgram: activeProgram }}
            mode={sidebarMode}
            onToggleMode={handleToggleSidebarMode}
          />
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#151313]/60 backdrop-blur-sm md:hidden flex"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NavigationRail
              currentView={currentView}
              onNavigate={(v) => {
                navigateToView(v);
                setIsMobileMenuOpen(false);
              }}
              progress={{ ...progress, selectedProgram: activeProgram }}
              mode="expanded"
            />
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          progress={{ ...progress, selectedProgram: activeProgram }}
          onUpdateProgress={handleUpdateProgress}
          onResumeTopic={() => selectTopic(currentTopic.id)}
          onNavigate={(v) => navigateToView(v)}
        />

        <Breadcrumbs />

        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto pb-12 w-full min-w-0 overflow-x-hidden relative"
        >
          {/*
            No AnimatePresence/exit animation here on purpose: an exit-coordinated crossfade only
            mounts the next view after the previous one's exit animation resolves via
            requestAnimationFrame, which is throttled or paused entirely in backgrounded/hidden
            tabs — a learner who switches tabs mid-navigation could come back to what looks like a
            frozen app. Without an `exit` prop, React swaps views immediately on key change and
            this only animates the new view's own entrance, so navigation is never gated on rAF.
          */}
          <motion.div
            key={`${activeProgram}-${currentView}`}
            initial={progress.reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: progress.reducedMotion ? 0 : 0.22,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="w-full h-full min-w-0"
          >
              <ErrorBoundary resetKey={`${activeProgram}-${currentView}`}>
              <Suspense fallback={<ViewLoadingFallback />}>
              {currentView === 'dashboard' && (
                <DashboardView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onSelectTopic={(t) => selectTopic(t)}
                  onSelectModule={(m) => selectModule(m)}
                  onSelectPaper={() => navigateToView('research')}
                  onNavigate={(v) => navigateToView(v)}
                />
              )}

              {currentView === 'roadmap' && (
                <RoadmapView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onSelectCourse={(c) => selectModule(c)}
                />
              )}

              {currentView === 'academies' && (
                <AcademyExplorerView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  activeProgram={activeProgram}
                  onSelectCourse={(courseId, programId) => selectModule(courseId, programId)}
                />
              )}

              {currentView === 'module-overview' && (
                <ModuleOverviewView
                  module={currentModule}
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onSelectTopic={(t) => selectTopic(t)}
                  onBack={goBack}
                />
              )}

              {currentView === 'topic-player' && (
                <LessonPlayerView
                  topic={currentTopic}
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={handleUpdateProgress}
                  onSelectTopic={(t) => selectTopic(t)}
                  onBack={goBack}
                />
              )}

              {currentView === 'research' && (
                <ResearchLibraryView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={handleUpdateProgress}
                  onSelectPaper={() => navigateToView('research')}
                />
              )}

              {currentView === 'news' && <NewsPanelView />}

              {currentView === 'lab' && (
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                  <PracticeArenaView
                    progress={{ ...progress, selectedProgram: activeProgram }}
                    onUpdateProgress={handleUpdateProgress}
                  />
                </div>
              )}

              {currentView === 'spaced-review' && (
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                  <SpacedReviewView />
                </div>
              )}

              {currentView === 'mistake-journal' && (
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                  <MistakeJournalView />
                </div>
              )}

              {currentView === 'portfolio' && (
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                  <ProjectPortfolioView progress={{ ...progress, selectedProgram: activeProgram }} />
                </div>
              )}

              {currentView === 'capstones' && (
                <CapstoneView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={handleUpdateProgress}
                />
              )}

              {currentView === 'progress' && (
                <ProgressView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={handleUpdateProgress}
                  onSelectTopic={(t) => selectTopic(t)}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={handleUpdateProgress}
                />
              )}

              {currentView === 'resource-health' && (
                <ResourceHealthDashboard onClose={() => navigateToView('dashboard')} />
              )}

              {currentView === 'audit' && (
                <CurriculumAuditDashboard onClose={() => navigateToView('dashboard')} />
              )}
              </Suspense>
              </ErrorBoundary>
            </motion.div>
        </main>
      </div>

      {/* Session Resumed Toast Notification */}
      {showResumedToast && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 left-3 sm:left-auto sm:right-5 md:bottom-5 z-50 bg-[#151313] text-white px-4 py-3 rounded-2xl border-1.5 border-[#BE94F5] brand-shadow-lg text-xs font-bold flex items-center gap-2.5 animate-fade-in select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#82E0AA] animate-pulse shrink-0" />
          <span>Resumed where you left off</span>
          <button
            type="button"
            onClick={() => setShowResumedToast(false)}
            aria-label="Dismiss message"
            className="ml-2 text-stone-400 hover:text-white transition-colors text-sm leading-none p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(v) => navigateToView(v)}
      />

      {/* Global Search Modal — only mounted (and its chunk fetched) once actually opened */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchCommandModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTopic={(t) => selectTopic(t)}
            onSelectModule={(m) => selectModule(m)}
            onSelectPaper={() => navigateToView('research')}
          />
        </Suspense>
      )}
    </div>
  );
};

export const AppShell: React.FC = () => {
  return (
    <NavigationProvider>
      <AppShellContent />
    </NavigationProvider>
  );
};
