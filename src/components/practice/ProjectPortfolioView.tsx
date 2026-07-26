import React from 'react';
import { Award, ExternalLink, FileCode, CheckCircle, Sparkles } from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';

interface ProjectPortfolioViewProps {
  progress: LearnerProgress;
}

export const ProjectPortfolioView: React.FC<ProjectPortfolioViewProps> = ({ progress }) => {
  const capstones = [
    {
      id: 'cap-cs-101',
      courseCode: 'CS 101',
      title: 'RISC-V Virtual Processor & Assembler in TypeScript',
      problemStatement: 'Construct a multi-stage CPU instruction decoder, register file, RAM memory array, and assembler from first principles.',
      solutionSummary: 'Implemented 32-bit R-type, I-type, S-type, and J-type instruction decoding with ALU operations, branch logic, and memory-mapped IO.',
      technologiesUsed: ['TypeScript', 'Bitwise Operations', 'ALU Architecture', 'Memory-Mapped I/O'],
      testingEvidence: 'Passed 48/48 instruction test vectors including fibonacci recursive call stack execution.',
      reflectionNotes: 'Deepened understanding of clock cycles, program counter updates, and stack pointer register conventions.'
    },
    {
      id: 'cap-ds-101',
      courseCode: 'DS 101',
      title: 'High-Performance Columnar Storage Engine in Python',
      problemStatement: 'Build a columnar database file parser with dictionary compression and vectorized query aggregation.',
      solutionSummary: 'Engineered run-length encoding (RLE), dictionary encoding, and SIMD-like NumPy aggregations over compressed column chunks.',
      technologiesUsed: ['Python', 'NumPy', 'Columnar Storage', 'Run-Length Encoding'],
      testingEvidence: 'Achieved 14x faster query execution over row-oriented CSV parsing on 1M rows dataset.',
      reflectionNotes: 'Demonstrated why OLAP analytical engines outperform OLTP engines for large aggregations.'
    }
  ];

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white brand-shadow min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Award className="w-6 h-6 text-[#BE94F5] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-2xl text-white break-words">Learner Project & Capstone Portfolio</h1>
            <p className="text-stone-400 text-xs leading-relaxed">
              Portfolio showcase converting completed capstone projects and lab engineering milestones into verifiable evidence of computer science craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* Capstone Projects Grid */}
      <div className="grid grid-cols-1 gap-6 min-w-0">
        {capstones.map((project) => (
          <div key={project.id} className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white space-y-4 brand-shadow min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="px-2.5 py-1 bg-[#BE94F5] text-[#151313] font-bold text-xs rounded-lg font-mono shrink-0">
                  {project.courseCode}
                </span>
                <h3 className="font-display font-bold text-lg text-stone-100 break-words">{project.title}</h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold shrink-0">
                <CheckCircle className="w-4 h-4" /> Verified Portfolio Submission
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs min-w-0">
              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl space-y-1 min-w-0">
                <h4 className="font-bold text-stone-200">Problem Statement</h4>
                <p className="text-stone-400 leading-relaxed break-words">{project.problemStatement}</p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl space-y-1 min-w-0">
                <h4 className="font-bold text-stone-200">Engineering Solution</h4>
                <p className="text-stone-400 leading-relaxed break-words">{project.solutionSummary}</p>
              </div>
            </div>

            {/* Technologies Used Badges */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xs text-stone-400 font-medium">Technologies:</span>
              {project.technologiesUsed.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 font-mono text-[10px]">
                  {tech}
                </span>
              ))}
            </div>

            {/* Testing Evidence & Reflection */}
            <div className="p-3.5 bg-stone-950/80 border border-stone-800/80 rounded-xl space-y-2 text-xs min-w-0">
              <div className="min-w-0">
                <span className="font-bold text-emerald-400">Testing & Benchmark Evidence: </span>
                <span className="text-stone-300 font-mono break-words">{project.testingEvidence}</span>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#BE94F5]">Engineering Reflection: </span>
                <span className="text-stone-300 break-words">{project.reflectionNotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
