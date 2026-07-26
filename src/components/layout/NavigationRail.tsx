import React from 'react';
import {
  LayoutDashboard,
  Map,
  BookOpenCheck,
  Terminal,
  Award,
  BarChart3,
  Settings,
  Flame,
  ShieldCheck,
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
  | 'audit';

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Curriculum Roadmap', icon: Map },
    { id: 'research', label: 'Research Library', icon: BookOpenCheck },
    { id: 'lab', label: 'Practice Arena', icon: Terminal },
    { id: 'spaced-review', label: 'Spaced Review', icon: Flame },
    { id: 'mistake-journal', label: 'Mistake Journal', icon: ShieldCheck },
    { id: 'portfolio', label: 'Project Portfolio', icon: Award },
    { id: 'capstones', label: 'Capstones', icon: Award },
    { id: 'progress', label: 'Progress & Notes', icon: BarChart3 },
    { id: 'resource-health', label: 'Resource Health', icon: ShieldCheck },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ] as const;

  return (
    <aside
      id="computerscify-main-navigation"
      aria-label="ComputerSciFy Main Navigation"
      aria-expanded={!isCollapsed}
      className={`${
        isCollapsed ? 'w-[4.5rem]' : 'w-[17rem]'
      } bg-[#151313] text-[#F7F7F5] flex flex-col h-full shrink-0 border-r border-[#151313] select-none transition-all duration-200 overflow-hidden min-w-0`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b border-[#F7F7F5]/10 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#BE94F5] rounded-xl p-0.5"
          title="ComputerSciFy Home Dashboard"
          aria-label="ComputerSciFy Home Dashboard"
        >
          <div
            className="w-8 h-8 rounded-lg bg-[#BE94F5] border-1.5 border-[#151313] flex items-center justify-center font-mono font-bold text-sm text-[#151313] brand-shadow-sm shrink-0"
          >
            &gt;_
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-display font-bold text-lg tracking-tight text-[#F7F7F5] flex items-center gap-0.5">
                Computer<span className="text-[#BE94F5]">Sci</span><span className="text-[#FCCC42]">Fy</span>
              </h1>
              <p className="text-[10px] text-[#F7F7F5]/60 uppercase tracking-wider font-semibold truncate">
                First Principles Computing
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-1.5 overflow-y-auto min-h-0 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const navButton = (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavView)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
              } rounded-xl font-medium text-sm transition-all text-left group relative ${
                isActive
                  ? 'bg-[#BE94F5] text-[#151313] font-bold brand-border brand-shadow-sm'
                  : 'text-[#F7F7F5]/80 hover:bg-[#F7F7F5]/10 hover:text-[#F7F7F5]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#151313]' : 'text-[#F7F7F5]/70'}`} />
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
      </nav>

      {/* Learner Progress Footer */}
      {!isCollapsed ? (
        <div className="p-4 border-t border-[#F7F7F5]/10 bg-[#151313]/50">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#F7F7F5]/70 font-medium">Curriculum Progress</span>
            <span className="font-mono font-bold text-[#FCCC42]">{percentComplete}%</span>
          </div>
          <div className="w-full bg-[#F7F7F5]/20 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#82E0AA] h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F7F7F5]/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCCC42]">
              <Flame className="w-4 h-4 fill-[#FCCC42]" />
              <span>{progress.studyStreakDays} Day Streak</span>
            </div>
            <span className="text-[11px] font-mono text-[#F7F7F5]/60 truncate max-w-[80px]">
              {progress.displayName}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2.5 border-t border-[#F7F7F5]/10 flex flex-col items-center gap-2">
          <Tooltip
            content={`${progress.studyStreakDays} Day Streak (${percentComplete}% Complete)`}
            position="right"
          >
            <div
              aria-label={`${progress.studyStreakDays} Day Streak`}
              className="p-2 rounded-xl bg-[#FCCC42]/20 border border-[#FCCC42]/40 text-[#FCCC42] flex items-center justify-center cursor-default"
            >
              <Flame className="w-4 h-4 fill-[#FCCC42]" />
            </div>
          </Tooltip>
        </div>
      )}

      {/* Integrated Double-Chevron Sidebar Resize Control */}
      {onToggleMode && (
        <div className="p-2 border-t border-[#F7F7F5]/10 bg-[#151313]">
          <Tooltip
            content={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            shortcut="Ctrl+B"
            position="right"
          >
            <button
              type="button"
              onClick={onToggleMode}
              aria-controls="computerfy-main-navigation"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#F7F7F5]/10 text-[#F7F7F5] hover:bg-[#BE94F5] hover:text-[#151313] transition-all font-bold text-xs flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } brand-border focus:outline-none focus:ring-2 focus:ring-[#BE94F5]`}
            >
              {isCollapsed ? (
                <ChevronsRight className="w-5 h-5 shrink-0" />
              ) : (
                <>
                  <span className="text-xs font-bold truncate">Collapse sidebar</span>
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

