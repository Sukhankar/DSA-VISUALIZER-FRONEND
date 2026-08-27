import React from 'react';
import { Award, Crown, Flame, Footprints, Grid, Lock, Zap, ArrowUpDown } from 'lucide-react';
import { BadgeDto } from '../../types';

interface BadgesShowcaseProps {
  badges: BadgeDto[];
}

const getBadgeIcon = (iconName: string, unlocked: boolean) => {
  const cls = `h-6 w-6 ${unlocked ? 'text-amber-400' : 'text-slate-600'}`;
  switch (iconName) {
    case 'Footprints':
      return <Footprints className={cls} />;
    case 'Award':
      return <Award className={cls} />;
    case 'Flame':
      return <Flame className={`h-6 w-6 ${unlocked ? 'text-orange-400' : 'text-slate-600'}`} />;
    case 'Zap':
      return <Zap className={`h-6 w-6 ${unlocked ? 'text-yellow-400' : 'text-slate-600'}`} />;
    case 'Grid':
      return <Grid className={cls} />;
    case 'ArrowUpDown':
      return <ArrowUpDown className={cls} />;
    case 'Crown':
      return <Crown className={`h-6 w-6 ${unlocked ? 'text-amber-300' : 'text-slate-600'}`} />;
    default:
      return <Award className={cls} />;
  }
};

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ badges }) => {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Achievements & Badges 🏆</h3>
          <p className="text-xs text-slate-400">Unlock trophies by completing algorithms, streaks, and challenges</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.code}
            className={`relative p-4 rounded-xl border transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-slate-900 border-amber-500/30 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900/50 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2.5 rounded-lg ${
                  badge.unlocked ? 'bg-amber-500/20 ring-1 ring-amber-500/30' : 'bg-slate-800'
                }`}
              >
                {getBadgeIcon(badge.iconName, badge.unlocked)}
              </div>
              {!badge.unlocked && (
                <div className="p-1 rounded-md bg-slate-800 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
              )}
            </div>

            <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>
              {badge.name}
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{badge.description}</p>

            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-purple-400 font-semibold">+{badge.xpReward} XP</span>
              {badge.unlocked && badge.unlockedAt && (
                <span className="text-slate-500">
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
