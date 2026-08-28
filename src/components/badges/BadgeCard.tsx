import React from 'react';
import { BadgeItemDto } from '../../types';
import { Lock, Award, Shield, Flame, Target, Swords, Calendar, Eye, Star, Zap } from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeItemDto;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onClick }) => {
  const { name, description, category, rarity, xpReward, earned, iconName } = badge;

  const getRarityStyles = (r: string, isEarned: boolean) => {
    if (!isEarned) {
      return {
        cardBg: 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90',
        iconBg: 'bg-slate-900 border-slate-800 text-slate-600',
        badgePill: 'bg-slate-800 text-slate-400 border-slate-700',
        glow: '',
      };
    }

    switch (r.toUpperCase()) {
      case 'LEGENDARY':
        return {
          cardBg: 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-950 border-amber-500/50 hover:border-amber-400',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse',
          badgePill: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
        };
      case 'EPIC':
        return {
          cardBg: 'bg-gradient-to-b from-purple-950/50 via-slate-900 to-slate-950 border-purple-500/50 hover:border-purple-400',
          iconBg: 'bg-gradient-to-tr from-purple-500 to-pink-400 text-white shadow-[0_0_18px_rgba(168,85,247,0.5)]',
          badgePill: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]',
        };
      case 'RARE':
        return {
          cardBg: 'bg-gradient-to-b from-blue-950/50 via-slate-900 to-slate-950 border-cyan-500/40 hover:border-cyan-400',
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]',
          badgePill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]',
        };
      default:
        return {
          cardBg: 'bg-slate-900/90 border-slate-800 hover:border-slate-700',
          iconBg: 'bg-slate-800 text-emerald-400 border-slate-700',
          badgePill: 'bg-slate-800 text-slate-300 border-slate-700',
          glow: '',
        };
    }
  };

  const styles = getRarityStyles(rarity, earned);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'flame': return <Flame className="w-7 h-7" />;
      case 'zap': return <Zap className="w-7 h-7" />;
      case 'crown': return <Award className="w-7 h-7" />;
      case 'target': return <Target className="w-7 h-7" />;
      case 'swords': return <Swords className="w-7 h-7" />;
      case 'calendar': return <Calendar className="w-7 h-7" />;
      case 'eye': return <Eye className="w-7 h-7" />;
      case 'star': return <Star className="w-7 h-7" />;
      case 'shield': return <Shield className="w-7 h-7" />;
      default: return <Award className="w-7 h-7" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center text-center cursor-pointer ${styles.cardBg} ${styles.glow}`}
    >
      {/* Icon Frame */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border transition-transform duration-300 hover:scale-110 ${styles.iconBg}`}>
        {earned ? getIcon(iconName) : <Lock className="w-6 h-6 text-slate-500" />}
      </div>

      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase mb-2 border ${styles.badgePill}`}>
        {rarity}
      </span>

      <h4 className="text-base font-bold text-white mb-1 tracking-tight">{name}</h4>
      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{description}</p>

      <div className="mt-auto w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500 uppercase tracking-wider text-[10px]">{category}</span>
        {earned ? (
          <span className="text-emerald-400 font-bold">✓ Unlocked</span>
        ) : (
          <span className="text-amber-400 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-400" /> +{xpReward} XP
          </span>
        )}
      </div>
    </div>
  );
};
