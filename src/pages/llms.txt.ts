import type { APIRoute } from 'astro';
import { getPosts } from '../mcp/content.js';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export const prerender = true;

export const GET: APIRoute = () => {
	const posts = getPosts().filter(p => !p.slug.startsWith('build-log-'));

	const postList = posts
		.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
		.map(p => `- [${p.title}](https://mirlim.blog/blog/${p.slug}/): ${p.summary || p.description}`)
		.join('\n');

	const body = `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}

## About
- Author: mirlim
- Topics: AI, AX (Agent Experience), MCP, AI Agent, Runtime
- Language: Korean (한국어)
- URL: https://mirlim.blog

## Posts
${postList}

## MCP Server
This blog has an MCP (Model Context Protocol) server for AI agents.
- Endpoint: https://mirlim.blog/mcp (Streamable HTTP)
- Tools: list_posts, get_post, search_posts, ask_blog, explore_concepts, recommend_topic, suggest_topic
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
