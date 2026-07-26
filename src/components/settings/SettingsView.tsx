import React, { useState } from 'react';
import { Settings, Save, Trash2, Download, Upload, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';
import { saveLearnerProgress, clearAllLocalData } from '../../services/storage';

interface SettingsViewProps {
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [displayName, setDisplayName] = useState(progress.displayName);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>(progress.fontSize);
  const [reducedMotion, setReducedMotion] = useState(progress.reducedMotion);
  const [isSaved, setIsSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  React.useEffect(() => {
    if (!showClearConfirm) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowClearConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showClearConfirm]);

  const handleSave = () => {
    const updated: LearnerProgress = {
      ...progress,
      displayName,
      fontSize,
      reducedMotion,
    };
    onUpdateProgress(updated);
    saveLearnerProgress(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `computerfy_progress_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearData = async () => {
    await clearAllLocalData();
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#151313]">
      {/* Header */}
      <div className="border-b border-[#151313] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono mb-2">
          <Settings className="w-3.5 h-3.5 text-[#FCCC42]" />
          Local-First Settings
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#151313] tracking-tight">
          Local Preferences
        </h1>
        <p className="text-sm text-[#151313]/70 font-medium mt-1">
          ComputerSciFy runs local-first without tracking or accounts. All data remains in your browser IndexedDB.
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 md:p-8 space-y-6">
        {/* Display Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#151313]">
            Learner Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-[#F7F7F5] text-[#151313] border border-[#151313] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#BE94F5] brand-shadow-sm min-h-[44px]"
          />
        </div>

        {/* Font Size */}
        <div className="space-y-2 pt-4 border-t border-[#151313]/10">
          <label className="text-xs font-bold uppercase tracking-wider text-[#151313]">
            Reading Font Size
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border border-[#151313] transition-all min-h-[44px] ${
                fontSize === 'normal'
                  ? 'bg-[#BE94F5] text-[#151313] brand-shadow-sm'
                  : 'bg-[#F7F7F5] text-[#151313]/70'
              }`}
            >
              Normal (16px)
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border border-[#151313] transition-all min-h-[44px] ${
                fontSize === 'large'
                  ? 'bg-[#BE94F5] text-[#151313] brand-shadow-sm'
                  : 'bg-[#F7F7F5] text-[#151313]/70'
              }`}
            >
              Large Accessibility (18px)
            </button>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="pt-4 border-t border-[#151313]/10">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={e => setReducedMotion(e.target.checked)}
              className="w-4 h-4 accent-[#BE94F5]"
            />
            <span className="text-xs font-bold text-[#151313]">Enable Reduced Motion UI Transitions</span>
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-[#151313]/10 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#151313] text-[#F7F7F5] font-bold text-xs hover:bg-[#BE94F5] hover:text-[#151313] transition-all brand-shadow-sm flex items-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
          {isSaved && (
            <span className="text-xs font-bold text-[#82E0AA] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
        </div>
      </div>

      {/* Data Backup & Clear Section */}
      <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="font-display font-bold text-lg text-[#151313] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#82E0AA]" /> Local Data Backup & Clear
        </h2>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-[#BE94F5] text-[#151313] border border-[#151313] font-bold text-xs hover:bg-[#FCCC42] transition-all brand-shadow-sm flex items-center gap-2 min-h-[44px]"
          >
            <Download className="w-4 h-4" /> Export Progress Backup (JSON)
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-xl bg-[#FCCC42]/40 text-[#151313] border border-[#151313] font-bold text-xs hover:bg-[#FCCC42] transition-all brand-shadow-sm flex items-center gap-2 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 text-[#151313]" /> Reset Local Data
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div
          onClick={() => setShowClearConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151313]/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 max-w-md w-full space-y-4 border-2 border-[#151313]"
          >
            <h3 className="font-display font-bold text-lg text-[#151313]">
              Confirm Reset All Local Progress?
            </h3>
            <p className="text-xs text-[#151313]/80 font-medium leading-relaxed">
              This will erase all local topic completion history, notes, and code drafts stored in IndexedDB. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-[#151313] bg-[#F7F7F5] hover:bg-stone-100 text-xs font-bold min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="px-5 py-2.5 rounded-xl bg-[#151313] text-[#F7F7F5] hover:bg-[#BE94F5] hover:text-[#151313] border border-[#151313] text-xs font-bold min-h-[44px] shadow-sm transition-colors"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
