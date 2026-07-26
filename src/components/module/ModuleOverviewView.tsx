import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Play,
  ArrowLeft,
  FileText,
  Video,
  ListChecks,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { CurriculumModule, LearnerProgress } from '../../types/curriculum';

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

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-[#151313] hover:text-[#BE94F5] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum Roadmap
      </button>

      {/* Module Header Card */}
      <div className="bg-[#BE94F5] brand-border brand-shadow-lg rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono">
            Phase {module.phaseId} Module
          </span>
          <span className="px-3 py-1 rounded-full bg-[#F7F7F5] text-[#151313] text-xs font-bold border border-[#151313]">
            {module.category.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FCCC42] text-[#151313] text-xs font-bold border border-[#151313] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ~{module.estimatedHours} Hours
          </span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#151313] tracking-tight leading-tight">
          {module.title}
        </h1>

        <p className="text-sm md:text-base text-[#151313]/90 font-medium max-w-3xl leading-relaxed">
          {module.summary}
        </p>

        {/* Progress Bar */}
        <div className="pt-4 border-t border-[#151313]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-48 bg-[#151313]/10 h-3 rounded-full overflow-hidden border border-[#151313]">
              <div className="bg-[#151313] h-full rounded-full" style={{ width: `${percentComplete}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-[#151313]">
              {completedTopics.length}/{module.topics.length} Topics ({percentComplete}%)
            </span>
          </div>

          <button
            onClick={() => onSelectTopic(module.topics[0].id)}
            className="px-5 py-2.5 bg-[#151313] text-[#F7F7F5] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#FCCC42] hover:text-[#151313] transition-colors brand-shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            {percentComplete > 0 ? 'Resume Module' : 'Start Module'}
          </button>
        </div>
      </div>

      {/* Module Objectives & Prerequisites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-[#151313] mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#BE94F5]" /> Module Objective
          </h2>
          <p className="text-sm text-[#151313]/80 leading-relaxed font-medium">
            {module.objective}
          </p>
        </div>

        <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-[#151313] mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#BE94F5]" /> Prerequisites
          </h2>
          <p className="text-sm text-[#151313]/80 leading-relaxed font-medium">
            {module.prerequisiteModuleIds.length > 0
              ? `Requires completion of prerequisite modules: ${module.prerequisiteModuleIds.join(', ')}.`
              : 'None. This is an introductory foundational module.'}
          </p>
        </div>
      </div>

      {/* Topic Curriculum List */}
      <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6">
        <h2 className="font-display font-bold text-xl text-[#151313] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#82E0AA]" /> Topic Curriculum & Mastery Packs
        </h2>

        <div className="space-y-3">
          {module.topics.map((topic, idx) => {
            const isCompleted = progress.completedTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`p-4 rounded-xl border border-[#151313] transition-all cursor-pointer flex items-center justify-between gap-4 brand-shadow-sm ${
                  isCompleted ? 'bg-[#82E0AA]/20' : 'bg-[#F7F7F5] hover:bg-[#BE94F5]/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-full font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#151313] ${
                      isCompleted ? 'bg-[#82E0AA] text-[#151313]' : 'bg-[#151313] text-[#F7F7F5]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#151313] hover:text-[#BE94F5] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#151313]/70 line-clamp-1">{topic.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] font-mono text-[#151313]/60 bg-[#151313]/5 px-2 py-0.5 rounded">
                    ~{topic.masteryPack.estimatedStudyMinutes} mins
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#151313]/40" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Capstone Preview */}
      <div className="bg-[#FCCC42] brand-border brand-shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#151313] mb-2">
          <Award className="w-4 h-4" /> Un-Guided Module Capstone Milestone
        </div>
        <h3 className="font-display font-bold text-xl text-[#151313] mb-2">
          {module.capstone.title}
        </h3>
        <p className="text-sm text-[#151313]/80 mb-4 font-medium leading-relaxed">
          {module.capstone.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
          {module.capstone.expectedDeliverables.slice(0, 3).map((deliv, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#151313] text-[#151313] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{deliv}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
