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
import { saveLearnerProgress } from '../../services/storage';

interface TopBarProps {
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  progress: LearnerProgress;
  onUpdateProgress?: (newProgress: LearnerProgress) => void;
  onResumeTopic: (topicId: string) => void;
  onNavigate?: (view: any) => void;
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
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    saveLearnerProgress(updated);
    setIsEditingName(false);
  };

  const handleToggleFontSize = (size: 'normal' | 'large') => {
    const updated = { ...progress, fontSize: size };
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    saveLearnerProgress(updated);
  };

  return (
    <header className="h-16 bg-[#FEF8F7] dark:bg-[#1E1C1C] border-b-4 border-[#000000] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 select-none w-full min-w-0 overflow-visible">
      {/* Left Brand Wordmark & Mobile Drawer Trigger */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
        {/* Mobile drawer menu button */}
        <Tooltip content="Open navigation menu" position="bottom">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden h-10 w-10 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#1E1C1C] neo-shadow-sm text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] flex items-center justify-center shrink-0 transition-all focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#000000] dark:text-[#F6EFEF]" />
          </button>
        </Tooltip>

        {/* ComputerSciFy Brand Mark */}
        <button
          type="button"
          onClick={() => onNavigate?.('dashboard')}
          className="flex items-center gap-2 font-display font-black text-[#000000] dark:text-[#F6EFEF] hover:opacity-90 transition-opacity focus:outline-none rounded p-0.5 min-w-0 shrink-0"
          title="ComputerSciFy Platform Home"
          aria-label="ComputerSciFy Home Dashboard"
        >
          <div className="w-9 h-9 rounded bg-[#F2C94C] border-2 border-[#000000] flex items-center justify-center font-mono font-black text-sm text-[#000000] neo-shadow-sm shrink-0">
            &gt;_
          </div>
          <span className="hidden sm:inline-block tracking-tight text-lg font-black text-[#000000] dark:text-[#F6EFEF] truncate uppercase">
            Computer<span className="text-[#626200] dark:text-[#F2C94C]">Sci</span><span className="text-[#F2C94C]">Fy</span>
          </span>
        </button>

        {/* Top Bar Program Track Mode Switcher (Desktop / Tablet >= 768px) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#DFD9D8] dark:bg-[#111010] p-1 rounded border-2 border-[#000000] neo-shadow-sm ml-2">
          <Tooltip content="Switch to Computer Science B.S. Degree Track" position="bottom">
            <button
              type="button"
              onClick={() => setActiveProgram('computer-science')}
              className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all focus:outline-none ${
                activeProgram === 'computer-science'
                  ? 'bg-[#F2C94C] text-[#000000] border border-[#000000] font-black neo-shadow-sm'
                  : 'text-[#000000]/70 dark:text-[#F6EFEF]/70 hover:text-[#000000] dark:hover:text-[#F6EFEF]'
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
                  ? 'bg-[#F2C94C] text-[#000000] border border-[#000000] font-black neo-shadow-sm'
                  : 'text-[#000000]/70 dark:text-[#F6EFEF]/70 hover:text-[#000000] dark:hover:text-[#F6EFEF]'
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
            className="w-full flex items-center justify-between gap-2 h-10 px-3.5 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#000000]/80 dark:text-[#F6EFEF]/80 hover:bg-[#F2C94C]/20 transition-all neo-shadow-sm text-xs font-black uppercase tracking-wider focus:outline-none"
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Search className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0" aria-hidden="true" />
              <span className="truncate">Search curriculum...</span>
            </div>
            <kbd className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#DFD9D8] dark:bg-stone-800 border border-[#000000] rounded text-[#000000] dark:text-[#F6EFEF] shrink-0 font-bold">
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
              className="h-10 w-10 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#1E1C1C] neo-shadow-sm text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] flex items-center justify-center shrink-0 transition-all focus:outline-none"
            >
              <Search className="w-5 h-5 text-[#000000] dark:text-[#F6EFEF]" aria-hidden="true" />
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
            className="h-10 px-3.5 rounded bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs uppercase tracking-wider neo-btn flex items-center gap-1.5 whitespace-nowrap shrink-0 focus:outline-none"
          >
            <Play className="w-4 h-4 fill-[#000000] text-[#000000] shrink-0" />
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
              className="h-10 px-3 rounded bg-[#DFD9D8] dark:bg-[#2B2929] border-2 border-[#000000] text-[#000000] dark:text-[#F6EFEF] text-xs font-black uppercase flex items-center gap-2 shrink-0 neo-shadow-sm hover:bg-[#F2C94C] hover:text-[#000000] transition-all focus:outline-none"
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
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FEF8F7] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded-lg p-4 z-50 animate-fade-in space-y-4 text-xs text-[#000000] dark:text-[#F6EFEF]"
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
                    className={`p-2 rounded border-2 border-[#000000] text-left transition-all flex items-center gap-2 ${
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
                    className={`p-2 rounded border-2 border-[#000000] text-left transition-all flex items-center gap-2 ${
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
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-[11px]">Visual Mode</span>
                  <div className="flex items-center gap-1 bg-[#FEF8F7] dark:bg-[#1E1C1C] p-1 rounded border border-[#000000]">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        theme === 'light' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        theme === 'dark' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        theme === 'system' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#000000]/10 pt-2">
                  <span className="font-black uppercase text-[11px] flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" />
                    Font Size
                  </span>
                  <div className="flex items-center gap-1 bg-[#FEF8F7] dark:bg-[#1E1C1C] p-1 rounded border border-[#000000]">
                    <button
                      type="button"
                      onClick={() => handleToggleFontSize('normal')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        progress.fontSize === 'normal' ? 'bg-[#F2C94C] text-[#000000] border border-[#000000]' : 'text-[#000000]/70 dark:text-[#F6EFEF]/70'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFontSize('large')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
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
                  className="p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
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
                  className="p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
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
                  className="p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
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
                  className="p-2 rounded bg-[#FEF8F7] dark:bg-[#1E1C1C] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-[11px] uppercase flex items-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
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
                className="w-full p-2.5 rounded bg-[#DFD9D8] dark:bg-[#2B2929] border-2 border-[#000000] hover:bg-[#F2C94C] hover:text-[#000000] font-black text-xs uppercase flex items-center justify-center gap-2 transition-colors text-[#000000] dark:text-[#F6EFEF]"
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

