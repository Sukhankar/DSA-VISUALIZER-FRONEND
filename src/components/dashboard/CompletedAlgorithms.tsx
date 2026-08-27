import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressResponse } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Eye, Play } from 'lucide-react';

interface CompletedAlgorithmsProps {
  items: ProgressResponse[];
}

export const CompletedAlgorithms: React.FC<CompletedAlgorithmsProps> = ({ items }) => {
  const completedItems = items.filter((item) => item.status === 'COMPLETED');

  if (completedItems.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2 bg-slate-900/40 border-slate-800">
        <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-300">No Completed Algorithms Yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Complete step-by-step visualization for any algorithm to unlock achievement completion!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {completedItems.map((item) => (
        <Card
          key={item.algorithmId || item.algorithmSlug}
          className="p-4 flex flex-col justify-between space-y-3 bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/30 transition-colors"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-100 truncate">{item.algorithmName}</h4>
              <Badge variant="success">COMPLETED</Badge>
            </div>
            {item.completedAt && (
              <p className="text-[10px] font-mono text-slate-500">
                Completed on {new Date(item.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-800/60 pt-2.5">
            <Link to={`/algorithms/${item.algorithmSlug}`} className="flex-1">
              <button className="w-full py-1 px-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Details</span>
              </button>
            </Link>

            <Link to={`/visualize/${item.algorithmSlug}`} className="flex-1">
              <button className="w-full py-1 px-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-indigo-300" />
                <span>Replay</span>
              </button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
