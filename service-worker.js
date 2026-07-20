const CACHE_NAME = 'sepolscis-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/style.css',
  '/learning-content.js',
  '/logo.png',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // New modular scripts
  '/scripts/app.js',
  '/scripts/utils.js',
  '/scripts/storage.js',
  '/scripts/auth.js',
  '/scripts/gamification.js',
  '/scripts/notifications.js',
  '/scripts/views/dashboard.js',
  '/scripts/views/learning.js',
  '/scripts/views/events.js',
  '/scripts/views/opportunities.js',
  '/scripts/views/portfolio.js',
  '/scripts/views/profile.js',
  '/scripts/views/officer.js',
  '/scripts/views/grievance.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});