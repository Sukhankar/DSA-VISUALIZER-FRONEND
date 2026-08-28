import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userActivityService } from '../api/userActivityService';
import { submissionService } from '../api/submissionService';
import { profileService } from '../api/profileService';
import { roadmapService } from '../api/roadmapService';
import { LearningDashboardResponse, ProblemUserStatsResponse, GamificationSummaryDto, NextRecommendationDto } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { ContinueLearning } from '../components/dashboard/ContinueLearning';
import { CompletedAlgorithms } from '../components/dashboard/CompletedAlgorithms';
import { XpProgressBar } from '../components/gamification/XpProgressBar';
import { StreakCard } from '../components/gamification/StreakCard';
import { NextRecommendationCard } from '../components/learning/NextRecommendationCard';
import { LearningRecommendationDto } from '../types';

import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../utils/errorUtils';
import {
  LayoutDashboard,
  Code2,
  PlayCircle,
  CheckCircle,
  Award,
  Trophy,
  Target,
  Flame,
  ArrowRight,
  User as UserIcon,
  Sparkles,
  Map,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LearningDashboardResponse | null>(null);
  const [problemStats, setProblemStats] = useState<ProblemUserStatsResponse | null>(null);
  const [gamification, setGamification] = useState<GamificationSummaryDto | null>(null);
  const [recommendation, setRecommendation] = useState<LearningRecommendationDto | any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [res, stats, gamificationSummary, rec] = await Promise.all([
        userActivityService.getDashboard(),
        submissionService.getUserProblemStats().catch(() => null),
        profileService.getGamificationSummary().catch(() => null),
        roadmapService.getSmartRecommendation().catch(() => null),
      ]);
      setData(res);
      setProblemStats(stats);
      setGamification(gamificationSummary);
      setRecommendation(rec);
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
      {/* Top Gamification Banner */}
      {gamification && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* User Level & Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-1 shadow-xl shadow-emerald-950 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center text-emerald-400 font-black text-xl">
                  {gamification.level}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {gamification.levelProgress?.title || `Level ${gamification.level} Coder`}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Lv {gamification.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                  <span>Welcome back, <strong className="text-white">{user?.username}</strong></span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{gamification.totalXp.toLocaleString()} XP</span>
                </p>
              </div>
            </div>

            {/* Gamification Quick Counters */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/profile" className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center gap-2 transition-all">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Streak</div>
                  <div className="text-xs font-black text-amber-300">{gamification.currentStreak} Days</div>
                </div>
              </Link>

              <Link to="/achievements" className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center gap-2 transition-all">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Achievements</div>
                  <div className="text-xs font-black text-emerald-300">{gamification.achievementsUnlocked} / {gamification.totalAchievements}</div>
                </div>
              </Link>

              <Link to="/badges" className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center gap-2 transition-all">
                <Award className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Badges</div>
                  <div className="text-xs font-black text-cyan-300">{gamification.badgesEarned} / {gamification.totalBadges}</div>
                </div>
              </Link>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <XpProgressBar
              levelProgress={gamification.levelProgress}
              totalXp={gamification.totalXp}
              currentLevel={gamification.level}
              compact
            />
          </div>
        </div>
      )}

      {/* Header Banner fallback if gamification summary unavailable */}
      {!gamification && (
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
              Track algorithm visualization progress, practice problem stats, and gamification rewards.
            </p>
          </div>
        </div>
      )}

      {/* Smart Learning Recommendation Banner */}
      {recommendation && <NextRecommendationCard recommendation={recommendation} />}


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

      {/* Grid Section 1.5: Problem Solving Metrics & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {problemStats && (
            <Card className="bg-slate-900/90 border-slate-800 space-y-4 h-full">
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
        </div>

        <div>
          <StreakCard
            currentStreak={gamification?.currentStreak ?? 0}
            longestStreak={gamification?.longestStreak ?? 0}
          />
        </div>
      </div>

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

      {/* Grid Section 4: Profile Navigation Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 justify-center md:justify-start">
            <Sparkles className="w-4 h-4 text-amber-400" /> View Your Profile & Achievements Hub
          </h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Track your full activity timeline, edit profile links, unlock badges, and level up your skills.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/profile">
            <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer">
              <UserIcon className="w-4 h-4" />
              <span>Open Profile Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
