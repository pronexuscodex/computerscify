import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

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

  const themeClass = variant === 'light' ? 'theme-light' : variant === 'dark' ? 'theme-dark' : '';

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

  const triggerStyles =
    'border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-text)] shadow-[var(--ds-shadow-sm)] hover:border-[var(--ds-primary)]';
  const labelStyles = 'font-semibold text-[var(--ds-text)]';
  const menuStyles =
    'border border-[var(--ds-border)] bg-[var(--ds-surface-elevated)] text-[var(--ds-text)] shadow-[var(--ds-shadow-md)]';

  return (
    <div className={`relative inline-block w-full text-left sm:w-auto ${themeClass} ${className}`}>
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
        className={`flex min-h-11 w-full items-center justify-between gap-2.5 rounded-[var(--ds-radius-md)] px-3.5 py-2 text-sm font-medium transition-[background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] focus-visible:ring-offset-2 ${triggerStyles} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--ds-text-muted)] transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[var(--ds-primary)]' : ''
          }`}
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
            className={`fixed z-[100] max-h-[280px] overflow-y-auto rounded-[var(--ds-radius-md)] py-1.5 focus:outline-none ${themeClass} ${menuStyles}`}
          >
            {options.length === 0 ? (
              <div className="px-3.5 py-2.5 text-xs italic text-[var(--ds-text-muted)]">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                let optionBg = '';
                if (isSelected) {
                  optionBg = 'bg-[var(--ds-primary)] text-[var(--ds-on-primary)] font-semibold';
                } else if (isFocused) {
                  optionBg = 'bg-[var(--ds-surface-muted)] text-[var(--ds-text)]';
                } else {
                  optionBg = 'text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]';
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
                        <span className="mt-0.5 truncate text-[10px] font-normal opacity-80">
                          {option.description}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0" />
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
