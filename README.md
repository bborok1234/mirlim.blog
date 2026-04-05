# mirlim.blog

AI/AX 시대의 생각, 전문지식, 결과물을 공유하는 개인 블로그.
사람과 AI 에이전트 모두를 위해 설계.

## Quick Start

1. `bun install`
2. `bun run dev` — [localhost:4321](http://localhost:4321) 에서 프리뷰
3. `/write-post "글감"` — Claude Code에서 실행하면 리서치→초안→검수→발행 원스톱

## Post Compiler

글 쓰는 과정 자체가 시스템. `/write-post` 파이프라인을 실행하면:

```
토픽 → 리서치 → Brief(각도 선택) → 초안 → AI Slop 검수 → 발행 → 빌드로그 자동 생성 → 다음 글 추천
```

각 실행은 `.pipeline/runs/`에 run artifact로 기록됩니다. 글이 쌓일수록 MCP를 통해 기존 글을 참조하고, 중복을 방지하고, 더 나은 다음 글을 추천하는 자기강화 플라이휠.

### See it work

```
You: /write-post "MCP로 블로그 구독하는 법" --category tutorial

Claude: Run 초기화: .pipeline/runs/2026-03-31-mcp-subscription/
        MCP로 기존 글 검색 중... 1건 발견 (ai-native-blog)
        외부 리서치 완료. research.md 저장.

        📋 Brief 생성 완료. 각도 3개:
        1. "에이전트 구독 실전 가이드" (novelty: 85/100)
        2. "RSS vs MCP 비교" (novelty: 60/100)  
        3. "MCP 서버 만드는 법" (novelty: 40/100 — 기존 글과 중복 높음)

        어떤 각도로 가시겠어요? 제목 옵션:
        A. "AI 에이전트가 내 블로그를 구독하게 만드는 법"
        B. "MCP 구독 실전: 5분 만에 에이전트 독자 만들기"

You: 1번 각도, B 제목으로

Claude: 초안 작성 중... draft-v1.md 저장.
        AI Slop 검수: 2건 수정 (번역체 표현, 반복 구조)
        Novelty: 85/100 | Reproducibility: 90/100 | Verdict: pass ✅
        
        [최종 초안 표시]
        발행할까요?

You: 발행해줘

Claude: ✅ 발행 완료: src/content/blog/mcp-subscription-guide.md
        ✅ 빌드로그 생성: .pipeline/runs/2026-03-31-mcp-subscription/build-log.md
        ✅ 콘텐츠 인덱스 리빌드 완료
        
        📌 다음 글 추천:
        1. "MCP 서버 디버깅 가이드" (tutorial)
        2. "AI-native 뉴스레터 설계" (essay)
        3. "블로그 에이전트 분석 대시보드" (essay)
```

## Install — 30초

Claude Code에 아래 프롬프트를 붙여넣으세요:

> **이 프로젝트를 클론하고 셋업해줘:** `git clone https://github.com/mirlim/mirlim.blog.git && cd mirlim.blog && bun install` 실행한 다음, CLAUDE.md를 읽고 `/write-post` skill이 사용 가능한지 확인해줘. 그리고 `bun run dev`로 로컬 서버 띄워줘.

이미 클론한 상태라면:

> `bun install` 실행하고 CLAUDE.md 읽어줘. `/write-post` 파이프라인 사용할 준비 됐는지 확인해줘.

## Skills

| 명령 | 역할 | 설명 |
|------|------|------|
| `/write-post "토픽"` | Content Compiler | 리서치→brief→초안→검수→발행 원스톱 파이프라인 |
| `bun run editorial` | Editorial Engine | AI 편집실 — 토픽 추천, 비동기 초안 생성, 리뷰 큐 |
| `bun run review` | Review CLI | 리뷰 큐 관리 — 승인/거절/수정 지시 |
| `bun run new "제목"` | Scaffolder | 빈 포스트 스캐폴딩 (수동 작성 시) |

### /write-post 옵션

```bash
/write-post "토픽"                                    # 기본 (essay)
/write-post "토픽" --category tutorial                 # 카테고리 지정
/write-post "토픽" --series "시리즈명" --order 1       # 시리즈 연결
/write-post --continue-from ai-native-blog             # 기존 글 후속
/write-post --resume 2026-03-31-mcp-subscription       # 중단된 run 재개
```

### Editorial Engine (AI 편집실)

concepts graph 기반으로 토픽을 자동 추천하고, Post Compiler를 비동기로 호출해서 초안을 생성합니다.
사람은 나중에 리뷰 큐를 확인하고 승인/거절/수정 지시만 하면 됩니다.

```bash
# 1. 토픽 추천 받기
bun run editorial brief

# 2. 선택한 토픽으로 초안 생성 (claude -p로 비동기 실행)
bun run editorial draft 1

# 3. 리뷰 대기 항목 확인
bun run review

# 4. 승인/거절/수정
bun run review approve <run-id>
bun run review reject <run-id> "사유"
bun run review revise <run-id> "도입부 톤 수정"

# 유틸리티
bun run editorial status              # 전체 큐 상태
bun run editorial retry <run-id>      # 실패 항목 재시도
```

**상태 흐름:**
```
brief → research → draft → review → published
                              ↓ ↗
                           (revise)
                              ↓
                           archived
```

Editorial Engine은 Post Compiler(`/write-post`)를 감싸는 얇은 레이어입니다.
기존 `.pipeline/runs/`를 그대로 사용하며, `RunManifest`에 `history[]`와 `source` 필드가 추가됩니다.

## Architecture

```
src/
├── content/blog/        ← 마크다운 글 (Astro Content Collections)
├── mcp/                 ← MCP 서버 (에이전트용 API)
├── pages/               ← 라우트
├── components/          ← Astro 컴포넌트
└── layouts/             ← 레이아웃

scripts/
├── editorial-engine.ts  ← Editorial Engine CLI (토픽 추천/초안/상태)
├── review-cli.ts        ← 리뷰 큐 CLI (승인/거절/수정)
├── new-post.ts          ← 포스트 스캐폴딩 CLI
├── generate-og.ts       ← OG 이미지 자동 생성 (satori + sharp)
├── build-content-index.ts ← MCP용 콘텐츠 인덱스 빌드
├── build-concepts-graph.ts ← Concepts 지식 그래프 빌드
└── write-post/          ← Post Compiler 파이프라인
    ├── types.ts         ← RunManifest, Brief, Review, StateTransition 스키마
    ├── run.ts           ← Run artifact 관리 + 상태 전환 + 히스토리
    └── compile-build-log.ts ← Run artifact → build-log 변환

.claude/commands/
└── write-post.md        ← /write-post skill 정의

.pipeline/runs/          ← Run artifacts (gitignored)
└── <date>-<slug>/
    ├── run.json         ← 실행 상태 매니페스트
    ├── brief.json       ← 각도, 독자, 제목 옵션
    ├── research.md      ← 리서치 기록
    ├── draft-v1.md      ← 초안 이터레이션
    ├── review.json      ← AI slop 검수 결과
    └── recommendations.json ← 다음 글 추천
```

## MCP Server

AI 에이전트가 이 블로그의 콘텐츠를 구독/검색/질문할 수 있습니다.

```bash
# 로컬 테스트 (stdio)
bun run mcp

# 프로덕션 엔드포인트
# https://mirlim.blog/mcp (Streamable HTTP)
```

**도구 (7개)**: `list_posts`, `get_post`, `search_posts`, `ask_blog`, `explore_concepts`, `recommend_topic`, `suggest_topic`

## Commands

| 명령 | 설명 |
|------|------|
| `bun install` | 의존성 설치 |
| `bun run dev` | 로컬 개발 서버 (localhost:4321) |
| `bun run build` | 프로덕션 빌드 |
| `bun run deploy` | 빌드 + Cloudflare Workers 배포 |
| `bun run preview` | 빌드 프리뷰 |
| `bun run new "제목"` | 새 포스트 스캐폴딩 |
| `bun run editorial <cmd>` | Editorial Engine (brief/draft/retry/status) |
| `bun run review <cmd>` | 리뷰 큐 (approve/reject/revise) |
| `bun run mcp` | MCP 서버 로컬 실행 |
| `bun run test` | vitest 테스트 실행 |

## Content Categories

| 카테고리 | 설명 |
|----------|------|
| `essay` | 생각, 오피니언, 에세이 |
| `tutorial` | 기술 튜토리얼, 가이드 |
| `research` | AX 리서치, 업계 분석 |
| `note` | 짧은 메모, TIL, 스니펫 |

> **Pipeline build-log**: `/write-post` 실행 시 `.pipeline/runs/`에 작성 과정이 자동 기록됩니다. 이것은 콘텐츠 카테고리가 아니라 파이프라인 아티팩트입니다.

## Stack

- [Astro](https://astro.build) — Static + Server Hybrid
- [MCP SDK](https://modelcontextprotocol.io) — AI 에이전트 인터페이스
- [Cloudflare Pages + Workers](https://pages.cloudflare.com) — 호스팅
- [Claude Code](https://claude.ai/claude-code) — Post Compiler 런타임

## License

MIT
