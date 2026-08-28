import React from 'react';
import { PracticeMode } from '../../types';
import { Zap, Clock, BookOpen, Shuffle, Flame, Sparkles } from 'lucide-react';

interface PracticeModeGridProps {
  onSelectMode: (mode: PracticeMode) => void;
}

interface ModeCard {
  mode: PracticeMode;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

const MODES: ModeCard[] = [
  {
    mode: 'QUICK',
    title: 'Quick Practice',
    description: 'Solve 3 randomly selected problems suited to build steady habits.',
    icon: Zap,
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    badge: 'Popular',
  },
  {
    mode: 'TIMED',
    title: 'Timed Sprint',
    description: 'Race against the clock to solve 4 problems under pressure.',
    icon: Clock,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badge: 'Speed Test',
  },
  {
    mode: 'TOPIC',
    title: 'Topic Focus',
    description: 'Master specific algorithm categories like Trees, Graphs, or Dynamic Programming.',
    icon: BookOpen,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    badge: 'Category',
  },
  {
    mode: 'STREAK',
    title: 'Streak Builder',
    description: 'Target problems that keep your daily practice streak alive and growing.',
    icon: Flame,
    color: 'from-rose-500/20 to-orange-500/10 border-rose-500/30 text-rose-400',
    badge: 'Streak Boost',
  },
  {
    mode: 'RANDOM',
    title: 'Random Shuffle',
    description: 'Surprise yourself with mixed topics and difficulties for interview readiness.',
    icon: Shuffle,
    color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-400',
    badge: 'Surprise',
  },
];

export const PracticeModeGrid: React.FC<PracticeModeGridProps> = ({ onSelectMode }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Choose Practice Mode
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`group relative cursor-pointer rounded-2xl bg-gradient-to-br ${item.color} bg-slate-900/60 p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Start Mode</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
