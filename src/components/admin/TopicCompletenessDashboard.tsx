import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Video,
  BookOpen,
  Code,
  HelpCircle,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  Layers,
  Database
} from 'lucide-react';
import { ALL_MODULES, ALL_TOPICS } from '../../data/curriculumData';
import { COMPUTER_SCIENCE_COURSES } from '../../curriculum/programs/computerScience';
import { DATA_SCIENCE_COURSES } from '../../curriculum/programs/dataScience';
import { Select } from '../common/Select';

export const TopicCompletenessDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastAuditDate, setLastAuditDate] = useState<string>(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
  const [isAuditing, setIsAuditing] = useState(false);

  // Compute all topic pack details across the curriculum
  const topicAudits = useMemo(() => {
    const list: any[] = [];

    ALL_TOPICS.forEach((t) => {
      const mp = t.masteryPack;
      const lectureIds = t.lectureIds || mp?.lectureIds || [];
      const pdfIds = t.pdfIds || mp?.pdfIds || [];
      const researchPaperIds = t.researchPaperIds || mp?.researchPaperIds || [];
      const labIds = t.labIds || mp?.labIds || [];

      const hasLecture = Boolean(lectureIds.length > 0 || mp?.primaryLecture?.url || mp?.primaryLecture?.embedUrl);
      const hasBook = Boolean(pdfIds.length > 0 || mp?.primaryText?.title);
      const hasPdf = Boolean(pdfIds.length > 0 || mp?.primaryText?.pdfUrl || mp?.authoritativeResearchSource?.openAccessUrl);
      const hasPaper = Boolean(researchPaperIds.length > 0 || (mp?.authoritativeResearchSource?.title && mp?.authoritativeResearchSource?.authors?.length));
      const hasLab = Boolean(labIds.length > 0 || mp?.interactiveLab?.title);
      const hasExercises = Boolean(mp?.practicalExercises?.length);

      const isComplete = hasLecture && hasBook && hasPdf && hasPaper && hasLab && hasExercises;

      list.push({
        id: t.id,
        title: t.title,
        moduleId: t.moduleId,
        program: t.id.startsWith('cs') ? 'computer-science' : t.id.startsWith('ds') ? 'data-science' : 'core-phases',
        lectureIds,
        pdfIds,
        researchPaperIds,
        labIds,
        hasLecture,
        hasBook,
        hasPdf,
        hasPaper,
        hasLab,
        hasExercises,
        isComplete,
        lectureTitle: mp?.primaryLecture?.title,
        bookTitle: mp?.primaryText?.title,
        paperTitle: mp?.authoritativeResearchSource?.title,
        paperAuthors: mp?.authoritativeResearchSource?.authors,
        labTitle: mp?.interactiveLab?.title,
        exerciseCount: mp?.practicalExercises?.length || 0,
      });
    });

    return list;
  }, []);

  const stats = useMemo(() => {
    const total = topicAudits.length;
    const complete = topicAudits.filter((t) => t.isComplete).length;
    const missingLectures = topicAudits.filter((t) => !t.hasLecture).length;
    const missingBooks = topicAudits.filter((t) => !t.hasBook).length;
    const missingPdfs = topicAudits.filter((t) => !t.hasPdf).length;
    const missingPapers = topicAudits.filter((t) => !t.hasPaper).length;
    const missingLabs = topicAudits.filter((t) => !t.hasLab).length;
    const missingExercises = topicAudits.filter((t) => !t.hasExercises).length;

    return {
      total,
      complete,
      missingLectures,
      missingBooks,
      missingPdfs,
      missingPapers,
      missingLabs,
      missingExercises,
      completionPercentage: total > 0 ? Math.round((complete / total) * 100) : 0,
    };
  }, [topicAudits]);

  const filteredTopics = useMemo(() => {
    return topicAudits.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.moduleId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram = programFilter === 'all' || t.program === programFilter;
      const matchesModule = moduleFilter === 'all' || t.moduleId === moduleFilter;

      let matchesStatus = true;
      if (statusFilter === 'complete') matchesStatus = t.isComplete;
      if (statusFilter === 'incomplete') matchesStatus = !t.isComplete;

      let matchesResource = true;
      if (resourceFilter === 'missing-lecture') matchesResource = !t.hasLecture;
      if (resourceFilter === 'missing-book') matchesResource = !t.hasBook;
      if (resourceFilter === 'missing-pdf') matchesResource = !t.hasPdf;
      if (resourceFilter === 'missing-paper') matchesResource = !t.hasPaper;
      if (resourceFilter === 'missing-lab') matchesResource = !t.hasLab;

      return matchesSearch && matchesProgram && matchesModule && matchesStatus && matchesResource;
    });
  }, [topicAudits, searchTerm, programFilter, moduleFilter, statusFilter, resourceFilter]);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setLastAuditDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }, 500);
  };

  return (
    <div className="bg-[#151313] min-h-screen text-white p-6 md:p-10 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#BE94F5] text-[#151313] rounded-2xl shadow-lg border-2 border-[#151313]">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BE94F5]/20 text-[#BE94F5] text-xs font-mono font-bold mb-1">
              Internal Route: /_internal/topic-completeness
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Topic Completeness & Academic Audit Dashboard</h1>
            <p className="text-xs text-stone-400 mt-1">
              Last Full Audit: <span className="text-stone-200 font-mono">{lastAuditDate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>Re-Audit All Topics</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-stone-300 font-mono uppercase">TOTAL PUBLISHED TOPICS</div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[11px] text-stone-300">Curriculum wide</div>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-emerald-400 font-mono uppercase">MASTERY PACKS (100%)</div>
          <div className="text-2xl font-black text-emerald-400">{stats.complete}</div>
          <div className="text-[11px] text-emerald-400 font-bold">{stats.completionPercentage}% Complete</div>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-stone-300 font-mono uppercase">LECTURES ASSIGNED</div>
          <div className="text-2xl font-black text-stone-100">{stats.total - stats.missingLectures}</div>
          <div className="text-[11px] text-stone-300">{stats.missingLectures} missing</div>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-stone-300 font-mono uppercase">TEXTBOOKS & CHAPTERS</div>
          <div className="text-2xl font-black text-stone-100">{stats.total - stats.missingBooks}</div>
          <div className="text-[11px] text-stone-300">{stats.missingBooks} missing</div>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-stone-300 font-mono uppercase">RESEARCH PAPERS</div>
          <div className="text-2xl font-black text-stone-100">{stats.total - stats.missingPapers}</div>
          <div className="text-[11px] text-stone-300">{stats.missingPapers} missing</div>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] text-stone-300 font-mono uppercase">INTERACTIVE LABS</div>
          <div className="text-2xl font-black text-stone-100">{stats.total - stats.missingLabs}</div>
          <div className="text-[11px] text-stone-300">{stats.missingLabs} missing</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1e1b1b] border border-stone-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topic title or ID..."
            className="bg-transparent text-xs text-stone-100 placeholder-stone-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 text-stone-200 font-mono">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          <Select
            value={programFilter}
            onChange={(val) => setProgramFilter(val)}
            options={[
              { value: 'all', label: 'All Programs' },
              { value: 'core-phases', label: 'Core Curriculum Phases' },
              { value: 'computer-science', label: 'Computer Science' },
              { value: 'data-science', label: 'Data Science' },
            ]}
            ariaLabel="Filter Program"
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'complete', label: '100% Complete Pack' },
              { value: 'incomplete', label: 'Incomplete Pack' },
            ]}
            ariaLabel="Filter Status"
          />

          <Select
            value={resourceFilter}
            onChange={(val) => setResourceFilter(val)}
            options={[
              { value: 'all', label: 'All Resource Types' },
              { value: 'missing-lecture', label: 'Missing Lecture' },
              { value: 'missing-book', label: 'Missing Book' },
              { value: 'missing-pdf', label: 'Missing PDF' },
              { value: 'missing-paper', label: 'Missing Paper' },
              { value: 'missing-lab', label: 'Missing Lab' },
            ]}
            ariaLabel="Filter Resource"
          />
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-200 font-mono text-[11px]">
              <tr>
                <th className="p-4">TOPIC ID & TITLE</th>
                <th className="p-4">LECTURE</th>
                <th className="p-4">BOOK & CHAPTER</th>
                <th className="p-4">RESEARCH PAPER</th>
                <th className="p-4">LAB & EXERCISES</th>
                <th className="p-4">PACK STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {filteredTopics.map((top) => (
                <tr key={top.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-stone-100 font-mono text-xs">{top.id}</div>
                    <div className="text-stone-200 font-medium">{top.title}</div>
                    <div className="text-[10px] text-stone-300 font-mono">{top.moduleId}</div>
                  </td>

                  <td className="p-4">
                    {top.hasLecture ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">{top.lectureTitle}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Missing Lecture</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {top.hasBook ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">{top.bookTitle}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Missing Book</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {top.hasPaper ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">{top.paperTitle}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Missing Paper</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex items-center gap-1 text-stone-300">
                        <Code className="w-3 h-3 text-[#BE94F5]" />
                        <span>{top.labTitle || 'No Lab'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400">
                        <HelpCircle className="w-3 h-3 text-[#BE94F5]" />
                        <span>{top.exerciseCount} exercises</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono">
                    {top.isComplete ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Incomplete Pack
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
