import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { algorithmService } from '../api/algorithmService';
import { visualizationService } from '../api/visualizationService';
import { userActivityService } from '../api/userActivityService';
import { useAuth } from '../hooks/useAuth';
import {
  Algorithm,
  VisualizationResponse,
  VisualizationRequest,
  GraphVisualizationRequest,
} from '../types';
import { ArrayInput } from '../components/visualization/ArrayInput';
import { GraphInput } from '../components/visualization/GraphInput';
import { VisualizationPlayer } from '../components/visualization/VisualizationPlayer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../utils/errorUtils';
import { ArrowLeft, Star, Sparkles, Sliders } from 'lucide-react';

export const VisualizationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);

  const [isAlgoLoading, setIsAlgoLoading] = useState<boolean>(true);
  const [isVisLoading, setIsVisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Fetch algorithm metadata & favorite status
  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsAlgoLoading(true);
    setError(null);

    algorithmService
      .getAlgorithmBySlug(slug)
      .then((algoData) => {
        if (!isMounted) return;
        setAlgorithm(algoData);

        // Auto-generate initial visualization with default input
        const isGraph =
          algoData.categorySlug === 'graphs' ||
          algoData.slug === 'bfs' ||
          algoData.slug === 'dfs';

        let initialReq: VisualizationRequest = {};
        if (isGraph) {
          initialReq = {
            graph: {
              nodes: ['A', 'B', 'C', 'D', 'E'],
              edges: [
                { from: 'A', to: 'B' },
                { from: 'A', to: 'C' },
                { from: 'B', to: 'D' },
                { from: 'C', to: 'E' },
                { from: 'D', to: 'E' },
              ],
              startNode: 'A',
            },
          };
        } else {
          initialReq = {
            input: [5, 1, 4, 2, 8],
            target: algoData.categorySlug === 'searching' ? 4 : undefined,
          };
        }

        setIsVisLoading(true);
        visualizationService
          .generateVisualization(slug, initialReq)
          .then((visData) => {
            if (isMounted) setVisualization(visData);
          })
          .catch((err) => {
            console.warn('Initial visualization failed:', err);
          })
          .finally(() => {
            if (isMounted) setIsVisLoading(false);
          });
      })
      .catch((err) => {
        if (isMounted) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) setIsAlgoLoading(false);
      });

    if (isAuthenticated) {
      userActivityService
        .getFavorites()
        .then((favs) => {
          if (isMounted) {
            setIsFavorite(favs.some((f) => f.slug === slug));
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated]);

  const handleGenerateArray = useCallback(
    async (input: number[], target?: number) => {
      if (!slug) return;
      setIsVisLoading(true);
      setError(null);
      try {
        const data = await visualizationService.generateVisualization(slug, {
          input,
          target,
        });
        setVisualization(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsVisLoading(false);
      }
    },
    [slug]
  );

  const handleGenerateGraph = useCallback(
    async (graph: GraphVisualizationRequest) => {
      if (!slug) return;
      setIsVisLoading(true);
      setError(null);
      try {
        const data = await visualizationService.generateVisualization(slug, {
          graph,
        });
        setVisualization(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsVisLoading(false);
      }
    },
    [slug]
  );

  const handleToggleFavorite = async () => {
    if (!slug || !isAuthenticated) return;
    try {
      if (isFavorite) {
        await userActivityService.removeFavorite(slug);
        setIsFavorite(false);
      } else {
        await userActivityService.addFavorite(slug);
        setIsFavorite(true);
      }
    } catch (err) {
      console.warn('Favorite toggle failed:', err);
    }
  };

  if (isAlgoLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading visualizer workspace..." />
      </div>
    );
  }

  if (error || !algorithm) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <ErrorMessage message={error || 'Algorithm not found.'} />
        <Link to="/algorithms">
          <Badge variant="neutral">Back to Catalog</Badge>
        </Link>
      </div>
    );
  }

  const isGraphAlgo =
    algorithm.categorySlug === 'graphs' ||
    algorithm.slug === 'bfs' ||
    algorithm.slug === 'dfs';
  const isSearchAlgo = algorithm.categorySlug === 'searching';
  const isBinarySearch = algorithm.slug === 'binary-search';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link
            to={`/algorithms/${algorithm.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Algorithm Details</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100">{algorithm.name}</h1>
            <Badge variant="indigo">{algorithm.categoryName}</Badge>
            <Badge
              variant={
                algorithm.difficulty === 'EASY'
                  ? 'success'
                  : algorithm.difficulty === 'MEDIUM'
                  ? 'warning'
                  : 'danger'
              }
            >
              {algorithm.difficulty}
            </Badge>
          </div>
        </div>

        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Bookmark'}</span>
          </button>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Input Configuration</span>
            </div>

            {isGraphAlgo ? (
              <GraphInput onGenerate={handleGenerateGraph} isLoading={isVisLoading} />
            ) : (
              <ArrayInput
                onGenerate={handleGenerateArray}
                isSearching={isSearchAlgo}
                isBinarySearch={isBinarySearch}
                isLoading={isVisLoading}
              />
            )}
          </Card>
        </div>

        {/* Right Column: Visualization Player Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {isVisLoading ? (
            <div className="min-h-[400px] flex items-center justify-center glass-panel rounded-xl border border-slate-800">
              <LoadingSpinner size="lg" message="Generating step-by-step visualization..." />
            </div>
          ) : visualization ? (
            <VisualizationPlayer
              response={visualization}
              slug={algorithm.slug}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <div className="min-h-[400px] flex items-center justify-center glass-panel rounded-xl border border-slate-800">
              <div className="text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                <p>Click "Generate Visualization" to start interactive step execution.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
