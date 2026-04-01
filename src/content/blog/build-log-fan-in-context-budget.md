---
title: '[Build Log] Fan-out은 쉽다. Fan-in이 어렵다. — 작성 과정'
description: 'Fan-out은 쉽다. Fan-in이 어렵다. 글의 리서치, 초안, 검수 과정을 기록한 빌드로그.'
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

# Research: 에이전트 런타임의 컨텍스트 예산 문제

## 핵심 발견

### 1. Fan-out은 쉽고 Fan-in이 어렵다
- Orchestrator-Worker 패턴에서 병렬 fan-out은 잘 정립됨
- 문제는 fan-in: 수백 개 subagent 결과를 메인 에이전트의 컨텍스트에 어떻게 합치는가
- "Token usage explains 80% of performance variance" — 토큰 사용량이 성능 분산의 80%를 설명 (LangChain State of Agent Engineering 2026)
- 각 subagent가 수만 토큰을 사용하지만, 메인에게는 1,000-2,000 토큰 요약만 반환하는 패턴이 일반적

### 2. 컨텍스트 예산 관리 전략
- **Observation Masking**: 도구 호출 결과를 선택적으로 마스킹/압축 (JetBrains Research 2025)
- **Hierarchical Summarization**: 피라미드 구조로 다단계 요약, 각 레벨이 더 압축된 뷰 제공
- **Semantic Compression**: 텍스트를 ~1/6로 압축, 정보 밀도 높은 세그먼트만 보존
- **Hybrid Approach**: 기본은 Observation Masking, 컨텍스트 임계점 초과 시 LLM 요약 트리거 (JetBrains 추천)
- Anthropic "Context Engineering" 글: 컨텍스트 윈도우를 희소 자원으로 다루고, 모델이 high-signal 토큰에만 집중하도록 설계

### 3. 로컬 vs 원격 도구 비용 차이
- 로컬 에이전트(Claude Code 등): 파일 읽기가 거의 무료, 즉각 응답
- 원격 에이전트: 모든 도구 호출이 네트워크 latency + API 토큰 비용
- 이 차이가 아키텍처를 근본적으로 바꿈: 로컬은 자유롭게 탐색, 원격은 사전 계획 필수
- "Be deliberate about what context each agent receives — passing the full conversation history to every agent is expensive and confusing" (Addy Osmani)

### 4. 멀티에이전트 오케스트레이션 패턴
- **계층적 위임**: feature lead 2개 → subagent 6개 대신. "3x deeper decomposition without exploding anyone's context window"
- **동기화 포인트**: 병렬 실행 후 결과 검증/집계 전 동기화 필수
- **컨텍스트 격리**: 각 에이전트에 전체 대화가 아닌 필요한 컨텍스트만 전달
- Azure, OpenAI, LangChain 모두 Orchestrator-Worker 패턴을 기본 권장

### 5. 실전 수치

_(전체 리서치는 run artifact 참조)_

## 각도 선택

파이프라인이 제시한 각도 옵션:

- **fan-in-budget**: Fan-in 컨텍스트 예산 문제에 집중. 수백 개 요소를 병렬 평가한 뒤 메인 에이전트가 결과를 소화하는 과정의 구체적 엔지니어링 문제와 해결 패턴. 직접 겪은 실전 경험 중심. (novelty: 92/100) ✅
- **local-vs-remote**: 로컬 에이전트(Claude Code)와 원격 에이전트 런타임의 도구 비용 차이가 아키텍처를 근본적으로 바꾼다는 논의. 같은 문제를 로컬과 원격에서 각각 어떻게 풀어야 하는지. (novelty: 88/100)
- **context-as-working-memory**: 컨텍스트 윈도우를 인간의 작업 기억에 비유하며, 에이전트가 '뭘 잊을지 고르는' 문제가 곧 에이전트 품질의 핵심이라는 에세이적 논의. 메모리 계층 아키텍처까지. (novelty: 78/100)

선택된 제목: **Fan-out은 쉽다. Fan-in이 어렵다.**

## AI Slop 검수

- Novelty Score: 94/100
- Reproducibility Score: 62/100
- Verdict: **pass**

수정된 패턴:

- **인접 섹션 길이 유사** (§왜 fan-out은 쉬운가 (~130단어) vs §컨텍스트 윈도우는 예산이다 (~120단어)): `두 섹션이 20% 이내 유사한 길이` → `§컨텍스트 윈도우는 예산이다 섹션에 비유를 확장하여 길이 차이를 만들 것`
- **연속 나열 구조** (§Fan-in: 결과를 합치는 세 가지 벽 — 첫 번째/두 번째/세 번째): `### 첫 번째 벽 / ### 두 번째 벽 / ### 세 번째 벽 — 나열형 패턴` → `소제목 대신 서술적 전환으로 연결하거나, 소제목을 내용 중심으로 변경 (예: '물리적 용량', '어텐션 희석', '구조적 불일치')`

리뷰어 코멘트:

> 전반적으로 톤이 잘 잡혀 있음. 번역체 표현 없음, 금지 표현 미검출, 이모지 없음.
> 도입부 장면(340개 요소)이 구체적이고 효과적. 숫자와 비용 계산이 글의 신뢰도를 높임.
> 모순 전환('근데 해보니까 달랐다') 적절히 사용됨.
> 마무리의 불완전함 인정이 진정성 있음.
> 수정 필요 2건: (1) §컨텍스트 예산 섹션 길이 보강 (2) 세 가지 벽 소제목을 내용 중심으로 변경하여 나열 느낌 줄이기
> 쉼표 비율 정상 범위 (~30%). 번역체 의심 없음.
> 영어 인용(context engineering, scarce resource)이 자연스럽게 녹아 있음.

---

_이 빌드로그는 Post Compiler 파이프라인 `2026-03-31-untitled` 실행에서 자동 생성되었습니다._
