---
title: '지식을 쌓지 말고 일을 추상화하라'
description: '제품을 만들 때 데이터·지식베이스·온톨로지부터 쌓는 접근은 대개 실패한다. 쌓아도 가치가 안 되고, 전문가도 AI도 지식을 미리 다 쌓지 않는다. 그런데도 데이터부터 모으는 건 진짜 어려운 일(업무를 새 단위로 추상화하기)을 피하는 핑계다. AWS가 서버에, 법률 AI가 미해결 의무에 했듯, 소프트웨어의 본질은 축적이 아니라 추상화다.'
summary: '쌓아도 가치가 안 되고 전문가도 미리 안 쌓는데, 왜 다들 데이터부터 모을까. 진짜 어려운 일(새 단위 설계)을 피하는 핑계이기 때문이다. AWS와 법률 AI를 예로, 축적 대신 추상화하는 법.'
pubDate: '2026-07-23T18:00:00+09:00'
category: 'essay'
tags: ['Product Strategy', 'AI', 'AX', 'Data']
series: '편향된 주장'
seriesOrder: 3
toolsUsed: ['Claude Code', 'Post Compiler']
heroImage: '../../assets/heroes/abstraction-over-accumulation.jpg'
heroImagePrompt: 'Split composition: left, a boat buried under a mountain of stacked crates and data blocks, stuck; right, the same boat sailing free as glowing blue blueprint line-art. Near-black background, blueprint grid, cool blue accent. Accumulation buries, abstraction moves. No text.'
draft: true
concepts:
  - name: 'Abstraction over Accumulation'
    related: ['Domain Modeling', 'Primitive Design', 'No Silver Bullet']
  - name: 'Infrastructure vs Work Software'
    related: ['Data Pipeline', 'Workflow', 'Value']
  - name: 'Just-in-time Knowledge'
    related: ['Agentic Search', 'Expert Cognition', 'Extended Mind']
---

의료 AI를 만든다는 팀을 여럿 만났다. 첫 질문은 늘 비슷했다. 의료 지식을 얼마나 확보할 수 있느냐. 채용 서비스도, 법률 서비스도 다르지 않았다. 후보자 데이터를, 판례를 어디서 얼마나 모으느냐부터 물었다. 나도 오래 그랬다. 무언가를 만들려면 먼저 그 분야의 지식부터 쌓아둬야 한다고 믿었다. 그런데 지켜볼수록, 그 순서가 대부분 거꾸로라는 생각이 들었다.

두 편에 걸쳐 [편향된 주장을 세우고](/blog/business-is-a-biased-claim/), [정보의 홍수 속에서 그 주장을 지키는](/blog/information-is-the-new-cook/) 이야기를 했다. 이제 마지막 질문이 남는다. 주장을 세운 다음, 무엇부터 만들어야 하나. 방금 그 팀들의 답은 한결같이 "데이터부터"였다. 왜 그게 거꾸로인지, 세 걸음에 걸쳐 이야기하려 한다. 쌓아도 소용이 없고, 애초에 그렇게 일하지도 않으며, 그런데도 우리가 자꾸 쌓는 데는 이유가 있다.

## 쌓는다고 가치가 되지는 않는다

첫째, "일단 다 모아두면 언젠가 가치가 나온다"는 믿음에는 이미 오래된 반례가 쌓여 있다.

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

데이터를 충분히 모으면, 최신 모델을 붙이면, 시스템을 다 연결하면 언젠가 가치가 나올 거라는 기대는 로또 당첨을 기다리는 것과 닮았다. 기다리는 동안 정작 답해야 할 질문은 계속 미뤄진다.[^4]

## 지식을 미리 다 쌓고 일하는 전문가는 없다

둘째, 애초에 지식을 먼저 완비해야 일할 수 있다는 전제부터가 사실과 다르다.

체스를 보자. 1973년 체이스와 사이먼은 체스 마스터가 실제 대국의 말 배치는 초보자보다 압도적으로 잘 기억하지만, 말을 무작위로 흩어놓으면 그 우위가 사라진다는 걸 발견했다.[^5] 마스터의 힘은 더 많이 외운 데서 오지 않는다. 눈앞의 판을 의미 있는 패턴으로 지각하는 데서 온다. 무작위 배치는 패턴이 없으니 마스터도 그냥 초보자가 된다. 전문가란 세상의 모든 지식을 머리에 이고 다니는 사람이 아니다. 지금 이 상황을 아는 구조에 비추어 읽어내는 사람이다. 인지과학은 한 걸음 더 나아가, 필요한 정보를 머리 밖에 두고 그때그때 참조하는 것이야말로 정상적인 인지 방식이라고 말한다.[^6]

코드를 짜주는 AI가 바로 이 방식으로 일한다. 그리고 그 설계 선택이 우리 논지를 정확히 증명한다. Claude Code 초기 버전은 프로그램 전체를 미리 요약해 색인으로 쌓아두고 거기서 찾는 방식을 썼다. 지식을 먼저 쌓아두는 접근이다. 그런데 결국 그때그때 뒤져보는 방식으로 갈아탔다. 폴더를 열어보고, 파일을 읽고, 필요한 걸 검색해 따라가는 식이다.[^7] 이유는 단순하다. 프로그램은 하루에도 수십 번 고쳐지는데, 미리 만들어둔 요약은 금세 옛날 것이 되기 때문이다. 계속 바뀌는 대상 앞에서는 쌓아둔 색인보다 지금 직접 찾아보는 편이 낫다.[^8] 제품이 다루려는 현실도 이 프로그램처럼 계속 변한다.

## 그런데 왜 자꾸 쌓으려 할까

쌓아도 가치가 안 되고, 전문가도 AI도 그렇게 일하지 않는다. 그런데도 왜 다들 데이터부터 모을까. 셋째이자 진짜 이유가 여기 있다. 정말 어려운 일에서 도망치기 때문이다.

정말 어려운 일이란 이 질문에 답하는 것이다. 이 사람은 실제로 어떤 일을 하고 있으며, 그 일을 어떤 새로운 단위로 다시 표현해야 하는가. 프레드 브룩스는 40년 전에 이걸 못박았다. "소프트웨어 시스템을 만드는 가장 어려운 단일 작업은 무엇을 만들지 정확히 결정하는 것"이라고. 코드로 옮기는 노동이 아니라, 그 개념 구조를 설계하는 일이 본질적으로 어렵다는 것이다.[^9] 도메인 주도 설계도 같은 자리를 가리킨다. 소프트웨어의 심장은 데이터를 저장하는 창고가 아니라, 방대한 지식을 통찰이 담긴 하나의 모델로 압축해내는 작업이라고.[^10]

[첫 글](/blog/business-is-a-biased-claim/)에서 봤던 제품들이 바로 이 어려운 일을 해냈다. 엑셀의 셀과 수식, 포토샵의 레이어와 마스크, Jira의 이슈와 상태, Slack의 채널과 스레드. 이들은 데이터를 남보다 많이 모아서 이긴 게 아니라, 일을 바라보는 새로운 단위를 발명해서 이겼다.

문제는 이 일이 답이 정해져 있지 않고, 현장을 오래 지켜봐야 하고, 틀리면 핑계 댈 곳도 없다는 것이다. 반면 데이터를 모으고 온톨로지를 설계하고 시스템을 연결하는 일은 어려워 보여도 다루기 편하다. 무엇을 해야 하는지가 명확하고, 진척을 테이블 수와 파이프라인 개수로 보여줄 수 있고, 잘 안 되면 "아직 데이터가 부족해서"라고 말할 수 있다. 그래서 우리는 조용히 쉬운 어려움으로 도망친다. 축적은 진짜 질문을 미루기에 더없이 좋은 핑계다.

우리 사회는 특히 이 도피에 능하다. 금융 고속도로, 의료 고속도로, 행정 디지털화처럼 정보를 시스템에 올리고 연결하고 통합하는 일을 빠르게, 그리고 자랑스럽게 해왔다. 새로운 도구를 [배우고 쌓는 데는 빠르지만 그것으로 무엇을 만들지에서 멈추는 경향](/blog/korea-learning-vs-building/)과도 닮아 있다. 인프라 자체는 가치가 있다. 다만 인프라는 정보가 흐를 길을 놓을 뿐, 사람이 그 길 위에서 무엇을 보고 판단하고 행동할지까지 바꿔주지는 않는다. 그 자리를 바꾸는 게 제품의 몫이고, 그게 어려운 일이다.

## 그래서, 어떻게 추상화하는가

말만으로는 공허하다. 구체적으로 해보자. 법률 AI를 예로 들겠다.

지금 나온 법률 AI 대부분은 이렇게 말한다. "판례 검색 시간을 70% 줄여드립니다." "계약서 검토를 자동화합니다." 얼핏 유용해 보인다. 하지만 이건 변호사의 기존 업무 단계(상담 → 판례 검색 → 서면 작성)를 AI로 더 빠르게 돌린 것뿐이다. 일을 새로 정의한 게 아니라 기존 일을 가속했다.

마이클 해머가 1990년 업무 리엔지니어링을 두고 한 말이 그대로 들어맞는다. 기존 프로세스를 그대로 둔 채 컴퓨터로 속도만 높이면 근본적 결함은 손도 못 댄다. 그는 "소가 다니던 길을 포장하지 말고, 낡은 절차는 없애고 처음부터 다시 시작하라"고 했다.[^hammer]

기존 업무를 너무 잘 아는 사람이 설계할수록 그 절차를 고스란히 보존하게 된다. 남는 건 대체 가능한 가속기다. 해자가 없다.

그럼 어디서 시작하나. 전문가의 절차가 아니라, 당사자가 실제로 해결하려는 '일'에서다. 클레이튼 크리스텐슨은 사람들이 제품을 사는 게 아니라 어떤 일을 처리하려고 그것을 '고용'한다고 했다.[^jtbd] 일반인이 변호사를 찾는 것도 '판례 검색'이 필요해서가 아니라, 못 받은 돈을 받고 싶어서다.

그가 실제로 겪는 건 "돈을 못 받았다", "상대가 말을 바꾼다" 같은 상태다. 이걸 분해하면 진짜 단위가 나온다. 누가 누구에게 무엇을 언제까지 해야 하는 **의무**, 그 의무의 **이행 상태**, 충돌하는 **주장**, 그 주장을 뒷받침하는 **증거**.

예를 들어 카톡 한 줄, "최종본 확인했습니다, 잔금은 다음 주에 드릴게요"를 보자. 이 문장은 세 가지를 동시에 증명한다. 납품 완료 인정, 결과물 확인, 잔금 지급 의무 인정. 증거를 파일이 아니라 "무엇을 증명하는가"로 다루는 순간, 그것은 새 단위가 된다.

이게 AWS가 한 일이다. 예전에는 서비스를 하나 만들려면 서버를 미리 사서 데이터센터에 쟁여두고 직접 관리해야 했다. AWS는 그걸 필요할 때 켜고, 안 쓰면 끄고, 쓴 만큼만 내는 형태로 바꿨다. 서버 설치를 자동화한 게 아니라, 사람이 다루는 단위 자체를 바꾼 것이다.

출발은 2002년 아마존이 전사에 내린 지시였다. 모든 팀은 자기 기능을 정해진 창구로만 주고받아라.[^bezos] 그러자 서버 더미와 케이블 대신, 필요할 때 불러다 조합하는 계산 능력·저장 공간·접근 권한이라는 자원이 생겼다.[^nist] 복잡성이 사라진 건 아니다. 누구나 다룰 수 있는 형태로 바뀐 것이다.

법률도 같다. 이렇게 보면 법률 AI는 "AI 변호사"가 아니다. **사회적 약속과 미해결 의무의 상태를 추적하고 해결하는 시스템**이다.

여기선 계약서 같은 문서가 원본이 아니다. 이 사건 모델이 원본이 되고, 문서는 모델에서 필요할 때 뽑아내는 출력물이 된다. 제조와 시스템 엔지니어링이 오래전 도달한 원칙과 같다. 모델을 단일 진실 원천으로 두고 문서를 거기서 생성하면, 문서는 늘 최신이고 서로 어긋나지 않는다.[^ssot]

그런데 새 단위를 정의하는 것만으로는 절반이다. AWS가 컴퓨트를 '단위'로 만든 데서 그치지 않고, 그것을 켜고 끄고 연결하는 화면과 명령을 함께 준 것처럼, 새 단위도 사용자가 직접 만지고 조합하고 실행할 수 있어야 한다. 추상화의 나머지 절반은 그 단위를 다루는 환경을 짓는 일이다.

법률이라면, 못 받은 돈을 앞에 두고 사용자가 해결 경로를 저울질하는 화면이다. 협상이냐 내용증명이냐 지급명령이냐를 예상 비용, 걸리는 시간, 관계가 상하는 정도로 나란히 놓고 비교하다가, 하나를 고르면 시스템이 다음 절차를 밟아준다. 사용자는 법을 공부하는 게 아니라 레버를 당긴다.

| | 축적하는 접근 | 추상화하는 접근 |
|---|---|---|
| 출발점 | 판례·문서를 모은다 | 당사자가 반복해서 겪는 문제 |
| 기본 단위 | 문서 | 미해결 의무·주장·증거 |
| 문서의 위치 | 원본 | 모델에서 자동 생성되는 출력물 |
| 사용자가 하는 일 | 문서를 읽고 고친다 | 상태를 조회하고 레버를 조작한다 |
| 시작 크기 | 거대한 지식베이스 | 하나의 좁은 흐름 |

그리고 이건 거대한 지식베이스로 시작하지 않는다. "못 받은 돈을 회수하는 하나의 흐름"처럼 좁게 시작한다. 미지급 거래를 등록하고 관련 대화와 계약서를 연결하면, 시스템이 의무와 이행 상태를 구성하고, 부족한 증거를 짚어주고, 회수 경로(협상·내용증명·지급명령)를 비용과 기간으로 비교해준다. 판례 데이터베이스를 다 쌓은 뒤가 아니라, 하나의 반복되는 문제를 새 단위로 표현하는 데서 제품이 시작된다.

정리하면 순서는 늘 같다. 전문가의 업무 절차가 아니라 당사자의 실제 문제에서 출발해, 반복되는 단위를 뽑고, 그 단위를 조작할 환경을 짓는다. 문서와 데이터는 그 위에서 나오는 결과물일 뿐이다.

<svg viewBox="0 0 640 255" role="img" aria-label="쌓는 접근에서는 데이터와 문서를 맨 앞에 두고 일단 쌓은 뒤 언젠가 가치가 나오길 기다리지만 제품이 무엇일지는 정해지지 않는다. 추상화 접근에서는 당사자의 문제에서 출발해 새 단위인 의무와 증거를 뽑고 그것을 조작하는 환경을 지으며 문서와 데이터는 맨 뒤에 나오는 결과물이다. 같은 데이터가 한쪽은 맨 앞, 한쪽은 맨 뒤로 정반대 위치에 놓인다" style="width:100%;max-width:600px;height:auto;display:block;margin:2.5em auto;font-family:'Instrument Sans', system-ui, sans-serif">
<text x="30" y="24" fill="#7E7E8A" font-size="12.5" font-weight="600">쌓는 접근 · 데이터가 맨 앞에</text>
<rect x="30" y="40" width="118" height="44" rx="6" fill="rgba(126,126,138,0.14)" stroke="#7E7E8A"/>
<text x="89" y="66" text-anchor="middle" fill="#E8E8ED" font-size="12">데이터·문서</text>
<text x="161" y="68" text-anchor="middle" fill="#7E7E8A" font-size="16">→</text>
<rect x="174" y="40" width="118" height="44" rx="6" fill="#141416" stroke="#1E1E22"/>
<text x="233" y="66" text-anchor="middle" fill="#E8E8ED" font-size="12">일단 쌓기</text>
<text x="305" y="68" text-anchor="middle" fill="#7E7E8A" font-size="16">→</text>
<rect x="318" y="40" width="118" height="44" rx="6" fill="#141416" stroke="#1E1E22"/>
<text x="377" y="66" text-anchor="middle" fill="#E8E8ED" font-size="12">언젠가 가치?</text>
<text x="449" y="68" text-anchor="middle" fill="#7E7E8A" font-size="16">→</text>
<rect x="462" y="40" width="118" height="44" rx="6" fill="#141416" stroke="#EF4444"/>
<text x="521" y="66" text-anchor="middle" fill="#7E7E8A" font-size="12">제품?</text>
<line x1="89" y1="84" x2="521" y2="166" stroke="#7E7E8A" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
<rect x="212" y="114" width="186" height="18" fill="#0A0A0B"/>
<text x="305" y="127" text-anchor="middle" fill="#7E7E8A" font-size="11">같은 데이터·문서, 정반대 위치</text>
<text x="30" y="150" fill="#3B82F6" font-size="12.5" font-weight="600">추상화 접근 · 데이터는 맨 뒤 결과물</text>
<rect x="30" y="166" width="118" height="44" rx="6" fill="#141416" stroke="#3B82F6"/>
<text x="89" y="192" text-anchor="middle" fill="#E8E8ED" font-size="12">당사자 문제</text>
<text x="161" y="194" text-anchor="middle" fill="#3B82F6" font-size="16">→</text>
<rect x="174" y="166" width="118" height="44" rx="6" fill="#141416" stroke="#3B82F6"/>
<text x="233" y="186" text-anchor="middle" fill="#E8E8ED" font-size="12">새 단위</text>
<text x="233" y="202" text-anchor="middle" fill="#7E7E8A" font-size="10.5">의무·증거</text>
<text x="305" y="194" text-anchor="middle" fill="#3B82F6" font-size="16">→</text>
<rect x="318" y="166" width="118" height="44" rx="6" fill="#141416" stroke="#3B82F6"/>
<text x="377" y="192" text-anchor="middle" fill="#E8E8ED" font-size="12">조작 환경</text>
<text x="449" y="194" text-anchor="middle" fill="#3B82F6" font-size="16">→</text>
<rect x="462" y="166" width="118" height="44" rx="6" fill="rgba(126,126,138,0.14)" stroke="#7E7E8A"/>
<text x="521" y="186" text-anchor="middle" fill="#E8E8ED" font-size="12">문서·데이터</text>
<text x="521" y="202" text-anchor="middle" fill="#7E7E8A" font-size="10.5">(출력물)</text>
<text x="320" y="240" text-anchor="middle" fill="#7E7E8A" font-size="11.5">데이터는 그대로다. 순서를 뒤집는 게 추상화다</text>
</svg>

지식베이스부터 쌓는 접근은 이 순서를 거꾸로 탄다. 맨 끝에 와야 할 데이터를 맨 앞에 놓고, 거기서 제품이 저절로 나오길 기다린다. 그런데 데이터가 맨 앞에 오면 배가 어디로 갈지는 아무도 정하지 않은 상태가 된다.

## 배를 움직이는 건 창고가 아니다

방향이 없으니, 데이터를 아무리 쌓아도 그 자체로는 해자가 되지 못한다. 실리콘밸리에서도 "데이터가 곧 해자"라는 믿음은 대체로 착각으로 판명됐다. 데이터는 복제되고, 시간이 지나면 낡고, 쌓일수록 새 데이터 한 건의 가치는 떨어진다. 진짜 방어력은 데이터 더미가 아니라 그것을 어떤 차별화된 단위로 바꿔 사람의 일을 다르게 만드느냐에서 나온다.[^11] 가장 방대한 판례를 가진 법률 AI가 아니라, 못 받은 돈을 실제로 되찾게 해주는 쪽이 이긴다.

그리고 그 새 단위 하나를 제대로 뽑는 일은 데이터 백만 건을 쌓는 일보다 훨씬 어렵다. 여전히 정답이 없는 일이고, 틀리면 온전히 내 몫으로 남는다. 하지만 그만큼 값지다. 앨런 케이는 "좋은 관점 하나는 IQ 80점의 값어치가 있다"고 했다.[^12] 문제를 어떤 단위로 바라보느냐가 쌓아둔 지식의 양보다 결과를 크게 가른다는 말이다. 제품은 창고가 아니라 바로 그 하나의 단위에서 시작된다.

세 편을 한 문장으로 줄이면 이렇다. 사업은 세상에 대한 편향된 주장을 현실에 밀어 넣는 일이고(1편), 그 주장은 정보에 휩쓸리는 대신 AI를 판단의 도구로 부려 더 날카롭게 벼려야 하며(2편), 지식을 쌓는 게 아니라 일을 새 단위로 다시 정의하는 것으로 증명된다(3편). 셋은 결국 한 가지를 말한다. 남이 이미 아는 것을 더 많이 모으는 데는 답이 없다. 답은 세상을 남과 다르게 보는 하나의 방식을 세우고, 지키고, 형태로 만드는 데 있다.

그렇게 세운 주장은 틀릴지도 모른다. 아니, 틀릴 가능성이 더 높다. 그래도 괜찮다. 강한 주장은 실패해도 무언가를 가르쳐주지만, 모두를 만족시키려 뭉갠 약한 주장은 실패했는지조차 알 수 없다. 그러니 틀릴 자유를 쥔 채 당신이 발견한 하나의 가능성을 끝까지 밀어붙이고, 현실이 아니라고 답하면 미련 없이 버리고, 배운 것을 다음 주장으로 옮기면 된다.

그래서 배를 움직이는 건 창고에 쌓인 화물이 아니다. 어디로 갈지 정한 방향과, 그 배를 띄우는 단 하나의 골조다. 그리고 항해가 틀렸다면, 배는 언제든 다시 지으면 된다.

[^1]: Gartner, "Gartner Says Beware of the Data Lake Fallacy" (2014). 목적·거버넌스 없는 축적은 활용 불가능한 "data swamp"가 된다. [보도자료](https://www.gartner.com/en/newsroom/press-releases/2014-07-28-gartner-says-beware-of-the-data-lake-fallacy)
[^2]: World Economic Forum, "You may have heard data is the new oil. It's not" (2018). 데이터는 비경합재이고 사일로에 가두면 가치가 준다. [WEF](https://www.weforum.org/stories/2018/01/data-is-not-the-new-oil/), [Forbes](https://www.forbes.com/sites/bernardmarr/2018/03/05/heres-why-data-is-not-the-new-oil/)
[^3]: The Standish Group, CHAOS Report 2020 (약 5만 건 분석). 성공 31%, 지연·초과 50%, 실패 19%. 대형 프로젝트 성공률 10% 미만, 소형 약 90%. success 정의가 엄격하다는 방법론 비판도 있다. [정리](https://opencommons.org/CHAOS_Report_on_IT_Project_Outcomes)
[^4]: "Waiting skeleton" 밈. 벤치에서 하염없이 기다리다 백골이 된 모습. 오래 유통된 인터넷 밈. [Imgflip](https://imgflip.com/memegenerator/158867860/skeleton-bench-waiting)
[^5]: William G. Chase, Herbert A. Simon, "Perception in Chess", Cognitive Psychology (1973). 마스터는 실제 대국 배치는 잘 재구성했으나 무작위 배치에서는 우위가 사라졌다. [원문 PDF](https://andymatuschak.org/prompts/Chase1973.pdf)
[^6]: Andy Clark, David Chalmers, "The Extended Mind", Analysis (1998). 인지는 머릿속에만 있지 않고 외부 자원에 분산·확장된다. [원문 PDF](https://www.alice.id.tue.nl/references/clark-chalmers-1998.pdf)
[^7]: [Claude Code](https://claude.com/product/claude-code) (Anthropic). 사전 인덱스 조회가 아니라 디렉터리 탐색·파일 읽기·검색으로 코드베이스를 그 자리에서 파악한다.
[^8]: Claude Code가 RAG(사전 임베딩)에서 agentic search(탐색)로 전환한 배경. 코드베이스는 커밋마다 바뀌므로 스냅샷이 아니라 살아 있는 코드에서 작동해야 한다. [분석](https://harrisonsec.com/blog/agent-retrieval-cost-curve-claude-code-grep-vs-rag/)
[^9]: Frederick P. Brooks Jr., "No Silver Bullet — Essence and Accident in Software Engineering" (1986/1987). "The hardest single part of building a software system is deciding precisely what to build." [원문 PDF](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf)
[^10]: Eric Evans, 『Domain-Driven Design』 (2003). 소프트웨어의 심장은 데이터 저장이 아니라 방대한 지식을 도메인 모델로 압축(knowledge crunching)하는 것이며, 이는 탐색의 과정이다.
[^11]: Martin Casado, Peter Lauten (a16z), "The Empty Promise of Data Moats" (2019). 데이터 네트워크 효과의 실증 증거는 빈약하며 대개 '규모 효과'에 불과하다. 장기 방어력은 데이터 축적이 아니라 차별화된 기술과 도메인 전문성에서 나온다. [a16z](https://a16z.com/the-empty-promise-of-data-moats/)
[^12]: Alan Kay, "Point of view is worth 80 IQ points". 1982년 'Creative Think' 세미나 기록에 처음 등장. 흔히 도는 "a change in perspective..." 변형은 저자 귀속이 불분명하고, 케이 본인의 원문은 이 "point of view" 버전이다. [Quote Investigator](https://quoteinvestigator.com/2018/05/29/pov/), [folklore.org](https://www.folklore.org/Creative_Think.html)
[^hammer]: Michael Hammer, "Reengineering Work: Don't Automate, Obliterate", [Harvard Business Review (1990)](https://hbr.org/1990/07/reengineering-work-dont-automate-obliterate). "기존 프로세스를 그대로 둔 채 속도만 높이는 것은 근본적 성능 결함을 건드리지 못한다", "소가 다니던 길(cow paths)을 포장하지 말고 없애고 다시 시작하라". Ford가 매입채무 처리 프로세스를 재설계해 인원을 대폭 줄인 사례로 유명.
[^jtbd]: Clayton Christensen, Scott Cook, Taddy Hall, "Marketing Malpractice: The Cause and the Cure", [Harvard Business Review (2005)](https://hbr.org/2005/12/marketing-malpractice-the-cause-and-the-cure). "사람들은 어떤 일을 처리해야 할 때, 본질적으로 그 일을 시키려고 제품을 고용(hire)한다." Jobs-to-be-Done 이론, 밀크셰이크 사례로 알려짐.
[^bezos]: 2002년경 아마존의 'API Mandate'. 모든 팀이 서비스 인터페이스를 통해서만 소통하고, 모든 인터페이스를 외부 공개 가능하게 설계하라는 지시. 훗날 AWS의 토대가 됐다. 공개된 텍스트 원천은 Steve Yegge의 2011년 회고 글이며, Bezos의 원문 메모가 아니라 Yegge의 회상이다. [정리](https://courses.cs.washington.edu/courses/cse452/23wi/papers/yegge-platform-rant.html)
[^nist]: NIST, "The NIST Definition of Cloud Computing" (SP 800-145, 2011). 클라우드를 "설정 가능한(configurable) 컴퓨팅 자원의 공유 풀"로 정의하고, 인간 개입 없이 필요할 때 스스로 프로비저닝하는 on-demand self-service를 핵심 특성으로 든다. 물리 서버 설치를 자동화한 게 아니라 자원을 호출 가능한 단위로 추상화한 것. [NIST](https://csrc.nist.gov/pubs/sp/800/145/final)
[^ssot]: 모델 기반 시스템 엔지니어링(MBSE)·모델 기반 정의(MBD)의 확립된 원칙. 모델을 단일 진실 원천(single source of truth)으로 두고 문서를 그로부터 생성하면 문서가 항상 최신·일관되게 유지된다. [Northrop Grumman](https://www.northropgrumman.com/what-we-do/digital-transformation/finding-a-single-source-of-truth-with-model-based-systems-engineering)
