import React, { useMemo } from 'react';
import { DailyActivityDto } from '../../types';

interface ActivityHeatmapProps {
  activities: DailyActivityDto[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activities }) => {
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activities.forEach((act) => {
      map.set(act.date, act.count);
    });
    return map;
  }, [activities]);

  const days = useMemo(() => {
    const dates: { dateStr: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();
    // 52 weeks * 7 days = 364 days
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;
      dates.push({
        dateStr,
        count,
        dayOfWeek: d.getDay()
      });
    }
    return dates;
  }, [activityMap]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-slate-800/80 border-slate-700/50';
    if (count <= 2) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (count <= 5) return 'bg-emerald-700 border-emerald-600 text-white';
    if (count <= 8) return 'bg-emerald-500 border-emerald-400 text-white';
    return 'bg-emerald-300 border-emerald-200 text-slate-950 shadow-sm shadow-emerald-400';
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Activity Heatmap</h3>
          <p className="text-xs text-slate-400">Contributions and learning activity over the past year</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-xs bg-slate-800 border border-slate-700" />
          <div className="w-3 h-3 rounded-xs bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded-xs bg-emerald-700 border border-emerald-600" />
          <div className="w-3 h-3 rounded-xs bg-emerald-500 border border-emerald-400" />
          <div className="w-3 h-3 rounded-xs bg-emerald-300 border border-emerald-200" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[720px]">
          {days.map((d, index) => (
            <div
              key={index}
              title={`${d.dateStr}: ${d.count} activities`}
              className={`w-3.5 h-3.5 rounded-xs border transition-colors cursor-pointer hover:scale-125 ${getIntensityClass(
                d.count
              )}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
