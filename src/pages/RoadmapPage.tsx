import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roadmapService } from '../api/roadmapService';
import { RoadmapModuleDto, LearningRecommendationDto, UserRoadmapDto } from '../types';
import { RoadmapTree } from '../components/roadmap/RoadmapTree';
import { NextRecommendationCard } from '../components/learning/NextRecommendationCard';
import { Map, Compass, Loader2, Trophy, Clock } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [userRoadmap, setUserRoadmap] = useState<UserRoadmapDto | null>(null);
  const [modules, setModules] = useState<RoadmapModuleDto[]>([]);
  const [recommendation, setRecommendation] = useState<LearningRecommendationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoadmapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fullData, recData] = await Promise.all([
        roadmapService.getUserRoadmapFull().catch(async () => {
          const mods = await roadmapService.getUserRoadmap();
          return {
            path: { name: 'DSA Beginner Path' },
            overallProgress: Math.round((mods.filter((m) => m.status === 'COMPLETED').length / (mods.length || 1)) * 100),
            currentModule: mods.find((m) => m.status === 'IN_PROGRESS') || mods[0] || null,
            modules: mods,
          } as UserRoadmapDto;
        }),
        roadmapService.getSmartRecommendation().catch(() => null),
      ]);

      setUserRoadmap(fullData);
      setModules(fullData.modules || []);
      setRecommendation(recData);
    } catch (err: any) {
      console.error('Failed to load roadmap data:', err);
      setError(err?.response?.data?.message || 'Failed to load learning roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmapData();
  }, []);

  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.status === 'COMPLETED').length;
  const overallProgress = userRoadmap?.overallProgress ?? (totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0);

  return (
    <div className="space-y-8">
      {/* Page Hero Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-0.5 shadow-xl shadow-indigo-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Map className="w-9 h-9" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-1">
              {userRoadmap?.path?.name || 'DSA Beginner Path'}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Your DSA Journey</h1>
            <p className="text-sm text-slate-400 mt-1">Structured module progression from Fundamentals to Advanced Master</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <Link to="/onboarding" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer">
              <Compass className="w-4 h-4" />
              <span>Beginner Assessment</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Overall Path Progress Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" /> Overall Path Progress
            </div>
            <div className="text-2xl font-black text-white">
              {completedModules} of {totalModules} Modules Mastered ({overallProgress}%)
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Est. Completion: 24h total</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Smart Recommendation Card */}
      {recommendation && <NextRecommendationCard recommendation={recommendation} />}

      {/* Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Building visual learning pathway...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : (
        <RoadmapTree modules={modules} />
      )}
    </div>
  );
};
