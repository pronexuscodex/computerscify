import React, { useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
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
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <AlertCircle className="w-6 h-6 text-[#000000] dark:text-[#F2C94C] shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-[#000000] dark:text-[#F6EFEF] break-words">Learner Mistake Journal</h1>
            <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-xs font-bold leading-relaxed">
              Log failed attempts, classify error patterns, record corrected insights, and eliminate recurring programming bugs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Log New Mistake'}</span>
        </button>
      </div>

      {/* Add New Mistake Form */}
      {isAdding && (
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4 min-w-0">
          <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF]">Log Problem / Concept Mistake</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs min-w-0 font-bold">
            <div className="space-y-1 min-w-0">
              <label className="uppercase tracking-wider">Mistake Title</label>
              <input
                type="text"
                placeholder="e.g., Modulo division in negative integers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded p-2.5 text-[#000000] dark:text-[#F6EFEF] focus:outline-none focus:ring-2 focus:ring-[#F2C94C] font-black"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <label className="uppercase tracking-wider block">Error Category</label>
              <Select
                value={category}
                onChange={(val) => setCategory(val as any)}
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

          <div className="space-y-1 text-xs min-w-0 font-bold">
            <label className="uppercase tracking-wider">Failed Approach Notes</label>
            <textarea
              placeholder="What approach failed or caused the bug?"
              value={failedApproachNotes}
              onChange={(e) => setFailedApproachNotes(e.target.value)}
              rows={3}
              className="w-full bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded p-3 text-[#000000] dark:text-[#F6EFEF] focus:outline-none focus:ring-2 focus:ring-[#F2C94C] resize-none font-bold"
            />
          </div>

          <div className="space-y-1 text-xs min-w-0 font-bold">
            <label className="uppercase tracking-wider">Corrected Insight & Solution Rule</label>
            <textarea
              placeholder="What is the exact correct rule to remember for future sessions?"
              value={correctedInsight}
              onChange={(e) => setCorrectedInsight(e.target.value)}
              rows={3}
              className="w-full bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded p-3 text-[#000000] dark:text-[#F6EFEF] focus:outline-none focus:ring-2 focus:ring-[#F2C94C] resize-none font-bold"
            />
          </div>

          <button
            onClick={handleAddEntry}
            className="w-full py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded font-black text-xs uppercase tracking-wider transition-all min-h-[44px]"
          >
            Save Mistake Entry
          </button>
        </div>
      )}

      {/* Mistake List */}
      <div className="space-y-4 min-w-0">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#000000] text-[#FFFFFF] text-[10px] font-mono uppercase font-black border border-[#000000]">
                {entry.category}
              </span>
              <span className="text-[#000000]/60 dark:text-[#F6EFEF]/60 text-[11px] font-mono font-bold">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF] break-words">{entry.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 min-w-0">
              <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1 min-w-0 font-bold">
                <span className="uppercase text-[#000000] dark:text-[#F2C94C]">Failed Approach:</span>
                <p className="leading-relaxed break-words">{entry.failedApproachNotes}</p>
              </div>

              <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1 min-w-0 font-bold">
                <span className="uppercase text-[#82E0AA]">Corrected Insight:</span>
                <p className="leading-relaxed break-words">{entry.correctedInsight}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
