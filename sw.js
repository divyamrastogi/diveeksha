var cacheName = 'wedding-cache-1';
var cssFiles = [
  '/css/animate.css',
  '/css/icomoon.css',
  '/css/bootstrap.css',
  '/css/magnific-popup.css',
  '/css/owl.carousel.min.css',
  '/css/owl.theme.default.min.css',
  '/css/style.css',
];
var jsFiles = [
  '/js/modernizr-2.6.2.min.js',
  '/js/owl.carousel.min.js',
  '/js/jquery.min.js',
  '/js/jquery.countTo.js',
  '/js/jquery.stellar.min.js',
  '/js/jquery.magnific-popup.min.js',
  '/js/magnific-popup-options.js',
  '/js/simplyCountdown.js',
  '/js/main.js',
  '/js/jquery.waypoints.min.js',
  '/js/jquery.easing.1.3.js',
  '/js/bootstrap.min.js',
];
var imageFiles = [
  '/images/groom.jpg',
  '/images/bride.jpg',
  '/images/loader.gif',
  '/images/img_bg_2.jpg',
  '/images/img_bg_3.jpg',
  '/images/img_bg_5.jpg',
];
var filesToCache = [
  '/',
  '/favicon.ico',
  '/index.html',
].concat(jsFiles).concat(cssFiles).concat(imageFiles);

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      ).catch((error) => {
        console.log('Some error occurred while removing existing cache!' + error);
      });
    }).catch((error) => {
      console.log('Some error occurred while removing existing cache!' + error);
    }));
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then((fetchResponse) => {
          // Save all files
          return cacheRequestData(cacheName, event.request.url, fetchResponse.clone());
        }).catch((error) => {
          console.log('Some error occurred while saving to or fetching data from dynamic cache!');
        });
    })
  );
});

function cacheRequestData(cacheName, url, fetchResponse) {
  return caches.open(cacheName)
    .then((cache) => {
      cache.put(url, fetchResponse.clone());
      return fetchResponse;
    }).catch((error) => {
      console.log(`Some error occurred while saving to or fetching data from dynamic cache: ${cacheName}!`);
    });
}
