import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Code,
  CheckSquare,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ExternalLink,
  Sparkles,
  ListChecks,
  Info,
  Clock,
  ArrowLeft,
  Maximize2,
  PanelRightClose,
  PanelRightOpen,
  X,
  AlertTriangle,
  PlayCircle,
  Code2,
  XCircle,
  ShieldAlert,
  Lightbulb,
  Globe2
} from 'lucide-react';
import { Topic, LearnerProgress } from '../../types/curriculum';
import { getModuleById } from '../../data/curriculumData';
import { getTopicsForProgram } from '../../curriculum';
import { LabWorkspaceView } from '../lab/LabWorkspaceView';
import { InAppPdfReader } from '../reader/InAppPdfReader';
import { InAppVideoPlayer } from '../player/InAppVideoPlayer';
import { FocusModeShell } from '../layout/FocusModeShell';
import { OfflineSaveButton } from '../common/OfflineSaveButton';
import { toOfflineableResource } from '../../services/offlineResourceCache';

interface LessonPlayerViewProps {
  topic: Topic;
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onSelectTopic: (topicId: string) => void;
  onBack: () => void;
}

const NoResourceAvailable: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string }> = ({
  icon: Icon,
  label,
}) => (
  <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-8 flex flex-col items-center text-center gap-3">
    <div className="p-3 bg-[#F2C94C] border-2 border-[#000000] rounded text-[#000000]">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">
      No {label} for This Topic
    </h3>
    <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold max-w-sm">
      This topic doesn't have a {label.toLowerCase()} assigned yet. Check the Overview tab for other ways to learn this material.
    </p>
  </div>
);

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({
  topic,
  progress,
  onUpdateProgress,
  onSelectTopic,
  onBack,
}) => {
  type LessonTab =
    | 'overview'
    | 'video'
    | 'pdf'
    | 'resources'
    | 'research'
    | 'practice'
    | 'lab'
    | 'checklist'
    | 'notes';
  const [activeTab, setActiveTab] = useState<LessonTab>('overview');

  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [noteText, setNoteText] = useState(progress.notes[topic.id] || '');
  const [selectedExerciseAnswers, setSelectedExerciseAnswers] = useState<
    Record<string, string>
  >({});
  const [submittedExerciseIds, setSubmittedExerciseIds] = useState<Set<string>>(
    () => new Set()
  );

  // Persisted collapsible side panel state
  const [isOutlineOpen, setIsOutlineOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('computerfy_lesson_outline_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('computerfy_lesson_outline_open', JSON.stringify(isOutlineOpen));
    } catch {
      // ignore
    }
  }, [isOutlineOpen]);

  // Handle Escape key to close mobile outline drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  const [selectedLectureIdx, setSelectedLectureIdx] = useState(0);
  const [selectedPdfIdx, setSelectedPdfIdx] = useState(0);
  const [selectedResearchIdx, setSelectedResearchIdx] = useState(0);
  const [selectedLabIdx, setSelectedLabIdx] = useState(0);

  const playerTopRef = useRef<HTMLDivElement | null>(null);

  // Reset indices when topic changes
  useEffect(() => {
    setSelectedLectureIdx(0);
    setSelectedPdfIdx(0);
    setSelectedResearchIdx(0);
    setSelectedLabIdx(0);
  }, [topic.id]);

  // Auto-scroll to top of player view when active tab or resource index changes
  useEffect(() => {
    if (playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, topic.id, selectedPdfIdx, selectedResearchIdx, selectedLectureIdx]);

  const module = getModuleById(topic.moduleId);
  const mp = topic.masteryPack;

  // Resource lists
  const lecturesList = topic.lectures?.length
    ? topic.lectures
    : mp?.lectures?.length
      ? mp.lectures
      : mp?.primaryLecture
        ? [mp.primaryLecture]
        : [];

  const pdfsList = topic.pdfBooks?.length
    ? topic.pdfBooks
    : topic.books?.length
      ? topic.books
      : mp?.pdfBooks?.length
        ? mp.pdfBooks
        : mp?.books?.length
          ? mp.books
          : mp?.primaryText
            ? [mp.primaryText]
            : [];

  const researchList = topic.researchPapers?.length
    ? topic.researchPapers
    : topic.foundationalPapers?.length
      ? topic.foundationalPapers
      : mp?.researchPapers?.length
        ? mp.researchPapers
        : mp?.foundationalPapers?.length
          ? mp.foundationalPapers
          : [
              ...(mp?.authoritativeResearchSource ? [mp.authoritativeResearchSource] : []),
              ...(mp?.modernSurveyOrTutorial ? [mp.modernSurveyOrTutorial] : []),
            ];

  const labsList = topic.interactiveLabs?.length
    ? topic.interactiveLabs
    : mp?.interactiveLabs?.length
      ? mp.interactiveLabs
      : mp?.interactiveLab
        ? [mp.interactiveLab]
        : [];

  // Resources actually selected for the active tab. Each can be genuinely absent for a given
  // topic (e.g. a topic with no assigned video), so callers below must not assume a value here.
  const activeVideoResource = lecturesList[selectedLectureIdx] || mp?.primaryLecture;
  const activePdfResource = pdfsList[selectedPdfIdx] || mp?.primaryText;
  const activeResearchResource = researchList[selectedResearchIdx] || mp?.authoritativeResearchSource;

  const isCompleted = progress.completedTopicIds.includes(topic.id);
  const isBookmarked = progress.bookmarkedResourceIds.includes(topic.id);

  // Auto-save last visited topic
  useEffect(() => {
    if (progress.lastVisitedTopicId !== topic.id) {
      const updated = { ...progress, lastVisitedTopicId: topic.id };
      onUpdateProgress(updated);
    }
  }, [topic.id]);

  // Handle note text change
  const handleNoteChange = (val: string) => {
    setNoteText(val);
    const updated = {
      ...progress,
      notes: { ...progress.notes, [topic.id]: val },
    };
    onUpdateProgress(updated);
  };

  // Toggle completion
  const toggleCompletion = () => {
    const topicSet = new Set(progress.completedTopicIds);
    if (topicSet.has(topic.id)) {
      topicSet.delete(topic.id);
    } else {
      topicSet.add(topic.id);
    }
    const updated = { ...progress, completedTopicIds: Array.from(topicSet) };
    onUpdateProgress(updated);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    const bmSet = new Set(progress.bookmarkedResourceIds);
    if (bmSet.has(topic.id)) {
      bmSet.delete(topic.id);
    } else {
      bmSet.add(topic.id);
    }
    const updated = { ...progress, bookmarkedResourceIds: Array.from(bmSet) };
    onUpdateProgress(updated);
  };

  // Next / Prev topic navigation
  const relevantTopics = module?.topics && module.topics.length > 0
    ? module.topics
    : getTopicsForProgram(progress.selectedProgram || 'computer-science');

  const currentIndex = relevantTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? relevantTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < relevantTopics.length - 1 ? relevantTopics[currentIndex + 1] : null;

  const mainPlayerContent = (
    <div className="space-y-6">
      {/* Player Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b-4 border-[#000000]">
          {([
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'video', label: 'In-App Video', icon: Video },
          { id: 'pdf', label: 'In-App Reader', icon: FileText },
          { id: 'research', label: 'Research Paper', icon: FileText },
          { id: 'practice', label: 'Exercises', icon: HelpCircle },
          { id: 'lab', label: 'Interactive Lab', icon: Code },
          { id: 'checklist', label: 'Mastery Checklist', icon: CheckSquare },
          { id: 'notes', label: 'Notes', icon: FileSpreadsheet },
          ] satisfies Array<{
            id: LessonTab;
            label: string;
            icon: React.ComponentType<{ className?: string }>;
          }>).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 border-2 border-[#000000] ${
                isActive
                  ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                  : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {topic.cyberSafety && (
        <section
          aria-labelledby="cyber-safety-heading"
          className="rounded-[var(--ds-radius-md)] border border-[var(--ds-security)]/40 bg-[var(--ds-security-soft)] p-4 text-[var(--ds-text)] shadow-[var(--ds-shadow-sm)] sm:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="cyber-safety-heading" className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
              <ShieldAlert className="h-4 w-4 text-[var(--ds-security)]" /> Defensive cyber safety boundary
            </h2>
            <span className="rounded-full border border-[var(--ds-security)]/40 bg-[var(--ds-surface)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-[var(--ds-security)]">
              {topic.cyberSafety.classification.replace('-', ' ')}
            </span>
          </div>
          <p className="mb-3 text-xs font-semibold leading-relaxed text-[var(--ds-text)]">{topic.cyberSafety.legalUseNotice}</p>
          <dl className="grid min-w-0 gap-3 text-xs sm:grid-cols-2">
            <div><dt className="font-bold text-[var(--ds-security)]">Ethical objective</dt><dd className="mt-1 leading-relaxed text-[var(--ds-text-muted)]">{topic.cyberSafety.ethicalObjective}</dd></div>
            <div><dt className="font-bold text-[var(--ds-security)]">Defensive purpose</dt><dd className="mt-1 leading-relaxed text-[var(--ds-text-muted)]">{topic.cyberSafety.defensivePurpose}</dd></div>
            <div><dt className="font-bold text-[var(--ds-security)]">Required environment</dt><dd className="mt-1 leading-relaxed text-[var(--ds-text-muted)]">{topic.cyberSafety.requiredEnvironment}</dd></div>
            <div><dt className="font-bold text-[var(--ds-security)]">Responsible disclosure</dt><dd className="mt-1 leading-relaxed text-[var(--ds-text-muted)]">{topic.cyberSafety.responsibleDisclosureGuidance}</dd></div>
          </dl>
        </section>
      )}

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#DFD9D8] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
            <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Learning Objective
            </h3>
            <p className="text-sm text-[#000000] dark:text-[#F6EFEF] font-semibold leading-relaxed">
              {mp.learningObjective}
            </p>
          </div>

          {mp.simpleExplanation && (
            <div className="bg-[#82E0AA]/25 dark:bg-[#1B3323] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF] mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Explain It Simply
              </h3>
              <div className="space-y-3 text-sm text-[#000000] dark:text-[#F6EFEF] font-semibold leading-relaxed">
                {mp.simpleExplanation.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
            <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF] mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Core Concepts
            </h3>
            <div className="space-y-2">
              {mp.coreConcepts.map((concept, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs font-bold text-[#000000] dark:text-[#F6EFEF]">
                  <span className="w-5 h-5 rounded bg-[#000000] text-[#FFFFFF] font-mono font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#000000]">
                    {i + 1}
                  </span>
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {mp.realWorldApplications && mp.realWorldApplications.length > 0 && (
            <div className="bg-[#B4C5FF]/30 dark:bg-[#1A2140] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF] mb-3 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Where This Shows Up In Real Life
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mp.realWorldApplications.map((app, i) => (
                  <div key={i} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-2 border-[#000000] rounded p-3.5">
                    <p className="font-black text-xs uppercase text-[#000000] dark:text-[#F2C94C] mb-1">{app.title}</p>
                    <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 font-semibold leading-relaxed">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-sm uppercase text-[#000000] dark:text-[#F6EFEF] mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Key Terminology Glossary
              </h3>
              <div className="space-y-2">
                {mp.glossary.map((g, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-black text-[#000000] dark:text-[#F2C94C] uppercase">{g.term}: </span>
                    <span className="text-[#000000]/80 dark:text-[#F6EFEF]/80 font-medium">{g.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F2C94C]/20 dark:bg-[#3D331A] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-sm uppercase text-[#000000] dark:text-[#F2C94C] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Common Misconceptions
              </h3>
              <div className="space-y-2">
                {mp.commonMisconceptions.map((m, i) => (
                  <p key={i} className="text-xs text-[#000000] dark:text-[#F6EFEF] font-bold leading-relaxed flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C] shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-sm uppercase mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" /> Before You Start
              </h3>
              {mp.prerequisites.length > 0 ? (
                <ul className="space-y-2">
                  {mp.prerequisites.map((prerequisite) => (
                    <li key={prerequisite} className="flex items-start gap-2 text-xs font-bold opacity-80">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-bold opacity-70">
                  No prior topic is required. You can begin here.
                </p>
              )}
            </div>

            <div className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-4 border-[#000000] neo-shadow rounded p-5">
              <h3 className="font-display font-black text-sm uppercase mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> Where This Leads
              </h3>
              {mp.connectionsToLaterModules.length > 0 ? (
                <ul className="space-y-2">
                  {mp.connectionsToLaterModules.map((connection) => (
                    <li key={connection} className="flex items-start gap-2 text-xs font-bold">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{connection}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-bold opacity-70">
                  This topic strengthens the foundation for the rest of the course.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Resource Card Collections */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#000000] pb-3">
              <div>
                <h3 className="font-display font-black text-[#000000] dark:text-[#F6EFEF] text-base md:text-lg uppercase flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Study Resources
                </h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
                  {pdfsList.length} course reading{pdfsList.length === 1 ? '' : 's'} • {researchList.length} research source{researchList.length === 1 ? '' : 's'}
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-[#F2C94C] border-2 border-[#000000] text-xs font-mono font-black text-[#000000] uppercase neo-shadow-sm">
                {lecturesList.length + pdfsList.length + researchList.length + labsList.length} Total Resources
              </span>
            </div>

            {/* Textbooks & PDF Readings Collection */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Course Readings ({pdfsList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pdfsList.map((pdf, idx) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={pdf.id || idx}
                    onClick={() => {
                      setSelectedPdfIdx(idx);
                      setActiveTab('pdf');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPdfIdx(idx);
                        setActiveTab('pdf');
                      }
                    }}
                    className="w-full text-left p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm hover:translate-y-[-2px] transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#F2C94C] text-[#000000] font-mono text-[10px] font-black border border-[#000000]">
                          {pdf.deliveryMode === 'in-app-pdf-candidate' ? 'PDF Reading' : 'Course Resource'}
                        </span>
                        <span className="text-[10px] font-black text-[#000000] bg-[#82E0AA] px-2 py-0.5 rounded border border-[#000000]">
                          {pdf.accessStatus === 'official-web-book'
                            ? 'Official Website'
                            : pdf.accessStatus === 'needsVerification'
                            ? 'Check Access'
                            : 'Verified Access'}
                        </span>
                      </div>
                      <h5 className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase leading-snug">
                        {pdf.title}
                      </h5>
                      <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
                        By {Array.isArray(pdf.authors) ? pdf.authors.join(', ') : pdf.authors || 'Academic Faculty'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-[#000000]">
                      <span className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase flex items-center gap-1">
                        {pdf.deliveryMode === 'in-app-pdf-candidate' ? 'Read in Study Reader' : 'Open Course Resource'} <ChevronRight className="w-3 h-3" />
                      </span>
                      <div className="flex items-center gap-1.5">
                        <OfflineSaveButton resource={toOfflineableResource(pdf)} variant="neo" />
                        <ExternalLink className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foundational & Research Papers Collection */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Research Reading ({researchList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {researchList.map((paper, idx) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={paper.id || idx}
                    onClick={() => {
                      setSelectedResearchIdx(idx);
                      setActiveTab('research');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedResearchIdx(idx);
                        setActiveTab('research');
                      }
                    }}
                    className="w-full text-left p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm hover:translate-y-[-2px] transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#D0BCFF] text-[#000000] font-mono text-[10px] font-black border border-[#000000]">
                          {paper.paperType?.toUpperCase() || 'FOUNDATIONAL'} • {paper.year || 2024}
                        </span>
                        <span className="text-[10px] font-black text-[#000000] bg-[#F2C94C] px-2 py-0.5 rounded border border-[#000000]">
                          {paper.venue || 'ArXiv / IEEE'}
                        </span>
                      </div>
                      <h5 className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase leading-snug">
                        {paper.title}
                      </h5>
                      <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
                        Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors || 'Research Scientists'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-[#000000]">
                      <span className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase flex items-center gap-1">
                        Read Research Source <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="flex items-center gap-1.5">
                        <OfflineSaveButton resource={toOfflineableResource(paper)} variant="neo" />
                        <ExternalLink className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Lectures & Interactive Labs Quick Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Video Lectures ({lecturesList.length})
                </div>
                <div className="space-y-1.5">
                  {lecturesList.map((lec, idx) => (
                    <button
                      key={lec.id || idx}
                      onClick={() => {
                        setSelectedLectureIdx(idx);
                        setActiveTab('video');
                      }}
                      className="w-full text-left p-2 rounded bg-[#FFFFFF] dark:bg-[#1E1C1C] border border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] text-xs font-black uppercase flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <PlayCircle className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" />
                        <span className="truncate">{lec.title}</span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0">
                        {lec.durationMinutes ? `${lec.durationMinutes} min` : 'Watch'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Interactive Labs ({labsList.length})
                </div>
                <div className="space-y-1.5">
                  {labsList.map((lab, idx) => (
                    <button
                      key={lab.id || idx}
                      onClick={() => {
                        setSelectedLabIdx(idx);
                        setActiveTab('lab');
                      }}
                      className="w-full text-left p-2 rounded bg-[#FFFFFF] dark:bg-[#1E1C1C] border border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] text-xs font-black uppercase flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Code2 className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" />
                        <span className="truncate">{lab.title}</span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 uppercase">
                        {lab.type || 'Code'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: IN-APP VIDEO PLAYER */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          {lecturesList.length > 1 && (
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-black text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Video className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Select Lecture:
              </span>
              {lecturesList.map((lec, idx) => (
                <button
                  key={lec.id || idx}
                  onClick={() => setSelectedLectureIdx(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shrink-0 border-2 border-[#000000] ${
                    selectedLectureIdx === idx
                      ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  Lecture #{idx + 1}: {lec.title}
                </button>
              ))}
            </div>
          )}
          {activeVideoResource ? (
            <InAppVideoPlayer
              video={activeVideoResource}
              onMarkCompleted={toggleCompletion}
              isCompleted={isCompleted}
              onNextLesson={nextTopic ? () => onSelectTopic(nextTopic.id) : undefined}
              onPrevLesson={prevTopic ? () => onSelectTopic(prevTopic.id) : undefined}
              onFocusModeToggle={() => setIsFocusMode(true)}
              initialNotes={noteText}
              onSaveNote={(_, text) => handleNoteChange(text)}
            />
          ) : (
            <NoResourceAvailable icon={Video} label="Video Lecture" />
          )}
        </div>
      )}

      {/* TAB CONTENT: IN-APP PDF READER */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          {pdfsList.length > 1 && (
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-black text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Select Textbook:
              </span>
              {pdfsList.map((pdf, idx) => (
                <button
                  key={pdf.id || idx}
                  onClick={() => setSelectedPdfIdx(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shrink-0 border-2 border-[#000000] ${
                    selectedPdfIdx === idx
                      ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  Book #{idx + 1}: {pdf.title}
                </button>
              ))}
            </div>
          )}
          {activePdfResource ? (
            <InAppPdfReader
              document={activePdfResource}
              onMarkCompleted={toggleCompletion}
              isCompleted={isCompleted}
              initialNote={noteText}
              onSaveNote={(note) => handleNoteChange(note)}
            />
          ) : (
            <NoResourceAvailable icon={BookOpen} label="Textbook" />
          )}
        </div>
      )}

      {/* TAB CONTENT: RESEARCH PAPER */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          {researchList.length > 1 && (
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-black text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <FileText className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Select Research Source:
              </span>
              {researchList.map((paper, idx) => (
                <button
                  key={paper.id || idx}
                  onClick={() => setSelectedResearchIdx(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shrink-0 border-2 border-[#000000] ${
                    selectedResearchIdx === idx
                      ? 'bg-[#D0BCFF] text-[#000000] neo-shadow-sm'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  Paper #{idx + 1}: {paper.title}
                </button>
              ))}
            </div>
          )}
          {activeResearchResource ? (
            <InAppPdfReader
              document={activeResearchResource}
              onMarkCompleted={toggleCompletion}
              isCompleted={isCompleted}
              initialNote={noteText}
              onSaveNote={(note) => handleNoteChange(note)}
            />
          ) : (
            <NoResourceAvailable icon={FileText} label="Research Paper" />
          )}
        </div>
      )}

      {/* TAB CONTENT: PRACTICE EXERCISES */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {mp.practicalExercises.map((ex, i) => {
            const selectedOpt = selectedExerciseAnswers[ex.id];
            const isSubmitted = submittedExerciseIds.has(ex.id);
            const correctAnswerText =
              typeof ex.correctAnswer === 'number' && ex.options
                ? ex.options[ex.correctAnswer]
                : String(ex.correctAnswer);
            const isCorrect = selectedOpt === correctAnswerText;

            return (
              <div key={ex.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3">
                <div className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase font-mono">
                  Exercise #{i + 1}
                </div>
                <p className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase">{ex.question}</p>

                {ex.options && (
                  <div className="space-y-2 pt-2">
                    {ex.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={selectedOpt === opt}
                        onClick={() => {
                          setSelectedExerciseAnswers((prev) => ({
                            ...prev,
                            [ex.id]: opt,
                          }));
                          setSubmittedExerciseIds((prev) => {
                            const next = new Set(prev);
                            next.delete(ex.id);
                            return next;
                          });
                        }}
                        className={`w-full text-left p-3 rounded border-2 border-[#000000] text-xs font-black transition-all ${
                          selectedOpt === opt
                            ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                            : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {ex.options && (
                  <button
                    type="button"
                    disabled={selectedOpt === undefined}
                    onClick={() =>
                      setSubmittedExerciseIds((prev) => new Set(prev).add(ex.id))
                    }
                    className="px-4 py-2.5 rounded border-2 border-[#000000] bg-[#000000] text-[#FFFFFF] hover:bg-[#F2C94C] hover:text-[#000000] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    Check Answer
                  </button>
                )}

                {isSubmitted && (
                  <div
                    className={`p-3 rounded border-2 border-[#000000] text-xs font-black ${
                      isCorrect ? 'bg-[#82E0AA] text-[#000000]' : 'bg-[#FFDAD6] text-[#000000]'
                    }`}
                  >
                    <p className="font-black mb-1 flex items-center gap-1.5 uppercase">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" />
                          <span>Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#000000] shrink-0" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </p>
                    <p className="font-bold">{ex.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: INTERACTIVE LAB */}
      {activeTab === 'lab' && (
        <div className="space-y-4">
          {labsList.length > 1 && (
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-black text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Code className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Select Lab Exercise:
              </span>
              {labsList.map((lab, idx) => (
                <button
                  key={lab.id || idx}
                  onClick={() => setSelectedLabIdx(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shrink-0 border-2 border-[#000000] ${
                    selectedLabIdx === idx
                      ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  Lab #{idx + 1}: {lab.title}
                </button>
              ))}
            </div>
          )}
          <LabWorkspaceView lab={labsList[selectedLabIdx] || mp.interactiveLab} />
        </div>
      )}

      {/* TAB CONTENT: MASTERY CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4">
          <h3 className="font-display font-black text-lg text-[#000000] dark:text-[#F6EFEF] uppercase">
            Topic Mastery Checklist
          </h3>
          <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
            Verify each criterion before marking the topic fully completed.
          </p>

          <div className="space-y-3 pt-2">
            {mp.masteryChecklist.map((item, i) => {
              const checkKey = `${topic.id}_${i}`;
              const isChecked = !!progress.masteryChecklistStatus[checkKey];

              return (
                <label
                  key={i}
                  className="flex items-start gap-3 p-3 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C]/20 cursor-pointer neo-shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const updated = {
                        ...progress,
                        masteryChecklistStatus: {
                          ...progress.masteryChecklistStatus,
                          [checkKey]: !isChecked,
                        },
                      };
                      onUpdateProgress(updated);
                    }}
                    className="w-4 h-4 mt-0.5 accent-[#F2C94C]"
                  />
                  <span className="text-xs font-black text-[#000000] dark:text-[#F6EFEF]">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-3">
          <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">
            Personal Learning Notes
          </h3>
          <textarea
            value={noteText}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Write your study notes, derivation steps, or thoughts on this topic..."
            className="w-full h-48 p-4 bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] border-2 border-[#000000] rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#F2C94C] resize-none font-bold"
          />
        </div>
      )}
    </div>
  );

  if (isFocusMode) {
    return (
      <FocusModeShell
        title={topic.title}
        subtitle={module?.title}
        onExitFocusMode={() => setIsFocusMode(false)}
        onPrev={prevTopic ? () => onSelectTopic(prevTopic.id) : undefined}
        onNext={nextTopic ? () => onSelectTopic(nextTopic.id) : undefined}
        onToggleComplete={toggleCompletion}
        isCompleted={isCompleted}
      >
        {mainPlayerContent}
      </FocusModeShell>
    );
  }

  return (
    <div
      ref={playerTopRef}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-[#1D1B1B] dark:text-[#F6EFEF] w-full min-w-0 overflow-x-hidden"
    >
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#000000] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-[#000000] dark:text-[#F6EFEF] hover:text-[#000000] dark:hover:text-[#F2C94C] uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {module ? module.title : 'Back'}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Collapsible Course Outline Toggle */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setIsMobileDrawerOpen(true);
              } else {
                setIsOutlineOpen(!isOutlineOpen);
              }
            }}
            aria-expanded={isOutlineOpen}
            aria-controls="lesson-module-outline-panel"
            className="px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C] hover:text-[#000000] text-[#000000] dark:text-[#F6EFEF] neo-shadow-sm"
          >
            {isOutlineOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
            <span>{isOutlineOpen ? 'Hide Outline' : 'Show Outline'}</span>
          </button>

          <button
            onClick={() => setIsFocusMode(true)}
            title="Focus Mode"
            className="px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all bg-[#000000] text-[#FFFFFF] hover:bg-[#F2C94C] hover:text-[#000000] neo-shadow-sm"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all neo-shadow-sm ${
              isBookmarked ? 'bg-[#F2C94C] text-[#000000]' : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#000000]' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          {/* Learning Gold Primary Action Button */}
          <button
            onClick={toggleCompletion}
            className={`px-4 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all neo-btn ${
              isCompleted ? 'bg-[#82E0AA] text-[#000000]' : 'bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Topic Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Main Split Player Layout */}
      <div className={isOutlineOpen ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : 'grid grid-cols-1 gap-8'}>
        {/* Main Content Area */}
        <div className={isOutlineOpen ? 'lg:col-span-3 space-y-6' : 'w-full space-y-6'}>
          {/* Topic Title Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#000000] text-[#FFFFFF] text-[10px] font-mono font-black uppercase border border-[#000000]">
                  Topic {topic.order}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#F2C94C] text-[#000000] text-[10px] font-black uppercase border border-[#000000]">
                  {mp.difficulty.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-[#000000]/70 dark:text-[#F6EFEF]/70 flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5" /> ~{mp.estimatedStudyMinutes} mins
                </span>
              </div>

              {!isOutlineOpen && (
                <button
                  onClick={() => setIsOutlineOpen(true)}
                  className="hidden lg:flex items-center gap-1 text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase tracking-wider hover:underline"
                >
                  <PanelRightOpen className="w-4 h-4" /> Show Outline
                </button>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight mb-2">
              {topic.title}
            </h1>
            <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold">{topic.summary}</p>
          </div>

          {mainPlayerContent}

          {/* Next & Previous Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t-4 border-[#000000]">
            {prevTopic ? (
              <button
                type="button"
                onClick={() => onSelectTopic(prevTopic.id)}
                className="w-full sm:w-auto max-w-full px-4 py-3 sm:py-2.5 rounded bg-[#FFFFFF] dark:bg-[#2B2929] border-2 border-[#000000] text-[#000000] dark:text-[#F6EFEF] text-xs font-black uppercase tracking-wider flex items-center justify-between sm:justify-start gap-2 neo-shadow-sm hover:bg-[#F2C94C] hover:text-[#000000] transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span className="truncate">Prev: {prevTopic.title}</span>
                </div>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextTopic && (
              <button
                type="button"
                onClick={() => onSelectTopic(nextTopic.id)}
                className="w-full sm:w-auto max-w-full px-4 py-3 sm:py-2.5 rounded bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-between sm:justify-end gap-2 neo-btn min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">Next: {nextTopic.title}</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Module Curriculum Outline Accordion */}
        {isOutlineOpen && (
          <div
            id="lesson-module-outline-panel"
            className="hidden lg:block lg:col-span-1 bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 h-fit sticky top-20 space-y-4 transition-all"
          >
            <div className="flex items-center justify-between border-b-2 border-[#000000] pb-3">
              <div>
                <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">Module Outline</h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">{module?.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOutlineOpen(false)}
                className="p-1 rounded hover:bg-[#DFD9D8] text-[#000000] dark:text-[#F6EFEF] transition-colors"
                title="Hide course outline"
                aria-label="Hide course outline"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {module?.topics.map((t, i) => {
                const isCurr = t.id === topic.id;
                const isDone = progress.completedTopicIds.includes(t.id);

                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTopic(t.id)}
                    className={`w-full text-left p-2.5 rounded border-2 border-[#000000] text-xs font-black uppercase transition-all flex items-center justify-between ${
                      isCurr
                        ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                        : isDone
                        ? 'bg-[#82E0AA] text-[#000000]'
                        : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {i + 1}. {t.title}
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Course Outline Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 flex justify-end lg:hidden animate-fade-in">
          <div className="w-80 bg-[#FEF8F7] dark:bg-[#1E1C1C] h-full border-l-4 border-[#000000] p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#000000] pb-3">
              <div>
                <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">Course Outline</h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">{module?.title}</p>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded bg-[#000000] text-[#FFFFFF]"
                aria-label="Close outline drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {module?.topics.map((t, i) => {
                const isCurr = t.id === topic.id;
                const isDone = progress.completedTopicIds.includes(t.id);

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTopic(t.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all ${
                      isCurr
                        ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                        : isDone
                        ? 'bg-[#82E0AA] text-[#000000]'
                        : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {i + 1}. {t.title}
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
