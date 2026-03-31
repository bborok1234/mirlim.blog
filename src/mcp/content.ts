import postsData from './content-index.json';

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	summary?: string;
	pubDate: string;
	updatedDate?: string;
	tags: string[];
	category?: string;
	series?: string;
	seriesOrder?: number;
	concepts?: { name: string; related?: string[] }[];
	toolsUsed?: string[];
	body: string;
}

const posts: BlogPost[] = postsData as BlogPost[];

export function getPosts(): BlogPost[] {
	return posts;
}

export function getPost(slug: string): BlogPost | undefined {
	return posts.find(p => p.slug === slug);
}

export function searchPosts(query: string): BlogPost[] {
	const q = query.toLowerCase();
	return posts.filter(p =>
		p.title.toLowerCase().includes(q) ||
		p.description.toLowerCase().includes(q) ||
		p.body.toLowerCase().includes(q) ||
		p.tags.some(t => t.toLowerCase().includes(q))
	);
}

export function askBlog(question: string): { answer: string; sources: string[] } {
	const q = question.toLowerCase();
	const matches = posts.filter(p =>
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
