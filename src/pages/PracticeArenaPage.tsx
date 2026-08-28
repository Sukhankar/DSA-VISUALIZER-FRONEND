import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PracticeArenaOverviewResponse,
  PracticeMode,
} from '../types';
import { practiceService } from '../api/practiceService';
import { DailyChallengeCard } from '../components/practice/DailyChallengeCard';
import { PracticeModeGrid } from '../components/practice/PracticeModeGrid';
import { ActiveSessionBanner } from '../components/practice/ActiveSessionBanner';
import { PracticeHistoryTable } from '../components/practice/PracticeHistoryTable';
import { TopicSelectionModal } from '../components/practice/TopicSelectionModal';
import { TimedConfigModal } from '../components/practice/TimedConfigModal';
import { Flame, Zap, Trophy, Swords, Target } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const PracticeArenaPage: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<PracticeArenaOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showTimedModal, setShowTimedModal] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await practiceService.getArenaOverview();
      setOverview(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load Practice Arena overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleStartMode = async (mode: PracticeMode, categoryId?: string, timeLimitSeconds?: number) => {
    try {
      setLoading(true);
      const session = await practiceService.createSession({
        mode,
        categoryId,
        timeLimitSeconds,
      });
      navigate(`/practice/session/${session.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to start practice session');
      setLoading(false);
    }
  };

  const handleModeClick = (mode: PracticeMode) => {
    if (mode === 'DAILY') {
      handleStartMode('DAILY');
    } else if (mode === 'TOPIC') {
      setShowTopicModal(true);
    } else if (mode === 'TIMED') {
      setShowTimedModal(true);
    } else {
      handleStartMode(mode);
    }
  };

  if (loading && !overview) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-rose-400">
        <p className="text-lg font-semibold">{error || 'Something went wrong.'}</p>
        <button
          onClick={fetchOverview}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Swords className="w-4 h-4" />
            LeetCode-Style Practice Hub
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Practice Arena</h1>
          <p className="text-sm text-slate-400 mt-1">
            Challenge yourself with daily problems, timed sprints, and topic-focused coding sessions.
          </p>
        </div>

        {/* Quick User Stats */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-5 h-5 fill-orange-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-400/80">Streak</div>
              <div className="text-sm font-bold">{overview.streak.currentStreak} Days</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5 fill-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400/80">Level {overview.xp.currentLevel}</div>
              <div className="text-sm font-bold">{overview.xp.totalXp} XP</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Trophy className="w-5 h-5" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400/80">Completed</div>
              <div className="text-sm font-bold">{overview.totalCompletedSessions} Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Alert if exists */}
      {overview.activeSession && (
        <ActiveSessionBanner
          session={overview.activeSession}
          onResume={() => navigate(`/practice/session/${overview.activeSession!.id}`)}
        />
      )}

      {/* Hero Daily Challenge */}
      <DailyChallengeCard
        challenge={overview.dailyChallenge}
        onStart={() => handleStartMode('DAILY')}
      />

      {/* Practice Modes Grid */}
      <PracticeModeGrid onSelectMode={handleModeClick} />

      {/* Session History Table */}
      <PracticeHistoryTable sessions={overview.recentSessions} />

      {/* Topic Category Modal */}
      <TopicSelectionModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        onSelectCategory={(categoryId) => handleStartMode('TOPIC', categoryId)}
      />

      {/* Timed Sprint Modal */}
      <TimedConfigModal
        isOpen={showTimedModal}
        onClose={() => setShowTimedModal(false)}
        onSelectDuration={(timeLimitSeconds) => handleStartMode('TIMED', undefined, timeLimitSeconds)}
      />
    </div>
  );
};
