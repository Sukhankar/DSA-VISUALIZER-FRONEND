import React from 'react';
import { VisualizationStep, VisualizationType } from '../../types';
import { VisualizationContract } from '../../types/contract';
import { resolveVisualizationType } from './VisualizationRegistry';
import { getRendererComponent } from './RendererRegistry';

// Specialized Visualizer Components
import { ArrayBarVisualizer } from './ArrayBarVisualizer';
import { IndexedArrayVisualizer } from './IndexedArrayVisualizer';
import { PointerArrayVisualizer } from './PointerArrayVisualizer';
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer';
import { TwoPointerVisualizer } from './TwoPointerVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { AVLTreeVisualizer } from './AVLTreeVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { WeightedGraphVisualizer } from './WeightedGraphVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { HashTableVisualizer } from './HashTableVisualizer';
import { TrieVisualizer } from './TrieVisualizer';
import { RecursionTreeVisualizer } from './RecursionTreeVisualizer';
import { BacktrackingVisualizer } from './BacktrackingVisualizer';
import { ConvexHullVisualizer } from './ConvexHullVisualizer';

interface VisualizationRendererProps {
  algorithmSlug: string;
  backendVisualizationType?: VisualizationType;
  currentStep?: VisualizationStep & { state?: Record<string, any> };
  contract?: VisualizationContract;
  rendererKey?: string;
}

export const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  algorithmSlug,
  backendVisualizationType,
  currentStep,
  contract,
  rendererKey,
}) => {
  // Dual-Shape Reconciliation: ensure state envelope fields are available to components
  const reconciledStep = React.useMemo(() => {
    if (!currentStep) return undefined;
    const stepState = currentStep.state || (currentStep as any).customState;
    if (stepState && typeof stepState === 'object') {
      return {
        ...stepState,
        ...currentStep,
        customState: stepState,
      };
    }
    return currentStep;
  }, [currentStep]);

  // Contract-driven resolution via RendererRegistry
  const effectiveRendererKey = rendererKey || contract?.rendererKey;
  if (effectiveRendererKey) {
    const Component = getRendererComponent(effectiveRendererKey);
    return <Component currentStep={reconciledStep} />;
  }

  // Fallback to type resolution for legacy components
  const resolvedType = resolveVisualizationType(algorithmSlug, backendVisualizationType);

  switch (resolvedType) {
    case 'CONVEX_HULL':
    case 'POINT_SET':
      return <ConvexHullVisualizer currentStep={reconciledStep} />;

    case 'POINTER_ARRAY':
      return <PointerArrayVisualizer currentStep={reconciledStep} />;

    case 'ARRAY_CELLS':
    case 'ARRAY_INDEXED':
      return <IndexedArrayVisualizer currentStep={reconciledStep} />;

    case 'SLIDING_WINDOW':
      return <SlidingWindowVisualizer currentStep={reconciledStep} />;

    case 'TWO_POINTER':
    case 'TWO_POINTERS':
      return <TwoPointerVisualizer currentStep={reconciledStep} />;

    case 'LINKED_LIST':
    case 'DOUBLY_LINKED_LIST':
      return <LinkedListVisualizer currentStep={reconciledStep} />;

    case 'STACK':
      return <StackVisualizer currentStep={reconciledStep} />;

    case 'QUEUE':
    case 'DEQUE':
      return <QueueVisualizer currentStep={reconciledStep} />;

    case 'AVL_TREE':
      return <AVLTreeVisualizer currentStep={reconciledStep} />;

    case 'TREE':
    case 'BST':
    case 'BINARY_TREE':
      return <TreeVisualizer currentStep={reconciledStep} />;

    case 'HEAP':
      return <HeapVisualizer currentStep={reconciledStep} />;

    case 'WEIGHTED_GRAPH':
      return <WeightedGraphVisualizer currentStep={reconciledStep} />;

    case 'GRAPH':
    case 'GRAPH_NETWORK':
    case 'DIRECTED_GRAPH':
      return <GraphVisualizer currentStep={reconciledStep} />;

    case 'DP_TABLE':
    case 'MATRIX':
      return <DPTableVisualizer currentStep={reconciledStep} />;

    case 'HASH_TABLE':
      return <HashTableVisualizer currentStep={reconciledStep} />;

    case 'TRIE':
      return <TrieVisualizer currentStep={reconciledStep} />;

    case 'RECURSION_TREE':
      return <RecursionTreeVisualizer currentStep={reconciledStep} />;

    case 'BACKTRACKING_GRID':
    case 'GRID':
      return <BacktrackingVisualizer currentStep={reconciledStep} />;

    case 'ARRAY_BAR':
    case 'ARRAY_BARS':
    case 'ARRAY':
    default:
      return <ArrayBarVisualizer currentStep={reconciledStep} />;
  }
};
