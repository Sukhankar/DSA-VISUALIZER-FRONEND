import React from 'react';
import { VisualizationStep, VisualizationType } from '../../types';
import { resolveVisualizationType } from './VisualizationRegistry';

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
  currentStep?: VisualizationStep;
}

export const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  algorithmSlug,
  backendVisualizationType,
  currentStep,
}) => {
  const resolvedType = resolveVisualizationType(algorithmSlug, backendVisualizationType);

  switch (resolvedType) {
    case 'CONVEX_HULL':
    case 'POINT_SET':
      return <ConvexHullVisualizer currentStep={currentStep} />;

    case 'POINTER_ARRAY':
      return <PointerArrayVisualizer currentStep={currentStep} />;

    case 'ARRAY_CELLS':
    case 'ARRAY_INDEXED':
      return <IndexedArrayVisualizer currentStep={currentStep} />;

    case 'SLIDING_WINDOW':
      return <SlidingWindowVisualizer currentStep={currentStep} />;

    case 'TWO_POINTER':
    case 'TWO_POINTERS':
      return <TwoPointerVisualizer currentStep={currentStep} />;

    case 'LINKED_LIST':
    case 'DOUBLY_LINKED_LIST':
      return <LinkedListVisualizer currentStep={currentStep} />;

    case 'STACK':
      return <StackVisualizer currentStep={currentStep} />;

    case 'QUEUE':
    case 'DEQUE':
      return <QueueVisualizer currentStep={currentStep} />;

    case 'AVL_TREE':
      return <AVLTreeVisualizer currentStep={currentStep} />;

    case 'TREE':
    case 'BST':
    case 'BINARY_TREE':
      return <TreeVisualizer currentStep={currentStep} />;

    case 'HEAP':
      return <HeapVisualizer currentStep={currentStep} />;

    case 'WEIGHTED_GRAPH':
      return <WeightedGraphVisualizer currentStep={currentStep} />;

    case 'GRAPH':
    case 'GRAPH_NETWORK':
    case 'DIRECTED_GRAPH':
      return <GraphVisualizer currentStep={currentStep} />;

    case 'DP_TABLE':
    case 'MATRIX':
      return <DPTableVisualizer currentStep={currentStep} />;

    case 'HASH_TABLE':
      return <HashTableVisualizer currentStep={currentStep} />;

    case 'TRIE':
      return <TrieVisualizer currentStep={currentStep} />;

    case 'RECURSION_TREE':
      return <RecursionTreeVisualizer currentStep={currentStep} />;

    case 'BACKTRACKING_GRID':
    case 'GRID':
      return <BacktrackingVisualizer currentStep={currentStep} />;

    case 'ARRAY_BAR':
    case 'ARRAY_BARS':
    case 'ARRAY':
    default:
      return <ArrayBarVisualizer currentStep={currentStep} />;
  }
};
