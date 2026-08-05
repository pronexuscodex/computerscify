import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  shadow?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      shadow = true,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Size styling
    const sizeStyles = {
      sm: 'min-h-9 px-3 py-1.5 text-xs gap-1.5',
      md: 'min-h-11 px-4 py-2 text-sm gap-2',
      lg: 'min-h-12 px-5 py-2.5 text-base gap-2.5',
    }[size];

    // Variants use semantic tokens so theme changes preserve contrast.
    const variantStyles = {
      primary:
        'border-transparent bg-[var(--ds-primary)] text-[var(--ds-on-primary)] hover:bg-[var(--ds-primary-hover)]',
      secondary:
        'border-[var(--ds-research)]/30 bg-[var(--ds-research-soft)] text-[var(--ds-research)] hover:border-[var(--ds-research)]',
      tertiary:
        'border-[var(--ds-border)] bg-[var(--ds-surface-muted)] text-[var(--ds-text)] hover:border-[var(--ds-border-strong)]',
      outline:
        'border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
      ghost:
        'border-transparent bg-transparent text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
      danger:
        'border-[var(--ds-danger)]/40 bg-[var(--ds-danger-soft)] text-[var(--ds-danger)] hover:border-[var(--ds-danger)]',
    }[variant];

    const shadowStyles =
      shadow && variant !== 'ghost'
        ? 'shadow-[var(--ds-shadow-sm)] hover:-translate-y-px hover:shadow-[var(--ds-shadow-md)] active:translate-y-0 active:shadow-[var(--ds-shadow-sm)]'
        : '';
    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex min-w-0 items-center justify-center rounded-[var(--ds-radius-md)] border font-display font-semibold tracking-tight transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-background)] select-none ${sizeStyles} ${variantStyles} ${shadowStyles} ${disabledStyles} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
