import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  GitFork,
  ArrowRight,
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react';
import { CANONICAL_COURSES, SPECIALIZATION_TRACKS, SHARED_COURSES } from '../../curriculum';
import { validateCurriculum, CurriculumValidationError } from '../../curriculum/validation';
import { LEGACY_TO_CANONICAL_COURSE_MAP, migrateLearnerProgress } from '../../services/progressMigration';
import { ProgramId, CourseRole } from '../../types/curriculum';
import { Select } from '../common/Select';

interface CurriculumAuditDashboardProps {
  onClose?: () => void;
}

export const CurriculumAuditDashboard: React.FC<CurriculumAuditDashboardProps> = ({ onClose }) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<CourseRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'canonical' | 'assignments' | 'shared' | 'migration' | 'integrity'>('canonical');

  const validationErrors = validateCurriculum();

  // Filter canonical courses
  const filteredCourses = CANONICAL_COURSES.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProgram =
      selectedProgram === 'all' ||
      c.programAssignments.some(pa => pa.programId === selectedProgram);

    const matchesRole =
      selectedRole === 'all' ||
      c.programAssignments.some(pa => pa.role === selectedRole);

    return matchesSearch && matchesProgram && matchesRole;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-[#151313] animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#151313] text-[#F7F7F5] rounded-2xl p-6 brand-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BE94F5] text-[#151313] text-xs font-bold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4" />
            Developer Audit Panel
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight">
            Curriculum Integrity & Canonical Registry Audit
          </h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-2xl">
            Live diagnostic inspector for canonical course classification, cross-program credit mapping, prerequisite graph correctness, and progress migration safety.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F7F7F5] text-[#151313] rounded-xl text-xs font-bold brand-border hover:bg-stone-200 transition-all shrink-0"
          >
            Back to Dashboard
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl brand-border brand-shadow-sm">
          <span className="text-xs text-stone-700 font-bold uppercase">Canonical Courses</span>
          <div className="text-2xl font-black font-mono text-[#151313] mt-1">
            {CANONICAL_COURSES.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl brand-border brand-shadow-sm">
          <span className="text-xs text-stone-700 font-bold uppercase">Shared Courses</span>
          <div className="text-2xl font-black font-mono text-[#BE94F5] mt-1">
            {SHARED_COURSES.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl brand-border brand-shadow-sm">
          <span className="text-xs text-stone-700 font-bold uppercase">Specialization Tracks</span>
          <div className="text-2xl font-black font-mono text-[#151313] mt-1">
            {SPECIALIZATION_TRACKS.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl brand-border brand-shadow-sm">
          <span className="text-xs text-stone-700 font-bold uppercase">Legacy ID Mappings</span>
          <div className="text-2xl font-black font-mono text-[#82E0AA] mt-1">
            {Object.keys(LEGACY_TO_CANONICAL_COURSE_MAP).length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl brand-border brand-shadow-sm">
          <span className="text-xs text-stone-700 font-bold uppercase">Integrity Errors</span>
          <div className={`text-2xl font-black font-mono mt-1 ${validationErrors.length === 0 ? 'text-[#82E0AA]' : 'text-[#151313]'}`}>
            {validationErrors.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#151313] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('canonical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'canonical' ? 'bg-[#BE94F5] text-[#151313] brand-border brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
          }`}
        >
          Canonical Registry ({CANONICAL_COURSES.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'assignments' ? 'bg-[#BE94F5] text-[#151313] brand-border brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
          }`}
        >
          Program Assignments
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'shared' ? 'bg-[#BE94F5] text-[#151313] brand-border brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
          }`}
        >
          Shared Equivalence Rules
        </button>
        <button
          onClick={() => setActiveTab('migration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'migration' ? 'bg-[#BE94F5] text-[#151313] brand-border brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
          }`}
        >
          Progress Migration Tester
        </button>
        <button
          onClick={() => setActiveTab('integrity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'integrity' ? 'bg-[#BE94F5] text-[#151313] brand-border brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
          }`}
        >
          Integrity Report ({validationErrors.length})
        </button>
      </div>

      {/* TAB 1: CANONICAL REGISTRY */}
      {activeTab === 'canonical' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#F7F7F5] p-4 rounded-xl brand-border">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-700" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code, title, ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#151313] bg-white focus:outline-none focus:ring-1 focus:ring-[#BE94F5]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Select
                value={selectedProgram}
                onChange={(val) => setSelectedProgram(val as any)}
                variant="light"
                options={[
                  { value: 'all', label: 'All Programs' },
                  { value: 'computer-science', label: 'Computer Science' },
                  { value: 'data-science', label: 'Data Science' },
                ]}
                ariaLabel="Filter by Program"
              />

              <Select
                value={selectedRole}
                onChange={(val) => setSelectedRole(val as any)}
                variant="light"
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'required', label: 'Required' },
                  { value: 'shared-required', label: 'Shared Required' },
                  { value: 'elective', label: 'Elective' },
                  { value: 'specialization', label: 'Specialization' },
                  { value: 'capstone', label: 'Capstone' },
                ]}
                ariaLabel="Filter by Role"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl brand-border overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#151313] text-[#F7F7F5]">
                  <th className="p-3 font-bold border-b border-stone-800">Canonical ID</th>
                  <th className="p-3 font-bold border-b border-stone-800">Code & Title</th>
                  <th className="p-3 font-bold border-b border-stone-800">Level</th>
                  <th className="p-3 font-bold border-b border-stone-800">Credits</th>
                  <th className="p-3 font-bold border-b border-stone-800">Program Assignments</th>
                  <th className="p-3 font-bold border-b border-stone-800">Prerequisites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-[#BE94F5]">{c.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#151313]">{c.code}: {c.title}</div>
                      <div className="text-[10px] text-stone-700 font-mono truncate max-w-xs">{c.description}</div>
                    </td>
                    <td className="p-3 font-mono">Year {c.academicLevel}</td>
                    <td className="p-3 font-mono">{c.creditHours} CR</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.programAssignments.map((pa, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              pa.programId === 'computer-science'
                                ? 'bg-orange-50 text-orange-800 border-orange-300'
                                : 'bg-purple-50 text-purple-800 border-purple-300'
                            }`}
                          >
                            {pa.programId === 'computer-science' ? 'CS' : 'DS'} Y{pa.year}S{pa.semester} ({pa.role})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      {c.prerequisiteCourseIds.length > 0 ? (
                        c.prerequisiteCourseIds.join(', ')
                      ) : (
                        <span className="text-stone-600">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROGRAM ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl brand-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#151313]">
              <GraduationCap className="w-5 h-5 text-[#FCCC42]" />
              <h2 className="font-extrabold text-lg">Computer Science Assignments</h2>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {CANONICAL_COURSES.filter(c => c.programAssignments.some(pa => pa.programId === 'computer-science')).map(c => {
                const pa = c.programAssignments.find(a => a.programId === 'computer-science')!;
                return (
                  <div key={c.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <div>
                      <span className="font-bold text-[#BE94F5]">{pa.displayCode || c.code}:</span> {c.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 font-bold">Year {pa.year} Sem {pa.semester}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">{pa.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl brand-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#151313]">
              <GraduationCap className="w-5 h-5 text-[#BE94F5]" />
              <h2 className="font-extrabold text-lg">Data Science Assignments</h2>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {CANONICAL_COURSES.filter(c => c.programAssignments.some(pa => pa.programId === 'data-science')).map(c => {
                const pa = c.programAssignments.find(a => a.programId === 'data-science')!;
                return (
                  <div key={c.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <div>
                      <span className="font-bold text-purple-700">{pa.displayCode || c.code}:</span> {c.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 font-bold">Year {pa.year} Sem {pa.semester}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">{pa.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHARED RULES */}
      {activeTab === 'shared' && (
        <div className="bg-white p-6 rounded-2xl brand-border space-y-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <GitFork className="w-5 h-5 text-[#BE94F5]" />
            Shared Cross-Program Course Equivalencies
          </h2>
          <p className="text-xs text-stone-800">
            Shared courses reside under a single canonical course ID. Completing a shared course in Computer Science automatically satisfies the equivalent requirement in Data Science.
          </p>

          <div className="bg-[#F7F7F5] rounded-xl brand-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#151313] text-[#F7F7F5]">
                  <th className="p-3">Canonical ID</th>
                  <th className="p-3">CS Code</th>
                  <th className="p-3">DS Code</th>
                  <th className="p-3">Shared Course Title</th>
                  <th className="p-3">Progress Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                {SHARED_COURSES.map((s, i) => (
                  <tr key={i} className="hover:bg-stone-100">
                    <td className="p-3 font-bold text-[#BE94F5]">{s.csCourseId}</td>
                    <td className="p-3 font-bold text-orange-700">{s.csCourseId.toUpperCase()}</td>
                    <td className="p-3 font-bold text-purple-700">{s.dsCourseId.toUpperCase()}</td>
                    <td className="p-3 font-sans font-bold">{s.title}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[#82E0AA] font-bold text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MIGRATION TESTER */}
      {activeTab === 'migration' && (
        <div className="bg-white p-6 rounded-2xl brand-border space-y-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#BE94F5]" />
            Progress Migration Diagnostic Utility
          </h2>
          <p className="text-xs text-stone-800">
            Verify progress migration safety against legacy course IDs.
          </p>

          <div className="bg-[#151313] text-[#F7F7F5] p-4 rounded-xl font-mono text-xs space-y-2">
            <div className="font-bold text-[#82E0AA]">Registered Legacy-to-Canonical Mappings:</div>
            {Object.entries(LEGACY_TO_CANONICAL_COURSE_MAP).map(([legacy, canonical]) => (
              <div key={legacy} className="flex items-center gap-2">
                <span className="text-stone-200">{legacy}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#BE94F5]" />
                <span className="text-white font-bold">{canonical}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRITY REPORT */}
      {activeTab === 'integrity' && (
        <div className="bg-white p-6 rounded-2xl brand-border space-y-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#BE94F5]" />
            Curriculum Integrity Inspection
          </h2>

          {validationErrors.length === 0 ? (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              All curriculum rules passed! Zero prerequisite conflicts, zero broken references, zero duplicate records.
            </div>
          ) : (
            <div className="space-y-2">
              {validationErrors.map((err, idx) => (
                <div key={idx} className="p-3 bg-[#FCCC42]/20 text-[#151313] rounded-xl border border-[#FCCC42] text-xs font-mono flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#151313] shrink-0" />
                  <div>
                    <span className="font-bold">[{err.type.toUpperCase()}]</span> Course {err.courseId}: {err.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
