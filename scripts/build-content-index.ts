import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

interface BlogPost {
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

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/blog');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/mcp/content-index.json');

function buildIndex(): BlogPost[] {
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
				category: data.category,
				series: data.series,
				seriesOrder: data.seriesOrder,
				concepts: data.concepts,
				toolsUsed: data.toolsUsed,
				body: content,
			};
		})
		.filter((p): p is BlogPost => p !== null)
		.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

const posts = buildIndex();
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log(`Content index built: ${posts.length} posts → ${OUTPUT_FILE}`);
