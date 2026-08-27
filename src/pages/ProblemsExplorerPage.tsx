import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemService } from '../api/problemService';
import { algorithmService } from '../api/algorithmService';
import {
  Difficulty,
  ProblemPageResponse,
  ProblemSummary,
  AlgorithmCategory,
} from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getErrorMessage } from '../utils/errorUtils';
import {
  Search,
  Terminal,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Code2,
  Tag,
} from 'lucide-react';

export const ProblemsExplorerPage: React.FC = () => {
  const [problemData, setProblemData] = useState<ProblemPageResponse | null>(null);
  const [categories, setCategories] = useState<AlgorithmCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    algorithmService
      .getAllCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const fetchProblems = () => {
    setIsLoading(true);
    setError(null);

    problemService
      .getProblems({
        difficulty: selectedDifficulty === 'ALL' ? undefined : selectedDifficulty,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        search: search.trim() || undefined,
        page,
        size: 10,
      })
      .then((data) => {
        setProblemData(data);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty, selectedCategory, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProblems();
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
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
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Problem Practice Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            LeetCode-Style Practice Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Solve curated algorithm challenges, analyze sample test cases, and refine your coding skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block font-medium">Available Problems</span>
            <span className="text-lg font-extrabold text-indigo-400 font-mono">
              {problemData?.totalElements ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-slate-900/90 border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems by name or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-4 flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1">
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setPage(0);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {diff === 'ALL' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Card>

      {/* Problems List */}
      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading practice problems catalog..." />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProblems} />
      ) : !problemData || problemData.content.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No problems found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No practice problems matched your search query or filter selection. Try resetting filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedDifficulty('ALL');
              setSelectedCategory('ALL');
              setPage(0);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {problemData.content.map((problem) => (
              <Link
                key={problem.id}
                to={`/problems/${problem.slug}`}
                className="group p-5 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/20"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {problem.title}
                    </h3>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                      {problem.categoryName}
                    </span>
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-3 h-3 text-indigo-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-indigo-600 group-hover:text-white transition-all"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Solve Challenge
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {problemData.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Page <span className="font-bold text-slate-200">{problemData.page + 1}</span> of{' '}
                <span className="font-bold text-slate-200">{problemData.totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={problemData.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={problemData.last}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
