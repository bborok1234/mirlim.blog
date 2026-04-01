import { describe, it, expect } from 'vitest';
import { scoreNovelty, findRelatedPosts, recommendTopics } from '../recommend.js';
import type { ConceptsGraph } from '../../../scripts/build-concepts-graph.js';

const graph: ConceptsGraph = {
  nodes: {
    AI: {
      name: 'AI',
      posts: ['post-a', 'post-b'],
      related: ['ML', 'LLM'],
      neighbors: ['MCP', 'UX'],
      postCount: 2,
    },
    MCP: {
      name: 'MCP',
      posts: ['post-a'],
      related: ['AI agent', 'protocol'],
      neighbors: ['AI'],
      postCount: 1,
    },
    UX: {
      name: 'UX',
      posts: ['post-b'],
      related: ['Design', 'Accessibility'],
      neighbors: ['AI'],
      postCount: 1,
    },
  },
  meta: { totalPosts: 2, totalConcepts: 3, builtAt: '2026-01-01' },
};

describe('scoreNovelty', () => {
  it('returns 100 for completely new concepts', () => {
    expect(scoreNovelty(['Quantum', 'Blockchain'], graph)).toBe(100);
  });

  it('returns 0 for all existing concepts', () => {
    expect(scoreNovelty(['AI', 'MCP'], graph)).toBe(0);
  });

  it('returns middle score for mixed concepts', () => {
    const score = scoreNovelty(['AI', 'Blockchain'], graph);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('returns 100 for empty input', () => {
    expect(scoreNovelty([], graph)).toBe(100);
  });

  it('scores related-but-not-concept terms as mid novelty', () => {
    // "ML" exists as related term but not as concept node
    const score = scoreNovelty(['ML'], graph);
    expect(score).toBe(60); // not overlap (60) + not frontier (0)
  });
});

describe('findRelatedPosts', () => {
  it('returns direct posts + neighbor posts', () => {
    const posts = findRelatedPosts('MCP', graph);
    expect(posts).toContain('post-a'); // direct
    expect(posts).toContain('post-b'); // via neighbor AI
  });

  it('returns empty for unknown concept', () => {
    expect(findRelatedPosts('Unknown', graph)).toEqual([]);
  });

  it('deduplicates slugs', () => {
    const posts = findRelatedPosts('AI', graph);
    const unique = new Set(posts);
    expect(posts.length).toBe(unique.size);
  });
});

describe('recommendTopics', () => {
  it('returns suggestions', () => {
    const recs = recommendTopics(graph);
    expect(recs.length).toBeGreaterThan(0);
  });

  it('includes deepen suggestions for single-post concepts', () => {
    const recs = recommendTopics(graph, 20);
    const deepen = recs.filter(r => r.strategy === 'deepen');
    expect(deepen.length).toBeGreaterThan(0);
    // MCP and UX each have 1 post
    const names = deepen.map(r => r.relatedConcepts[0]);
    expect(names).toContain('MCP');
    expect(names).toContain('UX');
  });

  it('includes bridge suggestions for disconnected concepts', () => {
    const recs = recommendTopics(graph, 20);
    const bridge = recs.filter(r => r.strategy === 'bridge');
    // MCP and UX are not neighbors → bridge candidate
    expect(bridge.length).toBeGreaterThan(0);
  });

  it('respects limit', () => {
    const recs = recommendTopics(graph, 2);
    expect(recs.length).toBeLessThanOrEqual(2);
  });

  it('sorts by noveltyScore descending', () => {
    const recs = recommendTopics(graph);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].noveltyScore).toBeLessThanOrEqual(recs[i - 1].noveltyScore);
    }
  });

  it('handles empty graph', () => {
    const empty: ConceptsGraph = {
      nodes: {},
      meta: { totalPosts: 0, totalConcepts: 0, builtAt: '' },
    };
    const recs = recommendTopics(empty);
    expect(recs).toEqual([]);
  });
});
