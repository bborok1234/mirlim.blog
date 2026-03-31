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
- `build-log` — 프로젝트 빌딩 일지
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
1. `bun run new` 로 스캐폴딩
2. 글 작성 (Claude Code로 리서치/초안 작성 가능)
3. `bun run dev` 로 로컬 프리뷰
4. frontmatter에서 `draft: false` 로 변경
5. `bun run build` 로 빌드 확인
6. 커밋 + 배포

### MCP Server
- 콘텐츠 인덱스: `bun run scripts/build-content-index.ts` (빌드 시 자동 실행)
- 로컬 테스트: `bun run mcp` (stdio transport)
- 프로덕션: `/mcp` 엔드포인트 (Streamable HTTP transport)
- 5개 도구: list_posts, get_post, search_posts, ask_blog, suggest_topic

### Images
- Hero images: `src/assets/` 에 저장, frontmatter의 `heroImage`로 참조
- Inline images: 마크다운에서 상대 경로로 참조
- OG images: 추후 자동 생성 예정
