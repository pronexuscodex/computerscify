import React from 'react';

export type CardVariant = 'default' | 'gold' | 'lavender' | 'mint' | 'coral' | 'outline' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
    // Accent border/background styling using neo-brutalist token palette
    const variantStyles = {
      default: 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF]',
      gold: 'bg-[#F2C94C] text-[#000000] dark:bg-[#F2C94C] dark:text-[#000000]',
      lavender: 'bg-[#D2B3FF] text-[#000000] dark:bg-[#54397B] dark:text-[#F6EFEF]',
      mint: 'bg-[#82E0AA] text-[#000000] dark:bg-[#205537] dark:text-[#F6EFEF]',
      coral: 'bg-[#BE94F5] text-[#000000] dark:bg-[#5A3587] dark:text-[#F6EFEF]',
      outline: 'bg-transparent text-[#000000] dark:text-[#F6EFEF]',
      flat: 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]',
    }[variant];

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    }[padding];

    const isClickable = Boolean(onClick);
    const hoverStyles = hoverable || isClickable
      ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer'
      : '';

    const baseCardStyles =
      'border-4 border-[#000000] neo-shadow rounded overflow-hidden transition-all duration-200 min-w-0';

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`${baseCardStyles} ${variantStyles} ${hoverStyles} ${paddingStyles} ${className}`}
        {...props}
      >
        {/* Card Header Section if title, header, or action provided */}
        {(title || header || action) && (
          <div className="flex items-start justify-between gap-3 mb-3 border-b-2 border-[#000000] pb-3 min-w-0">
            {header ? (
              header
            ) : (
              <div className="flex flex-col min-w-0">
                {title && (
                  <h3 className="font-display font-black text-base sm:text-lg uppercase tracking-tight break-words">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs font-bold opacity-80 mt-0.5 leading-snug break-words">
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
          <div className="mt-4 pt-3 border-t-2 border-[#000000] text-xs font-bold flex items-center justify-between gap-2 min-w-0">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
