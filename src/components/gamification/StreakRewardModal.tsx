import React from 'react';
import { Flame, Award, Check } from 'lucide-react';

interface StreakRewardModalProps {
  streakDays: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StreakRewardModal: React.FC<StreakRewardModalProps> = ({
  streakDays,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const rewards = [
    { streak: 3, xp: 25, badge: 'Streak Starter', icon: '🔥' },
    { streak: 7, xp: 50, badge: 'Week Warrior', icon: '⚡' },
    { streak: 14, xp: 100, badge: 'Fortnight Champion', icon: '🛡️' },
    { streak: 30, xp: 250, badge: 'Monthly Titan', icon: '🏆' },
    { streak: 100, xp: 1000, badge: 'Legendary Streak', icon: '👑' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Streak Milestone Rewards</h3>
            <p className="text-xs text-slate-400">Maintain your streak to claim exclusive bonuses</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-6">
          {rewards.map((r, i) => {
            const achieved = streakDays >= r.streak;
            return (
              <div
                key={i}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  achieved
                    ? 'bg-amber-500/10 border-amber-500/30 text-white'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {r.streak} Days Milestone
                      {achieved && <span className="text-xs text-emerald-400 font-semibold">(Unlocked)</span>}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      Badge: <span className="text-amber-300 font-semibold">{r.badge}</span> • +{r.xp} XP
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full flex items-center justify-center">
                  {achieved ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
        >
          Close Milestone List
        </button>
      </div>
    </div>
  );
};
