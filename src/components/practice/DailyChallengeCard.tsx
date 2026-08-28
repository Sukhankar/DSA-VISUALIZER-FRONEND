import React from 'react';
import { DailyChallengeDto } from '../../types';
import { Target, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DailyChallengeCardProps {
  challenge: DailyChallengeDto;
  onStart: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  onStart,
}) => {
  const isCompleted = challenge.completed;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-900/60 border border-emerald-500/30 p-6 md:p-8 shadow-xl shadow-emerald-950/40">
      {/* Background Decorative Glow */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="w-3.5 h-3.5" />
              DAILY CHALLENGE
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              +{challenge.bonusXp} BONUS XP
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {challenge.problem.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-300">
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 border border-slate-700">
                {challenge.problem.categoryName}
              </span>
              <span
                className={`font-semibold text-xs ${
                  challenge.problem.difficulty === 'EASY'
                    ? 'text-emerald-400'
                    : challenge.problem.difficulty === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {challenge.problem.difficulty}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Date: {challenge.challengeDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Completed Today
            </div>
          ) : (
            <Button
              onClick={onStart}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Start Challenge
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
