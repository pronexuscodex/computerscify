import React, { useState } from 'react';
import { Award, CheckCircle2, FileText, Code, CheckSquare, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#151313]">
      {/* Page Header */}
      <div className="border-b border-[#151313] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono mb-2">
          <Award className="w-3.5 h-3.5 text-[#FCCC42]" />
          Un-Guided Capstones
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#151313] tracking-tight">
          Capstone Workspaces
        </h1>
        <p className="text-sm text-[#151313]/70 font-medium mt-1">
          Challenging, un-guided milestone projects designed to synthesize theory into real working code.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Capstone List */}
        <div className="lg:col-span-1 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#151313]/60">
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
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#BE94F5] text-[#151313] border-[#151313] brand-shadow-sm'
                      : 'bg-[#F7F7F5] border-[#151313]/20 hover:border-[#151313]'
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
          <div className="bg-[#BE94F5] brand-border brand-shadow-lg rounded-2xl p-6 space-y-3 min-w-0">
            <span className="px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono">
              UN-GUIDED MILESTONE
            </span>
            <h2 className="font-display font-extrabold text-2xl text-[#151313] break-words">
              {selectedCapstone.title}
            </h2>
            <p className="text-sm text-[#151313]/90 font-medium leading-relaxed">
              {selectedCapstone.description}
            </p>
          </div>

          {/* Constraints & Deliverables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Constraints */}
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-3 min-w-0">
              <h3 className="font-display font-bold text-base text-[#151313] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#BE94F5]" /> Project Constraints
              </h3>
              <ul className="space-y-2 text-xs text-[#151313] font-medium">
                {selectedCapstone.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#BE94F5] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Deliverables */}
            <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-3 min-w-0">
              <h3 className="font-display font-bold text-base text-[#151313] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#82E0AA]" /> Expected Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-[#151313] font-medium">
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
          <div className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-3 min-w-0">
            <h3 className="font-display font-bold text-base text-[#151313] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FCCC42]" /> Evaluation Rubric
            </h3>
            <div className="space-y-2">
              {selectedCapstone.evaluationRubric.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#151313]/5 border border-[#151313]/10 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#151313] mb-1 gap-2">
                    <span>{r.criterion}</span>
                    <span className="font-mono text-[#151313] bg-[#BE94F5] px-2 py-0.5 rounded">{r.weight}</span>
                  </div>
                  <p className="text-[#151313]/80">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Submission Editor */}
          <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 space-y-3 min-w-0">
            <h3 className="font-display font-bold text-base text-[#151313]">
              Capstone Submission & Implementation Draft
            </h3>
            <p className="text-xs text-[#151313]/70 font-medium">
              Document your architectural decisions, test case outputs, or paste code snippets here.
            </p>
            <textarea
              value={draftNotes}
              onChange={handleNotesChange}
              placeholder="Paste implementation code, design documentation, and test logs..."
              className="w-full h-48 p-4 bg-[#F7F7F5] text-[#151313] border border-[#151313] rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#BE94F5] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
