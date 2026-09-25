/* 우리 가족 기도말씀 30 - 서비스워커
 * 오프라인에서도 이미 열어본 화면과 본문이 동작하도록 앱 셸을 캐시한다.
 *
 * 캐시 전략: "네트워크 우선(network-first)".
 * 예전에는 캐시에 있으면 무조건 캐시를 먼저 쓰는 방식이라, 새 버전을 배포해도
 * 한 번 방문한 기기에서는 계속 예전 화면이 보이는 문제가 있었다.
 * 이제는 연결이 되는 한 항상 최신 파일을 먼저 받아오고, 그 결과를 캐시에 갱신해
 * 저장해 둔다. 오프라인일 때만 마지막으로 받아둔 캐시를 사용한다.
 *
 * 파일 내용을 바꿀 때마다 아래 CACHE_NAME의 버전 숫자를 올려야, 브라우저가
 * 서비스워커 스크립트 자체가 바뀐 것을 인식하고 새로 설치 → 이전 캐시 삭제를
 * 진행한다(app.js/index.html 등을 고쳤는데 CACHE_NAME을 그대로 두면 파일
 * 내용은 배포돼도 서비스워커가 갱신되지 않을 수 있다). */

var CACHE_NAME = 'family-prayer-bible-30-v5';
var APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './verses.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.status === 200 && response.type === 'basic') {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return undefined;
      });
    })
  );
});
