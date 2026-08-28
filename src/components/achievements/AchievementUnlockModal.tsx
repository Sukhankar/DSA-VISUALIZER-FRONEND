import React from 'react';
import { AchievementItemDto } from '../../types';
import { Trophy, Zap, X, CheckCircle2 } from 'lucide-react';

interface AchievementUnlockModalProps {
  achievement: AchievementItemDto | null;
  onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
          <Trophy className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> Achievement Unlocked
        </div>

        <h3 className="text-2xl font-black text-white mb-2">{achievement.name}</h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">{achievement.description}</p>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center justify-around mb-6">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Reward</div>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" /> +{achievement.xpReward} XP
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Rarity</div>
            <div className="text-lg font-black text-emerald-400 uppercase">{achievement.rarity}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};
