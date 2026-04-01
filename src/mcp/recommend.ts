import type { ConceptsGraph } from '../../scripts/build-concepts-graph.js';

export interface TopicSuggestion {
  topic: string;
  reason: string;
  strategy: 'bridge' | 'deepen' | 'frontier';
  noveltyScore: number;
  relatedConcepts: string[];
}

/**
 * Score how novel a topic is against the existing concepts graph.
 * Returns 0-100 (higher = more novel).
 */
export function scoreNovelty(
  relatedConcepts: string[],
  graph: ConceptsGraph,
): number {
  if (relatedConcepts.length === 0) return 100;

  const existingNames = new Set(Object.keys(graph.nodes));
  const allRelated = new Set(
    Object.values(graph.nodes).flatMap(n => n.related),
  );

  let overlapCount = 0;
  let frontierCount = 0;

  for (const concept of relatedConcepts) {
    if (existingNames.has(concept)) {
      overlapCount++;
    } else if (!allRelated.has(concept)) {
      frontierCount++;
    }
  }

  const overlapRatio = overlapCount / relatedConcepts.length;
  const frontierRatio = frontierCount / relatedConcepts.length;

  // (1 - overlap) * 60 + frontier * 40
  return Math.round((1 - overlapRatio) * 60 + frontierRatio * 40);
}

/**
 * Find post slugs related to a given concept — direct posts + neighbor posts.
 */
export function findRelatedPosts(
  conceptName: string,
  graph: ConceptsGraph,
): string[] {
  const node = graph.nodes[conceptName];
  if (!node) return [];

  const slugs = new Set(node.posts);
  for (const neighbor of node.neighbors) {
    for (const slug of graph.nodes[neighbor]?.posts ?? []) {
      slugs.add(slug);
    }
  }
  return [...slugs];
}

/**
 * Generate next-topic recommendations using three strategies.
 */
export function recommendTopics(
  graph: ConceptsGraph,
  limit = 5,
): TopicSuggestion[] {
  const suggestions: TopicSuggestion[] = [];

  const nodes = Object.values(graph.nodes);
  const allNames = new Set(Object.keys(graph.nodes));

  // Strategy 1: Bridge — find concept pairs that share no posts and aren't neighbors
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.neighbors.includes(b.name)) continue;

      const sharedPosts = a.posts.filter(s => b.posts.includes(s));
      if (sharedPosts.length > 0) continue;

      suggestions.push({
        topic: `${a.name} × ${b.name}`,
        reason: `이 두 concept은 현재 연결이 없습니다. 둘을 잇는 글이 그래프를 풍부하게 만듭니다.`,
        strategy: 'bridge',
        noveltyScore: scoreNovelty([a.name, b.name], graph),
        relatedConcepts: [a.name, b.name],
      });
    }
  }

  // Strategy 2: Deepen — concepts appearing in only 1 post
  for (const node of nodes) {
    if (node.postCount === 1) {
      suggestions.push({
        topic: `${node.name} deep dive`,
        reason: `"${node.name}"은 1개 글에만 등장합니다. 전용 글로 확장하면 깊이가 더해집니다.`,
        strategy: 'deepen',
        noveltyScore: scoreNovelty([node.name, ...node.related], graph),
        relatedConcepts: [node.name, ...node.related.slice(0, 2)],
      });
    }
  }

  // Strategy 3: Frontier — related terms not yet promoted to first-class concepts
  const allRelated = new Map<string, string[]>(); // term → parent concepts
  for (const node of nodes) {
    for (const rel of node.related) {
      if (!allNames.has(rel)) {
        if (!allRelated.has(rel)) allRelated.set(rel, []);
        allRelated.get(rel)!.push(node.name);
      }
    }
  }

  // Sort by number of parent concepts (more references = higher demand)
  const frontierTerms = [...allRelated.entries()]
    .sort((a, b) => b[1].length - a[1].length);

  for (const [term, parents] of frontierTerms) {
    if (parents.length >= 2) {
      suggestions.push({
        topic: term,
        reason: `"${term}"이 ${parents.length}개 concept에서 참조되지만 독립 글이 없습니다: ${parents.join(', ')}.`,
        strategy: 'frontier',
        noveltyScore: scoreNovelty([term], graph),
        relatedConcepts: [term, ...parents.slice(0, 2)],
      });
    }
  }

  // Sort by noveltyScore descending, take top N
  return suggestions
    .sort((a, b) => b.noveltyScore - a.noveltyScore)
    .slice(0, limit);
}
