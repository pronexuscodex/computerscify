import { useCallback, useEffect, useState } from 'react';
import {
  OfflineableResource,
  downloadResourceForOffline,
  isResourceOffline,
  removeOfflineResource,
} from '../services/offlineResourceCache';

export type OfflineResourceStatus = 'idle' | 'checking' | 'downloading' | 'cached' | 'error';

export interface UseOfflineResourceResult {
  status: OfflineResourceStatus;
  progressPercent: number | null;
  errorMessage: string | null;
  download: () => void;
  remove: () => void;
}

/**
 * Tracks whether a book/paper is saved for offline reading and exposes download/remove actions.
 * Re-checks IndexedDB whenever the resource's URL changes (e.g. navigating between topics).
 */
export function useOfflineResource(resource: OfflineableResource | null): UseOfflineResourceResult {
  const [status, setStatus] = useState<OfflineResourceStatus>('checking');
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!resource?.url) {
      setStatus('idle');
      return;
    }
    setStatus('checking');
    isResourceOffline(resource.url).then((cached) => {
      if (!cancelled) setStatus(cached ? 'cached' : 'idle');
    });
    return () => {
      cancelled = true;
    };
  }, [resource?.url]);

  const download = useCallback(() => {
    if (!resource?.url || status === 'downloading' || status === 'cached') return;
    setStatus('downloading');
    setProgressPercent(0);
    setErrorMessage(null);
    downloadResourceForOffline(resource, (loaded, total) => {
      setProgressPercent(total ? Math.min(100, Math.round((loaded / total) * 100)) : null);
    })
      .then(() => {
        setStatus('cached');
        setProgressPercent(null);
      })
      .catch((err: unknown) => {
        setStatus('error');
        setProgressPercent(null);
        setErrorMessage(err instanceof Error ? err.message : 'Download failed');
      });
  }, [resource, status]);

  const remove = useCallback(() => {
    if (!resource?.url) return;
    removeOfflineResource(resource.url).then(() => {
      setStatus('idle');
    });
  }, [resource?.url]);

  return { status, progressPercent, errorMessage, download, remove };
}
