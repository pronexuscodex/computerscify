import React, { useRef } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'cards' | 'segmented';
  className?: string;
  tabListClassName?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
  tabListClassName = '',
  ariaLabel = 'Navigation tabs',
  children,
}) => {
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    let nextTab: TabItem | undefined;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextTab = enabledTabs[(currentIndex + 1) % enabledTabs.length];
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextTab = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length];
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextTab = enabledTabs[0];
    } else if (e.key === 'End') {
      e.preventDefault();
      nextTab = enabledTabs[enabledTabs.length - 1];
    }

    if (nextTab) {
      onChange(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  // Base list layout
  const listContainerClass = {
    pills: 'flex items-center gap-1.5 p-1 bg-[#F3ECEC] dark:bg-[#242222] border-1.5 border-[#171515] dark:border-stone-700 rounded-xl overflow-x-auto no-scrollbar',
    segmented: 'grid auto-cols-fr grid-flow-col gap-1 p-1 bg-[#F3ECEC] dark:bg-[#242222] border-1.5 border-[#171515] dark:border-stone-700 rounded-xl',
    underline: 'flex items-center gap-4 sm:gap-6 border-b-1.5 border-[#171515]/20 dark:border-stone-700 overflow-x-auto no-scrollbar',
    cards: 'flex items-center gap-2 overflow-x-auto no-scrollbar py-1',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`${listContainerClass} ${tabListClassName}`}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          // Variant button styling
          let buttonStyles = '';
          if (variant === 'pills' || variant === 'segmented') {
            buttonStyles = isActive
              ? 'bg-[#F2C94C] dark:bg-[#584400] text-[#171515] dark:text-[#FFE08B] border-1.5 border-[#171515] dark:border-[#FFE08B] brand-shadow-sm font-bold'
              : 'bg-transparent text-[#171515]/70 dark:text-[#F6EFEF]/70 hover:text-[#171515] dark:hover:text-[#F6EFEF] border-1.5 border-transparent font-medium';
          } else if (variant === 'underline') {
            buttonStyles = isActive
              ? 'border-b-2 border-[#171515] dark:border-[#F2C94C] text-[#171515] dark:text-[#F2C94C] font-bold pb-2.5 -mb-[1.5px]'
              : 'border-b-2 border-transparent text-[#171515]/60 dark:text-[#F6EFEF]/60 hover:text-[#171515] dark:hover:text-[#F6EFEF] font-medium pb-2.5 -mb-[1.5px]';
          } else if (variant === 'cards') {
            buttonStyles = isActive
              ? 'bg-[#D2B3FF] dark:bg-[#54397B] text-[#171515] dark:text-[#EDDCFF] border-1.5 border-[#171515] dark:border-[#EDDCFF] brand-shadow-sm font-bold'
              : 'bg-white dark:bg-[#1E1C1C] text-[#171515]/70 dark:text-[#F6EFEF]/70 border-1.5 border-[#171515]/20 dark:border-stone-700 hover:border-[#171515] font-medium';
          }

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`min-h-[36px] px-3 py-1.5 text-xs rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#BE94F5] ${
                tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              } ${buttonStyles}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full border border-[#171515]/20 ${
                  isActive ? 'bg-[#171515] text-white' : 'bg-[#171515]/10 text-[#171515] dark:text-[#F6EFEF]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  );
};
