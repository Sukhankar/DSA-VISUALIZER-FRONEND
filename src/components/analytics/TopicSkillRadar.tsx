import React from 'react';
import { TopicSkillDto } from '../../types';

interface TopicSkillRadarProps {
  skills: TopicSkillDto[];
}

export const TopicSkillRadar: React.FC<TopicSkillRadarProps> = ({ skills }) => {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const count = skills.length || 1;
  const angleStep = (2 * Math.PI) / count;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valueFactor: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueFactor;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = skills
    .map((skill, index) => {
      const factor = (skill.score || 0) / 100;
      const { x, y } = getCoordinates(index, factor);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md flex flex-col items-center">
      <div className="w-full text-left mb-2">
        <h3 className="text-lg font-bold text-white">Topic Skill Radar</h3>
        <p className="text-xs text-slate-400">Mastery breakdown calculated from completed algorithms & problems</p>
      </div>

      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric Polygons */}
          {levels.map((lvl, lIdx) => {
            const polygonPoints = skills
              .map((_, index) => {
                const { x, y } = getCoordinates(index, lvl);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={lIdx}
                points={polygonPoints}
                fill="none"
                stroke="rgba(148, 163, 184, 0.15)"
                strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            );
          })}

          {/* Axes Lines */}
          {skills.map((_, index) => {
            const { x, y } = getCoordinates(index, 1.0);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="1"
              />
            );
          })}

          {/* User Score Polygon */}
          <polygon
            points={points}
            fill="rgba(99, 102, 241, 0.35)"
            stroke="rgb(129, 140, 248)"
            strokeWidth="2.5"
          />

          {/* Vertex Points */}
          {skills.map((skill, index) => {
            const factor = (skill.score || 0) / 100;
            const { x, y } = getCoordinates(index, factor);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="rgb(165, 180, 252)"
                stroke="rgb(67, 56, 202)"
                strokeWidth="2"
              />
            );
          })}

          {/* Category Labels */}
          {skills.map((skill, index) => {
            const { x, y } = getCoordinates(index, 1.22);
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-300 text-[11px] font-semibold"
              >
                {skill.categoryName} ({skill.score}%)
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
