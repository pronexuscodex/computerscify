import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  subtext?: string;
  position?: 'right' | 'left' | 'top' | 'bottom';
  delayMs?: number;
  disabled?: boolean;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  subtext,
  position = 'right',
  delayMs = 300,
  disabled = false,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const offset = 8; // distance from trigger

    let top = 0;
    let left = 0;

    if (position === 'right') {
      top = rect.top + rect.height / 2;
      left = rect.right + offset;
    } else if (position === 'left') {
      top = rect.top + rect.height / 2;
      left = rect.left - offset;
    } else if (position === 'top') {
      top = rect.top - offset;
      left = rect.left + rect.width / 2;
    } else if (position === 'bottom') {
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2;
    }

    setCoords({ top, left });
  }, [position]);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    timerRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delayMs);
  }, [delayMs, disabled, calculatePosition]);

  const hideTooltip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideTooltip();
    };
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', hideTooltip, true);
      window.addEventListener('resize', hideTooltip);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', hideTooltip, true);
      window.removeEventListener('resize', hideTooltip);
    };
  }, [isVisible, hideTooltip]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Clone element to attach event handlers and ref
  const child = React.Children.only(children);
  const triggerElement = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      // Handle existing ref if present
      const childRef = (child as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      if (child.props.onMouseEnter) child.props.onMouseEnter(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      if (child.props.onMouseLeave) child.props.onMouseLeave(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      if (child.props.onFocus) child.props.onFocus(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      if (child.props.onBlur) child.props.onBlur(e);
    },
  });

  // Calculate transform according to position
  const getTransformClass = () => {
    switch (position) {
      case 'right':
        return '-translate-y-1/2';
      case 'left':
        return '-translate-x-full -translate-y-1/2';
      case 'top':
        return '-translate-x-1/2 -translate-y-full';
      case 'bottom':
        return '-translate-x-1/2';
      default:
        return '-translate-y-1/2';
    }
  };

  const getArrowStyle = (): React.CSSProperties => {
    switch (position) {
      case 'right':
        return { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
      case 'left':
        return { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
      case 'top':
        return { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
      case 'bottom':
        return { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
      default:
        return { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
    }
  };

  return (
    <>
      {triggerElement}
      {isVisible &&
        createPortal(
          <div
            role="tooltip"
            className={`fixed z-50 pointer-events-none transition-opacity duration-150 animate-fade-in ${getTransformClass()}`}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            <div className="relative bg-[#151313] text-[#F7F7F5] border border-[#F7F7F5]/20 rounded-lg px-2.5 py-1.5 shadow-xl text-xs font-sans max-w-xs flex flex-col gap-0.5">
              {/* Little Arrow */}
              <div
                className="absolute w-2 h-2 bg-[#151313] border-l border-b border-[#F7F7F5]/20"
                style={getArrowStyle()}
              />
              <div className="flex items-center gap-2 justify-between min-w-0">
                <span className="font-semibold text-xs tracking-tight break-words max-w-[16rem]">{content}</span>
                {shortcut && (
                  <kbd className="text-[10px] font-mono bg-[#F7F7F5]/10 text-[#BE94F5] px-1.5 py-0.5 rounded border border-[#F7F7F5]/10">
                    {shortcut}
                  </kbd>
                )}
              </div>
              {subtext && <span className="text-[10px] text-[#F7F7F5]/70 leading-tight">{subtext}</span>}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
