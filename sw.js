const CACHE_NAME = 'suivi-pp-v2';
const ASSETS = ['./index.html', './style.css', './app.js', './manifest.json', './icon.svg'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

/* Réseau en priorité pour l'app (HTML/CSS/JS) : garantit que la dernière version
   déployée s'affiche toujours quand il y a du réseau. Le cache ne sert que de
   secours hors-ligne. */
self.addEventListener('fetch', (e)=>{
  if(e.request.method !== 'GET') return;
  const isAppFile = ASSETS.some(a => e.request.url.endsWith(a.replace('./','/')) || e.request.url.endsWith(a.replace('./','')));
  if(isAppFile || e.request.mode === 'navigate'){
    e.respondWith(
      fetch(e.request).then(resp=>{
        if(resp && resp.status===200){
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(e.request, clone));
        }
        return resp;
      }).catch(()=> caches.match(e.request))
    );
    return;
  }
  // Autres ressources (polices, libs externes) : cache d'abord, réseau en secours
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request))
  );
});
