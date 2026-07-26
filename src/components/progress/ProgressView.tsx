import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Bookmark,
  FileText,
  Flame,
  Award,
  BookOpen,
  Trash2,
  Sparkles
} from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';
import { ALL_TOPICS, getTopicById, getAllResearchPapers } from '../../data/curriculumData';
import { saveLearnerProgress } from '../../services/storage';

interface ProgressViewProps {
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onSelectTopic: (topicId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectTopic,
}) => {
  const totalTopics = ALL_TOPICS.length;
  const completedCount = progress.completedTopicIds.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  const papers = getAllResearchPapers();
  const readPapersCount = progress.readPaperIds.length;

  // Bookmarked items
  const bookmarkedTopics = progress.bookmarkedResourceIds
    ? progress.bookmarkedResourceIds.map(id => getTopicById(id)).filter(Boolean)
    : [];

  // Saved Notes entries
  const noteEntries = Object.entries(progress.notes).filter(([_, text]) => (text as string).trim().length > 0);

  const handleDeleteNote = (topicId: string) => {
    const newNotes = { ...progress.notes };
    delete newNotes[topicId];
    const updated = { ...progress, notes: newNotes };
    onUpdateProgress(updated);
    saveLearnerProgress(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#151313]">
      {/* Header */}
      <div className="border-b border-[#151313] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#BE94F5]" />
          Analytics & Saved Work
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#151313] tracking-tight">
          Progress & Notes
        </h1>
        <p className="text-sm text-[#151313]/70 font-medium mt-1">
          Track topic mastery, review personal notes, manage bookmarks, and measure study streak milestones.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#BE94F5] brand-border brand-shadow-sm rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/70 mb-1">
            Topic Completion
          </div>
          <div className="font-display font-extrabold text-3xl text-[#151313]">
            {completedCount} / {totalTopics}
          </div>
          <p className="text-xs text-[#151313] font-mono mt-1">{percentComplete}% Completed</p>
        </div>

        <div className="bg-[#FCCC42] text-[#151313] brand-border brand-shadow-sm rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/80 mb-1 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-current text-[#E66A4E]" /> Study Streak
          </div>
          <div className="font-display font-extrabold text-3xl">{progress.studyStreakDays} Days</div>
          <p className="text-xs text-[#151313]/90 font-mono mt-1">Active Learning</p>
        </div>

        <div className="bg-[#82E0AA] brand-border brand-shadow-sm rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/70 mb-1">
            Research Papers Read
          </div>
          <div className="font-display font-extrabold text-3xl text-[#151313]">
            {readPapersCount} / {papers.length}
          </div>
          <p className="text-xs text-[#151313] font-mono mt-1">Literature Progress</p>
        </div>

        <div className="bg-[#FCCC42] brand-border brand-shadow-sm rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/70 mb-1">
            Bookmarks & Notes
          </div>
          <div className="font-display font-extrabold text-3xl text-[#151313]">
            {bookmarkedTopics.length + noteEntries.length}
          </div>
          <p className="text-xs text-[#151313] font-mono mt-1">Saved Artifacts</p>
        </div>
      </div>

      {/* Main Grid: Notes & Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Notes Manager */}
        <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 space-y-4 min-w-0">
          <h2 className="font-display font-bold text-xl text-[#151313] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#BE94F5]" /> Saved Personal Notes ({noteEntries.length})
          </h2>

          {noteEntries.length === 0 ? (
            <p className="text-xs text-[#151313]/60 italic py-6 text-center">
              No notes saved yet. Open any topic and write in the "Notes" tab.
            </p>
          ) : (
            <div className="space-y-3">
              {noteEntries.map(([topicId, text]) => {
                const topicItem = getTopicById(topicId);
                return (
                  <div
                    key={topicId}
                    className="p-4 rounded-xl border border-[#151313]/20 bg-[#F7F7F5] space-y-2 brand-shadow-sm min-w-0"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <button
                        onClick={() => onSelectTopic(topicId)}
                        className="font-bold text-xs text-[#151313] hover:text-[#BE94F5] transition-colors underline truncate text-left"
                      >
                        {topicItem ? topicItem.title : topicId}
                      </button>
                      <button
                        onClick={() => handleDeleteNote(topicId)}
                        className="p-1 min-h-[36px] min-w-[36px] text-[#151313]/40 hover:text-[#BE94F5] transition-colors flex items-center justify-center shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#151313]/90 bg-[#151313]/5 p-3 rounded-lg whitespace-pre-wrap break-words">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookmarked Topics */}
        <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 space-y-4 min-w-0">
          <h2 className="font-display font-bold text-xl text-[#151313] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#FCCC42]" /> Bookmarked Topics ({bookmarkedTopics.length})
          </h2>

          {bookmarkedTopics.length === 0 ? (
            <p className="text-xs text-[#151313]/60 italic py-6 text-center">
              No bookmarks saved yet. Click "Bookmark" on any lesson player.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarkedTopics.map(topic => (
                <div
                  key={topic!.id}
                  onClick={() => onSelectTopic(topic!.id)}
                  className="p-4 rounded-xl border border-[#151313]/20 bg-[#F7F7F5] hover:bg-[#FCCC42]/20 cursor-pointer flex items-center justify-between gap-3 brand-shadow-sm transition-all min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-[#151313] truncate">{topic!.title}</h3>
                    <p className="text-[11px] text-[#151313]/70 truncate">{topic!.summary}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-[#BE94F5] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
