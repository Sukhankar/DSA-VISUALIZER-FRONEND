import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userActivityService } from '../api/userActivityService';
import { FavoriteAlgorithmResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FavoriteButton } from '../components/algorithm/FavoriteButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { getErrorMessage } from '../utils/errorUtils';
import { Star, Eye, Play, Search, Sparkles } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteAlgorithmResponse[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userActivityService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteChange = (slug: string, isFav: boolean) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((item) => item.slug !== slug));
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      fav.name.toLowerCase().includes(query) ||
      fav.category.toLowerCase().includes(query) ||
      fav.slug.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your favorited algorithms..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-8">
        <ErrorMessage message={error} onRetry={fetchFavorites} />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
              Bookmarked Favorites
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            My Favorite Algorithms
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Quickly launch visualizations for algorithms you've favorited.
          </p>
        </div>

        {/* Search filter input */}
        {favorites.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search favorites..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {favorites.length === 0 ? (
        <EmptyState
          title="No Favorite Algorithms Yet"
          description="You haven't bookmarked any algorithms yet. Click the star icon on any algorithm card to save it here for quick access!"
          actionLabel="Explore Algorithm Catalog"
          onAction={() => (window.location.href = '/algorithms')}
        />
      ) : filteredFavorites.length === 0 ? (
        <Card className="p-8 text-center space-y-2 bg-slate-900/60 border-slate-800">
          <p className="text-sm font-semibold text-slate-300">No matching favorites found.</p>
          <p className="text-xs text-slate-500">Try clearing your search query "{search}".</p>
          <button
            onClick={() => setSearch('')}
            className="text-xs text-amber-400 hover:underline pt-2 cursor-pointer font-medium"
          >
            Clear Search Filter
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <Card
              key={item.algorithmId || item.slug}
              className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors bg-slate-900/80"
            >
              <div className="space-y-3">
                {/* Header row with badges and FavoriteButton */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="indigo">{item.category}</Badge>
                    <Badge
                      variant={
                        item.difficulty === 'EASY'
                          ? 'success'
                          : item.difficulty === 'MEDIUM'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {item.difficulty}
                    </Badge>
                  </div>

                  <FavoriteButton
                    algorithmSlug={item.slug}
                    initialFavorite={true}
                    onChange={(isFav) => handleFavoriteChange(item.slug, isFav)}
                    variant="icon"
                    size="sm"
                  />
                </div>

                {/* Algorithm Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{item.name}</h3>
                  {item.createdAt && (
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Saved on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                <Link to={`/algorithms/${item.slug}`} className="flex-1">
                  <button className="w-full py-1.5 px-3 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Details</span>
                  </button>
                </Link>

                <Link to={`/visualize/${item.slug}`} className="flex-1">
                  <button className="w-full py-1.5 px-3 text-xs font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Play className="w-3.5 h-3.5 fill-indigo-300" />
                    <span>Visualize</span>
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
