import React from 'react';
import { LevelProgressDto } from '../../types';
import { Award, Zap, ChevronRight, Trophy } from 'lucide-react';
import { XpProgressBar } from './XpProgressBar';

interface LevelProgressProps {
  levelProgress?: LevelProgressDto;
  totalXp?: number;
  currentLevel?: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  levelProgress,
  totalXp = 0,
  currentLevel = 1,
}) => {
  return (
    <div className="space-y-4">
      <XpProgressBar
        levelProgress={levelProgress}
        totalXp={totalXp}
        currentLevel={currentLevel}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Level Title</div>
            <div className="text-sm font-bold text-white truncate">
              {levelProgress?.title || `Level ${currentLevel} Coder`}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Current XP</div>
            <div className="text-sm font-bold text-white">
              {(levelProgress?.currentXp ?? totalXp ?? 0).toLocaleString()} XP
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Next Tier Unlock</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              Level {(levelProgress?.currentLevel ?? currentLevel) + 1} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
