#!/usr/bin/env bun
/**
 * 새 블로그 포스트 스캐폴딩.
 *
 * Usage:
 *   bun run scripts/new-post.ts "글 제목" --category tutorial --tags "MCP,AX" --series "mirlim.blog 만들기" --order 1
 *   bun run scripts/new-post.ts "짧은 메모" --category note
 *   bun run scripts/new-post.ts "AI 에이전트 설계" (기본: essay)
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help') {
	console.log(`Usage: bun run scripts/new-post.ts "제목" [options]

Options:
  --category  essay|tutorial|research|note (default: essay)
  --tags      쉼표로 구분된 태그 (예: "MCP,AX,tutorial")
  --series    시리즈 이름
  --order     시리즈 내 순서 (숫자)
  --slug      명시적 slug 지정 (예: "my-post-slug")
  --draft     드래프트로 생성 (default: true)
  --tools     사용한 도구들 (예: "Claude Code,gstack")`);
	process.exit(0);
}

const title = args[0];

function getFlag(name: string): string | undefined {
	const idx = args.indexOf(`--${name}`);
	return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

const category = getFlag('category') ?? 'essay';
const tagsRaw = getFlag('tags') ?? '';
const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];
const series = getFlag('series');
const seriesOrder = getFlag('order');
const toolsRaw = getFlag('tools') ?? '';
const tools = toolsRaw ? toolsRaw.split(',').map(t => t.trim()) : [];
const explicitSlug = getFlag('slug');
const isDraft = !args.includes('--no-draft');

// Generate slug from title (or use explicit --slug)
const slug = explicitSlug
	?? (title
		.toLowerCase()
		.replace(/[가-힣]+/g, () => '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
	|| `post-${Date.now()}`);

const date = new Date().toISOString().split('T')[0];
const filename = `${slug || date}.md`;
const filepath = path.join(process.cwd(), 'src/content/blog', filename);

if (fs.existsSync(filepath)) {
	console.error(`File already exists: ${filepath}`);
	process.exit(1);
}

// Build frontmatter
const fm: string[] = [
	'---',
	`title: '${title}'`,
	`description: ''`,
	`summary: ''`,
	`pubDate: '${date}'`,
	`category: '${category}'`,
];

if (tags.length > 0) {
	fm.push(`tags: [${tags.map(t => `'${t}'`).join(', ')}]`);
} else {
	fm.push(`tags: []`);
}

if (series) {
	fm.push(`series: '${series}'`);
	if (seriesOrder) fm.push(`seriesOrder: ${seriesOrder}`);
}

if (tools.length > 0) {
	fm.push(`toolsUsed: [${tools.map(t => `'${t}'`).join(', ')}]`);
}

fm.push(`draft: ${isDraft}`);
fm.push('concepts:');
fm.push("  - name: ''");
fm.push("    related: []");
fm.push('---');
fm.push('');
fm.push(`## ${title}`);
fm.push('');
fm.push('<!-- 여기에 글을 작성하세요 -->');
fm.push('');

fs.writeFileSync(filepath, fm.join('\n'));
console.log(`Created: ${filepath}`);
console.log(`Category: ${category} | Tags: ${tags.join(', ') || 'none'} | Draft: ${isDraft}`);
if (series) console.log(`Series: ${series} #${seriesOrder ?? '?'}`);
console.log(`\nEdit: code ${filepath}`);
console.log(`Preview: bun run dev`);
