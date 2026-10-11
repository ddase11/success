/* 우리 가족 기도말씀 30 - 성경 본문 데이터
 *
 * 주제별로 30구절씩 묶여 있습니다.
 *  - 기도(prayer): 기도에 관한 30구절
 *  - 믿음(faith) : 믿음에 관한 30구절
 *  - 성령(spirit): 성령에 관한 30구절 (서론 + 단계별 묵상 구성)
 *
 * 각 구절의 구성:
 *  - korean       : 개역개정 (대한성서공회)
 *  - koreanModern : 현대 한국어 번역 (Open Korean Bible, CC BY 4.0) — 선택 항목.
 *                   원문이 현대어로 번역되지 않은 구절에는 이 항목이 없으며,
 *                   그런 구절은 화면에서 현대어 줄이 표시되지 않습니다.
 *  - english      : NIV, New International Version (Biblica, Inc.)
 *
 * 아래 항목은 모두 선택 항목이며, 들어 있는 주제에서만 화면에 나타납니다.
 * ('성령' 주제의 단계별 구성에 사용됩니다. 성경 본문이 아니라 묵상 안내문입니다.)
 *  - title      : 구절 별칭 (예: "창조의 성령")
 *  - reason     : 1단계 — 이 말씀을 알아야 하는 이유
 *  - connection : 2단계 — 다른 말씀과의 연관성
 *  - question   : 4단계 — 가족이 함께 나눌 질문
 *  - prayer     : 4단계 — 함께 드릴 기도
 * 표시 순서는 1단계 → 2단계 → 3단계 본문(개역개정) → 4단계 나눔/기도
 *            → 5단계 쉬운 우리말 → 6단계 영어입니다.
 *
 * 주제에 intro(서론)가 있으면, 그 주제를 시작할 때 서론 화면이 먼저 나옵니다.
 *  - intro: { title, heading, paragraphs: [...] }
 *
 * 본문 출처와 사용 조건은 README.md의 "저작권 확인 사항"을 참고하세요.
 *
 * ⚠ 공개 배포 전 필독: 한글 개역개정 본문의 사용 조건과 허가 여부를
 * 대한성서공회(bskorea.or.kr)를 통해 반드시 확인해야 합니다.
 *
 * 주제를 추가하려면 window.BIBLE_THEMES 배열에 아래 구조로 항목을 추가하세요.
 * {
 *   key: "영문키",           // 저장소 구분용. 한 번 정하면 바꾸지 마세요.
 *   name: "화면에 보일 이름",
 *   intro: { title, heading, paragraphs: [...] },   // 선택 항목
 *   verses: [ { id, referenceKo, referenceEn, korean, koreanModern?, english }, ... ]
 * }
 * verses의 id는 1부터 빠짐없이 1씩 증가해야 합니다.
 */

window.BIBLE_THEMES = [
  {
    key: "prayer",
    name: "기도",
    verses: [
      {
        id: 1,
        referenceKo: "빌립보서 4장 6절",
        referenceEn: "Philippians 4:6",
        korean: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라",
        koreanModern: "아무것도 염려하지 말고, 모든 일에 기도와 간구로 여러분이 원하는 것을 감사하는 마음으로 하나님께 아뢰십시오.",
        english: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
      },
      {
        id: 2,
        referenceKo: "예레미야 33장 3절",
        referenceEn: "Jeremiah 33:3",
        korean: "너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라",
        english: "Call to me and I will answer you and tell you great and unsearchable things you do not know."
      },
      {
        id: 3,
        referenceKo: "마태복음 7장 7절",
        referenceEn: "Matthew 7:7",
        korean: "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니",
        koreanModern: "구하십시오. 그러면 너희에게 주실 것입니다. 찾으십시오. 그러면 찾을 것입니다. 문을 두드리십시오. 그러면 너희에게 열릴 것입니다.",
        english: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
      },
      {
        id: 4,
        referenceKo: "데살로니가전서 5장 17절",
        referenceEn: "1 Thessalonians 5:17",
        korean: "쉬지 말고 기도하라",
        koreanModern: "쉬지 말고 기도하십시오.",
        english: "pray continually,"
      },
      {
        id: 5,
        referenceKo: "마가복음 11장 24절",
        referenceEn: "Mark 11:24",
        korean: "그러므로 내가 너희에게 말하노니 무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라",
        koreanModern: "그러므로 내가 너희에게 말한다. 무엇이든지 기도하며 구하는 것은 이미 받은 줄로 믿어라. 그러면 그대로 이루어질 것이다.",
        english: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours."
      },
      {
        id: 6,
        referenceKo: "빌립보서 4장 7절",
        referenceEn: "Philippians 4:7",
        korean: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라",
        koreanModern: "그러면 사람의 이해를 뛰어넘는 하나님의 평화가 그리스도 예수 안에서 여러분의 마음과 생각을 지켜줄 것입니다.",
        english: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
      },
      {
        id: 7,
        referenceKo: "요한복음 15장 7절",
        referenceEn: "John 15:7",
        korean: "너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는대로 구하라 그리하면 이루리라",
        koreanModern: "너희가 내 안에 머물고 내 말이 너희 안에 머물면, 무엇이든지 원하는 대로 구하라. 그러면 이루어질 것이다.",
        english: "If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you."
      },
      {
        id: 8,
        referenceKo: "요한일서 5장 14절",
        referenceEn: "1 John 5:14",
        korean: "그를 향하여 우리가 가진 바 담대함이 이것이니 그의 뜻대로 무엇을 구하면 들으심이라",
        koreanModern: "우리가 그분을 향하여 가진 담대함은 이것입니다. 만일 우리가 그분의 뜻대로 무엇을 구하면 그분이 들으신다는 것입니다.",
        english: "This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us."
      },
      {
        id: 9,
        referenceKo: "로마서 8장 26절",
        referenceEn: "Romans 8:26",
        korean: "이와 같이 성령도 우리의 연약함을 도우시나니 우리는 마땅히 기도할 바를 알지 못하나 오직 성령이 말할 수 없는 탄식으로 우리를 위하여 친히 간구하시느니라",
        koreanModern: "이와 같이 성령께서도 연약한 우리를 도우십니다. 우리는 마땅히 기도할 바를 알지 못하지만, 성령께서 친히 말로 표현할 수 없는 탄식으로 우리를 위해 간구하십니다.",
        english: "In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans."
      },
      {
        id: 10,
        referenceKo: "히브리서 4장 16절",
        referenceEn: "Hebrews 4:16",
        korean: "그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라",
        koreanModern: "그러므로 우리가 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갑시다.",
        english: "Let us then approach God's throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need."
      },
      {
        id: 11,
        referenceKo: "역대하 7장 14절",
        referenceEn: "2 Chronicles 7:14",
        korean: "내 이름으로 일컫는 내 백성이 그들의 악한 길에서 떠나 스스로 낮추고 기도하여 내 얼굴을 찾으면 내가 하늘에서 듣고 그들의 죄를 사하고 그들의 땅을 고칠지라",
        english: "if my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land."
      },
      {
        id: 12,
        referenceKo: "누가복음 18장 1절",
        referenceEn: "Luke 18:1",
        korean: "예수께서 그들에게 항상 기도하고 낙심하지 말아야 할 것을 비유로 말씀하여",
        koreanModern: "항상 기도하고 낙심하지 말아야 할 것을 그들에게 비유로 말씀하셨습니다.",
        english: "Then Jesus told his disciples a parable to show them that they should always pray and not give up."
      },
      {
        id: 13,
        referenceKo: "에베소서 6장 18절",
        referenceEn: "Ephesians 6:18",
        korean: "모든 기도와 간구를 하되 항상 성령 안에서 기도하고 이를 위하여 깨어 구하기를 항상 힘쓰며 여러 성도를 위하여 구하라",
        koreanModern: "모든 기도와 간구로 항상 성령 안에서 기도하십시오. 이를 위해 깨어 있어 모든 성도를 위해 끈질기게 기도하십시오.",
        english: "And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord's people."
      },
      {
        id: 14,
        referenceKo: "야고보서 1장 5절",
        referenceEn: "James 1:5",
        korean: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라",
        koreanModern: "여러분 중에 누구든지 지혜가 부족하면 모든 사람에게 후히 주시고 꾸짖지 않으시는 하나님께 구하십시오. 그리하면 주실 것입니다.",
        english: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."
      },
      {
        id: 15,
        referenceKo: "시편 50편 15절",
        referenceEn: "Psalm 50:15",
        korean: "환난 날에 나를 부르라 내가 너를 건지리니 네가 나를 영화롭게 하리로다",
        english: "and call on me in the day of trouble; I will deliver you, and you will honor me."
      },
      {
        id: 16,
        referenceKo: "시편 55편 22절",
        referenceEn: "Psalm 55:22",
        korean: "네 짐을 여호와께 맡기라 그가 너를 붙드시고 의인의 요동함을 영원히 허락하지 아니하시리로다",
        english: "Cast your cares on the LORD and he will sustain you; he will never let the righteous be shaken."
      },
      {
        id: 17,
        referenceKo: "시편 62편 8절",
        referenceEn: "Psalm 62:8",
        korean: "백성들아 시시로 그를 의지하고 그의 앞에 마음을 토하라 하나님은 우리의 피난처시로다 (셀라)",
        english: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge."
      },
      {
        id: 18,
        referenceKo: "요한복음 14장 13절",
        referenceEn: "John 14:13",
        korean: "너희가 내 이름으로 무엇을 구하든지 내가 행하리니 이는 아버지로 하여금 아들로 말미암아 영광을 받으시게 하려 함이라",
        koreanModern: "너희가 내 이름으로 무엇을 구하든지, 내가 이루어 주겠다. 이것은 아버지께서 아들을 통해 영광을 받으시게 하려는 것이다.",
        english: "And I will do whatever you ask in my name, so that the Father may be glorified in the Son."
      },
      {
        id: 19,
        referenceKo: "요한복음 16장 24절",
        referenceEn: "John 16:24",
        korean: "지금까지는 너희가 내 이름으로 아무 것도 구하지 아니하였으나 구하라 그리하면 받으리니 너희 기쁨이 충만하리라",
        koreanModern: "지금까지 너희는 내 이름으로 아무것도 구하지 않았다. 구하라. 그러면 받을 것이다. 그래서 너희 기쁨이 넘칠 것이다.",
        english: "Until now you have not asked for anything in my name. Ask and you will receive, and your joy will be complete."
      },
      {
        id: 20,
        referenceKo: "야고보서 5장 15절",
        referenceEn: "James 5:15",
        korean: "믿음의 기도는 병든 자를 구원하리니 주께서 그를 일으키시리라 혹시 죄를 범하였을지라도 사하심을 받으리라",
        koreanModern: "믿음의 기도는 병든 사람을 구원할 것이니 주께서 그를 일으키실 것입니다. 혹시 죄를 범하였을지라도 사하심을 얻을 것입니다.",
        english: "And the prayer offered in faith will make the sick person well; the Lord will raise them up. If they have sinned, they will be forgiven."
      },
      {
        id: 21,
        referenceKo: "마태복음 7장 11절",
        referenceEn: "Matthew 7:11",
        korean: "너희가 악한 자라도 좋은 것으로 자식에게 줄 줄 알거든 하물며 하늘에 계신 너희 아버지께서 구하는 자에게 좋은 것으로 주시지 않겠느냐",
        koreanModern: "너희가 악한 사람일지라도 자녀에게 좋은 것을 줄 줄 안다면, 하늘에 계신 너희 아버지께서는 구하는 사람들에게 좋은 것으로 얼마나 더 잘 주시겠습니까?",
        english: "If you, then, though you are evil, know how to give good gifts to your children, how much more will your Father in heaven give good gifts to those who ask him!"
      },
      {
        id: 22,
        referenceKo: "요한일서 5장 15절",
        referenceEn: "1 John 5:15",
        korean: "우리가 무엇이든지 구하는 바를 들으시는 줄을 안즉 우리가 그에게 구한 그것을 얻은 줄을 또한 아느니라",
        koreanModern: "우리가 무엇을 구하든지 그분이 들으시는 줄을 안다면, 우리가 그분께 구한 것을 얻은 줄도 압니다.",
        english: "And if we know that he hears us—whatever we ask—we know that we have what we asked of him."
      },
      {
        id: 23,
        referenceKo: "시편 145편 18절",
        referenceEn: "Psalm 145:18",
        korean: "여호와께서는 자기에게 간구하는 모든 자 곧 진실하게 간구하는 모든 자에게 가까이 하시는도다",
        english: "The Lord is near to all who call on him, to all who call on him in truth."
      },
      {
        id: 24,
        referenceKo: "로마서 8장 27절",
        referenceEn: "Romans 8:27",
        korean: "마음을 살피시는 이가 성령의 생각을 아시나니 이는 성령이 하나님의 뜻대로 성도를 위하여 간구하심이니라",
        koreanModern: "마음을 살피시는 분께서는 성령의 생각이 무엇인지 아십니다. 성령께서 하나님의 뜻대로 성도를 위해 간구하시기 때문입니다.",
        english: "And he who searches our hearts knows the mind of the Spirit, because the Spirit intercedes for God's people in accordance with the will of God."
      },
      {
        id: 25,
        referenceKo: "히브리서 11장 6절",
        referenceEn: "Hebrews 11:6",
        korean: "믿음이 없이는 하나님을 기쁘시게 하지 못하나니 하나님께 나아가는 자는 반드시 그가 계신 것과 또한 그가 자기를 찾는 자들에게 상 주시는 이심을 믿어야 할지니라",
        koreanModern: "믿음이 없이는 하나님을 기쁘시게 하지 못합니다. 하나님께 나아가는 자는 반드시 그분께서 계신 것과 그분께서 자기를 찾는 자들에게 상 주시는 분이심을 믿어야 합니다.",
        english: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him."
      },
      {
        id: 26,
        referenceKo: "이사야 65장 24절",
        referenceEn: "Isaiah 65:24",
        korean: "그들이 부르기 전에 내가 응답하겠고 그들이 말을 마치기 전에 내가 들을 것이며",
        english: "Before they call I will answer; while they are still speaking I will hear."
      },
      {
        id: 27,
        referenceKo: "시편 86편 7절",
        referenceEn: "Psalm 86:7",
        korean: "나의 환난 날에 내가 주께 부르짖으리니 주께서 내게 응답하시리이다",
        english: "When I am in distress, I call to you, because you answer me."
      },
      {
        id: 28,
        referenceKo: "누가복음 11장 13절",
        referenceEn: "Luke 11:13",
        korean: "너희가 악할지라도 좋은 것을 자식에게 줄 줄 알거든 하물며 너희 하늘 아버지께서 구하는 자에게 성령을 주시지 않겠느냐 하시니라",
        koreanModern: "너희가 악할지라도 좋은 것을 자녀에게 줄 줄 알거든, 하늘 아버지께서 구하는 사람들에게 성령을 주시지 않겠느냐?\"",
        english: "If you then, though you are evil, know how to give good gifts to your children, how much more will your Father in heaven give the Holy Spirit to those who ask him!"
      },
      {
        id: 29,
        referenceKo: "시편 66편 19절",
        referenceEn: "Psalm 66:19",
        korean: "그러나 하나님이 실로 들으셨음이여 내 기도 소리에 귀를 기울이셨도다",
        english: "but God has surely listened and has heard my prayer."
      },
      {
        id: 30,
        referenceKo: "요한복음 15장 16절",
        referenceEn: "John 15:16",
        korean: "너희가 나를 택한 것이 아니요 내가 너희를 택하여 세웠나니 이는 너희로 가서 열매를 맺게 하고 또 너희 열매가 항상 있게 하여 내 이름으로 아버지께 무엇을 구하든지 다 받게 하려 함이라",
        koreanModern: "너희가 나를 택한 것이 아니라 내가 너희를 택했다. 그리고 너희를 세웠다. 이는 너희가 가서 열매를 맺고, 그 열매가 계속 남아 있게 하려는 것이다. 그래서 너희가 내 이름으로 아버지께 무엇을 구하든지 다 받게 하려는 것이다.",
        english: "You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last—and so that whatever you ask in my name the Father will give you."
      }
    ]
  },
  {
    key: "faith",
    name: "믿음",
    verses: [
      {
        id: 1,
        referenceKo: "히브리서 11장 1절",
        referenceEn: "Hebrews 11:1",
        korean: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니",
        koreanModern: "믿음은 바라는 것들의 실상이요 보지 못하는 것들의 증거입니다.",
        english: "Now faith is confidence in what we hope for and assurance about what we do not see."
      },
      {
        id: 2,
        referenceKo: "히브리서 11장 6절",
        referenceEn: "Hebrews 11:6",
        korean: "믿음이 없이는 하나님을 기쁘시게 하지 못하나니 하나님께 나아가는 자는 반드시 그가 계신 것과 또한 그가 자기를 찾는 자들에게 상 주시는 이심을 믿어야 할지니라",
        koreanModern: "믿음이 없이는 하나님을 기쁘시게 하지 못합니다. 하나님께 나아가는 자는 반드시 그분께서 계신 것과 그분께서 자기를 찾는 자들에게 상 주시는 분이심을 믿어야 합니다.",
        english: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him."
      },
      {
        id: 3,
        referenceKo: "요한복음 3장 16절",
        referenceEn: "John 3:16",
        korean: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
        koreanModern: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니, 이는 그를 믿는 사람마다 멸망하지 않고 영생을 얻게 하려는 것입니다.",
        english: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
      },
      {
        id: 4,
        referenceKo: "로마서 10장 9절",
        referenceEn: "Romans 10:9",
        korean: "네가 만일 네 입으로 예수를 주라 시인하며 또 하나님께서 그를 죽은 자 가운데서 살리신 것을 네 마음에 믿으면 구원을 받으리라",
        koreanModern: "네가 입으로 예수를 주로 고백하고, 마음으로 하나님께서 그분을 죽은 자 가운데서 살리신 것을 믿으면 구원을 받을 것입니다.",
        english: "If you declare with your mouth, \"Jesus is Lord,\" and believe in your heart that God raised him from the dead, you will be saved."
      },
      {
        id: 5,
        referenceKo: "로마서 10장 17절",
        referenceEn: "Romans 10:17",
        korean: "그러므로 믿음은 들음에서 나며 들음은 그리스도의 말씀으로 말미암았느니라",
        koreanModern: "그러므로 믿음은 들음에서 나오고, 들음은 그리스도의 말씀으로 말미암습니다.",
        english: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ."
      },
      {
        id: 6,
        referenceKo: "에베소서 2장 8절",
        referenceEn: "Ephesians 2:8",
        korean: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라",
        koreanModern: "여러분이 구원받은 것은 은혜로 말미암아 믿음을 통해서입니다. 이것은 여러분에게서 난 것이 아니라 하나님의 선물입니다.",
        english: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—"
      },
      {
        id: 7,
        referenceKo: "로마서 1장 17절",
        referenceEn: "Romans 1:17",
        korean: "복음에는 하나님의 의가 나타나서 믿음으로 믿음에 이르게 하나니 기록된 바 오직 의인은 믿음으로 살리라 함과 같으니라",
        koreanModern: "복음에는 하나님의 의가 믿음으로 믿음에 이르게 하는 방식으로 나타나 있습니다. 성경에 기록된 대로 '의인은 믿음으로 살 것입니다.'",
        english: "For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last, just as it is written: \"The righteous will live by faith.\""
      },
      {
        id: 8,
        referenceKo: "갈라디아서 2장 20절",
        referenceEn: "Galatians 2:20",
        korean: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라 이제 내가 육체 가운데 사는 것은 나를 사랑하사 나를 위하여 자기 자신을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것이라",
        koreanModern: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 산 것이 아니요 오직 내 안에 그리스도께서 사신 것입니다. 이제 내가 육체 가운데 사는 것은 나를 사랑하사 나를 위하여 자기 몸을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것입니다.",
        english: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me."
      },
      {
        id: 9,
        referenceKo: "로마서 5장 1절",
        referenceEn: "Romans 5:1",
        korean: "그러므로 우리가 믿음으로 의롭다 하심을 받았으니 우리 주 예수 그리스도로 말미암아 하나님과 화평을 누리자",
        koreanModern: "그러므로 우리가 믿음으로 의롭다고 인정받았으니, 우리 주 예수 그리스도를 통해 하나님과 평화를 누립시다.",
        english: "Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ,"
      },
      {
        id: 10,
        referenceKo: "갈라디아서 3장 11절",
        referenceEn: "Galatians 3:11",
        korean: "또 하나님 앞에서 아무도 율법으로 말미암아 의롭게 되지 못할 것이 분명하니 이는 의인은 믿음으로 살리라 하였음이라",
        koreanModern: "또 하나님 앞에서 아무도 율법으로 말미암아 의롭게 되지 못할 것이 분명하니 이는 '의인은 믿음으로 살리라' 하였기 때문입니다.",
        english: "Clearly no one who relies on the law is justified before God, because \"The righteous will live by faith.\""
      },
      {
        id: 11,
        referenceKo: "마가복음 9장 23절",
        referenceEn: "Mark 9:23",
        korean: "예수께서 이르시되 할 수 있거든이 무슨 말이냐 믿는 자에게는 능히 하지 못할 일이 없느니라 하시니",
        koreanModern: "예수님께서 말씀하셨습니다. \"'하실 수 있으시거든'이라니, 무슨 말이냐? 믿는 사람에게는 모든 것이 가능하다.\"",
        english: "\"'If you can'?\" said Jesus. \"Everything is possible for one who believes.\""
      },
      {
        id: 12,
        referenceKo: "빌립보서 4장 13절",
        referenceEn: "Philippians 4:13",
        korean: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라",
        koreanModern: "나에게 능력 주시는 분 안에서 나는 모든 것을 할 수 있습니다.",
        english: "I can do all this through him who gives me strength."
      },
      {
        id: 13,
        referenceKo: "요한일서 5장 4절",
        referenceEn: "1 John 5:4",
        korean: "무릇 하나님께로부터 난 자마다 세상을 이기느니라 세상을 이기는 승리는 이것이니 우리의 믿음이니라",
        koreanModern: "하나님께로부터 난 사람은 누구나 세상을 이깁니다. 세상을 이기는 승리는 바로 이것입니다. 우리의 믿음입니다.",
        english: "for everyone born of God overcomes the world. This is the victory that has overcome the world, even our faith."
      },
      {
        id: 14,
        referenceKo: "마태복음 21장 22절",
        referenceEn: "Matthew 21:22",
        korean: "너희가 기도할 때에 무엇이든지 믿고 구하는 것은 다 받으리라 하시니",
        koreanModern: "너희가 믿고 기도하면 무엇이든지 받을 것이다.\"",
        english: "If you believe, you will receive whatever you ask for in prayer."
      },
      {
        id: 15,
        referenceKo: "마가복음 11장 24절",
        referenceEn: "Mark 11:24",
        korean: "그러므로 내가 너희에게 말하노니 무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라",
        koreanModern: "그러므로 내가 너희에게 말한다. 무엇이든지 기도하며 구하는 것은 이미 받은 줄로 믿어라. 그러면 그대로 이루어질 것이다.",
        english: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours."
      },
      {
        id: 16,
        referenceKo: "잠언 3장 5절",
        referenceEn: "Proverbs 3:5",
        korean: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라",
        english: "Trust in the Lord with all your heart and lean not on your own understanding;"
      },
      {
        id: 17,
        referenceKo: "잠언 3장 6절",
        referenceEn: "Proverbs 3:6",
        korean: "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
        english: "in all your ways submit to him, and he will make your paths straight."
      },
      {
        id: 18,
        referenceKo: "이사야 26장 3절",
        referenceEn: "Isaiah 26:3",
        korean: "주께서 심지가 견고한 자를 평강에 평강으로 지키시리니 이는 그가 주를 신뢰함이니이다",
        english: "You will keep in perfect peace those whose minds are steadfast, because they trust in you."
      },
      {
        id: 19,
        referenceKo: "시편 56편 3절",
        referenceEn: "Psalm 56:3",
        korean: "내가 두려워하는 날에는 내가 주를 의지하리이다",
        english: "When I am afraid, I put my trust in you."
      },
      {
        id: 20,
        referenceKo: "시편 62편 8절",
        referenceEn: "Psalm 62:8",
        korean: "백성들아 시시로 그를 의지하고 그의 앞에 마음을 토하라 하나님은 우리의 피난처시로다",
        english: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge."
      },
      {
        id: 21,
        referenceKo: "히브리서 12장 2절",
        referenceEn: "Hebrews 12:2",
        korean: "믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자 그는 그 앞에 있는 기쁨을 위하여 십자가를 참으사 부끄러움을 개의치 아니하시더니 하나님 보좌 우편에 앉으셨느니라",
        koreanModern: "믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자. 그분께서 그 앞에 있는 기쁨을 위하여 십자가를 참으사 부끄러움을 개의치 아니하시더니 하나님 보좌 우편에 앉으셨습니다.",
        english: "fixing our eyes on Jesus, the pioneer and perfecter of faith. For the joy set before him he endured the cross, scorning its shame, and sat down at the right hand of the throne of God."
      },
      {
        id: 22,
        referenceKo: "요한복음 11장 25-26절",
        referenceEn: "John 11:25-26",
        korean: "예수께서 이르시되 나는 부활이요 생명이니 나를 믿는 자는 죽어도 살겠고 무릇 살아서 나를 믿는 자는 영원히 죽지 아니하리니 이것을 네가 믿느냐",
        koreanModern: "예수님이 말씀하셨습니다. \"나는 부활이요 생명이다. 나를 믿는 사람은 죽어도 살 것이고, 살아서 나를 믿는 사람은 영원히 죽지 않을 것이다. 이것을 믿느냐?\"",
        english: "Jesus said to her, \"I am the resurrection and the life. The one who believes in me will live, even though they die; and whoever lives by faith in me will never die. Do you believe this?\""
      },
      {
        id: 23,
        referenceKo: "요한복음 14장 1절",
        referenceEn: "John 14:1",
        korean: "너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라",
        koreanModern: "너희는 마음에 걱정하지 마라. 하나님을 믿고 또 나를 믿어라.",
        english: "\"Do not let your hearts be troubled. You believe in God; believe also in me.\""
      },
      {
        id: 24,
        referenceKo: "요한복음 20장 29절",
        referenceEn: "John 20:29",
        korean: "예수께서 이르시되 너는 나를 본 고로 믿느냐 보지 못하고 믿는 자들은 복되도다 하시니라",
        koreanModern: "예수님께서 말씀하셨습니다. \"너는 나를 보았기 때문에 믿느냐? 보지 않고도 믿는 사람들은 복이 있다.\"",
        english: "Then Jesus told him, \"Because you have seen me, you have believed; blessed are those who have not seen and yet have believed.\""
      },
      {
        id: 25,
        referenceKo: "베드로전서 1장 8절",
        referenceEn: "1 Peter 1:8",
        korean: "예수를 너희가 보지 못하였으나 사랑하는도다 지금도 보지 못하나 믿고 말할 수 없는 영광스러운 즐거움으로 기뻐하니",
        koreanModern: "예수를 여러분이 보지 못하였으나 사랑합니다. 이제도 보지 못하나 믿고 말할 수 없는 영광스러운 즐거움으로 기뻐합니다.",
        english: "Though you have not seen him, you love him; and even though you do not see him now, you believe in him and are filled with an inexpressible and glorious joy,"
      },
      {
        id: 26,
        referenceKo: "야고보서 2장 17절",
        referenceEn: "James 2:17",
        korean: "이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라",
        koreanModern: "이와 같이 행함이 없는 믿음은 그 자체가 죽은 것입니다.",
        english: "In the same way, faith by itself, if it is not accompanied by action, is dead."
      },
      {
        id: 27,
        referenceKo: "야고보서 2장 26절",
        referenceEn: "James 2:26",
        korean: "영혼 없는 몸이 죽은 것 같이 행함이 없는 믿음은 죽은 것이니라",
        koreanModern: "영혼 없는 몸이 죽은 것 같이 행함이 없는 믿음은 죽은 것입니다.",
        english: "As the body without the spirit is dead, so faith without deeds is dead."
      },
      {
        id: 28,
        referenceKo: "베드로전서 1장 7절",
        referenceEn: "1 Peter 1:7",
        korean: "너희 믿음의 확실함은 불로 연단하여도 없어질 금보다 더 귀하여 예수 그리스도께서 나타나실 때에 칭찬과 영광과 존귀를 얻게 할 것이니라",
        koreanModern: "여러분의 믿음의 시련이 불로 연단하여도 없어질 금보다 더 귀하여 예수 그리스도께서 나타나실 때에 칭찬과 영광과 존귀를 얻게 하려 함입니다.",
        english: "These have come so that the proven genuineness of your faith—of greater worth than gold, which perishes even though refined by fire—may result in praise, glory and honor when Jesus Christ is revealed."
      },
      {
        id: 29,
        referenceKo: "야고보서 1장 3절",
        referenceEn: "James 1:3",
        korean: "이는 너희 믿음의 시련이 인내를 만들어 내는 줄 너희가 앎이라",
        koreanModern: "이는 여러분의 믿음의 시련이 인내를 만들어 내는 것을 여러분이 알기 때문입니다.",
        english: "because you know that the testing of your faith produces perseverance."
      },
      {
        id: 30,
        referenceKo: "고린도후서 5장 7절",
        referenceEn: "2 Corinthians 5:7",
        korean: "이는 우리가 믿음으로 행하고 보는 것으로 행하지 아니함이로라",
        koreanModern: "이는 우리가 믿음으로 행하고 보는 것으로 하지 아니함입니다.",
        english: "For we live by faith, not by sight."
      }
    ]
  },
  {
    key: "spirit",
    name: "성령",
    intro: {
      title: "오순절 기하성 영성 중심: 성령충만 30개 구절",
      heading: "서론: 30개 구절을 관통하는 '성령의 인류 구원 성공 스토리'",
      paragraphs: [
        "이 30개의 성경 구절은 무작위로 흩어진 말씀이 아니라, 인류를 구원하시고 승리하게 하시는 성령님의 거대하고 완벽한 '성공 스토리'입니다.",
        "이야기는 온 우주가 흑암과 혼돈에 갇혀 있던 태초(창 1:2)에서 시작됩니다. 하나님의 영은 그 어둠 속에서 생명을 창조해 내시며 인류 역사의 서막을 열었습니다. 이후 하나님은 무너진 인간들을 다시 세우기 위해 왕과 선지자들에게 성령을 부으셨습니다. 모세는 모든 백성이 영을 받기를 갈망했고(민 11:29), 다윗은 성령에 크게 감동하여 승리의 삶을 살았으며(삼상 16:13), 죄를 지었을 때는 성령이 떠나실까 봐 눈물로 침상을 적셨습니다(시 51:11). 성령님은 인간에게 지혜와 능력의 근원(사 11:2)이 되셨고, 돌처럼 굳은 마음에 순종의 영을 불어넣으시는 분(겔 36:27)이었습니다. 마침내 하나님은 구약의 문을 닫으며 선지자 요엘을 통해 \"마지막 때에 내가 내 영을 만민에게 부어주겠다\"(요엘 2:28)고 약속하셨고, 스가랴를 통해 인생의 모든 장애물은 \"오직 여호와의 영으로만 무너진다\"(슥 4:6)며 구약 역사 전반을 관통하는 승리의 공식을 선포하셨습니다.",
        "이 구약의 위대한 약속과 성공의 법칙은 신약 복음서에 이르러 예수 그리스도를 통해 마침내 '성취'됩니다. 세례 요한은 예수님이 물이 아닌 '성령과 불'로 세례를 주실 분이라 선포했고(마 3:11), 예수님은 하늘 아버지가 구하는 자에게 주시는 인류 최고의 선물이 곧 '성령'임을 선언하셨습니다(눅 11:13). 예수님은 우리가 하나님 나라에 들어가는 유일한 열쇠가 성령으로 거듭나는 것(요 3:5)이며, 참된 예배는 오직 영과 진리로만 가능하다(요 4:24)고 가르치셨습니다. 그리고 우리 인생의 목마름을 완전히 해결할 생수의 강(요 7:38-39)으로 성령을 소개하시며, 내가 떠나도 우리 곁을 영원히 떠나지 않고 모든 것을 가르치고 기억나게 하실 또 다른 위로자 '보혜사 성령님'(요 14:16, 요 14:26)을 약속하셨습니다. 그 진리의 성령님이 우리를 인생의 바른 방향으로 인도하실 것(요 16:13)이라는 보증과 함께, 예수님은 십자가와 부활의 사역을 완수하셨습니다.",
        "예수님이 승천하시며 \"오직 성령이 임하시면 권능을 받고 땅끝까지 증인이 되리라\"(행 1:8)고 하신 마지막 명령은, 오순절 마가다락방에서 '역사적 폭발'을 일으킵니다. 제자들이 다 성령의 충만함을 받고 방언으로 기도하기 시작했고(행 2:4), 베드로의 선포를 통해 회개하는 모든 자에게 성령이 선물로 임했습니다(행 2:38). 성령이 임하자 초대교회는 세상의 어떤 핍박과 박해 앞에서도 모여 기도하며 진동을 일으켰고, 더욱 담대히 말씀을 전했습니다(행 4:31). 이 성령의 불길은 유대인의 벽을 깨뜨리고 이방인 고넬료 가정에 차별 없이 내려앉았으며(행 10:44), 사도 바울의 안수를 통해 에베소와 전 세계 열방으로 뻗어 나갔습니다(행 19:6). 구약의 약속이 예수님을 통해 성취되고, 사도행전의 교회를 통해 온 세계에 폭발한 것입니다.",
        "이제 이 성공적인 성령의 역사는 오늘을 살아가는 우리 가정이 일상 속에서 누려야 할 '실전 신앙의 삶'으로 이어집니다. 우리는 내 안에 그리스도의 영이 계심으로 내가 진짜 하나님의 사람임을 확신하게 되었고(롬 8:9), 날마다 성령의 인도를 받는 하나님의 자녀가 되었습니다(롬 8:14). 우리가 연약하여 기도할 힘조차 없을 때 성령님이 우리 안에서 말할 수 없는 탄식으로 눈물 흘리며 중보해 주시기에(롬 8:26), 우리는 결코 무너지지 않습니다. 우리의 몸은 성령님이 계시는 거룩한 성전이 되었고(고전 6:19), 교회와 가정을 유익하게 할 신령한 은사(고전 12:7)들을 공급받았습니다. 이 은사를 바탕으로 우리는 가정생활 속에서 사랑과 온유와 절제라는 인격적인 '성령의 아홉 가지 열매'(갈 5:22-23)를 맺어갑니다. 그러므로 우리는 세상의 방탕한 문화에 취하지 않고 날마다 오직 성령으로 충만함을 받아야 하며(에베소서 5:18), 내 안의 성령의 불길이 꺼지지 않도록 늘 깨어 지켜내야 합니다(살전 5:19).",
        "결국 인류 구원의 거대한 드라마는 요한계시록의 마지막 선포로 찬란하게 완성됩니다. \"귀 있는 자는 성령이 교회들에게 하시는 말씀을 들을지어다\"(계 3:22). 창조의 시작부터 함께하셨던 성령님은 마지막 종말의 때를 살아가는 우리 믿음의 가족들에게 세상 소리에 흔들리지 말고 성령의 음성에 귀를 기울이라고 말씀하십니다. 이 음성에 순종하는 가정이 바로 태초부터 계획된 하나님의 구원 역사 속에서 최종 승리하는 '성공 스토리의 주인공'이 됩니다. 온 가족이 이 맥락을 가슴에 품고, 이제 하루에 한 구절씩 성령님의 심장 속으로 걸어 들어갑니다."
      ]
    },
    verses: [
      {
        id: 1,
        title: "창조의 성령",
        referenceKo: "창세기 1장 2절",
        referenceEn: "Genesis 1:2",
        korean: "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라",
        reason: "하나님의 영은 온 우주가 시작되기 전, 아무것도 없고 어두운 혼돈 속에서 생명을 일깨우고 창조하신 분입니다. 우리 인생과 가정에 예기치 못한 절망, 영적 혼돈, 공허함이 찾아왔을 때, 성령님이 임재하시면 새로운 회복과 기적의 역사가 시작된다는 사실을 확신하기 위해 이 말씀을 가장 먼저 알아야 합니다.",
        connection: "구약의 첫 장에서 혼돈의 수면 위를 운행하시며 질서와 생명을 부여하시던 창조의 성령님은, 신약 복음서인 요한복음 3장 5절에서 죽었던 우리 영혼을 말씀과 물로 새롭게 태어나게 하시는 '거듭남의 성령님' 사역으로 일직선 연결됩니다.",
        related: [
          { referenceKo: "요한복음 3장 5절", korean: "예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님의 나라에 들어갈 수 없느니라" }
        ],
        question: "오늘 우리 가족의 마음이나 삶의 영역 중 성령님의 창조적 터치가 필요한 '혼돈하고 공허한 부분'은 어디인가요?",
        prayer: "창조의 성령 하나님, 오늘 밤 우리 가정의 모든 영적 어둠과 공허를 물리쳐 주시고, 오직 성령의 새 생명과 질서로 가득 채워 주옵소서. 예수님의 이름으로 기도합니다. 아멘",
        koreanModern: "땅은 형체가 없고 텅 비어 있었으며, 어둠이 깊은 물 위를 덮고 있었습니다. 그리고 하나님의 영이 그 물 위를 움직이고 계셨습니다.",
        english: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters."
      },
      {
        id: 2,
        title: "만민에게 임할 영",
        referenceKo: "민수기 11장 29절",
        referenceEn: "Numbers 11:29",
        korean: "모세가 그에게 이르되 네가 나를 두고 시기하느냐 여호와께서 그의 영을 그의 모든 백성에게 주사 다 예언자가 되게 하시기를 원하노라",
        reason: "모세는 위대한 영적 리더십이나 성령의 은사가 결코 특정 개인에게만 독점되기를 원하지 않았고, 하나님의 모든 백성이 성령을 받아 동역하기를 갈망했습니다. 참된 영적 승리는 나 혼자가 아니라 온 가족이 함께 성령 안에서 같은 은혜를 누릴 때 온다는 비전을 품기 위해 알아야 합니다.",
        connection: "이 모세의 간절한 갈망과 예언적 비전은 구약의 요엘 선지자(요엘 2:28)를 거쳐 \"만민에게 내 영을 부어주겠다\"는 하나님의 공식 약속으로 발전하며, 최종적으로 사도행전 2장 4절 오순절 마가다락방에서 모인 모든 백성이 성령충만을 받음으로 완벽하게 성취됩니다.",
        related: [
          { referenceKo: "요엘 2장 28절", korean: "그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며 너희 늙은이는 꿈을 꾸며 너희 젊은이는 이상을 볼 것이며" },
          { referenceKo: "사도행전 2장 4절", korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라" }
        ],
        question: "우리 가족 중 누구 한 사람만 은혜받는 것이 아니라, 온 가족이 다 함께 성령을 받아 동역하는 것은 왜 중요할까요?",
        prayer: "모든 자녀에게 영을 주길 원하시는 주님, 우리 부모와 자녀들 모두에게 동일한 성령의 불을 내려주사 가정 안에서 주님의 든든한 영적 동역자가 되게 하옵소서. 아멘",
        koreanModern: "모세가 여호수아에게 말했다. \"넌 나 때문에 질 나? 차라리 하나님이 그 영을 모든 백성한테 주셔서 다들 선지자가 되면 좋겠어.\"",
        english: "But Moses replied, \"Are you jealous for my sake? I wish that all the LORD's people were prophets and that the LORD would put his Spirit on them!\""
      },
      {
        id: 3,
        title: "왕에게 임한 영",
        referenceKo: "사무엘상 16장 13절",
        referenceEn: "1 Samuel 16:13",
        korean: "사무엘이 기름 뿔병을 가져다가 그의 형제 중에서 그에게 부었더니 이 날 이후로 다윗이 여호와의 영에게 크게 감동되니라 사무엘이 떠나서 라마로 가니라",
        reason: "소년 다윗이 이스라엘의 왕으로 기름 부음을 받았을 때, 여호와의 영이 그에게 크게 임하셨습니다. 우리가 세상에서 위대한 하나님의 일들을 감당하고 승리하는 비결은 인간의 자질, 외모, 학벌이 아니라 오직 성령의 강력한 감동하심에 있음을 뼈저리게 깨닫기 위해 알아야 합니다.",
        connection: "다윗에게 임했던 이 강력한 '기름 부음의 영'은 구약 이사야 선지자가 예언한 메시아의 영(이사야 11:2)의 그림자이며, 훗날 마태복음 3장 11절에서 예수 그리스도께서 우리에게 주시겠다고 선포하신 '성령과 불의 세례'로 이어지는 거룩한 모형이 됩니다.",
        related: [
          { referenceKo: "이사야 11장 2절", korean: "그의 위에 여호와의 영 곧 지혜와 총명의 영이요 모략과 재능의 영이요 지식과 여호와를 경외하는 영이 강림하시리니" },
          { referenceKo: "마태복음 3장 11절", korean: "나는 너희로 회개하게 하기 위하여 물로 세례를 베풀거니와 내 뒤에 오시는 이는 나보다 능력이 많으시니 나는 그의 신을 들기도 감당하지 못하겠노라 그는 성령과 불로 너희에게 세례를 베푸실 것이요" }
        ],
        question: "다윗처럼 날마다 성령님께 '크게 감동되는 삶'을 살기 위해 내가 오늘 내려놓아야 할 내 생각이나 고집은 무엇인가요?",
        prayer: "다윗을 크게 감동하셨던 여호와의 영이시여, 오늘 밤 우리 자녀들의 심령 위에 임하사 세상의 어떤 시험과 골리앗 앞에서도 성령의 능력으로 당당히 승리하게 하옵소서. 아멘.",
        koreanModern: "사무엘이 기름 뿔을 들어 그의 형제들 앞에서 그에게 부었다. 그날 이후로 다윗은 하나님의 영에 크게 감동받았다. 사무엘은 그곳을 떠나 라마로 돌아갔다.",
        english: "So Samuel took the horn of oil and anointed him in the presence of his brothers, and from that day on the Spirit of the LORD came powerfully upon David. Samuel then went to Ramah."
      },
      {
        id: 4,
        title: "성령을 거두지 마소서",
        referenceKo: "시편 51편 11절",
        referenceEn: "Psalm 51:11",
        korean: "나를 주 앞에서 쫓아내지 마시며 주의 성령을 내게서 거두지 마소서",
        reason: "다윗은 끔찍한 죄를 지은 후 왕위나 물질, 건강을 잃는 것보다 하나님의 성령이 자신에게서 떠나가시는 것을 가장 두려워하며 눈물로 침상을 적셨습니다. 성도에게 있어 인생 최고의 자산은 세상의 성공이 아니라 내 안에 계신 성령님과의 친밀한 관계임을 뼈에 새기기 위해 알아야 합니다.",
        connection: "구약 시대에는 성령이 인간에게 임했다가도 죄를 지으면 떠나시곤 했지만(사울왕의 전례), 다윗의 이 간절한 회개 기도는 요한복음 14장 16절에서 예수님이 약속하신 '우리 속에 영원토록 거하시며 절대 떠나지 않으시는 보혜사 성령님'의 은혜가 얼마나 압도적인 축복인지 극적으로 대조하여 보여줍니다.",
        related: [
          { referenceKo: "요한복음 14장 16절", korean: "내가 아버지께 구하겠으니 그가 또 다른 보혜사를 너희에게 주사 영원토록 너희와 함께 있게 하리니" }
        ],
        question: "나는 매일의 삶 속에서 눈에 보이는 물질적 축복보다 내 안에 계신 성령님과의 친밀함을 더 소중히 여기고 있나요?",
        prayer: "정결함을 기뻐하시는 주님, 우리 가정을 보혈로 씻어 가사 늘 정결케 하시고, 어떤 곤경 속에서도 주의 성령을 우리에게서 거두지 마시며 늘 동행하여 주옵소서. 아멘.",
        koreanModern: "나를 주 앞에서 쫓아내지 마시며 주의 성신을 내게서 거두지 마소서",
        english: "Do not cast me from your presence or take your Holy Spirit from me."
      },
      {
        id: 5,
        title: "지혜와 총명의 영",
        referenceKo: "이사야 11장 2절",
        referenceEn: "Isaiah 11:2",
        korean: "그의 위에 여호와의 영 곧 지혜와 총명의 영이요 모략과 재능의 영이요 지식과 여호와를 경외하는 영이 강림하시리니",
        reason: "성령님은 단순히 감정적인 뜨거움이나 신비로운 현상에만 머무시는 분이 아닙니다. 성령님이 임하시면 우리의 이성과 삶에 지혜, 총명, 모략, 재능, 지식, 그리고 하나님을 경외하는 거룩한 능력이 부어집니다. 자녀들의 학업과 부모의 생업, 삶의 모든 결정에 성령의 지혜가 절대적임을 믿기 위해 알아야 합니다.",
        connection: "장차 오실 메시아(예수 그리스도) 위에 임할 성령의 6가지 신령한 재능과 권능은, 신약 서신서인 고린도전서 12장 7절에서 교회의 유익과 성도들의 삶의 승리를 위해 성령께서 각 사람에게 나누어 주시는 '성령의 은사'의 영적 뿌리가 됩니다.",
        related: [
          { referenceKo: "고린도전서 12장 7절", korean: "각 사람에게 성령을 나타내심은 유익하게 하려 하심이라" }
        ],
        question: "오늘 나에게, 혹은 우리 가족에게 가장 시급하게 필요한 성령님의 성품(지혜, 모략, 재능, 하나님을 경외함 등)은 무엇인가요?",
        prayer: "지혜와 총명의 영이신 성령님, 우리 자녀들에게 명철과 재능을 주시고 온 가족에게 하나님을 깊이 경외하는 지혜의 근본을 부어 주옵소서. 아멘.",
        koreanModern: "여호와의 신 곧 지혜와 총명의 신이요 모략과 재능의 신이요 지식과 여호와를 경외하는 신이 그 위에 강림하시리니",
        english: "The Spirit of the LORD will rest on him— the Spirit of wisdom and of understanding, the Spirit of counsel and of might, the Spirit of the knowledge and fear of the LORD—"
      },
      {
        id: 6,
        title: "순종하게 하시는 영",
        referenceKo: "에스겔 36장 27절",
        referenceEn: "Ezekiel 36:27",
        korean: "또 내 영을 너희 속에 두어 너희로 내 율례를 행하게 하리니 너희가 내 규례를 지켜 행할지라",
        reason: "내 인간적인 의지와 결단, 노력만으로는 하나님의 말씀대로 살아가기가 완전히 불가능합니다. 오직 하나님의 영이 내 마음 중심에 완전히 들어오셔서 나를 사로잡으셔야만 비로소 기쁨으로 말씀에 순종하는 영적 체질로 변화될 수 있음을 고백하기 위해 이 말씀을 알아야 합니다.",
        connection: "외적인 돌판에 새겨진 율법을 지키지 못해 무너지던 백성들에게 '내 영을 너희 속에 두겠다'고 선포하신 이 새 언약의 성령 약속은, 신약 복음서 요한복음 3장 5절의 '성령으로 다시 태어남(거듭남)'과 서신서 로마서 8장 14절의 '하나님의 영으로 직접 인도함을 받는 자녀의 삶'으로 성취됩니다.",
        related: [
          { referenceKo: "요한복음 3장 5절", korean: "예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님의 나라에 들어갈 수 없느니라" },
          { referenceKo: "로마서 8장 14절", korean: "무릇 하나님의 영으로 인도함을 받는 사람은 곧 하나님의 아들이라" }
        ],
        question: "내 힘과 고집으로는 도저히 지키기 힘들었던 하나님의 말씀이나 용서가 있었나요? 성령님이 내 마음에 들어오시면 그것이 어떻게 가능해질까요?",
        prayer: "내 영을 속에 두겠다고 약속하신 주님, 내 딱딱한 고집을 꺾어주시고 성령의 능력으로 주님의 모든 말씀에 기쁘게 순종하는 복된 가정이 되게 하옵소서. 아멘",
        koreanModern: "또 내 신을 너희 속에 두어 너희로 내 율례를 행하게 하리니 너희가 내 규례를 지켜 행할지라",
        english: "And I will put my Spirit in you and move you to follow my decrees and be careful to keep my laws."
      },
      {
        id: 7,
        title: "만민에게 부어주실 영",
        referenceKo: "요엘 2장 28절",
        referenceEn: "Joel 2:28",
        korean: "그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며 너희 늙은이는 꿈을 꾸며 너희 젊은이는 이상을 볼 것이며",
        reason: "하나님은 구약의 특별한 선지자나 왕에게만 영을 주시던 시대를 끝내고, 신분과 성별, 나이의 벽을 완전히 허물어 자녀, 늙은이, 젊은이 모든 세대에게 성령을 폭포수처럼 부어주시겠다고 선언하셨습니다. 우리 가정이 세대 갈등을 넘어 성령 안에서 하나의 거룩한 비전을 공유하기 위해 알아야 합니다.",
        connection: "오순절 영성의 가장 강력한 기초가 되는 이 구약의 예언은 사도행전 2장 4절 오순절 당일 제자들에게 성령이 불처럼 강림했을 때, 사도 베드로가 군중들 앞에서 설교(사도행전 2장 17절)하며 \"이것이 바로 요엘 선지자를 통해 말씀하신 성취다\"라고 그대로 인용한 완벽한 마스터 짝 구절입니다.",
        related: [
          { referenceKo: "사도행전 2장 4절", korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라" },
          { referenceKo: "사도행전 2장 17절", korean: "하나님이 말씀하시기를 말세에 내가 내 영을 모든 육체에 부어 주리니 너희의 자녀들은 예언할 것이요 너희의 젊은이들은 환상을 보고 너희의 늙은이들은 꿈을 꾸리라" }
        ],
        question: "성령님이 우리 자녀들에게 보여주실 장래 일, 그리고 부모님에게 주실 영적인 꿈과 이상은 무엇일까요?",
        prayer: "만민에게 영을 부어주시는 주님, 우리 가정이 세상의 썩어질 유행을 따르지 않게 하시고, 성령이 주시는 하늘의 환상과 비전을 품고 전진하는 믿음의 세대가 되게 하옵소서. 아멘.",
        koreanModern: "'그 후에 내가 내 영을 모든 사람에게 부어 주겠다. 너희 아들딸들이 예언할 것이며, 너희 노인들은 꿈을 꾸고, 너희 젊은이들은 환상을 볼 것이다.'",
        english: "And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions."
      },
      {
        id: 8,
        title: "오직 나의 영으로",
        referenceKo: "스가랴 4장 6절",
        referenceEn: "Zechariah 4:6",
        korean: "그가 내게 대답하여 이르되 여호와께서 스룹바벨에게 하신 말씀이 이러하니라 만군의 여호와께서 말씀하시되 이는 힘으로 되지 아니하며 능력으로 되지 아니하고 오직 나의 영으로 되느니라",
        reason: "인간이 가진 물질의 힘, 군사력, 세상의 권력, 영리한 인맥만으로는 영적인 하나님의 일과 내면의 참된 평안을 절대 이룰 수 없습니다. 우리 인생을 가로막는 거대한 장애물(큰 산)은 오직 하나님의 성령의 권능으로만 무너져 평지가 됨을 확신하기 위해 알아야 합니다.",
        connection: "\"인간의 힘과 능력이 아닌 오직 여호와의 영으로만 된다\"는 이 구약의 위대한 승리 공식은, 신약 복음서의 마지막 장에서 제자들에게 인간의 연약함을 깨뜨릴 하늘의 거룩한 권능(Power)을 위로부터 입혀주시겠다고 약속하신 사도행전 1장 8절의 말씀과 완벽하게 맞닿아 있습니다.",
        related: [
          { referenceKo: "사도행전 1장 8절", korean: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라" }
        ],
        question: "최근 내 생각과 내 지식, 인간적인 몸부림으로만 해결하려고 하다가 지치고 낙심했던 문제는 무엇인가요?",
        prayer: "만군의 여호와 하나님, 내 힘과 지혜를 의지했던 교만을 회개하오니, 오직 주의 성령의 권능을 부어주사 내 삶의 가로막힌 큰 산들이 평지가 되는 기적을 보게 하옵소서. 아멘.",
        koreanModern: "그가 내게 말했습니다. '이것이 여호와께서 스룹바벨에게 하시는 말씀이다. 만군의 여호와께서 말씀하십니다. 힘으로 되지 아니하며, 능력으로 되지 아니하고, 오직 나의 영으로 된다.'",
        english: "So he said to me, \"This is the word of the LORD to Zerubbabel: 'Not by might nor by power, but by my Spirit,' says the LORD Almighty.\""
      },
      {
        id: 9,
        title: "성령과 불세례",
        referenceKo: "마태복음 3장 11절",
        referenceEn: "Matthew 3:11",
        korean: "나는 너희로 회개하게 하기 위하여 물로 세례를 베풀거니와 내 뒤에 오시는 이는 나보다 능력이 많으시니 나는 그의 신을 들기도 감당하지 못하겠노라 그는 성령과 불로 너희에게 세례를 베푸실 것이요",
        reason: "예수님은 단순히 도덕적인 훈계나 착한 가르침만 주러 오신 분이 아닙니다. 예수님은 우리의 냉랭해진 가슴을 뜨겁게 태우고 심령의 온갖 추한 죄악과 영적 게으름을 완전히 소멸해 버리는 강력한 '성령과 불의 세례'를 던지러 오신 분임을 깨닫고 그 불을 사모하기 위해 알아야 합니다.",
        connection: "세례 요한이 예고한 이 뜨거운 '성령과 불세례'의 약속은, 사도행전 2장 3절에서 오순절 마가다락방에 모여 기도하던 성도들에게 '마치 불의 혀처럼 갈라지는 것들'이 눈에 보이게 임함으로써 인류 역사 속에 역사적으로 폭발하며 실현됩니다.",
        related: [
          { referenceKo: "사도행전 2장 3절", korean: "마치 불의 혀처럼 갈라지는 것들이 그들에게 보여 각 사람 위에 하나씩 임하여 있더니" }
        ],
        question: "내 신앙과 주님을 향한 첫사랑이 미지근하게 식어버리지는 않았나요? 성령의 불세례가 임하면 내 마음에 어떤 변화가 일어날까요?",
        prayer: "성령과 불로 세례를 베푸시는 예수님, 오늘 밤 우리 가족 한 사람 한 사람의 식어진 심령 위에 성령의 불을 내려주사 주님을 향한 뜨거운 영적 열정을 불일듯 회복시켜 주옵소서. 아멘.",
        koreanModern: "나는 회개를 위해 너희에게 물로 세례를 준다. 그러나 내 뒤에 오시는 분은 나보다 훨씬 능력이 있으시다. 나는 그분의 신발을 들어드릴 자격도 없다. 그분은 성령과 불로 너희에게 세례를 주실 것이다.",
        english: "I baptize you with water for repentance. But after me comes one who is more powerful than I, whose sandals I am not worthy to carry. He will baptize you with the Holy Spirit and fire."
      },
      {
        id: 10,
        title: "구하는 자에게 주실 성령",
        referenceKo: "누가복음 11장 13절",
        referenceEn: "Luke 11:13",
        korean: "너희가 악할지라도 좋은 것을 자식에게 줄 줄 알거든 하물며 너희 하늘 아버지께서 구하는 자에게 성령을 주시지 않겠느냐 하시니라",
        reason: "하나님은 구하는 자녀에게 언제나 세상에서 가장 좋은 것을 아낌없이 부어주시는 좋으신 하늘 아버지이십니다. 온 우주를 가지신 하나님 아버지가 보시기에 인간에게 줄 수 있는 최고의 선물이 다름 아닌 '성령님'이시기에, 우리는 매일 밤낮으로 성령충만을 최우선으로 구해야 함을 깨닫기 위해 알아야 합니다.",
        connection: "구하는 자에게 성령을 주시겠다는 예수님의 이 보증은, 사도행전 1장 14절에서 제자들이 약속의 성령을 받기 위해 마가다락방에 모여 '오로지 기도에 힘썼던' 강력한 행동의 근거가 되며, 회개하고 구하면 성령을 선물로 주신다는 사도행전 2장 38절의 베드로의 선포와 일맥상통합니다.",
        related: [
          { referenceKo: "사도행전 1장 14절", korean: "여자들과 예수의 어머니 마리아와 예수의 아우들과 더불어 마음을 같이하여 오로지 기도에 힘쓰더라" },
          { referenceKo: "사도행전 2장 38절", korean: "베드로가 이르되 너희가 회개하여 각각 예수 그리스도의 이름으로 세례를 받고 죄 사함을 받으라 그리하면 성령의 선물을 받으리니" }
        ],
        question: "나는 매일 기도의 자리에서 눈앞의 육적인 쓸 것만을 구하고 있나요, 아니면 가장 좋은 선물인 성령충만을 구하고 있나요?",
        prayer: "좋으신 하늘 아버지, 악한 자도 자식에게 좋은 것을 줄 줄 아는데 하물며 구하는 자에게 성령을 안 주시겠습니까. 지금 이 시간 갈급한 우리 가정 위에 성령을 가득 부어주옵소서. 아멘.",
        koreanModern: "너희가 악할지라도 좋은 것을 자녀에게 줄 줄 알거든, 하늘 아버지께서 구하는 사람들에게 성령을 주시지 않겠느냐?\"",
        english: "If you then, though you are evil, know how to give good gifts to your children, how much more will your Father in heaven give the Holy Spirit to those who ask him!"
      },
      {
        id: 11,
        title: "물과 성령으로 거듭남",
        referenceKo: "요한복음 3장 5절",
        referenceEn: "John 3:5",
        korean: "예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님의 나라에 들어갈 수 없느니라",
        reason: "도덕적으로 아무리 착하고 훌륭하게 살아도 인간의 육체와 혈통으로는 결코 하나님 나라에 들어갈 수 없습니다. 오직 성령께서 우리 영혼을 완전히 씻기시고 하나님 수준의 새로운 생명으로 재창조(거듭남)해 주셔야만 구원받은 자녀가 됨을 확신하기 위해 알아야 합니다.",
        connection: "성령으로 나야만 한다는 예수님의 이 엄중한 선언은, 에스겔 36장 27절에 기록된 '하나님의 영을 인간 내면에 두어 새사람이 되게 하겠다'는 새 언약 예언의 완전한 성취이자 짝이며, 서신서 로마서 8장 9절의 '그리스도의 영이 없으면 그리스도의 사람이 아니다'라는 정체성 선언의 뼈대가 됩니다.",
        related: [
          { referenceKo: "에스겔 36장 27절", korean: "또 내 영을 너희 속에 두어 너희로 내 율례를 행하게 하리니 너희가 내 규례를 지켜 행할지라" },
          { referenceKo: "로마서 8장 9절", korean: "만일 너희 속에 하나님의 영이 거하시면 너희가 육신에 있지 아니하고 영에 있나니 누구든지 그리스도의 영이 없으면 그리스도의 사람이 아니라" }
        ],
        question: "내가 예수님을 나의 구주로 믿고 고백하는 이 구원의 기적이, 내 지혜가 아닌 오직 성령님의 거듭나게 하시는 역사임을 확신하나요?",
        prayer: "물과 성령으로 우리를 거듭나게 하신 주님, 우리 자녀들 단 한 사람도 낙오 없이 성령으로 거듭나 하나님 나라의 백성으로 든든히 서가게 하옵소서. 아멘.",
        koreanModern: "예수께서 대답하셨습니다. '진실로 진실로 말합니다. 사람이 물과 성령으로 나지 않으면 하나님의 나라에 들어갈 수 없습니다.",
        english: "Jesus answered, \"Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit."
      },
      {
        id: 12,
        title: "영과 진리의 예배",
        referenceKo: "요한복음 4장 24절",
        referenceEn: "John 4:24",
        korean: "하나님은 영이시니 예배하는 자가 영과 진리로 예배할지니라",
        reason: "예배는 인간의 개인적인 감정이나 외적인 형식, 인간이 만든 화려한 프로그램으로 드리는 것이 아닙니다. 육체가 없으신 영이신 하나님께 드리는 예배는 오직 하나님의 성령의 감동하심을 따라 진리의 말씀 안에서 드려야만 하나님이 기쁘게 받으시는 참된 예배가 됨을 배우기 위해 알아야 합니다.",
        connection: "영과 진리로 드리는 예배의 가르침은, 신약 서신서 빌립보서 3장 3절의 '하나님의 성령으로 봉사(예배)하며 그리스도 예수를 자랑하고 육체를 신뢰하지 아니하는' 참된 성도의 가치관으로 연결되며, 나아가 요한계시록에 등장하는 천상 교회의 영광스러운 예배의 모델이 됩니다.",
        related: [
          { referenceKo: "빌립보서 3장 3절", korean: "하나님의 성령으로 봉사하며 그리스도 예수로 자랑하고 육체를 신뢰하지 아니하는 우리가 곧 할례파라" }
        ],
        question: "오늘 우리가 모여 드리는 이 저녁 가정예배는 의무적이고 형식적인가요, 아니면 성령님이 소통하시는 영적인 예배인가요?",
        prayer: "영이신 하나님 아버지, 우리 가족이 매일 드리는 예배가 육신의 껍데기를 벗게 하시고, 오직 진리의 말씀과 성령의 감동이 파도치는 살아있는 예배가 되게 하옵소서. 아멘.",
        koreanModern: "하나님은 영이십니다. 그러므로 그분께 예배하는 사람들은 영과 진리로 예배해야 합니다.\"",
        english: "God is spirit, and his worshipers must worship in the Spirit and in truth."
      },
      {
        id: 13,
        title: "생수의 강 같은 성령",
        referenceKo: "요한복음 7장 38-39절",
        referenceEn: "John 7:38-39",
        korean: "나를 믿는 자는 성경에 이름과 같이 그 배에서 생수의 강이 흘러나오리라 하시니 이는 그를 믿는 자들이 받을 성령을 가리켜 말씀하신 것이라 (예수께서 아직 영광을 받지 않으셨으므로 성령이 아직 그들에게 계시지 아니하시더라)",
        reason: "세상이 주는 일시적인 쾌락과 물질은 마실수록 더 타들어 가는 갈증을 주지만, 예수님이 주시는 성령은 우리 내면 깊은 곳(배)에서부터 마르지 않는 생수의 강처럼 영원한 기쁨과 평안을 솟구쳐 오르게 하십니다. 내면의 영적 고갈을 해결할 유일한 비결을 알기 위해 알아야 합니다.",
        connection: "믿는 자의 배에서 생수의 강이 흘러나올 것이라는 예수님의 선포는, 이사야 44장 3절(내가 목마른 자에게 물을 주며)과 에스겔 47장에서 성전 문지방을 통해 흘러나와 온 땅을 살리던 생수 환상의 영적 성취이며, 사도행전의 은혜의 폭발로 직결됩니다.",
        related: [
          { referenceKo: "이사야 44장 3절", korean: "나는 목마른 자에게 물을 주며 마른 땅에 시내가 흐르게 하며 나의 영을 네 자손에게, 나의 복을 네 후손에게 부어 주리니" }
        ],
        question: "내 마음에 짜증과 메마름, 불평이 가득할 때, 내 안의 생수의 강이신 성령님을 어떻게 다시 가동해야 할까요?",
        prayer: "목마른 심령을 시원케 하시는 주님, 우리 가족의 마음 중심에서 성령의 생수의 강이 날마다 넘쳐나게 하사, 가정과 일터의 메마른 땅을 살려내게 하옵소서. 아멘.",
        koreanModern: "나를 믿는 사람은 성경에 기록된 대로 그 배에서 생수의 강들이 흘러나올 것이다.\" 이것은 그분을 믿는 사람들이 받을 성령을 가리켜 말씀하신 것입니다. 예수님께서 아직 영광을 받지 않으셨기 때문에 성령이 아직 오지 않으셨습니다.",
        english: "Whoever believes in me, as Scripture has said, rivers of living water will flow from within them. By this he meant the Spirit, whom those who believed in him were later to receive. Up to that time the Spirit had not been given, since Jesus had not yet been glorified."
      },
      {
        id: 14,
        title: "가르치고 생각나게 하시는 보혜사",
        referenceKo: "요한복음 14장 26절",
        referenceEn: "John 14:26",
        korean: "보혜사 곧 아버지께서 내 이름으로 보내실 성령 그가 너희에게 모든 것을 가르치고 내가 너희에게 말한 모든 것을 생각나게 하리라",
        reason: "성령님은 멀리 계신 무서운 신이 아니라, 내 곁에서 나를 변호하고 도우시며 위로해 주시는 '보혜사'이십니다. 영적 침체나 극심한 위기가 찾아와도 내 힘으로 견디는 것이 아니라 성령님이 하나님의 말씀을 정확한 순간에 기억나게 하시고 깨닫게 하심으로 승리할 수 있음을 믿기 위해 알아야 합니다.",
        connection: "성도들을 친히 가르치고 예수의 말씀을 생각나게 하시는 보혜사 성령님의 사역은, 요한복음 16장 13절의 '진리 가운데로 우리를 인도하시는 사역'으로 심화되며, 훗날 사도들이 폭력적인 박해 속에서도 당당하게 말씀을 선포했던 사도행전의 지혜의 근원이 됩니다.",
        related: [
          { referenceKo: "요한복음 16장 13절", korean: "그러나 진리의 성령이 오시면 그가 너희를 모든 진리 가운데로 인도하시리니 그가 스스로 말하지 않고 오직 들은 것을 말하며 장래 일을 너희에게 알리시리라" }
        ],
        question: "인생의 중대한 선택이나 위기 앞에서 성령님이 내 생각 속에 말씀을 떠올려 주시거나 가르쳐 주셨던 경험이 있나요?",
        prayer: "내 곁에서 도우시는 보혜사 성령님, 매일의 삶 속에서 주님의 귀한 말씀을 생각나게 하시고, 우리가 좌로나 우로나 치우치지 않도록 친히 바른길을 가르쳐 인도해 주옵소서. 아멘.",
        koreanModern: "그러나 돕는 분, 곧 아버지께서 내 이름으로 보내실 성령께서 너희에게 모든 것을 가르치시고, 내가 너희에게 말한 모든 것을 기억나게 하실 것이다.",
        english: "But the Advocate, the Holy Spirit, whom the Father will send in my name, will teach you all things and will remind you of everything I have said to you."
      },
      {
        id: 15,
        title: "진리 가운데로 인도하시는 성령",
        referenceKo: "요한복음 16장 13절",
        referenceEn: "John 16:13",
        korean: "그러나 진리의 성령이 오시면 그가 너희를 모든 진리 가운데로 인도하시리니 그가 스스로 말하지 않고 오직 들은 것을 말하며 장래 일을 너희에게 알리시리라",
        reason: "세상에는 수많은 거짓, 유혹, 영혼을 좀먹는 가짜 가치관들이 넘쳐납니다. 오직 진리의 영이신 성령님이 우리를 붙잡아 주셔야만 자녀들이 탈선하지 않고 인생의 참된 방향과 장래의 거룩한 비전을 정확히 발견할 수 있기에 이 말씀을 알아야 합니다.",
        connection: "진리 가운데로 우리를 인도하시며 장래 일을 알리시겠다는 약속은, 요엘 2장 28절에서 예고하신 \"너희 자녀들이 장래 일을 말할 것이요\"의 완전한 실현이며, 신약 서신서 로마서 8장 14절의 '하나님의 영으로 인도함을 받는 사람'의 실제적인 삶의 원리가 됩니다.",
        related: [
          { referenceKo: "요엘 2장 28절", korean: "그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며 너희 늙은이는 꿈을 꾸며 너희 젊은이는 이상을 볼 것이며" },
          { referenceKo: "로마서 8장 14절", korean: "무릇 하나님의 영으로 인도함을 받는 사람은 곧 하나님의 아들이라" }
        ],
        question: "거짓과 유혹이 판치는 세상에서 우리 자녀들이 진리의 성령님의 눈으로 세상을 분별하려면 매일 무엇을 훈련해야 할까요?",
        prayer: "진리의 성령님, 세상의 화려하고 거짓된 유혹에 우리 가족이 흔들리지 않게 하시고, 오직 진리이신 예수님의 길로만 걷도록 우리의 장래와 발걸음을 인도하옵소서. 아멘.",
        koreanModern: "그러나 진리의 영이 오시면, 그분이 너희를 모든 진리로 인도하실 것이다. 그분은 스스로 말씀하시지 않고, 듣는 것만 말씀하실 것이다. 그리고 앞으로 일어날 일들을 너희에게 알려 주실 것이다.",
        english: "But when he, the Spirit of truth, comes, he will guide you into all the truth. He will not speak on his own; he will speak only what he hears, and he will tell you what is yet to come."
      },
      {
        id: 16,
        title: "성령의 권능과 증인의 삶",
        referenceKo: "사도행전 1장 8절",
        referenceEn: "Acts 1:8",
        korean: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라",
        reason: "오순절 영성의 기둥과 같은 핵심 말씀입니다. 성령충만은 단순히 내 개인의 감정적 만족이나 위로에 머무는 것이 아닙니다. 성령님이 주시는 충만함의 본질은 세상에 담대히 나가 예수 그리스도의 살아계심을 나타내는 위대한 영적 '권능(Power)'을 소유하는 것임을 명심하기 위해 알아야 합니다.",
        connection: "위로부터 임하는 성령의 권능으로 증인이 되리라는 예수님의 유언은, 스가랴 4장 6절(오직 나의 영으로 되느니라)의 선포가 신약의 성도들에게 어떻게 역사적으로 구현되는지 보여주는 열쇠이며, 이어지는 사도행전 2장의 마가다락방 성령강림 사건의 직접적인 도화선이 됩니다.",
        related: [
          { referenceKo: "스가랴 4장 6절", korean: "그가 내게 대답하여 이르되 여호와께서 스룹바벨에게 하신 말씀이 이러하니라 만군의 여호와께서 말씀하시되 이는 힘으로 되지 아니하며 능력으로 되지 아니하고 오직 나의 영으로 되느니라" }
        ],
        question: "성령님이 내게 주신 보이지 않는 권능과 담대함은 내가 속한 학교나 일터에서 어떻게 '예수님의 증인'의 삶으로 나타나고 있나요?",
        prayer: "주여, 우리 가정에 약속하신 성령의 권능을 부어 주옵소서! 말에만 머무는 나약한 신앙이 아니라, 삶의 현장에서 예수 그리스도의 살아계심을 증명하는 강력한 증인의 가문이 되게 하옵소서. 아멘.",
        koreanModern: "오직 성령이 여러분에게 임하시면 여러분은 능력을 받을 것입니다. 그리고 예루살렘과 온 유대와 사마리아, 그리고 땅 끝까지 이르러 내 증인이 될 것입니다.\"",
        english: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth."
      },
      {
        id: 17,
        title: "오순절 성령충만과 방언",
        referenceKo: "사도행전 2장 4절",
        referenceEn: "Acts 2:4",
        korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라",
        reason: "약속을 믿고 전혀 기도에 힘쓰던 120명의 성도에게 성령이 마침내 임하셨을 때, 그들은 예외 없이 '다' 성령의 충만함을 받았고 성령의 말하게 하심을 따라 방언으로 기도하기 시작했습니다. 성령충만이 가져오는 외적인 표적과 하늘의 강력한 기도의 도구를 온 가족이 사모하기 위해 알아야 합니다.",
        connection: "이 구절은 요엘 2장 28절의 '만민에게 부어주겠다'는 약속과 마태복음 3장 11절의 '성령과 불세례' 예언이 인류 역사 한복판에 폭발하며 신약 교회를 탄생시킨 기념비적인 구절이며, 사도행전 19장 6절의 에베소 성령 사역으로 계승됩니다.",
        related: [
          { referenceKo: "요엘 2장 28절", korean: "그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며 너희 늙은이는 꿈을 꾸며 너희 젊은이는 이상을 볼 것이며" },
          { referenceKo: "마태복음 3장 11절", korean: "나는 너희로 회개하게 하기 위하여 물로 세례를 베풀거니와 내 뒤에 오시는 이는 나보다 능력이 많으시니 나는 그의 신을 들기도 감당하지 못하겠노라 그는 성령과 불로 너희에게 세례를 베푸실 것이요" },
          { referenceKo: "사도행전 19장 6절", korean: "바울이 그들에게 안수하매 성령이 그들에게 임하시므로 방언도 하고 예언도 하니" }
        ],
        question: "내 뜻이 아닌 성령님이 내 혀를 사로잡아 '성령이 말하게 하심을 따라' 깊이 기도할 때, 기도의 차원이 어떻게 달라질까요?",
        prayer: "오순절 마가다락방에 역사하셨던 성령님, 오늘 밤 우리 가정에도 동일하게 임재하사 온 가족이 성령의 충만함을 받고 영으로 깊이 부르짖게 하옵소서. 아멘.",
        koreanModern: "그들 모두가 성령으로 충만해져서 성령이 말하게 하시는 대로 다른 언어들로 말하기 시작했습니다.",
        english: "All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them."
      },
      {
        id: 18,
        title: "성령의 선물",
        referenceKo: "사도행전 2장 38절",
        referenceEn: "Acts 2:38",
        korean: "베드로가 이르되 너희가 회개하여 각각 예수 그리스도의 이름으로 세례를 받고 죄 사함을 받으라 그리하면 성령의 선물을 받으리니",
        reason: "거룩하신 성령님을 우리 심령에 모시기 위한 절대적인 전제 조건은 십자가 앞에 내 죄를 철저히 회개하고 예수의 이름으로 죄 사함을 받는 것입니다. 깨끗하게 청소된 심령 위에 하나님은 성령이라는 인류 최고의 '선물'을 아낌없이 주심을 확신하기 위해 알아야 합니다.",
        connection: "사도 베드로의 이 담대한 외침은 복음서 누가복음 11장 13절에서 \"하늘 아버지께서 구하는 자에게 성령을 주시지 않겠느냐\"라고 하신 예수님의 약속이 역사적 대중 앞에 공식적인 법칙으로 선포된 것이며, 사도행전 10장 고넬료 가정에 차별 없이 임한 성령 선물의 신학적 근거가 됩니다.",
        related: [
          { referenceKo: "누가복음 11장 13절", korean: "너희가 악할지라도 좋은 것을 자식에게 줄 줄 알거든 하물며 너희 하늘 아버지께서 구하는 자에게 성령을 주시지 않겠느냐 하시니라" }
        ],
        question: "내 안에 하나님의 가장 귀한 선물인 성령님을 충만히 모시기 위해, 오늘 내가 예수님의 보혈로 씻어내야 할 숨은 죄나 허물은 무엇인가요?",
        prayer: "우리를 정결케 하시는 주님, 날마다 우리를 십자가 보혈로 씻기사 깨끗케 하시고, 하나님이 예비하신 가장 고귀한 성령의 선물을 날마다 풍성히 누리는 가정이 되게 하옵소서. 아멘.",
        koreanModern: "베드로가 말했습니다. \"회개하십시오. 그리고 여러분 각자가 예수 그리스도의 이름으로 세례를 받아 죄 사함을 받으십시오. 그러면 성령을 선물로 받을 것입니다.",
        english: "Peter replied, \"Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit."
      },
      {
        id: 19,
        title: "기도와 담대한 전파",
        referenceKo: "사도행전 4장 31절",
        referenceEn: "Acts 4:31",
        korean: "빌기를 다하매 모인 곳이 진동하더니 무리가 다 성령이 충만하여 담대히 하나님의 말씀을 전하니라",
        reason: "성령충만은 과거에 한 번 경험한 사건으로 끝나는 명사가 아니라, 날마다 기도로 채워야 하는 지속적인 동사입니다. 초대교회 성도들이 세상의 거센 위협과 박해 속에서 낙심하지 않고 모여 합심하여 빌었을 때, 모인 땅이 진동하고 성령으로 '재충만'해져 담대해졌음을 배우기 위해 알아야 합니다.",
        connection: "사도행전 2장 4절에서 최초로 성령충만을 경험했던 제자들이 박해라는 거대한 현실의 벽에 부딪혔을 때, 기도로써 성령의 능력을 공급받는 '지속적 재충만'의 모형이며, 이는 서신서 에베소서 5장 18절의 '오직 성령으로 충만함을 받으라'는 명령의 실천적 예시가 됩니다.",
        related: [
          { referenceKo: "사도행전 2장 4절", korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라" },
          { referenceKo: "에베소서 5장 18절", korean: "술 취하지 말라 이는 방탕한 것이니 오직 성령으로 충만함을 받으라" }
        ],
        question: "우리 가정을 위협하는 세상의 거센 파도나 두려움 앞에서 위축되지 않고, 다시 담대함을 회복할 수 있는 유일한 비결은 무엇일까요?",
        prayer: "진동의 역사를 일으키시는 주님, 우리 온 가족이 모여 부르짖어 빌 때에 영적 진동이 일어나게 하시고, 날마다 성령의 재충만을 받아 세상 속에 예수를 담대히 선포하게 하옵소서. 아멘.",
        koreanModern: "그들이 기도를 마치자 모인 곳이 흔들렸고, 그들 모두가 성령으로 충만해져서 담대히 하나님의 말씀을 전했습니다.",
        english: "After they prayed, the place where they were meeting was shaken. And they were all filled with the Holy Spirit and spoke the word of God boldly."
      },
      {
        id: 20,
        title: "이방인에게 임하신 성령",
        referenceKo: "사도행전 10장 44절",
        referenceEn: "Acts 10:44",
        korean: "베드로가 이 말을 할 때에 성령이 말씀 듣는 모든 사람에게 내려오시니",
        reason: "성령님은 인간이 만든 민족, 혈통, 문화, 그리고 굳어버린 편견의 벽을 단숨에 무너뜨리시는 분입니다. 유대인들만의 영인 줄 알았던 성령께서, 사모함으로 엎드려 베드로의 복음의 말씀을 경청하던 이방인 고넬료 가정 위에 폭포수처럼 내려오셨음을 보며, 우리 가정도 날마다 말씀을 사모하는 자리가 되어야 함을 깨닫기 위해 알아야 합니다.",
        connection: "이방인 고넬료 가정에 임한 성령 강림 사건은 요엘 2장 28절의 '내가 내 영을 만민(All Flesh, 모든 육체)에게 부어 주리라' 하신 약속이 유대인의 혈통적 경계를 깨뜨리고 전 세계 열방으로 뻗어 나가는 대전환점이며, 사도행전 1장 8절(땅끝까지 이르러 증인 되리라)이 성취되는 강력한 증거입니다.",
        related: [
          { referenceKo: "요엘 2장 28절", korean: "그 후에 내가 내 영을 만민에게 부어 주리니 너희 자녀들이 장래 일을 말할 것이며 너희 늙은이는 꿈을 꾸며 너희 젊은이는 이상을 볼 것이며" },
          { referenceKo: "사도행전 1장 8절", korean: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라" }
        ],
        question: "고넬료 가정처럼 우리 가족이 가정예배를 드릴 때 어떤 중심과 사모함으로 말씀을 들어야 성령의 임재를 경험할 수 있을까요?",
        prayer: "벽을 무너뜨리시는 성령님, 오늘 밤 우리 가족이 마음의 귀를 열어 말씀을 들을 때 이 방에 모인 모든 사람 머리 위에 오순절의 성령을 사정없이 내려 주옵소서. 아멘.",
        koreanModern: "베드로가 이 말을 할 때 성령이 말씀을 듣는 모든 사람에게 내렸습니다.",
        english: "While Peter was still speaking these words, the Holy Spirit came on all who heard the message."
      },
      {
        id: 21,
        title: "안수와 성령의 나타남",
        referenceKo: "사도행전 19장 6절",
        referenceEn: "Acts 19:6",
        korean: "바울이 그들에게 안수하매 성령이 그들에게 임하시므로 방언도 하고 예언도 하니",
        reason: "사도 바울이 에베소의 성도들에게 안수했을 때 성령이 강력히 임하셔서 방언과 예언의 역사가 나타났습니다. 영적 지도자의 사역과 부모의 거룩한 축복 기도를 통하여 성령세례와 신령한 은사의 통로가 활짝 열릴 수 있음을 신뢰하기 위해 알아야 합니다.",
        connection: "사도 바울의 안수를 통해 에베소 교회에 일어난 성령의 외적 표적들은, 앞서 교회가 경험했던 오순절 다락방 성령 강림(사도행전 2장 4절), 빌립의 사역 후 사도들의 안수로 시작된 사마리아 성령 강림(사도행전 8장 17절), 그리고 이방인 최초의 성령 강림인 고넬료 가정 사건(사도행전 10장 44절)의 역사적 맥락과 완벽하게 정렬 및 연속되는 오순절 성령 행전의 강력한 마침표입니다.",
        related: [
          { referenceKo: "사도행전 2장 4절", korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라" },
          { referenceKo: "사도행전 8장 17절", korean: "이에 두 사도가 그들에게 안수하매 성령을 받는지라" },
          { referenceKo: "사도행전 10장 44절", korean: "베드로가 이 말을 할 때에 성령이 말씀 듣는 모든 사람에게 내려오시니" }
        ],
        question: "믿음의 부모가 하나님의 권위를 가지고 자녀들의 머리에 손을 얹어 성령충만을 위해 간절히 축복 기도하는 것은 왜 영적으로 엄청난 비밀일까요?",
        prayer: "안수를 통해 은사를 불일듯 일으키시는 주님, 부모가 자녀를 위해 손을 얹고 부르짖을 때 성령이 임하게 하시고, 우리 자녀들의 입술에 방언과 하늘의 영적 문이 열리게 하옵소서. 아멘.",
        koreanModern: "바울이 그들에게 안수하자 성령이 그들에게 임하셨고, 그들은 방언을 말하고 예언했습니다.",
        english: "When Paul placed his hands on them, the Holy Spirit came on them, and they spoke in tongues and prophesied."
      },
      {
        id: 22,
        title: "그리스도의 사람",
        referenceKo: "로마서 8장 9절",
        referenceEn: "Romans 8:9",
        korean: "만일 너희 속에 하나님의 영이 거하시면 너희가 육신에 있지 아니하고 영에 있나니 누구든지 그리스도의 영이 없으면 그리스도의 사람이 아니라",
        reason: "내가 진짜 구원받은 그리스도인인가 아닌가를 판가름하는 유일하고도 절대적인 기준은 교회의 직분이나 경력이 아니라 '내 안에 하나님의 영, 즉 성령님이 실제로 살고 계시는가'입니다. 겉모습만 마당을 밟는 교인이 아니라 중심에 그리스도의 영을 모신 진짜 성도가 되기 위해 알아야 합니다.",
        connection: "신약 복음서 요한복음 3장 5절에서 예수님이 니고데모에게 말씀하신 \"성령으로 나지 아니하면 하나님 나라에 갈 수 없다\"는 거듭남의 진리를, 바울 사도가 서신서에 이르러 교리적으로 명확하게 선언한 말씀이며, 이는 고린도전서 6장 19절(우리 몸이 성령의 전이다)의 거룩한 삶의 책임으로 발전합니다.",
        related: [
          { referenceKo: "요한복음 3장 5절", korean: "예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님의 나라에 들어갈 수 없느니라" },
          { referenceKo: "고린도전서 6장 19절", korean: "너희 몸은 너희가 하나님께로부터 받은 바 너희 가운데 계신 성령의 전인 줄을 알지 못하느냐 너희는 너희 자신의 것이 아니라" }
        ],
        question: "내 안에 그리스도의 영이 확고히 거하고 계심을 날마다 영적으로 느끼며, 그 기쁨으로 세상을 이겨내고 있나요?",
        prayer: "내 안에 거처를 삼으신 성령님, 내가 육신에 속한 자가 아니라 영에 속한 고귀한 그리스도의 사람임을 1초도 잊지 않게 하시고, 날마다 성령의 생각만 품고 전진하게 하옵소서. 아멘.",
        koreanModern: "그러나 하나님의 영이 여러분 안에 거하시면, 여러분은 육신 안에 있지 않고 성령 안에 있습니다. 누구든지 그리스도의 영이 없으면 그리스도의 사람이 아닙니다.",
        english: "You, however, are not in the realm of the flesh but are in the realm of the Spirit, if indeed the Spirit of God lives in you. And if anyone does not have the Spirit of Christ, they do not belong to Christ."
      },
      {
        id: 23,
        title: "하나님의 아들의 삶",
        referenceKo: "로마서 8장 14절",
        referenceEn: "Romans 8:14",
        korean: "무릇 하나님의 영으로 인도함을 받는 사람은 곧 하나님의 아들이라",
        reason: "하나님의 참된 자녀는 내 혈기, 내 고집, 세상의 유행과 가치관에 끌려다니지 않고 오직 내 안에서 말씀하시는 성령님의 세미한 음성에 철저히 순종하며 인도를 받습니다. 내 인생의 운전대를 성령님께 온전히 맡기는 법을 훈련하기 위해 이 말씀을 알아야 합니다.",
        connection: "에스겔 36장 27절에서 \"내 영을 너희 속에 두어 너희로 내 율례를 행하게 하겠다\"고 하신 하나님의 약속이, 실제 신약 성도들의 일상 속에서 어떻게 구현되는지 보여주는 거룩한 성취이며, 요한복음 16장 13절(진리의 성령이 너희를 인도하시리라)의 약속과 완벽히 짝을 이룹니다.",
        related: [
          { referenceKo: "에스겔 36장 27절", korean: "또 내 영을 너희 속에 두어 너희로 내 율례를 행하게 하리니 너희가 내 규례를 지켜 행할지라" },
          { referenceKo: "요한복음 16장 13절", korean: "그러나 진리의 성령이 오시면 그가 너희를 모든 진리 가운데로 인도하시리니 그가 스스로 말하지 않고 오직 들은 것을 말하며 장래 일을 너희에게 알리시리라" }
        ],
        question: "최근 내 삶과 가정의 선택 속에서 성령님의 인도하심을 무시하고, 내 뜻과 내 계산대로 고집부렸던 부분은 무엇인가요?",
        prayer: "우리의 걸음을 인도하시는 주님, 세상의 헛된 유혹과 내 감정에 이끌리지 않게 하시고, 매일 아침과 저녁 성령님의 세미한 음성에 즉각 순종하는 진정한 하나님의 아들들이 되게 하옵소서. 아멘.",
        koreanModern: "하나님의 영의 인도를 받는 사람은 누구든지 하나님의 자녀입니다.",
        english: "For those who are led by the Spirit of God are the children of God."
      },
      {
        id: 24,
        title: "탄식하며 도우시는 성령",
        referenceKo: "로마서 8장 26절",
        referenceEn: "Romans 8:26",
        korean: "이와 같이 성령도 우리의 연약함을 도우시나니 우리는 마땅히 기도할 바를 알지 못하나 오직 성령이 말할 수 없는 탄식으로 우리를 위하여 친히 간구하시느니라",
        reason: "우리는 너무나 연약하고 어리석어서 인생의 거대한 고난이나 슬픔이 찾아오면 도대체 무엇을 어떻게 기도해야 할지조차 모른 채 낙심해 버립니다. 바로 그 순간, 내 안의 성령님이 나보다 더 아파하시며 깨어진 내 심령 속에서 '말할 수 없는 탄식'의 눈물로 친히 중보 기도를 드려주고 계심을 믿고 다시 일어서기 위해 알아야 합니다.",
        connection: "예수님이 요한복음 14장 26절에서 제자들에게 약속하셨던 \"내가 떠나도 너희 곁에서 영원히 도울 또 다른 위로자 보혜사를 보내겠다\"고 하신 그 사랑이, 고독한 기도의 자리에서 어떻게 실제적이고 가슴 뭉클한 중보로 나타나는지 보여주는 최고의 은혜 구절입니다.",
        related: [
          { referenceKo: "요한복음 14장 26절", korean: "보혜사 곧 아버지께서 내 이름으로 보내실 성령 그가 너희에게 모든 것을 가르치고 내가 너희에게 말한 모든 것을 생각나게 하리라" }
        ],
        question: "기도가 도저히 나오지 않을 정도로 가슴이 찢어지던 순간, 내 안에서 나를 위해 탄식하며 울고 계시던 성령님의 위로를 경험해 본 적이 있나요?",
        prayer: "나의 연약함을 온몸으로 도우시는 보혜사 성령님, 내가 지쳐 기도를 멈춘 순간에도 나를 포기하지 않으시고 친히 하늘 보좌를 향해 간구해 주시니 감사합니다. 그 사랑 의지하여 다시 일어나게 하옵소서. 아멘.",
        koreanModern: "이와 같이 성령께서도 연약한 우리를 도우십니다. 우리는 마땅히 기도할 바를 알지 못하지만, 성령께서 친히 말로 표현할 수 없는 탄식으로 우리를 위해 간구하십니다.",
        english: "In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans."
      },
      {
        id: 25,
        title: "성령이 거하시는 전",
        referenceKo: "고린도전서 6장 19절",
        referenceEn: "1 Corinthians 6:19",
        korean: "너희 몸은 너희가 하나님께로부터 받은 바 너희 가운데 계신 성령의 전인 줄을 알지 못하느냐 너희는 너희 자신의 것이 아니라",
        reason: "우리의 몸은 내 마음대로 더럽히거나 세상의 쾌락에 내던져도 되는 싸구려 육체가 아닙니다. 우주를 창조하신 만군의 하나님의 영이 거룩하게 거하시는 임재의 '성전(Temple)'입니다. 그러므로 음란, 중독, 게으름, 정욕의 더러운 습관들로부터 내 몸과 가정을 정결하게 지켜내기 위해 알아야 합니다.",
        connection: "구약 시대에는 솔로몬이 지은 눈에 보이는 화려한 건물이 예루살렘 성전이었고 그곳에만 영광이 임했지만, 신약 시대에는 예수의 피로 씻음 받은 성도 개개인의 '육체'가 하나님의 거룩한 처소가 됨을 선포함으로써, 로마서 8장 9절이 말한 '그리스도의 사람'의 삶의 윤리를 최고조로 끌어올립니다.",
        related: [
          { referenceKo: "로마서 8장 9절", korean: "만일 너희 속에 하나님의 영이 거하시면 너희가 육신에 있지 아니하고 영에 있나니 누구든지 그리스도의 영이 없으면 그리스도의 사람이 아니라" }
        ],
        question: "내 몸과 마음이 거룩한 '성령의 전'이라는 사실을 명심한다면, 내가 오늘 당장 끊어버려야 할 스마트폰 문화나 부정적인 습관은 무엇인가요?",
        prayer: "거룩함의 영이신 성령님, 우리 자녀들과 온 가족의 몸이 주의 성전임을 날마다 떨림으로 기억하게 하사, 세상의 음란과 중독에 물들지 않고 몸으로 하나님께 영광 돌리게 하옵소서. 아멘.",
        koreanModern: "여러분의 몸은 여러분이 하나님께로부터 받은 바 여러분 가운데 계신 성령의 전인 줄을 알지 못합니까? 여러분은 여러분의 것이 아닙니다.",
        english: "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own;"
      },
      {
        id: 26,
        title: "공동체를 유익하게 하는 은사",
        referenceKo: "고린도전서 12장 7절",
        referenceEn: "1 Corinthians 12:7",
        korean: "각 사람에게 성령을 나타내심은 유익하게 하려 하심이라",
        reason: "성령님이 우리 믿는 성도들에게 방언, 예언, 치유, 영분별, 지혜의 말씀 등 초자연적인 은사들을 나타내시는 목적은 결코 내 개인의 영성을 자랑하거나 과시하라고 주신 것이 아닙니다. 상처받은 교회를 치료하고 우리 가정을 아름답게 섬겨 '공동체 전체를 유익하게' 하기 위함임을 명심하기 위해 알아야 합니다.",
        connection: "이사야 11장 2절에서 메시아(예수님)에게 강림했던 여호와의 영의 갖가지 초자연적인 재능과 모략들이, 이제 신약 시대에 와서 교회의 부흥과 성도들의 서로를 향한 섬김을 위해 각 사람의 분량대로 쪼개어 나누어지는 성령 은사 장의 핵심 선언입니다.",
        related: [
          { referenceKo: "이사야 11장 2절", korean: "그의 위에 여호와의 영 곧 지혜와 총명의 영이요 모략과 재능의 영이요 지식과 여호와를 경외하는 영이 강림하시리니" }
        ],
        question: "하나님이 나에게 주신 남다른 달란트나 영적인 은사는 무엇이며, 그것으로 어떻게 내 형제와 부모, 교회를 유익하게 섬길 수 있을까요?",
        prayer: "은사를 나누어주시는 성령님, 내게 주신 영적인 선물을 교만하게 자랑하지 않게 하시고, 오직 눈물과 겸손으로 가족을 섬기며 교회를 유익하게 하는 착한 청지기가 되게 하옵소서. 아멘.",
        koreanModern: "각 사람에게 성령이 나타남을 주심은 유익하게 하려 하심입니다.",
        english: "Now to each one the manifestation of the Spirit is given for the common good."
      },
      {
        id: 27,
        title: "성령의 아홉 가지 열매",
        referenceKo: "갈라디아서 5장 22-23절",
        referenceEn: "Galatians 5:22-23",
        korean: "오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니 이같은 것을 금지할 법이 없느니라",
        reason: "오순절 영성의 종착역이자 최종 완성은 바로 '인격의 변화'입니다. 사도행전적인 강력한 은사와 권능을 받았다면, 반드시 서신서적인 삶 속에서 사랑, 희락, 오래 참음, 온유, 절제 같은 예수님의 성품의 열매를 맺어야만 비로소 가정생활이 천국으로 변하고 참된 신앙이 증명됨을 깨닫기 위해 알아야 합니다.",
        connection: "사도행전 2장 4절의 성령충만이 외적인 은사인 '방언'의 역사로 타오르기 시작했다면, 갈라디아서의 성령의 열매는 내적인 인격의 '성숙'으로 열매 맺는 성령 사역의 완벽한 영적 좌우 균형을 가르치는 핵심 짝 말씀입니다.",
        related: [
          { referenceKo: "사도행전 2장 4절", korean: "그들이 다 성령의 충만함을 받고 성령이 말하게 하심을 따라 다른 언어들로 말하기를 시작하니라" }
        ],
        question: "오늘날 우리 가정생활 속에서 내가 가장 먼저 맺어야 할 성령의 열매(예: 오래 참음, 온유, 절제 등)는 구체적으로 어떤 행동으로 나타나야 할까요?",
        prayer: "열매를 원하시는 성령님, 능력만 자랑하고 입술만 살아있는 바리새인이 되지 않게 하시고, 내 언어와 성품이 깨어져 가정 안에서 사랑과 화평과 온유의 열매를 맺게 하옵소서. 아멘.",
        koreanModern: "그러나 성령께서 맺게 하시는 열매는 사랑, 기쁨, 평화, 인내, 친절, 선함, 신실함, 온유와 절제니 이같은 것을 금지할 법이 없습니다.",
        english: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law."
      },
      {
        id: 28,
        title: "지속적인 성령충만의 명령",
        referenceKo: "에베소서 5장 18절",
        referenceEn: "Ephesians 5:18",
        korean: "술 취하지 말라 이는 방탕한 것이니 오직 성령으로 충만함을 받으라",
        reason: "세상이 주는 술과 음란, 방탕한 문화는 우리 영혼을 마비시키고 파멸로 몰고 가지만, 성령충만은 우리를 거룩한 찬송과 예배의 승리자로 세웁니다. 성령충만은 내 기분에 따라 받아도 되고 안 받아도 되는 선택 사항이 아니라, 만군의 주님이 성도에게 내리신 엄격한 '절대 명령'이기에 매일 밤낮으로 구해야 함을 깨닫기 위해 알아야 합니다.",
        connection: "사도행전 2장 13절 오순절 날 성령충만하여 방언으로 부르짖던 제자들을 향해 세상 사람들이 \"저들이 새 술에 취하였다\"라고 조롱했던 영적 배경과 연결되며, 세상의 더러운 술 취함과 하늘의 거룩한 성령 취함을 강렬하게 대비시켜 사도행전 4장 31절과 같은 '연속적인 성령 재충만'의 필요성을 선포합니다.",
        related: [
          { referenceKo: "사도행전 2장 13절", korean: "또 어떤 이들은 조롱하여 이르되 그들이 새 술에 취하였다 하더라" },
          { referenceKo: "사도행전 4장 31절", korean: "빌기를 다하매 모인 곳이 진동하더니 무리가 다 성령이 충만하여 담대히 하나님의 말씀을 전하니라" }
        ],
        question: "나는 오늘 하루 세상이 주는 피로와 스트레스를 풀기 위해 세상 문화에 취해 있었나요, 아니면 기도로 성령님의 은혜에 취해 있었나요?",
        prayer: "오직 성령충만을 명령하신 주님, 세상의 방탕함과 썩어질 육신의 즐거움에 마음을 빼앗기지 않게 하시고, 날마다 깨어 기도함으로 오직 성령으로만 충만하게 하옵소서. 아멘.",
        koreanModern: "술에 취하지 마십시오. 그것은 방탕으로 이끕니다. 오히려 성령으로 충만하십시오.",
        english: "Do not get drunk on wine, which leads to debauchery. Instead, be filled with the Spirit,"
      },
      {
        id: 29,
        title: "성령을 소멸하지 말라",
        referenceKo: "데살로니가전서 5장 19절",
        referenceEn: "1 Thessalonians 5:19",
        korean: "성령을 소멸하지 말며",
        reason: "우리 안에 불같이 타오르는 성령의 은혜와 감동은, 우리의 지속적인 불순종, 영적 게으름, 더러운 죄악, 입술의 불평과 원망을 통하여 마치 타오르던 모닥불이 꺼지듯 완전히 '소멸'해 버릴 수 있습니다. 우리 가정 안에 타오르는 예배의 불, 기도의 불씨가 절대로 꺼지지 않도록 영적으로 늘 깨어 파수하기 위해 알아야 합니다.",
        connection: "마태복음 3장 11절에서 예고되고 사도행전 2장 3절에서 우리에게 불처럼 뜨겁게 임했던 그 '성령의 강력한 불길'을, 구원받은 신자가 일상의 삶 속에서 어떻게 소중히 관리하고 지켜내야 하는지 경고하는 서신서의 가장 엄중한 실천 명령입니다.",
        related: [
          { referenceKo: "마태복음 3장 11절", korean: "나는 너희로 회개하게 하기 위하여 물로 세례를 베풀거니와 내 뒤에 오시는 이는 나보다 능력이 많으시니 나는 그의 신을 들기도 감당하지 못하겠노라 그는 성령과 불로 너희에게 세례를 베푸실 것이요" },
          { referenceKo: "사도행전 2장 3절", korean: "마치 불의 혀처럼 갈라지는 것들이 그들에게 보여 각 사람 위에 하나씩 임하여 있더니" }
        ],
        question: "최근 내 마음속에서 성령의 뜨거운 은혜의 불을 끄게 만들었던 부정적인 생각, 판단, 혹은 불평의 거친 언어는 무엇이었나요?",
        prayer: "불로 역사하시는 성령님, 내 안의 숨은 죄와 차가운 불순종으로 인해 성령의 불씨가 소멸하지 않게 하시고, 날마다 기도의 제단을 쌓아 성령의 불길이 활활 타오르게 하옵소서. 아멘.",
        koreanModern: "성령을 소멸하지 마십시오.",
        english: "Do not quench the Spirit."
      },
      {
        id: 30,
        title: "성령이 하시는 말씀",
        referenceKo: "요한계시록 3장 22절",
        referenceEn: "Revelation 3:22",
        korean: "귀 있는 자는 성령이 교회들에게 하시는 말씀을 들을지어다",
        reason: "성경의 맨 마지막 책인 요한계시록은 영적으로 귀가 열린 자들은 마지막 때에 성령께서 교회와 성도들에게 외치시는 경고의 음성을 반드시 귀담아듣고 복종하라고 준엄하게 선포합니다. 종말의 혼란과 이단들의 혹독한 유혹 속에서 끝까지 살아남아 승리하는 유일한 길은 오직 성령의 음성에만 주파수를 맞추는 것임을 각인하기 위해 알아야 합니다.",
        connection: "창세기 1장 2절에서 흑암의 수면 위를 운행하시며 위대한 인류 역사의 시작을 선포하셨던 성령님이, 신약 성경의 가장 마지막 장 요한계시록 3장에 이르러 온 교회를 향해 최종적인 영적 승리를 선포하시며 인류 구속사의 대단원의 막을 내리는 영광스럽고 웅장한 종결 구절입니다.",
        related: [
          { referenceKo: "창세기 1장 2절", korean: "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라" }
        ],
        question: "지난 30일 동안 성령님의 귀한 말씀들을 온 가족이 함께 본문부터 선포하며 암송해 오는 동안, 성령님이 우리 가정에 주신 가장 큰 음성과 마음의 변화는 무엇인가요?",
        prayer: "처음과 나중이 되시는 성령님, 30일 동안 우리 가정을 말씀의 등불로 인도해 주시니 눈물로 감사드립니다. 주님 다시 오시는 그날까지 세상 소리를 차단하고 오직 성령의 음성에만 귀 기울여 최종 승리하는 명문 믿음의 가문이 되게 하옵소서. 예수님의 이름으로 간절히 기도합니다. 아멘.",
        koreanModern: "귀 있는 사람은 성령이 교회들에게 하시는 말씀을 들으라.'",
        english: "Whoever has ears, let them hear what the Spirit says to the churches."
      }
    ]
  }
];

/* 앱 하단 저작권 표시 영역에 사용되는 정보.
 * 실제 확인된 번역본일 때만 채우고, 확인되지 않았다면 빈 문자열로 두세요. */
window.BIBLE_TEXT_META = {
  koreanVersionName: "개역개정 (대한성서공회)",
  koreanCopyrightNotice: "한글 성경 저작권은 대한성서공회에 있습니다. 공개 배포 전 사용 허가를 확인해 주세요.",
  modernVersionName: "쉬운 우리말: Open Korean Bible (기완)",
  modernCopyrightNotice: "쉬운 우리말 본문 출처: Open Korean Bible (기완), https://github.com/open-korean-bible/open-korean-bible, CC BY 4.0. AI 번역 기반 데이터셋이며 신학적 정확성을 보증하지 않습니다.",
  englishVersionName: "New International Version (NIV)",
  englishCopyrightNotice: "Scripture quotations taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide. \"NIV\" and \"New International Version\" are trademarks registered in the United States Patent and Trademark Office by Biblica, Inc."
};
