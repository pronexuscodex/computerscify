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
      sm: 'min-h-[36px] px-3 py-1.5 text-xs font-black tracking-wide rounded border-2 border-[#000000] gap-1.5',
      md: 'min-h-[44px] px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider rounded border-2 border-[#000000] gap-2',
      lg: 'min-h-[50px] px-6 py-3 text-sm font-black uppercase tracking-wider rounded border-4 border-[#000000] gap-2.5',
    }[size];

    // Variant styling using defined neo-brutalist token system & colors
    const variantStyles = {
      primary:
        'bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] dark:bg-[#F2C94C] dark:hover:bg-[#ffe08b] dark:text-[#000000]',
      secondary:
        'bg-[#D2B3FF] hover:bg-[#e2cdff] text-[#000000] dark:bg-[#54397B] dark:hover:bg-[#684998] dark:text-[#F6EFEF]',
      tertiary:
        'bg-[#C1D0D6] hover:bg-[#d3e0e5] text-[#000000] dark:bg-[#3B494E] dark:hover:bg-[#4d5e64] dark:text-[#F6EFEF]',
      outline:
        'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20',
      ghost:
        'bg-transparent text-[#000000] dark:text-[#F6EFEF] border-transparent hover:bg-[#000000]/10 dark:hover:bg-[#FFFFFF]/10',
      danger:
        'bg-[#FFDAD6] hover:bg-[#ffc2bc] text-[#000000] dark:bg-[#93000A] dark:hover:bg-[#b3000c] dark:text-[#FFDAD6]',
    }[variant];

    const shadowStyles = shadow && variant !== 'ghost' ? 'neo-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]' : '';
    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-display font-black transition-all focus:outline-none focus:ring-2 focus:ring-[#F2C94C] select-none ${sizeStyles} ${variantStyles} ${shadowStyles} ${disabledStyles} ${widthStyles} ${className}`}
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
