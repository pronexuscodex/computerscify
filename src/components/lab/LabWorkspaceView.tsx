import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Clock,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  Code,
  BookOpen,
  Layers,
  FileCode,
  Filter,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { InteractiveLabDefinition, LabLevel, LabLanguage, LabPracticeMode } from '../../types/curriculum';
import { runCodeByLanguage, ExecutionResult } from '../../services/codeRunner';
import { saveLabDraft, getLabDraft } from '../../services/storage';
import { ALL_LAB_EXERCISES, LAB_PATHS } from '../../data/labExercisesData';
import { Tooltip } from '../common/Tooltip';
import { Select, SelectOptionItem } from '../common/Select';
import { CodeEditor } from '../common/CodeEditor';

interface LabWorkspaceViewProps {
  lab?: InteractiveLabDefinition;
  onCompleteLab?: () => void;
}

export const LabWorkspaceView: React.FC<LabWorkspaceViewProps> = ({
  lab: initialLab,
  onCompleteLab,
}) => {
  const [selectedLab, setSelectedLab] = useState<InteractiveLabDefinition>(
    initialLab || ALL_LAB_EXERCISES[0]
  );

  const [code, setCode] = useState<string>(selectedLab.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'hints'>('console');
  
  // Filter states
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');

  // Hint state
  const [visibleHintIndex, setVisibleHintIndex] = useState<number>(-1);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);

  // Update when prop or selection changes
  useEffect(() => {
    if (initialLab) setSelectedLab(initialLab);
  }, [initialLab]);

  // Load saved draft when lab ID changes
  useEffect(() => {
    let isMounted = true;
    getLabDraft(selectedLab.id).then((saved) => {
      if (!isMounted) return;
      if (saved) setCode(saved);
      else setCode(selectedLab.starterCode);
    });
    setResult(null);
    setVisibleHintIndex(-1);
    return () => {
      isMounted = false;
    };
  }, [selectedLab]);

  // Handle Code Change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    saveLabDraft(selectedLab.id, val);
  };

  // Run Code
  const handleRun = async () => {
    setIsRunning(true);
    const lang = selectedLab.language || 'python';
    const execRes = await runCodeByLanguage(lang, code, selectedLab.testCases);
    setResult(execRes);
    setIsRunning(false);

    if (execRes.testCaseResults?.every((tc) => tc.passed) && onCompleteLab) {
      onCompleteLab();
    }
  };

  // Reset Starter Code
  const handleReset = () => {
    setCode(selectedLab.starterCode);
    saveLabDraft(selectedLab.id, selectedLab.starterCode);
    setResult(null);
    setVisibleHintIndex(-1);
  };

  // Filter exercises
  const filteredExercises = ALL_LAB_EXERCISES.filter((ex) => {
    if (filterLevel !== 'all' && ex.level !== filterLevel) return false;
    if (filterLang !== 'all' && ex.language !== filterLang) return false;
    return true;
  });

  // Calculate line numbers
  const lineCount = code.split('\n').length;
  const lineNumbersArray = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div
      className={`flex flex-col bg-[#151313] text-[#F7F7F5] transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen p-0'
          : 'relative rounded-2xl border border-stone-800 brand-shadow-lg overflow-hidden min-h-[680px]'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-[#1e1b1b] border-b border-stone-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Title & Exercise Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[#BE94F5] text-[#151313] font-bold shrink-0">
            <Terminal className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1 max-w-md">
            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={selectedLab.id}
                onChange={(val) => {
                  const found = ALL_LAB_EXERCISES.find((ex) => ex.id === val);
                  if (found) setSelectedLab(found);
                }}
                options={filteredExercises.map((ex) => ({
                  value: ex.id,
                  label: ex.title,
                  description: ex.language ? `${ex.language.toUpperCase()} · ${ex.practiceMode || 'guided'}` : undefined,
                }))}
                ariaLabel="Select exercise"
              />

              <span className="px-2 py-0.5 rounded-md bg-[#BE94F5]/20 border border-[#BE94F5]/40 text-[#BE94F5] font-mono text-[10px] uppercase font-bold shrink-0">
                {selectedLab.level?.replace('level-', 'L') || 'L1'}
              </span>

              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-[10px] uppercase font-bold hidden sm:inline shrink-0">
                {selectedLab.practiceMode || 'guided-lesson'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1 truncate hidden md:block">
              {selectedLab.objective || selectedLab.instructions}
            </p>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Size controls */}
          <div className="hidden sm:flex items-center bg-stone-900 border border-stone-800 px-2 py-1 rounded-xl text-xs min-h-[38px]">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="px-1.5 text-stone-400 hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="font-mono text-[11px] text-stone-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(18, s + 1))}
              className="px-1.5 text-stone-400 hover:text-white"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <Tooltip content="Reset starter code" position="bottom">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </Tooltip>

          <Tooltip content="Run code in sandbox" shortcut="Ctrl+Enter" position="bottom">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-xl bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[38px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} position="bottom">
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Exercise Filter Toolbar */}
      <div className="bg-[#191717] border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center gap-3 text-xs text-stone-300">
        <span className="flex items-center gap-1 font-bold text-stone-400 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#BE94F5]" /> Filter Path:
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={filterLevel}
            onChange={(val) => setFilterLevel(val)}
            options={[
              { value: 'all', label: 'All Levels' },
              { value: 'level-0', label: 'Level 0 · First Interaction', description: 'Run code & syntax error basics' },
              { value: 'level-1', label: 'Level 1 · Beginner', description: 'Variables, loops & functions' },
              { value: 'level-2', label: 'Level 2 · Developing', description: 'Collections, recursion & complexity' },
              { value: 'level-3', label: 'Level 3 · Intermediate', description: 'OOP, functional & SQL joins' },
              { value: 'level-4', label: 'Level 4 · Advanced', description: 'Dynamic programming & algorithms' },
              { value: 'level-5', label: 'Level 5 · Professional', description: 'Multi-file simulations & TDD' },
            ]}
            label=""
            placeholder="Select Level"
            ariaLabel="Filter by Level"
          />

          <Select
            value={filterLang}
            onChange={(val) => setFilterLang(val)}
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'c', label: 'C / C++' },
              { value: 'sql', label: 'SQL' },
            ]}
            label=""
            placeholder="Select Language"
            ariaLabel="Filter by Language"
          />

          {(filterLevel !== 'all' || filterLang !== 'all') && (
            <button
              onClick={() => {
                setFilterLevel('all');
                setFilterLang('all');
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#BE94F5] font-bold text-[11px] transition-colors border border-stone-700"
            >
              Reset filters
            </button>
          )}
        </div>

        <span className="ml-auto font-mono text-[11px] text-stone-400 shrink-0">
          Showing {filteredExercises.length} Exercises
        </span>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 divide-y lg:divide-y-0 lg:divide-x divide-stone-800 min-h-[520px] min-w-0">
        {/* Left Column: Instructions & Code Editor */}
        <div className="flex flex-col bg-stone-950 p-4 min-h-[380px] min-w-0">
          {/* Instructions Box */}
          <div className="mb-3 bg-[#1e1b1b] border border-stone-800 rounded-xl p-3 text-xs leading-relaxed min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#BE94F5] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Instructions
              </span>
              <button
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                className="text-[11px] text-stone-400 hover:text-stone-200 underline"
              >
                {isInstructionsOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {isInstructionsOpen && (
              <p className="text-stone-300 whitespace-pre-line break-words">{selectedLab.instructions}</p>
            )}
          </div>

          {/* IDE Editor Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <CodeEditor
              value={code}
              onChange={(val) => {
                setCode(val);
                saveLabDraft(selectedLab.id, val);
              }}
              language={selectedLab.language}
              onReset={() => {
                setCode(selectedLab.starterCode);
                setResult(null);
                saveLabDraft(selectedLab.id, selectedLab.starterCode);
              }}
              testResults={
                isRunning
                  ? { isRunning: true, passed: false }
                  : result
                  ? {
                      passed: result.testCaseResults ? result.testCaseResults.every((tc) => tc.passed) : !result.stderr,
                      totalTests: result.testCaseResults?.length || 0,
                      passedTests: result.testCaseResults?.filter((tc) => tc.passed).length || 0,
                      executionTimeMs: result.executionTimeMs,
                    }
                  : null
              }
              minHeight="350px"
              maxHeight="550px"
              ariaLabel={`Lab editor for ${selectedLab.title}`}
            />
          </div>
        </div>

        {/* Right Column: Console & Test Output */}
        <div className="p-4 bg-stone-950 flex flex-col font-mono text-xs text-stone-200 min-h-[380px] min-w-0">
          {/* Tabs header */}
          <div className="flex items-center gap-2 mb-3 border-b border-stone-800 pb-2 flex-wrap">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'console'
                  ? 'bg-[#BE94F5] text-[#151313]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Output Console
            </button>

            {selectedLab.testCases && selectedLab.testCases.length > 0 && (
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'tests'
                    ? 'bg-[#BE94F5] text-[#151313]'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Test Suite ({selectedLab.testCases.length})
              </button>
            )}

            {selectedLab.hints && selectedLab.hints.length > 0 && (
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'hints'
                    ? 'bg-[#BE94F5] text-[#151313]'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Hints ({selectedLab.hints.length})
              </button>
            )}

            {result && (
              <span className="ml-auto text-[10px] text-stone-500 font-mono">
                {result.executionTimeMs} ms
              </span>
            )}
          </div>

          {/* Console Tab */}
          {activeTab === 'console' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#151313] rounded-xl border border-stone-800 min-h-[280px] min-w-0">
              {isRunning ? (
                <div className="text-amber-400 animate-pulse flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[#BE94F5]" /> Executing {selectedLab.language?.toUpperCase() || 'Python'} runtime engine...
                </div>
              ) : result ? (
                <div className="space-y-3 min-w-0">
                  {result.stdout && (
                    <div className="min-w-0">
                      <div className="text-[#82E0AA] font-bold text-[10px] uppercase tracking-wider mb-1">
                        stdout
                      </div>
                      <pre className="whitespace-pre-wrap text-stone-200 text-xs bg-stone-900/60 p-3 rounded-lg border border-stone-800 break-words">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {result.stderr && (
                    <div className="min-w-0">
                      <div className="text-amber-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                        stderr / diagnostic exception
                      </div>
                      <pre className="whitespace-pre-wrap text-amber-200 text-xs bg-amber-950/20 p-3 rounded-lg border border-amber-500/30 break-words">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-stone-500 italic py-12 text-center">
                  Click "Run Code" to execute the program and view output console logs.
                </div>
              )}
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#151313] rounded-xl border border-stone-800 space-y-3 min-h-[280px] min-w-0">
              {result?.testCaseResults ? (
                result.testCaseResults.map((tc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all min-w-0 ${
                      tc.passed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#FCCC42]/10 border-[#FCCC42]/40 text-[#FCCC42]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="font-bold flex items-center gap-1.5 text-xs truncate">
                        {tc.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#FCCC42] shrink-0" />)}
                        <span className="truncate">{tc.description}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase shrink-0">
                        {tc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 font-mono mt-1 space-y-0.5 break-words">
                      <div>Expected: {tc.expected}</div>
                      <div>Actual: {tc.actual}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-stone-500 italic py-12 text-center">
                  Execute code to evaluate against automated test cases.
                </div>
              )}
            </div>
          )}

          {/* Hints Tab */}
          {activeTab === 'hints' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#151313] rounded-xl border border-stone-800 space-y-3 min-h-[280px] min-w-0">
              <h4 className="font-bold text-xs text-stone-200 mb-2">Progressive Hints</h4>
              {selectedLab.hints?.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 space-y-1 min-w-0"
                >
                  <div className="font-bold text-[#BE94F5] text-[11px]">Hint {idx + 1}</div>
                  <p className="break-words">{hint}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
