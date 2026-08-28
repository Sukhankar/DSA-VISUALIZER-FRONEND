import React, { useEffect, useState } from 'react';
import { profileService } from '../api/profileService';
import { BadgeItemDto } from '../types';
import { BadgeCollection } from '../components/badges/BadgeCollection';
import { Award, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<BadgeItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBadges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getBadges();
      setBadges(data || []);
    } catch (err: any) {
      console.error('Failed to load badges:', err);
      setError(err?.response?.data?.message || 'Failed to load badge collection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const totalEarned = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Award className="w-9 h-9" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Badge Vault
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Badge Collection</h1>
            <p className="text-sm text-slate-400 mt-1">Showcase rare and legendary badges earned through practice milestones</p>
          </div>
        </div>

        <div className="bg-slate-950/80 px-6 py-3.5 rounded-2xl border border-slate-800 text-center relative z-10 w-full md:w-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Earned Badges</div>
          <div className="text-2xl font-black text-cyan-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {totalEarned} / {badges.length}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Loading badge vault...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : (
        <BadgeCollection badges={badges} />
      )}
    </div>
  );
};
