import React from 'react';
import { UserProfileDto } from '../../types';
import { Target, BookOpen, Swords, Flame, Trophy } from 'lucide-react';

interface ProfileStatsProps {
  profile: UserProfileDto;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const stats = [
    {
      title: 'Problems Solved',
      value: profile.totalProblemsSolved,
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/20',
      desc: 'LeetCode-style challenges solved',
    },
    {
      title: 'Algorithms Mastered',
      value: profile.totalAlgorithmsCompleted,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-400',
      bgGlow: 'bg-blue-500/10 border-blue-500/20',
      desc: 'Step-by-step topic guides',
    },
    {
      title: 'Practice Sessions',
      value: profile.totalPracticeSessions,
      icon: Swords,
      color: 'from-purple-500 to-pink-600',
      iconColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/10 border-purple-500/20',
      desc: 'Timed practice runs completed',
    },
    {
      title: 'Streak Record',
      value: `${profile.currentStreak} Days`,
      subValue: `Best: ${profile.longestStreak} Days`,
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-400',
      bgGlow: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Consecutive active learning days',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</span>
              <div className={`p-2.5 rounded-xl border ${item.bgGlow} ${item.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="text-3xl font-black text-white tracking-tight mb-1">{item.value}</div>
            {item.subValue && (
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5" /> {item.subValue}
              </div>
            )}
            <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
};
