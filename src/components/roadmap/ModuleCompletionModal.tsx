import React from 'react';
import { Trophy, Zap, Award, ArrowRight, X, Unlock } from 'lucide-react';

interface ModuleCompletionModalProps {
  isOpen: boolean;
  moduleTitle: string;
  xpReward: number;
  unlockedModuleName?: string;
  onClose: () => void;
  onContinue: () => void;
}

export const ModuleCompletionModal: React.FC<ModuleCompletionModalProps> = ({
  isOpen,
  moduleTitle,
  xpReward,
  unlockedModuleName,
  onClose,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto shadow-xl shadow-emerald-950">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
            🎉 Module Completed!
          </div>
          <h2 className="text-2xl font-black text-white">{moduleTitle}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You've completed all required steps, algorithms, and challenges for this module!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="text-center p-2">
            <div className="text-xs text-slate-500 font-bold uppercase">XP Earned</div>
            <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 fill-amber-400" /> +{xpReward} XP
            </div>
          </div>
          <div className="text-center p-2 border-l border-slate-800">
            <div className="text-xs text-slate-500 font-bold uppercase">Achievement</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-1">
              <Award className="w-4 h-4" /> Progress Updated
            </div>
          </div>
        </div>

        {unlockedModuleName && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-left flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase">Next Topic Unlocked</div>
              <div className="text-sm font-bold text-white">{unlockedModuleName}</div>
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
