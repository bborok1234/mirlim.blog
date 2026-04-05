import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRun, updateRun, transitionRun, retryRun, listRuns, writeArtifact } from '../write-post/run.js';
import { buildGraph } from '../build-concepts-graph.js';
import { recommendTopics } from '../../src/mcp/recommend.js';

const PIPELINE_DIR = path.resolve(process.cwd(), '.pipeline/runs');
const TEST_PREFIX = 'test-editorial-';
let testDirs: string[] = [];

function createTestRun(topic: string, overrides?: Partial<{ source: string; status: string }>) {
  const { runDir, manifest } = createRun(`${TEST_PREFIX}${topic}`);
  if (overrides?.source) {
    const m = JSON.parse(fs.readFileSync(path.join(runDir, 'run.json'), 'utf-8'));
    m.source = overrides.source;
    if (overrides.status) m.status = overrides.status;
    fs.writeFileSync(path.join(runDir, 'run.json'), JSON.stringify(m, null, 2));
  }
  testDirs.push(runDir);
  return { runDir, manifest };
}

afterEach(() => {
  for (const dir of testDirs) {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  }
  testDirs = [];
});

describe('RunManifest history tracking', () => {
  it('transitionRun adds history entry with from/to/at/auto', () => {
    const { runDir } = createTestRun('history-test');
    const result = transitionRun(runDir, 'briefing', { auto: true, phase: 2 });

    expect(result.status).toBe('briefing');
    expect(result.history).toHaveLength(1);
    expect(result.history![0].from).toBe('researching');
    expect(result.history![0].to).toBe('briefing');
    expect(result.history![0].auto).toBe(true);
    expect(result.history![0].at).toBeTruthy();
  });
});

describe('brief generation', () => {
  it('creates brief.json with required fields from recommendTopics output', () => {
    const { runDir } = createTestRun('brief-gen');
    const briefData = {
      topic: 'Test Topic',
      strategy: 'bridge',
      novelty_score: 85,
      reason: 'Two concepts are not connected',
      related_concepts: ['A', 'B'],
      suggested_title: 'Test Title',
      suggested_tags: ['tag1', 'tag2'],
      source: 'editorial-engine',
    };

    writeArtifact(runDir, 'brief.json', JSON.stringify(briefData, null, 2));
    const saved = JSON.parse(fs.readFileSync(path.join(runDir, 'brief.json'), 'utf-8'));

    expect(saved.topic).toBe('Test Topic');
    expect(saved.strategy).toBe('bridge');
    expect(saved.novelty_score).toBe(85);
    expect(saved.related_concepts).toEqual(['A', 'B']);
    expect(saved.source).toBe('editorial-engine');
  });

  it('handles empty concepts graph gracefully', () => {
    // recommendTopics with empty graph returns empty array
    const emptyGraph = buildGraph([]);
    const result = recommendTopics(emptyGraph, 5);

    expect(result).toEqual([]);
  });
});

describe('state transitions', () => {
  it('review → completed (approve)', () => {
    const { runDir } = createTestRun('approve-test');
    transitionRun(runDir, 'reviewing', { auto: true });
    const result = transitionRun(runDir, 'completed', { auto: false });

    expect(result.status).toBe('completed');
    expect(result.history).toHaveLength(2);
    expect(result.history![1].from).toBe('reviewing');
    expect(result.history![1].to).toBe('completed');
    expect(result.history![1].auto).toBe(false);
  });

  it('review → archived (reject) with editor_notes', () => {
    const { runDir } = createTestRun('reject-test');
    transitionRun(runDir, 'reviewing', { auto: true });
    const result = transitionRun(runDir, 'archived', {
      auto: false,
      editor_notes: '주제가 기존 글과 겹침',
    });

    expect(result.status).toBe('archived');
    expect(result.editor_notes).toBe('주제가 기존 글과 겹침');
    expect(result.history![1].editor_notes).toBe('주제가 기존 글과 겹침');
  });

  it('review → drafting (revise) with editor_notes', () => {
    const { runDir } = createTestRun('revise-test');
    transitionRun(runDir, 'reviewing', { auto: true });
    const result = transitionRun(runDir, 'drafting', {
      auto: false,
      editor_notes: '도입부 톤 수정',
    });

    expect(result.status).toBe('drafting');
    expect(result.editor_notes).toBe('도입부 톤 수정');
    expect(result.history![1].from).toBe('reviewing');
    expect(result.history![1].to).toBe('drafting');
  });
});

describe('failed recovery', () => {
  it('retryRun restores previous state from history', () => {
    const { runDir } = createTestRun('retry-test');
    transitionRun(runDir, 'drafting', { auto: true, phase: 3 });
    transitionRun(runDir, 'failed', { auto: true, error: 'claude timeout' });

    const result = retryRun(runDir);

    expect(result.status).toBe('drafting');
    expect(result.error).toBeUndefined();
    expect(result.history).toHaveLength(3);
  });

  it('retryRun throws if not in failed state', () => {
    const { runDir } = createTestRun('retry-nonfailed');
    transitionRun(runDir, 'briefing', { auto: true });

    expect(() => retryRun(runDir)).toThrow('Cannot retry');
  });
});
