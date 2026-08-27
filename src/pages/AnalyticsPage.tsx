import React, { useEffect, useState } from 'react';
import { analyticsService } from '../api/analyticsService';
import {
  AnalyticsOverviewResponse,
  BadgeDto,
  DailyActivityDto,
  LeaderboardUserDto
} from '../types';
import { StreakCard } from '../components/analytics/StreakCard';
import { LevelXpCard } from '../components/analytics/LevelXpCard';
import { ActivityHeatmap } from '../components/analytics/ActivityHeatmap';
import { TopicSkillRadar } from '../components/analytics/TopicSkillRadar';
import { BadgesShowcase } from '../components/analytics/BadgesShowcase';
import { LeaderboardTable } from '../components/analytics/LeaderboardTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const AnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverviewResponse | null>(null);
  const [heatmap, setHeatmap] = useState<DailyActivityDto[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeDto[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [overviewRes, heatmapRes, badgesRes, leaderboardRes] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getHeatmap(),
          analyticsService.getBadges(),
          analyticsService.getLeaderboard(10)
        ]);

        setOverview(overviewRes);
        setHeatmap(heatmapRes);
        setAllBadges(badgesRes);
        setLeaderboard(leaderboardRes);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your learning analytics..." />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message={error || 'Failed to load analytics.'} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Learning Analytics & Rewards 🏆
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Track your daily streak, level progression, topic mastery, and earned achievement trophies.
        </p>
      </div>

      {/* Top Gamification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard streak={overview.userStreak} />
        <LevelXpCard xp={overview.userXp} />
      </div>

      {/* Contribution Heatmap */}
      <ActivityHeatmap activities={heatmap} />

      {/* Middle Section: Radar Chart & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopicSkillRadar skills={overview.topicSkills} />
        <LeaderboardTable leaderboard={leaderboard} />
      </div>

      {/* Badges Showcase */}
      <BadgesShowcase badges={allBadges} />
    </div>
  );
};
