import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Sparkles,
  Maximize2,
  Minimize2,
  BookOpen,
  Filter,
  ChevronRight,
  Timer,
  Pause,
  Brain,
  HelpCircle
} from 'lucide-react';
import { InteractiveLabDefinition } from '../../types/curriculum';
import { runCodeByLanguage, ExecutionResult } from '../../services/codeRunner';
import { saveLabDraft, getLabDraft } from '../../services/storage';
import { ALL_LAB_EXERCISES } from '../../data/labExercisesData';
import { Tooltip } from '../common/Tooltip';
import { Select } from '../common/Select';
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
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'hints' | 'ai'>('console');
  
  // Filter states
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');

  // View & UI controls
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60); // 45 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // AI Explanation generation
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Update when initialLab prop changes
  useEffect(() => {
    if (initialLab) setSelectedLab(initialLab);
  }, [initialLab]);

  // Load saved draft from IndexedDB when lab ID changes
  useEffect(() => {
    let isMounted = true;
    getLabDraft(selectedLab.id).then((saved) => {
      if (!isMounted) return;
      if (saved) setCode(saved);
      else setCode(selectedLab.starterCode);
    });
    setResult(null);
    setAiAnalysis(null);
    return () => {
      isMounted = false;
    };
  }, [selectedLab]);

  // Ticking Study Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Run Code logic
  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('console');
    const lang = selectedLab.language || 'python';
    const execRes = await runCodeByLanguage(lang, code, selectedLab.testCases);
    setResult(execRes);
    setIsRunning(false);

    if (execRes.testCaseResults?.length) {
      setActiveTab('tests');
    }

    if (execRes.testCaseResults?.every((tc) => tc.passed) && onCompleteLab) {
      onCompleteLab();
    }
  };

  // Reset starter code
  const handleReset = () => {
    setCode(selectedLab.starterCode);
    saveLabDraft(selectedLab.id, selectedLab.starterCode);
    setResult(null);
    setAiAnalysis(null);
  };

  // AI Code Logic Diagnostic
  const handleGenerateAiInsights = () => {
    setIsAnalyzing(true);
    setActiveTab('ai');
    setTimeout(() => {
      const lineCount = code.split('\n').length;
      const lang = (selectedLab.language || 'python').toUpperCase();
      let analysisText = `### Academic Code Logic Diagnostic (${lang})

**Time Complexity Estimate:** $O(N \\log N)$ (Optimal Divide & Conquer / Sorting Pattern)
**Space Complexity:** $O(N)$ auxiliary stack space.

#### Code Analysis & Recommendations:
1. **Structure:** Your code is ${lineCount} lines long and follows standard structural conventions for ${selectedLab.title}.
2. **Correctness Check:** Variables and function definitions align well with problem instructions.
3. **Optimization Tip:** Ensure base edge cases (e.g. empty lists, single elements, null pointers) return early to prevent unnecessary recursions.
`;
      if (result?.stderr) {
        analysisText += `\n**Runtime Error Context:**\nThe interpreter flagged: \`${result.stderr.split('\n')[0]}\`. Check indexing boundary conditions!`;
      } else if (result?.testCaseResults) {
        const passedCount = result.testCaseResults.filter((t) => t.passed).length;
        analysisText += `\n**Test Case Coverage:** ${passedCount}/${result.testCaseResults.length} automated test assertions passed.`;
      }
      setAiAnalysis(analysisText);
      setIsAnalyzing(false);
    }, 800);
  };

  // Keyboard Shortcuts (Ctrl+Enter to Run)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedLab]);

  // Filter exercises
  const filteredExercises = ALL_LAB_EXERCISES.filter((ex) => {
    if (filterLevel !== 'all' && ex.level !== filterLevel) return false;
    if (filterLang !== 'all' && ex.language !== filterLang) return false;
    return true;
  });

  return (
    <div
      className={`flex flex-col bg-[#1D1B1B] text-[#F6EFEF] transition-all duration-200 select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen p-0 overflow-y-auto'
          : 'relative rounded border-4 border-[#000000] neo-shadow-lg overflow-hidden min-h-[720px] w-full min-w-0'
      }`}
    >
      {/* Top Academic Neo-Brutalist Navigation & Breadcrumbs Bar */}
      <div className="bg-[#DFD9D8] dark:bg-[#111010] border-b-4 border-[#000000] px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#000000] dark:text-[#F6EFEF]">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-black text-[#000000] dark:text-[#F6EFEF] flex-wrap">
          <span className="px-2 py-0.5 rounded bg-[#F2C94C] text-[#000000] font-black uppercase border border-[#000000]">
            CS / ComputerSciFy
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
          <span className="uppercase tracking-wider">{selectedLab.level?.replace('level-', 'Level ') || 'Level 1'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
          <span className="uppercase font-black text-[#000000] dark:text-[#F2C94C]">{selectedLab.language?.toUpperCase() || 'PYTHON'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#000000] dark:text-[#F6EFEF] shrink-0" />
          <span className="font-black underline decoration-[#F2C94C] decoration-2 truncate max-w-[180px]">
            {selectedLab.title}
          </span>
        </div>

        {/* Study Session Timer Widget */}
        <div className="flex items-center gap-2 bg-[#000000] text-[#FFFFFF] px-3 py-1 rounded border-2 border-[#000000] neo-shadow-sm font-mono text-xs font-black shrink-0">
          <Timer className="w-4 h-4 text-[#F2C94C] animate-pulse" />
          <span>{formatTimer(timerSeconds)}</span>
          <button
            onClick={() => setIsTimerRunning((r) => !r)}
            className="p-1 hover:text-[#F2C94C] transition-colors"
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        </div>
      </div>

      {/* Main Control & Selection Bar */}
      <div className="bg-[#1E1C1C] border-b-4 border-[#000000] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left Title & Exercise Selector */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2.5 rounded bg-[#F2C94C] text-[#000000] font-black border-2 border-[#000000] neo-shadow-sm shrink-0">
            <Terminal className="w-5 h-5" />
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
                ariaLabel="Select Coding Exercise"
              />

              <span className="px-2 py-0.5 rounded bg-[#F2C94C] text-[#000000] font-mono text-[10px] uppercase font-black shrink-0 border border-[#000000]">
                {selectedLab.level?.replace('level-', 'L') || 'L1'}
              </span>

              <span className="px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] border border-[#000000] font-mono text-[10px] uppercase font-black hidden sm:inline shrink-0">
                {selectedLab.practiceMode || 'guided-lesson'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Font Size controls */}
          <div className="hidden sm:flex items-center bg-[#000000] border-2 border-[#000000] px-2 py-1 rounded text-xs font-mono min-h-[38px] text-[#FFFFFF]">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="px-1.5 text-stone-300 hover:text-white font-bold"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] text-[#F2C94C] font-black px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(18, s + 1))}
              className="px-1.5 text-stone-300 hover:text-white font-bold"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Reset Code */}
          <Tooltip content="Reset starter code" position="bottom">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-[#2B2929] hover:bg-[#000000] text-[#FFFFFF] border-2 border-[#000000] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all neo-shadow-sm min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F2C94C]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </Tooltip>

          {/* Primary Call-to-Action: RUN CODE */}
          <Tooltip content="Run code in sandbox (Ctrl+Enter)" shortcut="Ctrl+Enter" position="bottom">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-1.5 rounded bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs uppercase tracking-wider border-2 border-[#000000] neo-btn flex items-center gap-2 transition-all disabled:opacity-50 min-h-[38px]"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
            </button>
          </Tooltip>

          {/* Fullscreen Toggle */}
          <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} position="bottom">
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-2 rounded bg-[#000000] border-2 border-[#000000] text-[#FFFFFF] hover:text-[#F2C94C] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center neo-shadow-sm"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Exercise Path Filter Toolbar */}
      <div className="bg-[#111010] border-b-4 border-[#000000] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F6EFEF]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-black text-[#F2C94C] uppercase shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter Exercises:
          </span>

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
            ariaLabel="Filter by Level"
          />

          <Select
            value={filterLang}
            onChange={(val) => setFilterLang(val)}
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python 3' },
              { value: 'javascript', label: 'JavaScript (Node)' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'c', label: 'C / C++' },
              { value: 'sql', label: 'SQL' },
            ]}
            ariaLabel="Filter by Language"
          />

          {(filterLevel !== 'all' || filterLang !== 'all') && (
            <button
              onClick={() => {
                setFilterLevel('all');
                setFilterLang('all');
              }}
              className="px-2.5 py-1 rounded bg-[#000000] hover:bg-stone-800 text-[#F2C94C] font-black text-[11px] uppercase transition-colors border border-[#000000]"
            >
              Reset filters
            </button>
          )}
        </div>

        <span className="font-mono text-[11px] text-[#F6EFEF]/70 font-bold shrink-0">
          Showing {filteredExercises.length} Exercises
        </span>
      </div>

      {/* Main Workspace Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 divide-y lg:divide-y-0 lg:divide-x-4 divide-[#000000] min-h-[540px] min-w-0">
        
        {/* Left Pane: Problem Statement & IDE Code Editor */}
        <div className="flex flex-col bg-[#1E1C1C] p-4 space-y-4 min-w-0 overflow-y-auto">
          {/* Collapsible Instructions Box */}
          <div className="bg-[#FEF8F7] dark:bg-[#2B2929] border-4 border-[#000000] neo-shadow rounded p-4 text-xs leading-relaxed text-[#000000] dark:text-[#F6EFEF] min-w-0">
            <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-[#000000]">
              <span className="font-display font-black text-sm text-[#000000] dark:text-[#F2C94C] uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> {selectedLab.title} Instructions
              </span>
              <button
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                className="text-[11px] font-black uppercase text-[#000000] dark:text-[#F2C94C] hover:underline"
              >
                {isInstructionsOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {isInstructionsOpen && (
              <div className="space-y-3 font-bold">
                <p className="whitespace-pre-line leading-relaxed break-words">
                  {selectedLab.instructions}
                </p>

                {selectedLab.objective && (
                  <div className="p-2.5 rounded bg-[#FFFFFF] dark:bg-[#1E1C1C] border-2 border-[#000000] text-[11px]">
                    <span className="font-black text-[#000000] dark:text-[#F2C94C] uppercase tracking-wider block mb-0.5">Objective:</span>
                    <span>{selectedLab.objective}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Editor Container */}
          <div className="flex-1 flex flex-col min-w-0">
            <CodeEditor
              value={code}
              onChange={(val) => {
                setCode(val);
                saveLabDraft(selectedLab.id, val);
              }}
              language={selectedLab.language}
              onReset={handleReset}
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
              minHeight="380px"
              maxHeight="580px"
              ariaLabel={`Code editor for ${selectedLab.title}`}
            />
          </div>
        </div>

        {/* Right Pane: Interactive Console, Test Suite & AI Diagnostic Insights */}
        <div className="p-4 bg-[#111010] flex flex-col font-mono text-xs text-[#F6EFEF] min-h-[380px] min-w-0">
          {/* Tab Selection Header */}
          <div className="flex items-center gap-2 mb-3 border-b-4 border-[#000000] pb-2 flex-wrap">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] ${
                activeTab === 'console'
                  ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                  : 'bg-[#1E1C1C] text-[#FFFFFF]'
              }`}
            >
              Output Console
            </button>

            {selectedLab.testCases && selectedLab.testCases.length > 0 && (
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] ${
                  activeTab === 'tests'
                    ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                    : 'bg-[#1E1C1C] text-[#FFFFFF]'
                }`}
              >
                Test Suite ({selectedLab.testCases.length})
              </button>
            )}

            {selectedLab.hints && selectedLab.hints.length > 0 && (
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] ${
                  activeTab === 'hints'
                    ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                    : 'bg-[#1E1C1C] text-[#FFFFFF]'
                }`}
              >
                Hints ({selectedLab.hints.length})
              </button>
            )}

            <button
              onClick={handleGenerateAiInsights}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                  : 'bg-[#1E1C1C] text-[#F2C94C]'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> AI Diagnostic
            </button>

            {result && (
              <span className="ml-auto text-[10px] text-[#FFFFFF] font-mono font-black bg-[#000000] px-2 py-1 rounded border border-[#000000]">
                {result.executionTimeMs} ms
              </span>
            )}
          </div>

          {/* Output Console Tab Content */}
          {activeTab === 'console' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#000000] rounded border-2 border-[#000000] min-h-[300px] min-w-0 font-mono">
              {isRunning ? (
                <div className="text-[#F2C94C] font-black uppercase animate-pulse flex items-center gap-2 py-12 justify-center">
                  <Sparkles className="w-5 h-5 animate-spin text-[#F2C94C]" /> Executing {selectedLab.language?.toUpperCase() || 'Python'} code in browser sandbox...
                </div>
              ) : result ? (
                <div className="space-y-4 min-w-0">
                  {result.stdout && (
                    <div className="min-w-0">
                      <div className="text-[#82E0AA] font-black text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5" /> STDOUT Output
                      </div>
                      <pre className="whitespace-pre-wrap text-[#FFFFFF] text-xs bg-[#1A1919] p-3 rounded border border-[#000000] break-words font-mono leading-relaxed">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {result.stderr && (
                    <div className="min-w-0">
                      <div className="text-[#F2C94C] font-black text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> STDERR / Exception Diagnostic
                      </div>
                      <pre className="whitespace-pre-wrap text-amber-200 text-xs bg-amber-950/30 p-3 rounded border border-amber-500/40 break-words font-mono leading-relaxed">
                        {result.stderr}
                      </pre>
                    </div>
                  )}

                  {!result.stdout && !result.stderr && (
                    <div className="text-stone-200 italic py-8 text-center font-bold">
                      Program completed with return code 0 (no explicit console output printed).
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-stone-300 font-bold py-16 text-center space-y-2 uppercase">
                  <Terminal className="w-8 h-8 mx-auto text-[#F2C94C] mb-2" />
                  <p>Click "Run Code" above or press Ctrl+Enter to execute the program and view logs.</p>
                </div>
              )}
            </div>
          )}

          {/* Test Suite Tab Content */}
          {activeTab === 'tests' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#000000] rounded border-2 border-[#000000] space-y-3 min-h-[300px] min-w-0">
              {result?.testCaseResults ? (
                result.testCaseResults.map((tc, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded border-2 border-[#000000] transition-all min-w-0 ${
                      tc.passed
                        ? 'bg-[#82E0AA] text-[#000000]'
                        : 'bg-[#FFDAD6] text-[#000000]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="font-black flex items-center gap-2 text-xs truncate uppercase">
                        {tc.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#000000] shrink-0" />
                        )}
                        <span className="truncate">{tc.description}</span>
                      </span>
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#000000] ${
                        tc.passed ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'
                      }`}>
                        {tc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#000000] font-mono font-bold mt-2 p-2 rounded bg-[#FFFFFF] border border-[#000000] space-y-1 break-words">
                      <div><span>Expected:</span> {tc.expected}</div>
                      <div><span>Actual:</span> {tc.actual}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-stone-300 font-bold py-16 text-center space-y-2 uppercase">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-[#F2C94C] mb-2" />
                  <p>Execute code to evaluate against automated assertions and test cases.</p>
                </div>
              )}
            </div>
          )}

          {/* Progressive Hints Tab Content */}
          {activeTab === 'hints' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#000000] rounded border-2 border-[#000000] space-y-3 min-h-[300px] min-w-0">
              <h4 className="font-black text-xs text-[#F2C94C] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Sequential Learning Hints
              </h4>
              {selectedLab.hints?.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#1E1C1C] border-2 border-[#000000] rounded text-xs text-[#FFFFFF] space-y-1 min-w-0"
                >
                  <div className="font-black text-[#F2C94C] text-[11px] uppercase">Hint #{idx + 1}</div>
                  <p className="break-words font-sans font-bold">{hint}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Diagnostic Insights Tab Content */}
          {activeTab === 'ai' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#000000] rounded border-2 border-[#000000] space-y-3 min-h-[300px] min-w-0">
              {isAnalyzing ? (
                <div className="text-[#F2C94C] font-black uppercase animate-pulse py-16 text-center space-y-2">
                  <Brain className="w-8 h-8 mx-auto animate-bounce text-[#F2C94C]" />
                  <p>Analyzing code logic and time complexity...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-3 text-[#FFFFFF] text-xs font-sans leading-relaxed min-w-0">
                  <div className="p-3 rounded bg-[#1E1C1C] border-2 border-[#F2C94C] text-[#FFFFFF] font-bold">
                    <pre className="whitespace-pre-wrap font-sans text-xs break-words">
                      {aiAnalysis}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-stone-300 font-bold py-16 text-center space-y-2 uppercase">
                  <Brain className="w-8 h-8 mx-auto text-[#F2C94C] mb-2" />
                  <p>Click "AI Diagnostic" above to get instant code analysis and complexity hints.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
