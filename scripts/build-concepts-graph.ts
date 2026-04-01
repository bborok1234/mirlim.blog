import fs from 'node:fs';
import path from 'node:path';

export interface ConceptNode {
  name: string;
  posts: string[];
  related: string[];
  neighbors: string[];
  postCount: number;
}

export interface ConceptsGraph {
  nodes: Record<string, ConceptNode>;
  meta: {
    totalPosts: number;
    totalConcepts: number;
    builtAt: string;
  };
}

interface PostEntry {
  slug: string;
  concepts?: { name: string; related?: string[] }[];
}

/** Build a concepts graph from an array of posts. Pure function — no I/O. */
export function buildGraph(posts: PostEntry[]): ConceptsGraph {
  const nodes: Record<string, ConceptNode> = {};

  const postsWithConcepts = posts.filter(p => p.concepts?.length);

  // Pass 1: collect posts[] and related[] per concept
  for (const post of postsWithConcepts) {
    for (const concept of post.concepts!) {
      const key = concept.name;
      if (!nodes[key]) {
        nodes[key] = { name: key, posts: [], related: [], neighbors: [], postCount: 0 };
      }
      const node = nodes[key];
      if (!node.posts.includes(post.slug)) {
        node.posts.push(post.slug);
        node.postCount = node.posts.length;
      }
      for (const rel of concept.related ?? []) {
        if (!node.related.includes(rel)) {
          node.related.push(rel);
        }
      }
    }
  }

  // Pass 2: build neighbors (concepts co-occurring in the same post)
  for (const post of postsWithConcepts) {
    const names = post.concepts!.map(c => c.name);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = nodes[names[i]];
        const b = nodes[names[j]];
        if (!a.neighbors.includes(names[j])) a.neighbors.push(names[j]);
        if (!b.neighbors.includes(names[i])) b.neighbors.push(names[i]);
      }
    }
  }

  return {
    nodes,
    meta: {
      totalPosts: postsWithConcepts.length,
      totalConcepts: Object.keys(nodes).length,
      builtAt: new Date().toISOString(),
    },
  };
}

// CLI entry point
const INDEX_FILE = path.resolve(process.cwd(), 'src/mcp/content-index.json');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/mcp/concepts-graph.json');

if (process.argv[1]?.endsWith('build-concepts-graph.ts')) {
  const posts: PostEntry[] = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  const graph = buildGraph(posts);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graph, null, 2));
  console.log(
    `Concepts graph built: ${graph.meta.totalConcepts} concepts from ${graph.meta.totalPosts} posts → ${OUTPUT_FILE}`,
  );
}
