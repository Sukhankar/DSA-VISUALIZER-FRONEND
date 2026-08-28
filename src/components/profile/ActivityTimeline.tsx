import React from 'react';
import { UserActivityDto } from '../../types';
import { Target, BookOpen, Swords, Flame, Trophy, Award, Zap, Clock, Calendar } from 'lucide-react';

interface ActivityTimelineProps {
  activities: UserActivityDto[];
  loading?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, loading = false }) => {
  const getActivityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PROBLEM_SOLVED':
        return { icon: Target, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'ALGORITHM_COMPLETED':
      case 'ALGORITHM_VISUALIZATION':
        return { icon: BookOpen, bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'PRACTICE_SESSION_COMPLETED':
        return { icon: Swords, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'ACHIEVEMENT_UNLOCKED':
        return { icon: Trophy, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'BADGE_EARNED':
      case 'BADGE_UNLOCK':
        return { icon: Award, bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'DAILY_STREAK':
      case 'STREAK_MILESTONE':
        return { icon: Flame, bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
      default:
        return { icon: Zap, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-900/60 rounded-xl animate-pulse border border-slate-800" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 text-center">
        <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-300 mb-1">No Activity Logged Yet</p>
        <p className="text-xs text-slate-500">Solve coding problems or study algorithms to build your activity history.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4 border-l border-slate-800 space-y-6">
      {activities.map((item) => {
        const { icon: Icon, bg } = getActivityIcon(item.activityType);
        return (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border ${bg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {item.metadata || item.activityType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> {formatDate(item.createdAt)}
                  </span>
                  {item.referenceType && (
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-bold text-slate-500 border border-slate-800 uppercase">
                      {item.referenceType}
                    </span>
                  )}
                </div>
              </div>

              {item.xpEarned > 0 && (
                <div className="self-start sm:self-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-xs flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{item.xpEarned} XP
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
