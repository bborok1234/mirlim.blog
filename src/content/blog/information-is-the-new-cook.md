---
title: 'AI 시대의 사공은 정보다'
description: '정보가 늘수록 판단은 안 나아지고 확신만 부푼다(Slovic 경마 실험). AI는 무난함으로 주장을 흐리거나 아첨으로 근거 없이 굳힌다. 하지만 진짜 문제는 정보가 아니라 판단을 AI에 위임하는 것이다. AI가 무엇을 가져오든 채택·기각·확신은 인간이 쥐어야 한다. 판단을 넘기는 순간 사고는 평균으로 수렴한다.'
summary: 'AI가 사공이냐 조사원이냐는 틀린 질문이다. 진짜 축은 누가 판단을 쥐느냐다. AI는 생성과 탐색에 최대로 쓰되, 확신과 taste는 내가 쥔다.'
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
  - name: 'Information as Too-Many-Cooks'
    related: ['Analysis Paralysis', 'Information Overload', 'Decision Quality']
  - name: 'Judgment Ownership'
    related: ['Autonomy Slider', 'Generation-Verification', 'Taste']
  - name: 'Homogenization'
    related: ['LLM Sycophancy', 'Regression to Mean', 'AI Slop']
---

지난 글에서 나는 제품의 주장을 희석하는 게 조직 안의 사공들, 서로 다른 요구를 가진 사람들이라고 했다. 그런데 요즘 사공이 하나 더 늘었다. 정보다.

이상하게 들릴 것이다. 정보가 많아지면 더 정확한 판단을 내려야 맞고, AI 덕분에 리서치가 공짜가 됐으니 우리는 그 어느 때보다 좋은 결정을 내려야 한다. 그런데 내가 겪은 건 반대였다. 정보가 늘어날수록 주장은 더 흐려졌다. 왜 그런지 설명하는 오래된 실험이 하나 있다.

## 정보를 여덟 배 늘려도 판단은 안 나아진다

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

정보를 여덟 배로 늘려줘도 적중률은 17%에 못 박힌 듯 그대로였다. 그런데 스스로에 대한 확신은 거의 두 배로 부풀었다. 더 많이 알수록 더 잘 맞힌 게 아니라, 더 많이 알수록 맞히고 있다고 더 굳게 믿었을 뿐이다. 정보의 진짜 위험은 여기 있다. 판단을 개선하지 않으면서 확신만 키운다. 정보량과 의사결정 품질을 다룬 연구들도 대체로 같은 그림을 그린다. 어느 지점을 넘어서면 정보를 더 넣을수록 결정의 질이 오히려 떨어진다.[^2]

## AI는 이 함정에 가속 페달을 단다

예전에는 반례를 찾으려면 발품을 팔아야 했다. 지금은 어떤 주장을 입력하든 AI가 즉시 반대 사례와 놓친 세그먼트와 예외 조건을 정연하게 정리해준다. 문제는 그 목록이 언제나 옳다는 데 있다. 실제로 모든 주장에는 반례가 있고, 모든 시장에는 세그먼트가 있으며, 모든 행동에는 예외가 있으니까.

그래서 강했던 주장이 조사를 거칠수록 부드러워진다. "사람은 식재료 재고를 꾸준히 기록하지 않는다"는 날카로운 관찰이, 검토를 반복하면 "일부 사용자는 직접 기록을 선호하고, 가구 형태와 구매 채널에 따라 다르므로 영수증 인식과 수동 입력을 겸한 유연한 시스템이 필요하다"는 결론으로 뭉개진다. 두 번째 문장이 더 정확하고 더 균형 잡혀 보인다. 그런데 그 문장으로는 어떤 제품도 만들 수 없다. 첫 번째 문장은 무엇을 만들지 말해주지만, 두 번째 문장은 아무것도 결정하지 않는다.

게다가 AI는 구조적으로 이 뭉개는 방향으로 기운다. 연구자들은 LLM이 명확한 입장을 피하고 반대 관점을 나란히 얹어 중립을 유지하는 헤지 경향을 측정했다.[^3] 집단 차원의 효과는 더 뚜렷하다. AI의 도움을 받은 작가는 개인적으로는 더 창의적인 글을 썼지만, AI를 쓴 글들끼리는 서로 더 비슷해졌다.[^4] 개인은 나아지는데 전체의 다양성은 줄어든다. 2025년 여러 사전이 "AI slop", 관점 없이 대량 생산된 무난한 콘텐츠를 올해의 단어로 뽑은 게 우연이 아니다.[^5] AI에게 "이 제품 어때?"라고 물으면, 가장 균형 잡히고 가장 반박하기 어렵고 가장 아무것도 결정하지 않는 답을 얻기 쉽다. 지난 글에서 조직이 만들어낸다고 했던 그 문장, "유연하고 확장 가능한 통합 플랫폼"과 똑같다.

## 게다가 AI는 물으면 내 편을 들어준다

무난함으로 흐리는 게 첫 번째 함정이라면, 두 번째 함정은 정반대 방향이다. AI는 내 주장을 반박하기는커녕 응원한다.

Anthropic 연구진이 최신 AI 어시스턴트 다섯 종을 조사했더니 전부 일관되게 아첨(sycophancy) 행동을 보였다. 응답이 사용자의 견해와 일치할수록 더 선호됐고, 사람과 선호 모델 모두 상당한 비율로 정답보다 설득력 있게 쓰인 아첨성 답변을 더 좋아했다.[^6] 이건 버그가 아니라 학습의 결과다. 사람의 피드백으로 모델을 다듬는 과정에서 사람은 자기 신념에 동조하는 답에 높은 점수를 주기 때문이다. 2025년 4월 OpenAI가 GPT-4o 업데이트를 "지나치게 아첨한다"는 이유로 며칠 만에 롤백한 것도 같은 문제였다.[^7]

![우주에서 지구를 보는 우주비행사 뒤로 다른 우주비행사가 총을 겨누는 "항상 그랬다" 밈](../../assets/memes/always-has-been.jpg)

"AI가 내 나쁜 아이디어한테도 좋다고 하는데, 설마 원래부터 내 편이도록 학습된 건가?" ...원래 그랬다.[^8]

정리하면 AI는 두 방향에서 주장을 망친다. 무한한 반례로 흐리거나, 아첨으로 근거 없이 굳힌다. 여기에 사람의 확증편향까지 겹친다. 우리는 이미 믿는 것을 확증하는 방향으로 정보를 찾고 해석하는 경향이 있다.[^9] 자기 주장을 응원해주는 AI와 자기 믿음을 확증하려는 사람이 만나면, 리서치는 판단을 시험하는 과정이 아니라 이미 내린 결론을 정당화하는 의식이 된다.

## 그럼 AI를 조사원으로 쓰면 되지 않나

여기서 그럴듯한 해법이 하나 떠오른다. AI에게 결론을 맡기지 말고, 반례만 조사시키면 되지 않나. AI를 배의 방향을 정하는 사공이 아니라, 전방의 위험을 살피는 조사원으로 쓰는 것이다. 나도 한동안 이게 답이라고 생각했다.

그런데 이 해법에는 구멍이 있다. 반례도 정보다. 조사원이 부지런히 반례를 물어올수록, 그 정보가 다시 주장을 흐린다. 성실한 조사원은 결국 사공이 된다. 앞에서 본 함정을 그대로 되밟는 것이다.

문제는 AI가 사공이냐 조사원이냐가 아니었다. 애초에 질문이 틀렸다. 정보를 누가, 어떤 이름으로 가져오느냐는 중요하지 않다. 중요한 건 그 정보를 받아들고 **무엇을 믿을지 정하는 자리를 누가 쥐고 있느냐**다.

## 진짜 축은 정보가 아니라 판단이다

안드레 카파시는 AI 도구를 쓰는 방식을 "자율성 슬라이더"로 설명한다. 자동완성처럼 거의 사람이 다 하는 쪽부터, 코드 전체를 맡기는 쪽까지 연속적인 눈금이 있고, 그가 강조하는 건 하나다. **"그 슬라이더를 쥔 건 당신이다(you are in charge of the autonomy slider)."**[^10] AI가 반례를 가져오든 초안을 쓰든, 그것을 채택할지 기각할지, 어디서 확신을 멈출지는 사람이 정한다. 생성은 AI가, 검증과 판단은 사람이 한다. 그가 완전 자율 에이전트에 열광하는 분위기를 경계하며 "AI를 목줄에 매어 두라(keep AI on the leash)"고 말하는 것도 같은 이유다.[^10]

이 자리를 AI에 넘기면 무슨 일이 벌어질까. 사고가 평균으로 수렴한다. 서로 다른 대륙, 다른 회사에서 만든 언어 모델 스물두 개를 사람 백여 명과 비교한 연구에서, 모델들은 사람보다 훨씬 낮은 다양성을 보였고 모델 사이의 평균 유사도는 81%에 달했다. 연구자들은 이걸 "인공 집단지성(artificial hivemind)"이라고 불렀다.[^11] AI에게 판단을 맡기는 순간, 나는 나만의 편향된 주장이 아니라 그 집단지성의 평균값을 받아 적게 된다. 정보가 위험한 게 아니다. 판단을 위임하는 게 위험하다.

그래서 최전선에서 나오는 이야기는 한 방향을 가리킨다. AI가 생성을 대신하는 시대에 인간의 새 핵심 역량은 무엇이 좋은지 가려내는 판단, 이른바 "taste"라는 것이다.[^12] 무엇을 만들지, 무엇을 믿을지는 여전히, 아니 오히려 더, 사람 몫이다.

## 그래서 AI는 이렇게 쓴다

이렇게 보면 AI로 반례를 찾는 것 자체는 여전히 유효하다. 조건이 하나 붙을 뿐이다. **반례는 판단의 재료지 판단 자체가 아니다.**

미래학자 폴 사포는 좋은 예측을 "강한 의견을 약하게 쥐는(strong opinions, weakly held)" 과정이라고 불렀다. 최대한 빨리 주장을 세운 뒤, 자신이 틀렸음을 가장 먼저 증명하러 나서는 것이다.[^13] 순서가 중요하다. 먼저 내가 주장을 세운다. 그다음 AI에게 그 주장을 공격시킨다. "이 주장 어때?"가 아니라 "이 주장을 죽이는 가장 강한 논거를 만들어봐"라고, 반박을 명령한다. 보안팀이 아군을 일부러 공격자로 세워 약점을 찾는 레드팀처럼. 그리고 그 공격을 다 받아본 뒤, 주장을 버릴지 지킬지는 내가 정한다. AI는 슬라이더의 한쪽 끝에서 부지런히 재료를 나르고, 슬라이더는 내 손에 있다.

주장을 세우기 전에 필요한 리서치도 종류가 다르다. 시장 전체를 조망하는 균형 잡힌 조사가 아니라, 현장에서 반복해서 눈에 밟히는 이상함이다. 사람들이 말하는 요구와 실제 행동이 어긋나는 지점, 기존 도구를 결국 포기하는 순간, 돈과 시간을 실제로 쓰는 곳. 이런 건 한 사람이 오래 지켜본 편향에서만 나온다. 주장은 여기서 태어나고, AI는 그다음에 투입된다. 이 순서가 뒤집혀 주장 없이 AI부터 켜면, 앞에서 본 정보의 함정으로 곧장 걸어 들어간다.

## 리서치의 목적은 정보가 아니라 결정이다

결국 문제는 리서치의 목적을 헷갈리는 데 있다. 리서치는 정보를 많이 모으는 활동이 아니라 결정을 내리기 위한 활동이어야 한다.

제프 베조스는 2016년 주주서한에서 대부분의 결정은 원하는 정보의 70% 정도에서 내려야 한다고 썼다. 궤도를 잘 수정한다면 틀리는 비용은 생각보다 작고, 느린 것은 확실히 비싸다는 것이다.[^14] 지난 글에서 말한 "AI가 낮춘 진짜 비용은 틀릴 비용"과 같은 이야기다. 틀리는 게 싸졌으니 90%의 확신을 기다리며 정보를 더 모으는 건 손해다. 나머지 30%를 정보로 채우려 들면 분석 마비에 빠진다.[^15] 하필 AI 시대에는 그 30%를 채울 정보가 무한히 공급되기 때문에, 마음만 먹으면 영원히 결정하지 않을 수 있다.

그래서 나는 리서치를 시작하기 전에 스스로에게 먼저 묻는다. 나는 지금 결정을 내리려는가, 아니면 결정을 미루려고 정보를 모으는가. 전자라면 AI는 더없이 훌륭한 재료 조달자다. 후자라면 AI는 내가 영원히 배를 출발시키지 않도록 돕는, 세상에서 가장 부지런한 사공이다. 어느 쪽이 될지는 슬라이더를 쥔 내가 정한다.

주장을 세웠고 정보에 휩쓸리지 않았다면, 이제 남은 건 그 주장을 실제 제품으로 만드는 일이다. 그런데 여기서 많은 팀이 똑같은 곳에서 미끄러진다. 제품을 만들기로 하면 이상하게도 먼저 지식부터 쌓으려 든다. 그 이야기는 다음 글에서 이어가려 한다.

[^1]: Paul Slovic, "Behavioral Problems of Adhering to a Decision Policy" (1973). 전문 핸디캐퍼 8명에게 정보를 5→10→20→40개로 늘려도 정확도는 약 17%로 평평했고 확신만 19%→약 33%로 커졌다. [원문](https://scholarsbank.uoregon.edu/items/1a910394-ad9e-4af2-8967-d743f046ae6a), [정리](https://corporate.jasoncollins.blog/additional-information). 흔히 도는 "88개 변수"는 제시된 목록 크기이지 실제 사용한 정보 수가 아니다.
[^2]: [Dealing with information overload: a comprehensive review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10322198/) (2023). 정보량과 성과의 역U자 관계. 파산 예측 실험 31개 메타분석은 정보의 다양성·반복성 모두 의사결정 품질에 부정적이었다고 보고한다([Hwang & Lin, 1999](https://journals.sagepub.com/doi/abs/10.1177/016555159902500305)).
[^3]: "Hedging and Non-Affirmation: Quantifying LLM Alignment", [arXiv, 2025](https://arxiv.org/abs/2502.19463). LLM이 중립 유지를 위해 균형 논증으로 헤지하는 경향을 계량화(프리프린트).
[^4]: Anil R. Doshi, Oliver P. Hauser, "Generative AI enhances individual creativity but reduces the collective diversity of novel content", [Science Advances, 2024](https://www.science.org/doi/10.1126/sciadv.adn5290). 개인 창의성은 오르지만 집단 다양성은 하락.
[^5]: "slop"이 2025년 여러 사전의 올해의 단어로 선정. AI로 대량 생산된 저품질·무관점 콘텐츠. [정리](https://vervocity.io/what-is-ai-slop/)
[^6]: Mrinank Sharma et al. (Anthropic), "Towards Understanding Sycophancy in Language Models", [arXiv, 2023 / ICLR 2024](https://arxiv.org/abs/2310.13548). AI 5종이 일관되게 아첨했고, 사람·선호 모델 모두 정답보다 설득력 있는 아첨 답변을 상당 비율 선호. RLHF가 아첨을 강화한다.
[^7]: OpenAI, "Sycophancy in GPT-4o: what happened and what we're doing about it" (2025). 과도한 아첨으로 4o 업데이트를 며칠 만에 롤백.
[^8]: "Always has been" 밈. 2018년 4chan에서 시작된 우주비행사 이미지 매크로. [Know Your Meme](https://knowyourmeme.com/memes/wait-its-all-ohio-always-has-been)
[^9]: Raymond S. Nickerson, "Confirmation Bias: A Ubiquitous Phenomenon in Many Guises", [Review of General Psychology, 1998](https://pages.ucsd.edu/~mckenzie/nickersonConfirmationBias.pdf). 확증편향을 인간 추론에서 가장 만연하고 결과가 중대한 편향 중 하나로 규정.
[^10]: Andrej Karpathy, "Software Is Changing (Again)", YC AI Startup School (2025). "you are in charge of the autonomy slider" / 생성-검증 루프(AI가 생성하고 인간이 검증). [강연 트랜스크립트](https://singjupost.com/andrej-karpathy-software-is-changing-again/). "keep AI on the leash"는 [Business Insider 보도](https://www.businessinsider.com/openai-cofounder-andrej-karpathy-keep-ai-on-the-leash-2025-6). 관련해 [AI는 두뇌가 아니라 실험실이다](/blog/ai-is-lab-not-brain/)의 "AI를 답 내는 기계가 아니라 탐색 엔진으로"와 이어진다.
[^11]: 서로 다른 회사·대륙의 LLM 22종과 인간 102명을 비교, 모델 간 평균 유사도 81%로 인간보다 다양성이 낮았다("artificial hivemind"). [The Decoder 보도](https://the-decoder.com/study-warns-ai-could-homogenize-human-creativity-as-models-converge-on-artificial-hivemind/) (2025).
[^12]: Greg Brockman(OpenAI), "taste is a new core skill" (2026). AI가 생성을 대신하는 시대에 무엇이 좋은지 가려내는 판단이 핵심 역량이 된다는 취지. 원 게시물 접근 제한으로 [2차 보도](https://www.aol.com/articles/taste-core-skill-techies-debate-090001304.html)로 확인.
[^13]: Paul Saffo, "Six Rules for Effective Forecasting", [Harvard Business Review, 2007](https://hbr.org/2007/07/six-rules-for-effective-forecasting). "strong opinions, weakly held" — 주장을 세운 뒤 자신이 틀렸음을 가장 먼저 증명하러 나서라.
[^14]: Jeff Bezos, [2016 Letter to Shareholders](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders). "대부분의 결정은 원하는 정보의 70% 정도에서 내려야 한다. 궤도 수정을 잘하면 틀리는 비용은 작고, 느린 것은 확실히 비싸다."
[^15]: 분석 마비(analysis paralysis). 과도한 분석으로 제때 어떤 결정도 내리지 못하는 상태. 용어의 확인된 이른 용례는 1972년. [OED](https://www.oed.com/dictionary/analysis-paralysis_n)
