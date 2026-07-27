import React from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

export interface ThemeSwitcherProps {
  variant?: 'compact' | 'segment' | 'card';
  className?: string;
  showLabels?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'segment',
  className = '',
  showLabels = true,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch theme (Currently ${resolvedTheme} mode)`}
        title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
        className={`h-10 w-10 rounded border-2 border-[#000000] bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] hover:text-[#000000] flex items-center justify-center neo-shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] shrink-0 ${className}`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#F2C94C] transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#000000] transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  if (variant === 'card') {
    const themeOptions: { mode: Theme; label: string; description: string; icon: React.ReactNode }[] = [
      {
        mode: 'light',
        label: 'Light Mode',
        description: 'Clean off-white canvas with high-contrast typography.',
        icon: <Sun className="w-5 h-5 text-[#000000]" />,
      },
      {
        mode: 'dark',
        label: 'Dark Mode',
        description: 'Eye-safe high contrast twilight canvas for long study sessions.',
        icon: <Moon className="w-5 h-5 text-[#F2C94C]" />,
      },
      {
        mode: 'system',
        label: 'System Preference',
        description: 'Automatically match your system OS color scheme.',
        icon: <Monitor className="w-5 h-5 text-[#000000] dark:text-[#F6EFEF]" />,
      },
    ];

    return (
      <div className={`space-y-3 w-full text-left ${className}`} role="radiogroup" aria-label="Theme Selection">
        <label className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF] block">
          Visual Theme Mode (Updates data-theme)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(opt.mode)}
                className={`p-4 rounded border-4 border-[#000000] text-left transition-all duration-200 flex flex-col justify-between space-y-3 min-h-[110px] ${
                  isSelected
                    ? 'bg-[#F2C94C] text-[#000000] neo-shadow'
                    : 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20 neo-shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded border-2 border-[#000000] bg-[#FFFFFF] dark:bg-[#2B2929] shrink-0">
                      {opt.icon}
                    </div>
                    <span className="font-display font-black text-xs uppercase">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#000000] text-[#FFFFFF] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-bold leading-tight opacity-90">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default 'segment' mode button row
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#FEF8F7] dark:bg-[#2B2929] p-1.5 rounded border-2 border-[#000000] neo-shadow-sm ${className}`}
      role="radiogroup"
      aria-label="Theme Mode Selection"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase transition-all duration-200 flex items-center gap-1.5 min-h-[38px] ${
          theme === 'light'
            ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
            : 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-[#000000]" />
        {showLabels && <span>Light</span>}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase transition-all duration-200 flex items-center gap-1.5 min-h-[38px] ${
          theme === 'dark'
            ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
            : 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C]" />
        {showLabels && <span>Dark</span>}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === 'system'}
        onClick={() => setTheme('system')}
        className={`px-3 py-1.5 rounded border-2 border-[#000000] text-xs font-black uppercase transition-all duration-200 flex items-center gap-1.5 min-h-[38px] ${
          theme === 'system'
            ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
            : 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
        }`}
      >
        <Monitor className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF]" />
        {showLabels && <span>Auto</span>}
      </button>
    </div>
  );
};
