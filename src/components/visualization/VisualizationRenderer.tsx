import React from 'react';
import { VisualizationStep, VisualizationType } from '../../types';
import { resolveVisualizationType } from './VisualizationRegistry';

// Specialized Visualizer Components
import { ArrayBarVisualizer } from './ArrayBarVisualizer';
import { IndexedArrayVisualizer } from './IndexedArrayVisualizer';
import { TwoPointerVisualizer } from './TwoPointerVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { AVLTreeVisualizer } from './AVLTreeVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { WeightedGraphVisualizer } from './WeightedGraphVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { BacktrackingVisualizer } from './BacktrackingVisualizer';
import { GraphVisualizer } from './GraphVisualizer';

interface VisualizationRendererProps {
  algorithmSlug: string;
  backendVisualizationType?: VisualizationType;
  currentStep?: VisualizationStep;
}

export const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  algorithmSlug,
  backendVisualizationType,
  currentStep,
}) => {
  const resolvedType = resolveVisualizationType(algorithmSlug, backendVisualizationType);

  switch (resolvedType) {
    case 'ARRAY_INDEXED':
      return <IndexedArrayVisualizer currentStep={currentStep} />;

    case 'TWO_POINTER':
      return <TwoPointerVisualizer currentStep={currentStep} />;

    case 'LINKED_LIST':
      return <LinkedListVisualizer currentStep={currentStep} />;

    case 'STACK':
      return <StackVisualizer currentStep={currentStep} />;

    case 'QUEUE':
      return <QueueVisualizer currentStep={currentStep} />;

    case 'AVL_TREE':
      return <AVLTreeVisualizer currentStep={currentStep} />;

    case 'TREE':
    case 'BST':
      return <TreeVisualizer currentStep={currentStep} />;

    case 'HEAP':
      return <HeapVisualizer currentStep={currentStep} />;

    case 'WEIGHTED_GRAPH':
      return <WeightedGraphVisualizer currentStep={currentStep} />;

    case 'GRAPH':
      return <GraphVisualizer currentStep={currentStep} />;

    case 'DP_TABLE':
    case 'RECURSION_TREE':
      return <DPTableVisualizer currentStep={currentStep} />;

    case 'BACKTRACKING_GRID':
    case 'GRID':
      return <BacktrackingVisualizer currentStep={currentStep} />;

    case 'ARRAY_BAR':
    default:
      return <ArrayBarVisualizer currentStep={currentStep} />;
  }
};
