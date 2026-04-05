/**
 * Editorial Engine — AI 편집실 상태 머신.
 * concepts graph 기반 토픽 추천 + claude -p로 Post Compiler 호출 + 비동기 큐 관리.
 *
 * Usage:
 *   bun run editorial brief              — 토픽 3개 제안
 *   bun run editorial draft <run-id>     — 선택한 토픽으로 research + draft 실행
 *   bun run editorial retry <run-id>     — failed 상태 아이템 재시도
 *   bun run editorial status             — 전체 큐 상태 요약
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRun, listRuns, updateRun, writeArtifact, transitionRun, retryRun } from './write-post/run.js';
import type { RunManifest } from './write-post/types.js';

// concepts graph는 prebuild에서 생성됨
const GRAPH_PATH = path.resolve(process.cwd(), 'src/mcp/concepts-graph.json');
const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');

interface TopicSuggestion {
  topic: string;
  reason: string;
  strategy: string;
  noveltyScore: number;
  relatedConcepts: string[];
}

function loadRecommendTopics(): TopicSuggestion[] {
  // Dynamic import를 피하고 직접 그래프를 로드해서 recommend 로직 호출
  const { recommendTopics } = require('../src/mcp/recommend.js');
  const { getGraph } = require('../src/mcp/content.js');
  const graph = getGraph();
  return recommendTopics(graph, 5);
}

// ─── brief 서브커맨드 ───────────────────────────────────

async function cmdBrief() {
  const suggestions = loadRecommendTopics();

  if (suggestions.length === 0) {
    console.log('토픽 추천 없음. concepts graph에 데이터가 부족합니다.');
    console.log('글을 더 작성하고 frontmatter에 concepts 필드를 추가하세요.');
    return;
  }

  console.log('\n📋 Editorial Engine — 토픽 추천\n');
  console.log('━'.repeat(60));

  for (let i = 0; i < suggestions.length; i++) {
    const s = suggestions[i];
    console.log(`\n  ${i + 1}. ${s.topic}`);
    console.log(`     전략: ${s.strategy} | novelty: ${s.noveltyScore}/100`);
    console.log(`     이유: ${s.reason}`);
    console.log(`     관련: ${s.relatedConcepts.join(', ')}`);
  }

  console.log('\n' + '━'.repeat(60));
  console.log('\n토픽을 선택하려면:');
  console.log('  bun run editorial draft <번호>   (예: bun run editorial draft 1)\n');

  // 각 추천을 run으로 생성해서 큐에 넣기
  const created: string[] = [];
  for (const s of suggestions) {
    const { runDir, manifest } = createRun(s.topic);

    // brief 단계로 초기화하고 메타데이터 저장
    updateRun(runDir, { status: 'briefing', phase: 2 });
    writeArtifact(runDir, 'brief.json', JSON.stringify({
      topic: s.topic,
      strategy: s.strategy,
      novelty_score: s.noveltyScore,
      reason: s.reason,
      related_concepts: s.relatedConcepts,
      suggested_title: s.topic,
      suggested_tags: s.relatedConcepts.slice(0, 3),
      source: 'editorial-engine',
    }, null, 2));

    // RunManifest에 editorial-engine 메타데이터 추가
    const manifestPath = path.join(runDir, 'run.json');
    const m: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    m.source = 'editorial-engine';
    m.strategy = s.strategy;
    m.novelty_score = s.noveltyScore;
    fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2));

    created.push(manifest.id);
  }

  console.log(`${created.length}개 토픽이 큐에 추가됨 (.pipeline/runs/)`);
}

// ─── draft 서브커맨드 ───────────────────────────────────

async function cmdDraft(arg: string) {
  // arg가 숫자면 최근 brief에서 선택, 아니면 run-id로 취급
  const runs = listRuns().filter(r => r.source === 'editorial-engine' && r.status === 'briefing');

  let targetId: string;
  const num = parseInt(arg, 10);
  if (!isNaN(num) && num >= 1 && num <= runs.length) {
    targetId = runs[num - 1].id;
  } else {
    targetId = arg;
  }

  const runDir = path.resolve(process.cwd(), '.pipeline/runs', targetId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Run을 찾을 수 없습니다: ${targetId}`);
    console.log('사용 가능한 brief:');
    runs.forEach((r, i) => console.log(`  ${i + 1}. ${r.id} — ${r.topic}`));
    process.exit(1);
  }

  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (manifest.status !== 'briefing' && manifest.status !== 'failed') {
    console.error(`이 run은 "${manifest.status}" 상태입니다. briefing 또는 failed 상태만 draft 가능.`);
    process.exit(1);
  }

  console.log(`\n✍️  Draft 시작: ${manifest.topic}`);
  console.log(`   Run: ${manifest.id}`);
  console.log(`   Strategy: ${manifest.strategy || 'unknown'}\n`);

  // claude -p로 Post Compiler 호출
  transitionRun(runDir, 'drafting', { auto: true, phase: 3 });

  try {
    const briefContent = fs.readFileSync(path.join(runDir, 'brief.json'), 'utf-8');
    const prompt = `다음 토픽으로 블로그 글을 작성해주세요. --no-confirm 모드로 사람 승인 없이 초안까지 완성하세요.

토픽: ${manifest.topic}

Brief:
${briefContent}

카테고리: essay
draft: true로 설정하세요.`;

    console.log('Claude Code 호출 중... (시간이 걸릴 수 있습니다)');

    execSync(
      `claude -p --allowedTools "Bash,Read,Write,Edit,Glob,Grep,WebSearch" "${prompt.replace(/"/g, '\\"')}"`,
      {
        cwd: process.cwd(),
        stdio: 'inherit',
        timeout: 600_000, // 10분
        env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.HOME}/.bun/bin:${process.env.PATH}` },
      },
    );

    // draft 완료 → review 상태로 전환
    transitionRun(runDir, 'reviewing', { auto: true });
    console.log('\n✅ Draft 완료. review 큐에 추가됨.');
    console.log('   확인: bun run review');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    transitionRun(runDir, 'failed', { auto: true, error: msg });
    console.error(`\n❌ Draft 실패: ${msg}`);
    console.log(`   재시도: bun run editorial retry ${manifest.id}`);
  }
}

// ─── retry 서브커맨드 ───────────────────────────────────

async function cmdRetry(runId: string) {
  const runDir = path.resolve(process.cwd(), '.pipeline/runs', runId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Run을 찾을 수 없습니다: ${runId}`);
    process.exit(1);
  }

  try {
    const manifest = retryRun(runDir);
    console.log(`♻️  Retry: ${manifest.topic}`);
    console.log(`   상태: failed → ${manifest.status}`);
    console.log(`   다음: bun run editorial draft ${runId}`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

// ─── status 서브커맨드 ──────────────────────────────────

async function cmdStatus() {
  const runs = listRuns();
  const editorial = runs.filter(r => r.source === 'editorial-engine');

  if (editorial.length === 0) {
    console.log('\n큐가 비어있습니다. bun run editorial brief 로 토픽을 추천받으세요.\n');
    return;
  }

  console.log('\n📊 Editorial Engine — 상태\n');
  console.log('━'.repeat(70));
  console.log(`${'상태'.padEnd(12)} ${'ID'.padEnd(28)} ${'토픽'}`);
  console.log('─'.repeat(70));

  const statusOrder: Record<string, number> = {
    reviewing: 0, drafting: 1, briefing: 2, failed: 3,
    completed: 4, archived: 5, researching: 6, compiling: 7,
  };

  editorial
    .sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99))
    .forEach(r => {
      const icon = r.status === 'reviewing' ? '👀' :
                   r.status === 'drafting' ? '✍️' :
                   r.status === 'briefing' ? '💡' :
                   r.status === 'failed' ? '❌' :
                   r.status === 'completed' ? '✅' :
                   r.status === 'archived' ? '🗄️' : '⏳';
      const topic = r.topic.length > 30 ? r.topic.slice(0, 27) + '...' : r.topic;
      console.log(`${icon} ${r.status.padEnd(10)} ${r.id.padEnd(28)} ${topic}`);
    });

  console.log('─'.repeat(70));

  const reviewing = editorial.filter(r => r.status === 'reviewing').length;
  const drafting = editorial.filter(r => r.status === 'drafting').length;
  const briefing = editorial.filter(r => r.status === 'briefing').length;
  const failed = editorial.filter(r => r.status === 'failed').length;

  if (reviewing > 0) console.log(`\n👀 ${reviewing}개 리뷰 대기 — bun run review`);
  if (briefing > 0) console.log(`💡 ${briefing}개 brief 대기 — bun run editorial draft <번호>`);
  if (failed > 0) console.log(`❌ ${failed}개 실패 — bun run editorial retry <run-id>`);
  console.log();
}

// ─── CLI 라우터 ─────────────────────────────────────────

const [,, command, ...args] = process.argv;

switch (command) {
  case 'brief':
    cmdBrief();
    break;
  case 'draft':
    if (!args[0]) {
      console.error('Usage: bun run editorial draft <번호|run-id>');
      process.exit(1);
    }
    cmdDraft(args[0]);
    break;
  case 'retry':
    if (!args[0]) {
      console.error('Usage: bun run editorial retry <run-id>');
      process.exit(1);
    }
    cmdRetry(args[0]);
    break;
  case 'status':
    cmdStatus();
    break;
  default:
    console.log(`
Editorial Engine — AI 편집실

Usage:
  bun run editorial brief              토픽 추천 (concepts graph 기반)
  bun run editorial draft <번호|id>    선택한 토픽으로 초안 생성
  bun run editorial retry <run-id>     실패한 항목 재시도
  bun run editorial status             큐 상태 요약
  bun run review                       리뷰 대기 항목 승인/거절
`);
}
