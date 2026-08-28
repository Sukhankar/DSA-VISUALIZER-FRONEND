import React, { useState } from 'react';
import { DailyActivityDto } from '../../types';
import { TrendingUp, Zap, Calendar } from 'lucide-react';

interface XpTimelineChartProps {
  data: DailyActivityDto[];
}

export const XpTimelineChart: React.FC<XpTimelineChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; xp: number; x: number; y: number } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl text-center text-slate-400">
        No XP timeline data available yet.
      </div>
    );
  }

  const width = 650;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const xpValues = data.map((d) => d.xpEarned ?? 0);
  const maxXp = Math.max(...xpValues, 50);

  const points = data.map((item, idx) => {
    const x = paddingLeft + (idx / Math.max(1, data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((item.xpEarned ?? 0) / maxXp) * chartHeight;
    return { x, y, date: item.date, xp: item.xpEarned ?? 0 };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]?.x ?? 0} ${paddingTop + chartHeight} L ${points[0]?.x ?? 0} ${paddingTop + chartHeight} Z`;

  const totalXpInPeriod = xpValues.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">30-Day XP Growth Timeline</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-400" /> +{totalXpInPeriod.toLocaleString()} XP
            </span>
          </div>
          <p className="text-xs text-slate-400">Daily experience points earned over the past month</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Past 30 Days</span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          <defs>
            <linearGradient id="xpAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(maxXp * ratio);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#xpAreaGradient)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.date === pt.date ? '6' : '3.5'}
              className="fill-slate-900 stroke-amber-400 cursor-pointer transition-all duration-150"
              strokeWidth="2"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* X Axis Labels (every 5th day) */}
          {points.map((pt, idx) => {
            if (idx % 6 !== 0 && idx !== points.length - 1) return null;
            const displayDate = pt.date.substring(5); // MM-DD
            return (
              <text
                key={idx}
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                {displayDate}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-slate-950/90 border border-amber-500/30 px-3 py-1.5 rounded-lg shadow-xl text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div className="font-semibold text-slate-300">{hoveredPoint.date}</div>
            <div className="text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-400" />
              {hoveredPoint.xp} XP Earned
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
