import React, { useState } from 'react';
import { Minimize2, Sun, Moon, Type, Bookmark, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface FocusModeShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExitFocusMode: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onToggleComplete?: () => void;
  isCompleted?: boolean;
}

export const FocusModeShell: React.FC<FocusModeShellProps> = ({
  title,
  subtitle,
  children,
  onExitFocusMode,
  onPrev,
  onNext,
  onToggleComplete,
  isCompleted = false,
}) => {
  const [theme, setTheme] = useState<'editorial-dark' | 'warm-light'>('editorial-dark');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-normal';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-colors duration-200 ${
        theme === 'editorial-dark' ? 'bg-[#121111] text-stone-100' : 'bg-[#FAF8F5] text-stone-900'
      }`}
    >
      {/* Floating Focus Mode Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-3.5 flex items-center justify-between transition-colors ${
          theme === 'editorial-dark'
            ? 'bg-[#181616]/90 border-stone-800 text-stone-200'
            : 'bg-white/90 border-stone-200 text-stone-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExitFocusMode}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'editorial-dark'
                ? 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300'
                : 'bg-stone-100 border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
            title="Exit Focus Mode (ESC)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">{title}</h2>
            {subtitle && <p className="text-xs text-stone-500 truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div
            className={`flex items-center gap-1 border px-2 py-1 rounded-lg text-xs font-mono ${
              theme === 'editorial-dark' ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-stone-400" />
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'large' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-400'}`}
            >
              A+
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme((t) => (t === 'editorial-dark' ? 'warm-light' : 'editorial-dark'))}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'editorial-dark'
                ? 'bg-stone-900 border-stone-800 text-amber-400'
                : 'bg-stone-100 border-stone-200 text-stone-700'
            }`}
            title="Toggle Reading Theme"
          >
            {theme === 'editorial-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Complete Button */}
          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-[#BE94F5] border-[#BE94F5] text-[#151313] hover:bg-[#FCCC42]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Focus Content Container */}
      <main className={`max-w-5xl mx-auto px-4 py-8 md:px-8 min-w-0 ${getFontSizeClass()}`}>{children}</main>

      {/* Focus Footer Navigation */}
      <footer
        className={`sticky bottom-0 z-40 border-t backdrop-blur-md px-6 py-3 flex items-center justify-between transition-colors ${
          theme === 'editorial-dark'
            ? 'bg-[#181616]/90 border-stone-800 text-stone-300'
            : 'bg-white/90 border-stone-200 text-stone-700'
        }`}
      >
        {onPrev ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 text-xs font-medium hover:text-[#BE94F5] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Item</span>
          </button>
        ) : <div />}

        <div className="text-xs font-mono text-stone-500">Focus Mode Active</div>

        {onNext ? (
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 text-xs font-medium text-[#BE94F5] hover:text-[#FCCC42] transition-colors"
          >
            <span>Next Item</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </footer>
    </div>
  );
};
