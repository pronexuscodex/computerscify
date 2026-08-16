import React, { useEffect, useState } from 'react';
import { Settings, Save, Trash2, Download, Shield, CheckCircle2, CloudDownload, FileText, Wrench, ExternalLink } from 'lucide-react';
import { LearnerProgress } from '../../types/curriculum';
import { clearAllLocalData } from '../../services/storage';
import { clearAllOfflineResources, formatBytes, getOfflineStorageStats } from '../../services/offlineResourceCache';
import { formatViewURL } from '../../utils/routes';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { Dialog } from '../common';

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
  const [showClearOfflineConfirm, setShowClearOfflineConfirm] = useState(false);
  const [offlineStats, setOfflineStats] = useState<{ count: number; totalBytes: number }>({ count: 0, totalBytes: 0 });

  useEffect(() => {
    getOfflineStorageStats().then(setOfflineStats);
  }, []);

  const handleSave = () => {
    const updated: LearnerProgress = {
      ...progress,
      displayName,
      fontSize,
      reducedMotion,
    };
    onUpdateProgress(updated);
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

  const handleClearOfflineFiles = async () => {
    await clearAllOfflineResources();
    setOfflineStats({ count: 0, totalBytes: 0 });
    setShowClearOfflineConfirm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Header */}
      <div className="border-b-4 border-[#000000] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#000000] text-[#FFFFFF] text-xs font-black font-mono uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5 text-[#F2C94C]" />
          Local-First Settings
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#000000] dark:text-[#F6EFEF] uppercase tracking-tight">
          Local Preferences
        </h1>
        <p className="text-sm text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold mt-1">
          ComputerSciFy runs local-first without tracking or accounts. All data remains in your browser IndexedDB.
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-6">
        {/* Theme Preference Selection */}
        <ThemeSwitcher variant="card" />


        {/* Display Name */}
        <div className="space-y-2 pt-4 border-t-2 border-[#000000]">
          <label className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF]">
            Learner Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] border-2 border-[#000000] rounded text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#F2C94C] neo-shadow-sm min-h-[44px]"
          />
        </div>

        {/* Font Size */}
        <div className="space-y-2 pt-4 border-t-2 border-[#000000]">
          <label className="text-xs font-black uppercase tracking-wider text-[#000000] dark:text-[#F6EFEF]">
            Reading Font Size
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-4 py-2 rounded text-xs font-black uppercase border-2 border-[#000000] min-h-[44px] transition-all ${
                fontSize === 'normal' ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm' : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
              }`}
            >
              Normal (16px)
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-4 py-2 rounded text-xs font-black uppercase border-2 border-[#000000] min-h-[44px] transition-all ${
                fontSize === 'large' ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm' : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
              }`}
            >
              Large Accessibility (18px)
            </button>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="pt-4 border-t-2 border-[#000000]">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={e => setReducedMotion(e.target.checked)}
              className="w-4 h-4 accent-[#F2C94C]"
            />
            <span className="text-xs font-black uppercase text-[#000000] dark:text-[#F6EFEF]">
              Enable Reduced Motion UI Transitions
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t-2 border-[#000000] flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
          {isSaved && (
            <span className="text-xs font-black text-[#82E0AA] flex items-center gap-1 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
        </div>
      </div>

      {/* Offline Content Section */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4">
        <h2 className="font-display font-black text-lg uppercase flex items-center gap-2 text-[#000000] dark:text-[#F6EFEF]">
          <CloudDownload className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Offline Content
        </h2>
        <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 font-bold leading-relaxed">
          Books and research papers you save for offline reading are stored as files in your browser's IndexedDB, the
          same local-first storage used for your progress. Use the "Save Offline" button on any reading, or
          "Save Readings Offline" on a module page, to download it.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="px-3 py-2 rounded bg-[#DFD9D8] dark:bg-stone-800 text-[#000000] dark:text-[#F6EFEF] text-xs font-black border-2 border-[#000000] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> {offlineStats.count} file{offlineStats.count === 1 ? '' : 's'} saved
          </span>
          <span className="px-3 py-2 rounded bg-[#DFD9D8] dark:bg-stone-800 text-[#000000] dark:text-[#F6EFEF] text-xs font-black border-2 border-[#000000]">
            {formatBytes(offlineStats.totalBytes)} used
          </span>
          {offlineStats.count > 0 && (
            <button
              onClick={() => setShowClearOfflineConfirm(true)}
              className="px-4 py-2.5 bg-[#FFDAD6] text-[#000000] hover:bg-red-300 border-2 border-[#000000] rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" /> Clear Offline Files
            </button>
          )}
        </div>
      </div>

      {/* Data Backup & Clear Section */}
      <div className="bg-[#F2C94C] text-[#000000] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4">
        <h2 className="font-display font-black text-lg uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#000000]" /> Local Data Backup & Reset
        </h2>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 bg-[#000000] text-[#FFFFFF] hover:bg-stone-800 border-2 border-[#000000] rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
          >
            <Download className="w-4 h-4" /> Export Progress Backup (JSON)
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2.5 bg-[#FFDAD6] text-[#000000] hover:bg-red-300 border-2 border-[#000000] rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" /> Reset Local Data
          </button>
        </div>
      </div>

      {/* Internal Tools — deliberately not in the main sidebar (see NavigationRail.tsx); these are
          verification dashboards, not learner-facing features, but stay reachable here for anyone
          checking resource health or curriculum integrity. */}
      <div className="border-t-2 border-dashed border-[#000000]/20 dark:border-white/15 pt-6 space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#000000]/50 dark:text-[#F6EFEF]/40 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5" /> Internal Tools
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`#${formatViewURL(progress.selectedProgram, 'resource-health')}`}
            className="px-3 py-2 text-xs font-bold text-[#000000]/70 dark:text-[#F6EFEF]/60 border border-[#000000]/20 dark:border-white/15 rounded hover:bg-[#FEF8F7] dark:hover:bg-[#2B2929] flex items-center gap-1.5"
          >
            Resource Health Dashboard <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="#/audit"
            className="px-3 py-2 text-xs font-bold text-[#000000]/70 dark:text-[#F6EFEF]/60 border border-[#000000]/20 dark:border-white/15 rounded hover:bg-[#FEF8F7] dark:hover:bg-[#2B2929] flex items-center gap-1.5"
          >
            Curriculum Audit <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <Dialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Confirm Reset All Local Progress?"
        description="This will erase all local topic completion history, notes, and code drafts stored in IndexedDB. This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-4 py-2 bg-[#FEF8F7] text-[#000000] border-2 border-[#000000] rounded text-xs font-black uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-[#FFDAD6] text-[#000000] border-2 border-[#000000] rounded text-xs font-black uppercase"
            >
              Yes, Reset All Data
            </button>
          </>
        }
      >
        <p className="text-xs text-[#000000] dark:text-[#F6EFEF] leading-relaxed font-bold">
          Are you sure you want to proceed? All your offline activity, quiz results, and topic progress will be erased from local storage.
        </p>
      </Dialog>

      {/* Clear Offline Files Confirmation Dialog */}
      <Dialog
        isOpen={showClearOfflineConfirm}
        onClose={() => setShowClearOfflineConfirm(false)}
        title="Clear All Offline Files?"
        description="This deletes every book and research paper you've saved for offline reading. Your progress, notes, and bookmarks are not affected — you can download any of them again later."
        footer={
          <>
            <button
              onClick={() => setShowClearOfflineConfirm(false)}
              className="px-4 py-2 bg-[#FEF8F7] text-[#000000] border-2 border-[#000000] rounded text-xs font-black uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleClearOfflineFiles}
              className="px-4 py-2 bg-[#FFDAD6] text-[#000000] border-2 border-[#000000] rounded text-xs font-black uppercase"
            >
              Yes, Clear Offline Files
            </button>
          </>
        }
      >
        <p className="text-xs text-[#000000] dark:text-[#F6EFEF] leading-relaxed font-bold">
          {offlineStats.count} file{offlineStats.count === 1 ? '' : 's'} ({formatBytes(offlineStats.totalBytes)}) will be removed from local storage.
        </p>
      </Dialog>
    </div>
  );
};
