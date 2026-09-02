import React from 'react';
import { RendererKey } from '../../types/contract';

import { ArrayBarVisualizer } from './ArrayBarVisualizer';
import { PointerArrayVisualizer } from './PointerArrayVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { HashTableVisualizer } from './HashTableVisualizer';
import { TrieVisualizer } from './TrieVisualizer';
import { RecursionTreeVisualizer } from './RecursionTreeVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { ConvexHullVisualizer } from './ConvexHullVisualizer';

export const CANONICAL_RENDERER_KEYS: RendererKey[] = [
  'array',
  'pointer-array',
  'linked-list',
  'stack',
  'queue',
  'tree',
  'heap',
  'graph',
  'hash-table',
  'trie',
  'recursion-tree',
  'dp-table',
  'string',
  'geometry',
];

export const RENDERER_REGISTRY: Record<RendererKey, React.ComponentType<any>> = {
  'array': ArrayBarVisualizer,
  'pointer-array': PointerArrayVisualizer,
  'linked-list': LinkedListVisualizer,
  'stack': StackVisualizer,
  'queue': QueueVisualizer,
  'tree': TreeVisualizer,
  'heap': HeapVisualizer,
  'graph': GraphVisualizer,
  'hash-table': HashTableVisualizer,
  'trie': TrieVisualizer,
  'recursion-tree': RecursionTreeVisualizer,
  'dp-table': DPTableVisualizer,
  'string': ArrayBarVisualizer,
  'geometry': ConvexHullVisualizer,
};

export function getRendererComponent(rendererKey: string): React.ComponentType<any> {
  const key = (rendererKey || '').toLowerCase() as RendererKey;
  if (key in RENDERER_REGISTRY) {
    return RENDERER_REGISTRY[key];
  }
  return ArrayBarVisualizer;
}
