import React from 'react';
import { Link } from 'react-router-dom';
import { RelatedAlgorithmSummary } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowRight, Link2 } from 'lucide-react';

interface RelatedAlgorithmsProps {
  algorithms: RelatedAlgorithmSummary[];
}

export const RelatedAlgorithms: React.FC<RelatedAlgorithmsProps> = ({ algorithms }) => {
  if (!algorithms || algorithms.length === 0) return null;

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return <Badge variant="success">Easy</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      case 'HARD':
        return <Badge variant="danger">Hard</Badge>;
      default:
        return <Badge variant="neutral">{difficulty}</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
        <Link2 className="w-4 h-4 text-indigo-400" />
        <span>Related Algorithms</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {algorithms.map((alg) => (
          <Link
            key={alg.id}
            to={`/algorithms/${alg.slug}`}
            className="group p-3 bg-slate-950/60 hover:bg-slate-900/90 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                {alg.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{alg.categoryName}</span>
                {getDifficultyBadge(alg.difficulty)}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};
