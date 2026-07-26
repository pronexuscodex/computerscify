import React, { useState, useEffect } from 'react';
import {
  Code2,
  Trophy,
  BookOpen,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileText,
  RotateCcw,
  Award,
  Terminal,
  AlertTriangle,
  Cpu,
  Layers
} from 'lucide-react';
import {
  PracticeProblem,
  JudgeResult,
  StudyPlan,
  ContestDefinition,
  ProblemDifficulty
} from '../../types/practice';
import { PRACTICE_PROBLEMS, CURATED_STUDY_PLANS, COMPUTERFY_CONTESTS } from '../../data/practiceData';
import { executeJudge } from '../../services/judgeService';
import { LearnerProgress } from '../../types/curriculum';
import { Select } from '../common/Select';
import { CodeEditor } from '../common/CodeEditor';

interface PracticeArenaViewProps {
  progress: LearnerProgress;
  onUpdateProgress?: (progress: LearnerProgress) => void;
  onOpenMistakeJournal?: () => void;
}

export const PracticeArenaView: React.FC<PracticeArenaViewProps> = ({
  progress,
  onUpdateProgress
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'study-plans' | 'contests'>('problems');
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(PRACTICE_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'typescript' | 'sql'>('python');
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

  // Update starter code when problem or language changes
  useEffect(() => {
    const starter = selectedProblem.starterCodeByLanguage[selectedLanguage] || selectedProblem.starterCodeByLanguage.python || '';
    setCode(starter);
    setJudgeResult(null);
    setActiveTabInsideProblem('statement');
  }, [selectedProblem, selectedLanguage]);

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

  const handleRunJudge = async () => {
    setIsJudging(true);
    try {
      const res = await executeJudge(selectedProblem, code, selectedLanguage);
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
      setIsJudging(false);
    }
  };

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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'developing':
      case 'intermediate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'advanced':
      case 'expert':
        return 'bg-[#BE94F5]/20 text-[#BE94F5] border-[#BE94F5]/40';
      default:
        return 'bg-stone-800 text-stone-300';
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
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* Practice Arena Banner */}
      <div className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white brand-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-6 h-6 text-[#BE94F5]" />
              <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white">
                Practice Arena & Coding Judge
              </h1>
            </div>
            <p className="text-stone-400 text-sm max-w-2xl leading-relaxed">
              Solve original first-principles programming problems, execute multi-language code against automated test cases, complete curated study plans, and compete in timed contests.
            </p>
          </div>

          {/* Active Contest Banner if running */}
          {isContestRunning && activeContest && (
            <div className="bg-[#BE94F5]/10 border border-[#BE94F5] rounded-xl p-3.5 flex items-center gap-3 shrink-0">
              <Clock className="w-5 h-5 text-[#BE94F5] animate-pulse" />
              <div>
                <div className="text-xs font-bold text-[#BE94F5]">{activeContest.title}</div>
                <div className="font-mono text-lg font-extrabold text-white">
                  {Math.floor(contestTimerSeconds / 60)}:
                  {(contestTimerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-stone-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'problems'
                ? 'bg-[#BE94F5] text-[#151313] border-[#151313] font-bold brand-shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Problem Set ({PRACTICE_PROBLEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('study-plans')}
            className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'study-plans'
                ? 'bg-[#BE94F5] text-[#151313] border-[#151313] font-bold brand-shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Study Plans ({CURATED_STUDY_PLANS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contests')}
            className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'contests'
                ? 'bg-[#BE94F5] text-[#151313] border-[#151313] font-bold brand-shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Contest Mode ({COMPUTERFY_CONTESTS.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PROBLEM SET & JUDGE WORKSPACE */}
      {activeTab === 'problems' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          {/* Left Problem List Sidebar */}
          <div className="lg:col-span-4 space-y-4 min-w-0">
            <div className="bg-[#151313] border border-stone-800 rounded-2xl p-4 text-white space-y-3">
              {/* Search & Filters */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search problems or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#BE94F5]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <Select
                  value={difficultyFilter}
                  onChange={(val) => setDifficultyFilter(val)}
                  variant="dark"
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
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 min-w-0 ${
                      isSelected
                        ? 'bg-[#191717] border-[#BE94F5] brand-shadow-sm'
                        : 'bg-[#151313] border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <h4 className="font-semibold text-xs text-stone-100 truncate">{prob.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full border font-mono capitalize ${getDifficultyBadge(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                        <span className="text-stone-500 truncate">{prob.topics.join(', ')}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#BE94F5]' : 'text-stone-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Judge & Problem Workspace */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            <div className="bg-[#151313] border border-stone-800 rounded-2xl p-5 text-white space-y-4 min-w-0">
              {/* Problem Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-lg md:text-xl text-stone-100 flex items-center gap-2 break-words">
                    {selectedProblem.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full border font-mono capitalize ${getDifficultyBadge(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span>Estimated: {selectedProblem.estimatedMinutes} mins</span>
                    <span>Track: {selectedProblem.track.toUpperCase()}</span>
                  </div>
                </div>

                {/* Tab buttons for problem body */}
                <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1 text-xs flex-wrap">
                  <button
                    onClick={() => setActiveTabInsideProblem('statement')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTabInsideProblem === 'statement' ? 'bg-[#BE94F5] text-[#151313] font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Statement
                  </button>
                  <button
                    onClick={() => setActiveTabInsideProblem('hints')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTabInsideProblem === 'hints' ? 'bg-[#BE94F5] text-[#151313] font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Hints ({selectedProblem.hints.length})
                  </button>
                  <button
                    onClick={() => setActiveTabInsideProblem('editorial')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTabInsideProblem === 'editorial' ? 'bg-[#BE94F5] text-[#151313] font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Editorial & Solution
                  </button>
                </div>
              </div>

              {/* Tab Content: Problem Statement */}
              {activeTabInsideProblem === 'statement' && (
                <div className="space-y-4 text-xs leading-relaxed text-stone-300">
                  <p className="text-sm font-normal text-stone-200 leading-relaxed">
                    {selectedProblem.statement}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <h4 className="font-bold text-stone-200">Input Format</h4>
                      <p className="text-stone-400">{selectedProblem.inputFormat}</p>
                    </div>

                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <h4 className="font-bold text-stone-200">Output Format</h4>
                      <p className="text-stone-400">{selectedProblem.outputFormat}</p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-stone-200">Sample Examples</h4>
                    {selectedProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-2 font-mono text-[11px] min-w-0">
                        <div className="break-words">
                          <span className="text-stone-500">Input:</span> <span className="text-stone-200">{ex.input}</span>
                        </div>
                        <div className="break-words">
                          <span className="text-stone-500">Output:</span> <span className="text-emerald-400">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-stone-400 font-sans text-xs pt-1 border-t border-stone-800/60 break-words">
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
                  <h4 className="font-bold text-stone-200">Algorithmic Hints</h4>
                  {selectedProblem.hints.map((hint, idx) => (
                    <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex items-start gap-2.5 text-stone-300 min-w-0">
                      <HelpCircle className="w-4 h-4 text-[#BE94F5] shrink-0 mt-0.5" />
                      <p className="leading-relaxed break-words">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content: Editorial */}
              {activeTabInsideProblem === 'editorial' && (
                <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
                  <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-[#BE94F5] text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Core Algorithmic Insight
                    </h4>
                    <p>{selectedProblem.editorial.coreInsight}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <h5 className="font-bold text-stone-200">Time Complexity</h5>
                      <span className="font-mono text-emerald-400">{selectedProblem.editorial.timeComplexity}</span>
                    </div>
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <h5 className="font-bold text-stone-200">Space Complexity</h5>
                      <span className="font-mono text-emerald-400">{selectedProblem.editorial.spaceComplexity}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-2">
                    <h5 className="font-bold text-stone-200">Common Pitfalls & Mistakes</h5>
                    <ul className="list-disc list-inside space-y-1 text-stone-400">
                      {selectedProblem.editorial.commonMistakes.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Code Editor & Execution Controls */}
              <div className="pt-4 border-t border-stone-800 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#BE94F5]" />
                    <span className="font-bold text-xs text-stone-200">Code Solution</span>
                  </div>

                  {/* Language Picker */}
                  <Select
                    value={selectedLanguage}
                    onChange={(val) => setSelectedLanguage(val as any)}
                    variant="dark"
                    options={[
                      { value: 'python', label: 'Python 3' },
                      { value: 'javascript', label: 'JavaScript (Node)' },
                      { value: 'typescript', label: 'TypeScript' },
                      { value: 'sql', label: 'SQL' },
                    ]}
                    ariaLabel="Select programming language"
                  />
                </div>

                {/* Code Editor Component */}
                <CodeEditor
                  value={code}
                  onChange={(val) => setCode(val)}
                  language={selectedLanguage}
                  onReset={() => {
                    setCode(selectedProblem.starterCodeByLanguage[selectedLanguage] || '');
                    setJudgeResult(null);
                  }}
                  minHeight="320px"
                  maxHeight="550px"
                  ariaLabel={`Code editor for ${selectedProblem.title}`}
                />

                {/* Submit & Run Controls */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCode(selectedProblem.starterCodeByLanguage[selectedLanguage] || '');
                        setJudgeResult(null);
                      }}
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 min-h-[44px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Code</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunJudge}
                      disabled={isJudging}
                      className="px-5 py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-bold rounded-xl text-xs transition-all flex items-center gap-2 brand-shadow disabled:opacity-50 min-h-[44px]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isJudging ? 'Evaluating Code...' : 'Submit to Judge'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Judge Results & Test Case Suite Inspector */}
                {judgeResult && (
                  <div
                    role="region"
                    aria-live="polite"
                    aria-label="Judge Execution Outcome"
                    className={`p-4 rounded-2xl border space-y-4 text-xs ${
                      judgeResult.status === 'Accepted'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                        : 'bg-[#151313] border-amber-500/40 text-stone-100'
                    }`}
                  >
                    {/* Execution Summary Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-950/80 rounded-xl border border-stone-800">
                      <div className="flex items-center gap-3">
                        {judgeResult.status === 'Accepted' ? (
                          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <XCircle className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-100">
                              Verdict: {judgeResult.status}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                judgeResult.status === 'Accepted'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {judgeResult.passCount} / {judgeResult.totalTests} Passed
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Total execution time: <span className="font-mono font-bold text-stone-200">{judgeResult.totalExecutionTimeMs} ms</span>
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full sm:w-36 space-y-1">
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>Pass Rate</span>
                          <span>
                            {Math.round((judgeResult.passCount / judgeResult.totalTests) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              judgeResult.status === 'Accepted' ? 'bg-emerald-400' : 'bg-amber-400'
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
                      <div className="flex items-center justify-between text-xs text-stone-300">
                        <span className="font-bold flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-[#BE94F5]" /> Test Case Suite Results
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Select test case to inspect inputs/outputs
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-stone-800">
                        {judgeResult.testResults.map((tr, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTestTab(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                              selectedTestTab === idx
                                ? 'bg-[#BE94F5] text-[#151313] brand-shadow'
                                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                            }`}
                          >
                            <span>Test #{idx + 1}</span>
                            {tr.passed ? (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  selectedTestTab === idx ? 'text-[#151313]' : 'text-emerald-400'
                                }`}
                              />
                            ) : (
                              <XCircle
                                className={`w-3.5 h-3.5 ${
                                  selectedTestTab === idx ? 'text-[#151313]' : 'text-amber-400'
                                }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Test Case Detail Inspector */}
                    {judgeResult.testResults[selectedTestTab] && (
                      <div className="p-3.5 bg-stone-950/90 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between text-stone-300 pb-2 border-b border-stone-800/80">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-200">
                              Test Case #{selectedTestTab + 1}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                judgeResult.testResults[selectedTestTab].passed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {judgeResult.testResults[selectedTestTab].passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            Time: {judgeResult.testResults[selectedTestTab].executionTimeMs} ms
                          </span>
                        </div>

                        {/* Input Block */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                            Test Input
                          </span>
                          <pre className="p-2.5 bg-[#0d0c0c] border border-stone-800 rounded-lg text-stone-200 text-xs overflow-x-auto whitespace-pre-wrap">
                            {judgeResult.testResults[selectedTestTab].input || '(No input supplied)'}
                          </pre>
                        </div>

                        {/* Output Comparison Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                              Expected Output
                            </span>
                            <pre className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs overflow-x-auto whitespace-pre-wrap font-bold">
                              {judgeResult.testResults[selectedTestTab].expected}
                            </pre>
                          </div>

                          <div className="space-y-1">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider ${
                                judgeResult.testResults[selectedTestTab].passed
                                  ? 'text-emerald-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              Actual Output
                            </span>
                            <pre
                              className={`p-2.5 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap border ${
                                judgeResult.testResults[selectedTestTab].passed
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200 font-bold'
                              }`}
                            >
                              {judgeResult.testResults[selectedTestTab].actual}
                            </pre>
                          </div>
                        </div>

                        {/* Error stack if present */}
                        {judgeResult.testResults[selectedTestTab].error && (
                          <div className="p-2.5 bg-amber-950/40 border border-[#FCCC42]/40 rounded-lg text-amber-200 text-xs space-y-1">
                            <span className="font-bold flex items-center gap-1.5 text-[#FCCC42]">
                              <AlertTriangle className="w-3.5 h-3.5" /> Exception / Execution Error
                            </span>
                            <pre className="whitespace-pre-wrap font-mono text-[11px] text-stone-200">
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
              <div key={plan.id} className="bg-[#151313] border border-stone-800 rounded-2xl p-5 text-white flex flex-col justify-between space-y-4 hover:border-stone-700 transition-all brand-shadow min-w-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#151313] bg-[#BE94F5] px-2 py-0.5 rounded-full">
                      {plan.category}
                    </span>
                    <span className="text-xs font-mono text-stone-400">{plan.problemIds.length} Problems</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-stone-100">{plan.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Plan Progress</span>
                    <span className="font-mono font-bold text-[#FCCC42]">{percent}%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#82E0AA] h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>

                  <button
                    onClick={() => {
                      const prob = PRACTICE_PROBLEMS.find((p) => plan.problemIds.includes(p.id)) || PRACTICE_PROBLEMS[0];
                      setSelectedProblem(prob);
                      setActiveTab('problems');
                    }}
                    className="w-full py-2.5 bg-stone-900 hover:bg-[#BE94F5] hover:text-[#151313] border border-stone-800 rounded-xl text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
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
          {COMPUTERFY_CONTESTS.map((contest) => (
            <div key={contest.id} className="bg-[#151313] border border-stone-800 rounded-2xl p-6 text-white space-y-4 brand-shadow min-w-0">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#BE94F5]/20 border border-[#BE94F5]/40 text-[#BE94F5] font-bold text-xs uppercase tracking-wider">
                  {contest.category} Round
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {contest.durationMinutes} mins
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-stone-100">{contest.title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed mt-1">{contest.description}</p>
              </div>

              <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <span className="font-bold text-stone-200">Contest Rules:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
                  {contest.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleStartContest(contest)}
                className="w-full py-3 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 brand-shadow min-h-[44px]"
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
