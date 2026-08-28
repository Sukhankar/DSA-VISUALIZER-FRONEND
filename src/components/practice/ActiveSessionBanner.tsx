import React from 'react';
import { PracticeSessionDto } from '../../types';
import { Play, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ActiveSessionBannerProps {
  session: PracticeSessionDto;
  onResume: () => void;
}

export const ActiveSessionBanner: React.FC<ActiveSessionBannerProps> = ({
  session,
  onResume,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/40 p-5 shadow-lg shadow-indigo-950/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ACTIVE SESSION ({session.mode})
              </span>
              <span className="text-xs text-slate-400">
                {session.solvedProblems} / {session.totalProblems} Solved
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              You have an unfinished practice session in progress
            </h4>
          </div>
        </div>

        <Button
          onClick={onResume}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 shrink-0 self-end sm:self-center"
        >
          <Play className="w-4 h-4 fill-white" />
          Resume Session
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
