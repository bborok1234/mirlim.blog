import { describe, it, expect } from 'vitest';
import { buildGraph } from '../build-concepts-graph.js';

const mockPosts = [
  {
    slug: 'post-a',
    concepts: [
      { name: 'AI', related: ['ML', 'LLM'] },
      { name: 'MCP', related: ['AI agent'] },
    ],
  },
  {
    slug: 'post-b',
    concepts: [
      { name: 'AI', related: ['ML', 'Deep Learning'] },
      { name: 'UX', related: ['Design'] },
    ],
  },
  {
    slug: 'post-c',
    concepts: [],
  },
  {
    slug: 'post-d',
    // no concepts field
  },
];

describe('buildGraph', () => {
  const graph = buildGraph(mockPosts);

  it('counts concepts correctly', () => {
    expect(graph.meta.totalConcepts).toBe(3); // AI, MCP, UX
  });

  it('counts posts with concepts', () => {
    expect(graph.meta.totalPosts).toBe(2); // post-a, post-b
  });

  it('tracks posts per concept', () => {
    expect(graph.nodes['AI'].posts).toEqual(['post-a', 'post-b']);
    expect(graph.nodes['AI'].postCount).toBe(2);
    expect(graph.nodes['MCP'].posts).toEqual(['post-a']);
  });

  it('merges related terms from multiple posts', () => {
    expect(graph.nodes['AI'].related).toEqual(['ML', 'LLM', 'Deep Learning']);
  });

  it('builds bidirectional neighbors', () => {
    // post-a: AI + MCP → neighbors
    expect(graph.nodes['AI'].neighbors).toContain('MCP');
    expect(graph.nodes['MCP'].neighbors).toContain('AI');
    // post-b: AI + UX → neighbors
    expect(graph.nodes['AI'].neighbors).toContain('UX');
    expect(graph.nodes['UX'].neighbors).toContain('AI');
  });

  it('skips posts with empty or missing concepts', () => {
    expect(graph.meta.totalPosts).toBe(2);
  });

  it('handles empty input', () => {
    const empty = buildGraph([]);
    expect(empty.meta.totalConcepts).toBe(0);
    expect(empty.meta.totalPosts).toBe(0);
  });
});
