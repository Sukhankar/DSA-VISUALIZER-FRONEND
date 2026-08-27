import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userActivityService } from '../api/userActivityService';
import { submissionService } from '../api/submissionService';
import { LearningDashboardResponse, ProblemUserStatsResponse } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { ContinueLearning } from '../components/dashboard/ContinueLearning';
import { CompletedAlgorithms } from '../components/dashboard/CompletedAlgorithms';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../utils/errorUtils';
import {
  LayoutDashboard,
  Code2,
  PlayCircle,
  CheckCircle,
  Star,
  ArrowRight,
  Terminal,
  Target,
  Award,
  Trophy,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LearningDashboardResponse | null>(null);
  const [problemStats, setProblemStats] = useState<ProblemUserStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [res, stats] = await Promise.all([
        userActivityService.getDashboard(),
        submissionService.getUserProblemStats().catch(() => null),
      ]);
      setData(res);
      setProblemStats(stats);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your personal learning dashboard..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-8">
        <ErrorMessage
          message={error || 'Failed to load dashboard metrics.'}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
              Learning & Practice Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Welcome back, <span className="text-indigo-400">{user?.username}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track algorithm visualization progress, practice problem stats, and gamification rewards in real time.
          </p>
        </div>

        {/* Quick Navigate Actions */}
        <div className="flex items-center gap-3">
          <Link to="/analytics">
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer">
              <Trophy className="w-4 h-4" />
              <span>Analytics & Badges</span>
            </button>
          </Link>
          <Link to="/problems">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
              <Terminal className="w-4 h-4" />
              <span>Practice Hub</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Grid Section 1: Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Algorithms"
          value={data.totalAlgorithms}
          subtext="Seeded Platform Algorithms"
          icon={<Code2 className="w-5 h-5" />}
          accentColor="indigo"
        />
        <StatCard
          label="In Progress"
          value={data.startedAlgorithms}
          subtext="Active Visual Progress"
          icon={<PlayCircle className="w-5 h-5" />}
          accentColor="amber"
        />
        <StatCard
          label="Completed"
          value={data.completedAlgorithms}
          subtext="Mastered Algorithms"
          icon={<CheckCircle className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          label="Problems Solved"
          value={problemStats?.totalSolved ?? 0}
          subtext={`Acceptance Rate: ${problemStats?.acceptanceRate ?? 0}%`}
          icon={<Award className="w-5 h-5" />}
          accentColor="purple"
        />
      </div>

      {/* Grid Section 1.5: Problem Solving Metrics Breakdown */}
      {problemStats && (
        <Card className="bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Target className="w-4 h-4" />
              <span>LeetCode Practice Statistics</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {problemStats.totalSubmissions} Total Submissions
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center">
              <span className="text-xs font-semibold text-emerald-400 block">Easy Solved</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {problemStats.easySolved}
              </span>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-center">
              <span className="text-xs font-semibold text-amber-400 block">Medium Solved</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {problemStats.mediumSolved}
              </span>
            </div>

            <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-center">
              <span className="text-xs font-semibold text-rose-400 block">Hard Solved</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {problemStats.hardSolved}
              </span>
            </div>

            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-center">
              <span className="text-xs font-semibold text-indigo-400 block">Acceptance Rate</span>
              <span className="text-xl font-extrabold text-slate-100 font-mono">
                {problemStats.acceptanceRate}%
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Grid Section 2: Continue Learning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Continue Learning</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.recentProgress.filter((p) => p.status === 'IN_PROGRESS').length} Active
          </span>
        </div>

        <ContinueLearning items={data.recentProgress} />
      </div>

      {/* Grid Section 3: Completed Algorithms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Completed Algorithms</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.completedAlgorithms} Mastered
          </span>
        </div>

        <CompletedAlgorithms items={data.recentProgress} />
      </div>

      {/* Grid Section 4: Quick Action Panel */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-100">Ready to unlock badges & level up?</h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Solve problems using Java, Python, JavaScript, or C++ and view algorithm visualizations to earn XP and maintain your streak.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/analytics">
            <button className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer">
              <span>View Analytics & Trophy Showcase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
