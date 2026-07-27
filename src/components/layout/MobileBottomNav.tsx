import React from 'react';
import { BookOpen, Compass, Bookmark, User } from 'lucide-react';
import { NavView } from './NavigationRail';

interface MobileBottomNavProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Learn',
      icon: BookOpen,
      views: ['dashboard', 'roadmap', 'module-overview', 'topic-player'],
    },
    {
      id: 'lab',
      label: 'Explore',
      icon: Compass,
      views: ['lab', 'research'],
    },
    {
      id: 'portfolio',
      label: 'Library',
      icon: Bookmark,
      views: ['portfolio', 'capstones', 'spaced-review', 'mistake-journal'],
    },
    {
      id: 'progress',
      label: 'Account',
      icon: User,
      views: ['progress', 'settings'],
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FEF8F7] dark:bg-[#1E1C1C] border-t-4 border-[#000000] px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.views.includes(currentView);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id as NavView)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded text-xs font-black transition-all ${
              isActive
                ? 'bg-[#F2C94C] text-[#000000] neo-border neo-shadow-sm font-extrabold'
                : 'text-[#1D1B1B]/70 dark:text-[#F6EFEF]/70 hover:text-[#000000] dark:hover:text-[#F6EFEF]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
