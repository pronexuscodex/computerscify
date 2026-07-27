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
      aria-label="Breadcrumb Navigation"
      className="bg-[#FFFFFF] dark:bg-[#151313] border-b-2 border-[#000000] px-3 sm:px-6 py-2 w-full min-w-0 shadow-sm text-xs font-black uppercase font-mono text-[#000000] dark:text-[#F6EFEF] flex items-center justify-between gap-3 shrink-0 select-none overflow-hidden"
    >
      <div className="flex items-center gap-1.5 flex-nowrap min-w-0 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
        {items.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C] shrink-0 mx-0.5" />
              )}

              {item.isCurrent ? (
                <div className="flex items-center gap-1.5 bg-[#000000] text-[#FFFFFF] dark:bg-[#F2C94C] dark:text-[#000000] px-2.5 py-1 rounded border border-[#000000] neo-shadow-sm shrink-0 min-w-0 max-w-full">
                  {item.icon}
                  <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-[280px]">{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 bg-[#F2C94C] text-[#000000] dark:bg-[#000000] dark:text-[#FFFFFF] text-[10px] rounded font-mono font-black ml-1 border border-[#000000] shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] hover:text-[#000000] dark:hover:text-[#000000] transition-colors border border-transparent hover:border-[#000000] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] min-w-0"
                >
                  {item.icon}
                  <span className="truncate max-w-[90px] sm:max-w-[150px] md:max-w-[220px]">{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 bg-[#DFD9D8] text-[#000000] text-[10px] rounded font-mono font-black ml-0.5 border border-[#000000] shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Program Fast Switcher Tag */}
      <div className="hidden sm:flex items-center gap-1 shrink-0 pl-3 border-l-2 border-[#000000] bg-[#FFFFFF] dark:bg-[#151313] z-10">
        <span className="text-[10px] text-[#000000]/70 dark:text-[#F6EFEF]/70 font-mono font-bold mr-1">TRACK:</span>
        <button
          type="button"
          onClick={() => setActiveProgram('computer-science')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border transition-colors ${
            activeProgram === 'computer-science'
              ? 'bg-[#F2C94C] text-[#000000] border-[#000000] neo-shadow-sm'
              : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] border-stone-400 hover:border-[#000000]'
          }`}
        >
          CS
        </button>
        <button
          type="button"
          onClick={() => setActiveProgram('data-science')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border transition-colors ${
            activeProgram === 'data-science'
              ? 'bg-[#F2C94C] text-[#000000] border-[#000000] neo-shadow-sm'
              : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] border-stone-400 hover:border-[#000000]'
          }`}
        >
          DS
        </button>
      </div>
    </nav>
  );
};
