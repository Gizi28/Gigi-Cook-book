// Lets the recipe book be installed as an app and open without a connection.
// The site's own files are always fetched fresh when online (so new versions show up at once);
// the saved copies are only used offline. Google sign-in, Drive and translation requests are not touched.
var CACHE='recipe-book-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))})
    .then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(function(res){
    if(res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(r,copy)})}return res})
    .catch(function(){return caches.match(r).then(function(m){return m||(r.mode==='navigate'?caches.match('./index.html'):Response.error())})}))});
