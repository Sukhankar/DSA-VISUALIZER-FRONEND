import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../api/profileService';
import { UserProfileDto } from '../../types';

export const TopStatusBar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { setProfile(null); return; }
    let mounted = true;
    profileService.getProfile().then((d) => { if (mounted) setProfile(d); }).catch(() => {});
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const displayName = profile?.displayName || user?.username || '';
  const level       = profile?.levelProgress?.currentLevel ?? profile?.currentLevel ?? 1;
  const currentXp   = profile?.levelProgress?.currentXp   ?? profile?.totalXp      ?? 0;
  const nextLevelXp = profile?.levelProgress?.xpRequiredForNextLevel ?? (level * 500);
  const streak      = profile?.streakStatus?.currentStreak ?? profile?.currentStreak ?? 0;
  const xpProgress  = Math.min(100, Math.max(0,
    profile?.levelProgress?.progressPercentage ?? Math.round((currentXp / nextLevelXp) * 100)
  ));

  return (
    <div className="w-full bg-[#040710] border-b border-slate-800/50 text-[12px] py-1 px-4 sm:px-6 lg:px-8 text-slate-400 select-none hidden sm:block">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">

        {/* Left: welcome message */}
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-indigo-300">✨</span>
          {isAuthenticated && displayName ? (
            <span>
              Welcome back, <span className="font-semibold text-slate-200">{displayName}</span>! Keep learning and stay consistent 🔥
            </span>
          ) : (
            <span>Master Data Structures & Algorithms — interactive, visual, and fun.</span>
          )}
        </div>

        {/* Right: gamification stats */}
        {isAuthenticated && (
          <div className="flex items-center gap-5 shrink-0">
            {/* Streak */}
            <div className="flex items-center gap-1.5" title="Current Streak">
              <span>🔥</span>
              <span className="font-semibold text-slate-200">{streak}</span>
              <span>Day Streak</span>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1.5" title="Level">
              <span>⭐</span>
              <span>Level</span>
              <span className="font-semibold text-slate-200">{level}</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5" title="Total XP">
              <span>💎</span>
              <span className="font-semibold text-slate-200">{currentXp.toLocaleString()}</span>
              <span>XP</span>
            </div>

            {/* XP Progress bar */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
