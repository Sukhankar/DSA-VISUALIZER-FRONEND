import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categoryService';
import { AlgorithmCategory } from '../types';
import { getErrorMessage } from '../utils/errorUtils';
import { HeroSection } from '../components/home/HeroSection';
import { GamificationStats } from '../components/home/GamificationStats';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { ArrowRight, BarChart3, Search, Layers, GitGraph, Network, FolderGit2 } from 'lucide-react';

const CAT_ICONS: Record<string, React.ReactNode> = {
  sorting:          <BarChart3 className="w-5 h-5 text-indigo-400" />,
  searching:        <Search    className="w-5 h-5 text-cyan-400" />,
  'data-structures':<Layers   className="w-5 h-5 text-emerald-400" />,
  trees:            <GitGraph  className="w-5 h-5 text-amber-400" />,
  graphs:           <Network   className="w-5 h-5 text-purple-400" />,
  arrays:           <Layers    className="w-5 h-5 text-indigo-400" />,
};

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<AlgorithmCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load categories from backend.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <div className="space-y-6 pb-8">

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Stats row */}
      <GamificationStats />

      {/* 3. Browse by Category */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Browse by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore our catalog of algorithm categories seeded directly from the backend
            </p>
          </div>
          <Link
            to="/algorithms"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group"
          >
            View All Categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading categories..." size="lg" />
        ) : error ? (
          <ErrorMessage title="API Connection Error" message={error} onRetry={fetchCategories} />
        ) : categories.length === 0 ? (
          <EmptyState title="No Categories Found" description="Backend returned an empty category list." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/algorithms?category=${cat.slug}`} className="group">
                <div className="h-full rounded-xl border border-slate-800/80 bg-[#0c1222] hover:border-slate-700 transition-all p-5 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {CAT_ICONS[cat.slug] ?? <FolderGit2 className="w-5 h-5 text-slate-400" />}
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        Order #{cat.displayOrder}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-600">slug: {cat.slug}</span>
                    <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      Browse Algorithms <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
