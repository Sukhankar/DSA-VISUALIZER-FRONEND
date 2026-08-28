import React from 'react';
import { Link } from 'react-router-dom';
import { NextRecommendationDto } from '../../types';
import { Sparkles, ArrowRight, Zap, Target, BookOpen, Terminal, Play } from 'lucide-react';

interface SmartRecommendationWidgetProps {
  recommendation: NextRecommendationDto | null;
}

export const SmartRecommendationWidget: React.FC<SmartRecommendationWidgetProps> = ({ recommendation }) => {
  if (!recommendation) return null;

  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'LEARN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <BookOpen className="w-3 h-3" /> Learn
          </span>
        );
      case 'VISUALIZE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Play className="w-3 h-3" /> Visualize
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Terminal className="w-3 h-3" /> Practice
          </span>
        );
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 relative z-10 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" /> Recommended For You
          </span>
          {renderTypeBadge(recommendation.stepType)}
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-3 h-3 fill-amber-400" /> +{recommendation.xpReward} XP
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {recommendation.stepTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {recommendation.recommendationReason}
        </p>
      </div>

      <div className="w-full md:w-auto relative z-10 shrink-0">
        <Link to={recommendation.actionUrl}>
          <button className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-950 transition-all transform hover:scale-[1.02] cursor-pointer">
            <span>Continue Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};
