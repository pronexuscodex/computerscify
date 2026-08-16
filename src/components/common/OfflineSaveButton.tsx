import React from 'react';
import { CloudDownload, CloudOff, Loader2, Trash2 } from 'lucide-react';
import { OfflineableResource } from '../../services/offlineResourceCache';
import { useOfflineResource } from '../../hooks/useOfflineResource';

interface OfflineSaveButtonProps {
  resource: OfflineableResource | null;
  /**
   * 'neo' matches LessonPlayerView's hardcoded neo-brutalist palette; 'ds' matches the --ds-* token
   * screens; 'toolbar' matches InAppPdfReader's dark stone-900/stone-800 icon-button toolbar.
   */
  variant: 'neo' | 'ds' | 'toolbar';
  className?: string;
  /** 'toolbar' variant only: renders as an icon-only square button instead of icon + label. */
  iconOnly?: boolean;
}

/** Small reusable "save this book/paper for offline reading" toggle, styled to match either design system in use. */
export const OfflineSaveButton: React.FC<OfflineSaveButtonProps> = ({ resource, variant, className = '', iconOnly = false }) => {
  const { status, progressPercent, download, remove } = useOfflineResource(resource);

  if (!resource) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (status === 'cached') {
      remove();
    } else if (status === 'idle' || status === 'error') {
      download();
    }
  };

  const label =
    status === 'cached'
      ? 'Saved offline'
      : status === 'downloading'
      ? progressPercent !== null
        ? `Saving ${progressPercent}%`
        : 'Saving…'
      : status === 'error'
      ? 'Retry offline save'
      : 'Save offline';

  const icon =
    status === 'downloading' ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : status === 'cached' ? (
      <Trash2 className="w-3.5 h-3.5" />
    ) : status === 'error' ? (
      <CloudOff className="w-3.5 h-3.5" />
    ) : (
      <CloudDownload className="w-3.5 h-3.5" />
    );

  if (variant === 'neo') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'downloading' || status === 'checking'}
        title={status === 'cached' ? 'Remove from offline storage' : 'Save this PDF so you can read it without an internet connection'}
        className={`shrink-0 px-2.5 py-1.5 rounded border-2 border-[#000000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all neo-shadow-sm disabled:opacity-70 ${
          status === 'cached' ? 'bg-[#82E0AA] text-[#000000]' : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
        } ${className}`}
      >
        {icon} {label}
      </button>
    );
  }

  if (variant === 'toolbar') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'downloading' || status === 'checking'}
        aria-label={label}
        title={status === 'cached' ? 'Remove from offline storage' : 'Save this document so you can read it without an internet connection'}
        className={`${iconOnly ? 'p-2' : 'flex items-center gap-1.5 px-2.5 py-1.5 text-xs'} rounded-xl border transition-colors disabled:opacity-70 ${
          status === 'cached'
            ? 'bg-[#82E0AA]/20 border-[#82E0AA] text-[#82E0AA]'
            : 'bg-stone-900 border-stone-800 text-stone-200 hover:text-white'
        } ${className}`}
      >
        {icon} {!iconOnly && label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'downloading' || status === 'checking'}
      title={status === 'cached' ? 'Remove from offline storage' : 'Save this PDF so you can read it without an internet connection'}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] border px-3 text-xs font-black disabled:opacity-70 ${
        status === 'cached' ? 'border-[var(--ds-success)] bg-[var(--ds-success-soft)]' : 'border-[var(--ds-border)]'
      } ${className}`}
    >
      {icon} {label}
    </button>
  );
};
