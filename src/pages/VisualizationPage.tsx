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
  LearningLevel,
} from '../types';
import { ArrayInput } from '../components/visualization/ArrayInput';
import { GraphInput } from '../components/visualization/GraphInput';
import { InputConfigPanel } from '../components/visualization/InputConfigPanel';
import { AlgorithmResourceSection } from '../components/visualization/AlgorithmResourceSection';
import { VisualizationPlayer } from '../components/visualization/VisualizationPlayer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../utils/errorUtils';
import { ArrowLeft, Star, Sparkles, Sliders, BookOpen, Code, Clock, HardDrive, CheckCircle2 } from 'lucide-react';
import { AlgorithmOverviewCard } from '../components/visualization/AlgorithmOverviewCard';



import { getAlgorithmConfig, getStoredInput } from '../config/visualizationConfig';

export const VisualizationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [richDetails, setRichDetails] = useState<AlgorithmDetailRichResponse | null>(null);
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);

  const [level, setLevel] = useState<LearningLevel>(() => {
    const saved = localStorage.getItem('codeloom_learning_level');
    return (saved as LearningLevel) || 'BEGINNER';
  });

  const [isAlgoLoading, setIsAlgoLoading] = useState<boolean>(true);
  const [isVisLoading, setIsVisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isMastered, setIsMastered] = useState<boolean>(false);

  const handleLevelChange = (newLevel: LearningLevel) => {
    setLevel(newLevel);
    localStorage.setItem('codeloom_learning_level', newLevel);
  };


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

        const config = getAlgorithmConfig(slug);
        const stored = getStoredInput(slug);
        const inputState = stored || config.defaultInput;

        const initialReq: VisualizationRequest = {
          type: inputState.dataStructureType || inputState.structureType,
          input: inputState.twoPointerInput?.values || inputState.slidingWindowInput?.values || inputState.heapInput?.values || inputState.input,
          target: inputState.twoPointerInput?.targetSum || inputState.slidingWindowInput?.windowSize || inputState.target,
          points: inputState.pointsInput,
          listInput: inputState.listInput,
          stackInput: inputState.stackInput,
          queueInput: inputState.queueInput,
          trieInput: inputState.trieInput,
          matrixInput: inputState.matrixInput,
          knapsackInput: inputState.knapsackInput,
          graph: inputState.graph,
        };

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

  const handleRunVisualizationState = useCallback(
    async (inputState: any) => {
      if (!slug) return;
      setIsVisLoading(true);
      setError(null);

      const req: VisualizationRequest = {
        type: inputState.dataStructureType || inputState.structureType,
        input: inputState.twoPointerInput?.values || inputState.slidingWindowInput?.values || inputState.heapInput?.values || inputState.input,
        target: inputState.twoPointerInput?.targetSum || inputState.slidingWindowInput?.windowSize || inputState.target,
        points: inputState.pointsInput,
        listInput: inputState.listInput,
        stackInput: inputState.stackInput,
        queueInput: inputState.queueInput,
        trieInput: inputState.trieInput,
        matrixInput: inputState.matrixInput,
        knapsackInput: inputState.knapsackInput,
        graph: inputState.graph,
      };

      try {
        const data = await visualizationService.generateVisualization(slug, req);
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
      {/* Top Algorithm Learning Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-2">
          <Link
            to="/algorithms"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Algorithms / {algorithm.categoryName} / {algorithm.name}</span>
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

            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> +25 XP Available
            </span>
          </div>
        </div>

        {/* Level Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Multi-depth Level Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as LearningLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  level === lvl
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <Link
            to={`/practice/arena?algorithm=${algorithm.slug}`}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span>Practice</span>
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

      {/* Main 3-Column Visualizer Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 items-start">
        {/* Column 1: Algorithm Overview & Input Config (3 cols on xl) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* 1. Algorithm Overview & Theory Component */}
          <AlgorithmOverviewCard
            algorithm={algorithm}
            richDetails={richDetails}
            level={level}
            onLevelChange={handleLevelChange}
          />


          {/* 2. Context-Aware Structure Input Configuration */}
          <InputConfigPanel
            algorithmSlug={algorithm.slug}
            onRunVisualization={(inputState) => {
              handleRunVisualizationState(inputState);
            }}
            isLoading={isVisLoading}
          />

          {/* Algorithm Output & Execution Result Display */}
          {visualization && visualization.steps && visualization.steps.length > 0 && (
            <Card className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 font-mono text-xs shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Algorithm Execution Output</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded font-bold">
                  {visualization.steps.length} Steps
                </span>
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                {visualization.steps[visualization.steps.length - 1].message}
              </div>

              {visualization.steps[visualization.steps.length - 1].array && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Output Array / Nodes:</span>
                  <span className="font-bold text-indigo-300">
                    [{visualization.steps[visualization.steps.length - 1].array?.join(', ')}]
                  </span>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Columns 2 & 3: Visual Canvas, Code Execution & Explanations (9 cols on xl) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
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
              level={level}
            />
          ) : (
            <div className="min-h-[420px] flex items-center justify-center glass-panel rounded-xl border border-slate-800">
              <div className="text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                <p>Click "Run Visualization" to start interactive step execution.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structured 15-Section Learning & Reference Footer */}
      <AlgorithmResourceSection algorithmName={algorithm.name} algorithmSlug={algorithm.slug} />
    </div>
  );
};
