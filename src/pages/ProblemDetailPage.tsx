import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { problemService } from '../api/problemService';
import { submissionService } from '../api/submissionService';
import { useAuth } from '../hooks/useAuth';
import {
  ProblemDetail,
  RunCodeResponse,
  SubmissionResponse,
  SubmissionVerdict,
} from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExampleCard } from '../components/algorithm/ExampleCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getErrorMessage } from '../utils/errorUtils';
import {
  ArrowLeft,
  Play,
  Terminal,
  FileText,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Check,
  Tag,
  Send,
  History,
  XCircle,
  Clock,
  Cpu,
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

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Workspace & Editor state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JAVA');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'DESCRIPTION' | 'HINTS' | 'SOLUTION' | 'SUBMISSIONS'>('DESCRIPTION');

  // Run / Submit state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null);
  const [lastSubmission, setLastSubmission] = useState<SubmissionResponse | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionResponse[]>([]);

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    problemService
      .getProblemBySlug(slug)
      .then((data) => {
        setProblem(data);
        const savedCode = localStorage.getItem(`problem_draft_${slug}_${selectedLanguage}`);
        setCode(savedCode || STARTER_TEMPLATES[selectedLanguage] || '// Write code here');
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const loadSubmissions = () => {
    if (!slug || !isAuthenticated) return;
    submissionService
      .getProblemSubmissions(slug)
      .then(setSubmissionHistory)
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'SUBMISSIONS') {
      loadSubmissions();
    }
  }, [activeTab, slug, isAuthenticated]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (slug) {
      localStorage.setItem(`problem_draft_${slug}_${selectedLanguage}`, newCode);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (slug) {
      const savedCode = localStorage.getItem(`problem_draft_${slug}_${lang}`);
      setCode(savedCode || STARTER_TEMPLATES[lang] || '// Write code here');
    }
  };

  const handleRunCode = async () => {
    if (!slug) return;
    setIsRunning(true);
    setRunResult(null);
    setLastSubmission(null);

    try {
      const res = await submissionService.runCode(slug, {
        language: selectedLanguage,
        sourceCode: code,
      });
      setRunResult(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!slug) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setRunResult(null);
    setLastSubmission(null);

    try {
      const sub = await submissionService.submitCode(slug, {
        language: selectedLanguage,
        sourceCode: code,
      });
      setLastSubmission(sub);
      loadSubmissions();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    const template = STARTER_TEMPLATES[selectedLanguage] || '';
    setCode(template);
    if (slug) {
      localStorage.setItem(`problem_draft_${slug}_${selectedLanguage}`, template);
    }
    setRunResult(null);
    setLastSubmission(null);
  };

  const getVerdictBadge = (verdict: SubmissionVerdict) => {
    switch (verdict) {
      case 'ACCEPTED':
        return <Badge variant="success">✓ Accepted</Badge>;
      case 'WRONG_ANSWER':
        return <Badge variant="danger">✗ Wrong Answer</Badge>;
      case 'COMPILATION_ERROR':
        return <Badge variant="warning">⚠ Compilation Error</Badge>;
      case 'TIME_LIMIT_EXCEEDED':
        return <Badge variant="danger">⏱ Time Limit Exceeded</Badge>;
      default:
        return <Badge variant="neutral">{verdict}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return <Badge variant="success">Easy</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      case 'HARD':
        return <Badge variant="danger">Hard</Badge>;
      default:
        return <Badge variant="neutral">{difficulty}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading problem workspace..." />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <ErrorMessage message={error || 'Problem not found.'} onRetry={() => window.location.reload()} />
        <Button variant="outline" size="sm" onClick={() => navigate('/problems')}>
          Return to Problems
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problems Catalog</span>
        </Link>

        {problem.relatedAlgorithms && problem.relatedAlgorithms.length > 0 && (
          <Link to={`/visualize/${problem.relatedAlgorithms[0].slug}`}>
            <Button variant="secondary" size="sm" leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}>
              Launch Visualizer ({problem.relatedAlgorithms[0].name})
            </Button>
          </Link>
        )}
      </div>

      {/* Main LeetCode 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Problem Specs & History */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-slate-900/90 border-slate-800 space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getDifficultyBadge(problem.difficulty)}
                <span className="text-xs font-semibold text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                  {problem.categoryName}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-100">{problem.title}</h1>

              <div className="flex items-center gap-1.5 flex-wrap">
                {problem.tags.map((tag) => (
                  <span key={tag} className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
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
              <button
                onClick={() => setActiveTab('SOLUTION')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'SOLUTION'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Solution
              </button>
              <button
                onClick={() => setActiveTab('SUBMISSIONS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'SUBMISSIONS'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Submissions</span>
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'DESCRIPTION' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {problem.description}
                </p>

                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Examples
                    </h3>
                    {problem.examples.map((ex) => (
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

                {problem.constraints && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Constraints
                    </h3>
                    <pre className="text-xs font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-line">
                      {problem.constraints}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Hints */}
            {activeTab === 'HINTS' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Problem Hints</span>
                </div>
                {problem.hints ? (
                  <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {problem.hints}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No specific hints required.</p>
                )}
              </div>
            )}

            {/* Tab 3: Solution */}
            {activeTab === 'SOLUTION' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official Solution Strategy</span>
                </div>
                {problem.solutionExplanation ? (
                  <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {problem.solutionExplanation}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Solution approach coming soon.</p>
                )}
              </div>
            )}

            {/* Tab 4: Submissions History */}
            {activeTab === 'SUBMISSIONS' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Your Submission History</span>
                  <span className="text-indigo-400 font-mono text-[11px]">{submissionHistory.length} total</span>
                </h3>

                {!isAuthenticated ? (
                  <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400">Sign in to view your solution submission history.</p>
                    <Link to="/login">
                      <Button variant="outline" size="sm">Sign In</Button>
                    </Link>
                  </div>
                ) : submissionHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No submissions recorded yet for this problem.</p>
                ) : (
                  <div className="space-y-2">
                    {submissionHistory.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {getVerdictBadge(sub.verdict)}
                          <span className="font-mono text-slate-400 uppercase">{sub.language}</span>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                          <span>{sub.passedTests} / {sub.totalTests} tests</span>
                          {sub.executionTimeMs != null && <span>{sub.executionTimeMs} ms</span>}
                          <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (6 Cols): Multi-Language Code Editor & Execution Results */}
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
                onClick={handleResetCode}
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
                Draft auto-saved
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunCode}
                  isLoading={isRunning}
                  disabled={isSubmitting}
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Run Code
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitCode}
                  isLoading={isSubmitting}
                  disabled={isRunning}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
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
                  {getVerdictBadge(runResult.verdict)}
                  <span className="text-xs font-bold text-slate-200">
                    Sample Tests ({runResult.passedTests}/{runResult.totalTests})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {runResult.executionTimeMs} ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    {runResult.memoryUsedKb} KB
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

          {/* Formal Submission Verdict Result */}
          {lastSubmission && (
            <Card className="bg-slate-950 border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getVerdictBadge(lastSubmission.verdict)}
                  <span className="text-xs font-bold text-slate-200">
                    Full Evaluation ({lastSubmission.passedTests}/{lastSubmission.totalTests} Passed)
                  </span>
                </div>
                {lastSubmission.executionTimeMs != null && (
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    {lastSubmission.executionTimeMs} ms
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {lastSubmission.verdict === 'ACCEPTED'
                  ? 'Congratulations! Your solution passed all sample and hidden test cases successfully.'
                  : 'Your solution did not pass all hidden test cases. Review constraints and edge cases.'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
