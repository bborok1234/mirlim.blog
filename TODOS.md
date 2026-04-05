# TODOS

## ~~Phase 1B: Concepts 그래프 + 추천 엔진~~ ✅ 완료 (2026-03-31)
- `scripts/build-concepts-graph.ts` — 15개 concepts adjacency list 그래프 (prebuild 체인)
- `src/mcp/recommend.ts` — scoreNovelty, recommendTopics(bridge/deepen/frontier), findRelatedPosts
- MCP 도구 2개: `explore_concepts`, `recommend_topic`
- vitest 세팅 + 테스트 21개 통과

## ~~vitest 테스트 프레임워크 세팅~~ ✅ 완료 (2026-03-31)
- Phase 1B와 함께 완료. `vitest.config.ts` + `bun run test` (21 tests).

## ~~Tier 0: 배포~~ ✅ 완료 (2026-04-01)
- GitHub 리포 생성 (bborok1234/mirlim.blog, public)
- Cloudflare Pages 배포 + 커스텀 도메인 mirlim.blog
- robots.txt, og:locale, og:site_name 추가
- ~~build-log 파일 정리 (블로그에서 제거, .pipeline/runs/에 artifact로 보존)~~ ✅
- mermaid 다크 테마 + 렌더링 규칙 정립

---

## Tier 1: 콘텐츠 축적 + 배포 채널 (진행 중)
- **What:** 외부 토픽 에세이 5개 이상 작성 + 커뮤니티 배포
- **Why:** 글이 자산. 인프라보다 콘텐츠가 먼저. 신규 도메인은 구글 샌드박스 3-6개월.
- **Status:** 1/5 완료 (mcp-on-personal-blog)
- **남은 작업:**
  - 에세이 4개 추가 작성 (`/write-post`)
  - Google Search Console 등록 (사람 작업)
  - Naver Search Advisor 등록 (사람 작업)
  - 커뮤니티 공유: GeekNews, disquiet.io, Twitter/X (사람 작업)
- **성공 지표:**
  - Week 2: 글 5개+, GeekNews 1회+ 프론트페이지
  - Month 1: 월 1,000 PV
  - Month 3: 월 5,000 PV, 키워드 10개+ 노출

## Tier 2: SEO 인프라 + 내부 링크
- **What:** 글이 5개+ 쌓인 후 SEO 인프라 효과 극대화
- **Depends on:** Tier 1 (글 5개 이상)
- **항목:**
  - JSON-LD 구조화 데이터 (BlogPosting, WebSite, Person)
  - OG 이미지 자동 생성 (satori + sharp, 빌드 타임)
  - 관련 글 추천 UI (concepts graph 활용, 포스트 하단)
  - 카테고리/태그 랜딩 페이지
  - llms.txt — AEO 최적화

## Tier 3: 성장 인프라 (전환 트리거: 월 3,000 PV)
- **What:** 트래픽 기반이 생긴 후 성장 가속
- **항목:**
  - 뉴스레터 구독 (Resend/Buttondown + 이메일 구독 폼)
  - MCP 서버 원격 배포 + "Add to Claude" 버튼
  - Editorial Autopilot (자동 토픽 선정 + 무인 초안 + 알림)
  - 소셜 공유 최적화

---

## 기술 부채 / 개선

### suggest_topic 데이터 영속화
- **What:** MCP 서버의 suggest_topic이 현재 인메모리. Cloudflare KV로 영속화.
- **Why:** Stateless HTTP 엔드포인트에서 요청 끝나면 데이터 유실.
- **Depends on:** MCP 서버 원격 배포 + 실제 트래픽 발생 후

### MCP HTTP 엔드포인트 도구 동기화
- **What:** stdio 서버 7개 도구 vs HTTP 5개 도구 불일치 해소
- **Why:** 같은 이름의 MCP 서버인데 transport에 따라 기능이 다르면 혼란
- **Context:** explore_concepts, recommend_topic이 HTTP에 빠져있음. recommend.ts import 시 번들 크기 이슈.

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

### 인라인 이미지/밈 전략
- **What:** 글 중간에 밈, 짤, 일러스트 삽입 시스템
- **Depends on:** 글 10개+ 축적 후 읽기 경험 개선 필요성 확인

### ~~Pretext 기반 디자인 보강~~ 보류
- **What:** chenglou/pretext 라이브러리 활용 타이포그래피 개선 (Knuth-Plass 양끝맞춤 등)
- **Status:** 조사 완료 (2026-04-02). @chenglou/pretext v0.0.4는 한글(0xAC00-0xD7AF)을 CJK로 분류해 글자 단위 줄바꿈 적용. 한국어에 필요한 word-break: keep-all 미지원. 라이브러리가 한국어 어절 단위 줄바꿈을 지원할 때까지 보류.

### 콘텐츠 관리 전략 (CMS / 저장소)
- **What:** git 기반 관리의 한계 해결. 헤드리스 CMS 검토.
- **Depends on:** 글 20개+ 축적 후 실제 pain point 확인

### 구독 방식 현대화
- **What:** 원클릭 MCP 구독, 이메일 뉴스레터, RSS 개선
- **Depends on:** MCP 원격 배포 + 월 3,000 PV 달성
