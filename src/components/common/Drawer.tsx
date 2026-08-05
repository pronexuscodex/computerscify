import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className = '',
  ariaLabel,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => drawerRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (typeof window === 'undefined') return null;

  // Slide motion variants depending on drawer position
  const motionVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      panelClass: 'top-0 right-0 h-full w-full max-w-md sm:max-w-lg border-l-2',
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      panelClass: 'top-0 left-0 h-full w-full max-w-md sm:max-w-lg border-r-2',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      panelClass: 'bottom-0 left-0 right-0 max-h-[85vh] w-full rounded-t-2xl border-t-2',
    },
  }[position];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-0 bg-[var(--ds-overlay)] backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || (typeof title === 'string' ? title : 'Drawer')}
            tabIndex={-1}
            initial={prefersReducedMotion ? false : motionVariants.initial}
            animate={motionVariants.animate}
            exit={prefersReducedMotion ? { opacity: 0 } : motionVariants.exit}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-10 flex flex-col overflow-hidden border-[var(--ds-border)] bg-[var(--ds-surface-elevated)] text-[var(--ds-text)] shadow-[var(--ds-shadow-md)] focus:outline-none ${motionVariants.panelClass} ${className}`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--ds-border)] bg-[var(--ds-surface)] px-5 py-4">
                <div className="flex flex-col min-w-0 pr-2">
                  {title && (
                    <h2 className="ds-text-safe font-display text-base font-bold text-[var(--ds-text)] sm:text-lg">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="ds-text-safe mt-1 text-xs leading-relaxed text-[var(--ds-text-muted)]">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-muted)] transition-colors hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Drawer Body */}
            <div className="p-5 overflow-y-auto flex-1 text-xs sm:text-sm font-sans space-y-4">
              {children}
            </div>

            {/* Sticky Footer */}
            {footer && (
              <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[var(--ds-border)] bg-[var(--ds-surface)] px-5 py-3.5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
