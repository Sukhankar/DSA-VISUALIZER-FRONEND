import React, { useEffect, useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface XpRewardToastProps {
  amount: number;
  message?: string;
  onClose?: () => void;
}

export const XpRewardToast: React.FC<XpRewardToastProps> = ({
  amount,
  message = 'XP Earned!',
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-500">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-0.5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)]">
        <div className="bg-slate-950/90 backdrop-blur-md rounded-[14px] px-5 py-3.5 flex items-center gap-3 border border-emerald-500/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
            <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              +{amount} XP <Sparkles className="w-4 h-4 text-amber-400 inline" />
            </div>
            <p className="text-xs text-slate-300 font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
