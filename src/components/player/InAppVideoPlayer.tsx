import React, { useState } from 'react';
import {
  Play,
  Check,
  Bookmark,
  MessageSquare,
  Clock,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  ExternalLink,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { VideoResource } from '../../types/curriculum';
import {
  parseYouTubeResource,
  createYouTubeEmbedUrl,
  isNormalWebPage,
  isAllowedEmbedHost
} from '../../utils/embedUtils';
import { VideoUnavailableState, EmbeddingBlockedState } from '../common/ResourceErrorStates';

interface InAppVideoPlayerProps {
  video: VideoResource;
  onMarkCompleted?: () => void;
  isCompleted?: boolean;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  onSaveNote?: (timestampSeconds: number, noteText: string) => void;
  initialNotes?: string;
  onFocusModeToggle?: () => void;
}

export const InAppVideoPlayer: React.FC<InAppVideoPlayerProps> = ({
  video,
  onMarkCompleted,
  isCompleted = false,
  onNextLesson,
  onPrevLesson,
  onSaveNote,
  initialNotes = '',
  onFocusModeToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'transcript'>('overview');
  const [noteText, setNoteText] = useState<string>(initialNotes);
  const [savedNotes, setSavedNotes] = useState<{ time: string; text: string }[]>([]);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);

  // Combine primary video and fallbacks into a list
  const videoList = [
    video,
    ...(video.fallbackResources || [])
  ];

  const activeVideo = videoList[activeVideoIndex] || video;

  // Derive YouTube video ID / embed URL securely
  const { videoId, playlistId } = parseYouTubeResource(activeVideo.url || activeVideo.embedUrl || '');
  const verifiedEmbedUrl = videoId
    ? createYouTubeEmbedUrl(videoId, { playlistId: playlistId || undefined })
    : activeVideo.embedUrl && !isNormalWebPage(activeVideo.embedUrl)
    ? activeVideo.embedUrl
    : '';

  const isWebPageAttempt = isNormalWebPage(activeVideo.url) && !videoId;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const timestamp = '00:00';
    setSavedNotes((prev) => [...prev, { time: timestamp, text: noteText }]);
    onSaveNote?.(0, noteText);
    setNoteText('');
  };

  const handleSelectVideoIndex = (index: number) => {
    setActiveVideoIndex(index);
    setHasPlaybackError(false);
  };

  return (
    <div className="bg-[#151313] border border-stone-800 rounded-xl overflow-hidden shadow-2xl flex flex-col text-white">
      {/* Video Shell Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e1b1b] border-b border-stone-800">
        <div className="flex items-center gap-2 min-w-0">
          <Play className="w-5 h-5 text-[#FCCC42] shrink-0 fill-current" />
          <div className="min-w-0">
            <h3 className="font-semibold text-stone-100 truncate text-sm">{video.title}</h3>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 text-stone-500" />
                {video.provider}
              </span>
              {video.instructor && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-stone-500" />
                  {video.instructor}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                {video.durationMinutes} mins
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onFocusModeToggle && (
            <button
              onClick={onFocusModeToggle}
              title="Focus Mode"
              className="p-2 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          {onMarkCompleted && (
            <button
              onClick={onMarkCompleted}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-[#BE94F5] border-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-bold'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video & Side Tab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Iframe Video Player Container */}
        <div className="lg:col-span-2 bg-black aspect-video relative flex items-center justify-center overflow-hidden">
          {hasPlaybackError ? (
            <VideoUnavailableState
              title={video.title}
              institution={video.provider}
              sourcePageUrl={video.url}
              onRetry={() => setHasPlaybackError(false)}
            />
          ) : isWebPageAttempt ? (
            <EmbeddingBlockedState
              title={video.title}
              institution={video.provider}
              sourcePageUrl={video.url}
            />
          ) : verifiedEmbedUrl ? (
            <iframe
              src={verifiedEmbedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setHasPlaybackError(true)}
              className="w-full h-full border-0"
            />
          ) : (
            <VideoUnavailableState
              title={video.title}
              institution={video.provider}
              sourcePageUrl={video.url}
              onRetry={() => setHasPlaybackError(false)}
            />
          )}
        </div>

        {/* Interactive Tabs / Notes / Transcript */}
        <div className="bg-[#191717] border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col h-[400px] lg:h-auto">
          {/* Tabs */}
          <div className="flex border-b border-stone-800 text-xs font-medium bg-[#1e1b1b]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#BE94F5] text-[#BE94F5]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-[#BE94F5] text-[#BE94F5]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Notes ({savedNotes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'transcript'
                  ? 'border-[#BE94F5] text-[#BE94F5]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Chapters</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto flex-1 text-xs space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4 text-stone-300">
                <div>
                  <h4 className="font-semibold text-stone-200 mb-1">Lecture Details</h4>
                  <p className="text-stone-400 leading-relaxed">
                    Provided by <strong className="text-stone-200">{activeVideo.provider}</strong>. This lecture covers core abstractions, problem-solving techniques, and foundational principles.
                  </p>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span>Access Level</span>
                    <span className="text-emerald-400 font-mono capitalize">{activeVideo.accessStatus || 'verified'}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-400">
                    <span>Duration</span>
                    <span className="text-stone-200 font-mono">{activeVideo.durationMinutes} minutes</span>
                  </div>
                </div>

                {videoList.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-stone-800">
                    <h4 className="font-semibold text-stone-200 text-xs flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#FCCC42]" />
                      <span>Verified Stream Sources ({videoList.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {videoList.map((v, idx) => (
                        <button
                          key={v.id || idx}
                          onClick={() => handleSelectVideoIndex(idx)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                            activeVideoIndex === idx
                              ? 'bg-[#BE94F5]/15 border-[#BE94F5] text-white font-medium'
                              : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                          }`}
                        >
                          <div className="truncate min-w-0 pr-2">
                            <div className="truncate font-medium">{v.title}</div>
                            <div className="text-[10px] opacity-75">{v.provider}</div>
                          </div>
                          {activeVideoIndex === idx && (
                            <span className="text-[10px] bg-[#BE94F5] text-[#151313] px-1.5 py-0.5 rounded uppercase font-mono font-bold shrink-0">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-stone-200 transition-colors"
                >
                  <span>Open Video in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="space-y-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a timestamped study note..."
                    rows={4}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-[#BE94F5] resize-none"
                  />
                  <button
                    onClick={handleAddNote}
                    className="w-full py-2 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-bold rounded-lg transition-colors"
                  >
                    Save Note
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pt-2 border-t border-stone-800">
                  {savedNotes.length === 0 ? (
                    <p className="text-stone-500 italic text-center py-4">No notes added for this lecture yet.</p>
                  ) : (
                    savedNotes.map((n, i) => (
                      <div key={i} className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg space-y-1">
                        <span className="text-[10px] font-mono text-[#BE94F5] bg-[#BE94F5]/10 px-1.5 py-0.5 rounded">
                          {n.time}
                        </span>
                        <p className="text-stone-300 leading-relaxed">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-200 mb-2">Key Video Chapters</h4>
                {video.chapters && video.chapters.length > 0 ? (
                  <div className="space-y-2">
                    {video.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg flex items-center justify-between text-stone-300 hover:border-stone-700 cursor-pointer"
                      >
                        <span className="font-medium text-stone-200">{ch.title}</span>
                        <span className="font-mono text-stone-500 text-[11px]">
                          {Math.floor(ch.timestampSeconds / 60)}:
                          {(ch.timestampSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 italic">No timestamped chapters available for this video stream.</p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Lesson Navigation */}
          <div className="p-3 bg-[#1e1b1b] border-t border-stone-800 flex items-center justify-between text-xs">
            {onPrevLesson ? (
              <button
                onClick={onPrevLesson}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Lesson</span>
              </button>
            ) : <div />}

            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="flex items-center gap-1 text-[#BE94F5] hover:text-[#FCCC42] font-medium transition-colors"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
