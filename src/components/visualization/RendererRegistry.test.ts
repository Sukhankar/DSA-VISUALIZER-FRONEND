import { describe, it, expect } from 'vitest';
import { CANONICAL_RENDERER_KEYS, RENDERER_REGISTRY, getRendererComponent } from './RendererRegistry';

describe('RendererRegistry Coverage and Key Sync Test', () => {
  it('should contain exactly 14 canonical renderer keys', () => {
    expect(CANONICAL_RENDERER_KEYS.length).toBe(14);
  });

  it('should map every canonical key to a valid React renderer component', () => {
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

    expectedKeys.forEach((key) => {
      expect(CANONICAL_RENDERER_KEYS).toContain(key);
      const component = getRendererComponent(key);
      expect(component).toBeDefined();
      expect(RENDERER_REGISTRY[key as keyof typeof RENDERER_REGISTRY]).toBeDefined();
    });
  });

  it('should fallback gracefully to ArrayBarVisualizer for unmapped or invalid keys', () => {
    const fallbackComponent = getRendererComponent('invalid-renderer-key');
    expect(fallbackComponent).toBe(RENDERER_REGISTRY['array']);
  });
});
