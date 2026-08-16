import React, { useState, useEffect } from 'react';
import {
  Play,
  BookOpen,
  FileText,
  Award,
  Clock,
  ArrowRight,
  GraduationCap,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LearnerProgress, CurriculumModule, Topic } from '../../types/curriculum';
import { ALL_MODULES, ALL_TOPICS, getAllResearchPapers } from '../../data/curriculumData';
import { useNavigation } from '../../context/NavigationContext';
import { NavView } from '../layout/NavigationRail';
import { PageContainer } from '../common';

interface DashboardViewProps {
  progress: LearnerProgress;
  onSelectTopic: (topicId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onSelectPaper: (paperId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onSelectTopic,
  onSelectModule,
  onSelectPaper,
  onNavigate,
}) => {
  const { activeProgram, setActiveProgram } = useNavigation();
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
    <PageContainer className="animate-fade-in space-y-8 overflow-x-hidden">
      {/* Welcome Banner - Academic Neo-Brutalist Header */}
      <div className="bg-[#DFD9D8] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#F2C94C]" />
              First Principles Curriculum
            </div>

            {/* Degree Program Switcher Pills */}
            <div className="inline-flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#111010] p-1 rounded border-2 border-[#000000] neo-shadow-sm">
              <button
                type="button"
                onClick={() => setActiveProgram('computer-science')}
                className={`flex min-h-10 items-center gap-1 rounded px-2.5 py-1 text-[11px] font-black uppercase transition-all ${
                  activeProgram === 'computer-science'
                    ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]'
                    : 'text-[#000000]/70 dark:text-[#F6EFEF]/70 hover:text-[#000000] dark:hover:text-[#F6EFEF]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>B.S. CS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveProgram('data-science')}
                className={`flex min-h-10 items-center gap-1 rounded px-2.5 py-1 text-[11px] font-black uppercase transition-all ${
                  activeProgram === 'data-science'
                    ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]'
                    : 'text-[#000000]/70 dark:text-[#F6EFEF]/70 hover:text-[#000000] dark:hover:text-[#F6EFEF]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>B.S. DS</span>
              </button>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-[#F6EFEF] tracking-tight leading-tight uppercase">
            Welcome back, {progress.displayName}.
          </h1>
          <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-sm md:text-base font-bold">
            Studying <span className="underline decoration-2 decoration-[#F2C94C] text-[#000000] dark:text-[#F2C94C]">{activeProgram === 'computer-science' ? 'B.S. Computer Science' : 'B.S. Data Science'}</span>. You've completed <span className="font-mono underline text-[#000000] dark:text-[#F2C94C]">{completedCount}</span> of {totalTopics} topics ({percentComplete}%).
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111010] border-4 border-[#000000] neo-shadow-sm rounded p-4 shrink-0 w-full md:w-auto z-10 text-center sm:text-left">
          <div className="text-xs text-[#000000] dark:text-[#F6EFEF] font-black uppercase tracking-wider">Overall Progress</div>
          <div className="text-3xl font-mono font-black text-[#000000] dark:text-[#F2C94C] mt-0.5">{percentComplete}%</div>
          <div className="w-48 bg-[#DFD9D8] dark:bg-stone-800 h-3 border-2 border-[#000000] rounded-none overflow-hidden mt-2">
            <div className="bg-[#F2C94C] h-full" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>
      </div>

      {/* Continue Learning Modules Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Continue Module Path
          </h2>
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex min-h-11 items-center gap-1 rounded px-2 text-xs font-black uppercase tracking-wider text-[#000000] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] dark:text-[#F2C94C]"
          >
            Full Roadmap <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayModules.map(mod => {
            const modTopicIds = mod.topics.map(t => t.id);
            const done = modTopicIds.filter(id => progress.completedTopicIds.includes(id)).length;
            const pct = Math.round((done / modTopicIds.length) * 100);

            return (
              <article
                key={mod.id}
                className="neo-card p-5 flex flex-col justify-between h-full min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#000000] text-[#FFFFFF] text-[10px] font-black uppercase font-mono border border-[#000000]">
                      Phase {mod.phaseId}
                    </span>
                    <span className="text-xs font-mono font-black text-[#000000]/70 dark:text-[#F6EFEF]/70">{pct}% Complete</span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] font-display text-lg font-bold leading-snug text-[#000000] dark:text-[#F6EFEF]">{mod.title}</h3>
                  <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 line-clamp-2 mb-4 font-medium">{mod.summary}</p>
                </div>

                <div className="min-w-0">
                  <div className="w-full bg-[#DFD9D8] dark:bg-stone-800 h-2.5 border-2 border-[#000000] overflow-hidden mb-4">
                    <div className="bg-[#F2C94C] h-full" style={{ width: `${pct}%` }} />
                  </div>
                  {/* Primary Call to Action: Learning Gold #F2C94C */}
                  <button
                    type="button"
                    onClick={() => onSelectModule(mod.id)}
                    className="w-full py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs uppercase tracking-wider neo-btn flex items-center justify-center gap-2 transition-all min-h-[44px]"
                  >
                    <Play className="w-4 h-4 fill-[#000000]" /> Resume Module
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Next Lessons & Research Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Lessons Queue */}
        <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow p-6 min-w-0 rounded">
          <h2 className="font-display font-black text-xl text-[#000000] dark:text-[#F6EFEF] mb-4 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Next Lessons in Sequence
          </h2>
          <div className="space-y-3">
            {nextTopics.map((topic, idx) => (
              <button
                type="button"
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="w-full text-left p-4 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C]/20 transition-all flex items-center justify-between gap-4 neo-shadow-sm min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded bg-[#000000] text-[#FFFFFF] font-mono font-black text-xs flex items-center justify-center shrink-0 border border-[#000000]">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#000000] dark:text-[#F6EFEF]">
                      {topic.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-[#000000]/70 dark:text-[#F6EFEF]/70">{topic.summary}</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-[#F2C94C] text-[#000000] font-black text-xs uppercase tracking-wider rounded border-2 border-[#000000] shrink-0 flex items-center gap-1 min-h-[38px] neo-shadow-sm">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets: Research Spotlight & Capstone */}
        <div className="space-y-6 min-w-0">
          {/* Research Spotlight Card */}
          {recommendedPaper && (
            <div className="bg-[#D0BCFF] text-[#000000] border-4 border-[#000000] neo-shadow p-6 rounded flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wider text-[#000000] mb-2 min-w-0">
                  <span className="flex min-w-0 items-center gap-1.5 leading-tight">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Research Spotlight</span>
                  </span>
                  {papers.length > 1 && (
                    <div className="flex items-center gap-1 font-mono shrink-0">
                      <button
                        type="button"
                        onClick={() => setPaperIndex(prev => (prev > 0 ? prev - 1 : papers.length - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] shadow-[var(--ds-shadow-sm)] hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
                        aria-label="Previous paper"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1 text-[11px] font-black tabular-nums">{paperIndex + 1}/{papers.length}</span>
                      <button
                        type="button"
                        onClick={() => setPaperIndex(prev => (prev < papers.length - 1 ? prev + 1 : 0))}
                        className="flex h-7 w-7 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] shadow-[var(--ds-shadow-sm)] hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
                        aria-label="Next paper"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-black text-lg text-[#000000] mb-2 leading-tight uppercase break-words">
                  {recommendedPaper.title}
                </h3>
                <p className="mb-3 break-words font-mono text-xs font-bold text-[#000000]/80">
                  {recommendedPaper.authors.slice(0, 2).join(', ')} • {recommendedPaper.year}
                </p>
                <p className="text-xs text-[#000000] line-clamp-3 mb-4 font-semibold leading-relaxed">
                  {recommendedPaper.summary}
                </p>
              </div>
              <button
                onClick={() => onSelectPaper(recommendedPaper.id)}
                className="w-full py-2.5 bg-[#000000] text-[#FFFFFF] font-black text-xs uppercase tracking-wider rounded border-2 border-[#000000] flex items-center justify-center gap-2 hover:bg-[#F2C94C] hover:text-[#000000] transition-colors min-h-[44px] neo-shadow-sm"
              >
                Read Paper Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Current Capstone Widget */}
          <div className="bg-[#B4C5FF] text-[#000000] border-4 border-[#000000] neo-shadow p-6 rounded min-w-0">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#000000] mb-2">
              <Award className="w-4 h-4 shrink-0" /> Phase Capstone Milestone
            </div>
            <h3 className="font-display font-black text-base text-[#000000] mb-2 uppercase break-words">
              Phase 0 Capstone: First Principles Binary Encoder
            </h3>
            <p className="text-xs text-[#000000]/90 mb-4 font-semibold leading-relaxed">
              Construct a pure binary and two's complement encoder algorithm without using library shortcuts.
            </p>
            <button
              onClick={() => onNavigate('capstones')}
              className="w-full py-2.5 bg-[#000000] text-[#FFFFFF] font-black text-xs uppercase tracking-wider rounded border-2 border-[#000000] flex items-center justify-center gap-2 hover:bg-[#F2C94C] hover:text-[#000000] transition-colors min-h-[44px] neo-shadow-sm"
            >
              Open Capstone Workspace
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
