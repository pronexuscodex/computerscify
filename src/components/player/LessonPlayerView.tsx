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
  XCircle
} from 'lucide-react';
import { Topic, LearnerProgress } from '../../types/curriculum';
import { getModuleById } from '../../data/curriculumData';
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

          {/* Interactive Resource Card Collections */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#000000] pb-3">
              <div>
                <h3 className="font-display font-black text-[#000000] dark:text-[#F6EFEF] text-base md:text-lg uppercase flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Topic Interactive Resource Collections
                </h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
                  {pdfsList.length} Textbooks & PDFs • {researchList.length} Foundational Papers
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-[#F2C94C] border-2 border-[#000000] text-xs font-mono font-black text-[#000000] uppercase neo-shadow-sm">
                {lecturesList.length + pdfsList.length + researchList.length + labsList.length} Total Resources
              </span>
            </div>

            {/* Textbooks & PDF Readings Collection */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Assigned Textbooks & PDF Readings ({pdfsList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pdfsList.map((pdf, idx) => (
                  <div
                    key={pdf.id || idx}
                    onClick={() => {
                      setSelectedPdfIdx(idx);
                      setActiveTab('pdf');
                    }}
                    className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#F2C94C] text-[#000000] font-mono text-[10px] font-black border border-[#000000]">
                          {pdf.id || `pdf-${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-black text-[#000000] bg-[#82E0AA] px-2 py-0.5 rounded border border-[#000000]">
                          {pdf.accessStatus || 'Verified Access'}
                        </span>
                      </div>
                      <h5 className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase leading-snug">
                        {pdf.title}
                      </h5>
                      <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
                        By {Array.isArray(pdf.authors) ? pdf.authors.join(', ') : pdf.authors || 'Academic Faculty'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t-2 border-[#000000]">
                      <span className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase flex items-center gap-1">
                        Read Book in Reader <ChevronRight className="w-3 h-3" />
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foundational & Research Papers Collection */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Foundational Research Papers Collection ({researchList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {researchList.map((paper, idx) => (
                  <div
                    key={paper.id || idx}
                    onClick={() => {
                      setSelectedResearchIdx(idx);
                      setActiveTab('research');
                    }}
                    className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
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
                    <div className="flex items-center justify-between pt-2 border-t-2 border-[#000000]">
                      <span className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase flex items-center gap-1">
                        Open Foundational Paper <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF]" />
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
          <InAppPdfReader
            document={researchList[selectedResearchIdx] || mp.authoritativeResearchSource}
            onMarkCompleted={toggleCompletion}
            isCompleted={isCompleted}
            initialNote={noteText}
            onSaveNote={(note) => handleNoteChange(note)}
          />
        </div>
      )}

      {/* TAB CONTENT: PRACTICE EXERCISES */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {mp.practicalExercises.map((ex, i) => {
            const selectedOpt = selectedExerciseAnswers[ex.id];
            const isSubmitted = selectedOpt !== undefined;
            const isCorrect = selectedOpt === ex.correctAnswer;

            return (
              <div key={ex.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3">
                <div className="text-xs font-black text-[#000000] dark:text-[#F2C94C] uppercase font-mono">
                  Exercise #{i + 1}
                </div>
                <p className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase">{ex.question}</p>

                {ex.options && (
                  <div className="space-y-2 pt-2">
                    {ex.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setSelectedExerciseAnswers((prev) => ({ ...prev, [ex.id]: optIdx }))
                        }
                        className={`w-full text-left p-3 rounded border-2 border-[#000000] text-xs font-black transition-all ${
                          selectedOpt === optIdx
                            ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                            : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
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
                      saveLearnerProgress(updated);
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-[#1D1B1B] dark:text-[#F6EFEF] w-full min-w-0 overflow-x-hidden">
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
