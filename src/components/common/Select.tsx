import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface SelectOptionItem {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOptionItem[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  variant?: 'auto' | 'light' | 'dark';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  className = '',
  ariaLabel,
  variant = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; flipTop: boolean }>({
    top: 0,
    left: 0,
    width: 0,
    flipTop: false,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Safely attempt useTheme if provider exists
  let themeResolved: 'light' | 'dark' = 'light';
  try {
    const themeCtx = useTheme();
    themeResolved = themeCtx.resolvedTheme;
  } catch (e) {
    themeResolved = 'light';
  }

  const isDark = variant === 'dark' || (variant === 'auto' && themeResolved === 'dark');

  const selectedOption = options.find((o) => o.value === value);

  // Calculate position on open or scroll/resize
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(options.length * 48 + 16, 280);
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipTop = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    const menuWidth = Math.min(Math.max(rect.width, 180), window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));

    setCoords({
      top: flipTop ? rect.top - dropdownHeight - 6 : rect.bottom + 6,
      left,
      width: menuWidth,
      flipTop,
    });
  }, [options.length]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      calculatePosition();
      setIsOpen(true);
      const idx = options.findIndex((o) => o.value === value);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    if (triggerRef.current) triggerRef.current.focus();
  };

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollResize = () => {
      calculatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScrollResize, true);
    window.addEventListener('resize', handleScrollResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScrollResize, true);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [isOpen, calculatePosition]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1 < options.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        const opt = options[focusedIndex];
        if (!opt.disabled) handleSelect(opt.value);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const triggerStyles = isDark
    ? 'bg-[#1E1C1C] border-1.5 border-stone-700 text-[#F6EFEF] brand-shadow-sm hover:border-stone-600'
    : 'bg-white border-1.5 border-[#171515] text-[#171515] brand-shadow-sm hover:bg-[#F3ECEC]';

  const labelStyles = isDark
    ? 'text-[#F6EFEF]/80 font-bold'
    : 'text-[#171515]/80 font-bold';

  const menuStyles = isDark
    ? 'bg-[#1E1C1C] text-[#F6EFEF] border-1.5 border-stone-700 shadow-2xl'
    : 'bg-[#FEF8F7] text-[#171515] border-1.5 border-[#171515] brand-shadow-lg';

  return (
    <div className={`relative inline-block text-left w-full sm:w-auto ${className}`}>
      {label && (
        <label className={`block text-[11px] uppercase tracking-wider mb-1 ${labelStyles}`}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        disabled={disabled}
        className={`w-full min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5] ${triggerStyles} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
            isDark ? 'text-[#F6EFEF]/70' : 'text-[#171515]/70'
          } ${isOpen ? 'rotate-180 text-[#BE94F5]' : ''}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel || label || 'Options'}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            className={`fixed z-[100] rounded-xl py-1.5 overflow-y-auto max-h-[280px] animate-fade-in focus:outline-none ${menuStyles}`}
          >
            {options.length === 0 ? (
              <div className={`px-3.5 py-2.5 text-xs italic ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                let optionBg = '';
                if (isSelected) {
                  optionBg = isDark
                    ? 'bg-[#BE94F5]/20 text-[#D2B3FF] font-bold'
                    : 'bg-[#BE94F5]/30 text-[#171515] font-bold';
                } else if (isFocused) {
                  optionBg = isDark
                    ? 'bg-[#F6EFEF]/10 text-[#F6EFEF]'
                    : 'bg-[#171515]/10 text-[#171515]';
                } else {
                  optionBg = isDark
                    ? 'text-[#F6EFEF]/80 hover:text-[#F6EFEF]'
                    : 'text-[#171515] hover:bg-[#171515]/5';
                }

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`min-h-[40px] px-3.5 py-2 flex items-center justify-between gap-3 text-xs font-medium cursor-pointer transition-colors ${
                      option.disabled ? 'opacity-40 cursor-not-allowed' : ''
                    } ${optionBg}`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="truncate">{option.label}</span>
                      </div>
                      {option.description && (
                        <span className={`text-[10px] font-normal truncate mt-0.5 ${isDark ? 'text-stone-400' : 'text-[#171515]/60'}`}>
                          {option.description}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#D2B3FF]' : 'text-[#171515]'}`} />
                    )}
                  </div>
                );
              })
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
