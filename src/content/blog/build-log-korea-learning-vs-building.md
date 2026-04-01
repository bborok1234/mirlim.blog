---
title: '[Build Log] 강의를 사는 나라, 제품을 만드는 나라 — 작성 과정'
description: '강의를 사는 나라, 제품을 만드는 나라 글의 리서치, 초안, 검수 과정을 기록한 빌드로그.'
summary: 'Post Compiler 파이프라인으로 작성된 빌드로그. 리서치부터 발행까지의 전 과정.'
pubDate: '2026-03-31'
category: 'build-log'
series: 'mirlim.blog 만들기'
tags: ['build-log', 'Content Pipeline', 'Claude Code']
toolsUsed: ['Claude Code', 'Post Compiler']
draft: false
concepts:
  - name: 'Content Pipeline'
    related: ['Claude Code', 'automation', 'Post Compiler']
---

## 리서치

# Research: 한국은 Claude Code 세계 2위인데, 배우기만 한다

## 1. 한국의 Claude Code 열풍 — 숫자

- 한국 Claude 사용량 전 세계 Top 5 (총량 + 인당 모두)
- Claude Code 주간 활성 사용자 4개월 만에 **6배 성장**
- 세계 1위 Claude Code 사용자가 **한국인 개발자**
- 인당 채택률 **3.12배** (Anthropic AI Usage Index)
- Anthropic 아태 매출 전년 대비 **10배** 성장 → 서울 오피스 개설 (2026 초)
- 대형 기업 계정($100K+ 매출) 아태에서 **8배** 성장
- Dario Amodei: "Korea is at the forefront of AI innovation in Asia"
- 출처: [Anthropic Seoul Office Announcement](https://www.anthropic.com/news/seoul-becomes-third-anthropic-office-in-asia-pacific)

## 2. 한국 바이브코딩 시장 — 강의가 지배

- '요즘 바이브코딩 클로드코드 완벽 가이드' 초판 예약 완판, **3쇄 진입**, 3주 연속 IT 1위
- 패스트캠퍼스 바이브코딩 강의, 교보문고/알라딘/리디 전자책 다수
- ZDNet: "코드 한 줄 몰라도 되네" 문과 기자 도전기
- 에듀테크 시장 규모 **~10조원** (2025), 패스트캠퍼스만 연 매출 **1,276억원**
- 출처: [ZDNet](https://zdnet.co.kr/view/?no=20260323181112), [고시위크](https://www.gosiweek.com/article/1065597368055328)

## 3. 해외: 비개발자가 만들어서 돈 버는 사례

| 누가 | 뭘 만들었나 | 수익 | 배경 |
|------|-----------|------|------|
| Sabrine Matos (브라질) | Plinq 여성 안전 앱 | **$456K ARR** | 마케터, Lovable 45일 |
| Pieter Levels | Fly 비행 시뮬레이터 | **$12K/월** | Cursor, 3시간 |
| Sebastian Volkis (런던) | ChatIQ 고객지원 챗봇 | **$2K MRR** 11K유저 | 비개발자, Claude+GPT |
| Nicola Manzini | Vibe Sail 3D 세일링 | **$8K/월** | Copilot, 85% AI |
| Evan (22세 자퇴) | Illustration.app | **$1.7K/월** | 프리미엄 모델 |

_(전체 리서치는 run artifact 참조)_

## 각도 선택

파이프라인이 제시한 각도 옵션:

- **learning-vs-building**: 한국은 AI 도구 사용량 세계 2위인데 실제 산출물이 없다는 문제 제기. 환경(PG/결제 장벽)과 성향(강의 소비 패턴) 양쪽을 다루되, 앱인토스 반례로 '환경이 바뀌면 한국인도 만든다'는 희망적 결론. 해외 비개발자 수익 사례와 대비. (novelty: 95/100) ✅
- **course-economy**: 한국의 '강의 경제' 자체에 집중. 스마트스토어→구매대행→유튜브→바이브코딩 패턴의 반복을 분석. 강의 파는 사람이 제일 많이 버는 구조. 에듀테크 10조원 시장의 이면. (novelty: 88/100)
- **stripe-gap**: 한국과 해외의 인프라 격차에 집중. Stripe 5분 vs PG 사업자등록+심사. 이 격차가 한국의 인디해커 문화를 죽이고 있다는 논의. 환경 중심. (novelty: 82/100)

선택된 제목: **강의를 사는 나라, 제품을 만드는 나라**

## AI Slop 검수

- Novelty Score: 96/100
- Reproducibility Score: 35/100
- Verdict: **pass**

수정된 패턴:

- **AI 헤지 패턴** (§이건 새로운 현상이 아니다 마지막 문단): `물론 배움 자체가 나쁘다는 건 아니다. 근데 배우는 것에서 멈추고, 만드는 것으로 넘어가지 못하는 패턴이 반복된다면 문제다.` → `'물론... 근데...' 헤지 패턴 제거. 방어적 문장 없이 바로 요점으로.`
- **자기계발서 톤** (§그래서 뭘 해야 하는가 전체): `강의를 하나 더 듣는 대신 뭔가 하나를 런칭하는 거다. 완벽하지 않아도 된다. 결제가 안 붙으면 무료로 시작해도 된다.` → `처방전 톤 제거. 이 섹션의 자기 고백 부분(나도 찔린다)만 살리고 §열광 다음에 섹션과 합치기`
- **과잉 방어** (§앱인토스가 증명한 것 마지막 문단): `한국인이 게을러서, 혹은 도전을 안 해서 제품이 안 나오는 게 아니다.` → `아무도 안 한 주장을 반박하는 느낌. 더 자연스럽게.`

리뷰어 코멘트:

> 전반적 톤이 좋음. 도입부 도발이 효과적이고, 스마트스토어→바이브코딩 패턴 연결이 강력함.
> 해외 사례 나열이 구체적이고 설득력 있음. 숫자가 풍부함.
> mermaid 다이어그램이 적절. 마무리 질문이 임팩트 있음.
> 번역체 표현 0건, 금지 표현 0건, 이모지 0건.
> 수정 필요 3건: (1) '물론' 헤지 제거 (2) §뭘 해야 하는가를 §열광 다음에와 합쳐서 자기계발서 톤 제거 (3) 과잉 방어 문장 자연스럽게
> 쉼표 비율 정상. 자기 고백(나도 찔린다)이 글에 진정성을 더함.

---

_이 빌드로그는 Post Compiler 파이프라인 `2026-03-31-claude-code-2` 실행에서 자동 생성되었습니다._
