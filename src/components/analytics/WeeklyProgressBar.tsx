import React from 'react';
import { DailyActivityDto } from '../../types';
import { BarChart2, CheckCircle } from 'lucide-react';

interface WeeklyProgressBarProps {
  activities: DailyActivityDto[];
}

export const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({ activities }) => {
  // Aggregate last 8 weeks of activity
  const weeks = React.useMemo(() => {
    const weeklyData: { weekLabel: string; count: number; xp: number }[] = [];
    const today = new Date();

    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - w * 7 - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - w * 7);

      const label = `W${8 - w}`;
      let totalCount = 0;
      let totalXp = 0;

      activities.forEach((act) => {
        const actDate = new Date(act.date);
        if (actDate >= weekStart && actDate <= weekEnd) {
          totalCount += act.count ?? 0;
          totalXp += act.xpEarned ?? 0;
        }
      });

      weeklyData.push({
        weekLabel: label,
        count: totalCount,
        xp: totalXp,
      });
    }

    return weeklyData;
  }, [activities]);

  const maxCount = Math.max(...weeks.map((w) => w.count), 5);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            Weekly Practice Activity
          </h3>
          <p className="text-xs text-slate-400">Total problems & algorithms completed per week (last 8 weeks)</p>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 items-end h-40 pt-4 border-b border-slate-800">
        {weeks.map((wk, idx) => {
          const heightPercent = Math.min(100, Math.max(10, Math.round((wk.count / maxCount) * 100)));
          return (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {wk.count}
              </span>
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-500 group-hover:to-cyan-300 shadow-lg shadow-indigo-500/20"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[11px] font-semibold text-slate-400 mt-1">{wk.weekLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Active Learning Trend</span>
        </div>
        <span>Highest: {maxCount} activities/week</span>
      </div>
    </div>
  );
};
