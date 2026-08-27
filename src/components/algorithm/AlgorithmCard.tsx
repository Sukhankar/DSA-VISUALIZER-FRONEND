import React from 'react';
import { Link } from 'react-router-dom';
import { Algorithm } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowRight, Clock, HardDrive, Play } from 'lucide-react';

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
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
    <Card hover className="flex flex-col justify-between h-full group">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="indigo">{algorithm.categoryName || 'General'}</Badge>
          {getDifficultyBadge(algorithm.difficulty)}
        </div>

        {/* Algorithm Title & Description */}
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {algorithm.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2.5rem]">
            {algorithm.description || 'No description available for this algorithm.'}
          </p>
        </div>

        {/* Complexity Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Time</span>
              <span className="font-mono font-medium text-slate-300 truncate">
                {algorithm.timeComplexity || 'O(N)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
            <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Space</span>
              <span className="font-mono font-medium text-slate-300 truncate">
                {algorithm.spaceComplexity || 'O(1)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Links */}
      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800/60">
        <Link
          to={`/algorithms/${algorithm.slug}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        <Link
          to={`/visualize/${algorithm.slug}`}
          className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Play className="w-3 h-3 text-indigo-400 fill-indigo-400" />
          <span>Visualize</span>
        </Link>
      </div>
    </Card>
  );
};
