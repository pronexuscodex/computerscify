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
      id: 'academies',
      label: 'Explore',
      icon: Compass,
      views: ['academies', 'lab', 'research', 'news'],
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
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 items-stretch border-t border-[var(--ds-border)] bg-[var(--ds-surface)] px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgb(11_16_32_/_8%)] select-none md:hidden"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.views.includes(currentView);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id as NavView)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-14 min-w-0 flex flex-col items-center justify-center py-1 px-1 rounded text-xs font-black transition-all ${
              isActive
                ? 'bg-[var(--ds-primary)] text-[var(--ds-on-primary)] shadow-[var(--ds-shadow-sm)] font-semibold'
                : 'text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]'
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
