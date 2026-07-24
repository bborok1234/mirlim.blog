---
title: '지식을 쌓지 말고 일을 추상화하라'
description: '제품을 만들 때 데이터·지식베이스·온톨로지부터 쌓는 접근은 대개 실패한다. 축적은 진짜 어려운 질문(이 일을 어떤 새 단위로 다시 표현할 것인가)을 미루는 우회로다. AWS가 서버를 다루는 방식을 바꿨듯, 법률 AI도 판례 축적이 아니라 미해결 의무를 추적하는 새 단위로 다시 설계할 수 있다. 소프트웨어의 본질은 축적이 아니라 추상화다.'
summary: '축적은 가치가 아니다. 전문가도 AI도 지식을 미리 쌓지 않고 그때그때 탐색한다. 진짜 일은 데이터를 모으는 게 아니라 업무를 새 단위로 추상화하는 것이다. AWS가 서버에, 그리고 법률 AI가 의무에 했듯이.'
pubDate: '2026-07-23T18:00:00+09:00'
category: 'essay'
tags: ['Product Strategy', 'AI', 'AX', 'Data']
series: '편향된 주장'
seriesOrder: 3
toolsUsed: ['Claude Code', 'Post Compiler']
heroImage: '../../assets/heroes/abstraction-over-accumulation.jpg'
heroImagePrompt: 'Split composition: left, a boat buried under a mountain of stacked crates and data blocks, stuck; right, the same boat sailing free as glowing blue blueprint line-art. Near-black background, blueprint grid, cool blue accent. Accumulation buries, abstraction moves. No text.'
draft: false
concepts:
  - name: 'Abstraction over Accumulation'
    related: ['Domain Modeling', 'Primitive Design', 'No Silver Bullet']
  - name: 'Infrastructure vs Work Software'
    related: ['Data Pipeline', 'Workflow', 'Value']
  - name: 'Just-in-time Knowledge'
    related: ['Agentic Search', 'Expert Cognition', 'Extended Mind']
---

두 편에 걸쳐 편향된 주장을 세우고, 정보의 홍수 속에서 그 주장을 지키는 이야기를 했다. 이제 마지막 질문이 남는다. 주장을 세운 다음, 무엇부터 만들어야 하나.

많은 팀의 첫 동작은 똑같다. 데이터부터 모은다. 의료 AI를 하겠다면 의료 지식을 얼마나 확보할 수 있는지부터 따지고, 채용 서비스를 하겠다면 후보자 데이터를 어디서 통합할지부터 정한다. 지식이 충분히 쌓여야 제품이 시작된다고 믿는 것이다. 나는 이 순서가 대부분 거꾸로라고 생각한다.

## 왜 자꾸 데이터부터 쌓고 싶어질까

데이터를 모으고 온톨로지를 설계하고 시스템을 연결하는 일은 분명 어렵다. 하지만 그 어려움은 다루기 편한 종류다. 무엇을 해야 하는지가 명확하고, 진척을 테이블 수와 파이프라인 개수로 보여줄 수 있고, 잘 안 되면 "아직 데이터가 부족해서"라고 말할 수 있다.

정말 어려운 질문은 따로 있다. 이 사람은 실제로 어떤 일을 하고 있으며, 그 일을 어떤 새로운 단위로 다시 표현해야 하는가. 이건 답이 정해져 있지 않고, 현장을 오래 지켜봐야 하고, 틀리면 핑계 댈 곳도 없다. 그래서 우리는 조용히 쉬운 어려움으로 도망친다. 축적은 진짜 질문을 미루기에 더없이 좋은 핑계다.

우리 사회는 특히 이 도피에 능하다. 금융 고속도로, 의료 고속도로, 행정 디지털화처럼 정보를 시스템에 올리고 연결하고 통합하는 일을 빠르게, 그리고 자랑스럽게 해왔다. 새로운 도구를 [배우고 쌓는 데는 빠르지만 그것으로 무엇을 만들지에서 멈추는 경향](/blog/korea-learning-vs-building/)과도 닮아 있다. 이런 인프라는 분명 가치가 있다. 다만 인프라의 가치와 제품의 가치는 종류가 다르다. 인프라는 정보가 흐를 길을 놓지만, 사람이 그 길 위에서 무엇을 보고 어떻게 판단하고 무엇을 할지까지 바꿔주지는 않는다. 길을 깐다고 사람이 더 좋은 일을 하게 되는 건 아니다. 그런데 많은 조직이 이 둘을 같은 것으로 착각한다.

## 쌓는다고 가치가 되지는 않는다

"일단 다 모아두면 언젠가 가치가 나온다"는 믿음에는 이미 오래된 반례가 쌓여 있다.

2014년 가트너는 데이터 레이크를 두고 경고했다. 목적과 거버넌스 없이 일단 부어넣은 저장소는 시간이 지나면 아무도 건져 쓸 수 없는 "데이터 늪(data swamp)"이 된다는 것이다.[^1] 데이터는 새로운 석유라는 비유가 이 오해를 부추기지만, 실은 정반대다. 석유는 캐서 쟁여두면 값이 오르지만 데이터는 사일로에 갇혀 흐르지 않으면 오히려 가치가 줄어든다.[^2] 가치는 쌓는 데서 나오지 않고 목적을 가지고 쓰는 데서 나온다.

크게 한 번에 다 지어놓고 보자는 접근은 특히 위험하다. 5만 건에 가까운 IT 프로젝트를 추적한 스탠디시 그룹의 2020년 조사에서, 대형 프로젝트의 성공률은 10%를 밑돌았다. 반면 작게 쪼갠 프로젝트는 약 90%가 성공했다.[^3] 미리 전부 통합하려는 거대한 플랫폼일수록 실패 확률이 치솟는다는 뜻이다. 그런데도 "완성된 지식베이스가 있어야 시작할 수 있다"는 발상은 정확히 그 거대한 한 방을 향해 간다.

<svg viewBox="0 0 640 380" role="img" aria-label="대형 IT 프로젝트의 성공률은 10퍼센트 미만인 반면 소형 프로젝트는 약 90퍼센트가 성공했다" style="width:100%;max-width:640px;height:auto;display:block;margin:2.5em auto;font-family:'Instrument Sans', system-ui, sans-serif">
<g stroke="#1E1E22" stroke-width="1">
<line x1="60" y1="320" x2="600" y2="320"/>
<line x1="60" y1="253" x2="600" y2="253"/>
<line x1="60" y1="185" x2="600" y2="185"/>
<line x1="60" y1="118" x2="600" y2="118"/>
<line x1="60" y1="50" x2="600" y2="50"/>
</g>
<g fill="#7E7E8A" font-size="12" text-anchor="end">
<text x="52" y="324">0</text>
<text x="52" y="257">25</text>
<text x="52" y="189">50</text>
<text x="52" y="122">75</text>
<text x="52" y="54">100%</text>
</g>
<rect x="140" y="296" width="110" height="24" rx="4" fill="#7E7E8A"/>
<text x="195" y="286" fill="#7E7E8A" font-size="17" font-weight="600" text-anchor="middle">&lt;10%</text>
<text x="195" y="342" fill="#E8E8ED" font-size="13" text-anchor="middle">대형 프로젝트</text>
<rect x="410" y="77" width="110" height="243" rx="4" fill="#3B82F6"/>
<text x="465" y="67" fill="#3B82F6" font-size="17" font-weight="600" text-anchor="middle">~90%</text>
<text x="465" y="342" fill="#E8E8ED" font-size="13" text-anchor="middle">소형 프로젝트</text>
<text x="330" y="374" fill="#7E7E8A" font-size="11.5" text-anchor="middle">프로젝트 규모별 성공률 (Standish CHAOS, 2020)</text>
</svg>

![벤치에 앉은 채 하염없이 기다리다 뼈만 남은 해골 밈](../../assets/memes/waiting-skeleton.jpg)

데이터를 충분히 모으면, 최신 모델을 붙이면, 시스템을 다 연결하면 언젠가 가치가 나올 거라는 기대는 로또 당첨을 기다리는 것과 닮았다. 기다리는 동안 정작 답해야 할 질문은 계속 미뤄진다.[^10]

## 지식을 미리 다 쌓고 일하는 전문가는 없다

애초에 지식을 먼저 완비해야 일할 수 있다는 전제부터가 사실과 다르다.

체스를 보자. 1973년 체이스와 사이먼은 체스 마스터가 실제 대국의 말 배치는 초보자보다 압도적으로 잘 기억하지만, 말을 무작위로 흩어놓으면 그 우위가 사라진다는 걸 발견했다.[^4] 마스터의 힘은 더 많이 외운 데서 오는 게 아니라, 눈앞의 판을 의미 있는 패턴으로 지각하는 데서 온다. 무작위 배치는 패턴이 없으니 마스터도 그냥 초보자가 된다. 전문가는 세상의 모든 지식을 머리에 이고 다니는 사람이 아니라, 지금 이 상황을 아는 구조에 비추어 읽어내는 사람이다. 인지과학은 한 걸음 더 나아가, 필요한 정보를 머리 밖에 두고 그때그때 참조하는 것이야말로 정상적인 인지 방식이라고 말한다.[^5]

코딩 에이전트가 바로 이 방식으로 일한다. 그리고 그 설계 선택이 우리 논지를 정확히 증명한다. Claude Code 초기 버전은 코드베이스를 미리 잘게 쪼개 임베딩해두는 방식(RAG)을 썼다. 지식을 먼저 쌓아두는 접근이다. 그런데 결국 그때그때 탐색하는 방식으로 갈아탔다. 디렉터리를 훑고, 파일을 읽고, 필요한 걸 검색하고, 참조를 따라가는 식이다.[^6] 이유는 단순하다. 코드베이스는 커밋마다 바뀌는데, 미리 찍어둔 스냅샷은 금세 과거가 되기 때문이다. 살아 움직이는 대상 앞에서는 미리 쌓아둔 인덱스보다 지금 찾아보는 편이 낫다.[^7] 제품이 다루려는 현실도 코드베이스처럼 계속 변한다.

## 진짜 어려운 일은 추상화다

그러면 지식을 쌓는 대신 무엇을 해야 하나. 실제 업무를 관찰해서, 그 일의 기본 단위와 상태와 관계를 뽑아내고, 사람이 그것을 다룰 수 있는 도구로 만드는 일이다.

프레드 브룩스는 40년 전에 이걸 못박았다. 소프트웨어의 본질은 데이터와 관계와 알고리즘이 맞물린 하나의 개념적 구조물이고, "소프트웨어 시스템을 만드는 가장 어려운 단일 작업은 무엇을 만들지 정확히 결정하는 것"이라고. 그것을 코드로 옮기는 노동이 아니라, 그 개념 구조를 설계하는 일이 본질적으로 어렵다는 것이다.[^8] 도메인 주도 설계도 같은 자리를 가리킨다. 소프트웨어의 심장은 데이터를 저장하는 창고가 아니라, 방대한 지식을 도메인에 대한 통찰이 담긴 하나의 모델로 압축해내는 작업이라고.[^9]

[첫 글](/blog/business-is-a-biased-claim/)에서 봤던 제품들이 바로 이 일을 해냈다. 엑셀의 셀과 수식, 포토샵의 레이어와 마스크, Jira의 이슈와 상태, Slack의 채널과 스레드. 이들은 데이터를 남보다 많이 모아서 이긴 게 아니라, 일을 바라보는 새로운 단위를 발명해서 이겼다. 먼저 단위를 발명하고, 그다음에 데이터가 의미를 얻는다. 지식베이스부터 쌓는 접근은 이 순서를 뒤집는다.

## 그래서, 어떻게 추상화하는가

"추상화하라"는 말만 반복하면 공허하다. 구체적으로 해보자. 법률 AI를 예로 들겠다.

지금 나온 법률 AI 대부분은 이렇게 말한다. "판례 검색 시간을 70% 줄여드립니다." "계약서 검토를 자동화합니다." 얼핏 유용해 보이지만, 이건 변호사의 기존 업무 단계(상담 → 판례 검색 → 서면 작성)를 AI로 더 빠르게 돌린 것일 뿐이다. 일을 새로 정의한 게 아니라 기존 일을 가속했다. 그래서 대체 가능하고, 해자가 없다. 기존 업무를 너무 잘 아는 사람이 제품을 설계하면 자연스럽게 이렇게 된다. 기존 산출물과 역할 분담을 그대로 보존하게 되는 것이다.

AWS가 무엇을 다르게 했는지 떠올려 보자. AWS는 서버 설치를 자동화한 게 아니다. 사용자가 다루는 단위 자체를 바꿨다. 물리 서버와 랙과 디스크 대신, 컴퓨트와 스토리지와 권한(IAM)이라는 새 단위를 줬다. 핵심은 이거다. **복잡성을 제거한 게 아니라, 복잡성을 프로그래밍 가능한 형태로 바꿨다.** 사용자는 여전히 많은 걸 신경 쓰지만, 이제 그것들은 조회하고 조합하고 실행할 수 있는 대상이 됐다.

법률에 같은 질문을 던져보자. 새 단위는 판례도 계약서도 아니다. 그건 변호사의 단위다. 일반인이 실제로 겪는 건 "돈을 못 받았다", "상대가 말을 바꾼다" 같은 상태다. 이걸 분해하면 진짜 단위가 나온다. 누가 누구에게 무엇을 언제까지 해야 하는 **의무**, 그 의무의 **이행 상태**, 충돌하는 **주장**, 그 주장을 뒷받침하는 **증거**. 예를 들어 카톡 한 줄 "최종본 확인했습니다, 잔금은 다음 주에 드릴게요"는 세 가지를 동시에 증명한다. 납품 완료 인정, 결과물 확인, 잔금 지급 의무 인정. 증거를 파일이 아니라 "무엇을 증명하는가"로 다루는 순간, 그것은 새 단위가 된다.

이렇게 보면 법률 AI는 "AI 변호사"가 아니다. **사회적 약속과 미해결 의무의 상태를 추적하고 해결하는 시스템**이다. 문서가 원본이고 AI가 그 문서를 읽는 게 아니라, 사건 모델이 원본이고 문서는 필요할 때 거기서 컴파일된다.

| | 축적하는 접근 | 추상화하는 접근 |
|---|---|---|
| 출발점 | 판례·문서를 모은다 | 당사자가 반복해서 겪는 문제 |
| 기본 단위 | 문서 | 미해결 의무·주장·증거 |
| 문서의 위치 | 원본 | 모델에서 컴파일된 산출물 |
| 시작 크기 | 거대한 지식베이스 | 하나의 좁은 흐름 |

그리고 이건 거대한 지식베이스로 시작하지 않는다. "못 받은 돈을 회수하는 하나의 흐름"처럼 좁게 시작한다. 미지급 거래를 등록하고 관련 대화와 계약서를 연결하면, 시스템이 의무와 이행 상태를 구성하고, 부족한 증거를 짚어주고, 회수 경로(협상·내용증명·지급명령)를 비용과 기간으로 비교해준다. 판례 데이터베이스를 다 쌓은 뒤가 아니라, 하나의 반복되는 문제를 새 단위로 표현하는 데서 제품이 시작된다.

추상화의 순서는 늘 같다. 전문가의 업무 절차가 아니라 당사자의 실제 문제에서 출발한다. 그 문제에서 반복되는 상태와 의무와 증거를 단위로 뽑는다. 문서는 그 단위의 산출물로 내려간다. 데이터는 맨 마지막에, 그 단위 위에 얹힌다.

## 배를 움직이는 건 창고가 아니다

그래서 데이터 축적은 해자가 되지 못한다. 첫 글에서 말했듯 기술은 제품을 만들 수 있게 해줄 뿐 살 이유까지 만들어주지 않는다. 진짜 해자는 쌓아둔 데이터의 양이 아니라, 어떤 새 단위로 사람의 일을 바꾸느냐에 있다. 가장 방대한 판례를 가진 법률 AI가 아니라, 못 받은 돈을 실제로 되찾게 해주는 쪽이 이긴다.

세 편을 한 문장으로 줄이면 이렇다. 사업은 편향된 주장을 현실에 밀어 넣는 일이고, 그 주장은 정보에 휩쓸려 흐려지지 않아야 하며, 지식을 쌓는 게 아니라 일을 다시 정의하는 것으로 증명된다.

축적은 언제나 더 안전하고 더 부지런해 보인다. 창고를 채우는 동안은 뭔가 나아가는 기분이 든다. 하지만 배를 움직이는 건 창고에 쌓인 화물이 아니라, 어디로 갈지에 대한 하나의 분명한 주장이다.

[^1]: Gartner, "Gartner Says Beware of the Data Lake Fallacy" (2014). 목적·거버넌스 없는 축적은 활용 불가능한 "data swamp"가 된다. [보도자료](https://www.gartner.com/en/newsroom/press-releases/2014-07-28-gartner-says-beware-of-the-data-lake-fallacy)
[^2]: World Economic Forum, "You may have heard data is the new oil. It's not" (2018). 데이터는 비경합재이고 사일로에 가두면 가치가 준다. [WEF](https://www.weforum.org/stories/2018/01/data-is-not-the-new-oil/), [Forbes](https://www.forbes.com/sites/bernardmarr/2018/03/05/heres-why-data-is-not-the-new-oil/)
[^3]: The Standish Group, CHAOS Report 2020 (약 5만 건 분석). 성공 31%, 지연·초과 50%, 실패 19%. 대형 프로젝트 성공률 10% 미만, 소형 약 90%. success 정의가 엄격하다는 방법론 비판도 있다. [정리](https://opencommons.org/CHAOS_Report_on_IT_Project_Outcomes)
[^4]: William G. Chase, Herbert A. Simon, "Perception in Chess", Cognitive Psychology (1973). 마스터는 실제 대국 배치는 잘 재구성했으나 무작위 배치에서는 우위가 사라졌다. [원문 PDF](https://andymatuschak.org/prompts/Chase1973.pdf)
[^5]: Andy Clark, David Chalmers, "The Extended Mind", Analysis (1998). 인지는 머릿속에만 있지 않고 외부 자원에 분산·확장된다. [원문 PDF](https://www.alice.id.tue.nl/references/clark-chalmers-1998.pdf)
[^6]: [Claude Code](https://claude.com/product/claude-code) (Anthropic). 사전 인덱스 조회가 아니라 디렉터리 탐색·파일 읽기·검색으로 코드베이스를 그 자리에서 파악한다.
[^7]: Claude Code가 RAG(사전 임베딩)에서 agentic search(탐색)로 전환한 배경. 코드베이스는 커밋마다 바뀌므로 스냅샷이 아니라 살아 있는 코드에서 작동해야 한다. [분석](https://harrisonsec.com/blog/agent-retrieval-cost-curve-claude-code-grep-vs-rag/)
[^8]: Frederick P. Brooks Jr., "No Silver Bullet — Essence and Accident in Software Engineering" (1986/1987). "The hardest single part of building a software system is deciding precisely what to build." [원문 PDF](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf)
[^9]: Eric Evans, 『Domain-Driven Design』 (2003). 소프트웨어의 심장은 데이터 저장이 아니라 방대한 지식을 도메인 모델로 압축(knowledge crunching)하는 것이며, 이는 탐색의 과정이다.
[^10]: "Waiting skeleton" 밈. 벤치에서 하염없이 기다리다 백골이 된 모습. 오래 유통된 인터넷 밈. [Imgflip](https://imgflip.com/memegenerator/158867860/skeleton-bench-waiting)
