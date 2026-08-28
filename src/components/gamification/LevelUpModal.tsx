import React from 'react';
import { Trophy, Sparkles, Award, ArrowRight } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  title,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
        {/* Glow Background */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-1 shadow-lg shadow-emerald-500/30 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Celebration <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">LEVEL UP!</h2>
          <p className="text-slate-400 text-sm mb-6">You've reached a new algorithmic milestone!</p>

          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 mb-6 relative">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-2">
              Level {newLevel}
            </div>
            <div className="text-base font-bold text-slate-200 flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-amber-400" />
              {title}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            Claim Rewards & Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
