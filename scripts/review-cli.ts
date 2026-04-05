/**
 * Review CLI — Editorial Engine 리뷰 큐 관리.
 * review 상태의 항목을 승인/거절/수정지시.
 *
 * Usage:
 *   bun run review                    — 리뷰 대기 항목 목록
 *   bun run review approve <run-id>   — 승인 → published
 *   bun run review reject <run-id>    — 거절 → archived
 *   bun run review revise <run-id>    — 수정 지시 → draft
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { listRuns, readArtifact, transitionRun } from './write-post/run.js';
import type { RunManifest } from './write-post/types.js';

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const RUNS_DIR = path.resolve(process.cwd(), '.pipeline/runs');

// ─── list (기본) ────────────────────────────────────────

function cmdList() {
  const reviewing = listRuns().filter(r => r.status === 'reviewing');

  if (reviewing.length === 0) {
    console.log('\n리뷰 대기 항목이 없습니다.\n');
    console.log('  bun run editorial brief   — 토픽 추천 받기');
    console.log('  bun run editorial status  — 전체 상태 확인\n');
    return;
  }

  console.log(`\n👀 리뷰 대기: ${reviewing.length}개\n`);
  console.log('━'.repeat(70));

  reviewing.forEach((r, i) => {
    const runDir = path.join(RUNS_DIR, r.id);

    // draft 파일 찾기
    const files = fs.readdirSync(runDir).filter(f => f.startsWith('draft') && f.endsWith('.md'));
    const latestDraft = files.sort().pop();

    console.log(`\n  ${i + 1}. ${r.topic}`);
    console.log(`     ID: ${r.id}`);
    console.log(`     생성: ${r.createdAt.split('T')[0]}`);
    if (r.strategy) console.log(`     전략: ${r.strategy} | novelty: ${r.novelty_score ?? '?'}/100`);
    if (latestDraft) console.log(`     초안: .pipeline/runs/${r.id}/${latestDraft}`);
    if (r.editor_notes) console.log(`     메모: ${r.editor_notes}`);
  });

  console.log('\n' + '━'.repeat(70));
  console.log('\n명령어:');
  console.log('  bun run review approve <run-id>           승인 → 발행');
  console.log('  bun run review reject <run-id>            거절');
  console.log('  bun run review revise <run-id> "메모"     수정 지시\n');
}

// ─── approve ────────────────────────────────────────────

function cmdApprove(runId: string) {
  const runDir = path.join(RUNS_DIR, runId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Run을 찾을 수 없습니다: ${runId}`);
    process.exit(1);
  }

  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (manifest.status !== 'reviewing') {
    console.error(`이 run은 "${manifest.status}" 상태입니다. reviewing만 승인 가능.`);
    process.exit(1);
  }

  // draft 파일 찾기
  const files = fs.readdirSync(runDir).filter(f => f.startsWith('draft') && f.endsWith('.md'));
  const latestDraft = files.sort().pop();

  if (!latestDraft) {
    console.error('초안 파일을 찾을 수 없습니다.');
    process.exit(1);
  }

  const draftContent = fs.readFileSync(path.join(runDir, latestDraft), 'utf-8');

  // frontmatter에서 slug 추출 (없으면 run id에서)
  const slugMatch = draftContent.match(/slug:\s*['"]?([^'"\n]+)/);
  const titleMatch = draftContent.match(/title:\s*['"](.+?)['"]/);
  const slug = slugMatch?.[1]?.trim() || manifest.slug || runId.replace(/^\d{4}-\d{2}-\d{2}-/, '');

  // slug 충돌 체크
  const targetPath = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(targetPath)) {
    console.error(`\n⚠️  slug 충돌: ${slug}.md가 이미 존재합니다.`);
    console.error(`   기존: ${targetPath}`);
    console.error('   다른 slug로 변경하거나, 기존 파일을 확인하세요.');
    process.exit(1);
  }

  // draft: true → draft: false
  const publishedContent = draftContent.replace(/draft:\s*true/, 'draft: false');
  fs.writeFileSync(targetPath, publishedContent, 'utf-8');

  // 상태 전환
  transitionRun(runDir, 'completed' as RunManifest['status'], { auto: false });

  console.log(`\n✅ 승인 완료: ${manifest.topic}`);
  console.log(`   발행: src/content/blog/${slug}.md`);
  console.log(`   다음 단계:`);
  console.log(`     1. bun run build  — 빌드 확인 (OG + index 자동 재생성)`);
  console.log(`     2. bun run deploy — 배포\n`);
}

// ─── reject ─────────────────────────────────────────────

function cmdReject(runId: string, reason?: string) {
  const runDir = path.join(RUNS_DIR, runId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Run을 찾을 수 없습니다: ${runId}`);
    process.exit(1);
  }

  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (manifest.status !== 'reviewing') {
    console.error(`이 run은 "${manifest.status}" 상태입니다. reviewing만 거절 가능.`);
    process.exit(1);
  }

  transitionRun(runDir, 'archived' as RunManifest['status'], {
    auto: false,
    editor_notes: reason || '편집장 거절',
  });

  console.log(`\n🗄️  거절: ${manifest.topic}`);
  if (reason) console.log(`   사유: ${reason}`);
  console.log(`   상태: archived\n`);
}

// ─── revise ─────────────────────────────────────────────

function cmdRevise(runId: string, notes?: string) {
  const runDir = path.join(RUNS_DIR, runId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Run을 찾을 수 없습니다: ${runId}`);
    process.exit(1);
  }

  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (manifest.status !== 'reviewing') {
    console.error(`이 run은 "${manifest.status}" 상태입니다. reviewing만 수정 지시 가능.`);
    process.exit(1);
  }

  if (!notes) {
    console.error('수정 지시사항을 입력하세요:');
    console.error('  bun run review revise <run-id> "도입부 톤 수정"');
    process.exit(1);
  }

  transitionRun(runDir, 'drafting' as RunManifest['status'], {
    auto: false,
    editor_notes: notes,
  });

  console.log(`\n✏️  수정 지시: ${manifest.topic}`);
  console.log(`   메모: ${notes}`);
  console.log(`   상태: reviewing → drafting`);
  console.log(`   다음: bun run editorial draft ${runId}\n`);
}

// ─── CLI 라우터 ─────────────────────────────────────────

const [,, command, ...args] = process.argv;

switch (command) {
  case 'approve':
    if (!args[0]) { console.error('Usage: bun run review approve <run-id>'); process.exit(1); }
    cmdApprove(args[0]);
    break;
  case 'reject':
    if (!args[0]) { console.error('Usage: bun run review reject <run-id>'); process.exit(1); }
    cmdReject(args[0], args.slice(1).join(' ') || undefined);
    break;
  case 'revise':
    if (!args[0]) { console.error('Usage: bun run review revise <run-id> "메모"'); process.exit(1); }
    cmdRevise(args[0], args.slice(1).join(' ') || undefined);
    break;
  default:
    cmdList();
}
