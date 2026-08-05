import React from 'react';

export type CardVariant = 'default' | 'gold' | 'lavender' | 'mint' | 'coral' | 'outline' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  header?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      header,
      title,
      subtitle,
      action,
      footer,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    // Accent variants use soft semantic surfaces rather than high-contrast decoration.
    const variantStyles = {
      default: 'bg-[var(--ds-surface)] text-[var(--ds-text)]',
      gold: 'bg-[var(--ds-learning-soft)] text-[var(--ds-text)]',
      lavender: 'bg-[var(--ds-research-soft)] text-[var(--ds-text)]',
      mint: 'bg-[var(--ds-success-soft)] text-[var(--ds-text)]',
      coral: 'bg-[var(--ds-ai-soft)] text-[var(--ds-text)]',
      outline: 'bg-transparent text-[var(--ds-text)]',
      flat: 'bg-[var(--ds-surface-muted)] text-[var(--ds-text)]',
    }[variant];

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    }[padding];

    const isClickable = Boolean(onClick);
    const hoverStyles = hoverable || isClickable
      ? 'hover:-translate-y-px hover:shadow-[var(--ds-shadow-md)] active:translate-y-0 cursor-pointer'
      : '';

    const baseCardStyles =
      'min-w-0 overflow-hidden rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] shadow-[var(--ds-shadow-sm)] transition-[border-color,box-shadow,transform] duration-200';

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`${baseCardStyles} ${variantStyles} ${hoverStyles} ${paddingStyles} ${className}`}
        {...props}
      >
        {/* Card Header Section if title, header, or action provided */}
        {(title || header || action) && (
          <div className="mb-3 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--ds-border)] pb-3">
            {header ? (
              header
            ) : (
              <div className="flex flex-col min-w-0">
                {title && (
                  <h3 className="font-display text-base font-bold leading-snug tracking-tight break-words sm:text-lg">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ds-text-muted)] break-words">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        {/* Card Main Body Content */}
        {children && <div className="w-full text-xs sm:text-sm font-sans min-w-0">{children}</div>}

        {/* Card Footer Section */}
        {footer && (
          <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-[var(--ds-border)] pt-3 text-xs font-semibold">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
