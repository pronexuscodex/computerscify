import React from 'react';
import {
  BarChart3,
  Bookmark,
  FileText,
  Flame,
  BookOpen,
  Trash2
} from 'lucide-react';
import { LearnerProgress, Topic } from '../../types/curriculum';
import { ALL_TOPICS, getTopicById, getAllResearchPapers } from '../../data/curriculumData';

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
    ? progress.bookmarkedResourceIds
        .map(id => getTopicById(id))
        .filter((topic): topic is Topic => topic !== undefined)
    : [];

  // Saved Notes entries
  const noteEntries = Object.entries(progress.notes).filter(([_, text]) => (text as string).trim().length > 0);

  const handleDeleteNote = (topicId: string) => {
    const newNotes = { ...progress.notes };
    delete newNotes[topicId];
    const updated = { ...progress, notes: newNotes };
    onUpdateProgress(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Header */}
      <div className="border-b-4 border-[#000000] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#F2C94C]" />
          Analytics & Saved Work
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight">
          Progress & Notes
        </h1>
        <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold mt-1 max-w-2xl">
          Track topic mastery, review personal notes, manage bookmarks, and measure study streak milestones.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
          <div className="text-xs font-black uppercase tracking-wider text-[#000000]/70 dark:text-[#F6EFEF]/70 mb-1">
            Topic Completion
          </div>
          <div className="font-display font-black text-3xl text-[#000000] dark:text-[#F2C94C]">
            {completedCount} / {totalTopics}
          </div>
          <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 font-mono font-bold mt-1">{percentComplete}% Completed</p>
        </div>

        <div className="bg-[#F2C94C] text-[#000000] border-4 border-[#000000] neo-shadow rounded p-5">
          <div className="text-xs font-black uppercase tracking-wider text-[#000000]/80 mb-1 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-current text-[#000000]" /> Study Streak
          </div>
          <div className="font-display font-black text-3xl">{progress.studyStreakDays} Days</div>
          <p className="text-xs text-[#000000] font-mono font-bold mt-1">Active Learning</p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
          <div className="text-xs font-black uppercase tracking-wider text-[#000000]/70 dark:text-[#F6EFEF]/70 mb-1">
            Research Papers Read
          </div>
          <div className="font-display font-black text-3xl text-[#000000] dark:text-[#F2C94C]">
            {readPapersCount} / {papers.length}
          </div>
          <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 font-mono font-bold mt-1">Literature Progress</p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5">
          <div className="text-xs font-black uppercase tracking-wider text-[#000000]/70 dark:text-[#F6EFEF]/70 mb-1">
            Bookmarks & Notes
          </div>
          <div className="font-display font-black text-3xl text-[#000000] dark:text-[#F2C94C]">
            {bookmarkedTopics.length + noteEntries.length}
          </div>
          <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 font-mono font-bold mt-1">Saved Artifacts</p>
        </div>
      </div>

      {/* Main Grid: Notes & Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Notes Manager */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4 min-w-0">
          <h2 className="font-display font-black text-xl text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Saved Personal Notes ({noteEntries.length})
          </h2>

          {noteEntries.length === 0 ? (
            <p className="text-xs text-[#000000]/60 dark:text-[#F6EFEF]/60 font-bold py-6 text-center">
              No notes saved yet. Open any topic and write in the "Notes" tab.
            </p>
          ) : (
            <div className="space-y-3">
              {noteEntries.map(([topicId, text]) => {
                const topicItem = getTopicById(topicId);
                return (
                  <div
                    key={topicId}
                    className="p-4 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] space-y-2 neo-shadow-sm min-w-0"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <button
                        onClick={() => onSelectTopic(topicId)}
                        className="font-black text-xs text-[#000000] dark:text-[#F2C94C] hover:underline uppercase truncate text-left"
                      >
                        {topicItem ? topicItem.title : topicId}
                      </button>
                      <button
                        onClick={() => handleDeleteNote(topicId)}
                        className="p-1 min-h-[36px] min-w-[36px] text-[#000000] dark:text-[#F6EFEF] hover:text-[#FFDAD6] transition-colors flex items-center justify-center shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#000000] dark:text-[#F6EFEF] font-bold bg-[#FFFFFF] dark:bg-[#1E1C1C] p-3 rounded border border-[#000000] whitespace-pre-wrap break-words">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookmarked Topics */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4 min-w-0">
          <h2 className="font-display font-black text-xl text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Bookmarked Topics ({bookmarkedTopics.length})
          </h2>

          {bookmarkedTopics.length === 0 ? (
            <p className="text-xs text-[#000000]/60 dark:text-[#F6EFEF]/60 font-bold py-6 text-center">
              No bookmarks saved yet. Click "Bookmark" on any lesson player.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarkedTopics.map(topic => (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className="w-full text-left p-4 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C]/20 flex items-center justify-between gap-3 neo-shadow-sm transition-all min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-xs text-[#000000] dark:text-[#F6EFEF] uppercase truncate">{topic.title}</h3>
                    <p className="text-[11px] text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold truncate">{topic.summary}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
