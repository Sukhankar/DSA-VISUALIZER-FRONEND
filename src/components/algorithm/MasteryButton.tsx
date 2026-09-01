import React, { useState } from 'react';
import { Award, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { toggleMastery } from '../../api/algorithmService';
import { useAuth } from '../../hooks/useAuth';

interface MasteryButtonProps {
  slug: string;
  initialMastered?: boolean;
  onMasteryChange?: (mastered: boolean) => void;
}

export const MasteryButton: React.FC<MasteryButtonProps> = ({
  slug,
  initialMastered = false,
  onMasteryChange,
}) => {
  const { isAuthenticated } = useAuth();
  const [isMastered, setIsMastered] = useState<boolean>(initialMastered);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showXpBanner, setShowXpBanner] = useState<boolean>(false);

  const handleToggle = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const res = await toggleMastery(slug);
      setIsMastered(res.mastered);
      if (onMasteryChange) onMasteryChange(res.mastered);

      if (res.newlyMastered) {
        setShowXpBanner(true);
        setTimeout(() => setShowXpBanner(false), 4000);
      }
    } catch (err) {
      console.warn('Failed to toggle algorithm mastery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      {showXpBanner && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 animate-bounce whitespace-nowrap bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-emerald-950 flex items-center gap-1.5 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>+100 XP Mastered!</span>
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={isLoading || !isAuthenticated}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-lg ${
          isMastered
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow-emerald-950/40'
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isAuthenticated ? (isMastered ? 'Algorithm Mastered' : 'Mark as Mastered (+100 XP)') : 'Log in to track mastery'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        ) : isMastered ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mastered</span>
          </>
        ) : (
          <>
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mark as Mastered</span>
          </>
        )}
      </button>
    </div>
  );
};
