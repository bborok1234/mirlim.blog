#!/usr/bin/env bun
/**
 * Run artifact → build-log 카테고리 글 자동 변환.
 *
 * Usage:
 *   bun run scripts/write-post/compile-build-log.ts <run-dir>
 *
 * run artifact 폴더를 읽어 build-log 카테고리의 draft 글을 생성.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { RunManifest, Brief, Review, Recommendation } from './types';

const runDir = process.argv[2];
if (!runDir) {
  console.error('Usage: bun run scripts/write-post/compile-build-log.ts <run-dir>');
  process.exit(1);
}

function readJSON<T>(filename: string): T | null {
  const filepath = path.join(runDir, filename);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

function readText(filename: string): string | null {
  const filepath = path.join(runDir, filename);
  if (!fs.existsSync(filepath)) return null;
  return fs.readFileSync(filepath, 'utf-8');
}

const manifest = readJSON<RunManifest>('run.json');
if (!manifest) {
  console.error('run.json not found in', runDir);
  process.exit(1);
}

const brief = readJSON<Brief>('brief.json');
const review = readJSON<Review>('review.json');
const research = readText('research.md');
const recommendations = readJSON<Recommendation[]>('recommendations.json');

// Build the build-log markdown
const sections: string[] = [];

// Frontmatter
const title = brief?.selectedTitle ?? manifest.topic;
const buildLogSlug = `build-log-${manifest.slug ?? manifest.id}`;
const date = new Date().toISOString().split('T')[0];

sections.push('---');
sections.push(`title: '[Build Log] ${title} — 작성 과정'`);
sections.push(`description: '${title} 글의 리서치, 초안, 검수 과정을 기록한 빌드로그.'`);
sections.push(`summary: 'Post Compiler 파이프라인으로 작성된 빌드로그. 리서치부터 발행까지의 전 과정.'`);
sections.push(`pubDate: '${date}'`);
sections.push(`category: 'build-log'`);
sections.push(`series: 'mirlim.blog 만들기'`);
sections.push(`tags: ['build-log', 'Content Pipeline', 'Claude Code']`);
sections.push(`toolsUsed: ['Claude Code', 'Post Compiler']`);
sections.push(`draft: true`);
sections.push('concepts:');
sections.push("  - name: 'Content Pipeline'");
sections.push("    related: ['Claude Code', 'automation', 'Post Compiler']");
sections.push('---');
sections.push('');

// Research section
if (research) {
  sections.push('## 리서치');
  sections.push('');
  // Extract key findings (first 30 lines or full content if shorter)
  const lines = research.split('\n');
  sections.push(lines.slice(0, 30).join('\n'));
  if (lines.length > 30) sections.push('\n_(전체 리서치는 run artifact 참조)_');
  sections.push('');
}

// Angle selection
if (brief) {
  sections.push('## 각도 선택');
  sections.push('');
  if (brief.angles.length > 0) {
    sections.push('파이프라인이 제시한 각도 옵션:');
    sections.push('');
    for (const angle of brief.angles) {
      const selected = angle.id === brief.selectedAngle ? ' ✅' : '';
      sections.push(`- **${angle.id}**: ${angle.description} (novelty: ${angle.noveltyScore}/100)${selected}`);
    }
    sections.push('');
  }
  if (brief.selectedTitle) {
    sections.push(`선택된 제목: **${brief.selectedTitle}**`);
    sections.push('');
  }
}

// Review section
if (review) {
  sections.push('## AI Slop 검수');
  sections.push('');
  sections.push(`- Novelty Score: ${review.noveltyScore}/100`);
  sections.push(`- Reproducibility Score: ${review.reproducibilityScore}/100`);
  sections.push(`- Verdict: **${review.verdict}**`);
  sections.push('');
  if (review.slopPatterns.length > 0) {
    sections.push('수정된 패턴:');
    sections.push('');
    for (const sp of review.slopPatterns) {
      sections.push(`- **${sp.pattern}** (${sp.location}): \`${sp.original}\` → \`${sp.fixed}\``);
    }
    sections.push('');
  }
  if (review.comments.length > 0) {
    sections.push('리뷰어 코멘트:');
    sections.push('');
    for (const c of review.comments) {
      sections.push(`> ${c}`);
    }
    sections.push('');
  }
}

// Recommendations
if (recommendations && recommendations.length > 0) {
  sections.push('## 다음 글 추천');
  sections.push('');
  for (const rec of recommendations) {
    sections.push(`1. **${rec.topic}** (${rec.suggestedCategory})`);
    sections.push(`   ${rec.reason}`);
  }
  sections.push('');
}

// Pipeline metadata
sections.push('---');
sections.push('');
sections.push(`_이 빌드로그는 Post Compiler 파이프라인 \`${manifest.id}\` 실행에서 자동 생성되었습니다._`);
sections.push('');

const content = sections.join('\n');
const outputPath = path.join(process.cwd(), 'src/content/blog', `${buildLogSlug}.md`);

if (fs.existsSync(outputPath)) {
  console.error(`Build log already exists: ${outputPath}`);
  process.exit(1);
}

fs.writeFileSync(outputPath, content);
console.log(`Build log created: ${outputPath}`);
console.log(`Run: ${manifest.id} | Slug: ${buildLogSlug} | Draft: true`);
