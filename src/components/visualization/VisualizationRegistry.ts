import { VisualizationType } from '../../types';
import { ALGORITHM_VISUALIZATION_CONFIGS } from '../../config/visualizationConfig';

/**
 * Resolves the visual metaphor for a given algorithm slug and optional backend type.
 */
export function resolveVisualizationType(
  slug: string,
  backendType?: VisualizationType
): VisualizationType {
  const s = slug.toLowerCase();

  // 1. Check explicit config mapping first
  if (ALGORITHM_VISUALIZATION_CONFIGS[s]) {
    return ALGORITHM_VISUALIZATION_CONFIGS[s].visualizationType;
  }

  // 2. If backend supplies a specific non-generic type, honor it
  if (backendType && backendType !== 'ARRAY' && backendType !== 'ARRAY_BAR') {
    return backendType;
  }

  // 3. Fallback resolution rules by slug keywords
  if (s.includes('convex') || s.includes('jarvis') || s.includes('graham') || s.includes('hull')) {
    return 'CONVEX_HULL';
  }
  if (s.includes('dijkstra') || s.includes('bellman') || s.includes('floyd') || s.includes('kruskal') || s.includes('prim')) {
    return 'WEIGHTED_GRAPH';
  }
  if (s.includes('bfs') || s.includes('dfs') || s.includes('graph') || s.includes('topological')) {
    return 'GRAPH_NETWORK';
  }
  if (s.includes('avl')) {
    return 'AVL_TREE';
  }
  if (s.includes('trie')) {
    return 'TRIE';
  }
  if (s.includes('bst') || s.includes('tree')) {
    return 'BST';
  }
  if (s.includes('heap')) {
    return 'HEAP';
  }
  if (s.includes('doubly') && s.includes('list')) {
    return 'DOUBLY_LINKED_LIST';
  }
  if (s.includes('linked-list') || s.includes('list')) {
    return 'LINKED_LIST';
  }
  if (s.includes('stack')) {
    return 'STACK';
  }
  if (s.includes('queue')) {
    return 'QUEUE';
  }
  if (s.includes('sliding-window') || s.includes('window') || s.includes('kadane')) {
    return 'SLIDING_WINDOW';
  }
  if (s.includes('binary-search') || s.includes('linear-search') || s.includes('jump-search') || s.includes('interpolation')) {
    return 'POINTER_ARRAY';
  }
  if (s.includes('two-sum') || s.includes('pointer') || s.includes('two-pointers')) {
    return 'TWO_POINTERS';
  }
  if (s.includes('dp') || s.includes('knapsack') || s.includes('lcs') || s.includes('fibonacci')) {
    return 'DP_TABLE';
  }
  if (s.includes('hash')) {
    return 'HASH_TABLE';
  }
  if (s.includes('factorial') || s.includes('recursion') || s.includes('call-stack')) {
    return 'RECURSION_TREE';
  }

  return 'ARRAY_BARS';
}
