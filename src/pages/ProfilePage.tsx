import React, { useEffect, useState } from 'react';
import { profileService } from '../api/profileService';
import { UserProfileDto, UserActivityDto, AchievementItemDto, BadgeItemDto } from '../types';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { StreakCard } from '../components/gamification/StreakCard';
import { ActivityTimeline } from '../components/profile/ActivityTimeline';
import { AchievementCard } from '../components/achievements/AchievementCard';
import { BadgeCard } from '../components/badges/BadgeCard';
import { Loader2, Trophy, Award, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [activities, setActivities] = useState<UserActivityDto[]>([]);
  const [achievements, setAchievements] = useState<AchievementItemDto[]>([]);
  const [badges, setBadges] = useState<BadgeItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, actData, achData, badgeData] = await Promise.all([
        profileService.getProfile(),
        profileService.getActivities(0, 10),
        profileService.getAchievements(),
        profileService.getBadges(),
      ]);
      setProfile(profData);
      setActivities(actData.content || []);
      setAchievements(achData || []);
      setBadges(badgeData || []);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err?.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (req: any) => {
    const updated = await profileService.updateProfile(req);
    setProfile(updated);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading user profile & gamification data...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4 font-bold">
          {error || 'Unable to retrieve user profile.'}
        </div>
        <button
          onClick={fetchProfileData}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const recentUnlockedAchievements = achievements.filter((a) => a.unlocked).slice(0, 3);
  const recentEarnedBadges = badges.filter((b) => b.earned).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <ProfileHeader profile={profile} onUpdateProfile={handleUpdateProfile} />

      {/* Key Stats Cards */}
      <ProfileStats profile={profile} />

      {/* Level Progress & Streak Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LevelProgress
            levelProgress={profile.levelProgress}
            totalXp={profile.totalXp}
            currentLevel={profile.currentLevel}
          />
        </div>
        <div>
          <StreakCard
            streak={profile.streakStatus}
            currentStreak={profile.currentStreak}
            longestStreak={profile.longestStreak}
          />
        </div>
      </div>

      {/* Showcase Grid: Recent Achievements & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements Preview */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Recent Achievements</h3>
            </div>
            <Link
              to="/achievements"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All ({achievements.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentUnlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentUnlockedAchievements.map((item) => (
                <AchievementCard key={item.id} achievement={item} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No achievements unlocked yet. Complete challenges to earn trophies!
            </div>
          )}
        </div>

        {/* Badges Preview */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Earned Badges</h3>
            </div>
            <Link
              to="/badges"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Badge Collection ({badges.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEarnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentEarnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No badges collected yet. Complete streak & visualization milestones to unlock!
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Recent Activity Feed</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Logged events timeline</span>
        </div>

        <ActivityTimeline activities={activities} />
      </div>
    </div>
  );
};
