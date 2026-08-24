import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Bookmark,
  BookOpen,
  FileText,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCw,
  Sparkles,
  X,
  Rows,
  Square,
  Eye
} from 'lucide-react';
import { BookResource, ResearchPaper } from '../../types/curriculum';
import { fixArxivPdfUrl, fixGitHubPdfUrl, getCorsCompatiblePdfUrl, isCorsSafePdfDomain } from '../../utils/embedUtils';
import { PdfUnavailableState } from '../common/ResourceErrorStates';
import { getOfflineBlob, toOfflineableResource } from '../../services/offlineResourceCache';
import { OfflineSaveButton } from '../common/OfflineSaveButton';

// Configure matching PDF.js worker, bundled locally so the version always matches pdfjs-dist and no CDN trust is required.
// Deliberately resolved from react-pdf's own nested pdfjs-dist dependency (not the top-level package, which can be a
// different version) since `pdfjs` above is react-pdf's re-exported API object — the worker must match that exact build.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const EMPTY_BOOKMARKED_PAGES: number[] = [];
const MAX_CONTINUOUS_PAGES = 50;

interface InAppPdfReaderProps {
  document: BookResource | ResearchPaper;
  savedPage?: number;
  bookmarkedPages?: number[];
  initialNote?: string;
  onPageChange?: (page: number, totalPages: number) => void;
  onBookmarkToggle?: (page: number) => void;
  onSaveNote?: (note: string) => void;
  onMarkCompleted?: () => void;
  isCompleted?: boolean;
  onClose?: () => void;
}

// Helper wrapper for individual Page item in continuous view mode to track intersection
const ContinuousPageItem: React.FC<{
  pageNumber: number;
  pageWidth: number;
  scale: number;
  rotation: number;
  onVisible: (pageNumber: number) => void;
}> = ({ pageNumber, pageWidth, scale, rotation, onVisible }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!itemRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            onVisible(pageNumber);
          }
        });
      },
      { rootMargin: '100px 0px 100px 0px', threshold: [0.3, 0.6] }
    );
    observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [pageNumber, onVisible]);

  return (
    <div
      ref={itemRef}
      id={`pdf-page-${pageNumber}`}
      className="relative my-3 bg-white border border-stone-800 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center transition-all shrink-0"
    >
      <Page
        pageNumber={pageNumber}
        width={pageWidth > 0 ? pageWidth : undefined}
        scale={scale}
        rotate={rotation}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        loading={
          <div className="w-[300px] h-[400px] bg-stone-900 border border-stone-800 flex items-center justify-center text-xs text-stone-400 font-mono gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#BE94F5]" /> Loading Page {pageNumber}...
          </div>
        }
      />
    </div>
  );
};

export const InAppPdfReader: React.FC<InAppPdfReaderProps> = ({
  document,
  savedPage = 1,
  bookmarkedPages = EMPTY_BOOKMARKED_PAGES,
  initialNote = '',
  onPageChange,
  onBookmarkToggle,
  onSaveNote,
  onMarkCompleted,
  isCompleted = false,
  onClose,
}) => {
  const isPaper = 'authors' in document && 'summary' in document;
  const paper = isPaper ? (document as ResearchPaper) : null;
  const book = !isPaper ? (document as BookResource) : null;

  const docId = (document as any).id || document.title;
  const initialRawUrl =
    book?.pdfUrl || paper?.openAccessUrl || book?.url || paper?.url || 'https://arxiv.org/pdf/1706.03762.pdf';

  const [activeUrl, setActiveUrl] = useState<string>(() => {
    return getCorsCompatiblePdfUrl(initialRawUrl);
  });

  const [readerMode, setReaderMode] = useState<'canvas' | 'native' | 'google'>(() => {
    const isCorsSafe = isCorsSafePdfDomain(getCorsCompatiblePdfUrl(initialRawUrl));
    return isCorsSafe ? 'canvas' : 'native';
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerAreaRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(savedPage);
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'custom' | 'fit-width' | 'fit-page'>('fit-width');
  
  // Continuous vs Single page view mode
  const [viewMode, setViewMode] = useState<'continuous' | 'single'>(() => {
    try {
      const saved = localStorage.getItem('computerfy_pdf_view_mode');
      return saved === 'single' ? 'single' : 'continuous';
    } catch {
      return 'continuous';
    }
  });

  const [containerWidth, setContainerWidth] = useState<number>(800);

  const [loadingStage, setLoadingStage] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  // True only when the reader silently switched away from Rich View after a load failure, so we
  // can tell the learner why the view changed instead of leaving it unexplained.
  const [modeAutoSwitched, setModeAutoSwitched] = useState<boolean>(false);

  // When this document has been saved for offline reading, its bytes are read from IndexedDB
  // instead of the network so the reader works with no internet connection. The IndexedDB check
  // is async, so `offlineCheckComplete` gates rendering <Document> until it resolves — swapping
  // the `file` prop *after* react-pdf has already started loading aborts the in-progress render
  // (visible as a flicker to a blank page), so `file` must only ever be set once, with its final value.
  const [offlineObjectUrl, setOfflineObjectUrl] = useState<string | null>(null);
  const [offlineCheckComplete, setOfflineCheckComplete] = useState(false);
  const offlineObjectUrlRef = useRef<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Collapsible internal details sidebar state (persisted)
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('computerfy_pdf_panel_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'reader' | 'notes' | 'questions'>('reader');
  const [bookmarks, setBookmarks] = useState<number[]>(bookmarkedPages);
  const [userNote, setUserNote] = useState<string>(initialNote);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [inputPage, setInputPage] = useState<string>(savedPage.toString());

  // Save view mode preference
  useEffect(() => {
    try {
      localStorage.setItem('computerfy_pdf_view_mode', viewMode);
    } catch (e) {
      // ignore
    }
  }, [viewMode]);

  // Save panel preference
  useEffect(() => {
    try {
      localStorage.setItem('computerfy_pdf_panel_open', JSON.stringify(isPanelOpen));
    } catch (e) {
      // ignore
    }
  }, [isPanelOpen]);

  // Observe container width
  useEffect(() => {
    if (!viewerAreaRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(viewerAreaRef.current);
    return () => observer.disconnect();
  }, []);

  // Reload the viewer only when the document itself changes. Reading progress
  // and note updates must not restart PDF loading or move the user's viewport.
  useEffect(() => {
    const raw = book?.pdfUrl || paper?.openAccessUrl || book?.url || paper?.url || '';
    const u = getCorsCompatiblePdfUrl(raw);
    setActiveUrl(u);
    const isCorsSafe = isCorsSafePdfDomain(u);
    setReaderMode(isCorsSafe ? 'canvas' : 'native');
    setLoadingStage('loading');
    setErrorDetails(null);
    setModeAutoSwitched(false);

    if (offlineObjectUrlRef.current) {
      URL.revokeObjectURL(offlineObjectUrlRef.current);
      offlineObjectUrlRef.current = null;
    }
    setOfflineObjectUrl(null);
    setOfflineCheckComplete(false);

    let cancelled = false;
    getOfflineBlob(raw).then((blob) => {
      if (cancelled) return;
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        offlineObjectUrlRef.current = objectUrl;
        setOfflineObjectUrl(objectUrl);
        // A cached blob renders fine in Rich View regardless of the original URL's CORS support —
        // safe to set here (unlike after mount) because nothing has started loading yet.
        setReaderMode('canvas');
      }
      setOfflineCheckComplete(true);
    });

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return () => {
      cancelled = true;
    };
  }, [docId, initialRawUrl]);

  // Revoke the last offline object URL on unmount to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (offlineObjectUrlRef.current) {
        URL.revokeObjectURL(offlineObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const nextPage = savedPage || 1;
    setCurrentPage(nextPage);
    setInputPage(nextPage.toString());
  }, [docId, savedPage]);

  useEffect(() => {
    setUserNote(initialNote || '');
  }, [docId, initialNote]);

  useEffect(() => {
    setBookmarks(bookmarkedPages || []);
  }, [docId, bookmarkedPages]);

  // Keyboard shortcuts (Ctrl+B for details panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsPanelOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadingStage('ready');
    setErrorDetails(null);
    if (numPages > MAX_CONTINUOUS_PAGES) {
      setViewMode('single');
    }
    const validPage = Math.min(Math.max(savedPage, 1), numPages);
    setCurrentPage(validPage);
    setInputPage(validPage.toString());
  };

  const onDocumentLoadError = (err: Error) => {
    console.warn('InAppPdfReader document load error:', err?.message);
    setErrorDetails(err?.message || 'Cross-origin fetch restrictions encountered on remote server.');
    if (readerMode === 'canvas') {
      setReaderMode('native');
      setModeAutoSwitched(true);
    } else {
      setLoadingStage('failed');
    }
  };

  const handleOpenGoogleViewer = () => {
    setReaderMode('google');
    setErrorDetails(null);
    setModeAutoSwitched(false);
  };

  const handleOpenNativeViewer = () => {
    setReaderMode('native');
    setErrorDetails(null);
    setModeAutoSwitched(false);
  };

  const handleOpenCanvasViewer = () => {
    setReaderMode('canvas');
    setLoadingStage('loading');
    setErrorDetails(null);
    setModeAutoSwitched(false);
  };

  const handleRetry = () => {
    const u = getCorsCompatiblePdfUrl(initialRawUrl);
    setActiveUrl(u);
    const isCorsSafe = isCorsSafePdfDomain(u);
    setReaderMode(isCorsSafe ? 'canvas' : 'native');
    setLoadingStage('loading');
    setErrorDetails(null);
  };

  // Handle Page Navigation
  const scrollToPage = useCallback((pageNum: number) => {
    const validPage = Math.min(Math.max(pageNum, 1), numPages);
    setCurrentPage(validPage);
    setInputPage(validPage.toString());
    onPageChange?.(validPage, numPages);

    if (viewMode === 'continuous') {
      const pageEl = window.document.getElementById(`pdf-page-${validPage}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [numPages, onPageChange, viewMode]);

  const handleInputPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      scrollToPage(parsed);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  // Zoom & Fit Controls
  const handleZoomIn = () => {
    setFitMode('custom');
    setScale((s) => Math.min(s + 0.15, 3.0));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setScale((s) => Math.max(s - 0.15, 0.5));
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    let updated: number[];
    if (bookmarks.includes(currentPage)) {
      updated = bookmarks.filter((p) => p !== currentPage);
    } else {
      updated = [...bookmarks, currentPage].sort((a, b) => a - b);
    }
    setBookmarks(updated);
    onBookmarkToggle?.(currentPage);
  };

  // Save Note
  const handleSaveNote = () => {
    onSaveNote?.(userNote);
  };

  // Copy Citation
  const handleCopyCitation = () => {
    const citationText = isPaper
      ? `${paper?.authors.join(', ')} (${paper?.year}). ${paper?.title}. ${paper?.venue}. DOI/ArXiv: ${paper?.doiOrArxiv || 'N/A'}`
      : `${book?.authors.join(', ')}. ${book?.title}. ${book?.publisherOrInstitution || 'Academic Press'}.`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const progressPercentage = Math.round((currentPage / (numPages || 1)) * 100);

  // Compute page width based on fit mode and container width
  const calculatedPageWidth = Math.max(
    280,
    fitMode === 'fit-width'
      ? containerWidth - 48
      : fitMode === 'fit-page'
      ? Math.min(containerWidth - 48, 720)
      : (containerWidth - 48) * scale
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-[#151313] text-white transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-0 rounded-none h-screen'
          : 'relative rounded-2xl border border-stone-800 shadow-2xl overflow-hidden min-h-[680px]'
      }`}
    >
      {/* Top Controls Toolbar — a single horizontally-scrollable row below the `md` breakpoint
          instead of wrapping, since wrapping three control clusters onto their own lines on a
          phone-width screen ate up to half the visible viewport before any page content showed. */}
      <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto bg-[#1e1b1b] border-b border-stone-800 px-3 sm:px-4 py-2.5 text-xs select-none md:flex-wrap md:justify-between md:overflow-visible">
        {/* Title & Panel Toggle */}
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          {/* Desktop Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-expanded={isPanelOpen}
            aria-controls="pdf-internal-details-sidebar"
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition-colors hidden md:flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
            title={isPanelOpen ? 'Collapse side panel' : 'Expand side panel'}
          >
            {isPanelOpen ? <PanelLeftClose className="w-4 h-4 text-[#BE94F5]" /> : <PanelLeftOpen className="w-4 h-4 text-[#82E0AA]" />}
            <span className="font-medium text-[11px] hidden sm:inline">
              {isPanelOpen ? 'Hide Details' : 'Show Details'}
            </span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 md:hidden flex items-center gap-1 min-h-[44px]"
          >
            <PanelLeftOpen className="w-4 h-4 text-[#82E0AA]" />
            <span className="text-xs font-bold">Details</span>
          </button>

          <BookOpen className="w-4 h-4 text-[#BE94F5] shrink-0 ml-1 hidden sm:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-stone-100 truncate max-w-[10rem] sm:max-w-md">{document.title}</h3>
              {offlineObjectUrl && (
                <span
                  title="Reading from your offline copy — no internet connection needed"
                  className="shrink-0 px-1.5 py-0.5 rounded-full bg-[#82E0AA]/20 border border-[#82E0AA]/50 text-[#82E0AA] text-[10px] font-bold uppercase tracking-wide"
                >
                  Offline
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-300 truncate hidden sm:flex items-center gap-2">
              <span className="truncate">{isPaper ? paper?.authors.join(', ') : book?.authors.join(', ')}</span>
              <a
                href={document.canonicalUrl || document.sourcePageUrl || initialRawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-stone-400 hover:text-white underline decoration-dotted flex items-center gap-0.5"
              >
                Source <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        {/* Center Page Controls & View Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Continuous vs Single Page Mode */}
          <div className="flex items-center bg-stone-900 border border-stone-800 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode('continuous')}
              disabled={numPages > MAX_CONTINUOUS_PAGES}
              title={
                numPages > MAX_CONTINUOUS_PAGES
                  ? `Continuous mode is limited to documents with ${MAX_CONTINUOUS_PAGES} pages or fewer`
                  : 'Continuous Vertical Scroll Mode'
              }
              className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                viewMode === 'continuous'
                  ? 'bg-[#BE94F5] text-[#151313]'
                  : 'text-stone-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Continuous</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              title="Single Page Mode"
              className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                viewMode === 'single' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-200 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Single</span>
            </button>
          </div>

          {/* Page Selector Input */}
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-xl">
            <button
              onClick={() => scrollToPage(currentPage - 1)}
              disabled={currentPage <= 1 || loadingStage !== 'ready'}
              aria-label="Previous Page"
              className="p-1 rounded hover:bg-stone-800 disabled:opacity-30 text-stone-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handleInputPageSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={inputPage}
                disabled={loadingStage !== 'ready'}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={handleInputPageSubmit}
                aria-label="Current Page Number"
                className="w-9 text-center bg-stone-800 border border-stone-700 rounded-md text-xs py-0.5 font-mono text-stone-100 focus:outline-none focus:border-[#BE94F5]"
              />
              <span className="text-xs text-stone-300 font-mono">/ {numPages}</span>
            </form>

            <button
              onClick={() => scrollToPage(currentPage + 1)}
              disabled={currentPage >= numPages || loadingStage !== 'ready'}
              aria-label="Next Page"
              className="p-1 rounded hover:bg-stone-800 disabled:opacity-30 text-stone-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Viewer mode: only surfaced when the current mode isn't the default Rich View, so
              troubleshooting controls don't compete for attention during normal reading. */}
          {readerMode !== 'canvas' && (
            <div className="hidden lg:flex items-center bg-stone-900 border border-stone-800 p-0.5 rounded-xl">
              <button
                onClick={handleOpenCanvasViewer}
                title="Rich View — searchable text, zoom, and page thumbnails"
                className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 text-stone-300 hover:text-white"
              >
                <Eye className="w-3 h-3" />
                <span>Try Rich View</span>
              </button>
              <button
                onClick={handleOpenNativeViewer}
                title="Simple View — your browser's own PDF viewer"
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  readerMode === 'native' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-300 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Simple</span>
              </button>
              <button
                onClick={handleOpenGoogleViewer}
                title="Compatibility View — for files the other two viewers can't open"
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  readerMode === 'google' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-300 hover:text-white'
                }`}
              >
                <span>Compatibility</span>
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-xl">
            <button
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              title="Zoom Out"
              className="p-1 hover:bg-stone-800 rounded text-stone-200"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setFitMode('fit-width')}
              title="Fit to Width"
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-bold ${
                fitMode === 'fit-width' ? 'bg-[#BE94F5] text-[#151313]' : 'text-stone-200 hover:text-white'
              }`}
            >
              Width
            </button>

            <button
              onClick={handleZoomIn}
              aria-label="Zoom In"
              title="Zoom In"
              className="p-1 hover:bg-stone-800 rounded text-stone-200"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRotate}
              title="Rotate 90 degrees"
              className="p-1 hover:bg-stone-800 rounded text-stone-200 hover:text-white"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            aria-label={bookmarks.includes(currentPage) ? 'Remove Bookmark' : 'Bookmark Page'}
            title="Bookmark this page"
            className={`p-2 rounded-xl border transition-colors ${
              bookmarks.includes(currentPage)
                ? 'bg-[#FCCC42]/20 border-[#FCCC42] text-[#FCCC42]'
                : 'bg-stone-900 border-stone-800 text-stone-200 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} />
          </button>

          {/* Save Offline */}
          <OfflineSaveButton resource={toOfflineableResource(document)} variant="toolbar" iconOnly />

          {/* Mark Complete */}
          {onMarkCompleted && (
            <button
              onClick={onMarkCompleted}
              aria-label="Mark document as read"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isCompleted ? 'Completed' : 'Complete'}</span>
            </button>
          )}

          {/* Contextual Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label={isFullscreen ? 'Exit full width' : 'Enter full width'}
            title={isFullscreen ? 'Exit full width' : 'Enter full width'}
            className="p-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close reader"
              className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium"
            >
              <X className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-900 h-1">
        <div
          className="bg-[#BE94F5] h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Auto-switch Notice: only shown when the reader silently changed viewers after a load failure */}
      {modeAutoSwitched && readerMode !== 'canvas' && (
        <div className="bg-[#F2C94C]/15 border-b border-[#F2C94C]/40 px-4 py-1.5 text-xs text-[#F2C94C] flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Rich View couldn't load this file, so we switched to a simpler viewer automatically.
          </span>
          <button
            onClick={() => setModeAutoSwitched(false)}
            aria-label="Dismiss notice"
            className="shrink-0 p-0.5 rounded hover:bg-[#F2C94C]/20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden min-h-[580px] relative">
        {/* Desktop Internal Side Panel */}
        {isPanelOpen && (
          <div
            id="pdf-internal-details-sidebar"
            className="w-64 bg-[#191717] border-r border-stone-800 flex flex-col hidden md:flex shrink-0 transition-all duration-200"
          >
            <div className="flex border-b border-stone-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('reader')}
                className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                  activeTab === 'reader'
                    ? 'border-[#BE94F5] text-[#BE94F5]'
                    : 'border-transparent text-stone-200 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Summary</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-[#BE94F5] text-[#BE94F5]'
                    : 'border-transparent text-stone-200 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('questions')}
                className={`flex-1 py-2.5 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                  activeTab === 'questions'
                    ? 'border-[#BE94F5] text-[#BE94F5]'
                    : 'border-transparent text-stone-200 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Questions</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
              {activeTab === 'reader' && (
                <div className="space-y-4 text-stone-200">
                  {isPaper && paper && (
                    <>
                      <div>
                        <h4 className="font-semibold text-stone-100 mb-1">Why It Matters</h4>
                        <p className="text-stone-300 leading-relaxed">{paper.whyItMatters}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-100 mb-1">Sections to Read</h4>
                        <p className="text-[#BE94F5] font-mono">{paper.sectionsToRead}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-100 mb-1">Paper Summary</h4>
                        <p className="text-stone-300 leading-relaxed">{paper.summary}</p>
                      </div>
                    </>
                  )}

                  {book && (
                    <div>
                      <h4 className="font-semibold text-stone-100 mb-1">Recommended Chapter</h4>
                      <p className="text-stone-200 font-medium">{book.recommendedChapter}</p>
                      <p className="text-stone-300 mt-2">Publisher: {book.publisherOrInstitution || 'Academic Press'}</p>
                    </div>
                  )}

                  {/* Bookmarks Section */}
                  <div className="pt-2 border-t border-stone-800">
                    <h4 className="font-semibold text-stone-100 mb-2 flex items-center justify-between">
                      <span>Bookmarked Pages</span>
                      <span className="text-stone-300 font-mono">{bookmarks.length}</span>
                    </h4>
                    {bookmarks.length === 0 ? (
                      <p className="text-stone-300 italic">No bookmarks saved yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {bookmarks.map((p) => (
                          <button
                            key={p}
                            onClick={() => scrollToPage(p)}
                            className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
                              p === currentPage
                                ? 'bg-[#BE94F5]/20 border-[#BE94F5] text-[#BE94F5]'
                                : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                            }`}
                          >
                            p. {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Citation Box */}
                  <div className="pt-2 border-t border-stone-800">
                    <button
                      onClick={handleCopyCitation}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-lg text-stone-200 transition-colors"
                    >
                      {copiedCitation ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Citation Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-stone-200">Personal Reading Notes</h4>
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Type personal notes, key formulas, or insights..."
                    rows={8}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-[#BE94F5] resize-none font-mono"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="w-full py-2 bg-[#BE94F5] hover:bg-[#a370eb] text-[#151313] font-bold rounded-lg transition-colors text-xs"
                  >
                    Save Note
                  </button>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-3 text-stone-200">
                  <h4 className="font-semibold text-stone-100">Reading Comprehension</h4>
                  {isPaper && paper?.readingQuestions ? (
                    <ul className="space-y-2 list-disc list-inside text-stone-300">
                      {paper.readingQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {q}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-300 italic">No specific questions for this textbook chapter.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Slide-Over Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex justify-end md:hidden animate-fade-in">
            <div className="w-80 bg-[#191717] h-full border-l border-stone-800 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#BE94F5]" /> Resource Details
                </h3>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg bg-stone-900 text-stone-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isPaper && paper && (
                <div className="space-y-3 text-xs text-stone-200">
                  <div>
                    <h4 className="font-bold text-stone-100">Why It Matters</h4>
                    <p className="text-stone-300">{paper.whyItMatters}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">Paper Summary</h4>
                    <p className="text-stone-300">{paper.summary}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-stone-800">
                <h4 className="font-bold text-xs text-stone-100">Personal Notes</h4>
                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#BE94F5] font-mono"
                />
                <button
                  onClick={() => {
                    handleSaveNote();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full py-2 bg-[#BE94F5] text-[#151313] font-bold text-xs rounded-lg"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Document Viewer Viewport */}
        <div
          ref={viewerAreaRef}
          className="flex-1 bg-stone-950 flex flex-col items-center overflow-y-auto p-3 sm:p-6 relative min-h-[500px]"
        >
          {!offlineCheckComplete ? (
            <div className="flex flex-col items-center justify-center space-y-3 text-stone-400 py-28 my-auto">
              <Loader2 className="w-8 h-8 animate-spin text-[#BE94F5]" />
              <p className="text-sm font-medium font-mono">Preparing document…</p>
            </div>
          ) : readerMode === 'native' ? (
            <div className="w-full h-full min-h-[650px] flex flex-col items-center bg-stone-950 relative space-y-2 p-1">
              <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300">
                <span className="font-mono text-stone-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">Simple View</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenCanvasViewer}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold border border-stone-700 transition-colors"
                  >
                    Try Rich View
                  </button>
                  <button
                    onClick={handleOpenGoogleViewer}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold border border-stone-700 transition-colors hidden sm:inline-flex"
                  >
                    Compatibility
                  </button>
                  <a
                    href={initialRawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-[#F2C94C] hover:bg-[#e2b93c] text-stone-950 font-extrabold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Open Direct Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <iframe
                src={offlineObjectUrl || activeUrl}
                className="w-full flex-1 min-h-[650px] rounded-xl border border-stone-800 bg-white shadow-2xl"
                title={document.title}
              />
            </div>
          ) : readerMode === 'google' ? (
            <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-stone-950 relative space-y-3 p-2">
              <div className="w-full flex items-center justify-between px-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300">
                <span className="font-mono text-stone-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Compatibility View</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNativeViewer}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold border border-stone-700 transition-colors"
                  >
                    Simple View
                  </button>
                  <button
                    onClick={handleOpenCanvasViewer}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold border border-stone-700 transition-colors"
                  >
                    Rich View
                  </button>
                  <a
                    href={initialRawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-[#BE94F5] hover:bg-[#a372e6] text-[#151313] font-extrabold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Open Direct Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(initialRawUrl)}&embedded=true`}
                className="w-full flex-1 min-h-[600px] rounded-xl border border-stone-800 bg-white"
                title={document.title}
              />
            </div>
          ) : loadingStage === 'failed' ? (
            <PdfUnavailableState
              title={document.title}
              institution={isPaper ? paper?.authors.join(', ') : book?.publisherOrInstitution || 'Academic Source'}
              sourcePageUrl={initialRawUrl}
              technicalDetails={errorDetails || 'Remote server blocked cross-origin PDF frame requests.'}
              onRetry={handleRetry}
              onOpenGoogleViewer={handleOpenGoogleViewer}
            />
          ) : (
            <Document
              file={offlineObjectUrl || activeUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center space-y-3 text-stone-400 py-28 my-auto">
                  <Loader2 className="w-8 h-8 animate-spin text-[#BE94F5]" />
                  <p className="text-sm font-medium font-mono">Loading document…</p>
                  <p className="text-xs text-stone-500 font-sans">{document.title}</p>
                </div>
              }
            >
              {loadingStage === 'ready' && (
                viewMode === 'continuous' ? (
                  <div className="w-full flex flex-col items-center py-4 space-y-6">
                    {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                      <ContinuousPageItem
                        key={`page_${pageNum}`}
                        pageNumber={pageNum}
                        pageWidth={calculatedPageWidth}
                        scale={scale}
                        rotation={rotation}
                        onVisible={(p) => {
                          setCurrentPage(p);
                          setInputPage(p.toString());
                          onPageChange?.(p, numPages);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="my-auto py-4 flex justify-center">
                    <div
                      id={`pdf-page-${currentPage}`}
                      className="relative bg-white border border-stone-800 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center transition-all"
                    >
                      <Page
                        pageNumber={currentPage}
                        width={calculatedPageWidth > 0 ? calculatedPageWidth : undefined}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="w-[300px] h-[400px] bg-stone-900 border border-stone-800 flex items-center justify-center text-xs text-stone-400 font-mono gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#BE94F5]" /> Loading Page {currentPage}...
                          </div>
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};
