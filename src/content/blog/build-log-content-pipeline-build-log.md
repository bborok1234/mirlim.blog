---
title: '[Build Log] 글 한 편 쓰려고 파이프라인을 만들었다 — 작성 과정'
description: '글 한 편 쓰려고 파이프라인을 만들었다 글의 리서치, 초안, 검수 과정을 기록한 빌드로그.'
summary: 'Post Compiler 파이프라인으로 작성된 빌드로그. 리서치부터 발행까지의 전 과정.'
pubDate: '2026-03-31'
category: 'build-log'
series: 'mirlim.blog 만들기'
tags: ['build-log', 'Content Pipeline', 'Claude Code']
toolsUsed: ['Claude Code', 'Post Compiler']
draft: true
concepts:
  - name: 'Content Pipeline'
    related: ['Claude Code', 'automation', 'Post Compiler']
---

## 리서치

# 리서치: AI 콘텐츠 파이프라인 현황 (2025-2026)

## 기존 글 컨텍스트
- ai-native-blog: AI-native 블로그 설계 철학, MCP 서버, AX 개념 소개
- 이번 글은 그 위에 '콘텐츠 생산 시스템'을 얹는 후속편

## 핵심 발견

### 1. 유사 프로젝트 — HowDoIUseAI.com
Claude API + GitHub Actions로 자동 블로그 파이프라인 구축. 하루 만에 완성.
YouTube 트랜스크립트 → Claude API → MDX → Vercel 배포. 월 $10-20.
품질 관리는 중복 체크만. Post Compiler의 brief→review 단계가 차별점.

### 2. Book Factory Skill (awesome-claude-code)
Robert Guss의 Book Factory — Claude Code skill 기반 논픽션 출판 파이프라인.
가장 가까운 오픈소스 선례. 멀티 skill 구조.

### 3. Claude Code Skill 생태계는 아직 초기
2025년 말 도입. 콘텐츠 생성 skill은 아직 희소. 비어있는 영역.

### 4. 4단계 플라이휠이 표준 패턴 (Cosmic, 2026-03)
Capture → Create → Distribute → Learn.
우리 파이프라인: research+brief = Capture/Create, .pipeline/runs/ = Learn.
차별점: MCP reasoning trail 공개.

### 5. 자기강화 시스템 사례 — TheyDo
AI 생성 → 사용자 피드백 → 자동 AI 평가 → 프롬프트 개선 사이클.
우리의 Phase 1B concepts graph + Phase 2 reasoning trail과 동일 구조.

### 6. 핵심 통계: 사람 리뷰가 결정적 변수

_(전체 리서치는 run artifact 참조)_

## 각도 선택

파이프라인이 제시한 각도 옵션:

- **build-story**: 삽질 일지 — Post Compiler를 만든 과정 자체를 이야기로 풀기. 왜 만들었는지, 뭘 시도했는지, 뭐가 안 됐는지, 최종 구조는 어떻게 됐는지. 독자가 자기 파이프라인을 만들 때 참고할 수 있는 실전 기록. (novelty: 85/100) ✅
- **architecture-deep-dive**: Post Compiler 아키텍처 해부 — run artifact, skill 구조, AI slop 검수 시스템을 기술적으로 깊이 파고드는 글. 코드 레벨 설명 포함. (novelty: 75/100)
- **ai-content-manifesto**: AI 콘텐츠의 신뢰 문제와 reasoning trail로 해결하는 방법론 에세이. 통계 데이터(52% AI 콘텐츠, -23% 순위) 기반. Post Compiler는 사례로만 등장. (novelty: 65/100)

선택된 제목: **글 한 편 쓰려고 파이프라인을 만들었다**

## AI Slop 검수

- Novelty Score: 82/100
- Reproducibility Score: 70/100
- Verdict: **pass**

수정된 패턴:

- **균등한 섹션 길이** (전체 구조): `대부분의 섹션이 150-200단어로 비슷한 길이` → `도입부와 마무리를 짧게(50-80단어), 중간 기술 섹션을 길게(250-300단어) 조정`
- **쉼표 과다 의심** (여러 곳): `Astro, MCP 서버, 디자인 시스템, RSS 피드, 한국어 날짜 포맷까지` → `나열이 많은 문장을 줄이거나 다른 구조로 — 현재 수준은 나열 문맥상 허용 가능`
- **반복 문장 구조** ('실제로 만든 것들' 하위 섹션들): `3개 하위 섹션이 모두 '설명 → 이유/배경 → 구현 → 교훈' 동일 패턴` → `Run Artifact는 파일 테이블로 시작, Skill은 질문으로 시작, AI Slop은 통계로 시작 — 이미 약간 다르지만 더 변화 필요`

리뷰어 코멘트:

> 금지 표현 미발견: '결론적으로', '~함으로써', '~을 활용하여', '~하는 것이 중요합니다' 등 번역체 없음
> 도입부 패턴 적절: '블로그는 완성했는데, 글이 없다' — 독자가 겪고 있는 상태로 시작
> 마무리 패턴 적절: '아직 확신은 없다. 5개 더 써봐야 안다.' — 솔직한 불완전함 인정
> 자조적 유머 톤 일관성 유지: '사이드 프로젝트에서 알아서는 안 한다의 다른 말이다', '30분짜리 설치가 5분짜리 직접 만들기로 바뀐 순간'
> Mermaid 다이어그램 2개 — 적절한 시각 요소 배치
> 구체적 숫자 포함: 4,200개 글, 16개월, 23% vs 4%, 61% vs 26%, 10줄
> 섹션 길이 변화 약간 부족하지만 verdict에 영향 줄 정도는 아님

## 다음 글 추천

1. **MCP 서버 5분 만에 만들기: 실전 가이드** (tutorial)
   ai-native-blog에서 MCP를 소개하고, 이 글에서 파이프라인을 다뤘다. 다음은 독자가 직접 MCP 서버를 만들어보는 핸즈온 튜토리얼이 자연스럽다. concepts 그래프에서 MCP Server 노드의 연결을 강화.
1. **AI가 쓴 한국어, 사람이 쓴 한국어 — 차이를 만드는 13가지 패턴** (research)
   이 글에서 AI slop 검수를 소개했지만 패턴 리스트만 간략히 다뤘다. 각 패턴을 실제 예시와 함께 깊이 파는 리서치 글이 되면 독립적 가치가 높다.
1. **Claude Code skill 설계 패턴 — 코드 vs 자연어의 경계** (essay)
   이 글에서 '결정적 동작은 코드로, 유연한 판단은 에이전트에게'를 소개했다. 이 설계 원칙을 다른 skill 사례와 함께 일반화하면 에세이로 확장 가능.

---

_이 빌드로그는 Post Compiler 파이프라인 `2026-03-31-claude-code` 실행에서 자동 생성되었습니다._
