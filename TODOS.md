# TODOS

## Phase 1B: Concepts 그래프 + 추천 엔진
- **What:** `build-concepts-graph.ts`로 concepts 그래프 빌드 + `recommend.ts`로 novelty scoring + next-topic 추천
- **Why:** 글이 쌓일수록 추천이 똑똑해지는 플라이휠의 핵심 엔진
- **Depends on:** 글 5개 이상 축적 후 의미 있는 그래프 형성
- **Context:** 디자인 문서 Phase 1B 참조. frontmatter의 concepts 필드가 씨앗. 그래프는 빌드 시 자동 생성.

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

## vitest 테스트 프레임워크 세팅
- **What:** vitest 설정 + Phase 1B TypeScript 로직 (concepts graph, recommend) 테스트
- **Why:** TS 로직이 들어가면 자동 테스트 필수
- **Depends on:** Phase 1B 시작 시
- **Context:** Phase 1A는 SKILL.md 전용이라 수동 E2E로 검증. Phase 1B에서 TS 모듈이 생기면 vitest 도입.

## suggest_topic 데이터 영속화
- **What:** MCP 서버의 suggest_topic이 현재 인메모리. JSON 파일로 영속화 + recommend.ts에서 참조
- **Why:** 서버 재시작 시 데이터 유실 방지 + 독자 피드백이 추천에 반영되는 플라이휠
- **Depends on:** Phase 1B recommend.ts 구현 후
- **Context:** Cloudflare KV가 프로덕션 저장소. 로컬은 JSON 파일로 충분.
