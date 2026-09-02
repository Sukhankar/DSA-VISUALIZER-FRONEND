import { VisualizationType } from '../types';
import { DataStructureType, VisualizationInputState, Point2D } from '../types/inputState';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  autoFixAvailable?: boolean;
  fixedInput?: any;
}

export interface VisualizationInputConfig {
  slug?: string;
  visualizationType: VisualizationType;
  dataStructureType: DataStructureType;
  inputMode: 'CUSTOMIZABLE' | 'FIXED_DEMO';
  acceptsUserInput: boolean;
  inputLabel?: string;
  explanation?: string;
  placeholder?: string;
  sampleData?: any;
  inputSchema?: {
    type: string;
    minItems?: number;
    maxItems?: number;
  };
  editableFields?: string[];
  previewType?: string;
  description?: string;
  defaultInput: VisualizationInputState;
  validator?: (state: VisualizationInputState) => ValidationResult;
}

const DEFAULT_CONVEX_HULL_POINTS: Point2D[] = [
  { x: 1, y: 1, label: 'P1' },
  { x: 2, y: 5, label: 'P2' },
  { x: 5, y: 4, label: 'P3' },
  { x: 7, y: 2, label: 'P4' },
  { x: 4, y: 0, label: 'P5' },
  { x: 2, y: 2, label: 'P6' },
];

export const DEFAULT_GRAPH_NODES = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
];

export const DEFAULT_UNWEIGHTED_GRAPH_INPUT = {
  nodes: DEFAULT_GRAPH_NODES,
  edges: [
    { id: 'A-B', source: 'A', target: 'B', from: 'A', to: 'B' },
    { id: 'A-C', source: 'A', target: 'C', from: 'A', to: 'C' },
    { id: 'B-D', source: 'B', target: 'D', from: 'B', to: 'D' },
    { id: 'B-E', source: 'B', target: 'E', from: 'B', to: 'E' },
    { id: 'C-F', source: 'C', target: 'F', from: 'C', to: 'F' },
    { id: 'E-F', source: 'E', target: 'F', from: 'E', to: 'F' },
  ],
  startNode: 'A',
  directed: false,
  weighted: false,
};

export const DEFAULT_WEIGHTED_GRAPH_INPUT = {
  nodes: DEFAULT_GRAPH_NODES,
  edges: [
    { id: 'A-B', source: 'A', target: 'B', from: 'A', to: 'B', weight: 4 },
    { id: 'A-C', source: 'A', target: 'C', from: 'A', to: 'C', weight: 2 },
    { id: 'B-C', source: 'B', target: 'C', from: 'B', to: 'C', weight: 1 },
    { id: 'B-D', source: 'B', target: 'D', from: 'B', to: 'D', weight: 5 },
    { id: 'C-D', source: 'C', target: 'D', from: 'C', to: 'D', weight: 8 },
    { id: 'C-E', source: 'C', target: 'E', from: 'C', to: 'E', weight: 10 },
    { id: 'D-E', source: 'D', target: 'E', from: 'D', to: 'E', weight: 2 },
    { id: 'D-F', source: 'D', target: 'F', from: 'D', to: 'F', weight: 6 },
    { id: 'E-F', source: 'E', target: 'F', from: 'E', to: 'F', weight: 3 },
  ],
  startNode: 'A',
  directed: false,
  weighted: true,
};

export const DEFAULT_DAG_GRAPH_INPUT = {
  nodes: DEFAULT_GRAPH_NODES.slice(0, 5),
  edges: [
    { id: 'A-B', source: 'A', target: 'B', from: 'A', to: 'B' },
    { id: 'A-C', source: 'A', target: 'C', from: 'A', to: 'C' },
    { id: 'B-D', source: 'B', target: 'D', from: 'B', to: 'D' },
    { id: 'C-D', source: 'C', target: 'D', from: 'C', to: 'D' },
    { id: 'D-E', source: 'D', target: 'E', from: 'D', to: 'E' },
  ],
  startNode: 'A',
  directed: true,
  weighted: false,
};

export const ALGORITHM_VISUALIZATION_CONFIGS: Record<string, VisualizationInputConfig> = {
  // --- CONVEX HULL & GEOMETRY ---
  'convex-hull-jarvis': {
    slug: 'convex-hull-jarvis',
    visualizationType: 'CONVEX_HULL',
    dataStructureType: 'POINT_SET',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: '2D Point Set (Coordinates X, Y)',
    explanation: 'Convex Hull (Jarvis March / Gift Wrap) computes the smallest convex polygon containing a 2D point set by wrapping edges around outer points.',
    sampleData: DEFAULT_CONVEX_HULL_POINTS,
    inputSchema: { type: 'POINT_SET', minItems: 3, maxItems: 50 },
    editableFields: ['pointsInput'],
    previewType: 'CARTESIAN_PLANE',
    description: 'Interactive 2D Cartesian Coordinate System with vector cross-product orientation math and convex polygon outline.',
    defaultInput: {
      algorithmSlug: 'convex-hull-jarvis',
      structureType: 'CONVEX_HULL',
      dataStructureType: 'POINT_SET',
      pointsInput: DEFAULT_CONVEX_HULL_POINTS,
    },
    validator: (state) => {
      const pts = state.pointsInput || [];
      if (pts.length < 3) {
        return { isValid: false, message: '⚠ Convex Hull requires at least 3 points.' };
      }
      return { isValid: true, message: '✓ Valid 2D point set' };
    },
  },
  'convex-hull-jarvis-extreme': {
    slug: 'convex-hull-jarvis-extreme',
    visualizationType: 'CONVEX_HULL',
    dataStructureType: 'POINT_SET',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: '2D Point Set (Coordinates X, Y)',
    explanation: 'Jarvis March gift-wrapping algorithm finding outer boundary polygon on 2D Cartesian grid.',
    sampleData: DEFAULT_CONVEX_HULL_POINTS,
    inputSchema: { type: 'POINT_SET', minItems: 3, maxItems: 50 },
    defaultInput: {
      algorithmSlug: 'convex-hull-jarvis-extreme',
      structureType: 'CONVEX_HULL',
      dataStructureType: 'POINT_SET',
      pointsInput: DEFAULT_CONVEX_HULL_POINTS,
    },
    validator: (state) => {
      const pts = state.pointsInput || [];
      if (pts.length < 3) {
        return { isValid: false, message: '⚠ Convex Hull requires at least 3 points.' };
      }
      return { isValid: true, message: '✓ Valid 2D point set' };
    },
  },
  'convex-hull-graham-extreme': {
    slug: 'convex-hull-graham-extreme',
    visualizationType: 'CONVEX_HULL',
    dataStructureType: 'POINT_SET',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: '2D Point Set (Graham Scan)',
    explanation: 'Graham Scan sorts points polar angle-wise around a pivot point before stack-based hull construction.',
    sampleData: DEFAULT_CONVEX_HULL_POINTS,
    defaultInput: {
      algorithmSlug: 'convex-hull-graham-extreme',
      structureType: 'CONVEX_HULL',
      dataStructureType: 'POINT_SET',
      pointsInput: DEFAULT_CONVEX_HULL_POINTS,
    },
  },

  // --- SORTING ---
  'bubble-sort': {
    slug: 'bubble-sort',
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements',
    explanation: 'Bubble Sort repeatedly steps through the array, compares adjacent elements and swaps them if they are in the wrong order.',
    placeholder: '5, 1, 4, 2, 8',
    sampleData: [5, 1, 4, 2, 8],
    defaultInput: {
      algorithmSlug: 'bubble-sort',
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [5, 1, 4, 2, 8],
    },
  },
  'selection-sort': {
    slug: 'selection-sort',
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements',
    explanation: 'Selection Sort repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
    placeholder: '29, 10, 14, 37, 13',
    sampleData: [29, 10, 14, 37, 13],
    defaultInput: {
      algorithmSlug: 'selection-sort',
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [29, 10, 14, 37, 13],
    },
  },
  'insertion-sort': {
    slug: 'insertion-sort',
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements',
    explanation: 'Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position.',
    placeholder: '12, 11, 13, 5, 6',
    sampleData: [12, 11, 13, 5, 6],
    defaultInput: {
      algorithmSlug: 'insertion-sort',
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [12, 11, 13, 5, 6],
    },
  },
  'merge-sort': {
    slug: 'merge-sort',
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements',
    explanation: 'Merge Sort is a Divide and Conquer algorithm that divides the array into sub-arrays, sorts them and merges them.',
    placeholder: '38, 27, 43, 3, 9, 82, 10',
    sampleData: [38, 27, 43, 3, 9, 82, 10],
    defaultInput: {
      algorithmSlug: 'merge-sort',
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [38, 27, 43, 3, 9, 82, 10],
    },
  },
  'quick-sort': {
    slug: 'quick-sort',
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements',
    explanation: 'Quick Sort picks an element as pivot and partitions the given array around the picked pivot.',
    placeholder: '10, 80, 30, 90, 40, 50, 70',
    sampleData: [10, 80, 30, 90, 40, 50, 70],
    defaultInput: {
      algorithmSlug: 'quick-sort',
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [10, 80, 30, 90, 40, 50, 70],
    },
  },
  'heap-sort': {
    slug: 'heap-sort',
    visualizationType: 'HEAP',
    dataStructureType: 'HEAP',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements to Heapify',
    explanation: 'Heap Sort uses a binary heap data structure to find the maximum element in O(1) time.',
    placeholder: '20, 15, 30, 10, 25, 5',
    sampleData: [20, 15, 30, 10, 25, 5],
    defaultInput: {
      algorithmSlug: 'heap-sort',
      structureType: 'HEAP',
      dataStructureType: 'HEAP',
      heapInput: { values: [20, 15, 30, 10, 25, 5], heapType: 'MAX' },
    },
  },

  // --- SEARCHING ---
  'binary-search': {
    slug: 'binary-search',
    visualizationType: 'POINTER_ARRAY',
    dataStructureType: 'SORTED_ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Sorted Array Elements & Target',
    explanation: 'Binary Search works only on sorted data because each comparison eliminates half of the remaining search space.',
    placeholder: '1, 3, 5, 7, 9, 11, 13, 15',
    sampleData: { input: [1, 3, 5, 7, 9, 11, 13, 15], target: 7 },
    defaultInput: {
      algorithmSlug: 'binary-search',
      structureType: 'POINTER_ARRAY',
      dataStructureType: 'SORTED_ARRAY',
      input: [1, 3, 5, 7, 9, 11, 13, 15],
      target: 7,
    },
    validator: (state) => {
      const arr = state.input || [];
      if (!arr || arr.length === 0) {
        return { isValid: false, message: '✕ Input array must contain numbers.' };
      }
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
          const sorted = [...arr].sort((a, b) => a - b);
          return {
            isValid: false,
            message: '⚠ Binary Search requires a sorted array.',
            autoFixAvailable: true,
            fixedInput: sorted,
          };
        }
      }
      return { isValid: true, message: '✓ Valid sorted array' };
    },
  },
  'linear-search': {
    slug: 'linear-search',
    visualizationType: 'ARRAY_CELLS',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array Elements & Search Target',
    explanation: 'Linear Search sequentially checks each element of the list until a match is found.',
    placeholder: '10, 50, 30, 70, 80, 20',
    sampleData: { input: [10, 50, 30, 70, 80, 20], target: 70 },
    defaultInput: {
      algorithmSlug: 'linear-search',
      structureType: 'ARRAY_CELLS',
      dataStructureType: 'ARRAY',
      input: [10, 50, 30, 70, 80, 20],
      target: 70,
    },
  },

  // --- TWO POINTERS & SLIDING WINDOW ---
  'two-sum': {
    slug: 'two-sum',
    visualizationType: 'TWO_POINTERS',
    dataStructureType: 'POINTER_ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Sorted Array & Target Sum',
    explanation: 'Two Pointers places LEFT at start and RIGHT at end, converging inward based on subarray sum comparison.',
    sampleData: { values: [3, 8, 12, 17, 21, 26, 30], targetSum: 29 },
    defaultInput: {
      algorithmSlug: 'two-sum',
      structureType: 'TWO_POINTERS',
      dataStructureType: 'POINTER_ARRAY',
      twoPointerInput: { values: [3, 8, 12, 17, 21, 26, 30], targetSum: 29 },
    },
  },
  'sliding-window': {
    slug: 'sliding-window',
    visualizationType: 'SLIDING_WINDOW',
    dataStructureType: 'ARRAY',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Array & Window Size (k)',
    explanation: 'Sliding Window slides a fixed or variable size window over an array.',
    sampleData: { values: [2, 1, 5, 1, 3, 2], windowSize: 3 },
    defaultInput: {
      algorithmSlug: 'sliding-window',
      structureType: 'SLIDING_WINDOW',
      dataStructureType: 'ARRAY',
      slidingWindowInput: { values: [2, 1, 5, 1, 3, 2], windowSize: 3 },
    },
  },

  // --- LINKED LISTS ---
  'singly-linked-list': {
    slug: 'singly-linked-list',
    visualizationType: 'LINKED_LIST',
    dataStructureType: 'LINKED_LIST',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Node Values Sequence',
    explanation: 'A Singly Linked List consists of node cards connected via pointer references ending at NULL.',
    sampleData: [10, 20, 30, 40, 50],
    defaultInput: {
      algorithmSlug: 'singly-linked-list',
      structureType: 'LINKED_LIST',
      dataStructureType: 'LINKED_LIST',
      listInput: [10, 20, 30, 40, 50],
    },
  },
  'reverse-linked-list': {
    slug: 'reverse-linked-list',
    visualizationType: 'LINKED_LIST',
    dataStructureType: 'LINKED_LIST',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Node Values to Reverse',
    explanation: 'Reversing a linked list changes pointer arrows backwards using PREV, CURR, and NEXT pointers.',
    sampleData: [10, 20, 30, 40, 50],
    defaultInput: {
      algorithmSlug: 'reverse-linked-list',
      structureType: 'LINKED_LIST',
      dataStructureType: 'LINKED_LIST',
      listInput: [10, 20, 30, 40, 50],
    },
  },

  // --- STACK & QUEUE ---
  'stack-operations': {
    slug: 'stack-operations',
    visualizationType: 'STACK',
    dataStructureType: 'STACK',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Initial Stack Elements',
    explanation: 'Stack enforces Last-In, First-Out (LIFO) discipline where elements enter and exit strictly from TOP.',
    sampleData: [10, 20, 30, 40],
    defaultInput: {
      algorithmSlug: 'stack-operations',
      structureType: 'STACK',
      dataStructureType: 'STACK',
      stackInput: [10, 20, 30, 40],
    },
  },
  'queue-operations': {
    slug: 'queue-operations',
    visualizationType: 'QUEUE',
    dataStructureType: 'QUEUE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Initial Queue Elements',
    explanation: 'Queue enforces First-In, First-Out (FIFO) discipline where elements enter at REAR and exit at FRONT.',
    sampleData: [10, 20, 30, 40],
    defaultInput: {
      algorithmSlug: 'queue-operations',
      structureType: 'QUEUE',
      dataStructureType: 'QUEUE',
      queueInput: [10, 20, 30, 40],
    },
  },

  // --- TREES & AVL ---
  'binary-tree': {
    slug: 'binary-tree',
    visualizationType: 'BINARY_TREE',
    dataStructureType: 'BINARY_TREE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Tree Insertion Sequence',
    explanation: 'Values are inserted sequentially into Binary Search Tree.',
    sampleData: [50, 30, 70, 20, 40, 60, 80],
    defaultInput: {
      algorithmSlug: 'binary-tree',
      structureType: 'BINARY_TREE',
      dataStructureType: 'BINARY_TREE',
      input: [50, 30, 70, 20, 40, 60, 80],
    },
  },
  'avl-tree': {
    slug: 'avl-tree',
    visualizationType: 'AVL_TREE',
    dataStructureType: 'AVL_TREE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'AVL Insertion Sequence',
    explanation: 'AVL Tree is a self-balancing binary search tree maintaining |BF| <= 1.',
    sampleData: [30, 20, 10, 25, 40, 50],
    defaultInput: {
      algorithmSlug: 'avl-tree',
      structureType: 'AVL_TREE',
      dataStructureType: 'AVL_TREE',
      input: [30, 20, 10, 25, 40, 50],
    },
  },

  // --- HEAPS ---
  'min-heap': {
    slug: 'min-heap',
    visualizationType: 'HEAP',
    dataStructureType: 'HEAP',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Heap Node Elements',
    explanation: 'Min Heap maintains parent <= children invariant.',
    sampleData: [20, 15, 30, 10, 25, 5],
    defaultInput: {
      algorithmSlug: 'min-heap',
      structureType: 'HEAP',
      dataStructureType: 'HEAP',
      heapInput: { values: [20, 15, 30, 10, 25, 5], heapType: 'MIN' },
    },
  },

  // --- GRAPHS ---
  'breadth-first-search': {
    slug: 'breadth-first-search',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Network (Nodes & Edges)',
    explanation: 'Breadth-First Search (BFS) explores all neighbor nodes at the present depth level before moving deeper, using a FIFO Queue.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'breadth-first-search',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'bfs': {
    slug: 'bfs',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Network (Nodes & Edges)',
    explanation: 'Breadth-First Search (BFS) explores graph nodes layer-by-layer.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'bfs',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'depth-first-search': {
    slug: 'depth-first-search',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Network (Nodes & Edges)',
    explanation: 'Depth-First Search (DFS) explores as far as possible along each branch before backtracking, tracking recursive stack frames.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'depth-first-search',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'dfs': {
    slug: 'dfs',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Network (Nodes & Edges)',
    explanation: 'Depth-First Search (DFS) explores graph paths deeply before backtracking.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'dfs',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'dijkstras-algorithm': {
    slug: 'dijkstras-algorithm',
    visualizationType: 'WEIGHTED_GRAPH',
    dataStructureType: 'WEIGHTED_GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Weighted Graph & Shortest Paths',
    explanation: 'Dijkstra’s Algorithm iteratively selects the unvisited node with the smallest tentative distance and relaxes outgoing edges.',
    sampleData: DEFAULT_WEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'dijkstras-algorithm',
      structureType: 'WEIGHTED_GRAPH',
      dataStructureType: 'WEIGHTED_GRAPH',
      graph: DEFAULT_WEIGHTED_GRAPH_INPUT,
    },
  },
  'prims-mst': {
    slug: 'prims-mst',
    visualizationType: 'WEIGHTED_GRAPH',
    dataStructureType: 'WEIGHTED_GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Weighted Graph for Prim’s MST',
    explanation: 'Prim’s Algorithm grows a Minimum Spanning Tree from a starting node by greedily adding the cheapest cut edge.',
    sampleData: DEFAULT_WEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'prims-mst',
      structureType: 'WEIGHTED_GRAPH',
      dataStructureType: 'WEIGHTED_GRAPH',
      graph: DEFAULT_WEIGHTED_GRAPH_INPUT,
    },
  },
  'kruskals-mst': {
    slug: 'kruskals-mst',
    visualizationType: 'WEIGHTED_GRAPH',
    dataStructureType: 'WEIGHTED_GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Weighted Graph for Kruskal’s MST',
    explanation: 'Kruskal’s Algorithm builds a Minimum Spanning Tree by sorting all edges by weight and adding non-cycling edges via Union-Find.',
    sampleData: DEFAULT_WEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'kruskals-mst',
      structureType: 'WEIGHTED_GRAPH',
      dataStructureType: 'WEIGHTED_GRAPH',
      graph: DEFAULT_WEIGHTED_GRAPH_INPUT,
    },
  },
  'topological-sort': {
    slug: 'topological-sort',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Directed Acyclic Graph (DAG)',
    explanation: 'Topological Sort orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v.',
    sampleData: DEFAULT_DAG_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'topological-sort',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_DAG_GRAPH_INPUT,
    },
  },
  'find-path-graph-easy': {
    slug: 'find-path-graph-easy',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Path Finding',
    explanation: 'Finds if a valid path exists between source and target vertices.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'find-path-graph-easy',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'clone-graph-med': {
    slug: 'clone-graph-med',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Graph Cloning',
    explanation: 'Deep copies an adjacency-list graph structure using hash-map node mappings.',
    sampleData: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'clone-graph-med',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_UNWEIGHTED_GRAPH_INPUT,
    },
  },
  'tarjan-scc-hard': {
    slug: 'tarjan-scc-hard',
    visualizationType: 'GRAPH_NETWORK',
    dataStructureType: 'GRAPH',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Directed Graph for Tarjan’s SCC',
    explanation: 'Tarjan’s algorithm finds Strongly Connected Components using DFS discovery times and low-link values.',
    sampleData: DEFAULT_DAG_GRAPH_INPUT,
    defaultInput: {
      algorithmSlug: 'tarjan-scc-hard',
      structureType: 'GRAPH_NETWORK',
      dataStructureType: 'GRAPH',
      graph: DEFAULT_DAG_GRAPH_INPUT,
    },
  },

  // --- DYNAMIC PROGRAMMING ---
  'fibonacci-dp': {
    slug: 'fibonacci-dp',
    visualizationType: 'DP_TABLE',
    dataStructureType: 'DP_TABLE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Target Fibonacci Number (N)',
    explanation: 'Fibonacci DP memoizes subproblems F(N-1) + F(N-2).',
    sampleData: 7,
    defaultInput: {
      algorithmSlug: 'fibonacci-dp',
      structureType: 'DP_TABLE',
      dataStructureType: 'DP_TABLE',
      input: [7],
    },
  },
  '0-1-knapsack': {
    slug: '0-1-knapsack',
    visualizationType: 'DP_TABLE',
    dataStructureType: 'DP_TABLE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Knapsack Items (Weights, Values) & Capacity',
    explanation: '0/1 Knapsack computes maximum value within capacity limits.',
    sampleData: { weights: [2, 3, 4, 5], values: [3, 4, 5, 7], capacity: 7 },
    defaultInput: {
      algorithmSlug: '0-1-knapsack',
      structureType: 'DP_TABLE',
      dataStructureType: 'DP_TABLE',
      knapsackInput: {
        weights: [2, 3, 4, 5],
        values: [3, 4, 5, 7],
        capacity: 7,
      },
    },
  },

  // --- HASHING ---
  'hash-table': {
    slug: 'hash-table',
    visualizationType: 'HASH_TABLE',
    dataStructureType: 'HASH_TABLE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Keys & Table Configuration',
    explanation: 'Hash Table computes bucket indices using h(k) = key % size.',
    sampleData: { keys: ['apple', 'banana', 'cat', 'dog'], tableSize: 7 },
    defaultInput: {
      algorithmSlug: 'hash-table',
      structureType: 'HASH_TABLE',
      dataStructureType: 'HASH_TABLE',
      hashTableInput: {
        keys: ['apple', 'banana', 'cat', 'dog'],
        tableSize: 7,
        collisionMethod: 'chaining',
      },
    },
  },

  // --- TRIE ---
  'trie-insert': {
    slug: 'trie-insert',
    visualizationType: 'TRIE',
    dataStructureType: 'TRIE',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Words List for Trie Prefix Tree',
    explanation: 'Trie stores string characters along tree paths.',
    sampleData: ['cat', 'car', 'card', 'care', 'dog'],
    defaultInput: {
      algorithmSlug: 'trie-insert',
      structureType: 'TRIE',
      dataStructureType: 'TRIE',
      trieInput: ['cat', 'car', 'card', 'care', 'dog'],
    },
  },

  // --- RECURSION ---
  'factorial-recursion': {
    slug: 'factorial-recursion',
    visualizationType: 'RECURSION_TREE',
    dataStructureType: 'RECURSION',
    inputMode: 'CUSTOMIZABLE',
    acceptsUserInput: true,
    inputLabel: 'Recursion Parameter (N)',
    explanation: 'Factorial Recursion pushes stack frames n * f(n-1) until base case.',
    sampleData: 5,
    defaultInput: {
      algorithmSlug: 'factorial-recursion',
      structureType: 'RECURSION_TREE',
      dataStructureType: 'RECURSION',
      recursionInput: { n: 5, maxDepth: 5 },
    },
  },
};

export function getAlgorithmConfig(slug: string): VisualizationInputConfig {
  const s = slug ? slug.toLowerCase() : '';
  if (ALGORITHM_VISUALIZATION_CONFIGS[s]) {
    return ALGORITHM_VISUALIZATION_CONFIGS[s];
  }

  // Explicit geometry matches
  if (s.includes('convex') || s.includes('jarvis') || s.includes('graham') || s.includes('hull')) {
    return ALGORITHM_VISUALIZATION_CONFIGS['convex-hull-jarvis'];
  }

  // Category keyword fallbacks
  if (s.includes('avl')) return ALGORITHM_VISUALIZATION_CONFIGS['avl-tree'];
  if (s.includes('bst') || s.includes('tree')) return ALGORITHM_VISUALIZATION_CONFIGS['binary-tree'];
  if (s.includes('heap')) return ALGORITHM_VISUALIZATION_CONFIGS['min-heap'];
  if (s.includes('dijkstra')) return ALGORITHM_VISUALIZATION_CONFIGS['dijkstras-algorithm'];
  if (s.includes('bfs')) return ALGORITHM_VISUALIZATION_CONFIGS['bfs'];
  if (s.includes('dfs') || s.includes('graph')) return ALGORITHM_VISUALIZATION_CONFIGS['dfs'];
  if (s.includes('linked-list') || s.includes('list')) return ALGORITHM_VISUALIZATION_CONFIGS['singly-linked-list'];
  if (s.includes('stack')) return ALGORITHM_VISUALIZATION_CONFIGS['stack-operations'];
  if (s.includes('queue')) return ALGORITHM_VISUALIZATION_CONFIGS['queue-operations'];
  if (s.includes('dp') || s.includes('knapsack')) return ALGORITHM_VISUALIZATION_CONFIGS['0-1-knapsack'];
  if (s.includes('trie')) return ALGORITHM_VISUALIZATION_CONFIGS['trie-insert'];
  if (s.includes('hash')) return ALGORITHM_VISUALIZATION_CONFIGS['hash-table'];
  if (s.includes('binary-search') || s.includes('search')) return ALGORITHM_VISUALIZATION_CONFIGS['binary-search'];
  if (s.includes('pointer') || s.includes('two-sum')) return ALGORITHM_VISUALIZATION_CONFIGS['two-sum'];
  if (s.includes('window')) return ALGORITHM_VISUALIZATION_CONFIGS['sliding-window'];
  if (s.includes('sort')) return ALGORITHM_VISUALIZATION_CONFIGS['bubble-sort'];

  // Safe fallback for unconfigured/unknown algorithms (never force ARRAY_BARS blindly)
  return {
    slug: s,
    visualizationType: 'ARRAY_BARS',
    dataStructureType: 'ARRAY',
    inputMode: 'FIXED_DEMO',
    acceptsUserInput: false,
    explanation: 'Visualization configuration unavailable for this algorithm.',
    description: 'No custom input editor registered.',
    defaultInput: {
      algorithmSlug: s,
      structureType: 'ARRAY_BARS',
      dataStructureType: 'ARRAY',
      input: [5, 1, 4, 2, 8],
    },
  };
}

export function getStoredInput(slug: string): VisualizationInputState | null {
  try {
    const raw = sessionStorage.getItem(`codeloom:visualization-input:${slug}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read input state from sessionStorage:', e);
  }
  return null;
}

export function setStoredInput(slug: string, state: VisualizationInputState): void {
  try {
    sessionStorage.setItem(`codeloom:visualization-input:${slug}`, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save input state to sessionStorage:', e);
  }
}
