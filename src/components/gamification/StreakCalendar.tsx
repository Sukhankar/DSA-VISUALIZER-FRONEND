import React from 'react';
import { DailyActivityDto } from '../../types';
import { Calendar } from 'lucide-react';

interface StreakCalendarProps {
  activityHeatmap?: DailyActivityDto[];
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ activityHeatmap = [] }) => {
  // Generate 28 days grid for visual heatmap calendar representation
  const activityMap = new Map<string, number>();
  activityHeatmap.forEach((item) => {
    activityMap.set(item.date, item.count);
  });

  const today = new Date();
  const days: { dateStr: string; count: number }[] = [];

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dateStr,
      count: activityMap.get(dateStr) || 0,
    });
  }

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-slate-900 border-slate-800';
    if (count === 1) return 'bg-emerald-900/60 border-emerald-700/50 text-emerald-300';
    if (count === 2) return 'bg-emerald-700/80 border-emerald-500/50 text-emerald-200';
    if (count >= 3) return 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    return 'bg-slate-900 border-slate-800';
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">4-Week Activity Heatmap</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
          <div className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-700/50" />
          <div className="w-3 h-3 rounded bg-emerald-700/80 border border-emerald-500/50" />
          <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((item, idx) => (
          <div
            key={idx}
            title={`${item.dateStr}: ${item.count} activities`}
            className={`h-9 rounded-lg border flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-105 cursor-pointer ${getHeatColor(
              item.count
            )}`}
          >
            {item.dateStr.split('-')[2]}
          </div>
        ))}
      </div>
    </div>
  );
};
