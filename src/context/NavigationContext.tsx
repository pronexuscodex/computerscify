import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavView } from '../components/layout/NavigationRail';
import { ProgramType, LearnerProgress, Course, Topic } from '../types/curriculum';
import { parseRoutePath, formatViewURL } from '../utils/routes';
import { loadLearnerProgress, saveLearnerProgress, INITIAL_PROGRESS } from '../services/storage';
import {
  resolveValidTopicForProgram,
  resolveValidCourseForProgram,
  getDefaultCourseIdForProgram,
} from '../curriculum';

export interface ViewHistoryEntry {
  view: NavView;
  courseId?: string;
  topicId?: string;
  programId?: ProgramType;
}

export interface NavigationContextType {
  activeProgram: ProgramType;
  currentView: NavView;
  selectedCourseId: string;
  selectedTopicId: string;
  currentCourse: Course | undefined;
  currentTopic: Topic;
  viewHistory: ViewHistoryEntry[];
  isLoaded: boolean;

  // Explicit Scoped Navigation Actions
  setActiveProgram: (program: ProgramType) => void;
  navigateToView: (view: NavView, params?: { courseId?: string; topicId?: string; programId?: ProgramType }) => void;
  selectTopic: (topicId: string, programId?: ProgramType) => void;
  selectModule: (courseId: string, programId?: ProgramType) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [progress, setProgress] = useState<LearnerProgress>(INITIAL_PROGRESS);
  const [activeProgram, setActiveProgramState] = useState<ProgramType>('computer-science');
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs-101');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('p0-m1-t1');
  const [viewHistory, setViewHistory] = useState<ViewHistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize progress
  useEffect(() => {
    async function initProgress() {
      const savedProgress = await loadLearnerProgress();
      setProgress(savedProgress);
    }
    initProgress();
  }, []);

  // Synchronize state strictly from HashRouter location.pathname
  useEffect(() => {
    let isMounted = true;

    async function syncFromRoute() {
      const route = parseRoutePath(location.pathname, activeProgram);
      const prog = route.programId || 'computer-science';

      if (!isMounted) return;

      setActiveProgramState(prog);
      setCurrentView(route.view);

      const keySuffix = prog === 'data-science' ? 'ds' : 'cs';
      const storedTopic = localStorage.getItem(`computerfy_last_topic_${keySuffix}`);
      const storedCourse = localStorage.getItem(`computerfy_last_course_${keySuffix}`);

      const targetTopicId = route.topicId || storedTopic;
      const targetCourseId = route.courseId || storedCourse;

      const validTopic = resolveValidTopicForProgram(targetTopicId, prog);
      const validCourse = resolveValidCourseForProgram(targetCourseId, prog);

      setSelectedTopicId(validTopic.id);
      setSelectedCourseId(validCourse?.id || getDefaultCourseIdForProgram(prog));

      setIsLoaded(true);
    }

    syncFromRoute();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Synchronizes state and HashRouter URL with explicit program scoping
  const syncNavigation = useCallback(
    (view: NavView, prog: ProgramType, courseId?: string, topicId?: string) => {
      // Explicitly resolve valid topic and course strictly within target program scope
      const validTopic = resolveValidTopicForProgram(topicId, prog);
      const validCourse = resolveValidCourseForProgram(courseId, prog);

      setCurrentView(view);
      setActiveProgramState(prog);
      setSelectedTopicId(validTopic.id);
      setSelectedCourseId(validCourse?.id || getDefaultCourseIdForProgram(prog));

      // Persist per-program history
      const keySuffix = prog === 'data-science' ? 'ds' : 'cs';
      try {
        localStorage.setItem(`computerfy_last_topic_${keySuffix}`, validTopic.id);
        if (validCourse?.id) {
          localStorage.setItem(`computerfy_last_course_${keySuffix}`, validCourse.id);
        }
        localStorage.setItem('computerfy_last_view', view);
      } catch (e) {}

      // Update progress state
      const updatedProgress = {
        ...progress,
        selectedProgram: prog,
        lastVisitedTopicId: validTopic.id,
        lastVisitedCourseId: validCourse?.id || getDefaultCourseIdForProgram(prog),
      };
      setProgress(updatedProgress);
      saveLearnerProgress(updatedProgress);

      const newUrl = formatViewURL(prog, view, {
        courseId: validCourse?.id,
        topicId: validTopic.id,
      });

      if (location.pathname !== newUrl) {
        navigate(newUrl);
      }
    },
    [location.pathname, navigate, progress]
  );

  const setActiveProgram = useCallback(
    (newProgram: ProgramType) => {
      if (newProgram === activeProgram) return;

      const keySuffix = newProgram === 'data-science' ? 'ds' : 'cs';
      const storedTopic = localStorage.getItem(`computerfy_last_topic_${keySuffix}`);
      const storedCourse = localStorage.getItem(`computerfy_last_course_${keySuffix}`);

      const validTopic = resolveValidTopicForProgram(storedTopic || undefined, newProgram);
      const validCourse = resolveValidCourseForProgram(storedCourse || undefined, newProgram);

      syncNavigation(currentView, newProgram, validCourse?.id, validTopic.id);
    },
    [activeProgram, currentView, syncNavigation]
  );

  const pushHistory = useCallback((view: NavView, courseId?: string, topicId?: string, programId?: ProgramType) => {
    setViewHistory((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.view === view &&
        last.courseId === courseId &&
        last.topicId === topicId &&
        last.programId === programId
      ) {
        return prev;
      }
      return [...prev, { view, courseId, topicId, programId }];
    });
  }, []);

  const navigateToView = useCallback(
    (view: NavView, params?: { courseId?: string; topicId?: string; programId?: ProgramType }) => {
      const targetProg = params?.programId || activeProgram;
      pushHistory(currentView, selectedCourseId, selectedTopicId, activeProgram);
      syncNavigation(view, targetProg, params?.courseId || selectedCourseId, params?.topicId || selectedTopicId);
    },
    [currentView, selectedCourseId, selectedTopicId, activeProgram, pushHistory, syncNavigation]
  );

  const selectTopic = useCallback(
    (topicId: string, programId?: ProgramType) => {
      const targetProg = programId || activeProgram;
      pushHistory(currentView, selectedCourseId, selectedTopicId, activeProgram);

      const validTopic = resolveValidTopicForProgram(topicId, targetProg);
      const topicCourseId = validTopic.moduleId || validTopic.id.split('-')[0];
      const validCourse = resolveValidCourseForProgram(topicCourseId, targetProg);

      syncNavigation('topic-player', targetProg, validCourse?.id, validTopic.id);
    },
    [currentView, selectedCourseId, selectedTopicId, activeProgram, pushHistory, syncNavigation]
  );

  const selectModule = useCallback(
    (courseId: string, programId?: ProgramType) => {
      const targetProg = programId || activeProgram;
      pushHistory(currentView, selectedCourseId, selectedTopicId, activeProgram);

      const validCourse = resolveValidCourseForProgram(courseId, targetProg);
      const courseTopics = validCourse?.sections
        ? validCourse.sections.flatMap((s) => s.topics)
        : [];
      const topicToUse = courseTopics[0]?.id || selectedTopicId;

      syncNavigation('module-overview', targetProg, validCourse?.id, topicToUse);
    },
    [currentView, selectedCourseId, selectedTopicId, activeProgram, pushHistory, syncNavigation]
  );

  const goBack = useCallback(() => {
    if (viewHistory.length > 0) {
      const prevEntry = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, -1));
      const targetProg = prevEntry.programId || activeProgram;
      syncNavigation(prevEntry.view, targetProg, prevEntry.courseId, prevEntry.topicId);
    } else {
      syncNavigation('dashboard', activeProgram, selectedCourseId, selectedTopicId);
    }
  }, [viewHistory, activeProgram, selectedCourseId, selectedTopicId, syncNavigation]);

  const currentTopic = useMemo(() => {
    return resolveValidTopicForProgram(selectedTopicId, activeProgram);
  }, [selectedTopicId, activeProgram]);

  const currentCourse = useMemo(() => {
    return resolveValidCourseForProgram(selectedCourseId, activeProgram);
  }, [selectedCourseId, activeProgram]);

  const value = useMemo(
    () => ({
      activeProgram,
      currentView,
      selectedCourseId,
      selectedTopicId,
      currentCourse,
      currentTopic,
      viewHistory,
      isLoaded,
      setActiveProgram,
      navigateToView,
      selectTopic,
      selectModule,
      goBack,
    }),
    [
      activeProgram,
      currentView,
      selectedCourseId,
      selectedTopicId,
      currentCourse,
      currentTopic,
      viewHistory,
      isLoaded,
      setActiveProgram,
      navigateToView,
      selectTopic,
      selectModule,
      goBack,
    ]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
