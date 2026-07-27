import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Code2,
  Trophy,
  BookOpen,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import {
  PracticeProblem,
  JudgeResult,
  ContestDefinition,
  ProblemDifficulty
} from '../../types/practice';
import { PRACTICE_PROBLEMS, CURATED_STUDY_PLANS, COMPUTERSCIFY_CONTESTS } from '../../data/practiceData';
import { executeJudge } from '../../services/judgeService';
import { LearnerProgress } from '../../types/curriculum';
import { Select } from '../common/Select';
import { CodeEditor } from '../common/CodeEditor';

interface PracticeArenaViewProps {
  progress: LearnerProgress;
  onUpdateProgress?: (progress: LearnerProgress) => void;
  onOpenMistakeJournal?: () => void;
}

type PracticeLanguage = 'python' | 'javascript' | 'typescript' | 'sql';

const FALLBACK_STARTERS: Record<PracticeLanguage, string> = {
  python: `import sys

def solve(raw_input):
    # Write your solution here.
    return raw_input

if __name__ == "__main__":
    print(solve(sys.stdin.read().strip()))
`,
  javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();

function solve(rawInput) {
  // Write your solution here.
  return rawInput;
}

console.log(solve(input));
`,
  typescript: `const fs = require('fs');
const input: string = fs.readFileSync(0, 'utf-8').trim();

function solve(rawInput: string): string {
  // Write your solution here.
  return rawInput;
}

console.log(solve(input));
`,
  sql: `-- Write a query that produces the expected result.
SELECT 'replace me' AS result;
`,
};

function getStarterCode(problem: PracticeProblem, language: PracticeLanguage): string {
  const exactStarter = problem.starterCodeByLanguage[language];
  if (exactStarter?.trim()) return exactStarter;

  if (language === 'typescript') {
    const javascriptStarter = problem.starterCodeByLanguage.javascript;
    if (javascriptStarter?.trim()) return javascriptStarter;
  }

  return FALLBACK_STARTERS[language];
}

export const PracticeArenaView: React.FC<PracticeArenaViewProps> = ({
  progress,
  onUpdateProgress
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'study-plans' | 'contests'>('problems');
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(PRACTICE_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<PracticeLanguage>('python');
  const [code, setCode] = useState<string>(
    PRACTICE_PROBLEMS[0].starterCodeByLanguage.python || ''
  );
  const [isJudging, setIsJudging] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [selectedTestTab, setSelectedTestTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [activeTabInsideProblem, setActiveTabInsideProblem] = useState<'statement' | 'hints' | 'editorial'>('statement');
  const [activeContest, setActiveContest] = useState<ContestDefinition | null>(null);
  const [contestTimerSeconds, setContestTimerSeconds] = useState<number>(0);
  const [isContestRunning, setIsContestRunning] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(13);
  const codeDraftsRef = useRef<Record<string, string>>({});
  const judgeSequenceRef = useRef(0);
  const isJudgeActiveRef = useRef(false);

  const getDraftKey = useCallback(
    (problemId = selectedProblem.id, language = selectedLanguage) =>
      `${problemId}:${language}`,
    [selectedLanguage, selectedProblem.id]
  );

  // Update starter code when problem or language changes
  useEffect(() => {
    judgeSequenceRef.current += 1;
    isJudgeActiveRef.current = false;
    setIsJudging(false);
    const starter = getStarterCode(selectedProblem, selectedLanguage);
    setCode(codeDraftsRef.current[getDraftKey()] ?? starter);
    setJudgeResult(null);
    setSelectedTestTab(0);
    setActiveTabInsideProblem('statement');
  }, [getDraftKey, selectedProblem, selectedLanguage]);

  // Contest Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isContestRunning && contestTimerSeconds > 0) {
      interval = setInterval(() => {
        setContestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsContestRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContestRunning, contestTimerSeconds]);

  const handleRunJudge = useCallback(async () => {
    if (isJudgeActiveRef.current) return;

    isJudgeActiveRef.current = true;
    const judgeSequence = ++judgeSequenceRef.current;
    setIsJudging(true);
    setSelectedTestTab(0);
    try {
      const res = await executeJudge(selectedProblem, code, selectedLanguage);
      if (judgeSequence !== judgeSequenceRef.current) return;
      setJudgeResult(res);

      if (res.status === 'Accepted' && onUpdateProgress) {
        // Record problem completed in labCodes
        const updated = {
          ...progress,
          labCodes: {
            ...progress.labCodes,
            [selectedProblem.id]: code
          }
        };
        onUpdateProgress(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (judgeSequence === judgeSequenceRef.current) {
        isJudgeActiveRef.current = false;
        setIsJudging(false);
      }
    }
  }, [code, onUpdateProgress, progress, selectedLanguage, selectedProblem]);

  useEffect(() => {
    const handleJudgeShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        void handleRunJudge();
      }
    };
    window.addEventListener('keydown', handleJudgeShortcut);
    return () => window.removeEventListener('keydown', handleJudgeShortcut);
  }, [handleRunJudge]);

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadge = (diff: ProblemDifficulty) => {
    switch (diff) {
      case 'foundation':
      case 'easy':
        return 'bg-[#82E0AA] text-[#000000] border-[#000000]';
      case 'developing':
      case 'intermediate':
        return 'bg-[#F2C94C] text-[#000000] border-[#000000]';
      case 'advanced':
      case 'expert':
        return 'bg-[#000000] text-[#FFFFFF] border-[#000000]';
      default:
        return 'bg-[#DFD9D8] text-[#000000] border-[#000000]';
    }
  };

  const handleStartContest = (contest: ContestDefinition) => {
    setActiveContest(contest);
    setContestTimerSeconds(contest.durationMinutes * 60);
    setIsContestRunning(true);
    const prob = PRACTICE_PROBLEMS.find((p) => contest.problemIds.includes(p.id)) || PRACTICE_PROBLEMS[0];
    setSelectedProblem(prob);
    setActiveTab('problems');
  };

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden text-[#1D1B1B] dark:text-[#F6EFEF]">
      {/* Practice Arena Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-6 h-6 text-[#000000] dark:text-[#F2C94C]" />
              <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-[#000000] dark:text-[#F6EFEF]">
                Practice Arena & Coding Judge
              </h1>
            </div>
            <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-sm font-bold max-w-2xl leading-relaxed">
              Solve original first-principles programming problems, execute multi-language code against automated test cases, complete curated study plans, and compete in timed contests.
            </p>
          </div>

          {/* Active Contest Banner if running */}
          {isContestRunning && activeContest && (
            <div className="bg-[#F2C94C] text-[#000000] border-2 border-[#000000] neo-shadow-sm rounded p-3.5 flex items-center gap-3 shrink-0">
              <Clock className="w-5 h-5 text-[#000000] animate-pulse" />
              <div>
                <div className="text-xs font-black uppercase">{activeContest.title}</div>
                <div className="font-mono text-lg font-black">
                  {Math.floor(contestTimerSeconds / 60)}:
                  {(contestTimerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t-2 border-[#000000] text-xs font-black uppercase">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2.5 rounded border-2 border-[#000000] transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'problems'
                ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Problem Set ({PRACTICE_PROBLEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('study-plans')}
            className={`px-4 py-2.5 rounded border-2 border-[#000000] transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'study-plans'
                ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Study Plans ({CURATED_STUDY_PLANS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contests')}
            className={`px-4 py-2.5 rounded border-2 border-[#000000] transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'contests'
                ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Contest Mode ({COMPUTERSCIFY_CONTESTS.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PROBLEM SET & JUDGE WORKSPACE */}
      {activeTab === 'problems' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          {/* Left Problem List Sidebar */}
          <div className="lg:col-span-4 space-y-4 min-w-0">
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-4 space-y-3">
              {/* Search & Filters */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#000000] dark:text-[#F6EFEF] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search problems or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded pl-9 pr-3 py-2 text-xs font-black text-[#000000] dark:text-[#F6EFEF] focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#000000] dark:text-[#F2C94C] shrink-0" />
                <Select
                  value={difficultyFilter}
                  onChange={(val) => setDifficultyFilter(val)}
                  options={[
                    { value: 'all', label: 'All Difficulties' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  ariaLabel="Filter by difficulty"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Problem Selection List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 min-w-0">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblem.id === prob.id;
                const isSolved = Boolean(progress.labCodes[prob.id]);
                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblem(prob)}
                    className={`w-full text-left p-3.5 rounded border-2 border-[#000000] transition-all flex items-center justify-between gap-3 min-w-0 ${
                      isSelected
                        ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm font-black'
                        : 'bg-[#FFFFFF] dark:bg-[#1E1C1C] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/20'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {isSolved && <CheckCircle2 className="w-4 h-4 text-[#82E0AA] shrink-0" />}
                        <h4 className="font-black text-xs uppercase truncate">{prob.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded border font-black capitalize ${getDifficultyBadge(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                        <span className="opacity-80 truncate">{prob.topics.join(', ')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Judge & Problem Workspace */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-4 min-w-0">
              {/* Problem Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-[#000000]">
                <div className="min-w-0">
                  <h2 className="font-display font-black text-lg md:text-xl text-[#000000] dark:text-[#F6EFEF] uppercase flex items-center gap-2 break-words">
                    {selectedProblem.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#000000]/70 dark:text-[#F6EFEF]/70 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded border font-black uppercase ${getDifficultyBadge(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span>Estimated: {selectedProblem.estimatedMinutes} mins</span>
                    <span>Track: {selectedProblem.track.toUpperCase()}</span>
                  </div>
                </div>

                {/* Tab buttons for problem body */}
                <div className="flex items-center gap-1 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded p-1 text-xs font-black uppercase flex-wrap">
                  <button
                    onClick={() => setActiveTabInsideProblem('statement')}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      activeTabInsideProblem === 'statement' ? 'bg-[#000000] text-[#FFFFFF]' : 'text-[#000000] dark:text-[#F6EFEF]'
                    }`}
                  >
                    Statement
                  </button>
                  <button
                    onClick={() => setActiveTabInsideProblem('hints')}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      activeTabInsideProblem === 'hints' ? 'bg-[#000000] text-[#FFFFFF]' : 'text-[#000000] dark:text-[#F6EFEF]'
                    }`}
                  >
                    Hints ({selectedProblem.hints.length})
                  </button>
                  <button
                    onClick={() => setActiveTabInsideProblem('editorial')}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      activeTabInsideProblem === 'editorial' ? 'bg-[#000000] text-[#FFFFFF]' : 'text-[#000000] dark:text-[#F6EFEF]'
                    }`}
                  >
                    Editorial & Solution
                  </button>
                </div>
              </div>

              {/* Tab Content: Problem Statement */}
              {activeTabInsideProblem === 'statement' && (
                <div className="space-y-4 text-xs leading-relaxed text-[#000000] dark:text-[#F6EFEF]">
                  <p className="text-sm font-bold leading-relaxed">
                    {selectedProblem.statement}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1">
                      <h4 className="font-black uppercase">Input Format</h4>
                      <p className="font-medium">{selectedProblem.inputFormat}</p>
                    </div>

                    <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1">
                      <h4 className="font-black uppercase">Output Format</h4>
                      <p className="font-medium">{selectedProblem.outputFormat}</p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-black uppercase">Sample Examples</h4>
                    {selectedProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2 font-mono text-[11px] min-w-0">
                        <div className="break-words">
                          <span className="font-black">Input:</span> <span>{ex.input}</span>
                        </div>
                        <div className="break-words">
                          <span className="font-black">Output:</span> <span className="font-black">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="font-sans text-xs pt-1 border-t border-[#000000] font-medium break-words">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Hints */}
              {activeTabInsideProblem === 'hints' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-black uppercase">Algorithmic Hints</h4>
                  {selectedProblem.hints.map((hint, idx) => (
                    <div key={idx} className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded flex items-start gap-2.5 min-w-0">
                      <HelpCircle className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-bold break-words">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content: Editorial */}
              {activeTabInsideProblem === 'editorial' && (
                <div className="space-y-4 text-xs font-bold leading-relaxed">
                  <div className="p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2">
                    <h4 className="font-black text-sm uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" /> Core Algorithmic Insight
                    </h4>
                    <p>{selectedProblem.editorial.coreInsight}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1">
                      <h5 className="font-black uppercase">Time Complexity</h5>
                      <span className="font-mono">{selectedProblem.editorial.timeComplexity}</span>
                    </div>
                    <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-1">
                      <h5 className="font-black uppercase">Space Complexity</h5>
                      <span className="font-mono">{selectedProblem.editorial.spaceComplexity}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2">
                    <h5 className="font-black uppercase">Common Pitfalls & Mistakes</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProblem.editorial.commonMistakes.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Code Editor & Execution Controls */}
              <div className="pt-4 border-t-2 border-[#000000] space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#000000] dark:text-[#F2C94C]" />
                    <span className="font-black text-xs uppercase">Code Solution</span>
                  </div>

                  {/* Language Picker */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center rounded border-2 border-[#000000] bg-[#000000] px-1 py-1 text-[#FFFFFF]">
                      <button
                        type="button"
                        onClick={() => setEditorFontSize((size) => Math.max(11, size - 1))}
                        aria-label="Decrease editor font size"
                        className="min-h-8 min-w-8 font-mono text-xs font-black hover:text-[#F2C94C]"
                      >
                        A-
                      </button>
                      <span className="px-1 font-mono text-[10px] font-black text-[#F2C94C]">
                        {editorFontSize}px
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditorFontSize((size) => Math.min(18, size + 1))}
                        aria-label="Increase editor font size"
                        className="min-h-8 min-w-8 font-mono text-xs font-black hover:text-[#F2C94C]"
                      >
                        A+
                      </button>
                    </div>
                    <Select
                      value={selectedLanguage}
                      onChange={(val) => setSelectedLanguage(val as PracticeLanguage)}
                      options={[
                        { value: 'python', label: 'Python 3' },
                        { value: 'javascript', label: 'JavaScript (Node)' },
                        { value: 'typescript', label: 'TypeScript' },
                        { value: 'sql', label: 'SQL' },
                      ]}
                      ariaLabel="Select programming language"
                    />
                  </div>
                </div>

                {/* Code Editor Component */}
                <CodeEditor
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    codeDraftsRef.current[getDraftKey()] = val;
                  }}
                  language={selectedLanguage}
                  onReset={() => {
                    const starter = getStarterCode(selectedProblem, selectedLanguage);
                    setCode(starter);
                    codeDraftsRef.current[getDraftKey()] = starter;
                    setJudgeResult(null);
                  }}
                  minHeight="320px"
                  maxHeight="550px"
                  fontSize={editorFontSize}
                  testResults={
                    isJudging
                      ? { isRunning: true, passed: false }
                      : judgeResult
                        ? {
                            passed: judgeResult.status === 'Accepted',
                            totalTests: judgeResult.totalTests,
                            passedTests: judgeResult.passCount,
                            executionTimeMs: judgeResult.totalExecutionTimeMs,
                          }
                        : null
                  }
                  placeholder={`Start typing your ${selectedLanguage} solution here…`}
                  ariaLabel={`Code editor for ${selectedProblem.title}`}
                />

                {/* Submit & Run Controls */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const starter = getStarterCode(selectedProblem, selectedLanguage);
                        setCode(starter);
                        codeDraftsRef.current[getDraftKey()] = starter;
                        setJudgeResult(null);
                      }}
                      aria-label="Reset to starter code"
                      className="px-3 py-2 bg-[#FEF8F7] dark:bg-[#2B2929] hover:bg-[#000000] text-[#000000] dark:text-[#F6EFEF] hover:text-[#FFFFFF] border-2 border-[#000000] rounded text-xs font-black uppercase transition-colors flex items-center gap-1.5 min-h-[44px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Code</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunJudge}
                      disabled={isJudging}
                      aria-label={isJudging ? 'Code is being evaluated' : 'Submit code to judge'}
                      className="px-5 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black uppercase tracking-wider rounded border-2 border-[#000000] neo-btn text-xs flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isJudging ? 'Evaluating Code...' : 'Submit to Judge'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Judge Results */}
                {judgeResult && (
                  <div
                    role="region"
                    aria-live="polite"
                    aria-label="Judge Execution Outcome"
                    className={`p-4 rounded border-4 border-[#000000] neo-shadow space-y-4 text-xs ${
                      judgeResult.status === 'Accepted'
                        ? 'bg-[#82E0AA] text-[#000000]'
                        : 'bg-[#FFDAD6] text-[#000000]'
                    }`}
                  >
                    {/* Execution Summary Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FFFFFF] rounded border-2 border-[#000000]">
                      <div className="flex items-center gap-3">
                        {judgeResult.status === 'Accepted' ? (
                          <div className="p-2 rounded bg-[#82E0AA] text-[#000000] border-2 border-[#000000]">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="p-2 rounded bg-[#FFDAD6] text-[#000000] border-2 border-[#000000]">
                            <XCircle className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm uppercase">
                              Verdict: {judgeResult.status}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#000000] ${
                                judgeResult.status === 'Accepted'
                                  ? 'bg-[#82E0AA] text-[#000000]'
                                  : 'bg-[#FFDAD6] text-[#000000]'
                              }`}
                            >
                              {judgeResult.passCount} / {judgeResult.totalTests} Passed
                            </span>
                          </div>
                          <p className="text-[11px] font-mono font-bold mt-0.5">
                            Total execution time: <span className="font-mono font-black">{judgeResult.totalExecutionTimeMs} ms</span>
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full sm:w-36 space-y-1 font-mono font-black">
                        <div className="flex justify-between text-[10px] uppercase">
                          <span>Pass Rate</span>
                          <span>
                            {Math.round((judgeResult.passCount / judgeResult.totalTests) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#000000] h-3 rounded overflow-hidden border border-[#000000]">
                          <div
                            className={`h-full transition-all duration-300 ${
                              judgeResult.status === 'Accepted' ? 'bg-[#82E0AA]' : 'bg-[#FFDAD6]'
                            }`}
                            style={{
                              width: `${(judgeResult.passCount / judgeResult.totalTests) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Test Case Tab Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-black uppercase">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-4 h-4" /> Test Case Suite Results
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                        {judgeResult.testResults.map((tr, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTestTab(idx)}
                            className={`px-3 py-1.5 rounded text-xs font-mono font-black uppercase transition-all flex items-center gap-1.5 shrink-0 border-2 border-[#000000] ${
                              selectedTestTab === idx
                                ? 'bg-[#000000] text-[#FFFFFF]'
                                : 'bg-[#FFFFFF] text-[#000000]'
                            }`}
                          >
                            <span>Test #{idx + 1}</span>
                            {tr.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Test Case Detail Inspector */}
                    {judgeResult.testResults[selectedTestTab] && (
                      <div className="p-3.5 bg-[#FFFFFF] rounded border-2 border-[#000000] space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between pb-2 border-b-2 border-[#000000]">
                          <div className="flex items-center gap-2">
                            <span className="font-black uppercase">
                              Test Case #{selectedTestTab + 1}
                            </span>
                          </div>
                          <span className="text-[10px] font-black">
                            Time: {judgeResult.testResults[selectedTestTab].executionTimeMs} ms
                          </span>
                        </div>

                        {/* Input Block */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-wider">
                            Test Input
                          </span>
                          <pre className="p-2.5 bg-[#FEF8F7] border border-[#000000] rounded text-xs font-mono font-bold overflow-x-auto whitespace-pre-wrap">
                            {judgeResult.testResults[selectedTestTab].input || '(No input supplied)'}
                          </pre>
                        </div>

                        {/* Output Comparison Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-black tracking-wider">
                              Expected Output
                            </span>
                            <pre className="p-2.5 bg-[#FEF8F7] border border-[#000000] rounded text-xs font-mono font-black overflow-x-auto whitespace-pre-wrap">
                              {judgeResult.testResults[selectedTestTab].expected}
                            </pre>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-black tracking-wider">
                              Actual Output
                            </span>
                            <pre className="p-2.5 bg-[#FEF8F7] border border-[#000000] rounded text-xs font-mono font-black overflow-x-auto whitespace-pre-wrap">
                              {judgeResult.testResults[selectedTestTab].actual}
                            </pre>
                          </div>
                        </div>

                        {/* Error stack if present */}
                        {judgeResult.testResults[selectedTestTab].error && (
                          <div className="p-2.5 bg-[#FFDAD6] border border-[#000000] rounded text-xs space-y-1 font-bold">
                            <span className="font-black flex items-center gap-1.5 uppercase">
                              <AlertTriangle className="w-3.5 h-3.5" /> Exception / Execution Error
                            </span>
                            <pre className="whitespace-pre-wrap font-mono text-[11px]">
                              {judgeResult.testResults[selectedTestTab].error}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CURATED STUDY PLANS */}
      {activeTab === 'study-plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
          {CURATED_STUDY_PLANS.map((plan) => {
            const completedCount = plan.problemIds.filter((id) => progress.labCodes[id]).length;
            const percent = Math.round((completedCount / plan.problemIds.length) * 100);

            return (
              <div key={plan.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 flex flex-col justify-between space-y-4 min-w-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-black bg-[#000000] text-[#FFFFFF] px-2 py-0.5 rounded border border-[#000000]">
                      {plan.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#000000]/70 dark:text-[#F6EFEF]/70">{plan.problemIds.length} Problems</span>
                  </div>
                  <h3 className="font-display font-black text-base text-[#000000] dark:text-[#F6EFEF] uppercase">{plan.title}</h3>
                  <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-xs font-bold leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t-2 border-[#000000]">
                  <div className="flex items-center justify-between text-xs font-black uppercase">
                    <span>Plan Progress</span>
                    <span className="font-mono">{percent}%</span>
                  </div>
                  <div className="w-full bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] h-3 rounded overflow-hidden">
                    <div className="bg-[#F2C94C] h-full transition-all" style={{ width: `${percent}%` }} />
                  </div>

                  <button
                    onClick={() => {
                      const prob = PRACTICE_PROBLEMS.find((p) => plan.problemIds.includes(p.id)) || PRACTICE_PROBLEMS[0];
                      setSelectedProblem(prob);
                      setActiveTab('problems');
                    }}
                    className="w-full py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>Start Study Plan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: CONTEST MODE */}
      {activeTab === 'contests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
          {COMPUTERSCIFY_CONTESTS.map((contest) => (
            <div key={contest.id} className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4 min-w-0">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#000000] text-[#FFFFFF] font-black text-xs uppercase border border-[#000000]">
                  {contest.category} Round
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {contest.durationMinutes} mins
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-lg text-[#000000] dark:text-[#F6EFEF] uppercase">{contest.title}</h3>
                <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 text-xs font-bold leading-relaxed mt-1">{contest.description}</p>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t-2 border-[#000000]">
                <span className="font-black uppercase block mb-1">Contest Rules:</span>
                <ul className="list-disc list-inside space-y-1 font-bold text-[11px]">
                  {contest.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleStartContest(contest)}
                className="w-full py-3 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] border-2 border-[#000000] neo-btn rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Trophy className="w-4 h-4" />
                <span>Enter Contest Arena</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
