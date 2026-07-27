import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  CheckCircle2,
  Filter,
  BookOpen,
  Check
} from 'lucide-react';
import { getAllResearchPapers } from '../../data/curriculumData';
import { ResearchPaper, PaperType, LearnerProgress } from '../../types/curriculum';
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
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1D1B1B] dark:text-[#F6EFEF] w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-[#000000] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#F2C94C]" />
            Authoritative Research Corpus
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight">
            Research Library
          </h1>
          <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold max-w-2xl">
            Seminal papers, landmark historical publications, and modern AI/Systems surveys integrated into the curriculum.
          </p>
        </div>

        {/* Read Stats */}
        <div className="bg-[#F2C94C] text-[#000000] border-2 border-[#000000] neo-shadow-sm rounded p-4 shrink-0 font-mono text-xs font-black uppercase">
          Read: {progress.readPaperIds.length} / {papers.length} Papers
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#000000] dark:text-[#F6EFEF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers by title, author, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded text-xs font-black focus:outline-none focus:ring-2 focus:ring-[#F2C94C] neo-shadow-sm text-[#000000] dark:text-[#F6EFEF]"
          />
        </div>

        <div className="flex items-center gap-2 max-w-full">
          <Filter className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0 self-center" />
          <div className="flex flex-wrap sm:flex-nowrap md:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
            {(['all', 'seminal', 'survey', 'applied', 'historical'] satisfies Array<
              PaperType | 'all'
            >).map((t) => {
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedType(t)}
                  className={`h-9 px-3 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#000000] text-[#FFFFFF] neo-shadow-sm'
                      : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F2C94C]" />}
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
              className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 flex flex-col justify-between space-y-4 min-w-0"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#000000] text-[#FFFFFF] text-[10px] font-mono font-black uppercase border border-[#000000] shrink-0">
                    {paper.paperType}
                  </span>
                  <span className="text-xs font-mono font-black text-[#000000]/70 dark:text-[#F6EFEF]/70 truncate">
                    {paper.year} • {paper.venue}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-[#000000] dark:text-[#F6EFEF] uppercase leading-snug break-words">
                  {paper.title}
                </h3>
                <p className="text-xs font-mono font-bold text-[#000000]/70 dark:text-[#F6EFEF]/70 truncate">
                  {paper.authors.join(', ')}
                </p>

                <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 line-clamp-3 font-medium">
                  {paper.summary}
                </p>

                <div className="p-3 rounded bg-[#DFD9D8] dark:bg-[#2B2929] border-2 border-[#000000] text-xs font-bold text-[#000000] dark:text-[#F6EFEF]">
                  <span className="font-black uppercase mr-1">Why it matters:</span>
                  {paper.whyItMatters}
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#000000] flex flex-wrap items-center justify-between gap-3 min-w-0">
                <button
                  onClick={() => toggleReadStatus(paper.id)}
                  className={`px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all min-h-[38px] ${
                    isRead
                      ? 'bg-[#82E0AA] text-[#000000]'
                      : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isRead ? 'Read' : 'Mark as Read'}
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setReadingModalPaper(paper)}
                    className="px-3.5 py-1.5 rounded bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-[#000000] neo-btn min-h-[38px]"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read In-App
                  </button>

                  <a
                    href={paper.openAccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 min-h-[38px] min-w-[38px] rounded bg-[#000000] text-[#FFFFFF] font-black text-xs hover:bg-[#F2C94C] hover:text-[#000000] transition-colors border-2 border-[#000000] flex items-center justify-center gap-1"
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
          className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl max-h-[92dvh] h-[92dvh] bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded overflow-hidden flex flex-col relative"
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
