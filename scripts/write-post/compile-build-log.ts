#!/usr/bin/env bun
/**
 * Run artifact → build-log 아티팩트 자동 생성.
 *
 * Usage:
 *   bun run scripts/write-post/compile-build-log.ts <run-dir>
 *
 * run artifact 폴더를 읽어 작성 과정 기록(build-log)을 같은 run 폴더에 저장.
 * 이것은 콘텐츠 카테고리가 아니라 파이프라인 투명성 아티팩트입니다.
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
const date = new Date().toISOString().split('T')[0];

sections.push('---');
sections.push(`title: '${title} — 작성 과정'`);
sections.push(`run_id: '${manifest.id}'`);
sections.push(`date: '${date}'`);
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
const outputPath = path.join(runDir, 'build-log.md');

fs.writeFileSync(outputPath, content);
console.log(`Build log created: ${outputPath}`);
console.log(`Run: ${manifest.id}`);
