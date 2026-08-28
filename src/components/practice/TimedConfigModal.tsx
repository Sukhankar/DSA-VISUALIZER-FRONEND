import React, { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface TimedConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDuration: (timeLimitSeconds: number) => void;
}

const TIMER_OPTIONS = [
  { label: '15 Minutes', seconds: 900, description: 'Rapid sprint mode (approx. 3.5 mins/problem)' },
  { label: '30 Minutes', seconds: 1800, description: 'Standard interview speed test (7.5 mins/problem)' },
  { label: '45 Minutes', seconds: 2700, description: 'Full mock assessment mode (11 mins/problem)' },
];

export const TimedConfigModal: React.FC<TimedConfigModalProps> = ({
  isOpen,
  onClose,
  onSelectDuration,
}) => {
  const [selectedSeconds, setSelectedSeconds] = useState<number>(1800);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Configure Timed Sprint</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {TIMER_OPTIONS.map((opt) => {
            const isSelected = selectedSeconds === opt.seconds;
            return (
              <div
                key={opt.seconds}
                onClick={() => setSelectedSeconds(opt.seconds)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-amber-300">{opt.label}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSelectDuration(selectedSeconds);
              onClose();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            Start Timed Sprint
          </Button>
        </div>
      </div>
    </div>
  );
};
