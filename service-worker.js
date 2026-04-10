// 빤디따라마 PWA 서비스 워커
const CACHE_NAME = 'panditarama-v21';
const ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './videos.js',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './icon-maskable.svg'
];

// 설치: 정적 자산 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 활성화: 이전 캐시 삭제
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// videos.js는 자주 업데이트되므로 Network First
const NETWORK_FIRST = ['videos.js'];

self.addEventListener('fetch', (e) => {
  const isNetworkFirst = NETWORK_FIRST.some(f => e.request.url.includes(f));

  if (isNetworkFirst) {
    // Network First: 최신 데이터 우선, 실패 시 캐시
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache First: 정적 자산 (성능 우선)
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request))
        .catch(() => caches.match('./index.html'))
    );
  }
});
