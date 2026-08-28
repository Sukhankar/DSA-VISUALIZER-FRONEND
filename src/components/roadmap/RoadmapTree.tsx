import React from 'react';
import { RoadmapModuleDto, RoadmapTier } from '../../types';
import { RoadmapModuleCard } from './RoadmapModuleCard';
import { Sparkles, ShieldAlert, Award } from 'lucide-react';

interface RoadmapTreeProps {
  modules: RoadmapModuleDto[];
}

export const RoadmapTree: React.FC<RoadmapTreeProps> = ({ modules }) => {
  const tiers: { tier: RoadmapTier; title: string; subtitle: string; color: string }[] = [
    {
      tier: 'BEGINNER',
      title: 'Beginner Foundations',
      subtitle: 'Core data structures, indexing, and elementary sorting/searching algorithms',
      color: 'from-emerald-500 to-teal-400',
    },
    {
      tier: 'INTERMEDIATE',
      title: 'Intermediate Data Structures',
      subtitle: 'Pointers, memory nodes, non-linear hierarchies, and stack/queue abstractions',
      color: 'from-indigo-500 to-cyan-400',
    },
    {
      tier: 'ADVANCED',
      title: 'Advanced Algorithmic Mastery',
      subtitle: 'Graph networks, shortest paths, dynamic subproblems, and optimization',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {tiers.map((t) => {
        const tierModules = modules.filter((m) => m.tier === t.tier);
        if (tierModules.length === 0) return null;

        return (
          <div key={t.tier} className="space-y-6 relative">
            {/* Tier Banner Header */}
            <div className="flex items-center gap-4">
              <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${t.color}`} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">{t.title}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 uppercase tracking-wider">
                    {t.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {tierModules.map((module) => (
                <RoadmapModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
