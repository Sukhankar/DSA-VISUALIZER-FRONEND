import React from 'react';
import { Link } from 'react-router-dom';
import { RoadmapModuleDto } from '../../types';
import {
  Lock,
  CheckCircle2,
  Play,
  Zap,
  ArrowRight,
  LayoutGrid,
  ArrowDownUp,
  Search,
  Link as LinkIcon,
  Layers,
  GitBranch,
  Share2,
  Cpu,
  BookOpen,
} from 'lucide-react';

interface RoadmapModuleCardProps {
  module: RoadmapModuleDto;
}

export const RoadmapModuleCard: React.FC<RoadmapModuleCardProps> = ({ module }) => {
  const isLocked = module.status === 'LOCKED';
  const isCompleted = module.status === 'COMPLETED';
  const isInProgress = module.status === 'IN_PROGRESS';

  // Icon mapper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'layout-grid': return <LayoutGrid className="w-5 h-5" />;
      case 'arrow-down-up': return <ArrowDownUp className="w-5 h-5" />;
      case 'search': return <Search className="w-5 h-5" />;
      case 'link': return <LinkIcon className="w-5 h-5" />;
      case 'layers': return <Layers className="w-5 h-5" />;
      case 'git-branch': return <GitBranch className="w-5 h-5" />;
      case 'share-2': return <Share2 className="w-5 h-5" />;
      case 'cpu': return <Cpu className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isCompleted
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : isInProgress
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-950/30 ring-1 ring-indigo-500/20'
          : 'bg-slate-900/40 border-slate-800/80 opacity-75'
      }`}
    >
      {/* Background glow for active modules */}
      {isInProgress && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isInProgress
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            {renderIcon(module.iconName)}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Zap className="w-3 h-3 fill-amber-400" /> +{module.xpReward} XP
            </span>

            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 animate-pulse">
                <Play className="w-3 h-3 fill-indigo-400" /> Active
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-black text-white tracking-tight">{module.title}</h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{module.description}</p>
      </div>

      {/* Footer / Progress section */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="text-slate-500">Module Progress</span>
            <span className={isCompleted ? 'text-emerald-400' : 'text-indigo-400'}>
              {module.completionPercentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
              }`}
              style={{ width: `${module.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 italic">
            <Lock className="w-3.5 h-3.5" />
            <span>Complete {module.prerequisiteModuleTitle || 'prerequisites'} first</span>
          </div>
        ) : (
          <Link to={`/roadmap/topics/${module.slug}`}>
            <button
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isCompleted
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <span>{isCompleted ? 'Review Topic Path' : 'Continue Topic Path'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
