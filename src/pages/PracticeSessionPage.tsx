import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PracticeSessionDto,
  PracticeSessionProblemDto,
  ProblemDetail,
  RunCodeResponse,
  SubmissionVerdict,
} from '../types';
import { practiceService } from '../api/practiceService';
import { problemService } from '../api/problemService';
import { submissionService } from '../api/submissionService';
import { SessionHeaderBar } from '../components/practice/SessionHeaderBar';
import { SessionResultsModal } from '../components/practice/SessionResultsModal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExampleCard } from '../components/algorithm/ExampleCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  CheckCircle2,
  Play,
  Send,
  RotateCcw,
  Clock,
  Cpu,
  Check,
  Tag,
  Lightbulb,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';

const STARTER_TEMPLATES: Record<string, string> = {
  JAVA: `public class Solution {
    public int[] solve(int[] nums, int target) {
        // Write your solution here
        return new int[]{0, 1};
    }
}`,
  PYTHON: `class Solution:
    def solve(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        return [0, 1]`,
  JAVASCRIPT: `function solve(nums, target) {
  // Write your solution here
  return [0, 1];
}`,
  CPP: `class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Write your solution here
        return {0, 1};
    }
};`,
};

export const PracticeSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<PracticeSessionDto | null>(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);
  const [currentProblemDetail, setCurrentProblemDetail] = useState<ProblemDetail | null>(null);

  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [isLoadingProblem, setIsLoadingProblem] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JAVA');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'DESCRIPTION' | 'HINTS'>('DESCRIPTION');

  // Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null);
  const [earnedXpToast, setEarnedXpToast] = useState<number | null>(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modal State
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

  // Fetch Practice Session
  useEffect(() => {
    if (!id) return;
    setIsLoadingSession(true);

    practiceService
      .getSession(id)
      .then((data) => {
        setSession(data);
        if (data.timeLimitSeconds && data.status === 'IN_PROGRESS') {
          const startedAtMs = new Date(data.startedAt).getTime();
          const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
          const remainingSec = Math.max(0, data.timeLimitSeconds - elapsedSec);
          setTimeLeft(remainingSec);
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.message || 'Failed to load session details.');
      })
      .finally(() => setIsLoadingSession(false));
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && session?.status === 'IN_PROGRESS') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, session?.status]);

  // Load Problem Details when active problem changes
  useEffect(() => {
    if (!session || session.problems.length === 0) return;
    const currentSessionProblem = session.problems[activeProblemIndex];
    if (!currentSessionProblem) return;

    setIsLoadingProblem(true);
    setRunResult(null);

    problemService
      .getProblemBySlug(currentSessionProblem.problem.slug)
      .then((det) => {
        setCurrentProblemDetail(det);
        const savedCode = localStorage.getItem(
          `session_draft_${session.id}_${det.slug}_${selectedLanguage}`
        );
        setCode(savedCode || STARTER_TEMPLATES[selectedLanguage] || '// Write code here');
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingProblem(false));
  }, [session, activeProblemIndex, selectedLanguage]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (session && currentProblemDetail) {
      localStorage.setItem(
        `session_draft_${session.id}_${currentProblemDetail.slug}_${selectedLanguage}`,
        newCode
      );
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (session && currentProblemDetail) {
      const savedCode = localStorage.getItem(
        `session_draft_${session.id}_${currentProblemDetail.slug}_${lang}`
      );
      setCode(savedCode || STARTER_TEMPLATES[lang] || '// Write code here');
    }
  };

  const handleRunCode = async () => {
    if (!currentProblemDetail) return;
    setIsRunning(true);
    setRunResult(null);

    try {
      const res = await submissionService.runCode(currentProblemDetail.slug, {
        language: selectedLanguage,
        sourceCode: code,
      });
      setRunResult(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error running sample test cases');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitInSession = async () => {
    if (!id || !session || !currentProblemDetail) return;
    const activeSp = session.problems[activeProblemIndex];
    if (!activeSp) return;

    setIsSubmitting(true);
    setRunResult(null);

    try {
      const resp = await practiceService.submitInSession(id, {
        problemId: activeSp.problem.id,
        language: selectedLanguage,
        code: code,
      });

      setSession(resp.session);

      if (resp.xpEarnedInAttempt > 0) {
        setEarnedXpToast(resp.xpEarnedInAttempt);
        setTimeout(() => setEarnedXpToast(null), 4000);
      }

      if (resp.sessionCompleted) {
        setShowResultsModal(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting solution in session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandonSession = async () => {
    if (!id || !window.confirm('Are you sure you want to abandon this practice session?')) return;
    try {
      const updated = await practiceService.abandonSession(id);
      setSession(updated);
      navigate('/practice');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to abandon session');
    }
  };

  if (isLoadingSession) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" message="Loading practice session..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-rose-400">
        <p className="text-lg font-semibold">{error || 'Session not found.'}</p>
        <Button className="mt-4" onClick={() => navigate('/practice')}>
          Return to Practice Arena
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 px-4">
      {/* Session Top Header */}
      <SessionHeaderBar
        session={session}
        timeLeftSeconds={timeLeft}
        onAbandon={handleAbandonSession}
        onBackToArena={() => navigate('/practice')}
      />

      {/* XP Toast Notification */}
      {earnedXpToast && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-bold text-sm shadow-lg animate-bounce">
          <Zap className="w-5 h-5 fill-amber-400" />
          Awesome! You solved this problem and earned +{earnedXpToast} XP!
        </div>
      )}

      {/* Problem Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {session.problems.map((sp, idx) => {
          const isActive = idx === activeProblemIndex;
          const isSolved = sp.status === 'SOLVED';
          const isAttempted = sp.status === 'ATTEMPTED';

          return (
            <button
              key={sp.id}
              onClick={() => setActiveProblemIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>Problem {idx + 1}</span>
              {isSolved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isAttempted ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Problem Details */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-slate-900/90 border-slate-800 space-y-6">
            {isLoadingProblem || !currentProblemDetail ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        currentProblemDetail.difficulty === 'EASY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : currentProblemDetail.difficulty === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {currentProblemDetail.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                      {currentProblemDetail.categoryName}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-100">
                    {currentProblemDetail.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab('DESCRIPTION')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'DESCRIPTION'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('HINTS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'HINTS'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Hints
                  </button>
                </div>

                {activeTab === 'DESCRIPTION' && (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {currentProblemDetail.description}
                    </p>

                    {currentProblemDetail.examples && currentProblemDetail.examples.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Examples
                        </h3>
                        {currentProblemDetail.examples.map((ex) => (
                          <ExampleCard
                            key={ex.exampleNumber}
                            example={{
                              exampleNumber: ex.exampleNumber,
                              title: `Sample Case ${ex.exampleNumber}`,
                              inputData: ex.inputData,
                              outputData: ex.outputData,
                              explanation: ex.explanation,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'HINTS' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <Lightbulb className="w-4 h-4" />
                      <span>Session Hint</span>
                    </div>
                    {currentProblemDetail.hints ? (
                      <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {currentProblemDetail.hints}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No specific hints for this problem.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Right Column (6 Cols): Code Editor & Execution */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="bg-slate-900/90 border-slate-800 space-y-4 overflow-hidden p-0">
            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-1">
                {['JAVA', 'PYTHON', 'JAVASCRIPT', 'CPP'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'CPP' ? 'C++' : lang.charAt(0) + lang.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCode(STARTER_TEMPLATES[selectedLanguage] || '')}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Code Editor */}
            <div className="p-4 bg-slate-950">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full bg-transparent font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Execution Buttons */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Session Code Auto-saved
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunCode}
                  isLoading={isRunning}
                  disabled={isSubmitting || session.status !== 'IN_PROGRESS'}
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Run Sample Code
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitInSession}
                  isLoading={isSubmitting}
                  disabled={isRunning || session.status !== 'IN_PROGRESS'}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Submit Solution
                </Button>
              </div>
            </div>
          </Card>

          {/* Console Execution Result Output */}
          {runResult && (
            <Card className="bg-slate-950 border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      runResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {runResult.verdict}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    Sample Tests ({runResult.passedTests}/{runResult.totalTests})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {runResult.executionTimeMs} ms
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {runResult.testResults.map((tc) => (
                  <div
                    key={tc.testCaseNumber}
                    className={`p-2.5 rounded-lg border text-xs font-mono ${
                      tc.passed
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-bold">
                      <span>Test Case {tc.testCaseNumber}</span>
                      <span>{tc.passed ? '✓ Passed' : '✗ Failed'}</span>
                    </div>
                    <div>Input: {tc.inputData}</div>
                    <div>Expected: {tc.expectedOutput}</div>
                    <div>Output: {tc.actualOutput}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Results Popup Modal when session complete */}
      <SessionResultsModal
        isOpen={showResultsModal}
        session={session}
        onClose={() => {
          setShowResultsModal(false);
          navigate('/practice');
        }}
      />
    </div>
  );
};
