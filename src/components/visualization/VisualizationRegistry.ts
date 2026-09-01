import { VisualizationType } from '../../types';

/**
 * Resolves the visual metaphor for a given algorithm slug and optional backend type.
 */
export function resolveVisualizationType(
  slug: string,
  backendType?: VisualizationType
): VisualizationType {
  // 1. If backend supplies a specialized type (other than generic ARRAY), honor it.
  if (backendType && backendType !== 'ARRAY') {
    return backendType;
  }

  const s = slug.toLowerCase();

  // 2. Graphs (Must check BFS/DFS before generic "search" string match!)
  if (
    s.includes('dijkstra') ||
    s.includes('bellman') ||
    s.includes('floyd') ||
    s.includes('kruskal') ||
    s.includes('prim')
  ) {
    return 'WEIGHTED_GRAPH';
  }

  if (
    s.includes('bfs') ||
    s.includes('dfs') ||
    s.includes('breadth') ||
    s.includes('depth') ||
    s.includes('graph') ||
    s.includes('topological')
  ) {
    return 'GRAPH';
  }

  // 3. Trees & Heaps (Must check trees before generic "search" match!)
  if (s.includes('avl')) {
    return 'AVL_TREE';
  }
  if (
    s.includes('bst') ||
    s.includes('tree') ||
    s.includes('ancestor') ||
    s.includes('inorder') ||
    s.includes('preorder') ||
    s.includes('postorder') ||
    s.includes('trie') ||
    s.includes('fenwick') ||
    s.includes('segment') ||
    s.includes('rbt')
  ) {
    return 'BST';
  }
  if (s.includes('heap')) {
    return 'HEAP';
  }

  // 4. Linked List
  if (s.includes('linked-list') || s.includes('list-traversal') || s.includes('cycle')) {
    return 'LINKED_LIST';
  }

  // 5. Stack & Queue
  if (s.includes('stack') || s.includes('parentheses') || s.includes('infix')) {
    return 'STACK';
  }
  if (s.includes('queue') || s.includes('sliding-window')) {
    return 'QUEUE';
  }

  // 6. Searching in Arrays
  if (
    s.includes('binary-search') ||
    s.includes('linear-search') ||
    s.includes('jump-search') ||
    s.includes('interpolation') ||
    s.includes('kadane') ||
    s.includes('search')
  ) {
    return 'ARRAY_INDEXED';
  }

  // 7. Two Pointers / Sliding Window
  if (
    s.includes('two-sum') ||
    s.includes('pointer') ||
    s.includes('palindrome') ||
    s.includes('container') ||
    s.includes('zeroes') ||
    s.includes('3sum')
  ) {
    return 'TWO_POINTER';
  }

  // 8. Dynamic Programming & Recursion
  if (
    s.includes('knapsack') ||
    s.includes('fibonacci') ||
    s.includes('coin') ||
    s.includes('lcs') ||
    s.includes('edit-distance') ||
    s.includes('dp')
  ) {
    return 'DP_TABLE';
  }

  // 9. Backtracking
  if (
    s.includes('n-queens') ||
    s.includes('sudoku') ||
    s.includes('subset') ||
    s.includes('permutation')
  ) {
    return 'BACKTRACKING_GRID';
  }

  // 10. Default Sorting / Array Bar
  return 'ARRAY_BAR';
}
