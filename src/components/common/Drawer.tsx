import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
            className="fixed inset-0 bg-[#171515]/60 dark:bg-black/70 backdrop-blur-md z-0"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || (typeof title === 'string' ? title : 'Drawer')}
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            exit={motionVariants.exit}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`fixed z-10 bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#171515] dark:text-[#F6EFEF] border-[#171515] dark:border-stone-700 brand-shadow-lg flex flex-col overflow-hidden focus:outline-none ${motionVariants.panelClass} ${className}`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-1.5 border-[#171515] dark:border-stone-700 bg-white dark:bg-[#242222] shrink-0">
                <div className="flex flex-col min-w-0 pr-2">
                  {title && (
                    <h2 className="font-display font-bold text-base sm:text-lg text-[#171515] dark:text-[#F6EFEF] truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-[#171515]/70 dark:text-[#F6EFEF]/70 mt-0.5">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="h-8 w-8 rounded-xl border-1.5 border-[#171515] dark:border-stone-700 bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#171515] dark:text-[#F6EFEF] hover:bg-[#D2B3FF]/30 flex items-center justify-center shrink-0 brand-shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
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
              <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t-1.5 border-[#171515] dark:border-stone-700 bg-white dark:bg-[#242222] shrink-0">
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
