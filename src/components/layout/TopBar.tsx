import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Flame,
  Menu,
  Play,
  User,
  ChevronDown,
  Sun,
  Moon,
  GraduationCap,
  Database,
  Type,
  Map,
  Award,
  ShieldCheck,
  Settings,
  Check,
  Edit2,
  Save,
  BarChart3
} from 'lucide-react';
import { LearnerProgress, ProgramType } from '../../types/curriculum';
import { getTopicById, ALL_TOPICS } from '../../data/curriculumData';
import { Tooltip } from '../common/Tooltip';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';
import { NavView } from './NavigationRail';

interface TopBarProps {
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onResumeTopic: (topicId: string) => void;
  onNavigate: (view: NavView) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onToggleMobileMenu,
  progress,
  onUpdateProgress,
  onResumeTopic,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState(progress.displayName);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { activeProgram, setActiveProgram } = useNavigation();

  const lastTopic = progress.lastVisitedTopicId ? getTopicById(progress.lastVisitedTopicId) : null;
  const streakDays = progress.studyStreakDays || 1;
  const completedCount = progress.completedTopicIds?.length || 0;
  const totalTopics = ALL_TOPICS.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  // Sync edit name state when progress changes
  useEffect(() => {
    setEditingNameValue(progress.displayName);
  }, [progress.displayName]);

  // Close learner menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsEditingName(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        setIsEditingName(false);
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

  const handleSaveDisplayName = () => {
    const trimmed = editingNameValue.trim() || 'Learner';
    const updated = { ...progress, displayName: trimmed };
    onUpdateProgress(updated);
    setIsEditingName(false);
  };

  const handleToggleFontSize = (size: 'normal' | 'large') => {
    const updated = { ...progress, fontSize: size };
    onUpdateProgress(updated);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full min-w-0 shrink-0 items-center justify-between overflow-visible border-b border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 select-none sm:px-6">
      {/* Left Brand Wordmark & Mobile Drawer Trigger */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
        {/* Mobile drawer menu button */}
        <Tooltip content="Open navigation menu" position="bottom">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </Tooltip>

        {/* ComputerSciFy Brand Mark */}
        <button
          type="button"
          onClick={() => onNavigate?.('dashboard')}
          className="flex min-w-0 shrink-0 items-center gap-2 rounded p-0.5 font-display font-bold text-[var(--ds-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] md:hidden"
          title="ComputerSciFy Platform Home"
          aria-label="ComputerSciFy Home Dashboard"
        >
          <img
            src="/computerscify-icon-192.png"
            alt=""
            className="h-9 w-9 shrink-0 rounded-[var(--ds-radius-sm)] object-cover shadow-[var(--ds-shadow-sm)] ring-1 ring-[var(--ds-border)]"
          />
          <span className="hidden truncate text-lg font-bold tracking-tight text-[var(--ds-text)] sm:inline-block">
            Computer<span className="text-[var(--ds-primary)]">Sci</span><span className="text-[var(--ds-learning)]">Fy</span>
          </span>
        </button>

        {/* Top Bar Program Track Mode Switcher (Desktop / Tablet >= 768px) */}
        <div className="ml-2 hidden items-center gap-1 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-1 lg:flex">
          <Tooltip content="Switch to Computer Science B.S. Degree Track" position="bottom">
            <button
              type="button"
              onClick={() => setActiveProgram('computer-science')}
              className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all focus:outline-none ${
                activeProgram === 'computer-science'
                  ? 'border border-[var(--ds-primary)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)]'
                  : 'text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface)] hover:text-[var(--ds-text)]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>B.S. CS</span>
            </button>
          </Tooltip>
          <Tooltip content="Switch to Data Science B.S. Degree Track" position="bottom">
            <button
              type="button"
              onClick={() => setActiveProgram('data-science')}
              className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all focus:outline-none ${
                activeProgram === 'data-science'
                  ? 'border border-[var(--ds-primary)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)]'
                  : 'text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface)] hover:text-[var(--ds-text)]'
              }`}
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>B.S. DS</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Desktop Global Search Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-3 justify-center min-w-[8rem]">
        <Tooltip content="Search curriculum" shortcut="⌘K" position="bottom">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search courses, topics, papers..."
            className="flex h-10 w-full items-center justify-between gap-2 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3.5 text-xs font-medium text-[var(--ds-text-muted)] shadow-[var(--ds-shadow-sm)] transition-colors hover:border-[var(--ds-primary)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]"
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Search curriculum...</span>
            </div>
            <kbd className="hidden shrink-0 rounded border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--ds-text-muted)] xl:inline-block">
              ⌘K
            </kbd>
          </button>
        </Tooltip>
      </div>

      {/* Right Actions: Resume Button & Enhanced Top Learner Tab */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Mobile Search Icon Trigger */}
        <div className="md:hidden shrink-0">
          <Tooltip content="Search ComputerSciFy" position="bottom">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search ComputerSciFy"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        {/* Primary Call-to-Action: Resume Module */}
        <Tooltip
          content={lastTopic ? `Resume: ${lastTopic.title}` : 'Start learning'}
          position="bottom"
        >
          <button
            type="button"
            onClick={() => onResumeTopic(lastTopic ? lastTopic.id : 'p0-m1-t1')}
            aria-label={lastTopic ? `Resume learning: ${lastTopic.title}` : 'Start learning ComputerSciFy Curriculum'}
            className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--ds-radius-md)] border border-transparent bg-[var(--ds-primary)] px-3.5 text-xs font-semibold text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)] transition-colors hover:bg-[var(--ds-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] focus-visible:ring-offset-2"
          >
            <Play className="h-4 w-4 shrink-0 fill-current" />
            <span className="hidden sm:inline">Resume</span>
          </button>
        </Tooltip>

        {/* Enhanced Learner Tab on Top */}
        <div className="relative" ref={menuRef}>
          <Tooltip content="Learner Profile & Track Settings" position="bottom" disabled={isMenuOpen}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label="Learner menu and progress summary"
              className="flex h-10 shrink-0 items-center gap-2 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] px-3 text-xs font-semibold text-[var(--ds-text)] transition-colors hover:border-[var(--ds-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]"
            >
              <div className="w-6 h-6 rounded-full bg-[#F2C94C] border border-[#000000] text-[#000000] flex items-center justify-center font-black text-[11px] shrink-0">
                {progress.displayName ? progress.displayName.charAt(0).toUpperCase() : 'L'}
              </div>
              <span className="hidden sm:inline truncate max-w-[100px]">{progress.displayName}</span>
              <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#000000] text-[#F2C94C] text-[10px] font-mono font-black">
                <Flame className="w-3 h-3 fill-[#F2C94C]" />
                <span>{streakDays}d</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#000000]/70 dark:text-[#F6EFEF]/70 shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </Tooltip>

          {/* Comprehensive Learner Center Popover */}
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              aria-label="Learner settings"
              className="fixed inset-x-2 top-[4.5rem] bottom-[5.5rem] z-50 w-auto space-y-3 overflow-y-auto overscroll-contain rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface-elevated)] p-3 text-xs text-[var(--ds-text)] shadow-[var(--ds-shadow-md)] sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:bottom-auto sm:mt-2 sm:max-h-[calc(100dvh-5.5rem)] sm:w-96 sm:space-y-4 sm:p-4"
            >
              {/* Learner Identity & Streak Banner */}
              <div className="p-3.5 bg-[#FFFFFF] dark:bg-[#242222] border-2 border-[#000000] neo-shadow-sm rounded-md space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F2C94C] border-2 border-[#000000] text-[#000000] flex items-center justify-center font-display font-black text-base shrink-0 neo-shadow-sm">
                      {progress.displayName ? progress.displayName.charAt(0).toUpperCase() : 'L'}
                    </div>
                    <div className="min-w-0 flex-1">
                      {isEditingName ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveDisplayName()}
                            className="w-full px-2 py-1 bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] border-2 border-[#000000] rounded text-xs font-black focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveDisplayName}
                            className="p-1 rounded bg-[#F2C94C] text-[#000000] border border-[#000000] hover:bg-[#ffe08b]"
                            title="Save display name"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] truncate uppercase">
                            {progress.displayName}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(true)}
                            className="p-0.5 text-[#000000]/60 dark:text-[#F6EFEF]/60 hover:text-[#000000] dark:hover:text-[#F2C94C]"
                            title="Edit Display Name"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold uppercase tracking-wider">
                        Level 2 First-Principles Scholar
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded bg-[#F2C94C] text-[#000000] border border-[#000000] shrink-0 neo-shadow-sm">
                    {percentComplete}% Complete
                  </span>
                </div>

                {/* Study Streak & Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#000000]/20">
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border border-[#000000]">
                    <Flame className="w-4 h-4 fill-[#F2C94C] text-[#000000] shrink-0" />
                    <div>
                      <div className="font-mono font-black text-xs text-[#000000] dark:text-[#F2C94C]">{streakDays} Days</div>
                      <div className="text-[9px] uppercase font-bold text-[#000000]/60 dark:text-[#F6EFEF]/60">Study Streak</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border border-[#000000]">
                    <Check className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" />
                    <div>
                      <div className="font-mono font-black text-xs text-[#000000] dark:text-[#F2C94C]">{completedCount}/{totalTopics}</div>
                      <div className="text-[9px] uppercase font-bold text-[#000000]/60 dark:text-[#F6EFEF]/60">Topics Mastered</div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#DFD9D8] dark:bg-stone-700 h-2.5 border border-[#000000] rounded-none overflow-hidden">
                  <div className="bg-[#F2C94C] h-full transition-all duration-300" style={{ width: `${percentComplete}%` }} />
                </div>
              </div>

              {/* Active Degree Program Track Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#000000]/80 dark:text-[#F6EFEF]/80 block">
                  Active Degree Program Track
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProgram('computer-science');
                    }}
                    aria-pressed={activeProgram === 'computer-science'}
                    className={`min-h-14 p-2 rounded border-2 border-[#000000] text-left transition-all flex items-center gap-2 ${
                      activeProgram === 'computer-science'
                        ? 'bg-[#F2C94C] text-[#000000] font-black neo-shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#242222] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-black text-xs uppercase leading-tight">B.S. CS</div>
                      <div className="text-[9px] opacity-80">Computer Science</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveProgram('data-science');
                    }}
                    aria-pressed={activeProgram === 'data-science'}
                    className={`min-h-14 p-2 rounded border-2 border-[#000000] text-left transition-all flex items-center gap-2 ${
                      activeProgram === 'data-science'
                        ? 'bg-[#F2C94C] text-[#000000] font-black neo-shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#242222] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                    }`}
                  >
                    <Database className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-black text-xs uppercase leading-tight">B.S. DS</div>
                      <div className="text-[9px] opacity-80">Data Science</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Theme & Reading Preferences */}
              <div className="p-3 bg-[#FFFFFF] dark:bg-[#242222] border-2 border-[#000000] rounded-md space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black uppercase text-[11px]">Visual Mode</span>
                  <div className="flex items-center gap-1 bg-[#FEF8F7] dark:bg-[#1E1C1C] p-1 rounded border border-[#000000]">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      aria-pressed={theme === 'light'}
                      className={`min-h-9 px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                        theme === 'light' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      aria-pressed={theme === 'dark'}
                      className={`min-h-9 px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                        theme === 'dark' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      aria-pressed={theme === 'system'}
                      className={`min-h-9 px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                        theme === 'system' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#000000]/10 pt-2">
                  <span className="font-black uppercase text-[11px] flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" />
                    Font Size
                  </span>
                  <div className="flex items-center gap-1 bg-[#FEF8F7] dark:bg-[#1E1C1C] p-1 rounded border border-[#000000]">
                    <button
                      type="button"
                      onClick={() => handleToggleFontSize('normal')}
                      aria-pressed={progress.fontSize === 'normal'}
                      className={`min-h-9 px-3 py-1 rounded text-[10px] font-black uppercase ${
                        progress.fontSize === 'normal' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFontSize('large')}
                      aria-pressed={progress.fontSize === 'large'}
                      className={`min-h-9 px-3 py-1 rounded text-[10px] font-black uppercase ${
                        progress.fontSize === 'large' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Learner Hub Links */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.('roadmap');
                    setIsMenuOpen(false);
                  }}
                  className="min-h-11 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
                >
                  <Map className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />
                  <span>Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.('spaced-review');
                    setIsMenuOpen(false);
                  }}
                  className="min-h-11 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
                >
                  <Flame className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />
                  <span>Spaced Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.('mistake-journal');
                    setIsMenuOpen(false);
                  }}
                  className="min-h-11 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />
                  <span>Mistakes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.('portfolio');
                    setIsMenuOpen(false);
                  }}
                  className="min-h-11 p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
                >
                  <Award className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />
                  <span>Portfolio</span>
                </button>
              </div>

              {/* Preferences Footer Link */}
              <button
                type="button"
                onClick={() => {
                  onNavigate?.('settings');
                  setIsMenuOpen(false);
                }}
                className="min-h-11 w-full p-2.5 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-xs uppercase flex items-center justify-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
              >
                <Settings className="w-4 h-4 text-[#000000] dark:text-[#F6EFEF]" />
                <span>All Preferences & Data Backup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
