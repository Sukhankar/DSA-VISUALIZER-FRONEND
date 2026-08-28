import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../api/profileService';
import { UserProfileDto } from '../../types';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub?: React.ReactNode;
  subGreen?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, sub, subGreen }) => (
  <div className="flex-1 min-w-0 rounded-xl border border-slate-800/80 bg-[#0c1222] hover:border-slate-700 transition-colors px-5 py-4">
    <div className="flex items-center gap-3">
      <div className="shrink-0 opacity-80">{icon}</div>
      <div className="min-w-0">
        <div className="text-xl font-bold text-slate-100 leading-tight">{value}</div>
        <div className="text-xs text-slate-400 font-medium mt-0.5">{label}</div>
        {sub && (
          <div className={`text-[11px] mt-0.5 font-medium ${subGreen ? 'text-emerald-400' : 'text-slate-500'}`}>
            {sub}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const GamificationStats: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    profileService.getProfile().then((d) => { if (mounted) setProfile(d); }).catch(() => {});
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const totalXp        = profile?.totalXp               ?? 2450;
  const currentStreak  = profile?.streakStatus?.currentStreak ?? profile?.currentStreak ?? 12;
  const longestStreak  = profile?.streakStatus?.longestStreak ?? profile?.longestStreak ?? 21;
  const problemsSolved = profile?.totalProblemsSolved    ?? 53;
  const algosCompleted = profile?.totalAlgorithmsCompleted ?? 18;

  return (
    <div className="flex flex-wrap gap-3">
      {/* 1. Total XP */}
      <StatCard
        icon={<span className="text-2xl">🏠</span>}
        value={totalXp.toLocaleString()}
        label="Total XP"
        sub="▲ 150 this week"
        subGreen
      />

      {/* 2. Current Streak */}
      <StatCard
        icon={<span className="text-2xl">🔥</span>}
        value={`${currentStreak} Days`}
        label="Current Streak"
        sub={`Best: ${longestStreak} Days`}
      />

      {/* 3. Achievements */}
      <StatCard
        icon={<span className="text-2xl">🏆</span>}
        value={24}
        label="Achievements"
        sub="▲ 3 recently unlocked"
        subGreen
      />

      {/* 4. Badges Earned */}
      <StatCard
        icon={<span className="text-2xl">🎖️</span>}
        value={15}
        label="Badges Earned"
        sub="Legendary: 2"
        subGreen
      />

      {/* 5. Problems Solved */}
      <StatCard
        icon={<span className="text-xl font-mono text-cyan-400 font-bold">&lt;/&gt;</span>}
        value={problemsSolved}
        label="Problems Solved"
        sub="Acceptance: 68%"
        subGreen
      />

      {/* 6. Algorithms Mastered */}
      <StatCard
        icon={<span className="text-2xl">📖</span>}
        value={algosCompleted}
        label="Algorithms Mastered"
        sub="▲ 2 this week"
        subGreen
      />
    </div>
  );
};
