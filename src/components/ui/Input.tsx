import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      multiline = false,
      rows = 3,
      disabled = false,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseInputStyles =
      'w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-black text-[#000000] dark:text-[#F6EFEF] bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F2C94C] placeholder-[#000000]/50 dark:placeholder-[#F6EFEF]/50';

    const errorStyles = error
      ? 'border-[#BA1A1A] dark:border-[#FFB4AB] focus:ring-[#BA1A1A] bg-[#FFDAD6]/30'
      : '';

    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-[#DFD9D8] dark:bg-[#111010]'
      : '';

    const paddingLeft = leftIcon ? 'pl-9' : '';
    const paddingRight = rightIcon ? 'pr-9' : '';

    return (
      <div className={`w-full text-left space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full min-w-0">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-[#000000] dark:text-[#F6EFEF] shrink-0 z-10">
              {leftIcon}
            </div>
          )}

          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              disabled={disabled}
              rows={rows}
              className={`${baseInputStyles} ${paddingLeft} ${paddingRight} ${errorStyles} ${disabledStyles} ${className}`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              disabled={disabled}
              className={`${baseInputStyles} ${paddingLeft} ${paddingRight} ${errorStyles} ${disabledStyles} ${className}`}
              {...props}
            />
          )}

          {rightIcon && (
            <div className="absolute right-3 text-[#000000] dark:text-[#F6EFEF] shrink-0 z-10">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-black text-[#BA1A1A] dark:text-[#FFB4AB] mt-1 uppercase">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] font-bold text-[#000000]/70 dark:text-[#F6EFEF]/70 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
