import type { APIRoute } from 'astro';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from '../mcp/server.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const server = createMcpServer();
	const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

	await server.connect(transport);

	const body = await request.text();
	const response = await transport.handleRequest(request, body);

	await server.close();

	return response;
};

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify({
		name: 'mirlim-blog',
		version: '0.1.0',
		description: 'AI/AX 시대의 생각과 전문지식을 공유하는 블로그 MCP 서버',
		tools: ['list_posts', 'get_post', 'search_posts', 'ask_blog', 'explore_concepts', 'recommend_topic', 'suggest_topic'],
	}), {
		headers: { 'Content-Type': 'application/json' },
	});
};
