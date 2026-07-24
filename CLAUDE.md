# mirlim.blog

AI/AX 시대의 생각, 전문지식, 결과물을 공유하는 개인 블로그.
사람과 AI 에이전트 모두를 위해 설계.

## Tech Stack
- Astro (static + server hybrid)
- MCP Server (@modelcontextprotocol/sdk)
- Cloudflare Pages + Workers
- TypeScript, bun

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Content Structure

### Categories
- `essay` — 생각, 오피니언, 에세이
- `tutorial` — 기술 튜토리얼, 가이드
- `research` — AX 리서치, 업계 분석
- `note` — 짧은 메모, TIL, 스니펫

### Creating Posts
```bash
bun run new "제목" --category tutorial --tags "MCP,AX" --series "시리즈명" --order 1 --tools "Claude Code"
```
Posts are created as drafts by default. Add `--no-draft` to publish immediately.

### Frontmatter Fields
- `title`, `description`, `summary` — 사람 + 에이전트 모두가 사용
- `tags` — 검색과 필터링. AI/AX/MCP 태그는 블루 하이라이트
- `category` — 5가지 중 하나
- `series` + `seriesOrder` — 연재물
- `concepts` — 지식 그래프용 (name + related)
- `toolsUsed` — 글 작성에 사용한 도구 기록
- `draft` — true면 빌드에서 제외

### Content Workflow

**수동 (기존):**
1. `bun run new` 로 스캐폴딩
2. 글 작성 (Claude Code로 리서치/초안 작성 가능)
3. `bun run dev` 로 로컬 프리뷰
4. frontmatter에서 `draft: false` 로 변경
5. `bun run build` 로 빌드 확인
6. 커밋 + `bun run deploy`

**Editorial Engine (비동기):**
1. `bun run editorial brief` — concepts graph 기반 토픽 추천
2. `bun run editorial draft <번호>` — 선택한 토픽으로 비동기 초안 생성
3. `bun run review` — 리뷰 큐 확인
4. `bun run review approve <run-id>` — 승인 → 발행
5. `bun run build && bun run deploy` — 빌드 + 배포

### MCP Server
- 콘텐츠 인덱스: `bun run scripts/build-content-index.ts` (빌드 시 자동 실행)
- 로컬 테스트: `bun run mcp` (stdio transport)
- 프로덕션: `/mcp` 엔드포인트 (Streamable HTTP transport)
- 7개 도구: list_posts, get_post, search_posts, ask_blog, explore_concepts, recommend_topic, suggest_topic

### Images
- Hero images: `src/assets/` 에 저장, frontmatter의 `heroImage`로 참조
- Inline images: 마크다운에서 상대 경로로 참조
- OG images: prebuild에서 satori+sharp로 자동 생성 (`scripts/generate-og.ts`)

## 글 작업 철칙 (write-post — 반드시 지킬 것)

이 규칙은 세션·환경을 넘어 유지되는 이 레포의 SSOT다. (글로벌 메모리가 아니라 여기가 진실 원천.)

- **배포 게이트: 로컬 프리뷰 → 사용자 확인 → 명시적 승인 → 배포.** 승인 없이 `draft: false` 전환·`git push`·`bun run deploy` 절대 금지. "빌드 통과"는 승인이 아니다. 사용자가 "발행해/배포해/올려"라고 말하기 전엔 배포하지 않는다.
- **소스는 원자재다.** 사용자가 준 원문(대화 export, 초고)을 그대로 옮기지 않는다. 실제 작업은 (1) 주장을 뒷받침할 근거를 웹에서 리서치, (2) 근거가 논증의 뼈대가 되도록 재구성(각주 장식·원문 복붙 금지), (3) 이해를 돕는 시각자료, (4) 전체 개선이다.
- **매번 전체 파이프라인을 선제적으로:** research(근거) → brief(각도·논지 + 승인) → draft → review(모순·slop·스토리라인·시각자료 자체 점검) → 로컬 프리뷰 → 승인 → 배포. 지시받은 부분만 즉석에서 고치면 사용자가 세부 명령을 반복하게 된다. 새 주장을 넣기 전에 근거가 있는지 스스로 확인하고, 없으면 research부터 돈다.
- **시각자료:** 정보가치 없는 개념 플로우 다이어그램은 넣지 않는다. 실데이터는 `scripts/write-post/charts.ts`(10종 SVG 생성기). 관계·순서·구조 자체가 정보일 때만 mermaid. 한국어 본문에 em-dash(—) 금지(영어 원제 각주는 예외).

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
