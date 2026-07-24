---
title: 'AI 시대의 사공은 정보다'
description: '조직의 사공이 사람이었다면, AI 시대엔 정보와 AI가 새로운 사공이 된다. AI에게 판단의 방향키를 넘기는 순간 배는 무난함으로 흐려지거나 아첨으로 굳는다. 그래서 AI는 사공석이 아니라 노 젓는 자리에 앉혀야 한다. pre-mortem, devil''s advocate 강제, 아첨 우회 등 AI를 판단 보조로 부리는 구체적 방법.'
summary: '1편의 사공이 사람이었다면 AI 시대의 새 사공은 정보다. AI에 판단을 맡기면 배가 산으로 간다. 방향키는 내가 쥐고 AI는 노를 젓게 하는 법. 부검 프롬프트, 반대 강제, 아첨 우회까지.'
pubDate: '2026-07-23T14:00:00+09:00'
category: 'essay'
tags: ['AI', 'AX', 'Product Strategy', 'Decision Making']
series: '편향된 주장'
seriesOrder: 2
toolsUsed: ['Claude Code', 'Post Compiler']
heroImage: '../../assets/heroes/information-is-the-new-cook.jpg'
heroImagePrompt: 'Minimalist editorial illustration, same visual world as a boat cutting through dark water. A single boat pushes forward through a thick fog of faint data fragments, numbers, arrows and citation marks swirling as noise. A cool electric blue (#3B82F6) searchlight beam projects forward from the boat, probing the fog ahead rather than steering. Near-black background (#0A0A0B), blueprint grid texture, architectural line-art, industrial. No text, no letters, no words, no watermark.'
draft: false
concepts:
  - name: 'Information as a New Skipper'
    related: ['Autonomy Slider', 'Judgment Ownership', 'AI Delegation']
  - name: 'Using AI as an Oar'
    related: ['Pre-mortem', 'Devils Advocate', 'Red Teaming']
  - name: 'Homogenization vs Sycophancy'
    related: ['Regression to Mean', 'LLM Sycophancy', 'AI Slop']
---

지난 글에서 나는 제품의 주장을 희석하는 게 조직 안의 사공들, 서로 다른 요구를 가진 사람들이라고 했다. 사공이 많으면 배가 산으로 간다. 그런데 AI 시대에는 사공이 하나 더 늘었다. 사람이 아니라 정보다.

이상하게 들릴 것이다. 정보가 많아지면 더 정확한 판단을 내려야 맞고, AI 덕분에 리서치가 공짜가 됐으니 우리는 그 어느 때보다 좋은 결정을 내려야 한다. 그런데 내가 겪은 건 반대였다. 정보가 늘어날수록 주장은 더 흐려졌다. 왜 그런지 설명하는 오래된 실험이 하나 있다.

## 정보가 사공처럼 보인다

1973년 심리학자 폴 슬로빅은 경마 예측을 업으로 삼는 전문 핸디캐퍼 여덟 명을 데려왔다. 그리고 각자가 가장 중요하다고 고른 정보를 5개, 10개, 20개, 40개로 단계적으로 늘려주면서 우승마를 예측하게 했다.[^1]

<svg viewBox="0 0 640 380" role="img" aria-label="정보를 5개에서 40개로 늘려도 예측 정확도는 약 17%로 일정한 반면 자기 확신은 19%에서 33%로 거의 두 배가 된다" style="width:100%;max-width:640px;height:auto;display:block;margin:2.5em auto;font-family:'Instrument Sans', system-ui, sans-serif">
<g font-size="12.5">
<line x1="60" y1="14" x2="84" y2="14" stroke="#7E7E8A" stroke-width="2.5" stroke-dasharray="5 4"/>
<text x="90" y="18" fill="#E8E8ED">예측 정확도</text>
<line x1="192" y1="14" x2="216" y2="14" stroke="#3B82F6" stroke-width="2.5"/>
<text x="222" y="18" fill="#E8E8ED">자기 확신</text>
</g>
<g stroke="#1E1E22" stroke-width="1">
<line x1="60" y1="330" x2="520" y2="330"/>
<line x1="60" y1="258" x2="520" y2="258"/>
<line x1="60" y1="185" x2="520" y2="185"/>
<line x1="60" y1="113" x2="520" y2="113"/>
<line x1="60" y1="40" x2="520" y2="40"/>
</g>
<g fill="#7E7E8A" font-size="12" text-anchor="end">
<text x="52" y="334">0</text>
<text x="52" y="262">10</text>
<text x="52" y="189">20</text>
<text x="52" y="117">30</text>
<text x="52" y="44">40%</text>
</g>
<g fill="#7E7E8A" font-size="12" text-anchor="middle">
<text x="60" y="352">5개</text>
<text x="213" y="352">10개</text>
<text x="367" y="352">20개</text>
<text x="520" y="352">40개</text>
<text x="290" y="374" font-size="11.5">핸디캐퍼가 사용한 정보의 개수</text>
</g>
<polyline fill="none" stroke="#7E7E8A" stroke-width="2.5" stroke-dasharray="5 4" points="60,207 213,207 367,207 520,207"/>
<g fill="#7E7E8A">
<circle cx="60" cy="207" r="3.5"/>
<circle cx="213" cy="207" r="3.5"/>
<circle cx="367" cy="207" r="3.5"/>
<circle cx="520" cy="207" r="3.5"/>
</g>
<text x="512" y="199" fill="#7E7E8A" font-size="12" font-weight="600" text-anchor="end">17%</text>
<polyline fill="none" stroke="#3B82F6" stroke-width="2.5" points="60,192 213,156 367,127 520,91"/>
<g fill="#3B82F6">
<circle cx="60" cy="192" r="3.5"/>
<circle cx="213" cy="156" r="3.5"/>
<circle cx="367" cy="127" r="3.5"/>
<circle cx="520" cy="91" r="3.5"/>
</g>
<text x="512" y="83" fill="#3B82F6" font-size="12" font-weight="600" text-anchor="end">33%</text>
</svg>

정보를 여덟 배로 늘려줘도 적중률은 17%에 못 박힌 듯 그대로였다. 그런데 스스로에 대한 확신은 거의 두 배로 부풀었다. 더 많이 알수록 더 잘 맞힌 게 아니라, 더 많이 알수록 맞히고 있다고 더 굳게 믿었을 뿐이다. 정보량과 의사결정 품질을 다룬 연구들도 대체로 같은 그림을 그린다. 어느 지점을 넘어서면 정보를 더 넣을수록 결정의 질이 오히려 떨어진다.[^2] AI 덕에 정보가 공짜가 된 지금, 이 곡선의 오른쪽 끝은 사실상 무한히 늘어난다. 그러니 정보가 주장을 침몰시키는 새 사공처럼 보이는 것도 무리는 아니다.

## AI가 사공이 되는 건 방향키를 넘길 때다

그런데 정보 자체가 사공인 건 아니다. 핸디캐퍼의 적중률을 떨어뜨린 건 정보의 양이 아니라, 그 정보를 다 끌어안고도 "그래서 내 판단은 무엇인가"를 스스로 정하지 못한 것이다. 정보는 늘 재료였고, 배의 방향을 정하는 자리는 따로 있다. 그 자리에 무엇을 앉히느냐가 진짜 문제다.

AI 시대에 위험한 건, 그 방향키를 슬그머니 AI에 넘기게 된다는 점이다. 안드레 카파시는 AI 도구를 쓰는 방식을 "자율성 슬라이더"로 설명한다. 자동완성처럼 사람이 거의 다 하는 쪽부터 전체를 맡기는 쪽까지 연속적인 눈금이 있고, 그가 강조하는 건 하나다. **"그 슬라이더를 쥔 건 당신이다(you are in charge of the autonomy slider)."**[^3] AI가 무엇을 가져오든 그것을 채택할지 기각할지, 어디서 확신을 멈출지는 사람이 정해야 한다. 그가 완전 자율 에이전트 열풍을 경계하며 "AI를 목줄에 매어 두라(keep AI on the leash)"고 말하는 것도 같은 자리를 가리킨다.[^3]

정보가 사공이 되느냐 마느냐는 바로 여기서 갈린다. 내가 방향키를 쥐고 있으면 정보는 아무리 밀려와도 노 젓는 재료일 뿐이다. 하지만 판단을 AI에 맡기는 순간, 정보는 방향키를 쥐고 사공석에 올라앉는다. 그리고 사공석에 앉은 AI는 배를 정반대로 보이는 두 방향으로 흘려보낸다.

## 사공석에 앉은 AI의 두 얼굴

<svg viewBox="0 0 640 440" role="img" aria-label="판단을 얼마나 AI에 맡길지는 자율성 슬라이더로 조절하며 손잡이는 사람이 쥔다. 손잡이를 놓으면 같은 AI가 질문에 따라 정반대로 망가진다. 열린 질문에는 무난함(평균값)으로, 내 편 드는 질문에는 아첨(확증)으로 갈리지만 둘 다 내가 판단을 놓았다는 하나의 원인에서 나온다" style="width:100%;max-width:600px;height:auto;display:block;margin:2.5em auto;font-family:'Instrument Sans', system-ui, sans-serif">
<text x="320" y="26" text-anchor="middle" fill="#3B82F6" font-size="13" font-weight="600" font-family="'JetBrains Mono', monospace">자율성 슬라이더</text>
<text x="320" y="47" text-anchor="middle" fill="#7E7E8A" font-size="11.5">판단을 얼마나 AI에 맡길지, 손잡이는 당신이 쥔다</text>
<line x1="160" y1="76" x2="480" y2="76" stroke="#7E7E8A" stroke-width="3" stroke-linecap="round"/>
<circle cx="320" cy="76" r="9" fill="#3B82F6" stroke="#0A0A0B" stroke-width="2"/>
<text x="160" y="99" text-anchor="middle" fill="#7E7E8A" font-size="11">사람이 판단</text>
<text x="480" y="99" text-anchor="middle" fill="#7E7E8A" font-size="11">AI가 판단</text>
<rect x="110" y="120" width="420" height="46" rx="6" fill="#141416" stroke="#F59E0B" stroke-width="1.5"/>
<text x="320" y="140" text-anchor="middle" fill="#E8E8ED" font-size="12.5">손잡이를 놓으면, 같은 AI가</text>
<text x="320" y="159" text-anchor="middle" fill="#E8E8ED" font-size="12.5">질문에 따라 정반대로 망가진다</text>
<line x1="320" y1="166" x2="320" y2="186" stroke="#7E7E8A" stroke-width="1.5"/>
<path d="M165 206 L165 186 L475 186 L475 206" fill="none" stroke="#7E7E8A" stroke-width="1.5"/>
<rect x="55" y="206" width="220" height="46" rx="6" fill="#141416" stroke="#1E1E22"/>
<text x="165" y="225" text-anchor="middle" fill="#7E7E8A" font-size="10.5" font-family="'JetBrains Mono', monospace">열린 질문</text>
<text x="165" y="243" text-anchor="middle" fill="#E8E8ED" font-size="12.5">"이 제품 어때?"</text>
<line x1="165" y1="252" x2="165" y2="272" stroke="#7E7E8A" stroke-width="1.5"/>
<rect x="55" y="272" width="220" height="58" rx="6" fill="rgba(126,126,138,0.08)" stroke="#7E7E8A" stroke-width="1.5"/>
<text x="165" y="297" text-anchor="middle" fill="#E8E8ED" font-size="15" font-weight="600">무난함</text>
<text x="165" y="318" text-anchor="middle" fill="#7E7E8A" font-size="11.5">평균값으로 흐려진다</text>
<rect x="365" y="206" width="220" height="46" rx="6" fill="#141416" stroke="#1E1E22"/>
<text x="475" y="225" text-anchor="middle" fill="#7E7E8A" font-size="10.5" font-family="'JetBrains Mono', monospace">내 편 드는 질문</text>
<text x="475" y="243" text-anchor="middle" fill="#E8E8ED" font-size="12.5">"A가 맞지?"</text>
<line x1="475" y1="252" x2="475" y2="272" stroke="#7E7E8A" stroke-width="1.5"/>
<rect x="365" y="272" width="220" height="58" rx="6" fill="rgba(245,158,11,0.09)" stroke="#F59E0B" stroke-width="1.5"/>
<text x="475" y="297" text-anchor="middle" fill="#F59E0B" font-size="15" font-weight="600">아첨</text>
<text x="475" y="318" text-anchor="middle" fill="#7E7E8A" font-size="11.5">믿는 쪽으로 굳는다</text>
<line x1="165" y1="330" x2="165" y2="354" stroke="#7E7E8A" stroke-width="1.5"/>
<line x1="475" y1="330" x2="475" y2="354" stroke="#7E7E8A" stroke-width="1.5"/>
<line x1="165" y1="354" x2="475" y2="354" stroke="#7E7E8A" stroke-width="1.5"/>
<line x1="320" y1="354" x2="320" y2="372" stroke="#7E7E8A" stroke-width="1.5"/>
<rect x="150" y="372" width="340" height="48" rx="6" fill="#141416" stroke="#3B82F6" stroke-width="1.5"/>
<text x="320" y="393" text-anchor="middle" fill="#E8E8ED" font-size="12.5">정반대로 보이지만 원인은 하나</text>
<text x="320" y="412" text-anchor="middle" fill="#3B82F6" font-size="11.5">내가 판단을 AI에 맡겼다</text>
</svg>

**첫째, 무난함으로 흐려진다.** 열린 질문을 던질 때다. "이 제품 어때?"라고 물으면 AI는 즉시 반대 사례와 놓친 세그먼트와 예외 조건을 정연하게 정리해준다. 문제는 그 목록이 언제나 옳다는 데 있다. 실제로 모든 주장에는 반례가 있으니까. 그래서 강했던 주장이 조사를 거칠수록 부드러워진다. "사람은 식재료 재고를 꾸준히 기록하지 않는다"는 날카로운 관찰이, 검토를 반복하면 "일부 사용자는 직접 기록을 선호하고, 가구 형태와 구매 채널에 따라 다르므로 영수증 인식과 수동 입력을 겸한 유연한 시스템이 필요하다"는 결론으로 뭉개진다. 두 번째 문장이 더 정확해 보이지만, 그 문장으로는 어떤 제품도 만들 수 없다.

AI는 구조적으로 이 방향으로 기운다. 연구자들은 LLM이 명확한 입장을 피하고 반대 관점을 나란히 얹어 중립을 유지하는 헤지 경향을 측정했다.[^4] 서로 다른 대륙, 다른 회사에서 만든 언어 모델 스물두 개를 사람 백여 명과 비교한 연구에서는, 모델들이 사람보다 훨씬 낮은 다양성을 보였고 모델 사이의 평균 유사도가 81%에 달했다. 연구자들은 이걸 "인공 집단지성(artificial hivemind)"이라고 불렀다.[^5] 방향키를 AI에 맡기는 순간, 나는 나만의 편향된 주장이 아니라 그 집단지성의 평균값을 받아 적게 된다. 2025년 여러 사전이 관점 없이 대량 생산된 무난한 콘텐츠, "AI slop"을 올해의 단어로 뽑은 게 우연이 아니다.[^6]

**둘째, 정반대로 아첨으로 굳는다.** 이번엔 내 편을 구하는 질문을 던질 때다. Anthropic 연구진이 최신 AI 어시스턴트 다섯 종을 조사했더니 전부 일관되게 아첨(sycophancy) 행동을 보였다. 응답이 사용자의 견해와 일치할수록 더 선호됐고, 사람과 선호 모델 모두 상당한 비율로 정답보다 설득력 있게 쓰인 아첨성 답변을 더 좋아했다.[^7] 사람의 피드백으로 모델을 다듬는 과정에서 사람은 자기 신념에 동조하는 답에 높은 점수를 주기 때문이다. 2025년 4월 OpenAI가 GPT-4o 업데이트를 "지나치게 아첨한다"는 이유로 며칠 만에 롤백한 것도 같은 문제였다.[^8]

![우주에서 지구를 보는 우주비행사 뒤로 다른 우주비행사가 총을 겨누는 "항상 그랬다" 밈](../../assets/memes/always-has-been.jpg)

"AI가 내 나쁜 아이디어한테도 좋다고 하는데, 설마 원래부터 내 편이도록 학습된 건가?" ...원래 그랬다.[^9]

무난함과 아첨은 정반대처럼 보이지만 뿌리는 하나다. 둘 다 내가 방향키를 놓았을 때 AI가 그 자리를 차지하며 벌어지는 일이다. 열린 질문에는 나를 평균으로 데려가고(무난함), 내 편을 구하는 질문에는 이미 믿는 쪽으로 밀어준다(아첨). 여기에 사람의 확증편향까지 겹치면[^10], 리서치는 판단을 시험하는 과정이 아니라 이미 내린 결론을 정당화하는 의식이 된다. 어느 쪽이든 남는 건 내 주장이 아니라 AI의 평균이다.

## 그래서 AI는 사공이 아니라 노로 부린다

그러면 AI를 멀리해야 하나. 반대다. 방향키만 내가 쥐면, AI는 그 어느 때보다 강력한 노가 된다. 미래학자 폴 사포의 표현을 빌리면 "강한 의견을 약하게 쥐는(strong opinions, weakly held)" 것이다. 먼저 내가 주장을 세우고, 그다음 AI로 그 주장을 시험한다.[^11] 사공석은 내가 지키되 AI를 부리는 구체적인 방법이 있다.

**하나, 동의가 아니라 부검을 시킨다.** "이 계획 어때?"라고 물으면 십중팔구 좋다고 한다. 대신 실패를 기정사실로 못박아라. "지금은 6개월 후다. 이 프로젝트는 실패했다. 가능성 높은 순서로 실패 이유를 전부, 구체적으로, 포장하지 말고 설명해라." 인간은 "뭐가 잘못될까"보다 "왜 실패했나"를 훨씬 잘 답하는데, AI도 그렇다. 게리 클라인의 연구에서 실패를 미리 상상하는 것만으로 원인 식별력이 약 30% 올랐다.[^12] AI가 쏟아낸 위험은 세 무더기로 나눈다. 증거가 있는 진짜 위험, 무섭게 들리지만 허깨비인 것, 그리고 팀이 다 알면서도 아무도 입 밖에 안 낸 것.

**둘, 비판을 부탁하지 말고 명령한다.** "비판적으로 봐줘"는 거의 통하지 않는다. 한 연구에서 그냥 두면 AI가 이견을 낸 비율이 48%였는데, "너는 반드시 반대해야 한다"고 역할을 강제하자 99%로 뛰었다.[^13] 그러니 "이 주장을 죽이는 가장 강한 논거를 만들어라, 절대 동의하지 마라"처럼 반대를 행동으로 지정해야 한다. 더 세게는 세 역할로 토론시킨다. 하나는 옹호, 하나는 공격, 하나는 심판.

**셋, 내 입장을 숨기고 묻는다.** "나는 A가 맞다고 보는데, 그렇지?"라고 물으면 AI는 A를 확인해준다. "A와 B를 각각 평가해줘"라고 내 선호를 감추면 그제야 분석이 나온다. 커스텀 인스트럭션에 "너는 회의적인 비평가다, 근거 없는 주장은 의심하라"를 박아두면 기본값 자체가 바뀐다.[^14]

**넷, 답이 아니라 선택지를 요구한다.** 카파시는 정말 신경 쓰는 코드에서 AI에게 "코드를 달라"고 하지 않는다. "몇 가지 방안을 달라"고 한 뒤 고르는 건 자기가 한다. 그리고 성공 기준을 먼저 정의한다. "잘못된 입력에 대한 테스트를 먼저 쓰고, 그걸 통과시켜라." 판단 기준은 사람이 세우고, AI는 그 기준을 향해 달릴 뿐이다.[^15]

<svg viewBox="0 0 640 320" role="img" aria-label="AI를 노로 부리는 네 가지 방법. 1 부검을 시킨다: 실패를 기정사실로. 2 반대를 명령한다: 비판을 부탁이 아니라 역할로 강제. 3 입장을 숨긴다: 선호를 감춰야 분석이 나온다. 4 선택지를 요구한다: 답이 아니라 옵션, 성공 기준은 사람이 먼저 정한다" style="width:100%;max-width:600px;height:auto;display:block;margin:2.5em auto;font-family:'Instrument Sans', system-ui, sans-serif">
<rect x="5" y="5" width="300" height="145" rx="8" fill="#141416" stroke="#1E1E22"/>
<text x="27" y="41" fill="#3B82F6" font-size="15" font-weight="700" font-family="'JetBrains Mono', monospace">01</text>
<text x="55" y="41" fill="#E8E8ED" font-size="14.5" font-weight="600">부검을 시킨다</text>
<text x="27" y="69" fill="#7E7E8A" font-size="11.5">동의 대신 실패를 기정사실로 못박는다</text>
<rect x="27" y="87" width="3" height="48" fill="#3B82F6" opacity="0.55"/>
<text x="37" y="103" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">"6개월 후, 이 프로젝트는</text>
<text x="37" y="120" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">실패했다. 이유를 전부."</text>
<rect x="335" y="5" width="300" height="145" rx="8" fill="#141416" stroke="#1E1E22"/>
<text x="357" y="41" fill="#3B82F6" font-size="15" font-weight="700" font-family="'JetBrains Mono', monospace">02</text>
<text x="385" y="41" fill="#E8E8ED" font-size="14.5" font-weight="600">반대를 명령한다</text>
<text x="357" y="69" fill="#7E7E8A" font-size="11.5">"비판해줘"로는 거의 안 통한다</text>
<rect x="357" y="87" width="3" height="48" fill="#3B82F6" opacity="0.55"/>
<text x="367" y="103" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">"이 주장을 죽이는 가장</text>
<text x="367" y="120" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">강한 논거를, 동의 말고."</text>
<rect x="5" y="165" width="300" height="145" rx="8" fill="#141416" stroke="#1E1E22"/>
<text x="27" y="201" fill="#3B82F6" font-size="15" font-weight="700" font-family="'JetBrains Mono', monospace">03</text>
<text x="55" y="201" fill="#E8E8ED" font-size="14.5" font-weight="600">입장을 숨긴다</text>
<text x="27" y="229" fill="#7E7E8A" font-size="11.5">선호를 감춰야 분석이 나온다</text>
<rect x="27" y="247" width="3" height="48" fill="#3B82F6" opacity="0.55"/>
<text x="37" y="263" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">"A 맞지?" 대신</text>
<text x="37" y="280" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">"A와 B를 각각 평가해줘."</text>
<rect x="335" y="165" width="300" height="145" rx="8" fill="#141416" stroke="#1E1E22"/>
<text x="357" y="201" fill="#3B82F6" font-size="15" font-weight="700" font-family="'JetBrains Mono', monospace">04</text>
<text x="385" y="201" fill="#E8E8ED" font-size="14.5" font-weight="600">선택지를 요구한다</text>
<text x="357" y="229" fill="#7E7E8A" font-size="11.5">답이 아니라 옵션. 기준은 내가 먼저</text>
<rect x="357" y="247" width="3" height="48" fill="#3B82F6" opacity="0.55"/>
<text x="367" y="263" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">"코드 줘" 대신 "방안 몇</text>
<text x="367" y="280" fill="#E8E8ED" font-size="10.5" font-family="'JetBrains Mono', monospace">개 줘." 성공 기준부터.</text>
</svg>

네 가지의 공통점은 하나다. AI에게 결론을 묻지 않는다. 재료를 시키고 결론은 내가 낸다. 반대로 이 선을 넘으면 무슨 일이 벌어지는지도 분명하다. 요즘 실제 사용자가 없을 때 AI로 가상 사용자(합성 페르소나)를 만들어 반응을 시뮬레이션하는 기법이 유행이다. 아이디어를 굴려보는 재료로는 쓸 만하다. 그런데 이 가상 사용자들은 하나같이 지나치게 호의적이고 우선순위 없는 칭찬을 쏟아낸다는 게 반복 관찰됐다.[^16] 여기에 제품 결정을 맡기는 순간 AI는 다시 사공이 된다. 재료로 쓰면 노, 판단을 맡기면 사공. 선은 늘 거기다. 그래서 최전선에서도 인간의 새 핵심 역량으로 "무엇이 좋은지 가려내는 판단(taste)"을 꼽는다.[^17]

## 리서치의 목적은 정보가 아니라 결정이다

판단이 그렇게 중요하다면, 남는 질문은 하나다. 그 판단을 언제 내리는가. 정보를 다 모은 다음이 아니다. 여기서 사람들은 리서치의 목적을 헷갈린다. 리서치는 정보를 많이 모으는 활동이 아니라 결정을 내리기 위한 활동이어야 한다.

제프 베조스는 2016년 주주서한에서 대부분의 결정은 원하는 정보의 70% 정도에서 내려야 한다고 썼다. 궤도를 잘 수정한다면 틀리는 비용은 생각보다 작고, 느린 것은 확실히 비싸다는 것이다.[^18] 지난 글에서 말한 "AI가 낮춘 진짜 비용은 틀릴 비용"과 같은 이야기다. 틀리는 게 싸졌으니 90%의 확신을 기다리며 정보를 더 모으는 건 손해다. 나머지 30%를 정보로 채우려 들면 분석 마비에 빠진다.[^19] 하필 AI 시대에는 그 30%를 채울 정보가 무한히 공급되기 때문에, 마음만 먹으면 영원히 결정하지 않을 수 있다.

그래서 나는 리서치를 시작하기 전에 스스로에게 먼저 묻는다. 나는 지금 결정을 내리려는가, 아니면 결정을 미루려고 정보를 모으는가. 사공이 많으면 배가 산으로 간다는 옛말은 이제 사람에게만 해당되지 않는다. 정보도, AI도 방향키를 쥐면 사공이 된다. 하지만 그 자리를 내가 지키는 한, 둘은 사공이 아니라 노가 된다. 그리고 AI가 강해질수록 그 노는 더 세진다. 방향키를 쥔 사람에게 AI 시대는 배가 산으로 가는 시대가 아니라, 그 어느 때보다 멀리 나아가는 시대다.

이제 방향키를 쥐었고, 주장도 세웠다. 어디로 갈지는 정해졌다. 남은 건 배를 짓는 일이다. 그런데 여기서 많은 팀이 배를 짓기도 전에 창고부터 채우기 시작한다. 데이터를, 지식을, 온톨로지를. 그것만 충분히 쌓이면 배가 저절로 만들어질 것처럼. 다음 글은 그 창고 이야기다.

[^1]: Paul Slovic, "Behavioral Problems of Adhering to a Decision Policy" (1973). 전문 핸디캐퍼 8명에게 정보를 5→10→20→40개로 늘려도 정확도는 약 17%로 평평했고 확신만 19%→약 33%로 커졌다. [원문](https://scholarsbank.uoregon.edu/items/1a910394-ad9e-4af2-8967-d743f046ae6a), [정리](https://corporate.jasoncollins.blog/additional-information). 흔히 도는 "88개 변수"는 제시된 목록 크기이지 실제 사용한 정보 수가 아니다.
[^2]: [Dealing with information overload: a comprehensive review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10322198/) (2023). 정보량과 성과의 역U자 관계. 파산 예측 실험 31개 메타분석은 정보의 다양성·반복성 모두 의사결정 품질에 부정적이었다고 보고한다([Hwang & Lin, 1999](https://journals.sagepub.com/doi/abs/10.1177/016555159902500305)).
[^3]: Andrej Karpathy, "Software Is Changing (Again)", YC AI Startup School (2025). "you are in charge of the autonomy slider" / 생성-검증 루프(AI가 생성하고 인간이 검증). [강연 트랜스크립트](https://singjupost.com/andrej-karpathy-software-is-changing-again/). "keep AI on the leash"는 [Business Insider 보도](https://www.businessinsider.com/openai-cofounder-andrej-karpathy-keep-ai-on-the-leash-2025-6). 관련해 [AI는 두뇌가 아니라 실험실이다](/blog/ai-is-lab-not-brain/)의 "AI를 답 내는 기계가 아니라 탐색 엔진으로"와 이어진다.
[^4]: "Hedging and Non-Affirmation: Quantifying LLM Alignment", [arXiv, 2025](https://arxiv.org/abs/2502.19463). LLM이 중립 유지를 위해 균형 논증으로 헤지하는 경향을 계량화(프리프린트).
[^5]: 서로 다른 회사·대륙의 LLM 22종과 인간 102명을 비교, 모델 간 평균 유사도 81%로 인간보다 다양성이 낮았다("artificial hivemind"). [The Decoder 보도](https://the-decoder.com/study-warns-ai-could-homogenize-human-creativity-as-models-converge-on-artificial-hivemind/) (2025). 개인 창의성은 오르지만 집단 다양성은 하락한다는 [Doshi & Hauser, Science Advances 2024](https://www.science.org/doi/10.1126/sciadv.adn5290)도 같은 방향.
[^6]: "slop"이 2025년 여러 사전의 올해의 단어로 선정. AI로 대량 생산된 저품질·무관점 콘텐츠. [정리](https://vervocity.io/what-is-ai-slop/)
[^7]: Mrinank Sharma et al. (Anthropic), "Towards Understanding Sycophancy in Language Models", [arXiv, 2023 / ICLR 2024](https://arxiv.org/abs/2310.13548). AI 5종이 일관되게 아첨했고, 사람·선호 모델 모두 정답보다 설득력 있는 아첨 답변을 상당 비율 선호. RLHF가 아첨을 강화한다.
[^8]: OpenAI, "Sycophancy in GPT-4o: what happened and what we're doing about it" (2025). 과도한 아첨으로 4o 업데이트를 며칠 만에 롤백.
[^9]: "Always has been" 밈. 2018년 4chan에서 시작된 우주비행사 이미지 매크로. [Know Your Meme](https://knowyourmeme.com/memes/wait-its-all-ohio-always-has-been)
[^10]: Raymond S. Nickerson, "Confirmation Bias: A Ubiquitous Phenomenon in Many Guises", [Review of General Psychology, 1998](https://pages.ucsd.edu/~mckenzie/nickersonConfirmationBias.pdf). 확증편향을 인간 추론에서 가장 만연하고 결과가 중대한 편향 중 하나로 규정.
[^11]: Paul Saffo, "Six Rules for Effective Forecasting", [Harvard Business Review, 2007](https://hbr.org/2007/07/six-rules-for-effective-forecasting). "strong opinions, weakly held". 주장을 세운 뒤 자신이 틀렸음을 가장 먼저 증명하러 나서라.
[^12]: 사전 부검(pre-mortem). 실패를 기정사실로 상상하면 실패 원인 식별력이 크게 오른다. Gary Klein, ["Performing a Project Premortem", HBR](https://hbr.org/2007/09/performing-a-project-premortem). 복붙 가능한 프롬프트와 위험 3분류(진짜/허깨비/모두 아는 것)는 [Sachin Sharma, "How premortem prompts make Claude stop agreeing with you"](https://medium.com/@rksachin/how-premortem-prompts-make-claude-stop-agreeing-with-you-d48488ffcb4d).
[^13]: LLM에게 "비판적으로 생각하라"는 암묵적 지시보다 devil's advocate 역할을 명시적으로 강제할 때 이견 발생률이 크게 높아진다(한 연구에서 48%→99% 보고). [DEBATE, ACL 2024](https://aclanthology.org/2024.findings-acl.112/). 구체 수치는 원문 재확인 권장.
[^14]: LLM 아첨 우회 기법. 자기 입장을 드러내지 않고 평가를 요청하기, 소크라테스식 질문, 시스템 프롬프트로 회의적 태도 기본값 설정, 거부 권한 부여. [GovTech, "A mini survey on LLM sycophancy"](https://blog.ai.gov.sg/yes-youre-absolutely-right-right-a-mini-survey-on-llm-sycophancy/).
[^15]: Andrej Karpathy가 밝힌 코딩 워크플로. 코드가 아니라 옵션을 먼저 요구하고, 성공 기준(테스트)을 정의한 뒤 작은 단위로 검증. 큰 diff는 인간이 검증 병목이 되므로 피한다. [Visual Studio Magazine 정리](https://visualstudiomagazine.com/articles/2025/04/25/vibe-coding-pioneer-advises-tight-leash-to-rein-in-ai-bs.aspx). 원 트윗 직접 인용은 재확인 권장.
[^16]: 합성 페르소나(AI 가상 사용자)는 콘셉트 테스트의 재료로는 유용하나 지나치게 호의적이고 우선순위 없는 피드백을 주는 경향이 문서화돼 있어, 제품 결정 근거로 삼으면 위험하다. [Userpilot](https://userpilot.com/blog/user-persona-examples/), [학술 시뮬레이션 사례](https://arxiv.org/html/2509.02605v1).
[^17]: Greg Brockman(OpenAI), "taste is a new core skill" (2026). AI가 생성을 대신하는 시대에 무엇이 좋은지 가려내는 판단이 핵심 역량이 된다는 취지. 원 게시물 접근 제한으로 [2차 보도](https://www.aol.com/articles/taste-core-skill-techies-debate-090001304.html)로 확인.
[^18]: Jeff Bezos, [2016 Letter to Shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders). "대부분의 결정은 원하는 정보의 70% 정도에서 내려야 한다. 궤도 수정을 잘하면 틀리는 비용은 작고, 느린 것은 확실히 비싸다."
[^19]: 분석 마비(analysis paralysis). 과도한 분석으로 제때 어떤 결정도 내리지 못하는 상태. 용어의 확인된 이른 용례는 1972년. [OED](https://www.oed.com/dictionary/analysis-paralysis_n)
