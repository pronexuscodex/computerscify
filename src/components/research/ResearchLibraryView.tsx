import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  X,
  Check
} from 'lucide-react';
import { getAllResearchPapers } from '../../data/curriculumData';
import { ResearchPaper, PaperType, LearnerProgress } from '../../types/curriculum';
import { saveLearnerProgress } from '../../services/storage';
import { InAppPdfReader } from '../reader/InAppPdfReader';

interface ResearchLibraryViewProps {
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onSelectPaper: (paperId: string) => void;
}

export const ResearchLibraryView: React.FC<ResearchLibraryViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectPaper,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PaperType | 'all'>('all');
  const [readingModalPaper, setReadingModalPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    if (!readingModalPaper) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReadingModalPaper(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readingModalPaper]);

  const papers = getAllResearchPapers();

  const filteredPapers = papers.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.some((a) => a.toLowerCase().includes(q)) ||
      p.venue.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);

    const matchesType = selectedType === 'all' || p.paperType === selectedType;

    return matchesSearch && matchesType;
  });

  const toggleReadStatus = (paperId: string) => {
    const readSet = new Set(progress.readPaperIds);
    if (readSet.has(paperId)) readSet.delete(paperId);
    else readSet.add(paperId);
    const updated = { ...progress, readPaperIds: Array.from(readSet) };
    onUpdateProgress(updated);
    saveLearnerProgress(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#151313] w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#151313] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono mb-2">
            <FileText className="w-3.5 h-3.5 text-[#82E0AA]" />
            Authoritative Research Corpus
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#151313] tracking-tight">
            Research Library
          </h1>
          <p className="text-sm text-[#151313]/70 font-medium mt-1">
            Seminal papers, landmark historical publications, and modern AI/Systems surveys integrated into the curriculum.
          </p>
        </div>

        {/* Read Stats */}
        <div className="bg-[#BE94F5] brand-border brand-shadow-sm rounded-2xl p-4 shrink-0 font-mono text-xs font-bold text-[#151313]">
          Read: {progress.readPaperIds.length} / {papers.length} Papers
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#151313]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers by title, author, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border border-[#151313] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#BE94F5] brand-shadow-sm text-[#151313]"
          />
        </div>

        <div className="flex items-center gap-2 max-w-full">
          <Filter className="w-4 h-4 text-[#151313]/70 shrink-0 self-center" />
          <div className="flex flex-wrap sm:flex-nowrap md:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
            {['all', 'seminal', 'survey', 'applied', 'historical'].map((t) => {
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedType(t as any)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold uppercase font-mono transition-all shrink-0 flex items-center gap-1.5 brand-border ${
                    isSelected
                      ? 'bg-[#151313] text-[#F7F7F5] brand-shadow-sm'
                      : 'bg-[#F7F7F5] text-[#151313]/80 hover:bg-[#BE94F5]/30'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#82E0AA]" />}
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Research Paper Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map((paper) => {
          const isRead = progress.readPaperIds.includes(paper.id);

          return (
            <div
              key={paper.id}
              className="bg-[#F7F7F5] brand-border brand-shadow-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 min-w-0"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#151313] text-[#F7F7F5] text-[10px] font-mono font-bold uppercase shrink-0">
                    {paper.paperType}
                  </span>
                  <span className="text-xs font-mono text-[#151313]/70 font-bold truncate">
                    {paper.year} • {paper.venue}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#151313] mb-1 leading-snug break-words">
                  {paper.title}
                </h3>
                <p className="text-xs font-mono text-[#151313]/70 mb-3 truncate">
                  {paper.authors.join(', ')}
                </p>

                <p className="text-xs text-[#151313]/80 line-clamp-3 mb-3 font-medium">
                  {paper.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#FCCC42]/20 border border-[#151313] text-xs font-medium text-[#151313]">
                  <span className="font-bold mr-1">Why it matters:</span>
                  {paper.whyItMatters}
                </div>
              </div>

              <div className="pt-4 border-t border-[#151313]/10 flex flex-wrap items-center justify-between gap-3 min-w-0">
                <button
                  onClick={() => toggleReadStatus(paper.id)}
                  className={`px-3 py-1.5 rounded-xl border border-[#151313] text-xs font-bold flex items-center gap-1.5 transition-all min-h-[38px] ${
                    isRead
                      ? 'bg-[#82E0AA] text-[#151313]'
                      : 'bg-[#F7F7F5] text-[#151313]/70 hover:bg-[#BE94F5]/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isRead ? 'Read' : 'Mark as Read'}
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setReadingModalPaper(paper)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#BE94F5] text-[#151313] font-bold text-xs hover:bg-[#FCCC42] transition-colors flex items-center gap-1.5 border border-[#151313] brand-shadow-sm min-h-[38px]"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read In-App
                  </button>

                  <a
                    href={paper.openAccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 min-h-[38px] min-w-[38px] rounded-xl bg-[#151313] text-[#F7F7F5] font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-1"
                    title="Open original source PDF in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Modal */}
      {readingModalPaper && (
        <div
          onClick={() => setReadingModalPaper(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl max-h-[92dvh] h-[92dvh] bg-[#151313] border border-stone-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
          >
            <InAppPdfReader
              document={readingModalPaper}
              isCompleted={progress.readPaperIds.includes(readingModalPaper.id)}
              onMarkCompleted={() => toggleReadStatus(readingModalPaper.id)}
              onClose={() => setReadingModalPaper(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
