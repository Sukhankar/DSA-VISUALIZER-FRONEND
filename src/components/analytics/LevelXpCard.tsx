import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { UserXpDto } from '../../types';

interface LevelXpCardProps {
  xp: UserXpDto;
}

export const LevelXpCard: React.FC<LevelXpCardProps> = ({ xp }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900 border border-purple-500/20 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/40">
            <Crown className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Level</h3>
            <span className="text-3xl font-extrabold text-white">Lvl {xp.currentLevel}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end text-xs text-slate-400 space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            <span>Total XP</span>
          </div>
          <p className="text-2xl font-extrabold text-purple-300">{xp.totalXp.toLocaleString()} XP</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 font-medium mb-1.5">
          <span>Level {xp.currentLevel} Progress</span>
          <span>{xp.levelProgressPercentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, xp.levelProgressPercentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>{xp.xpForCurrentLevel} XP</span>
          <span>{xp.xpForNextLevel} XP (Next Lvl)</span>
        </div>
      </div>
    </div>
  );
};
