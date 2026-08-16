import { BookResource, ResearchPaper, Topic } from '../types/curriculum';
import { getCorsCompatiblePdfUrl } from '../utils/embedUtils';
import {
  OfflineFileRecord,
  clearAllOfflineFiles as clearAllOfflineFilesFromDb,
  deleteOfflineFile,
  getOfflineFile,
  listOfflineFiles,
  putOfflineFile,
} from './storage';

export interface OfflineableResource {
  /** Stable dedupe key — the resource's raw (pre-proxy) URL. */
  url: string;
  title: string;
  kind: 'book' | 'paper';
}

/** Resolves the raw, stable URL for a book/paper the same way InAppPdfReader does. */
export function getResourceRawUrl(document: BookResource | ResearchPaper): string {
  const isPaper = 'authors' in document && 'summary' in document;
  const book = !isPaper ? (document as BookResource) : null;
  const paper = isPaper ? (document as ResearchPaper) : null;
  return book?.pdfUrl || paper?.openAccessUrl || book?.url || paper?.url || '';
}

export function toOfflineableResource(document: BookResource | ResearchPaper): OfflineableResource | null {
  const isPaper = 'authors' in document && 'summary' in document;
  const url = getResourceRawUrl(document);
  if (!url) return null;
  return {
    url,
    title: document.title,
    kind: isPaper ? 'paper' : 'book',
  };
}

/**
 * Every book/paper resource attached to a topic, following the same field-fallback chain
 * LessonPlayerView uses to decide what to display, so bulk-download coverage matches what a
 * learner can actually open in the reader.
 */
export function getTopicBookAndPaperResources(topic: Topic): OfflineableResource[] {
  const mp = topic.masteryPack;

  const books: BookResource[] = topic.pdfBooks?.length
    ? topic.pdfBooks
    : topic.books?.length
      ? topic.books
      : mp?.pdfBooks?.length
        ? mp.pdfBooks
        : mp?.books?.length
          ? mp.books
          : mp?.primaryText
            ? [mp.primaryText]
            : [];

  const papers: ResearchPaper[] = topic.researchPapers?.length
    ? topic.researchPapers
    : topic.foundationalPapers?.length
      ? topic.foundationalPapers
      : mp?.researchPapers?.length
        ? mp.researchPapers
        : mp?.foundationalPapers?.length
          ? mp.foundationalPapers
          : [
              ...(mp?.authoritativeResearchSource ? [mp.authoritativeResearchSource] : []),
              ...(mp?.modernSurveyOrTutorial ? [mp.modernSurveyOrTutorial] : []),
            ];

  return [...books, ...papers]
    .map(toOfflineableResource)
    .filter((r): r is OfflineableResource => r !== null);
}

export async function isResourceOffline(url: string): Promise<boolean> {
  if (!url) return false;
  const record = await getOfflineFile(url);
  return !!record;
}

export async function getOfflineBlob(url: string): Promise<Blob | null> {
  if (!url) return null;
  const record = await getOfflineFile(url);
  return record?.blob ?? null;
}

/**
 * Downloads a resource for offline reading and stores it in IndexedDB, keyed by its raw URL
 * (the same URL InAppPdfReader resolves from BookResource/ResearchPaper) so the reader can find
 * it again regardless of which CORS-proxy path was used to fetch it.
 */
export async function downloadResourceForOffline(
  resource: OfflineableResource,
  onProgress?: (loadedBytes: number, totalBytes: number | null) => void
): Promise<void> {
  const fetchUrl = getCorsCompatiblePdfUrl(resource.url);
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to download resource (${response.status} ${response.statusText})`);
  }

  const contentLengthHeader = response.headers.get('content-length');
  const totalBytes = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : null;
  const mimeType = response.headers.get('content-type') || 'application/pdf';

  let blob: Blob;
  if (response.body && onProgress) {
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loadedBytes = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        loadedBytes += value.byteLength;
        onProgress(loadedBytes, totalBytes);
      }
    }
    blob = new Blob(chunks as BlobPart[], { type: mimeType });
  } else {
    blob = await response.blob();
  }

  const record: OfflineFileRecord = {
    url: resource.url,
    title: resource.title,
    kind: resource.kind,
    mimeType,
    sizeBytes: blob.size,
    blob,
    cachedAt: new Date().toISOString(),
  };
  await putOfflineFile(record);
}

export async function removeOfflineResource(url: string): Promise<void> {
  await deleteOfflineFile(url);
}

export async function getOfflineStorageStats(): Promise<{ count: number; totalBytes: number }> {
  const files = await listOfflineFiles();
  return {
    count: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
  };
}

export async function listAllOfflineResources(): Promise<OfflineFileRecord[]> {
  return listOfflineFiles();
}

export async function clearAllOfflineResources(): Promise<void> {
  await clearAllOfflineFilesFromDb();
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Downloads several resources for offline reading with limited concurrency, skipping ones
 * already cached and continuing past individual failures so one broken link doesn't halt a
 * whole-course download.
 */
export async function downloadResourcesForOffline(
  resources: OfflineableResource[],
  options?: {
    concurrency?: number;
    onItemStart?: (resource: OfflineableResource) => void;
    onItemComplete?: (resource: OfflineableResource, error?: Error) => void;
    onOverallProgress?: (completed: number, total: number) => void;
  }
): Promise<{ succeeded: number; failed: number; skipped: number }> {
  const concurrency = options?.concurrency ?? 3;
  const uniqueByUrl = new Map(resources.map((r) => [r.url, r]));
  const queue = Array.from(uniqueByUrl.values());
  const total = queue.length;
  let completed = 0;
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const resource = queue[cursor];
      cursor += 1;

      const alreadyCached = await isResourceOffline(resource.url);
      if (alreadyCached) {
        skipped += 1;
        completed += 1;
        options?.onOverallProgress?.(completed, total);
        continue;
      }

      options?.onItemStart?.(resource);
      try {
        await downloadResourceForOffline(resource);
        succeeded += 1;
        options?.onItemComplete?.(resource);
      } catch (err) {
        failed += 1;
        options?.onItemComplete?.(resource, err instanceof Error ? err : new Error('Download failed'));
      }
      completed += 1;
      options?.onOverallProgress?.(completed, total);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
  return { succeeded, failed, skipped };
}
