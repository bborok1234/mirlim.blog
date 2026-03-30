# Design System — mirlim.blog

## Product Context
- **What this is:** AI/AX 시대의 생각, 전문지식, 결과물을 공유하는 개인 블로그
- **Who it's for:** AI/AX 업계 전문가, 개발자, 디자이너
- **Space/industry:** AI Agent Experience (AX), technical blogging
- **Project type:** Editorial blog with MCP agent interface

## Aesthetic Direction
- **Direction:** Editorial/Magazine + Industrial hybrid
- **Decoration level:** Intentional — 모노스페이스 디테일로 "기계가 읽을 수 있음"을 암시
- **Mood:** 기술적이지만 사려 깊은. 에디토리얼의 권위감 + 산업적 구조의 정밀함. 사람의 생각과 기계의 구조가 공존하는 느낌.
- **Reference sites:** biilmann.blog (editorial serif approach), agentexperience.ax (AX space)

## Typography
- **Display/Hero:** Instrument Serif — 에디토리얼 무드, AI/tech 블로그에서 세리프는 드물어서 차별화됨
- **Body:** Instrument Sans — 같은 패밀리로 자연스러운 조화, 가독성 좋음
- **UI/Labels:** Instrument Sans (weight 500-600)
- **Data/Tables:** Instrument Sans (tabular-nums)
- **Code/MCP:** JetBrains Mono — 코드와 에이전트 인터페이스에 사용. "기계가 읽는 부분"을 시각적으로 구분
- **Loading:** Google Fonts CDN
- **Scale:**
  - Display: 3.5rem (56px)
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.75rem (28px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - Caption: 0.75rem (12px)
  - Mono/Badge: 0.7rem (11.2px)

## Color
- **Approach:** Restrained — 액센트는 MCP/에이전트 요소에만 집중
- **Background:** #0A0A0B — 거의 검은색
- **Surface:** #141416 — 카드, 코드블록 배경
- **Surface Hover:** #1C1C1F
- **Border:** #1E1E22
- **Text:** #E8E8ED — 밝은 회색
- **Text Muted:** #6B6B76
- **Accent (MCP/Agent):** #3B82F6 — 차가운 블루. MCP 배지, 에이전트 관련 링크, Subscribe에 사용
- **Accent Hover:** #2563EB
- **Success:** #10B981 — 에메랄드. 코드 하이라이트, 활성 상태
- **Warning:** #F59E0B
- **Error:** #EF4444
- **Info:** #3B82F6 (accent와 동일)
- **Dark mode:** 기본값. 라이트 모드는 이후 추가 가능

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — 글 중심 블로그라 여유로운 간격
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)
- **Body line-height:** 1.7
- **Heading line-height:** 1.1-1.25

## Layout
- **Approach:** Grid-disciplined, single column
- **Max content width:** 720px
- **Grid:** Single column, centered
- **Border radius:** sm: 4px, md: 8px, lg: 12px
- **No sidebar.** 네비게이션은 최소화

## Motion
- **Approach:** Minimal-functional
- **Easing:** ease-out for enter, ease-in for exit
- **Duration:** micro(50ms) short(150ms) medium(250ms)
- **Hover transitions:** color 0.15s
- **No page transitions, no scroll animations.** AI/AX 블로그에서 과한 애니메이션은 신뢰를 깎음

## Agent-Specific Design Rules
- **MCP Badge:** JetBrains Mono, 0.7rem, #3B82F6 background, white text, border-radius 4px
- **Agent tags:** border-color rgba(59,130,246,0.3), blue text, subtle blue background
- **Code blocks:** #141416 background, #1E1E22 border, JetBrains Mono
- **Rule:** 블루 액센트가 보이면 "에이전트가 관여하는 영역"이라는 컨벤션

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Initial design system | Created by /design-consultation. Editorial serif + industrial mono hybrid for AI/AX blog identity |
| 2026-03-31 | Dark mode first | AI/AX 업계 사람들이 기대하는 기본값 |
| 2026-03-31 | Accent only for MCP/agent | "이 색이 보이면 에이전트 영역"이라는 시각적 컨벤션 |
| 2026-03-31 | Instrument Serif for display | tech 블로그에서 세리프는 드물어서 차별화. biilmann.blog 참고 |
