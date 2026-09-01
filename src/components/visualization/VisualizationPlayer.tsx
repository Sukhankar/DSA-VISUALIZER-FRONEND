import React, { useState, useEffect, useCallback } from 'react';
import { VisualizationResponse, VisualizationStep, AlgorithmImplementation } from '../../types';
import { VisualizationRenderer } from './VisualizationRenderer';
import { PlaybackControls } from './PlaybackControls';
import { StepTimeline } from './StepTimeline';
import { CodeExecutionPanel } from './CodeExecutionPanel';
import { StepExplanationCard } from './StepExplanationCard';
import { LearningModeToggle, LearningMode } from '../learning/LearningModeToggle';
import { userActivityService } from '../../api/userActivityService';
import { EmptyState } from '../ui/EmptyState';

import { LearningLevel } from '../../types';

interface VisualizationPlayerProps {
  response: VisualizationResponse;
  slug: string;
  isAuthenticated?: boolean;
  implementations?: AlgorithmImplementation[];
  level?: LearningLevel;
}

export const VisualizationPlayer: React.FC<VisualizationPlayerProps> = ({
  response,
  slug,
  isAuthenticated = false,
  implementations,
  level = 'BEGINNER',
}) => {

  const { steps, visualizationType } = response;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [hasStartedProgress, setHasStartedProgress] = useState<boolean>(false);

  const [learningMode, setLearningMode] = useState<LearningMode>(() => {
    const saved = localStorage.getItem('codeloom_learning_mode');
    return (saved as LearningMode) || 'STANDARD';
  });

  const handleModeChange = (mode: LearningMode) => {
    setLearningMode(mode);
    localStorage.setItem('codeloom_learning_mode', mode);
  };

  const totalSteps = steps ? steps.length : 0;
  const currentStepData: VisualizationStep | undefined = steps?.[currentStepIndex];

  // Helper to trigger backend progress APIs safely
  const triggerStartProgress = useCallback(() => {
    if (isAuthenticated && !hasStartedProgress) {
      setHasStartedProgress(true);
      userActivityService.startProgress(slug).catch((err) => {
        console.warn('Failed to start user progress:', err);
      });
    }
  }, [isAuthenticated, hasStartedProgress, slug]);

  const triggerCompleteProgress = useCallback(() => {
    if (isAuthenticated) {
      userActivityService.completeProgress(slug).catch((err) => {
        console.warn('Failed to complete user progress:', err);
      });
    }
  }, [isAuthenticated, slug]);

  // Timer loop for playback
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;

    triggerStartProgress();

    const intervalMs = Math.round(1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          triggerCompleteProgress();
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, speed, triggerStartProgress, triggerCompleteProgress]);

  // Reset and auto-play when new response comes in
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setHasStartedProgress(false);
  }, [response]);


  // Control handlers
  const handlePlayPause = () => {
    if (totalSteps === 0) return;
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => {
      const nextIdx = Math.min(totalSteps - 1, prev + 1);
      if (nextIdx === totalSteps - 1) {
        triggerCompleteProgress();
      }
      return nextIdx;
    });
  };

  const handleJumpToStart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setCurrentStepIndex(totalSteps - 1);
    triggerCompleteProgress();
  };

  const handleStepSelect = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
    if (index === totalSteps - 1) {
      triggerCompleteProgress();
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT');

      if (isInputActive) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'Home') {
        e.preventDefault();
        handleJumpToStart();
      } else if (e.code === 'End') {
        e.preventDefault();
        handleJumpToEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSteps, currentStepIndex, isPlaying, handlePlayPause, handlePrev, handleNext, handleJumpToStart, handleJumpToEnd]);


  if (!steps || steps.length === 0) {
    return (
      <EmptyState
        title="Visualization Coming Soon"
        description="The backend generator for this algorithm is coming soon in an upcoming release."
      />
    );
  }

  const isTreeAlgo = slug.includes('tree') || slug.includes('bst') || slug.includes('heap');
  const isLinkedListAlgo = slug.includes('linked-list') || slug.includes('list');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Left/Center Visual Canvas Column (7 cols out of 12) */}
      <div className="xl:col-span-7 space-y-5">
        {/* Learning Mode Selector Header */}
        <div className="flex items-center justify-between">
          <LearningModeToggle currentMode={learningMode} onModeChange={handleModeChange} compact />
        </div>

        {/* Visual Canvas Renderer Router */}
        <VisualizationRenderer
          algorithmSlug={slug}
          backendVisualizationType={visualizationType}
          currentStep={currentStepData}
        />

        {/* Step Timeline & Progress Bar */}
        <StepTimeline
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          currentStepData={currentStepData}
          onStepSelect={handleStepSelect}
        />

        {/* Playback Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          speed={speed}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpToStart={handleJumpToStart}
          onJumpToEnd={handleJumpToEnd}
          onSpeedChange={setSpeed}
        />
      </div>

      {/* Right Column: Code Execution & Step Explanation (5 cols out of 12) */}
      <div className="xl:col-span-5 space-y-5">
        {/* Interactive Step-by-Step Code Execution Panel */}
        <CodeExecutionPanel
          slug={slug}
          currentStepData={currentStepData}
          implementations={implementations}
          level={level}
        />

        {/* Synchronized Step Explanation Card */}
        <StepExplanationCard step={currentStepData} mode={level as any} />
      </div>

    </div>
  );

};
