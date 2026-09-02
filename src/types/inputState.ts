import { VisualizationType } from './index';

export type DataStructureType =
  | 'ARRAY'
  | 'SORTED_ARRAY'
  | 'POINTER_ARRAY'
  | 'LINKED_LIST'
  | 'DOUBLY_LINKED_LIST'
  | 'STACK'
  | 'QUEUE'
  | 'DEQUE'
  | 'BINARY_TREE'
  | 'AVL_TREE'
  | 'HEAP'
  | 'GRAPH'
  | 'WEIGHTED_GRAPH'
  | 'GRAPH_NETWORK'
  | 'HASH_TABLE'
  | 'TRIE'
  | 'POINT_SET'
  | 'DP_TABLE'
  | 'RECURSION'
  | 'STRING'
  | 'MATRIX';

export interface Point2D {
  x: number;
  y: number;
  label?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  from?: string;
  to?: string;
}

export interface GraphEdgeInput {
  id?: string;
  source?: string;
  target?: string;
  from: string;
  to: string;
  weight?: number;
}

export interface GraphInputState {
  nodes: (string | GraphNode)[];
  edges: GraphEdge[];
  startNode?: string;
  targetNode?: string;
  directed?: boolean;
  weighted?: boolean;
}

export interface KnapsackInputState {
  weights: number[];
  values: number[];
  capacity: number;
}

export interface HashTableInputState {
  keys: string[];
  tableSize: number;
  collisionMethod?: 'chaining' | 'open_addressing';
}

export interface HeapInputState {
  values: number[];
  heapType: 'MIN' | 'MAX';
}

export interface RecursionInputState {
  n: number;
  maxDepth?: number;
}

export interface SlidingWindowInputState {
  values: number[];
  windowSize: number;
}

export interface TwoPointerInputState {
  values: number[];
  targetSum: number;
}

export interface VisualizationInputState {
  algorithmSlug: string;
  structureType: VisualizationType | DataStructureType;
  dataStructureType?: DataStructureType;
  input?: number[];
  target?: number;
  listInput?: number[];
  stackInput?: number[];
  queueInput?: number[];
  trieInput?: string[];
  pointsInput?: Point2D[];
  graph?: GraphInputState;
  knapsackInput?: KnapsackInputState;
  matrixInput?: (number | string)[][];
  hashTableInput?: HashTableInputState;
  heapInput?: HeapInputState;
  recursionInput?: RecursionInputState;
  slidingWindowInput?: SlidingWindowInputState;
  twoPointerInput?: TwoPointerInputState;
  customDataUsed?: boolean;
}
