import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Flame,
  Menu,
  Play,
  User,
  ChevronDown,
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';
import { getTopicById, ALL_TOPICS } from '../../data/curriculumData';
import { Tooltip } from '../common/Tooltip';

interface TopBarProps {
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  progress: LearnerProgress;
  onResumeTopic: (topicId: string) => void;
  onNavigate?: (view: any) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onToggleMobileMenu,
  progress,
  onResumeTopic,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const lastTopic = progress.lastVisitedTopicId ? getTopicById(progress.lastVisitedTopicId) : null;
  const streakDays = progress.studyStreakDays || 1;
  const completedCount = progress.completedTopicIds?.length || 0;
  const totalTopics = ALL_TOPICS.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  // Close learner menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="h-15 md:h-16 bg-[#F7F7F5] border-b-1.5 border-[#151313] px-2 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none w-full min-w-0 overflow-x-hidden">
      {/* Left Brand Wordmark & Mobile Drawer Trigger */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
        {/* Mobile drawer menu button */}
        <Tooltip content="Open navigation menu" position="bottom">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-1.5 border-[#151313] bg-[#F7F7F5] brand-shadow-sm text-[#151313] hover:bg-[#BE94F5]/20 flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#151313]" />
          </button>
        </Tooltip>

        {/* ComputerSciFy Brand Mark */}
        <button
          type="button"
          onClick={() => onNavigate?.('dashboard')}
          className="flex items-center gap-2 font-display font-black text-[#151313] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BE94F5] rounded-xl p-0.5 min-w-0 shrink-0"
          title="ComputerSciFy Platform Home"
          aria-label="ComputerSciFy Home Dashboard"
        >
          <div className="w-8 h-8 rounded-xl bg-[#BE94F5] border-1.5 border-[#151313] flex items-center justify-center font-mono font-bold text-xs text-[#151313] brand-shadow-sm shrink-0">
            &gt;_
          </div>
          <span className="hidden sm:inline-block tracking-tight text-base sm:text-lg font-black text-[#151313] truncate">
            Computer<span className="text-[#BE94F5]">Sci</span><span className="text-[#FCCC42]">Fy</span>
          </span>
        </button>
      </div>

      {/* Mobile Search Icon Trigger (< 768px) */}
      <div className="md:hidden shrink-0">
        <Tooltip content="Search ComputerSciFy" position="bottom">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search ComputerSciFy"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-1.5 border-[#151313] bg-[#F7F7F5] brand-shadow-sm text-[#151313] hover:bg-[#BE94F5]/20 flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#BE94F5]" aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      {/* Desktop Flexible Global Search Field (>= 768px) */}
      <div className="hidden md:flex flex-1 max-w-xl mx-2 sm:mx-4 justify-center min-w-[8rem]">
        <Tooltip content="Search curriculum" shortcut="⌘K" position="bottom">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search courses, topics, papers..."
            className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl border-1.5 border-[#151313] bg-[#F7F7F5] text-[#151313]/70 hover:bg-[#BE94F5]/10 hover:border-[#151313] transition-all brand-shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Search className="w-4 h-4 text-[#BE94F5] shrink-0" aria-hidden="true" />
              <span className="truncate">Search courses, topics, papers...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#151313]/10 border border-[#151313]/20 rounded text-[#151313] shrink-0 font-normal">
              ⌘K
            </kbd>
          </button>
        </Tooltip>
      </div>

      {/* Right Primary Actions: Resume Learning & Compact Learner Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Resume Learning Primary Action Button */}
        <Tooltip
          content={lastTopic ? `Resume: ${lastTopic.title}` : 'Start learning'}
          position="bottom"
        >
          <button
            type="button"
            onClick={() => onResumeTopic(lastTopic ? lastTopic.id : 'p0-m1-t1')}
            aria-label={lastTopic ? `Resume learning: ${lastTopic.title}` : 'Start learning ComputerSciFy Curriculum'}
            className="h-10 px-3 sm:px-3.5 rounded-xl bg-[#FCCC42] text-[#151313] font-bold text-xs border-1.5 border-[#151313] brand-shadow-sm hover:translate-y-[-1px] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#151313]"
          >
            <Play className="w-3.5 h-3.5 fill-[#151313] text-[#151313] shrink-0" />
            <span className="hidden sm:inline">Resume learning</span>
            <span className="sm:hidden">Resume</span>
          </button>
        </Tooltip>

        {/* Compact Learner Profile Menu */}
        <div className="relative" ref={menuRef}>
          <Tooltip content="Learner profile menu" position="bottom">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label="Learner menu and progress summary"
              className="h-10 px-2.5 sm:px-3 rounded-xl bg-[#BE94F5]/30 border-1.5 border-[#151313] text-[#151313] text-xs font-bold flex items-center gap-2 shrink-0 brand-shadow-sm hover:bg-[#BE94F5]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
            >
              <User className="w-4 h-4 text-[#151313] shrink-0" />
              <span className="hidden lg:inline truncate max-w-[110px]">{progress.displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#151313]/70 shrink-0" />
            </button>
          </Tooltip>

          {/* Accessible Dropdown Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-64 bg-[#F7F7F5] border-1.5 border-[#151313] brand-shadow-lg rounded-2xl p-2.5 z-50 animate-fade-in space-y-1.5 text-xs"
            >
              {/* User Header & Streak Summary */}
              <div className="px-3 py-2 bg-white border border-[#151313]/15 rounded-xl space-y-1.5">
                <div className="font-bold text-[#151313] flex items-center justify-between">
                  <span>{progress.displayName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#82E0AA] text-[#151313]">
                    {percentComplete}%
                  </span>
                </div>

                {/* Streak Badge Summary inside Menu */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#151313]">
                  <Flame className="w-3.5 h-3.5 fill-[#FCCC42] text-[#151313] shrink-0" />
                  <span>{streakDays} Day Study Streak</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#151313]/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#BE94F5] h-full rounded-full" style={{ width: `${percentComplete}%` }} />
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenSearch();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#BE94F5]/20 font-bold flex items-center justify-between transition-colors text-[#151313]"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#BE94F5]" />
                  Search Curriculum
                </span>
                <kbd className="text-[10px] font-mono bg-[#151313]/10 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

