import React, { useState } from 'react';
import { AlertCircle, Plus, Bookmark, Trash2, CheckCircle, Tag } from 'lucide-react';
import { MistakeJournalEntry } from '../../types/practice';
import { Select } from '../common/Select';

export const MistakeJournalView: React.FC = () => {
  const [entries, setEntries] = useState<MistakeJournalEntry[]>([
    {
      id: 'm-1',
      problemOrTopicId: 'prob-f1-two-sum-linear',
      title: 'Off-by-One Array Index in Binary Search Boundary',
      category: 'off-by-one',
      failedApproachNotes: 'Used high = len(arr) instead of high = len(arr) - 1, causing IndexError on array bounds access.',
      correctedInsight: 'When high is inclusive (high = len - 1), while loop condition must be low <= high to inspect single-element bounds.',
      createdAt: new Date().toISOString(),
      bookmarkedForReview: true
    }
  ]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'logic' | 'syntax' | 'edge-case' | 'off-by-one' | 'timeout' | 'conceptual'>('logic');
  const [failedApproachNotes, setFailedApproachNotes] = useState('');
  const [correctedInsight, setCorrectedInsight] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEntry = () => {
    if (!title.trim() || !correctedInsight.trim()) return;

    const newEntry: MistakeJournalEntry = {
      id: `m-${Date.now()}`,
      problemOrTopicId: 'custom',
      title,
      category,
      failedApproachNotes,
      correctedInsight,
      createdAt: new Date().toISOString(),
      bookmarkedForReview: true
    };

    setEntries([newEntry, ...entries]);
    setTitle('');
    setFailedApproachNotes('');
    setCorrectedInsight('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white brand-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <AlertCircle className="w-6 h-6 text-[#BE94F5] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-2xl text-white break-words">Learner Mistake Journal</h1>
            <p className="text-stone-400 text-xs leading-relaxed">
              Log failed attempts, classify error patterns, record corrected insights, and eliminate recurring programming bugs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 brand-shadow min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Log New Mistake'}</span>
        </button>
      </div>

      {/* Add New Mistake Form */}
      {isAdding && (
        <div className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white space-y-4 brand-shadow min-w-0">
          <h3 className="font-display font-bold text-base text-stone-100">Log Problem / Concept Mistake</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs min-w-0">
            <div className="space-y-1 min-w-0">
              <label className="text-stone-300 font-medium">Mistake Title</label>
              <input
                type="text"
                placeholder="e.g., Modulo division in negative integers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-[#BE94F5]"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <label className="text-stone-300 font-medium text-xs block">Error Category</label>
              <Select
                value={category}
                onChange={(val) => setCategory(val as any)}
                variant="dark"
                options={[
                  { value: 'logic', label: 'Logical Bug' },
                  { value: 'syntax', label: 'Syntax Error' },
                  { value: 'off-by-one', label: 'Off-by-One Boundary' },
                  { value: 'edge-case', label: 'Unhandled Edge Case' },
                  { value: 'timeout', label: 'Time Limit Exceeded' },
                  { value: 'conceptual', label: 'Conceptual Misunderstanding' },
                ]}
                ariaLabel="Select Error Category"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs min-w-0">
            <label className="text-stone-300 font-medium">Failed Approach Notes</label>
            <textarea
              placeholder="What approach failed or caused the bug?"
              value={failedApproachNotes}
              onChange={(e) => setFailedApproachNotes(e.target.value)}
              rows={3}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-[#BE94F5] resize-none"
            />
          </div>

          <div className="space-y-1 text-xs min-w-0">
            <label className="text-stone-300 font-medium">Corrected Insight & Solution Rule</label>
            <textarea
              placeholder="What is the exact correct rule to remember for future sessions?"
              value={correctedInsight}
              onChange={(e) => setCorrectedInsight(e.target.value)}
              rows={3}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-[#BE94F5] resize-none"
            />
          </div>

          <button
            onClick={handleAddEntry}
            className="w-full py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] rounded-xl text-xs font-bold transition-all brand-shadow min-h-[44px]"
          >
            Save Mistake Entry
          </button>
        </div>
      )}

      {/* Mistake List */}
      <div className="space-y-4 min-w-0">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-[#151313] border border-stone-800 rounded-2xl p-5 text-white space-y-3 brand-shadow min-w-0">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#BE94F5]/20 border border-[#BE94F5]/40 text-[#BE94F5] text-[10px] font-mono uppercase font-bold">
                {entry.category}
              </span>
              <span className="text-stone-500 text-[11px] font-mono">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-display font-bold text-base text-stone-100 break-words">{entry.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 min-w-0">
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 min-w-0">
                <span className="text-stone-400 font-bold">Failed Approach:</span>
                <p className="text-stone-300 leading-relaxed break-words">{entry.failedApproachNotes}</p>
              </div>

              <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 min-w-0">
                <span className="text-emerald-400 font-bold">Corrected Insight:</span>
                <p className="text-stone-200 leading-relaxed break-words">{entry.correctedInsight}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
