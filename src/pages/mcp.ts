import type { APIRoute } from 'astro';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { getPosts, getPost, searchPosts, askBlog } from '../mcp/content.js';

export const prerender = false;

const suggestions: { topic: string; context?: string; timestamp: string }[] = [];

function createServer() {
	const server = new McpServer({
		name: 'mirlim-blog',
		version: '0.1.0',
	});

	server.tool('list_posts', '블로그 글 목록을 조회합니다. 태그, 날짜, 요약 포함.', {
		tag: z.string().optional().describe('특정 태그로 필터링'),
		limit: z.number().optional().describe('반환할 최대 글 수 (기본: 전체)'),
	}, async ({ tag, limit }) => {
		let posts = getPosts();
		if (tag) posts = posts.filter(p => p.tags.includes(tag));
		if (limit) posts = posts.slice(0, limit);
		const result = posts.map(({ slug, title, pubDate, tags, summary, description }) => ({
			slug, title, pubDate, tags, summary: summary ?? description,
		}));
		return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
	});

	server.tool('get_post', '특정 글의 상세 내용을 조회합니다. 구조화된 JSON으로 반환.', {
		slug: z.string().describe('글의 slug (파일명에서 확장자 제외)'),
	}, async ({ slug }) => {
		const post = getPost(slug);
		if (!post) return { content: [{ type: 'text' as const, text: `글을 찾을 수 없습니다: ${slug}` }], isError: true };
		return { content: [{ type: 'text' as const, text: JSON.stringify(post, null, 2) }] };
	});

	server.tool('search_posts', '키워드 또는 태그로 글을 검색합니다.', {
		query: z.string().describe('검색할 키워드'),
	}, async ({ query }) => {
		const results = searchPosts(query);
		const output = results.map(({ slug, title, pubDate, tags, summary, description }) => ({
			slug, title, pubDate, tags, summary: summary ?? description,
		}));
		return { content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }] };
	});

	server.tool('ask_blog', '블로그 콘텐츠에 대해 자연어로 질문합니다. (Phase 1: 키워드 매칭 기반)', {
		question: z.string().describe('질문 내용'),
	}, async ({ question }) => {
		const result = askBlog(question);
		return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
	});

	server.tool('suggest_topic', '블로그 작성자에게 토픽을 제안합니다.', {
		topic: z.string().max(500).describe('제안할 토픽 (최대 500자)'),
		context: z.string().max(1000).optional().describe('왜 이 토픽이 필요한지 맥락 (선택)'),
	}, async ({ topic, context }) => {
		if (suggestions.length >= 100) {
			return { content: [{ type: 'text' as const, text: '일일 제안 한도(100건)에 도달했습니다.' }], isError: true };
		}
		suggestions.push({ topic, context, timestamp: new Date().toISOString() });
		return { content: [{ type: 'text' as const, text: `토픽 제안이 등록되었습니다: "${topic}"` }] };
	});

	return server;
}

export const POST: APIRoute = async ({ request }) => {
	const server = createServer();
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
		tools: ['list_posts', 'get_post', 'search_posts', 'ask_blog', 'suggest_topic'],
	}), {
		headers: { 'Content-Type': 'application/json' },
	});
};
