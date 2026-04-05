/**
 * Run artifact 관리 — 생성, 상태 업데이트, resume 지원.
 * 각 파이프라인 실행은 .pipeline/runs/<date>-<slug>/ 에 저장.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { RunManifest, StateTransition } from './types';

const PIPELINE_DIR = path.resolve(process.cwd(), '.pipeline/runs');

/** 토픽에서 run ID용 slug 생성 */
function topicToSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[가-힣]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

/** 새 run artifact 디렉토리 + run.json 생성 */
export function createRun(topic: string): { runDir: string; manifest: RunManifest } {
  const date = new Date().toISOString().split('T')[0];
  const slug = topicToSlug(topic);
  const id = `${date}-${slug}`;
  const runDir = path.join(PIPELINE_DIR, id);

  fs.mkdirSync(runDir, { recursive: true });

  const manifest: RunManifest = {
    id,
    topic,
    status: 'researching',
    phase: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeManifest(runDir, manifest);
  return { runDir, manifest };
}

/** 기존 run 로드 (--resume 용) */
export function loadRun(runId: string): { runDir: string; manifest: RunManifest } | null {
  const runDir = path.join(PIPELINE_DIR, runId);
  const manifestPath = path.join(runDir, 'run.json');

  if (!fs.existsSync(manifestPath)) return null;

  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  return { runDir, manifest };
}

/** run.json 매니페스트 업데이트 */
export function updateRun(
  runDir: string,
  updates: Partial<Pick<RunManifest, 'status' | 'phase' | 'slug' | 'error'>>,
): RunManifest {
  const manifestPath = path.join(runDir, 'run.json');
  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  Object.assign(manifest, updates, { updatedAt: new Date().toISOString() });
  writeManifest(runDir, manifest);
  return manifest;
}

/** run artifact 파일 쓰기 (brief.json, research.md 등) */
export function writeArtifact(runDir: string, filename: string, content: string): void {
  fs.writeFileSync(path.join(runDir, filename), content, 'utf-8');
}

/** run artifact 파일 읽기 */
export function readArtifact(runDir: string, filename: string): string | null {
  const filepath = path.join(runDir, filename);
  if (!fs.existsSync(filepath)) return null;
  return fs.readFileSync(filepath, 'utf-8');
}

/** 모든 run 목록 반환 (최신순) */
export function listRuns(): RunManifest[] {
  if (!fs.existsSync(PIPELINE_DIR)) return [];

  return fs.readdirSync(PIPELINE_DIR)
    .filter(d => fs.existsSync(path.join(PIPELINE_DIR, d, 'run.json')))
    .map(d => JSON.parse(fs.readFileSync(path.join(PIPELINE_DIR, d, 'run.json'), 'utf-8')) as RunManifest)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** 상태 전환 + 히스토리 기록 */
export function transitionRun(
  runDir: string,
  toStatus: RunManifest['status'],
  opts: { auto?: boolean; editor_notes?: string; phase?: number; error?: string } = {},
): RunManifest {
  const manifestPath = path.join(runDir, 'run.json');
  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const transition: StateTransition = {
    from: manifest.status,
    to: toStatus,
    at: new Date().toISOString(),
    auto: opts.auto ?? true,
  };
  if (opts.editor_notes) transition.editor_notes = opts.editor_notes;

  if (!manifest.history) manifest.history = [];
  manifest.history.push(transition);

  manifest.status = toStatus;
  manifest.updatedAt = new Date().toISOString();
  if (opts.phase !== undefined) manifest.phase = opts.phase;
  if (opts.editor_notes) manifest.editor_notes = opts.editor_notes;
  if (opts.error) manifest.error = opts.error;
  if (toStatus !== 'failed') manifest.error = undefined;

  writeManifest(runDir, manifest);
  return manifest;
}

/** failed 상태에서 이전 상태로 복구 */
export function retryRun(runDir: string): RunManifest {
  const manifestPath = path.join(runDir, 'run.json');
  const manifest: RunManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  if (manifest.status !== 'failed') {
    throw new Error(`Cannot retry: status is "${manifest.status}", not "failed"`);
  }

  const history = manifest.history ?? [];
  const failTransition = [...history].reverse().find(t => t.to === 'failed');
  const previousStatus = failTransition?.from ?? 'briefing';

  return transitionRun(runDir, previousStatus as RunManifest['status'], { auto: false });
}

function writeManifest(runDir: string, manifest: RunManifest): void {
  fs.writeFileSync(
    path.join(runDir, 'run.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8',
  );
}
