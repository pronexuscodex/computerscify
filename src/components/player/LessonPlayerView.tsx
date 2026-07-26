import React, { useState, useEffect } from 'react';
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
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  Award,
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
  XCircle
} from 'lucide-react';
import { Topic, CurriculumModule, LearnerProgress } from '../../types/curriculum';
import { getModuleById, ALL_TOPICS } from '../../data/curriculumData';
import { getTopicsForProgram } from '../../curriculum';
import { LabWorkspaceView } from '../lab/LabWorkspaceView';
import { InAppPdfReader } from '../reader/InAppPdfReader';
import { InAppVideoPlayer } from '../player/InAppVideoPlayer';
import { FocusModeShell } from '../layout/FocusModeShell';
import { saveLearnerProgress } from '../../services/storage';

interface LessonPlayerViewProps {
  topic: Topic;
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onSelectTopic: (topicId: string) => void;
  onBack: () => void;
}

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({
  topic,
  progress,
  onUpdateProgress,
  onSelectTopic,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'video' | 'pdf' | 'resources' | 'research' | 'practice' | 'lab' | 'checklist' | 'notes'
  >('overview');

  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [noteText, setNoteText] = useState(progress.notes[topic.id] || '');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [selectedExerciseAnswers, setSelectedExerciseAnswers] = useState<Record<string, number>>({});

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

  // Reset indices when topic changes
  useEffect(() => {
    setSelectedLectureIdx(0);
    setSelectedPdfIdx(0);
    setSelectedResearchIdx(0);
    setSelectedLabIdx(0);
  }, [topic.id]);

  const module = getModuleById(topic.moduleId);
  const mp = topic.masteryPack;

  // Plural resource arrays (supporting pdfIds, bookIds, foundationalPaperIds, researchPaperIds)
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

  const isCompleted = progress.completedTopicIds.includes(topic.id);
  const isBookmarked = progress.bookmarkedResourceIds.includes(topic.id);

  // Auto-save last visited topic
  useEffect(() => {
    if (progress.lastVisitedTopicId !== topic.id) {
      const updated = { ...progress, lastVisitedTopicId: topic.id };
      onUpdateProgress(updated);
      saveLearnerProgress(updated);
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
    saveLearnerProgress(updated);
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
    saveLearnerProgress(updated);
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
    saveLearnerProgress(updated);
  };

  // Next / Prev topic navigation scoped to current module or program
  const relevantTopics = module?.topics && module.topics.length > 0
    ? module.topics
    : getTopicsForProgram(progress.selectedProgram || 'computer-science');

  const currentIndex = relevantTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? relevantTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < relevantTopics.length - 1 ? relevantTopics[currentIndex + 1] : null;

  const mainPlayerContent = (
    <div className="space-y-6">
      {/* Player Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#151313]">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'video', label: 'In-App Video', icon: Video },
          { id: 'pdf', label: 'In-App Reader', icon: FileText },
          { id: 'research', label: 'Research Paper', icon: FileText },
          { id: 'practice', label: 'Exercises', icon: HelpCircle },
          { id: 'lab', label: 'Interactive Lab', icon: Code },
          { id: 'checklist', label: 'Mastery Checklist', icon: CheckSquare },
          { id: 'notes', label: 'Notes', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-[#151313] ${
                isActive
                  ? 'bg-[#BE94F5] text-[#151313] brand-shadow-sm'
                  : 'bg-[#F7F7F5] text-[#151313]/80 hover:bg-[#BE94F5]/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#BE94F5]/30 brand-border brand-shadow-sm rounded-2xl p-5">
            <h3 className="font-display font-bold text-base text-[#151313] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#BE94F5]" /> Learning Objective
            </h3>
            <p className="text-sm text-[#151313] font-medium leading-relaxed">
              {mp.learningObjective}
            </p>
          </div>

          <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5">
            <h3 className="font-display font-bold text-base text-[#151313] mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#BE94F5]" /> Core Concepts
            </h3>
            <div className="space-y-2">
              {mp.coreConcepts.map((concept, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-[#151313]">
                  <span className="w-5 h-5 rounded-full bg-[#151313] text-[#F7F7F5] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm text-[#151313] mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#82E0AA]" /> Key Terminology Glossary
              </h3>
              <div className="space-y-2">
                {mp.glossary.map((g, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold text-[#151313]">{g.term}: </span>
                    <span className="text-[#151313]/80">{g.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FCCC42]/20 brand-border brand-shadow-sm rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm text-[#151313] mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#151313]" /> Common Misconceptions
              </h3>
              <div className="space-y-2">
                {mp.commonMisconceptions.map((m, i) => (
                  <p key={i} className="text-xs text-[#151313] font-medium leading-relaxed flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#151313] shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Resource Card Collections (Iterating over pdfIds, bookIds, foundationalPaperIds, researchPaperIds) */}
          <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#151313]/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-[#151313] text-base md:text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#BE94F5]" /> Topic Interactive Resource Collections
                </h3>
                <p className="text-xs text-[#151313]/70 font-medium">
                  {pdfsList.length} Textbooks & PDFs ({topic.pdfIds?.length || topic.bookIds?.length || 0} IDs mapped) • {researchList.length} Foundational Papers ({topic.foundationalPaperIds?.length || topic.researchPaperIds?.length || 0} IDs mapped)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#BE94F5]/30 border border-[#151313] text-xs font-mono font-bold text-[#151313]">
                {lecturesList.length + pdfsList.length + researchList.length + labsList.length} Total Resources
              </span>
            </div>

            {/* Textbooks & PDF Readings Collection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151313] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#BE94F5]" /> Assigned Textbooks & PDF Reading Collections ({pdfsList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pdfsList.map((pdf, idx) => (
                  <div
                    key={pdf.id || idx}
                    onClick={() => {
                      setSelectedPdfIdx(idx);
                      setActiveTab('pdf');
                    }}
                    className="p-4 bg-white brand-border brand-shadow-sm rounded-xl hover:border-[#BE94F5] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#BE94F5]/20 text-[#151313] font-mono text-[10px] font-bold border border-[#151313]/30">
                          {pdf.id || `pdf-${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          {pdf.accessStatus || 'Verified Access'}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-[#151313] group-hover:text-[#BE94F5] transition-colors leading-snug">
                        {pdf.title}
                      </h5>
                      <p className="text-xs text-[#151313]/70 font-medium">
                        By {Array.isArray(pdf.authors) ? pdf.authors.join(', ') : pdf.authors || 'Academic Faculty'}
                      </p>
                      {pdf.recommendedChapter && (
                        <p className="text-[11px] font-mono text-[#151313]/80 bg-[#F7F7F5] p-2 rounded-lg border border-[#151313]/10">
                          📖 Recommended: {pdf.recommendedChapter}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#151313]/10">
                      <span className="text-xs font-bold text-[#BE94F5] group-hover:underline flex items-center gap-1">
                        Read Book in Reader <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#151313]/40 group-hover:text-[#BE94F5]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foundational & Research Papers Collection */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151313] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#82E0AA]" /> Foundational Research Papers Collection ({researchList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {researchList.map((paper, idx) => (
                  <div
                    key={paper.id || idx}
                    onClick={() => {
                      setSelectedResearchIdx(idx);
                      setActiveTab('research');
                    }}
                    className="p-4 bg-white brand-border brand-shadow-sm rounded-xl hover:border-[#82E0AA] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#82E0AA]/30 text-[#151313] font-mono text-[10px] font-bold border border-[#151313]/30">
                          {paper.paperType?.toUpperCase() || 'FOUNDATIONAL'} • {paper.year || 2024}
                        </span>
                        <span className="text-[10px] font-bold text-[#151313] bg-[#FCCC42]/40 px-2 py-0.5 rounded border border-[#151313]/30">
                          {paper.venue || 'ArXiv / IEEE'}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-[#151313] group-hover:text-emerald-700 transition-colors leading-snug">
                        {paper.title}
                      </h5>
                      <p className="text-xs text-[#151313]/70 font-medium">
                        Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors || 'Research Scientists'}
                      </p>
                      {paper.whyItMatters && (
                        <p className="text-xs text-[#151313]/80 bg-[#F7F7F5] p-2 rounded-lg border border-[#151313]/10 line-clamp-2">
                          💡 <span className="font-bold">Why it matters:</span> {paper.whyItMatters}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#151313]/10">
                      <span className="text-xs font-bold text-emerald-800 group-hover:underline flex items-center gap-1">
                        Open Foundational Paper <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#151313]/40 group-hover:text-emerald-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Lectures & Interactive Labs Quick Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-white brand-border rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#151313] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#BE94F5]" /> Video Lectures ({lecturesList.length})
                </div>
                <div className="space-y-1.5">
                  {lecturesList.map((lec, idx) => (
                    <button
                      key={lec.id || idx}
                      onClick={() => {
                        setSelectedLectureIdx(idx);
                        setActiveTab('video');
                      }}
                      className="w-full text-left p-2 rounded-lg bg-[#F7F7F5] hover:bg-[#BE94F5]/20 border border-[#151313]/10 text-xs font-bold text-[#151313] flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <PlayCircle className="w-4 h-4 text-[#BE94F5] shrink-0" />
                        <span className="truncate">{lec.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#151313]/60 shrink-0">
                        {lec.durationMinutes ? `${lec.durationMinutes} min` : 'Watch'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white brand-border rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#151313] flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#FCCC42]" /> Interactive Labs ({labsList.length})
                </div>
                <div className="space-y-1.5">
                  {labsList.map((lab, idx) => (
                    <button
                      key={lab.id || idx}
                      onClick={() => {
                        setSelectedLabIdx(idx);
                        setActiveTab('lab');
                      }}
                      className="w-full text-left p-2 rounded-lg bg-[#F7F7F5] hover:bg-[#FCCC42]/20 border border-[#151313]/10 text-xs font-bold text-[#151313] flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Code2 className="w-4 h-4 text-[#BE94F5] shrink-0" />
                        <span className="truncate">{lab.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#151313]/60 shrink-0 uppercase">
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
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-[#151313] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-[#BE94F5]" /> Select Lecture:
              </span>
              {lecturesList.map((lec, idx) => (
                <button
                  key={lec.id || idx}
                  onClick={() => setSelectedLectureIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                    selectedLectureIdx === idx
                      ? 'bg-[#BE94F5] text-[#151313] border-[#151313]'
                      : 'bg-white text-[#151313] border-[#151313]/30 hover:border-[#151313]'
                  }`}
                >
                  Lecture #{idx + 1}: {lec.title}
                </button>
              ))}
            </div>
          )}
          <InAppVideoPlayer
            video={lecturesList[selectedLectureIdx] || mp.primaryLecture}
            onMarkCompleted={toggleCompletion}
            isCompleted={isCompleted}
            onNextLesson={nextTopic ? () => onSelectTopic(nextTopic.id) : undefined}
            onPrevLesson={prevTopic ? () => onSelectTopic(prevTopic.id) : undefined}
            onFocusModeToggle={() => setIsFocusMode(true)}
            initialNotes={noteText}
            onSaveNote={(_, text) => handleNoteChange(text)}
          />
        </div>
      )}

      {/* TAB CONTENT: IN-APP PDF READER */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          {pdfsList.length > 1 && (
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-[#151313] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#BE94F5]" /> Select Textbook:
              </span>
              {pdfsList.map((pdf, idx) => (
                <button
                  key={pdf.id || idx}
                  onClick={() => setSelectedPdfIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                    selectedPdfIdx === idx
                      ? 'bg-[#BE94F5] text-[#151313] border-[#151313]'
                      : 'bg-white text-[#151313] border-[#151313]/30 hover:border-[#151313]'
                  }`}
                >
                  Book #{idx + 1}: {pdf.title}
                </button>
              ))}
            </div>
          )}
          <InAppPdfReader
            document={pdfsList[selectedPdfIdx] || mp.primaryText}
            onMarkCompleted={toggleCompletion}
            isCompleted={isCompleted}
            initialNote={noteText}
            onSaveNote={(note) => handleNoteChange(note)}
          />
        </div>
      )}

      {/* TAB CONTENT: RESEARCH PAPER */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          {researchList.length > 1 && (
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-[#151313] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#82E0AA]" /> Select Research Source:
              </span>
              {researchList.map((paper, idx) => (
                <button
                  key={paper.id || idx}
                  onClick={() => setSelectedResearchIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                    selectedResearchIdx === idx
                      ? 'bg-[#82E0AA] text-[#151313] border-[#151313]'
                      : 'bg-white text-[#151313] border-[#151313]/30 hover:border-[#151313]'
                  }`}
                >
                  Paper #{idx + 1}: {paper.title}
                </button>
              ))}
            </div>
          )}
          <InAppPdfReader
            document={researchList[selectedResearchIdx] || mp.authoritativeResearchSource}
            onMarkCompleted={toggleCompletion}
            isCompleted={isCompleted}
            initialNote={noteText}
            onSaveNote={(note) => handleNoteChange(note)}
          />
        </div>
      )}

      {/* TAB CONTENT: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {mp.practicalExercises.map((ex, i) => {
            const selectedOpt = selectedExerciseAnswers[ex.id];
            const isSubmitted = selectedOpt !== undefined;
            const isCorrect = selectedOpt === ex.correctAnswer;

            return (
              <div key={ex.id} className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-[#BE94F5] uppercase font-mono">
                  Exercise #{i + 1}
                </div>
                <p className="font-bold text-sm text-[#151313]">{ex.question}</p>

                {ex.options && (
                  <div className="space-y-2 pt-2">
                    {ex.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setSelectedExerciseAnswers((prev) => ({ ...prev, [ex.id]: optIdx }))
                        }
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                          selectedOpt === optIdx
                            ? 'bg-[#BE94F5]/40 border-[#151313] font-bold'
                            : 'bg-[#F7F7F5] border-[#151313]/20 hover:border-[#151313]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {isSubmitted && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-medium ${
                      isCorrect ? 'bg-[#82E0AA]/30 border-[#151313]' : 'bg-[#FCCC42]/40 border-[#151313]'
                    }`}
                  >
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#151313] shrink-0" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </p>
                    <p>{ex.explanation}</p>
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
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-[#151313] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-[#FCCC42]" /> Select Lab Exercise:
              </span>
              {labsList.map((lab, idx) => (
                <button
                  key={lab.id || idx}
                  onClick={() => setSelectedLabIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                    selectedLabIdx === idx
                      ? 'bg-[#FCCC42] text-[#151313] border-[#151313]'
                      : 'bg-white text-[#151313] border-[#151313]/30 hover:border-[#151313]'
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
        <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-[#151313]">
            Topic Mastery Checklist
          </h3>
          <p className="text-xs text-[#151313]/70 font-medium">
            Verify each criterion before marking the topic fully completed.
          </p>

          <div className="space-y-3 pt-2">
            {mp.masteryChecklist.map((item, i) => {
              const checkKey = `${topic.id}_${i}`;
              const isChecked = !!progress.masteryChecklistStatus[checkKey];

              return (
                <label
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#151313]/20 bg-[#F7F7F5] hover:border-[#151313] cursor-pointer"
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
                      saveLearnerProgress(updated);
                    }}
                    className="w-4 h-4 mt-0.5 accent-[#BE94F5]"
                  />
                  <span className="text-xs font-bold text-[#151313]">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-6 space-y-3">
          <h3 className="font-display font-bold text-base text-[#151313]">
            Personal Learning Notes
          </h3>
          <textarea
            value={noteText}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Write your study notes, derivation steps, or thoughts on this topic..."
            className="w-full h-48 p-4 bg-[#F7F7F5] text-[#151313] border border-[#151313] rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#BE94F5] resize-none"
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-[#151313] w-full min-w-0 overflow-x-hidden">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#151313] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#151313] hover:text-[#BE94F5] transition-colors"
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
            className="px-3 py-1.5 rounded-xl border border-[#151313] text-xs font-bold flex items-center gap-1.5 transition-all bg-[#F7F7F5] hover:bg-[#BE94F5]/30 text-[#151313] brand-shadow-sm"
          >
            {isOutlineOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-[#BE94F5]" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-[#82E0AA]" />
            )}
            <span>{isOutlineOpen ? 'Hide Course Outline' : 'Show Course Outline'}</span>
          </button>

          <button
            onClick={() => setIsFocusMode(true)}
            title="Focus Mode"
            className="px-3 py-1.5 rounded-xl border border-[#151313] text-xs font-bold flex items-center gap-1.5 transition-all bg-[#151313] text-white hover:bg-[#BE94F5] hover:text-[#151313]"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`px-3 py-1.5 rounded-xl border border-[#151313] text-xs font-bold flex items-center gap-1.5 transition-all brand-shadow-sm ${
              isBookmarked ? 'bg-[#FCCC42] text-[#151313]' : 'bg-[#F7F7F5] text-[#151313]/80 hover:bg-[#BE94F5]/20'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#151313]' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button
            onClick={toggleCompletion}
            className={`px-4 py-1.5 rounded-xl border border-[#151313] text-xs font-bold flex items-center gap-1.5 transition-all brand-shadow-sm ${
              isCompleted ? 'bg-[#82E0AA] text-[#151313]' : 'bg-[#BE94F5] text-[#151313] hover:bg-[#FCCC42]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Topic Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Main Split Player Layout - Expandable to 100% when Outline is Closed */}
      <div className={isOutlineOpen ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : 'grid grid-cols-1 gap-8'}>
        {/* Main Content Area (Spans full width when panel is closed) */}
        <div className={isOutlineOpen ? 'lg:col-span-3 space-y-6' : 'w-full space-y-6'}>
          {/* Topic Title Card */}
          <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#151313] text-[#F7F7F5] text-[10px] font-mono font-bold">
                  Topic {topic.order}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#BE94F5]/30 text-[#151313] text-[10px] font-bold border border-[#151313]">
                  {mp.difficulty.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-[#151313]/60 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{mp.estimatedStudyMinutes} mins
                </span>
              </div>

              {!isOutlineOpen && (
                <button
                  onClick={() => setIsOutlineOpen(true)}
                  className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#BE94F5] hover:underline"
                >
                  <PanelRightOpen className="w-3.5 h-3.5" /> Show Outline
                </button>
              )}
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#151313] tracking-tight mb-2">
              {topic.title}
            </h1>
            <p className="text-sm text-[#151313]/80 font-medium">{topic.summary}</p>
          </div>

          {mainPlayerContent}

          {/* Next & Previous Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-[#151313]">
            {prevTopic ? (
              <button
                type="button"
                onClick={() => onSelectTopic(prevTopic.id)}
                className="w-full sm:w-auto max-w-full px-4 py-3 sm:py-2.5 rounded-xl bg-white border-1.5 border-[#151313] text-[#151313] text-xs font-bold flex items-center justify-between sm:justify-start gap-2 brand-shadow-sm hover:bg-[#BE94F5]/20 transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <ChevronLeft className="w-4 h-4 shrink-0 text-[#151313]" />
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
                className="w-full sm:w-auto max-w-full px-4 py-3 sm:py-2.5 rounded-xl bg-[#151313] hover:bg-[#BE94F5] hover:text-[#151313] transition-colors text-white border-1.5 border-[#151313] text-xs font-bold flex items-center justify-between sm:justify-end gap-2 brand-shadow-sm min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">Next: {nextTopic.title}</span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-white" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Module Curriculum Outline Accordion */}
        {isOutlineOpen && (
          <div
            id="lesson-module-outline-panel"
            className="hidden lg:block lg:col-span-1 bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-5 h-fit sticky top-20 space-y-4 transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#151313] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#151313]">Module Outline</h3>
                <p className="text-xs text-[#151313]/70 font-medium">{module?.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOutlineOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-[#151313] transition-colors"
                title="Hide course outline"
                aria-label="Hide course outline"
              >
                <PanelRightClose className="w-4 h-4 text-[#BE94F5]" />
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
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      isCurr
                        ? 'bg-[#BE94F5] text-[#151313] border-[#151313] brand-shadow-sm'
                        : isDone
                        ? 'bg-[#82E0AA]/20 border-[#151313]/20 text-[#151313]'
                        : 'bg-[#F7F7F5] border-[#151313]/10 hover:border-[#151313] text-[#151313]/80'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {i + 1}. {t.title}
                    </span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#151313] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Course Outline Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-end lg:hidden animate-fade-in">
          <div className="w-80 bg-[#F7F7F5] h-full border-l-2 border-[#151313] p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#151313] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#151313]">Course Outline</h3>
                <p className="text-xs text-[#151313]/70 font-medium">{module?.title}</p>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-[#151313] text-white"
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
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      isCurr
                        ? 'bg-[#BE94F5] text-[#151313] border-[#151313] brand-shadow-sm'
                        : isDone
                        ? 'bg-[#82E0AA]/20 border-[#151313] text-[#151313]'
                        : 'bg-[#F7F7F5] border-[#151313]/20 text-[#151313]'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {i + 1}. {t.title}
                    </span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#151313] shrink-0" />}
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
