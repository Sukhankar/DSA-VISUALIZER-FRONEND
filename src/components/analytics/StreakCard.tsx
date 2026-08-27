import React from 'react';
import { Flame, Shield, Trophy } from 'lucide-react';
import { UserStreakDto } from '../../types';

interface StreakCardProps {
  streak: UserStreakDto;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  const isStreakActive = streak.currentStreak > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border border-orange-500/20 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isStreakActive ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/40 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
            <Flame className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Current Streak</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{streak.currentStreak}</span>
              <span className="text-sm text-slate-400 font-medium">{streak.currentStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-right">
          <div>
            <div className="flex items-center justify-end text-xs text-slate-400 space-x-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Longest</span>
            </div>
            <p className="text-lg font-bold text-slate-200">{streak.longestStreak} days</p>
          </div>

          <div className="pl-4 border-l border-slate-800">
            <div className="flex items-center justify-end text-xs text-slate-400 space-x-1">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>Freezes</span>
            </div>
            <p className="text-lg font-bold text-blue-400">{streak.streakFreezeCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
