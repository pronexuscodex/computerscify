import React, { forwardRef, useId } from 'react';

interface SharedInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

type SingleLineInputProps = SharedInputProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type MultilineInputProps = SharedInputProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

export type InputProps = SingleLineInputProps | MultilineInputProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (allProps, ref) => {
    const {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      multiline = false,
      disabled = false,
      className = '',
      containerClassName = '',
      id,
      ...fieldProps
    } = allProps;
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseInputStyles =
      'w-full min-h-11 rounded-[var(--ds-radius-md)] border border-[var(--ds-border-strong)] bg-[var(--ds-surface)] px-3.5 py-2.5 text-sm font-medium text-[var(--ds-text)] shadow-[var(--ds-shadow-sm)] transition-[border-color,box-shadow] placeholder:text-[var(--ds-text-muted)] focus-visible:border-[var(--ds-focus)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)]/25';

    const errorStyles = error
      ? 'border-[var(--ds-danger)] bg-[var(--ds-danger-soft)] focus-visible:ring-[var(--ds-danger)]/25'
      : '';

    const disabledStyles = disabled
      ? 'cursor-not-allowed bg-[var(--ds-surface-muted)] opacity-60'
      : '';

    const paddingLeft = leftIcon ? 'pl-9' : '';
    const paddingRight = rightIcon ? 'pr-9' : '';

    return (
      <div className={`w-full text-left space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--ds-text)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full min-w-0">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 z-10 shrink-0 text-[var(--ds-text-muted)]">
              {leftIcon}
            </div>
          )}

          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              disabled={disabled}
              className={`${baseInputStyles} ${paddingLeft} ${paddingRight} ${errorStyles} ${disabledStyles} ${className}`}
              {...(fieldProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              disabled={disabled}
              className={`${baseInputStyles} ${paddingLeft} ${paddingRight} ${errorStyles} ${disabledStyles} ${className}`}
              {...(fieldProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightIcon && (
            <div className="absolute right-3 z-10 shrink-0 text-[var(--ds-text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs font-medium text-[var(--ds-danger)]">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[var(--ds-text-muted)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
