import React from 'react';
import { AchievementItemDto } from '../../types';
import { Trophy, Lock, CheckCircle2, Award, Zap, Brain, Target, Swords, Flame, Calendar, Eye, Sparkles } from 'lucide-react';

interface AchievementCardProps {
  achievement: AchievementItemDto;
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const { name, description, category, rarity, xpReward, unlocked, currentValue, requirementValue, progressPercentage } = achievement;

  const getRarityBadge = (r: string) => {
    switch (r.toUpperCase()) {
      case 'LEGENDARY':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      case 'EPIC':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      case 'RARE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'brain': return <Brain className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'swords': return <Swords className="w-6 h-6" />;
      case 'flame': return <Flame className="w-6 h-6" />;
      case 'calendar': return <Calendar className="w-6 h-6" />;
      case 'eye': return <Eye className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'sparkles': return <Sparkles className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        unlocked
          ? 'bg-slate-900/90 border-slate-700/80 shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-900/20'
          : 'bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 ${
              unlocked
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {unlocked ? getIconComponent(achievement.icon) : <Lock className="w-5 h-5 text-slate-500" />}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getRarityBadge(rarity)}`}>
              {rarity}
            </span>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-400" /> +{xpReward} XP
            </span>
          </div>
        </div>

        <h4 className="text-base font-bold text-white mb-1 tracking-tight flex items-center gap-1.5">
          {name}
          {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{description}</p>
      </div>

      <div>
        {/* Requirement Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span className="capitalize">{category.toLowerCase()}</span>
            <span>
              {currentValue} / {requirementValue} ({progressPercentage}%)
            </span>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                unlocked ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
