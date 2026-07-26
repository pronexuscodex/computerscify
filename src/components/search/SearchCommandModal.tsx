import React, { useState, useEffect } from 'react';
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-3 sm:px-4 bg-[#151313]/70 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl overflow-hidden min-w-0 overflow-x-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] relative"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#151313] flex items-center gap-2.5 sm:gap-3 bg-[#F7F7F5]">
          <Search className="w-5 h-5 text-[#151313]/60 shrink-0" />
          <input
            type="text"
            placeholder="Search topics, modules, research papers, glossary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#151313] font-medium text-sm sm:text-base focus:outline-none placeholder-[#151313]/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#151313]/10 rounded-md text-[#151313]/60 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Visible Close Search Button */}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 hover:bg-[#BE94F5]/30 rounded-xl border border-[#151313]/20 text-[#151313] transition-colors shrink-0 flex items-center justify-center font-bold text-xs gap-1 min-h-[38px]"
          >
            <X className="w-4 h-4 text-[#151313]" />
            <span className="hidden sm:inline text-xs font-semibold">Close</span>
          </button>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!q && (
            <div className="text-center py-8 text-[#151313]/60 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#BE94F5]" />
              <p className="font-semibold text-[#151313]">Search ComputerSciFy Platform</p>
              <p className="text-xs mt-1">
                Type keywords like <span className="font-mono bg-[#BE94F5]/30 px-1 py-0.5 rounded">binary</span>,{' '}
                <span className="font-mono bg-[#FCCC42]/30 px-1 py-0.5 rounded">matrix</span>, or{' '}
                <span className="font-mono bg-[#82E0AA]/30 px-1 py-0.5 rounded">Raft</span>.
              </p>
            </div>
          )}

          {q &&
            matchingTopics.length === 0 &&
            matchingModules.length === 0 &&
            matchingPapers.length === 0 &&
            matchingGlossary.length === 0 && (
              <div className="text-center py-8 text-[#151313]/60 text-sm">
                No matching results found for "{query}".
              </div>
            )}

          {/* Topics */}
          {matchingTopics.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/60 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#BE94F5]" /> Curriculum Topics
              </div>
              <div className="space-y-1.5">
                {matchingTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-[#151313]/10 hover:border-[#151313] hover:bg-[#BE94F5]/20 flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-sm text-[#151313] group-hover:text-[#BE94F5] transition-colors truncate">
                        {topic.title}
                      </div>
                      <div className="text-xs text-[#151313]/70 truncate">{topic.summary}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#151313]/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          {matchingModules.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/60 mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#BE94F5]" /> Modules
              </div>
              <div className="space-y-1.5">
                {matchingModules.map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onSelectModule(mod.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-[#151313]/10 hover:border-[#151313] hover:bg-[#FCCC42]/20 flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-sm text-[#151313] truncate">{mod.title}</div>
                      <div className="text-xs text-[#151313]/70 truncate">{mod.summary}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#151313]/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Research Papers */}
          {matchingPapers.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/60 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FCCC42]" /> Research Papers
              </div>
              <div className="space-y-1.5">
                {matchingPapers.map(paper => (
                  <button
                    key={paper.id}
                    onClick={() => {
                      onSelectPaper(paper.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-[#151313]/10 hover:border-[#151313] hover:bg-[#82E0AA]/20 flex items-center justify-between transition-colors group min-w-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-sm text-[#151313] truncate">{paper.title}</div>
                      <div className="text-xs text-[#151313]/70 truncate">
                        {paper.authors.join(', ')} • {paper.year} ({paper.venue})
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#151313]/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glossary */}
          {matchingGlossary.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#151313]/60 mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#34495E]" /> Glossary Definitions
              </div>
              <div className="space-y-1.5">
                {matchingGlossary.map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#151313]/5 border border-[#151313]/10">
                    <span className="font-bold text-sm text-[#151313] mr-2">{item.term}:</span>
                    <span className="text-xs text-[#151313]/80">{item.definition}</span>
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
