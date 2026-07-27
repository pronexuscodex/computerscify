import React from 'react';
import { Award, CheckCircle } from 'lucide-react';
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
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Award className="w-6 h-6 text-[#000000] dark:text-[#F2C94C] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-[#000000] dark:text-[#F6EFEF] break-words">Learner Project & Capstone Portfolio</h1>
            <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-xs font-bold leading-relaxed">
              Portfolio showcase converting completed capstone projects and lab engineering milestones into verifiable evidence of computer science craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* Capstone Projects Grid */}
      <div className="grid grid-cols-1 gap-6 min-w-0">
        {capstones.map((project) => (
          <div key={project.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#000000] pb-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="px-2.5 py-1 bg-[#F2C94C] text-[#000000] font-black text-xs rounded border border-[#000000] font-mono shrink-0 uppercase">
                  {project.courseCode}
                </span>
                <h3 className="font-display font-black text-lg uppercase text-[#000000] dark:text-[#F6EFEF] break-words">{project.title}</h3>
              </div>
              <span className="text-xs text-[#000000] dark:text-[#F2C94C] font-mono flex items-center gap-1 font-black shrink-0 uppercase">
                <CheckCircle className="w-4 h-4 text-[#82E0AA]" /> Verified Portfolio Submission
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs min-w-0 font-bold">
              <div className="p-3.5 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1 min-w-0">
                <h4 className="font-black uppercase">Problem Statement</h4>
                <p className="leading-relaxed break-words">{project.problemStatement}</p>
              </div>

              <div className="p-3.5 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1 min-w-0">
                <h4 className="font-black uppercase">Engineering Solution</h4>
                <p className="leading-relaxed break-words">{project.solutionSummary}</p>
              </div>
            </div>

            {/* Technologies Used Badges */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xs font-black uppercase">Technologies:</span>
              {project.technologiesUsed.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded bg-[#000000] text-[#FFFFFF] font-mono text-[10px] font-black border border-[#000000]">
                  {tech}
                </span>
              ))}
            </div>

            {/* Testing Evidence & Reflection */}
            <div className="p-3.5 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2 text-xs min-w-0 font-bold">
              <div className="min-w-0">
                <span className="font-black uppercase text-[#82E0AA]">Testing & Benchmark Evidence: </span>
                <span className="font-mono break-words">{project.testingEvidence}</span>
              </div>
              <div className="min-w-0">
                <span className="font-black uppercase text-[#000000] dark:text-[#F2C94C]">Engineering Reflection: </span>
                <span className="break-words">{project.reflectionNotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
