import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categoryService';
import { AlgorithmCategory } from '../types';
import { getErrorMessage } from '../utils/errorUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FolderGit2,
  BarChart3,
  Search,
  GitGraph,
  Layers,
  Network,
} from 'lucide-react';

// Icon mapper for seeded categories
const categoryIcons: Record<string, React.ReactNode> = {
  sorting: <BarChart3 className="w-6 h-6 text-indigo-400" />,
  searching: <Search className="w-6 h-6 text-cyan-400" />,
  'data-structures': <Layers className="w-6 h-6 text-emerald-400" />,
  trees: <GitGraph className="w-6 h-6 text-amber-400" />,
  graphs: <Network className="w-6 h-6 text-purple-400" />,
};

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<AlgorithmCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to connect to backend categories endpoint.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 bg-gradient-to-b from-indigo-950/30 via-slate-950/80 to-slate-950">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Data Structures & Algorithms Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Visualize Algorithms with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Precision & Clarity</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Explore step-by-step visual execution of sorting, searching, trees, dynamic programming, and graph algorithms. Master complex DSA concepts visually.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/algorithms">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore All Algorithms
              </Button>
            </Link>
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="lg">
                View OpenAPI Docs
              </Button>
            </a>
          </div>

          {/* Connection Status Badge */}
          <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Backend Connected: <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">http://localhost:8080/api/v1</code></span>
          </div>
        </div>
      </section>

      {/* Categories Discovery Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Browse by Category</h2>
            <p className="text-xs text-slate-400 mt-1">Explore our catalog of algorithm categories seeded directly from the backend</p>
          </div>
          <Link to="/algorithms" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Connecting to backend and fetching categories..." size="lg" />
        ) : error ? (
          <ErrorMessage
            title="API Connection Error"
            message={error}
            onRetry={fetchCategoryData}
          />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No Categories Found"
            description="The backend returned an empty category list. Ensure migrations have completed."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/algorithms?category=${category.slug}`}>
                <Card hoverable className="group h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 group-hover:border-indigo-500/40 transition-colors">
                        {categoryIcons[category.slug] || <FolderGit2 className="w-6 h-6 text-indigo-400" />}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        Order #{category.displayOrder}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500">slug: {category.slug}</span>
                    <span className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Browse Algorithms</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Feature Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <Card className="space-y-3">
          <div className="p-2.5 w-max bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-200">Step-by-Step Generator</h4>
          <p className="text-xs text-slate-400">
            Every step comes with state snapshots, highlighting active elements, comparisons, swaps, and visited nodes.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-2.5 w-max bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-200">User Progress Tracking</h4>
          <p className="text-xs text-slate-400">
            Track your completion percentage, bookmark favorite algorithms, and review dashboard metrics.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-2.5 w-max bg-pink-500/10 text-pink-400 rounded-lg border border-pink-500/20">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-200">OpenAPI 3.0 Documented</h4>
          <p className="text-xs text-slate-400">
            Fully documented Spring Boot REST backend with interactive Swagger UI and JWT Bearer security.
          </p>
        </Card>
      </section>
    </div>
  );
};
