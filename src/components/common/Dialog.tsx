import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className = '',
  ariaLabel,
}) => {
  // Listen for Escape key
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

  const sizeWidths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
  }[size];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171515]/60 dark:bg-black/70 backdrop-blur-md z-0"
            aria-hidden="true"
          />

          {/* Modal Content Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || (typeof title === 'string' ? title : 'Dialog')}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full ${sizeWidths} bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#171515] dark:text-[#F6EFEF] border-2 border-[#171515] dark:border-stone-700 brand-shadow-lg rounded-2xl flex flex-col overflow-hidden max-h-[90vh] my-auto focus:outline-none ${className}`}
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
                    aria-label="Close dialog"
                    className="h-8 w-8 rounded-xl border-1.5 border-[#171515] dark:border-stone-700 bg-[#FEF8F7] dark:bg-[#1E1C1C] text-[#171515] dark:text-[#F6EFEF] hover:bg-[#D2B3FF]/30 flex items-center justify-center shrink-0 brand-shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Body */}
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
