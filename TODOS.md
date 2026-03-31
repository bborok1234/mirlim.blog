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
