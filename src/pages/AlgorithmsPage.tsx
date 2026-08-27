import React, { useEffect, useState, useCallback, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { algorithmService } from '../api/algorithmService';
import { categoryService } from '../api/categoryService';
import { Algorithm, AlgorithmCategory, AlgorithmPageResponse, Difficulty } from '../types';
import { AlgorithmCard } from '../components/algorithm/AlgorithmCard';
import { Pagination } from '../components/ui/Pagination';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { getErrorMessage } from '../utils/errorUtils';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name,asc' },
  { label: 'Name (Z-A)', value: 'name,desc' },
  { label: 'Difficulty (Easy first)', value: 'difficulty,asc' },
  { label: 'Difficulty (Hard first)', value: 'difficulty,desc' },
  { label: 'Time Complexity', value: 'timeComplexity,asc' },
  { label: 'Space Complexity', value: 'spaceComplexity,asc' },
];

export const AlgorithmsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();

  // Extract query params from URL
  const categoryParam = searchParams.get('category') || '';
  const difficultyParam = (searchParams.get('difficulty') as Difficulty) || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sortParam = searchParams.get('sort') || 'name,asc';

  // Component state
  const [categories, setCategories] = useState<AlgorithmCategory[]>([]);
  const [pageData, setPageData] = useState<AlgorithmPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Local search input for debouncing
  const [searchInput, setSearchInput] = useState<string>(searchParam);

  // Debounce search update to URL searchParams
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateParams({ search: searchInput || undefined, page: '0' });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, searchParam]);

  // Sync searchInput if URL changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Helper to update search params cleanly
  const updateParams = useCallback(
    (newParams: Record<string, string | undefined>) => {
      startTransition(() => {
        setSearchParams((prev) => {
          const updated = new URLSearchParams(prev);
          Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === '') {
              updated.delete(key);
            } else {
              updated.set(key, value);
            }
          });
          return updated;
        });
      });
    },
    [setSearchParams]
  );

  // Fetch Categories on mount
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch((err) => {
        console.warn('Failed to fetch categories:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Algorithms whenever filters or page changes
  const fetchAlgorithms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await algorithmService.getAlgorithms({
        category: categoryParam || undefined,
        difficulty: (difficultyParam as Difficulty) || undefined,
        search: searchParam || undefined,
        page: pageParam,
        size: 12,
        sort: sortParam,
      });
      setPageData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [categoryParam, difficultyParam, searchParam, pageParam, sortParam]);

  useEffect(() => {
    fetchAlgorithms();
  }, [fetchAlgorithms]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ category: e.target.value || undefined, page: '0' });
  };

  const handleDifficultyClick = (diff: Difficulty | '') => {
    updateParams({ difficulty: diff || undefined, page: '0' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value, page: '0' });
  };

  const handlePageChange = (uiPage: number) => {
    // Convert 1-indexed UI page to 0-indexed API page
    const apiPage = uiPage - 1;
    updateParams({ page: apiPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(categoryParam) || Boolean(difficultyParam) || Boolean(searchParam);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Algorithm Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Browse, search, and visualize step-by-step algorithms across sorting, searching, trees, and graphs.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="self-start md:self-auto text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="glass-panel p-4 space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search algorithms by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-4 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={categoryParam}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-8 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortParam}
              onChange={handleSortChange}
              className="w-full pl-10 pr-8 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">
            Difficulty:
          </span>

          {[
            { label: 'All', value: '' },
            { label: 'Easy', value: 'EASY' },
            { label: 'Medium', value: 'MEDIUM' },
            { label: 'Hard', value: 'HARD' },
          ].map((item) => {
            const isActive = difficultyParam === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleDifficultyClick(item.value as Difficulty | '')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Results Display */}
      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading algorithms..." />
        </div>
      ) : error ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <ErrorMessage message={error} onRetry={fetchAlgorithms} />
        </div>
      ) : !pageData || pageData.content.length === 0 ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <EmptyState
            title="No Algorithms Found"
            description="We couldn't find any algorithms matching your search criteria or filters."
            actionLabel="Reset Filters"
            onAction={handleClearFilters}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Algorithms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pageData.content.map((algo: Algorithm) => (
              <AlgorithmCard key={algo.id} algorithm={algo} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pageData.page + 1} // Convert 0-indexed API page to 1-indexed UI page
            totalPages={pageData.totalPages}
            onPageChange={handlePageChange}
            totalElements={pageData.totalElements}
            pageSize={pageData.size}
          />
        </div>
      )}
    </div>
  );
};
