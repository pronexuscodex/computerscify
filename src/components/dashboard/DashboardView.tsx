import React, { useState, useEffect } from 'react';
import {
  Play,
  BookOpen,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LearnerProgress, CurriculumModule, Topic } from '../../types/curriculum';
import { ALL_MODULES, ALL_TOPICS, getAllResearchPapers } from '../../data/curriculumData';

interface DashboardViewProps {
  progress: LearnerProgress;
  onSelectTopic: (topicId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onSelectPaper: (paperId: string) => void;
  onNavigate: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onSelectTopic,
  onSelectModule,
  onSelectPaper,
  onNavigate,
}) => {
  const totalTopics = ALL_TOPICS.length;
  const completedCount = progress.completedTopicIds.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  // Identify active modules in progress or starting
  const activeModules: CurriculumModule[] = ALL_MODULES.filter(m => {
    const modTopicIds = m.topics.map(t => t.id);
    const completedModTopics = modTopicIds.filter(id => progress.completedTopicIds.includes(id));
    return completedModTopics.length > 0 && completedModTopics.length < modTopicIds.length;
  });

  // If no module in progress, suggest Module 1
  const displayModules = activeModules.length > 0 ? activeModules.slice(0, 3) : ALL_MODULES.slice(0, 3);

  // Identify next uncompleted topics
  const uncompletedTopics: Topic[] = ALL_TOPICS.filter(
    t => !progress.completedTopicIds.includes(t.id)
  );
  const nextTopics = uncompletedTopics.slice(0, 4);

  // Recommended research papers mapped dynamically to progress
  const papers = getAllResearchPapers();
  const [paperIndex, setPaperIndex] = useState(0);

  // Match paper to current or next uncompleted topic if possible
  useEffect(() => {
    if (nextTopics.length > 0) {
      const activeTopic = nextTopics[0];
      const matchingPaperIdx = papers.findIndex(p =>
        activeTopic.researchPaperIds?.includes(p.id) ||
        activeTopic.masteryPack?.authoritativeResearchSource?.id === p.id
      );
      if (matchingPaperIdx !== -1) {
        setPaperIndex(matchingPaperIdx);
      }
    }
  }, [progress.lastVisitedTopicId]);

  const recommendedPaper = papers[paperIndex] || papers[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden">
      {/* Welcome Banner */}
      <div className="bg-[#BE94F5] brand-border brand-shadow-lg rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-[#FCCC42]" />
            First Principles Curriculum
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#151313] tracking-tight leading-tight">
            Welcome back, {progress.displayName}.
          </h1>
          <p className="mt-2 text-[#151313]/80 text-sm md:text-base font-medium">
            You've completed <span className="font-bold">{completedCount}</span> of {totalTopics} topics ({percentComplete}%). Keep building your foundational computer science mastery.
          </p>
        </div>

        <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-4 shrink-0 w-full md:w-auto z-10 text-center sm:text-left">
          <div className="text-xs text-[#151313]/60 font-semibold uppercase tracking-wider">Overall Progress</div>
          <div className="text-3xl font-display font-extrabold text-[#151313] mt-0.5">{percentComplete}%</div>
          <div className="w-48 bg-[#151313]/10 h-2.5 rounded-full overflow-hidden mt-2 border border-[#151313]">
            <div className="bg-[#BE94F5] h-full rounded-full" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>
      </div>

      {/* Continue Learning Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-[#151313] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#BE94F5]" /> Continue Learning
          </h2>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-bold text-[#151313] hover:text-[#BE94F5] flex items-center gap-1 underline"
          >
            View Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayModules.map(mod => {
            const modTopicIds = mod.topics.map(t => t.id);
            const done = modTopicIds.filter(id => progress.completedTopicIds.includes(id)).length;
            const pct = Math.round((done / modTopicIds.length) * 100);

            const cardBg =
              mod.colorAccent === 'yellow'
                ? 'bg-[#FCCC42]'
                : mod.colorAccent === 'lavender'
                ? 'bg-[#BE94F5]'
                : mod.colorAccent === 'mint'
                ? 'bg-[#82E0AA]'
                : mod.colorAccent === 'coral'
                ? 'bg-[#BE94F5] text-[#151313]'
                : 'bg-[#F7F7F5]';

            return (
              <div
                key={mod.id}
                className={`${cardBg} brand-border brand-shadow-hover rounded-2xl p-5 flex flex-col justify-between h-full cursor-pointer min-w-0`}
                onClick={() => onSelectModule(mod.id)}
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#151313] text-[#F7F7F5] text-[10px] font-bold uppercase font-mono">
                      Phase {mod.phaseId}
                    </span>
                    <span className="text-xs font-bold font-mono">{pct}% Complete</span>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-snug mb-2 truncate">{mod.title}</h3>
                  <p className="text-xs opacity-90 line-clamp-2 mb-4">{mod.summary}</p>
                </div>

                <div className="min-w-0">
                  <div className="w-full bg-[#151313]/20 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-[#151313] h-full" style={{ width: `${pct}%` }} />
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectModule(mod.id);
                    }}
                    className="w-full py-2 bg-[#151313] text-[#F7F7F5] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#FCCC42] hover:text-[#151313] transition-colors min-h-[44px]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Continue Module
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Next Lessons & Research Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Lessons Queue */}
        <div className="lg:col-span-2 bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 min-w-0">
          <h2 className="font-display font-bold text-xl text-[#151313] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#BE94F5]" /> Next Lessons in Sequence
          </h2>
          <div className="space-y-3">
            {nextTopics.map((topic, idx) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="p-4 rounded-xl border border-[#151313]/15 hover:border-[#151313] bg-[#F7F7F5] hover:bg-[#BE94F5]/10 transition-all cursor-pointer flex items-center justify-between gap-4 brand-shadow-sm min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#151313] text-[#F7F7F5] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-[#151313] hover:text-[#BE94F5] transition-colors truncate">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#151313]/70 truncate">{topic.summary}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#FCCC42] text-[#151313] font-bold text-xs rounded-lg border border-[#151313] shrink-0 flex items-center gap-1 min-h-[36px]">
                  Start <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets: Research Spotlight & Capstone */}
        <div className="space-y-6 min-w-0">
          {/* Research Spotlight Card */}
          {recommendedPaper && (
            <div className="bg-[#82E0AA] brand-border brand-shadow-lg rounded-2xl p-6 flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-[#151313] mb-2 min-w-0">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">Research Spotlight</span>
                  </span>
                  {papers.length > 1 && (
                    <div className="flex items-center gap-1 font-mono shrink-0">
                      <button
                        type="button"
                        onClick={() => setPaperIndex(prev => (prev > 0 ? prev - 1 : papers.length - 1))}
                        className="p-1 bg-[#151313]/10 hover:bg-[#151313]/20 rounded border border-[#151313] flex items-center justify-center min-h-[28px] min-w-[28px]"
                        aria-label="Previous paper"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-[#151313]" />
                      </button>
                      <span className="px-0.5 text-xs">{paperIndex + 1}/{papers.length}</span>
                      <button
                        type="button"
                        onClick={() => setPaperIndex(prev => (prev < papers.length - 1 ? prev + 1 : 0))}
                        className="p-1 bg-[#151313]/10 hover:bg-[#151313]/20 rounded border border-[#151313] flex items-center justify-center min-h-[28px] min-w-[28px]"
                        aria-label="Next paper"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-[#151313]" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-bold text-lg text-[#151313] mb-2 leading-tight break-words">
                  {recommendedPaper.title}
                </h3>
                <p className="text-xs text-[#151313]/80 font-mono mb-3 truncate">
                  {recommendedPaper.authors.slice(0, 2).join(', ')} • {recommendedPaper.year}
                </p>
                <p className="text-xs text-[#151313] line-clamp-3 mb-4 font-medium">
                  {recommendedPaper.summary}
                </p>
              </div>
              <button
                onClick={() => onSelectPaper(recommendedPaper.id)}
                className="w-full py-2.5 bg-[#151313] text-[#F7F7F5] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#BE94F5] hover:text-[#151313] transition-colors min-h-[44px]"
              >
                Read Paper Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Current Capstone Widget */}
          <div className="bg-[#FCCC42] brand-border brand-shadow-lg rounded-2xl p-6 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#151313] mb-2">
              <Award className="w-4 h-4 shrink-0" /> Phase Capstone Milestone
            </div>
            <h3 className="font-display font-bold text-base text-[#151313] mb-2 break-words">
              Phase 0 Capstone: First Principles Binary Encoder
            </h3>
            <p className="text-xs text-[#151313]/80 mb-4">
              Construct a pure binary and two's complement encoder algorithm without using library shortcuts.
            </p>
            <button
              onClick={() => onNavigate('capstones')}
              className="w-full py-2 bg-[#151313] text-[#F7F7F5] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#BE94F5] hover:text-[#151313] transition-colors min-h-[44px]"
            >
              Open Capstone Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
