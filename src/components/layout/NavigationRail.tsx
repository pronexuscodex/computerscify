import React from 'react';
import {
  LayoutDashboard,
  Map,
  Compass,
  BookOpenCheck,
  Terminal,
  Award,
  FolderGit2,
  BarChart3,
  Settings,
  Flame,
  ShieldCheck,
  Newspaper,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';
import { ALL_TOPICS } from '../../data/curriculumData';
import { NavigationSidebarMode } from '../../services/uiPreferences';
import { Tooltip } from '../common/Tooltip';

export type NavView =
  | 'dashboard'
  | 'roadmap'
  | 'academies'
  | 'research'
  | 'lab'
  | 'spaced-review'
  | 'mistake-journal'
  | 'portfolio'
  | 'capstones'
  | 'progress'
  | 'settings'
  | 'topic-player'
  | 'module-overview'
  | 'resource-health'
  | 'audit'
  | 'news';

interface NavigationRailProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  progress: LearnerProgress;
  mode?: NavigationSidebarMode;
  onToggleMode?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentView,
  onNavigate,
  progress,
  mode = 'expanded',
  onToggleMode,
}) => {
  const totalTopics = ALL_TOPICS.length;
  const completedCount = progress.completedTopicIds.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  const isCollapsed = mode === 'collapsed' || mode === 'compact' || mode === 'hidden';

  // Grouped to match the mobile bottom nav's Learn/Explore/Library/Account model, so a learner
  // builds one mental map of the app regardless of screen size. "Resource Health" and "Audit"
  // are internal verification dashboards, not learner-facing tools — deliberately left out of
  // primary navigation (still reachable directly, and linked from Settings for anyone who needs them).
  const navGroups = [
    {
      label: 'Learn',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'roadmap', label: 'Curriculum Roadmap', icon: Map },
        { id: 'academies', label: 'Academies', icon: Compass },
      ],
    },
    {
      label: 'Practice',
      items: [
        { id: 'lab', label: 'Practice Arena', icon: Terminal },
        { id: 'spaced-review', label: 'Spaced Review', icon: Flame },
        { id: 'mistake-journal', label: 'Mistake Journal', icon: ShieldCheck },
      ],
    },
    {
      label: 'Build',
      items: [
        { id: 'portfolio', label: 'Project Portfolio', icon: FolderGit2 },
        { id: 'capstones', label: 'Capstones', icon: Award },
      ],
    },
    {
      label: 'Explore',
      items: [
        { id: 'research', label: 'Research Library', icon: BookOpenCheck },
        { id: 'news', label: 'Field News', icon: Newspaper },
      ],
    },
    {
      label: 'You',
      items: [
        { id: 'progress', label: 'Progress & Notes', icon: BarChart3 },
        { id: 'settings', label: 'Preferences', icon: Settings },
      ],
    },
  ] as const;

  return (
    <aside
      id="computerscify-main-navigation"
      aria-label="ComputerSciFy Main Navigation"
      aria-expanded={!isCollapsed}
      className={`${
        isCollapsed ? 'w-[80px]' : 'w-[256px]'
      } bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#1D1B1B] dark:text-[#F6EFEF] flex flex-col h-full shrink-0 border-r-4 border-[#000000] select-none transition-all duration-200 overflow-hidden min-w-0 z-40`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b-4 border-[#000000] bg-[#DFD9D8] dark:bg-[#111010] flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#000000] rounded p-0.5"
          title="ComputerSciFy Home Dashboard"
          aria-label="ComputerSciFy Home Dashboard"
        >
          <img
            src="/computerscify-icon-192.png"
            alt=""
            className="w-9 h-9 rounded border-2 border-[#000000] neo-shadow-sm shrink-0 object-cover"
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-display font-black text-lg tracking-tight text-[#000000] dark:text-[#F6EFEF] flex items-center gap-0.5 uppercase">
                Computer<span className="text-[#626200] dark:text-[#F2C94C]">Sci</span><span className="text-[#F2C94C]">Fy</span>
              </h1>
              <p className="text-[10px] text-[#000000]/70 dark:text-[#F6EFEF]/70 uppercase tracking-widest font-black truncate">
                First Principles CS
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links, grouped by task so a 12-view app doesn't read as one flat list */}
      <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto min-h-0 overflow-x-hidden">
        {navGroups.map((group, groupIdx) => (
          <div
            key={group.label}
            className={groupIdx > 0 ? 'pt-3 mt-2 border-t-2 border-[#000000]/10 dark:border-white/10' : ''}
          >
            {!isCollapsed && (
              <p className="px-3.5 pb-1 text-[10px] font-black uppercase tracking-widest text-[#1D1B1B]/45 dark:text-[#F6EFEF]/40">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const navButton = (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id as NavView)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-2.5'
                    } rounded font-black text-xs uppercase tracking-wider transition-all text-left group relative ${
                      isActive
                        ? 'bg-[#F2C94C] text-[#000000] neo-border neo-shadow'
                        : 'text-[#1D1B1B] dark:text-[#F6EFEF] border-2 border-transparent hover:border-[#000000] hover:bg-[#F9F2F1] dark:hover:bg-[#2B2929]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#000000]' : 'text-[#1D1B1B] dark:text-[#F6EFEF]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.id} content={item.label} position="right">
                      {navButton}
                    </Tooltip>
                  );
                }

                return navButton;
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Learner Progress Footer */}
      {!isCollapsed ? (
        <div className="p-3.5 border-t-4 border-[#000000] bg-[#F9F2F1] dark:bg-[#111010]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-black uppercase">
            <span className="text-[#1D1B1B]/80 dark:text-[#F6EFEF]/80">Curriculum Progress</span>
            <span className="font-mono font-black text-[#000000] dark:text-[#F2C94C]">{percentComplete}%</span>
          </div>
          <div className="w-full bg-[#DFD9D8] dark:bg-stone-800 h-3 border-2 border-[#000000] rounded-none overflow-hidden mb-3">
            <div
              className="bg-[#F2C94C] h-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t-2 border-[#000000]/20">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#000000] dark:text-[#F2C94C]">
              <Flame className="w-4 h-4 fill-[#F2C94C] text-[#000000]" />
              <span>{progress.studyStreakDays} Day Streak</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#000000]/70 dark:text-[#F6EFEF]/70 truncate max-w-[80px]">
              {progress.displayName}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t-4 border-[#000000] flex flex-col items-center gap-2">
          <Tooltip
            content={`${progress.studyStreakDays} Day Streak (${percentComplete}% Complete)`}
            position="right"
          >
            <div
              aria-label={`${progress.studyStreakDays} Day Streak`}
              className="p-2 rounded bg-[#F2C94C] border-2 border-[#000000] text-[#000000] flex items-center justify-center cursor-default neo-shadow-sm"
            >
              <Flame className="w-4 h-4 fill-[#000000]" />
            </div>
          </Tooltip>
        </div>
      )}

      {/* Resize Control */}
      {onToggleMode && (
        <div className="p-2 border-t-4 border-[#000000] bg-[#FEF8F7] dark:bg-[#1E1C1C]">
          <Tooltip
            content={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            shortcut="Ctrl+B"
            position="right"
          >
            <button
              type="button"
              onClick={onToggleMode}
              aria-controls="computerscify-main-navigation"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              className={`w-full py-2 px-3 rounded bg-[#DFD9D8] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] hover:text-[#000000] transition-all font-black text-xs uppercase flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } border-2 border-[#000000] neo-shadow-sm focus:outline-none focus:ring-2 focus:ring-[#000000]`}
            >
              {isCollapsed ? (
                <ChevronsRight className="w-5 h-5 shrink-0" />
              ) : (
                <>
                  <span className="text-xs font-black truncate">Collapse</span>
                  <ChevronsLeft className="w-5 h-5 shrink-0" />
                </>
              )}
            </button>
          </Tooltip>
        </div>
      )}
    </aside>
  );
};
