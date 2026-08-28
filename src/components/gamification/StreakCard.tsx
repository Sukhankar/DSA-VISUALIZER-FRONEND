import React from 'react';
import { StreakStatusDto } from '../../types';
import { Flame, Shield, Trophy, Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface StreakCardProps {
  streak?: StreakStatusDto;
  currentStreak?: number;
  longestStreak?: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  currentStreak = 0,
  longestStreak = 0,
}) => {
  const current = streak?.currentStreak ?? currentStreak;
  const longest = streak?.longestStreak ?? longestStreak;
  const activeToday = streak?.activeToday ?? false;
  const freezeCount = streak?.streakFreezeCount ?? 0;
  const nextMilestone = streak?.nextMilestoneDays ?? 7;
  const daysRemaining = streak?.daysToNextMilestone ?? Math.max(0, nextMilestone - current);

  // Simulated week days
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIndex = new Date().getDay();

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background Flame Glow */}
      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Daily Practice Streak</h3>
            <p className="text-xs text-slate-400">Consistency is the key to mastery</p>
          </div>
        </div>

        {activeToday ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Today
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5" /> Complete 1 Task Today
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            <Flame className="w-7 h-7 fill-amber-400 text-amber-400 inline" /> {current}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Current Streak Days</p>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-3xl font-black text-slate-100">
            <Trophy className="w-6 h-6 text-amber-400 inline" /> {longest}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Longest Record</p>
        </div>
      </div>

      {/* Week Progress */}
      <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-800/80 mb-4">
        <div className="text-xs text-slate-400 font-semibold mb-2 flex justify-between">
          <span>This Week's Activity</span>
          <span className="text-amber-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" /> Freezes: {freezeCount}
          </span>
        </div>
        <div className="flex justify-between items-center px-1">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isPast = idx <= todayIndex;
            const isDone = isPast && (activeToday || idx < todayIndex);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-bold ${isToday ? 'text-amber-400' : 'text-slate-500'}`}>{day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : isToday
                      ? 'border-2 border-amber-400/80 bg-amber-400/10 text-amber-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Next Milestone: {nextMilestone} Days
        </span>
        <span className="text-amber-400 font-semibold">{daysRemaining} days remaining</span>
      </div>
    </div>
  );
};
