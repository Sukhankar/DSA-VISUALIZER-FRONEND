import React from 'react';
import { PracticeSessionDto } from '../../types';
import { Clock, Zap, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface SessionHeaderBarProps {
  session: PracticeSessionDto;
  timeLeftSeconds?: number | null;
  onAbandon: () => void;
  onBackToArena: () => void;
}

export const SessionHeaderBar: React.FC<SessionHeaderBarProps> = ({
  session,
  timeLeftSeconds,
  onAbandon,
  onBackToArena,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToArena}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Arena
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              {session.mode} MODE
            </span>
            {session.categoryName && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {session.categoryName}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Practice Session</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Progress indicators */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Session Progress</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {session.solvedProblems} / {session.totalProblems} Solved
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-800" />

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Session XP</div>
            <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              +{session.xpEarned} XP
            </div>
          </div>
        </div>

        {/* Timer if Timed Mode */}
        {timeLeftSeconds !== undefined && timeLeftSeconds !== null && (
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono font-bold text-sm ${
              timeLeftSeconds < 180
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-950/80 text-amber-400 border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeftSeconds)}
          </div>
        )}

        {session.status === 'IN_PROGRESS' && (
          <Button
            variant="secondary"
            onClick={onAbandon}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border-rose-500/30"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Abandon
          </Button>
        )}
      </div>
    </div>
  );
};
