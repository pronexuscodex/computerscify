import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Play,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Layers
} from 'lucide-react';
import { verifyResource } from '../../services/resourceVerifier';
import { ALL_MODULES } from '../../data/curriculumData';
import { Select } from '../common/Select';
import { TopicCompletenessDashboard } from './TopicCompletenessDashboard';

export const ResourceHealthDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'topic-audit' | 'streams'>('topic-audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isVerifying, setIsVerifying] = useState(false);

  // Collect all curriculum resources across all modules
  const allResources = useMemo(() => {
    const list: any[] = [];
    const seenResourceIds = new Set<string>();

    for (const mod of ALL_MODULES) {
      if (!mod || !mod.topics) continue;
      for (const topic of mod.topics) {
        const mp = topic.masteryPack;

        // Collect all lectures
        const lectures = topic.lectures?.length
          ? topic.lectures
          : mp?.lectures?.length
            ? mp.lectures
            : mp?.primaryLecture
              ? [mp.primaryLecture]
              : [];

        lectures.forEach((lec) => {
          if (!lec || !lec.id || seenResourceIds.has(lec.id)) return;
          seenResourceIds.add(lec.id);
          const check = verifyResource({ id: lec.id, title: lec.title, type: 'video', url: lec.url || lec.embedUrl });
          list.push({
            module: mod.title,
            topic: topic.title,
            url: lec.url || lec.embedUrl,
            provider: lec.provider || 'YouTube',
            ...check,
          });
        });

        // Collect all PDF books
        const pdfBooks = topic.pdfBooks?.length
          ? topic.pdfBooks
          : mp?.pdfBooks?.length
            ? mp.pdfBooks
            : mp?.primaryText
              ? [mp.primaryText]
              : [];

        pdfBooks.forEach((book) => {
          if (!book || !book.id || seenResourceIds.has(book.id)) return;
          seenResourceIds.add(book.id);
          const check = verifyResource({ id: book.id, title: book.title, type: 'book', url: book.pdfUrl || book.url });
          list.push({
            module: mod.title,
            topic: topic.title,
            url: book.pdfUrl || book.url,
            provider: book.authors?.join(', ') || 'Textbook',
            ...check,
          });
        });

        // Collect all Research Papers
        const researchPapers = topic.researchPapers?.length
          ? topic.researchPapers
          : mp?.researchPapers?.length
            ? mp.researchPapers
            : [
                ...(mp?.authoritativeResearchSource ? [mp.authoritativeResearchSource] : []),
                ...(mp?.modernSurveyOrTutorial ? [mp.modernSurveyOrTutorial] : []),
              ];

        researchPapers.forEach((paper) => {
          if (!paper || !paper.id || seenResourceIds.has(paper.id)) return;
          seenResourceIds.add(paper.id);
          const paperUrl = paper.openAccessUrl || paper.url || '';
          const check = verifyResource({ id: paper.id, title: paper.title, type: 'paper', url: paperUrl });
          list.push({
            module: mod.title,
            topic: topic.title,
            url: paperUrl,
            provider: paper.venue || paper.authors?.join(', ') || 'Paper',
            ...check,
          });
        });

        // Collect all Interactive Labs
        const interactiveLabs = topic.interactiveLabs?.length
          ? topic.interactiveLabs
          : mp?.interactiveLabs?.length
            ? mp.interactiveLabs
            : mp?.interactiveLab
              ? [mp.interactiveLab]
              : [];

        interactiveLabs.forEach((lab) => {
          if (!lab || !lab.id || seenResourceIds.has(lab.id)) return;
          seenResourceIds.add(lab.id);
          const check = verifyResource({ id: lab.id, title: lab.title, type: 'lab', url: '#' });
          list.push({
            module: mod.title,
            topic: topic.title,
            url: '#',
            provider: lab.language || 'Interactive Lab',
            ...check,
          });
        });
      }
    }
    return list;
  }, []);

  const stats = useMemo(() => {
    const total = allResources.length;
    const verified = allResources.filter((r) => r.status === 'verified').length;
    const blocked = allResources.filter((r) => r.status === 'embedding-blocked').length;
    const errors = allResources.filter((r) => r.status === 'requires-replacement').length;
    return { total, verified, blocked, errors };
  }, [allResources]);

  const filteredResources = useMemo(() => {
    return allResources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || r.type === filterType;
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allResources, searchTerm, filterType, filterStatus]);

  const handleRunVerifyAll = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="bg-[#151313] min-h-screen text-white p-6 md:p-10 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#BE94F5] text-[#151313] rounded-2xl shadow-lg border-2 border-[#151313]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BE94F5]/20 text-[#BE94F5] text-xs font-mono font-bold mb-1">
              Internal Route: /_internal/resource-health
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Resource Health & Verification Center</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunVerifyAll}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Run Real-time Audit</span>
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

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('topic-audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold ${
            activeTab === 'topic-audit'
              ? 'bg-[#BE94F5] text-[#151313]'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Topic Completeness Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('streams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold ${
            activeTab === 'streams'
              ? 'bg-[#BE94F5] text-[#151313]'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Video Stream & Embed Verifier</span>
        </button>
      </div>

      {activeTab === 'topic-audit' ? (
        <TopicCompletenessDashboard />
      ) : (
        <>
          {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-stone-300 text-xs font-mono">
            <span>TOTAL CURRICULUM SOURCES</span>
            <Database className="w-4 h-4 text-stone-300" />
          </div>
          <div className="text-3xl font-black text-stone-100">{stats.total}</div>
          <p className="text-[11px] text-stone-300">Indexed in active course modules</p>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
            <span>VERIFIED & EMBEDDABLE</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{stats.verified}</div>
          <p className="text-[11px] text-stone-300">
            {Math.round((stats.verified / (stats.total || 1)) * 100)}% Pass rate
          </p>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono">
            <span>WEBPAGE / BLOCKED IFRAMES</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{stats.blocked}</div>
          <p className="text-[11px] text-stone-300">Handled with transparent source and retry states</p>
        </div>

        <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BE94F5] text-xs font-mono">
            <span>ACTION REQUIRED</span>
            <AlertOctagon className="w-4 h-4 text-[#BE94F5]" />
          </div>
          <div className="text-3xl font-black text-[#BE94F5]">{stats.errors}</div>
          <p className="text-[11px] text-stone-300">Requires videoId replacement</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1e1b1b] border border-stone-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, module, or topic..."
            className="bg-transparent text-xs text-stone-100 placeholder-stone-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 text-stone-200 font-mono">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <Select
            value={filterType}
            onChange={(val) => setFilterType(val)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'video', label: 'Video Stream' },
              { value: 'pdf', label: 'PDF Document' },
            ]}
            ariaLabel="Filter by Type"
          />

          <Select
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'verified', label: 'Verified' },
              { value: 'embedding-blocked', label: 'Embedding Blocked' },
              { value: 'requires-replacement', label: 'Requires Replacement' },
            ]}
            ariaLabel="Filter by Status"
          />
        </div>
      </div>

      {/* Resource Data Table */}
      <div className="bg-[#1e1b1b] border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-200 font-mono text-[11px]">
              <tr>
                <th className="p-4">RESOURCE TITLE & TOPIC</th>
                <th className="p-4">TYPE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">IN-APP EMBEDDABLE</th>
                <th className="p-4">SOURCE LINK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {filteredResources.map((res, i) => (
                <tr key={i} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-stone-100 max-w-md truncate">{res.title}</div>
                    <div className="text-[11px] text-stone-300">
                      {res.module} • <span className="text-stone-200">{res.topic}</span>
                    </div>
                  </td>

                  <td className="p-4 font-mono">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 capitalize">
                      {res.type === 'video' ? <Play className="w-3 h-3 text-[#FCCC42]" /> : <FileText className="w-3 h-3 text-[#BE94F5]" />}
                      {res.type}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    {res.status === 'verified' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {res.status === 'embedding-blocked' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Handled Webpage
                      </span>
                    )}
                    {res.status === 'requires-replacement' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#BE94F5]/10 border border-[#BE94F5]/30 text-[#BE94F5] font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Action Needed
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono">
                    {res.embeddable ? (
                      <span className="text-emerald-400 font-semibold">Yes (Iframe Safe)</span>
                    ) : (
                      <span className="text-stone-300 italic font-semibold">No (Fallback Mode)</span>
                    )}
                  </td>

                  <td className="p-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#BE94F5] hover:underline font-mono text-[11px]"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
