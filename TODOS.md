# TODOS

## ~~Phase 1B: Concepts 그래프 + 추천 엔진~~ ✅ 완료 (2026-03-31)
- `scripts/build-concepts-graph.ts` — 29개 concepts adjacency list 그래프 (prebuild 체인)
- `src/mcp/recommend.ts` — scoreNovelty, recommendTopics(bridge/deepen/frontier), findRelatedPosts
- MCP 도구 2개: `explore_concepts`, `recommend_topic`
- vitest 세팅 + 테스트 21개 통과

## ~~vitest 테스트 프레임워크 세팅~~ ✅ 완료 (2026-03-31)
- Phase 1B와 함께 완료. `vitest.config.ts` + `bun run test` (21 tests).

## ~~Tier 0: 배포~~ ✅ 완료 (2026-04-01)
- GitHub 리포 생성 (bborok1234/mirlim.blog, public)
- Cloudflare Workers 배포 + 커스텀 도메인 mirlim.blog
- robots.txt, og:locale, og:site_name 추가
- build-log 카테고리 제거, .pipeline/runs/에 artifact로 보존
- mermaid 다크 테마 + 렌더링 규칙 정립

## ~~Tier 2: SEO 인프라~~ ✅ 대부분 완료 (2026-04-05)
- ~~JSON-LD 구조화 데이터 (BlogPosting, WebSite, Person)~~ ✅
- ~~OG 이미지 자동 생성 (satori + sharp, prebuild 체인)~~ ✅ 10개 포스트 + default
- ~~카테고리/태그 랜딩 페이지~~ ✅
- ~~llms.txt~~ ✅ AEO 최적화
- 관련 글 추천 UI (concepts graph 데이터 있음, 포스트 하단 UI 미구현) → Tier 1로 이동

## ~~디자인/UX 개선~~ ✅ 완료 (2026-04-05)
- 피처 카드 flat 전환 + stretched-link 패턴
- 태그 링크화, 모바일 네비 터치타겟 44px
- 글로벌 모바일 여백 20px, About 페이지 리디자인
- 밈 이미지 모바일 overflow 수정

## ~~MCP HTTP 도구 동기화~~ ✅ 완료 (2026-04-05)
- stdio/HTTP 모두 동일한 7개 도구: list_posts, get_post, search_posts, ask_blog, explore_concepts, recommend_topic, suggest_topic

## ~~인라인 이미지/밈~~ ✅ 완료 (2026-04-04)
- imgflip API 기반 밈 생성 도구 추가
- 3개 글에 Drake 밈 삽입, max-width min(480px, 100%) 모바일 대응

---

## Tier 1: 콘텐츠 축적 + 배포 채널 (진행 중)
- **What:** 커뮤니티 배포
- **Why:** 글이 자산. 신규 도메인은 구글 샌드박스 3-6개월.
- **Status:** 글 10개 완료, 관련 글 추천 UI 완료 (6/10 포스트에 표시), Google Search Console 연동 완료
- **남은 작업:**
  - Naver Search Advisor 등록 (사람 작업)
  - 소셜 배포 자동화: LinkedIn, Threads 중심. 글 발행 시 자동으로 소셜 포스트 생성/배포하는 파이프라인 기획
- **성공 지표:**
  - GeekNews 1회+ 프론트페이지
  - Month 1: 월 1,000 PV
  - Month 3: 월 5,000 PV, 키워드 10개+ 노출

## ~~Editorial Engine Phase A~~ ✅ 완료 (2026-04-06)
- `scripts/editorial-engine.ts` — 토픽 추천(concepts graph) + `claude -p`로 Post Compiler 비동기 호출
- `scripts/review-cli.ts` — 리뷰 큐 승인/거절/수정 지시
- 기존 `run.ts` 확장: StateTransition history[], transitionRun(), retryRun()
- 8개 테스트 추가 (29 total pass)
- Design doc: `~/.gstack/projects/bborok1234-mirlim.blog/mirlim-main-design-20260405-234230.md`

## Editorial Engine Dogfooding + Phase B (다음 작업)
- **What:** Phase A를 2주간 실사용하면서 검증, 이후 Phase B(소셜 배포 자동화) 설계
- **Why:** "에이전트가 혼자 돌고 사람은 나중에 큐 확인"하는 루프가 실제로 동작하는지 검증
- **Dogfooding 목표:**
  - `bun run editorial brief` → 토픽 선정 → `bun run editorial draft` → `bun run review approve` 루프로 최소 3편 발행
  - `claude -p` 안정성 확인, --no-confirm 플래그 필요 여부 검증
  - 리뷰 큐 UX 피드백 수집
- **Phase B 범위 (dogfooding 후):**
  - 글 발행 → LinkedIn/Threads 포스트 자동 생성 + 승인 큐
  - 뉴스레터 포맷 변환
- **Depends on:** Phase A 완료 ✅

## Tier 3: 성장 인프라 (전환 트리거: 월 3,000 PV)
- **What:** 트래픽 기반이 생긴 후 성장 가속
- **항목:**
  - 뉴스레터 구독 (Resend/Buttondown + 이메일 구독 폼)
  - MCP 서버 원격 배포 + "Add to Claude" 버튼
  - ~~Editorial Autopilot~~ → Editorial Engine Phase A로 시작, Phase B(소셜), Phase C(프레임워크)로 확장
  - 소셜 공유 최적화

---

## 기술 부채 / 개선

### suggest_topic 데이터 영속화
- **What:** MCP 서버의 suggest_topic이 현재 인메모리. Cloudflare KV로 영속화.
- **Why:** Stateless HTTP 엔드포인트에서 요청 끝나면 데이터 유실.
- **Depends on:** MCP 서버 원격 배포 + 실제 트래픽 발생 후

### Phase 2: MCP Reasoning Trail
- **What:** `get_post_process(slug)` MCP 도구 추가. .pipeline/runs/ 데이터를 외부 에이전트에 노출
- **Why:** "이 글이 어떻게 만들어졌는지" 에이전트가 쿼리 가능
- **Depends on:** 최소 3개 이상의 run artifact 축적

### 빌드로그 비공개 대시보드
- **What:** .pipeline/runs/ 데이터를 비공개로 열람할 수 있는 인터페이스
- **Why:** 빌드로그는 블로그에 공개하지 않지만, 작성 과정 지식으로 보존할 가치 있음
- **Depends on:** CMS 또는 인증 시스템 도입 후

---

## 후순위 (콘텐츠 축적 후)

### ~~Pretext 기반 디자인 보강~~ 보류
- **What:** chenglou/pretext 라이브러리 활용 타이포그래피 개선 (Knuth-Plass 양끝맞춤 등)
- **Status:** 조사 완료 (2026-04-02). @chenglou/pretext v0.0.4는 한글(0xAC00-0xD7AF)을 CJK로 분류해 글자 단위 줄바꿈 적용. 한국어에 필요한 word-break: keep-all 미지원. 라이브러리가 한국어 어절 단위 줄바꿈을 지원할 때까지 보류.

### 콘텐츠 관리 전략 (CMS / 저장소)
- **What:** git 기반 관리의 한계 해결. 헤드리스 CMS 검토.
- **Depends on:** 글 20개+ 축적 후 실제 pain point 확인

### 구독 방식 현대화
- **What:** 원클릭 MCP 구독, 이메일 뉴스레터, RSS 개선
- **Depends on:** MCP 원격 배포 + 월 3,000 PV 달성
