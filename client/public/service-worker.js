// public/service-worker.js

// 1. Tell the SW to activate immediately, even if there's an older version still controlling pages:
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
  });
  
  // 2. As soon as the new SW takes control, claim all existing clients (open tabs):
  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });
  
  // …then the rest of your caching/fetch handlers…
  self.addEventListener('fetch', /* your fetch logic here */);
  