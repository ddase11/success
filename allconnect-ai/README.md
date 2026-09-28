# AllConnectAI — 랜딩 페이지

정적 HTML 한 파일(`index.html`)로 구성된 AllConnectAI 랜딩 페이지입니다. 별도 빌드 과정 없이 브라우저에서 바로 열립니다.

## 디자인 시스템

첨부된 xAI 스타일 레퍼런스를 그대로 따릅니다.

- **색**: 페이지 `#ffffff`, 카드 `#f9f8f6`(cream), 강조 표면 `#f2ede5`(sand), 잉크 `#0a0a0a`, 코드 목업 `#151515`, 헤어라인 `#d5d9e2`
- **버튼**: 단 하나의 채워진 검정 필(pill) CTA + 나머지는 고스트/아웃라인. 채도 있는 버튼 색은 쓰지 않습니다.
- **타이포**: 본문/UI는 Pretendard(한글 대체), 코드·메타는 Geist Mono. 디스플레이 헤드라인은 굵기 400에 자간 −0.025em, 행간 1.06(한글 가독성 보정)
- **그림자**: 겹쳐 쌓지 않고 헤어라인 링 하나만 사용. 깊이는 cream 표면 대비로 만듭니다.
- **라운드**: 필(9999px)과 카드(16px) 이분 체계. 입력은 6px, 코드 목업은 12px.
- **레이아웃**: 최대 1200px, 섹션 간격 80px, 카드 패딩 40px.

## 섹션 구성

sticky 내비게이션 → 히어로(터미널 목업 + 언어 탭) → 파트너 로고 → 제품 4카드 → 플랫폼 스플릿 → 지표 → 도입 사례 → 고객 후기 → 요금제 3티어 → FAQ → 문의 폼 → CTA → 푸터

## 동작

- 스크롤 시 헤더 blur + 헤어라인 표시
- IntersectionObserver 기반 등장 애니메이션(`prefers-reduced-motion` 존중)
- Python / TypeScript / cURL 코드 탭 전환
- 문의 폼은 프런트엔드 검증까지만 구현되어 있습니다. 실제 발송은 백엔드 엔드포인트 연결이 필요합니다.

## 로컬에서 보기

```bash
python3 -m http.server 8000 --directory allconnect-ai
# http://localhost:8000
```
