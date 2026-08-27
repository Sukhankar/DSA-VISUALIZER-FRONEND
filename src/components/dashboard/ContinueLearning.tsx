import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressResponse } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from './ProgressBar';
import { Button } from '../ui/Button';
import { Play, Sparkles, Compass } from 'lucide-react';

interface ContinueLearningProps {
  items: ProgressResponse[];
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ items }) => {
  const inProgressItems = items.filter((item) => item.status === 'IN_PROGRESS');

  if (inProgressItems.length === 0) {
    return (
      <Card className="p-8 text-center space-y-3 bg-slate-900/60 border-slate-800">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-100">No Algorithms Currently In Progress</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Pick an algorithm from the catalog to launch step-by-step visual learning.
        </p>
        <Link to="/algorithms" className="inline-block pt-2">
          <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}>
            Explore Algorithm Catalog
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inProgressItems.map((item) => (
        <Card key={item.algorithmId || item.algorithmSlug} className="p-5 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-slate-100">{item.algorithmName}</h4>
              <span className="text-[11px] font-mono text-slate-400">
                Slug: {item.algorithmSlug}
              </span>
            </div>

            <Link to={`/visualize/${item.algorithmSlug}`}>
              <Button variant="primary" size="sm" leftIcon={<Play className="w-3.5 h-3.5 fill-white" />}>
                Continue
              </Button>
            </Link>
          </div>

          <ProgressBar value={item.progressPercentage} size="md" variant="indigo" />
        </Card>
      ))}
    </div>
  );
};
