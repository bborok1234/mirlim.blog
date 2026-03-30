import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	summary?: string;
	pubDate: string;
	updatedDate?: string;
	tags: string[];
	concepts?: { name: string; related?: string[] }[];
	body: string;
}

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/blog');

function parsePosts(): BlogPost[] {
	if (!fs.existsSync(CONTENT_DIR)) return [];

	const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

	return files
		.map(file => {
			const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
			const { data, content } = matter(raw);

			if (data.draft) return null;

			return {
				slug: file.replace(/\.(md|mdx)$/, ''),
				title: data.title ?? '',
				description: data.description ?? '',
				summary: data.summary,
				pubDate: String(data.pubDate),
				updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
				tags: data.tags ?? [],
				concepts: data.concepts,
				body: content,
			};
		})
		.filter((p): p is BlogPost => p !== null)
		.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

let cachedPosts: BlogPost[] | null = null;

export function getPosts(): BlogPost[] {
	if (!cachedPosts) cachedPosts = parsePosts();
	return cachedPosts;
}

export function getPost(slug: string): BlogPost | undefined {
	return getPosts().find(p => p.slug === slug);
}

export function searchPosts(query: string): BlogPost[] {
	const q = query.toLowerCase();
	return getPosts().filter(p =>
		p.title.toLowerCase().includes(q) ||
		p.description.toLowerCase().includes(q) ||
		p.body.toLowerCase().includes(q) ||
		p.tags.some(t => t.toLowerCase().includes(q))
	);
}

export function askBlog(question: string): { answer: string; sources: string[] } {
	const q = question.toLowerCase();
	const matches = getPosts().filter(p =>
		p.title.toLowerCase().includes(q) ||
		p.body.toLowerCase().includes(q) ||
		p.tags.some(t => t.toLowerCase().includes(q)) ||
		p.concepts?.some(c => c.name.toLowerCase().includes(q))
	);

	if (matches.length === 0) {
		return { answer: `"${question}"에 대한 관련 글을 찾지 못했습니다.`, sources: [] };
	}

	const summaries = matches.map(p => `- "${p.title}": ${p.summary ?? p.description}`).join('\n');
	return {
		answer: `"${question}"에 대해 ${matches.length}개의 관련 글을 찾았습니다:\n${summaries}`,
		sources: matches.map(p => p.slug),
	};
}
