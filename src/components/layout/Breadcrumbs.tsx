import React from 'react';
import {
  GraduationCap,
  ChevronRight,
  Home,
  BookOpen,
  FileText,
  Code2,
  Sparkles,
  Award,
  BarChart3,
  Settings,
  Brain,
  FileWarning,
  FolderGit2,
  Layers3,
  Newspaper,
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { ProgramType } from '../../types/curriculum';

export const Breadcrumbs: React.FC = () => {
  const {
    activeProgram,
    currentView,
    currentCourse,
    currentTopic,
    navigateToView,
    selectModule,
    setActiveProgram,
  } = useNavigation();

  const programLabel = activeProgram === 'computer-science' ? 'B.S. Computer Science' : 'B.S. Data Science';
  const programBadge = activeProgram === 'computer-science' ? 'CS' : 'DS';

  // Build items array
  const items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    isCurrent?: boolean;
    badge?: string;
  }> = [
    {
      label: 'Curriculum',
      icon: <Home className="w-3.5 h-3.5" />,
      onClick: () => navigateToView('dashboard'),
    },
  ];

  switch (currentView) {
    case 'dashboard':
      items.push({
        label: 'Dashboard Overview',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />,
        isCurrent: true,
      });
      break;

    case 'roadmap':
      items.push({
        label: 'Degree Roadmaps',
        onClick: () => navigateToView('roadmap'),
      });
      items.push({
        label: programLabel,
        badge: programBadge,
        isCurrent: true,
      });
      break;

    case 'academies':
      items.push({
        label: 'Academies',
        icon: <Layers3 className="h-3.5 w-3.5" />,
        isCurrent: true,
      });
      break;

    case 'module-overview':
      items.push({
        label: programLabel,
        badge: programBadge,
        onClick: () => navigateToView('roadmap'),
      });
      if (currentCourse) {
        items.push({
          label: `Year ${currentCourse.year} • Sem ${currentCourse.semester}`,
          onClick: () => navigateToView('roadmap'),
        });
        items.push({
          label: `${currentCourse.code}: ${currentCourse.title}`,
          icon: <BookOpen className="w-3.5 h-3.5" />,
          isCurrent: true,
        });
      }
      break;

    case 'topic-player':
      items.push({
        label: programLabel,
        badge: programBadge,
        onClick: () => navigateToView('roadmap'),
      });
      if (currentCourse) {
        items.push({
          label: `${currentCourse.code}: ${currentCourse.title}`,
          icon: <BookOpen className="w-3.5 h-3.5" />,
          onClick: () => selectModule(currentCourse.id),
        });
      }
      if (currentTopic) {
        items.push({
          label: currentTopic.title,
          icon: <Sparkles className="w-3.5 h-3.5" />,
          isCurrent: true,
        });
      }
      break;

    case 'research':
      items.push({
        label: 'Academic Library',
        onClick: () => navigateToView('research'),
      });
      items.push({
        label: 'Research Papers & Texts',
        icon: <FileText className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'news':
      items.push({
        label: 'Explore',
        onClick: () => navigateToView('news'),
      });
      items.push({
        label: 'Field News',
        icon: <Newspaper className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'lab':
      items.push({
        label: 'Practice & Labs',
        onClick: () => navigateToView('lab'),
      });
      items.push({
        label: 'Interactive Coding Arena',
        icon: <Code2 className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'spaced-review':
      items.push({
        label: 'Cognitive Recall',
        onClick: () => navigateToView('spaced-review'),
      });
      items.push({
        label: 'Spaced Review Queue',
        icon: <Brain className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'mistake-journal':
      items.push({
        label: 'Diagnostics',
        onClick: () => navigateToView('mistake-journal'),
      });
      items.push({
        label: 'Mistake Journal & Audits',
        icon: <FileWarning className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'portfolio':
      items.push({
        label: 'Learner Showcase',
        onClick: () => navigateToView('portfolio'),
      });
      items.push({
        label: 'Project Portfolio',
        icon: <FolderGit2 className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'capstones':
      items.push({
        label: 'Milestones',
        onClick: () => navigateToView('capstones'),
      });
      items.push({
        label: 'Capstone Projects',
        icon: <Award className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'progress':
      items.push({
        label: 'Analytics',
        onClick: () => navigateToView('progress'),
      });
      items.push({
        label: 'Mastery & Progress',
        icon: <BarChart3 className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    case 'settings':
      items.push({
        label: 'System',
        onClick: () => navigateToView('settings'),
      });
      items.push({
        label: 'Learner Preferences',
        icon: <Settings className="w-3.5 h-3.5" />,
        isCurrent: true,
      });
      break;

    default:
      break;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex w-full min-w-0 shrink-0 items-center gap-3 overflow-hidden border-b border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 py-2 text-sm text-[var(--ds-text)] select-none sm:px-6"
    >
      <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap py-0.5">
        {items.map((item, idx) => {
          return (
            <li key={`${item.label}-${idx}`} className={`flex min-w-0 items-center gap-1 ${item.isCurrent ? 'flex-1' : ''}`}>
              {idx > 0 && (
                <ChevronRight aria-hidden="true" className="mx-1 h-3.5 w-3.5 shrink-0 text-[var(--ds-text-muted)]" />
              )}

              {item.isCurrent ? (
                <div
                  aria-current="page"
                  title={item.label}
                  className="flex min-w-0 flex-1 items-center gap-1.5 px-1 py-1 font-semibold text-[var(--ds-text)]"
                >
                  {item.icon}
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 shrink-0 rounded border border-[#000000]/30 bg-[#F2C94C] px-1.5 py-0.5 font-mono text-[10px] font-black text-[#000000]">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  title={item.label}
                  className="flex min-w-0 shrink items-center gap-1.5 rounded px-1.5 py-1 font-medium text-[var(--ds-text-muted)] transition-colors hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]"
                >
                  {item.icon}
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 shrink-0 rounded border border-[#000000]/25 bg-[#DFD9D8] px-1.5 py-0.5 font-mono text-[10px] font-black text-[#000000]">
                      {item.badge}
                    </span>
                  )}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* Program Fast Switcher Tag */}
      <div className="z-10 hidden shrink-0 items-center gap-1 border-l border-[var(--ds-border)] bg-[var(--ds-surface)] pl-3 sm:flex">
        <span className="mr-1 font-mono text-[10px] font-semibold text-[var(--ds-text-muted)]">TRACK:</span>
        <button
          type="button"
          onClick={() => setActiveProgram('computer-science')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border transition-colors ${
            activeProgram === 'computer-science'
              ? 'border-[var(--ds-primary)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)]'
              : 'border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-muted)] hover:border-[var(--ds-primary)]'
          }`}
        >
          CS
        </button>
        <button
          type="button"
          onClick={() => setActiveProgram('data-science')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border transition-colors ${
            activeProgram === 'data-science'
              ? 'border-[var(--ds-primary)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)]'
              : 'border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-muted)] hover:border-[var(--ds-primary)]'
          }`}
        >
          DS
        </button>
      </div>
    </nav>
  );
};
