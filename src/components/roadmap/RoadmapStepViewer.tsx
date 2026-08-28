import React from 'react';
import { Link } from 'react-router-dom';
import { RoadmapModuleDto, RoadmapStepDto } from '../../types';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Play,
  Terminal,
  Trophy,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface RoadmapStepViewerProps {
  module: RoadmapModuleDto;
}

export const RoadmapStepViewer: React.FC<RoadmapStepViewerProps> = ({ module }) => {
  const steps = module.steps || [];

  const getStepIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;

    switch (type) {
      case 'LEARN': return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'VISUALIZE': return <Play className="w-5 h-5 text-amber-400" />;
      case 'PRACTICE': return <Terminal className="w-5 h-5 text-indigo-400" />;
      case 'CHALLENGE': return <Trophy className="w-5 h-5 text-purple-400" />;
      case 'MASTER': return <Award className="w-5 h-5 text-emerald-400" />;
      default: return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActionLink = (step: RoadmapStepDto) => {
    if (step.referenceSlug) {
      if (step.stepType === 'VISUALIZE') {
        return `/visualize/${step.referenceSlug}`;
      }
      if (step.stepType === 'PRACTICE' || step.stepType === 'CHALLENGE') {
        return `/problems/${step.referenceSlug}`;
      }
      if (step.stepType === 'LEARN') {
        return `/algorithms/${step.referenceSlug}`;
      }
    }
    return `/algorithms`;
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            5-Step Topic Learning Path
          </div>
          <h2 className="text-2xl font-black text-white">{module.title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{module.description}</p>
        </div>

        <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-center shrink-0 w-full md:w-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Module Bonus</div>
          <div className="text-xl font-black text-amber-300 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-amber-400" /> +{module.xpReward} XP
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4 relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 z-0" />

        {steps.map((step) => {
          const actionLink = getActionLink(step);

          return (
            <div
              key={step.id}
              className={`rounded-2xl p-5 border transition-all duration-200 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                step.completed
                  ? 'bg-slate-900/90 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    step.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  {getStepIcon(step.stepType, step.completed)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Step {step.stepNumber} • {step.stepType}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 px-2 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                      +{step.xpReward} XP
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0">
                <Link to={actionLink}>
                  <button
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      step.completed
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    <span>{step.completed ? 'Review Step' : 'Start Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
