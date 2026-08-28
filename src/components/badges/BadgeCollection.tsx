import React, { useState } from 'react';
import { BadgeItemDto } from '../../types';
import { BadgeCard } from './BadgeCard';
import { Award, CheckCircle2, Lock, Sparkles, Filter, X } from 'lucide-react';

interface BadgeCollectionProps {
  badges: BadgeItemDto[];
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges }) => {
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EARNED' | 'LOCKED'>('ALL');
  const [activeBadge, setActiveBadge] = useState<BadgeItemDto | null>(null);

  const rarities = ['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

  const earnedCount = badges.filter((b) => b.earned).length;
  const earnedPercent = badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0;

  const filteredBadges = badges.filter((badge) => {
    const matchesRarity =
      selectedRarity === 'ALL' || badge.rarity.toUpperCase() === selectedRarity;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'EARNED' && badge.earned) ||
      (statusFilter === 'LOCKED' && !badge.earned);

    return matchesRarity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Badge Showcase</h3>
            <p className="text-xs text-slate-400">Collect rare achievement badges as you master algorithms</p>
          </div>
        </div>

        <div className="w-full md:w-64 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>Collection Progress</span>
            <span className="text-emerald-400">{earnedCount} / {badges.length} ({earnedPercent}%)</span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${earnedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Status Filters */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            onClick={() => setStatusFilter('EARNED')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'EARNED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Earned ({earnedCount})
          </button>
          <button
            onClick={() => setStatusFilter('LOCKED')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'LOCKED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Locked ({badges.length - earnedCount})
          </button>
        </div>

        {/* Rarity Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Rarity:
          </span>
          {rarities.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                selectedRarity === r
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onClick={() => setActiveBadge(badge)} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/40 rounded-2xl p-12 border border-slate-800 text-center">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">No Badges Match Filter</h4>
          <p className="text-xs text-slate-400">Select another filter combination to view available badges.</p>
        </div>
      )}

      {/* Badge Detail Modal */}
      {activeBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setActiveBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 flex items-center justify-center text-slate-950 shadow-lg">
              <Award className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-2 inline-block">
              {activeBadge.rarity}
            </span>

            <h3 className="text-xl font-extrabold text-white mb-2">{activeBadge.name}</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">{activeBadge.description}</p>

            <button
              onClick={() => setActiveBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
