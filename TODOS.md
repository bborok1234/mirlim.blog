# TODOS

## 인라인 이미지/밈 전략
- **What:** 글 중간중간에 밈, 짤, 일러스트 등 시각 요소를 삽입하는 시스템. 자동 생성 vs 수동 선택 결정 필요.
- **Why:** 텍스트만 있는 기술 블로그는 딱딱함. 자조적 유머 톤에 맞는 밈/짤이 글 사이에 있으면 읽는 리듬이 좋아짐.
- **Depends on:** Phase 1A 완료 (완료됨)
- **Context:** 이미지 소스 리서치 필요 (AI 생성, 오픈 밈 DB, 커스텀 일러스트). `/write-post` skill의 이미지 전략 섹션에 반영. hero 이미지와 별개 트랙.

## Pretext 기반 디자인 보강
- **What:** chenglou/pretext 라이브러리를 활용한 블로그 레이아웃/디자인 개선
- **Why:** 현재 디자인은 기본적. Pretext의 타이포그래피와 레이아웃 시스템으로 더 세련된 읽기 경험 제공.
- **Depends on:** DESIGN.md 업데이트 필요
- **Context:** https://github.com/chenglou/pretext — Astro와의 통합 방법 리서치 필요. 콘텐츠 파이프라인과는 별개 트랙.

## 콘텐츠 관리 전략 (CMS / 저장소)
- **What:** 마크다운 파일을 git 리포에만 쌓는 현재 구조의 한계 해결. 헤드리스 CMS, DB 기반 저장소, 또는 하이브리드 접근 검토.
- **Why:** 글이 쌓이면 git 기반 관리의 한계가 드러남 — 검색, 필터링, 미디어 관리, 비개발자 편집, 버전별 비교 등. 이미지/미디어가 늘어나면 리포 크기도 문제.
- **Depends on:** 글 5-10개 축적 후 실제 pain point 확인
- **Context:** 후보: Cloudflare D1/KV, Notion API, Sanity, Keystatic(git-based CMS), Tina CMS. Astro Content Collections와의 호환성 필수. MCP 서버가 콘텐츠를 읽는 구조도 고려.

## ~~Phase 1B: Concepts 그래프 + 추천 엔진~~ ✅ 완료 (2026-03-31)
- `scripts/build-concepts-graph.ts` — 15개 concepts adjacency list 그래프 (prebuild 체인)
- `src/mcp/recommend.ts` — scoreNovelty, recommendTopics(bridge/deepen/frontier), findRelatedPosts
- MCP 도구 2개: `explore_concepts`, `recommend_topic`
- vitest 세팅 + 테스트 21개 통과

## Phase 2: MCP Reasoning Trail
- **What:** `get_post_process(slug)` MCP 도구 추가. .pipeline/runs/ 데이터를 외부 에이전트에 노출
- **Why:** "이 글이 어떻게 만들어졌는지" 에이전트가 쿼리 가능 — 살아있는 도제 시스템
- **Depends on:** Phase 1A 완료 + 최소 3개 이상의 run artifact 축적
- **Context:** 공개 데이터만 반환 (research.md, brief.json, review.json). 민감 정보 필터링 필요.

## Phase 2: OG 이미지 자동 생성
- **What:** 파이프라인 Step 4에 OG 이미지 자동 생성 단계 추가
- **Why:** 소셜 미디어 공유 시 비주얼 필요
- **Depends on:** Phase 1A 완료
- **Context:** Cloudflare Workers Image Resizing 또는 satori 등 검토 필요.

## ~~vitest 테스트 프레임워크 세팅~~ ✅ 완료 (2026-03-31)
- Phase 1B와 함께 완료. `vitest.config.ts` + `bun run test` (21 tests).

## suggest_topic 데이터 영속화
- **What:** MCP 서버의 suggest_topic이 현재 인메모리. JSON 파일로 영속화 + recommend.ts에서 참조
- **Why:** 서버 재시작 시 데이터 유실 방지 + 독자 피드백이 추천에 반영되는 플라이휠
- **Depends on:** Phase 1B recommend.ts 구현 후
- **Context:** Cloudflare KV가 프로덕션 저장소. 로컬은 JSON 파일로 충분.

## MCP 서버 원격 배포 + Install 간소화
- **What:** MCP 서버를 Cloudflare Workers에 배포하여 원격 Streamable HTTP transport로 전환. README Install을 `mcpServers` URL 한 줄 설정으로 간소화.
- **Why:** 현재는 git clone + bun install + 로컬 stdio가 필요. 배포 후엔 URL만 추가하면 바로 사용 가능.
- **Depends on:** MCP 서버 안정화 (도구 7개 완성 후)
- **Context:** `/mcp` 엔드포인트는 설계에 이미 포함. Cloudflare Workers + Pages 통합 배포. "Add to Claude" 원클릭 버튼도 고려.

## 구독 방식 현대화
- **What:** 에이전트/사람 모두를 위한 쉬운 구독 경험. 원클릭 MCP 구독, 이메일 뉴스레터, RSS 개선.
- **Why:** 현재 에이전트 구독은 MCP URL 수동 설정이 필요해서 진입 장벽이 높음. 사람용 구독 채널도 부족.
- **Depends on:** MCP 원격 배포 완료
- **Context:** 에이전트: "Add to Claude" 버튼 (MCP 서버 URL 자동 등록). 사람: 이메일 뉴스레터 (Resend/Buttondown 등). RSS는 이미 `/rss.xml`로 제공 중.

## Editorial Autopilot: 자동 편집팀
- **What:** Post Compiler Pipeline을 매일 자동 실행하는 편집팀 시스템. 스케줄러 → 토픽 자동 선정 → 무인 리서치/초안 → 알림 → 사람 리뷰/출판.
- **Why:** "사람이 시키는 도구"에서 "에이전트가 준비하고 사람은 결정만"으로 전환. 매일 글 하나씩 자동으로 준비되는 콘텐츠 플라이휠.
- **Depends on:** Phase 1B 완료 (완료됨)
- **Context:** 단계별 구현 필요:
  1. **무인 실행** — `/write-post` 파이프라인에서 사람 승인 없이 끝까지 돌 수 있게 개조
  2. **자동 토픽 선정** — `recommendTopics()` → 최고 novelty 토픽 자동 선택
  3. **스케줄러** — cron 또는 Claude Code scheduled triggers로 매일 특정 시간 트리거
  4. **알림** — "초안 준비됨" 알림 (Telegram/Slack/이메일)
  5. **리뷰 워크플로우** — 초안 확인 + 수정 요청 + 출판 결정 인터페이스
