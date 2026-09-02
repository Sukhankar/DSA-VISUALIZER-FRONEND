import { CANONICAL_RENDERER_KEYS, RENDERER_REGISTRY } from './RendererRegistry';

export function testRendererRegistryCoverage(): boolean {
  const expectedKeys = [
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

  if (CANONICAL_RENDERER_KEYS.length !== 14) {
    throw new Error('Canonical keys count must be 14');
  }

  for (const key of expectedKeys) {
    if (!CANONICAL_RENDERER_KEYS.includes(key as any)) {
      throw new Error(`Missing expected key: ${key}`);
    }
    if (!RENDERER_REGISTRY[key as keyof typeof RENDERER_REGISTRY]) {
      throw new Error(`Missing component mapping for key: ${key}`);
    }
  }

  return true;
}

// Self-executing verification on module import
testRendererRegistryCoverage();
