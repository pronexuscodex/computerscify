import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationRail, NavView } from './NavigationRail';
import { TopBar } from './TopBar';
import { DashboardView } from '../dashboard/DashboardView';
import { RoadmapView } from '../roadmap/RoadmapView';
import { ModuleOverviewView } from '../module/ModuleOverviewView';
import { LessonPlayerView } from '../player/LessonPlayerView';
import { ResearchLibraryView } from '../research/ResearchLibraryView';
import { PracticeArenaView } from '../practice/PracticeArenaView';
import { SpacedReviewView } from '../practice/SpacedReviewView';
import { MistakeJournalView } from '../practice/MistakeJournalView';
import { ProjectPortfolioView } from '../practice/ProjectPortfolioView';
import { CapstoneView } from '../capstone/CapstoneView';
import { ProgressView } from '../progress/ProgressView';
import { SettingsView } from '../settings/SettingsView';
import { ResourceHealthDashboard } from '../admin/ResourceHealthDashboard';
import { CurriculumAuditDashboard } from '../admin/CurriculumAuditDashboard';
import { SearchCommandModal } from '../search/SearchCommandModal';
import {
  LearnerProgress,
  ProgramType,
  CurriculumModule,
} from '../../types/curriculum';
import { loadLearnerProgress, INITIAL_PROGRESS } from '../../services/storage';
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

const AppShellContent: React.FC = () => {
  const {
    activeProgram,
    currentView,
    selectedCourseId,
    selectedTopicId,
    currentCourse,
    currentTopic,
    setActiveProgram,
    navigateToView,
    selectTopic,
    selectModule,
    goBack,
  } = useNavigation();

  const [progress, setProgress] = useState<LearnerProgress>(INITIAL_PROGRESS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumedToast, setShowResumedToast] = useState(false);

  // Initialize progress state
  useEffect(() => {
    async function initProgress() {
      const savedProgress = await loadLearnerProgress();
      setProgress(savedProgress);

      const wasSaved = localStorage.getItem('computerfy_last_view') !== null;
      if (wasSaved) {
        setShowResumedToast(true);
        const timer = setTimeout(() => setShowResumedToast(false), 3500);
        return () => clearTimeout(timer);
      }
    }
    initProgress();
  }, []);

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
      className={`h-screen max-h-screen overflow-hidden flex w-full min-w-0 overflow-x-hidden bg-[#B8D0DA] text-[#151313] ${
        progress.fontSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Persistent Left Navigation Rail (Desktop) */}
      {!isFullWidth && (
        <div className="hidden md:flex flex-col shrink-0 h-full bg-[#151313] border-r border-[#151313] z-40">
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
            className="w-64 bg-[#151313] h-full shadow-2xl"
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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          progress={{ ...progress, selectedProgram: activeProgram }}
          onResumeTopic={() => selectTopic(currentTopic.id)}
          onNavigate={(v) => navigateToView(v)}
        />

        <main className="flex-1 overflow-y-auto pb-12 w-full min-w-0 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeProgram}-${currentView}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              className="w-full h-full min-w-0"
            >
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
                  onSelectProgram={(p) => setActiveProgram(p)}
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
                  onUpdateProgress={setProgress}
                  onSelectTopic={(t) => selectTopic(t)}
                  onBack={goBack}
                />
              )}

              {currentView === 'research' && (
                <ResearchLibraryView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={setProgress}
                  onSelectPaper={() => navigateToView('research')}
                />
              )}

              {currentView === 'lab' && (
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                  <PracticeArenaView
                    progress={{ ...progress, selectedProgram: activeProgram }}
                    onUpdateProgress={setProgress}
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
                  onUpdateProgress={setProgress}
                />
              )}

              {currentView === 'progress' && (
                <ProgressView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={setProgress}
                  onSelectTopic={(t) => selectTopic(t)}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  progress={{ ...progress, selectedProgram: activeProgram }}
                  onUpdateProgress={setProgress}
                />
              )}

              {currentView === 'resource-health' && (
                <ResourceHealthDashboard onClose={() => navigateToView('dashboard')} />
              )}

              {currentView === 'audit' && (
                <CurriculumAuditDashboard onClose={() => navigateToView('dashboard')} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Session Resumed Toast Notification */}
      {showResumedToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#151313] text-white px-4 py-3 rounded-2xl border-1.5 border-[#BE94F5] brand-shadow-lg text-xs font-bold flex items-center gap-2.5 animate-fade-in select-none">
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

      {/* Global Search Modal */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={(t) => selectTopic(t)}
        onSelectModule={(m) => selectModule(m)}
        onSelectPaper={() => navigateToView('research')}
      />
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
