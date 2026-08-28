import React from 'react';
import { Link } from 'react-router-dom';
import { LearningRecommendationDto } from '../../types';
import { Sparkles, ArrowRight, Zap, Play, CheckCircle2, Code2, BookOpen } from 'lucide-react';

interface NextRecommendationCardProps {
  recommendation: LearningRecommendationDto;
}

export const NextRecommendationCard: React.FC<NextRecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-950 flex-shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
            {recommendation.type === 'ALGORITHM' ? (
              <Code2 className="w-7 h-7" />
            ) : recommendation.type === 'PROBLEM' ? (
              <Zap className="w-7 h-7" />
            ) : (
              <BookOpen className="w-7 h-7" />
            )}
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Recommended For You
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">{recommendation.title}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">{recommendation.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto relative z-10 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{recommendation.xpReward} XP
          </div>
          {recommendation.progress !== undefined && (
            <div className="text-[10px] text-slate-400 mt-1 font-mono">{recommendation.progress}% Completed</div>
          )}
        </div>

        <Link to={recommendation.actionUrl} className="w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-950 cursor-pointer transition-all">
            <span>{recommendation.actionLabel || 'Continue Learning'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};
