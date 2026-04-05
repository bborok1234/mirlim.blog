---
title: '이 블로그는 AI 에이전트가 읽을 수 있습니다'
description: 'mirlim.blog는 사람과 AI 에이전트 모두를 위해 설계된 블로그입니다. MCP 서버를 통해 에이전트가 콘텐츠를 구독하고 질문할 수 있습니다.'
summary: 'AI-native 블로그의 설계 철학과 MCP 서버를 통한 에이전트 구독 방법을 소개합니다.'
pubDate: '2026-03-30T23:38:00+09:00'
tags: ['AI', 'AX', 'MCP', 'blog']
category: 'build-log'
series: 'mirlim.blog 만들기'
seriesOrder: 1
toolsUsed: ['Claude Code', 'gstack', 'MCP SDK']
heroImage: '../../assets/heroes/ai-native-blog.jpg'
draft: true
concepts:
  - name: 'Agent Experience'
    related: ['UX', 'MCP', 'AI-native']
  - name: 'MCP Server'
    related: ['Model Context Protocol', 'AI agent', 'subscription']
  - name: 'Content Distribution'
    related: ['RSS', 'newsletter', 'agent subscription']
---

## 왜 AI-native 블로그인가

모든 블로그가 "AI가 글을 써준다"에 집중하고 있습니다. 하지만 반대 방향은 어떨까요? **AI가 글을 읽고 구독하는** 블로그.

mirlim.blog는 두 종류의 독자를 위해 설계되었습니다:

1. **사람**: 브라우저에서 글을 읽고, 생각을 나누고, 영감을 얻는 독자
2. **AI 에이전트**: MCP(Model Context Protocol) 서버를 통해 콘텐츠를 구독하고, 검색하고, 질문하는 에이전트

## Agent Experience (AX) 시대

UX(User Experience) 이후, AX(Agent Experience)가 새로운 디자인 분야로 떠오르고 있습니다. 에이전트는 사람과 다른 방식으로 콘텐츠를 소비합니다. 시각적 계층이나 애니메이션이 아니라, 구조화된 데이터, 명확한 메타데이터, 예측 가능한 인터페이스가 필요합니다.

이 블로그의 모든 글은:
- **구조화된 frontmatter**: 제목, 요약, 태그, 개념(concepts) 정보
- **MCP 도구**: `list_posts`, `get_post`, `search_posts`, `ask_blog`, `suggest_topic`
- **JSON 응답**: 에이전트가 파싱하기 쉬운 구조화된 데이터

## MCP로 구독하는 법

이 블로그의 MCP 서버를 당신의 에이전트 하네스에 추가하면, AI 에이전트가 직접 블로그 콘텐츠에 접근할 수 있습니다.

### Claude Desktop / Cursor

설정 파일에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "mirlim-blog": {
      "url": "https://mirlim.blog/mcp"
    }
  }
}
```

### 사용 가능한 도구

- **list_posts**: 전체 글 목록 조회
- **get_post**: 특정 글 상세 조회 (구조화된 JSON)
- **search_posts**: 키워드/태그 기반 검색
- **ask_blog**: 블로그 콘텐츠에 대한 자연어 질문
- **suggest_topic**: 에이전트가 작성자에게 토픽 제안

## 앞으로

이 블로그는 계속 진화합니다. 지식 그래프, 인터랙티브 데모, 포맷 변환 등 AI 에이전트와의 상호작용을 더 깊게 만들어갈 예정입니다.

궁금한 점이 있다면 MCP 서버의 `ask_blog` 도구로 질문해보세요.
