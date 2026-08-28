import React, { useEffect, useState } from 'react';
import { profileService } from '../api/profileService';
import { AchievementItemDto } from '../types';
import { AchievementGrid } from '../components/achievements/AchievementGrid';
import { AchievementUnlockModal } from '../components/achievements/AchievementUnlockModal';
import { Trophy, Loader2, Zap, CheckCircle2 } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItemDto[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getAchievements();
      setAchievements(data || []);
    } catch (err: any) {
      console.error('Failed to load achievements:', err);
      setError(err?.response?.data?.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;
  const totalXpClaimed = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-8">
      {/* Page Hero Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 shadow-xl shadow-amber-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Trophy className="w-9 h-9" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-1">
              Gamification Trophies
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Achievements Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Unlock badges and claim XP rewards by mastering algorithms & practice challenges</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <div className="flex-1 md:flex-initial bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Unlocked</div>
            <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {totalUnlocked} / {achievements.length}
            </div>
          </div>

          <div className="flex-1 md:flex-initial bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">XP Claimed</div>
            <div className="text-xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" /> {totalXpClaimed.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Fetching achievements data...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : (
        <AchievementGrid
          achievements={achievements}
          onSelectAchievement={(item) => setSelectedAchievement(item)}
        />
      )}

      {/* Unlock Popup Modal */}
      <AchievementUnlockModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
};
