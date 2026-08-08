import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, FileText, Code, CheckSquare, Sparkles, ChevronRight } from 'lucide-react';
import { ALL_MODULES, ALL_TOPICS, getAllResearchPapers } from '../../data/curriculumData';
import { GLOSSARY_ITEMS } from '../../data/glossaryData';

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onSelectPaper: (paperId: string) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  onSelectModule,
  onSelectPaper,
}) => {
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  // Capture the trigger element during render, before the search input's autoFocus
  // (which runs during commit, ahead of any useEffect) can steal document.activeElement.
  if (isOpen && !wasOpenRef.current) {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
  }
  wasOpenRef.current = isOpen;

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Restore focus to whatever triggered the search modal once it closes.
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTopics = q
    ? ALL_TOPICS.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.masteryPack.coreConcepts.some(c => c.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const matchingModules = q
    ? ALL_MODULES.filter(
        m => m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const papers = getAllResearchPapers();
  const matchingPapers = q
    ? papers.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some(a => a.toLowerCase().includes(q)) ||
          p.venue.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingGlossary = q
    ? GLOSSARY_ITEMS.filter(
        g => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-3 sm:px-4 bg-[#000000]/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search ComputerSciFy platform"
        className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded overflow-hidden min-w-0 flex flex-col max-h-[85vh] sm:max-h-[80vh] relative text-[#000000] dark:text-[#F6EFEF]"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b-4 border-[#000000] flex items-center gap-2.5 sm:gap-3 bg-[#FEF8F7] dark:bg-[#2B2929]">
          <Search className="w-5 h-5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
          <input
            type="text"
            placeholder="Search topics, modules, research papers, glossary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#000000] dark:text-[#F6EFEF] font-black text-sm sm:text-base focus:outline-none placeholder-[#000000]/50 dark:placeholder-[#F6EFEF]/50 uppercase"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#000000]/10 rounded text-[#000000] dark:text-[#F6EFEF] transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Visible Close Search Button */}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] rounded border-2 border-[#000000] neo-shadow-sm transition-colors shrink-0 flex items-center justify-center font-black text-xs gap-1 min-h-[38px] uppercase"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!q && (
            <div className="text-center py-8 text-[#000000]/70 dark:text-[#F6EFEF]/70 text-sm font-bold">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#000000] dark:text-[#F2C94C]" />
              <p className="font-black uppercase text-base">Search ComputerSciFy Platform</p>
              <p className="text-xs mt-1">
                Type keywords like <span className="font-mono bg-[#F2C94C] text-[#000000] px-1 py-0.5 rounded border border-[#000000]">binary</span>,{' '}
                <span className="font-mono bg-[#F2C94C] text-[#000000] px-1 py-0.5 rounded border border-[#000000]">matrix</span>, or{' '}
                <span className="font-mono bg-[#F2C94C] text-[#000000] px-1 py-0.5 rounded border border-[#000000]">Raft</span>.
              </p>
            </div>
          )}

          {q &&
            matchingTopics.length === 0 &&
            matchingModules.length === 0 &&
            matchingPapers.length === 0 &&
            matchingGlossary.length === 0 && (
              <div className="text-center py-8 text-[#000000]/70 dark:text-[#F6EFEF]/70 text-sm font-bold">
                No matching results found for "{query}".
              </div>
            )}

          {/* Topics */}
          {matchingTopics.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F2C94C] mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Curriculum Topics
              </div>
              <div className="space-y-1.5">
                {matchingTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C] text-[#000000] dark:text-[#F6EFEF] dark:hover:text-[#000000] flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-black text-sm uppercase truncate">
                        {topic.title}
                      </div>
                      <div className="text-xs font-bold truncate text-[#000000]/70 dark:text-[#F6EFEF]/70">{topic.summary}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          {matchingModules.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F2C94C] mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" /> Modules
              </div>
              <div className="space-y-1.5">
                {matchingModules.map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onSelectModule(mod.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C] text-[#000000] dark:text-[#F6EFEF] dark:hover:text-[#000000] flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-black text-sm uppercase truncate">{mod.title}</div>
                      <div className="text-xs font-bold truncate text-[#000000]/70 dark:text-[#F6EFEF]/70">{mod.summary}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Research Papers */}
          {matchingPapers.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F2C94C] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Research Papers
              </div>
              <div className="space-y-1.5">
                {matchingPapers.map(paper => (
                  <button
                    key={paper.id}
                    onClick={() => {
                      onSelectPaper(paper.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#F2C94C] text-[#000000] dark:text-[#F6EFEF] dark:hover:text-[#000000] flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-black text-sm uppercase truncate">{paper.title}</div>
                      <div className="text-xs font-bold truncate text-[#000000]/70 dark:text-[#F6EFEF]/70">
                        {paper.authors.join(', ')} • {paper.year} ({paper.venue})
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glossary */}
          {matchingGlossary.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F2C94C] mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> Glossary Definitions
              </div>
              <div className="space-y-1.5">
                {matchingGlossary.map(item => (
                  <div key={item.id} className="p-2.5 rounded bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000]">
                    <span className="font-black text-sm uppercase mr-2">{item.term}:</span>
                    <span className="text-xs font-bold">{item.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
