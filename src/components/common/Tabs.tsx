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
    pills: 'flex items-center gap-1.5 overflow-x-auto rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-1 no-scrollbar',
    segmented: 'grid auto-cols-fr grid-flow-col gap-1 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-1',
    underline: 'flex items-center gap-4 overflow-x-auto border-b border-[var(--ds-border)] no-scrollbar sm:gap-6',
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
              ? 'border border-[var(--ds-primary)] bg-[var(--ds-surface)] text-[var(--ds-primary)] shadow-[var(--ds-shadow-sm)] font-semibold'
              : 'border border-transparent bg-transparent text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface)] hover:text-[var(--ds-text)] font-medium';
          } else if (variant === 'underline') {
            buttonStyles = isActive
              ? 'border-b-2 border-[var(--ds-primary)] text-[var(--ds-primary)] font-semibold pb-2.5 -mb-px'
              : 'border-b-2 border-transparent text-[var(--ds-text-muted)] hover:text-[var(--ds-text)] font-medium pb-2.5 -mb-px';
          } else if (variant === 'cards') {
            buttonStyles = isActive
              ? 'border border-[var(--ds-research)] bg-[var(--ds-research-soft)] text-[var(--ds-research)] shadow-[var(--ds-shadow-sm)] font-semibold'
              : 'border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-muted)] hover:border-[var(--ds-border-strong)] hover:text-[var(--ds-text)] font-medium';
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
              className={`flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] focus-visible:ring-offset-2 ${
                tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              } ${buttonStyles}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`rounded-full border border-[var(--ds-border)] px-1.5 py-0.5 font-mono text-[10px] ${
                  isActive ? 'bg-[var(--ds-primary)] text-[var(--ds-on-primary)]' : 'bg-[var(--ds-surface-muted)] text-[var(--ds-text)]'
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
