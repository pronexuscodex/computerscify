import React, { useState } from 'react';
import { Award, CheckCircle2, CheckSquare, Sparkles, AlertCircle } from 'lucide-react';
import { ALL_MODULES } from '../../data/curriculumData';
import { LearnerProgress, CapstoneProjectMilestone } from '../../types/curriculum';
import { saveLearnerProgress } from '../../services/storage';

interface CapstoneViewProps {
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
}

export const CapstoneView: React.FC<CapstoneViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const capstones: CapstoneProjectMilestone[] = ALL_MODULES.map(m => m.capstone);
  const [selectedCapstone, setSelectedCapstone] = useState<CapstoneProjectMilestone>(capstones[0]);
  const [draftNotes, setDraftNotes] = useState(progress.capstoneNotes[selectedCapstone.id] || '');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDraftNotes(val);
    const updated = {
      ...progress,
      capstoneNotes: { ...progress.capstoneNotes, [selectedCapstone.id]: val },
    };
    onUpdateProgress(updated);
    saveLearnerProgress(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Page Header */}
      <div className="border-b-4 border-[#000000] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-[#F2C94C]" />
          Un-Guided Capstones
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight">
          Capstone Workspaces
        </h1>
        <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold mt-1 max-w-2xl">
          Challenging, un-guided milestone projects designed to synthesize theory into real working code.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Capstone List */}
        <div className="lg:col-span-1 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#000000]/70 dark:text-[#F6EFEF]/70">
            Available Capstones
          </label>
          <div className="space-y-2">
            {capstones.map((cap, i) => {
              const isSelected = cap.id === selectedCapstone.id;
              return (
                <button
                  key={cap.id}
                  onClick={() => {
                    setSelectedCapstone(cap);
                    setDraftNotes(progress.capstoneNotes[cap.id] || '');
                  }}
                  className={`w-full text-left p-3 rounded border-2 border-[#000000] text-xs font-black uppercase transition-all ${
                    isSelected
                      ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                  }`}
                >
                  <div className="line-clamp-1">{cap.title}</div>
                  <div className="text-[10px] opacity-80 font-mono mt-0.5">Phase {i} Project</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Area */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          {/* Header Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-3 min-w-0">
            <span className="px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase">
              UN-GUIDED MILESTONE
            </span>
            <h2 className="font-display font-black text-2xl text-[#000000] dark:text-[#F6EFEF] uppercase break-words">
              {selectedCapstone.title}
            </h2>
            <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold leading-relaxed">
              {selectedCapstone.description}
            </p>
          </div>

          {/* Constraints & Deliverables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Constraints */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3 min-w-0">
              <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Project Constraints
              </h3>
              <ul className="space-y-2 text-xs text-[#000000] dark:text-[#F6EFEF] font-bold">
                {selectedCapstone.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#000000] dark:text-[#F2C94C] font-black">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Deliverables */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3 min-w-0">
              <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Expected Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-[#000000] dark:text-[#F6EFEF] font-bold">
                {selectedCapstone.expectedDeliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#82E0AA] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evaluation Rubric */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3 min-w-0">
            <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Evaluation Rubric
            </h3>
            <div className="space-y-2">
              {selectedCapstone.evaluationRubric.map((r, i) => (
                <div key={i} className="p-3 rounded bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] text-xs">
                  <div className="flex items-center justify-between font-black text-[#000000] dark:text-[#F6EFEF] uppercase mb-1 gap-2">
                    <span>{r.criterion}</span>
                    <span className="font-mono bg-[#F2C94C] text-[#000000] px-2 py-0.5 rounded border border-[#000000]">{r.weight}</span>
                  </div>
                  <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 font-medium">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Submission Editor */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-3 min-w-0">
            <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">
              Capstone Submission & Implementation Draft
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">
              Document your architectural decisions, test case outputs, or paste code snippets here.
            </p>
            <textarea
              value={draftNotes}
              onChange={handleNotesChange}
              placeholder="Paste implementation code, design documentation, and test logs..."
              className="w-full h-48 p-4 bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] border-2 border-[#000000] rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#F2C94C] resize-none font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
