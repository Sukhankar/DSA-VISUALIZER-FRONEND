import React from 'react';
import { PracticeSessionDto } from '../../types';
import { Trophy, Zap, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { Button } from '../ui/Button';

interface SessionResultsModalProps {
  isOpen: boolean;
  session: PracticeSessionDto;
  bonusXpEarned?: number;
  onClose: () => void;
}

export const SessionResultsModal: React.FC<SessionResultsModalProps> = ({
  isOpen,
  session,
  bonusXpEarned = 150,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 md:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
            <Trophy className="w-8 h-8 text-slate-950" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest mb-2">
            SESSION COMPLETE!
          </span>

          <h2 className="text-2xl font-black text-white">Outstanding Performance!</h2>
          <p className="text-xs text-slate-400 mt-1">
            You successfully solved all problems in this practice session.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-slate-400">Solved</div>
            <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {session.solvedProblems}/{session.totalProblems}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-medium text-slate-400">Accuracy</div>
            <div className="text-lg font-bold text-emerald-400">
              {session.accuracyPercentage}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-medium text-slate-400">Total XP</div>
            <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              +{session.xpEarned}
            </div>
          </div>
        </div>

        {/* Bonus Badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left">
          <Award className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-amber-300">Completion Bonus Unlocked</div>
            <div className="text-xs text-slate-300">
              Earned +{bonusXpEarned} bonus XP for finishing all session challenges.
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-base"
        >
          Return to Arena Hub
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
