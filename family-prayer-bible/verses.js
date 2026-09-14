/* 우리 가족 기도말씀 30 - 성경 본문 데이터
 *
 * 본문 출처:
 *  - 한글: 개역개정 (대한성서공회 bskorea.or.kr 조회 결과 및 교차 확인)
 *  - 영어: NIV, New International Version (Biblica, Inc.)
 *
 * 각 본문은 웹 검색으로 실제 성경 사이트(대한성서공회, bible.com, biblehub.com,
 * biblia.com 등)에 게재된 문구를 그대로 옮긴 것이며, 임의로 작성하거나
 * 기억에 의존해 재구성하지 않았습니다.
 *
 * ⚠ 공개 배포 전 필독: 한글 개역개정 본문의 사용 조건과 허가 여부를
 * 대한성서공회(bskorea.or.kr)를 통해 반드시 확인해야 합니다.
 * 자세한 내용은 README.md의 "저작권 확인 사항"을 참고하세요.
 *
 * 새 구절을 추가/수정하려면 아래 객체 구조를 그대로 유지하세요.
 * {
 *   id: 번호(1~30, 중복 불가),
 *   referenceKo: "책이름 장 절",
 *   referenceEn: "Book chapter:verse",
 *   korean: "한글 본문 (실제 번역본 원문)",
 *   english: "English text (verified NIV wording)"
 * }
 */

window.BIBLE_VERSES = [
  {
    id: 1,
    referenceKo: "빌립보서 4장 6절",
    referenceEn: "Philippians 4:6",
    korean: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라",
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
    english: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
  },
  {
    id: 4,
    referenceKo: "데살로니가전서 5장 17절",
    referenceEn: "1 Thessalonians 5:17",
    korean: "쉬지 말고 기도하라",
    english: "pray continually,"
  },
  {
    id: 5,
    referenceKo: "마가복음 11장 24절",
    referenceEn: "Mark 11:24",
    korean: "그러므로 내가 너희에게 말하노니 무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라",
    english: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours."
  },
  {
    id: 6,
    referenceKo: "빌립보서 4장 7절",
    referenceEn: "Philippians 4:7",
    korean: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라",
    english: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
  },
  {
    id: 7,
    referenceKo: "요한복음 15장 7절",
    referenceEn: "John 15:7",
    korean: "너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는대로 구하라 그리하면 이루리라",
    english: "If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you."
  },
  {
    id: 8,
    referenceKo: "요한일서 5장 14절",
    referenceEn: "1 John 5:14",
    korean: "그를 향하여 우리가 가진 바 담대함이 이것이니 그의 뜻대로 무엇을 구하면 들으심이라",
    english: "This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us."
  },
  {
    id: 9,
    referenceKo: "로마서 8장 26절",
    referenceEn: "Romans 8:26",
    korean: "이와 같이 성령도 우리의 연약함을 도우시나니 우리는 마땅히 기도할 바를 알지 못하나 오직 성령이 말할 수 없는 탄식으로 우리를 위하여 친히 간구하시느니라",
    english: "In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans."
  },
  {
    id: 10,
    referenceKo: "히브리서 4장 16절",
    referenceEn: "Hebrews 4:16",
    korean: "그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라",
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
    english: "Then Jesus told his disciples a parable to show them that they should always pray and not give up."
  },
  {
    id: 13,
    referenceKo: "에베소서 6장 18절",
    referenceEn: "Ephesians 6:18",
    korean: "모든 기도와 간구를 하되 항상 성령 안에서 기도하고 이를 위하여 깨어 구하기를 항상 힘쓰며 여러 성도를 위하여 구하라",
    english: "And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord's people."
  },
  {
    id: 14,
    referenceKo: "야고보서 1장 5절",
    referenceEn: "James 1:5",
    korean: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라",
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
    english: "And I will do whatever you ask in my name, so that the Father may be glorified in the Son."
  },
  {
    id: 19,
    referenceKo: "요한복음 16장 24절",
    referenceEn: "John 16:24",
    korean: "지금까지는 너희가 내 이름으로 아무 것도 구하지 아니하였으나 구하라 그리하면 받으리니 너희 기쁨이 충만하리라",
    english: "Until now you have not asked for anything in my name. Ask and you will receive, and your joy will be complete."
  },
  {
    id: 20,
    referenceKo: "야고보서 5장 15절",
    referenceEn: "James 5:15",
    korean: "믿음의 기도는 병든 자를 구원하리니 주께서 그를 일으키시리라 혹시 죄를 범하였을지라도 사하심을 받으리라",
    english: "And the prayer offered in faith will make the sick person well; the Lord will raise them up. If they have sinned, they will be forgiven."
  },
  {
    id: 21,
    referenceKo: "마태복음 7장 11절",
    referenceEn: "Matthew 7:11",
    korean: "너희가 악한 자라도 좋은 것으로 자식에게 줄 줄 알거든 하물며 하늘에 계신 너희 아버지께서 구하는 자에게 좋은 것으로 주시지 않겠느냐",
    english: "If you, then, though you are evil, know how to give good gifts to your children, how much more will your Father in heaven give good gifts to those who ask him!"
  },
  {
    id: 22,
    referenceKo: "요한일서 5장 15절",
    referenceEn: "1 John 5:15",
    korean: "우리가 무엇이든지 구하는 바를 들으시는 줄을 안즉 우리가 그에게 구한 그것을 얻은 줄을 또한 아느니라",
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
    english: "And he who searches our hearts knows the mind of the Spirit, because the Spirit intercedes for God's people in accordance with the will of God."
  },
  {
    id: 25,
    referenceKo: "히브리서 11장 6절",
    referenceEn: "Hebrews 11:6",
    korean: "믿음이 없이는 하나님을 기쁘시게 하지 못하나니 하나님께 나아가는 자는 반드시 그가 계신 것과 또한 그가 자기를 찾는 자들에게 상 주시는 이심을 믿어야 할지니라",
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
    english: "You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last—and so that whatever you ask in my name the Father will give you."
  }
];

/* 앱 하단 저작권 표시 영역에 사용되는 정보.
 * 실제 확인된 번역본일 때만 채우고, 확인되지 않았다면 빈 문자열로 두세요. */
window.BIBLE_TEXT_META = {
  koreanVersionName: "개역개정 (대한성서공회)",
  koreanCopyrightNotice: "한글 성경 저작권은 대한성서공회에 있습니다. 공개 배포 전 사용 허가를 확인해 주세요.",
  englishVersionName: "New International Version (NIV)",
  englishCopyrightNotice: "Scripture quotations taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide. \"NIV\" and \"New International Version\" are trademarks registered in the United States Patent and Trademark Office by Biblica, Inc."
};
