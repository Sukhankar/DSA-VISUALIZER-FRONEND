import React, { useState } from 'react';
import { AchievementItemDto } from '../../types';
import { AchievementCard } from './AchievementCard';
import { Search, Trophy, CheckCircle2, Lock, Filter } from 'lucide-react';

interface AchievementGridProps {
  achievements: AchievementItemDto[];
  onSelectAchievement?: (achievement: AchievementItemDto) => void;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  onSelectAchievement,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const categories = [
    'ALL',
    'LEARNING',
    'PRACTICE',
    'STREAK',
    'CHALLENGE',
    'VISUALIZATION',
    'XP_COLLECTOR',
    'LEVEL',
  ];

  const filteredAchievements = achievements.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || item.category.toUpperCase() === selectedCategory;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNLOCKED' && item.unlocked) ||
      (statusFilter === 'LOCKED' && !item.unlocked);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search achievements by title or requirement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({achievements.length})
            </button>
            <button
              onClick={() => setStatusFilter('UNLOCKED')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'UNLOCKED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked ({totalUnlocked})
            </button>
            <button
              onClick={() => setStatusFilter('LOCKED')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'LOCKED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Locked ({achievements.length - totalUnlocked})
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold border-emerald-400 shadow-md shadow-emerald-900/30'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map((item) => (
            <AchievementCard
              key={item.id}
              achievement={item}
              onClick={() => onSelectAchievement && onSelectAchievement(item)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/40 rounded-2xl p-12 border border-slate-800 text-center">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">No Achievements Found</h4>
          <p className="text-xs text-slate-400">Try broadening your search or resetting category filters.</p>
        </div>
      )}
    </div>
  );
};
