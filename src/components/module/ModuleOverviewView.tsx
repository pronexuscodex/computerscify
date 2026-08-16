import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Play,
  ArrowLeft,
  ListChecks,
  ChevronRight,
  GraduationCap,
  CloudDownload,
  Loader2,
} from 'lucide-react';
import { CurriculumModule, LearnerProgress } from '../../types/curriculum';
import { downloadResourcesForOffline, getTopicBookAndPaperResources } from '../../services/offlineResourceCache';

interface ModuleOverviewViewProps {
  module: CurriculumModule;
  progress: LearnerProgress;
  onSelectTopic: (topicId: string) => void;
  onBack: () => void;
}

export const ModuleOverviewView: React.FC<ModuleOverviewViewProps> = ({
  module,
  progress,
  onSelectTopic,
  onBack,
}) => {
  const completedTopics = module.topics.filter(t => progress.completedTopicIds.includes(t.id));
  const percentComplete = Math.round((completedTopics.length / module.topics.length) * 100);

  const moduleResources = useMemo(
    () => module.topics.flatMap(getTopicBookAndPaperResources),
    [module]
  );
  const uniqueResourceCount = useMemo(
    () => new Set(moduleResources.map((r) => r.url)).size,
    [moduleResources]
  );

  const [bulkDownloadState, setBulkDownloadState] = useState<
    { status: 'idle' } | { status: 'downloading'; completed: number; total: number } | { status: 'done'; succeeded: number; failed: number; skipped: number }
  >({ status: 'idle' });

  const handleDownloadAll = () => {
    if (bulkDownloadState.status === 'downloading' || moduleResources.length === 0) return;
    setBulkDownloadState({ status: 'downloading', completed: 0, total: uniqueResourceCount });
    downloadResourcesForOffline(moduleResources, {
      onOverallProgress: (completed, total) => setBulkDownloadState({ status: 'downloading', completed, total }),
    }).then(({ succeeded, failed, skipped }) => {
      setBulkDownloadState({ status: 'done', succeeded, failed, skipped });
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] hover:text-[#000000] dark:hover:text-[#F2C94C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum Roadmap
      </button>

      {/* Module Header Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider">
            Phase {module.phaseId} Module
          </span>
          <span className="px-3 py-1 rounded bg-[#F2C94C] text-[#000000] text-xs font-black uppercase border-2 border-[#000000]">
            {module.category.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded bg-[#DFD9D8] dark:bg-stone-800 text-[#000000] dark:text-[#F6EFEF] text-xs font-black border-2 border-[#000000] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ~{module.estimatedHours} Hours
          </span>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight leading-tight">
          {module.title}
        </h1>

        <p className="text-sm md:text-base text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold max-w-3xl leading-relaxed">
          {module.summary}
        </p>

        {/* Progress Bar & Actions */}
        <div className="pt-4 border-t-4 border-[#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-48 bg-[#DFD9D8] dark:bg-stone-800 h-4 rounded overflow-hidden border-2 border-[#000000]">
              <div className="bg-[#F2C94C] h-full" style={{ width: `${percentComplete}%` }} />
            </div>
            <span className="text-xs font-mono font-black text-[#000000] dark:text-[#F6EFEF]">
              {completedTopics.length}/{module.topics.length} Topics ({percentComplete}%)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {moduleResources.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={bulkDownloadState.status === 'downloading'}
                title="Download every book and research paper in this module so you can read them offline"
                className="px-4 py-2.5 bg-[#FFFFFF] dark:bg-[#2B2929] hover:bg-[#F2C94C]/20 text-[#000000] dark:text-[#F6EFEF] font-black text-xs uppercase tracking-wider rounded border-2 border-[#000000] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {bulkDownloadState.status === 'downloading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading {bulkDownloadState.completed}/{bulkDownloadState.total}
                  </>
                ) : bulkDownloadState.status === 'done' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {bulkDownloadState.succeeded + bulkDownloadState.skipped}/{uniqueResourceCount} Saved Offline
                  </>
                ) : (
                  <>
                    <CloudDownload className="w-4 h-4" />
                    Save {uniqueResourceCount} Reading{uniqueResourceCount === 1 ? '' : 's'} Offline
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onSelectTopic(module.topics[0].id)}
              className="px-6 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs uppercase tracking-wider rounded border-2 border-[#000000] neo-btn flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              {percentComplete > 0 ? 'Resume Module' : 'Start Module'}
            </button>
          </div>
        </div>
      </div>

      {/* Module Objectives & Prerequisites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6">
          <h2 className="font-display font-black text-lg text-[#000000] dark:text-[#F6EFEF] uppercase mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Module Objective
          </h2>
          <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 leading-relaxed font-bold">
            {module.objective}
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6">
          <h2 className="font-display font-black text-lg text-[#000000] dark:text-[#F6EFEF] uppercase mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Prerequisites
          </h2>
          <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 leading-relaxed font-bold">
            {module.prerequisiteModuleIds.length > 0
              ? `Requires completion of prerequisite modules: ${module.prerequisiteModuleIds.join(', ')}.`
              : 'None. This is an introductory foundational module.'}
          </p>
        </div>
      </div>

      {/* Topic Curriculum List */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6">
        <h2 className="font-display font-black text-xl text-[#000000] dark:text-[#F6EFEF] uppercase mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Topic Curriculum & Mastery Packs
        </h2>

        <div className="space-y-3">
          {module.topics.map((topic, idx) => {
            const isCompleted = progress.completedTopicIds.includes(topic.id);

            return (
              <button
                type="button"
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`w-full text-left p-4 rounded border-2 border-[#000000] transition-all flex items-center justify-between gap-4 neo-shadow-sm hover:translate-y-[-2px] ${
                  isCompleted ? 'bg-[#82E0AA] text-[#000000]' : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-[#000000] ${
                      isCompleted ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <h3 className="font-black text-sm uppercase leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs opacity-80 line-clamp-1 font-bold">{topic.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] font-mono font-black bg-[#000000] text-[#FFFFFF] px-2 py-0.5 rounded border border-[#000000]">
                    ~{topic.masteryPack.estimatedStudyMinutes} mins
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Capstone Preview */}
      <div className="bg-[var(--color-primary-container)] border-4 border-[#000000] neo-shadow rounded p-6 text-[var(--color-on-primary-container)]">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" /> Independent Module Capstone
        </div>
        <h3 className="font-display font-black text-xl uppercase mb-2">
          {module.capstone.title}
        </h3>
        <p className="text-sm font-bold mb-4 leading-relaxed">
          {module.capstone.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-black">
          {module.capstone.expectedDeliverables.slice(0, 3).map((deliv, i) => (
            <div key={i} className="p-2.5 rounded bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] border-2 border-[#000000] flex items-center gap-1.5 neo-shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{deliv}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
