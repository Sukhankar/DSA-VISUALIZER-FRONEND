import React, { useEffect, useState } from 'react';
import { AlgorithmCategory } from '../../types';
import { algorithmService } from '../../api/algorithmService';
import { X, BookOpen, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<AlgorithmCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      algorithmService
        .getAllCategories()
        .then((res: AlgorithmCategory[]) => {
          setCategories(res);
          if (res.length > 0) setSelectedId(String(res[0].id));
        })
        .catch((err: any) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Select Topic Category</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading categories...</div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {categories.map((cat) => {
              const catIdStr = String(cat.id);
              const isSelected = selectedId === catIdStr;
              return (
                <div
                  key={catIdStr}
                  onClick={() => setSelectedId(catIdStr)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-sm">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selectedId}
            onClick={() => {
              if (selectedId) {
                onSelectCategory(selectedId);
                onClose();
              }
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold"
          >
            Start Topic Session
          </Button>
        </div>
      </div>
    </div>
  );
};
