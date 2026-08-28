import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { algorithmService } from '../api/algorithmService';
import { visualizationService } from '../api/visualizationService';
import { userActivityService } from '../api/userActivityService';
import { useAuth } from '../hooks/useAuth';
import {
  Algorithm,
  AlgorithmDetailRichResponse,
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
import { ArrowLeft, Star, Sparkles, Sliders, BookOpen, Code, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

export const VisualizationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [richDetails, setRichDetails] = useState<AlgorithmDetailRichResponse | null>(null);
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);

  const [isAlgoLoading, setIsAlgoLoading] = useState<boolean>(true);
  const [isVisLoading, setIsVisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Fetch algorithm metadata & rich details
  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsAlgoLoading(true);
    setError(null);

    Promise.all([
      algorithmService.getAlgorithmBySlug(slug),
      algorithmService.getRichAlgorithmDetails(slug).catch(() => null),
    ])
      .then(([algoData, richData]) => {
        if (!isMounted) return;
        setAlgorithm(algoData);
        if (richData) setRichDetails(richData);

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
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link
            to={`/algorithms/${algorithm.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Algorithm Overview</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{algorithm.name}</h1>
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

        {/* Action Buttons: Practice Algorithm & Favorite */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/practice/arena?algorithm=${algorithm.slug}`}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span>Practice This Algorithm</span>
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleToggleFavorite}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
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
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Algorithm Overview & Input Config */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Algorithm Overview & Complexities Card */}
          <Card className="bg-slate-900/90 border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Algorithm Overview</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {richDetails?.overview || richDetails?.description || algorithm.description}
            </p>

            {/* Complexity Badges Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Time Complexity</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 block">
                  {algorithm.timeComplexity || 'O(N)'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <HardDrive className="w-3 h-3 text-cyan-400" />
                  <span>Space Complexity</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 block">
                  {algorithm.spaceComplexity || 'O(1)'}
                </span>
              </div>
            </div>

            {/* When To Use */}
            {richDetails?.whenToUse && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  When To Use
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{richDetails.whenToUse}</p>
              </div>
            )}

            {/* Constraints */}
            {richDetails?.constraints && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-xs font-bold text-slate-400 block">Constraints</span>
                <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                  {richDetails.constraints}
                </pre>
              </div>
            )}
          </Card>

          {/* 2. Input Configuration Card */}
          <Card className="bg-slate-900/90 border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
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

        {/* Right Column (8 cols): Visualization Player Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {isVisLoading ? (
            <div className="min-h-[420px] flex items-center justify-center glass-panel rounded-xl border border-slate-800">
              <LoadingSpinner size="lg" message="Generating step-by-step visualization..." />
            </div>
          ) : visualization ? (
            <VisualizationPlayer
              response={visualization}
              slug={algorithm.slug}
              isAuthenticated={isAuthenticated}
              implementations={richDetails?.implementations}
            />
          ) : (
            <div className="min-h-[420px] flex items-center justify-center glass-panel rounded-xl border border-slate-800">
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
