import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  FileText,
  Video,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

interface ErrorStateProps {
  title: string;
  institution?: string;
  sourcePageUrl?: string;
  lastVerifiedAt?: string;
  technicalDetails?: string;
  onRetry?: () => void;
  onUseFallback?: () => void;
  onReportIssue?: () => void;
}

export const VideoUnavailableState: React.FC<ErrorStateProps> = ({
  title,
  institution = 'Academic Institution',
  sourcePageUrl,
  lastVerifiedAt,
  technicalDetails,
  onRetry,
  onUseFallback,
  onReportIssue,
}) => {
  const [showDevDetails, setShowDevDetails] = useState(false);

  return (
    <div className="bg-[#191717] border border-stone-800 rounded-2xl p-6 text-white space-y-6 max-w-2xl mx-auto my-6 shadow-2xl min-w-0">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#FCCC42]/10 border border-[#FCCC42]/30 rounded-xl text-[#FCCC42] shrink-0">
          <Video className="w-6 h-6" />
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FCCC42]/20 text-[#FCCC42] text-[11px] font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5" /> Video Stream Unavailable
          </div>
          <h3 className="text-lg font-bold text-stone-100 break-words">{title}</h3>
          <p className="text-xs text-stone-400">
            Provider: <strong className="text-stone-200">{institution}</strong>
            {lastVerifiedAt && ` • Last Verified: ${lastVerifiedAt}`}
          </p>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs text-stone-300 space-y-2">
        <p className="leading-relaxed">
          This lecture video is protected or restricted from direct in-app embedding by the host server, or the video source has changed.
        </p>
        <p className="text-stone-400">
          ComputerSciFy ensures your learning is uninterrupted by providing a direct official link or a verified alternative lecture.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {sourcePageUrl && (
          <a
            href={sourcePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FCCC42] hover:bg-[#e2b230] text-[#151313] font-bold text-xs rounded-xl transition-all shadow min-h-[44px]"
          >
            <span>Open Official Lecture Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs rounded-xl transition-all min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-[#FCCC42]" />
            <span>Use Verified Alternative</span>
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Retry Connection"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {technicalDetails && (
        <div className="pt-3 border-t border-stone-800 text-[11px]">
          <button
            onClick={() => setShowDevDetails(!showDevDetails)}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-400 font-mono"
          >
            {showDevDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Developer Diagnostics</span>
          </button>
          {showDevDetails && (
            <pre className="mt-2 p-3 bg-black/60 rounded-lg text-stone-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
              {technicalDetails}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const PdfUnavailableState: React.FC<ErrorStateProps> = ({
  title,
  institution = 'Academic Publisher',
  sourcePageUrl,
  lastVerifiedAt,
  technicalDetails,
  onRetry,
  onUseFallback,
  onReportIssue,
}) => {
  const [showDevDetails, setShowDevDetails] = useState(false);

  return (
    <div className="bg-[#191717] border border-stone-800 rounded-2xl p-6 text-white space-y-6 max-w-2xl mx-auto my-6 shadow-2xl">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#BE94F5]/10 border border-[#BE94F5]/30 rounded-xl text-[#BE94F5] shrink-0">
          <FileText className="w-6 h-6" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BE94F5]/20 text-[#BE94F5] text-[11px] font-mono font-bold">
            <Info className="w-3.5 h-3.5" /> Document Viewer Status
          </div>
          <h3 className="text-lg font-bold text-stone-100">{title}</h3>
          <p className="text-xs text-stone-400">
            Source: <strong className="text-stone-200">{institution}</strong>
            {lastVerifiedAt && ` • Last Verified: ${lastVerifiedAt}`}
          </p>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs text-stone-300 space-y-2">
        <p className="leading-relaxed">
          This document could not be directly loaded into the ComputerSciFy PDF Canvas reader due to CORS security policies on the remote host.
        </p>
        <p className="text-stone-400">
          You can open the open-access document directly in a separate browser tab or view the verified summary.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {sourcePageUrl && (
          <a
            href={sourcePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#BE94F5] hover:bg-[#a372e6] text-[#151313] font-extrabold text-xs rounded-xl transition-all shadow"
          >
            <span>Open Direct PDF Source</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs rounded-xl transition-all min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-[#BE94F5]" />
            <span>Use Verified Reader Fallback</span>
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Retry Reader"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {technicalDetails && (
        <div className="pt-3 border-t border-stone-800 text-[11px]">
          <button
            onClick={() => setShowDevDetails(!showDevDetails)}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-400 font-mono min-h-[36px]"
          >
            {showDevDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Technical Diagnostics</span>
          </button>
          {showDevDetails && (
            <pre className="mt-2 p-3 bg-black/60 rounded-lg text-stone-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
              {technicalDetails}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export const EmbeddingBlockedState: React.FC<ErrorStateProps> = ({
  title,
  institution = 'University Page',
  sourcePageUrl,
}) => (
  <div className="bg-[#F7F7F5] border-2 border-[#151313] rounded-2xl p-6 text-[#151313] space-y-4 max-w-xl mx-auto my-6 shadow-xl min-w-0">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-[#FCCC42] text-[#151313] rounded-xl font-bold border border-[#151313] shrink-0">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h4 className="font-display font-extrabold text-base truncate">In-App Framing Restricted</h4>
        <p className="text-xs text-stone-600 font-mono truncate">{institution}</p>
      </div>
    </div>

    <p className="text-xs font-medium text-stone-800 leading-relaxed break-words">
      Standard course webpages (such as <strong>{title}</strong>) enforce security headers that prevent framing inside application viewports.
    </p>

    {sourcePageUrl && (
      <a
        href={sourcePageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#151313] text-white font-bold text-xs rounded-xl hover:bg-[#BE94F5] hover:text-[#151313] transition-colors min-h-[44px]"
      >
        <span>Open {institution} Reference Page</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);

export const ReplacementResourceNotice: React.FC<{ reason?: string }> = ({ reason }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#82E0AA]/20 border border-[#82E0AA] text-[#151313] text-xs font-bold font-mono">
    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
    <span>Verified Alternative Stream Active {reason ? `(${reason})` : ''}</span>
  </div>
);
