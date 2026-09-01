import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { algorithmService } from '../api/algorithmService';
import { userActivityService } from '../api/userActivityService';
import { useAuth } from '../hooks/useAuth';
import { AlgorithmDetailRichResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FavoriteButton } from '../components/algorithm/FavoriteButton';
import { CodeSnippetViewer } from '../components/algorithm/CodeSnippetViewer';
import { ExampleCard } from '../components/algorithm/ExampleCard';
import { RelatedAlgorithms } from '../components/algorithm/RelatedAlgorithms';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getErrorMessage } from '../utils/errorUtils';
import {
  ArrowLeft,
  Play,
  Clock,
  HardDrive,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ListOrdered,
  FileCode2,
  ShieldAlert,
} from 'lucide-react';
import { MasteryButton } from '../components/algorithm/MasteryButton';
import { AlgorithmExamplesViewer } from '../components/algorithm/AlgorithmExamplesViewer';


export const AlgorithmDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [algorithm, setAlgorithm] = useState<AlgorithmDetailRichResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isMastered, setIsMastered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    algorithmService
      .getRichAlgorithmDetails(slug)
      .then((data) => {
        if (isMounted) setAlgorithm(data);
      })
      .catch((err) => {
        if (isMounted) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
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

      algorithmService
        .getMasteryStatus(slug)
        .then((res) => {
          if (isMounted) setIsMastered(res.mastered);
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated]);

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

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading LeetCode-style algorithm specification..." />
      </div>
    );
  }

  if (error || !algorithm) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <ErrorMessage
          message={error || 'Algorithm specification not found.'}
          onRetry={() => window.location.reload()}
        />
        <Button variant="outline" size="sm" onClick={() => navigate('/algorithms')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto space-y-8 pb-16">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/algorithms"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Algorithm Explorer</span>
        </Link>
      </div>

      {/* Main LeetCode Header Card */}
      <Card className="space-y-6 bg-slate-900/90 border-slate-800">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Badge variant="indigo">{algorithm.categoryName || 'Algorithm'}</Badge>
            {getDifficultyBadge(algorithm.difficulty)}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MasteryButton slug={algorithm.slug} initialMastered={isMastered} />
            <FavoriteButton
              algorithmSlug={algorithm.slug}
              initialFavorite={isFavorite}
              variant="button"
            />
            <Link to={`/practice/arena?algorithm=${algorithm.slug}`}>
              <Button variant="secondary" size="md">
                Practice This Algorithm
              </Button>
            </Link>
            <Link to={`/visualization/${algorithm.slug}`}>
              <Button variant="primary" size="md" leftIcon={<Play className="w-4 h-4 fill-white" />}>
                Launch Visualizer
              </Button>
            </Link>
          </div>
        </div>



        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {algorithm.name}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {algorithm.description || 'Step-by-step visual execution and complexity analysis.'}
          </p>
        </div>

        {/* Complexity Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <Clock className="w-4 h-4" />
              <span>Time Complexity</span>
            </div>
            <p className="text-base font-bold font-mono text-slate-100">
              {algorithm.timeComplexity || 'O(N)'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-purple-400">
              <HardDrive className="w-4 h-4" />
              <span>Space Complexity</span>
            </div>
            <p className="text-base font-bold font-mono text-slate-100">
              {algorithm.spaceComplexity || 'O(1)'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Domain Category</span>
            </div>
            <p className="text-base font-bold text-slate-100">
              {algorithm.categoryName}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Grid Section: Left Column (Description & Examples) | Right Column (Code & Related) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Problem Specs & Examples */}
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Overview */}
          {algorithm.overview && (
            <Card className="space-y-4 bg-slate-900/80 border-slate-800">
              <div className="flex items-center gap-2 font-bold text-base text-slate-100">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2>Detailed Explanation</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {algorithm.overview}
              </p>
            </Card>
          )}

          {/* When to Use / Advantages / Limitations */}
          {(algorithm.whenToUse || algorithm.advantages || algorithm.limitations) && (
            <div className="grid grid-cols-1 gap-4">
              {algorithm.whenToUse && (
                <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>When To Use</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {algorithm.whenToUse}
                  </p>
                </div>
              )}

              {algorithm.advantages && (
                <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Advantages</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {algorithm.advantages}
                  </p>
                </div>
              )}

              {algorithm.limitations && (
                <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Limitations & Trade-offs</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {algorithm.limitations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Examples Viewer */}
          {algorithm.examples && algorithm.examples.length > 0 && (
            <AlgorithmExamplesViewer slug={algorithm.slug} examples={algorithm.examples} />
          )}

          {/* Constraints */}
          {algorithm.constraints && (
            <Card className="space-y-3 bg-slate-900/80 border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3>Input Constraints & Bounds</h3>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 whitespace-pre-line">
                {algorithm.constraints}
              </p>
            </Card>
          )}
        </div>

        {/* Right Column (5 cols): Multi-Language Code & Related Algorithms */}
        <div className="lg:col-span-5 space-y-8">
          {/* Code Implementations */}
          <Card className="space-y-4 bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base text-slate-100">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <h2>Code Implementations</h2>
              </div>
            </div>
            <CodeSnippetViewer implementations={algorithm.implementations} />
          </Card>

          {/* Related Algorithms */}
          {algorithm.relatedAlgorithms && algorithm.relatedAlgorithms.length > 0 && (
            <Card className="space-y-4 bg-slate-900/80 border-slate-800">
              <RelatedAlgorithms algorithms={algorithm.relatedAlgorithms} />
            </Card>
          )}

          {/* Launch Interactive Visualizer Callout */}
          <Card className="space-y-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border-indigo-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Interactive Execution Engine</h3>
                <p className="text-xs text-slate-400">
                  Step through execution line by line, inspect variable state, and trace array swaps live.
                </p>
              </div>
            </div>

            <Link to={`/visualize/${algorithm.slug}`}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Play className="w-4 h-4 fill-white" />}
              >
                Launch Visualizer
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
