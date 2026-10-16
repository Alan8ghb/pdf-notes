// network-first; caches only the small app shell (never PDFs or large responses)
const C='pdfnotes-v7';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!/^https?:$/.test(u.protocol)||/\.pdf$/i.test(u.pathname))return;
  e.respondWith(fetch(e.request).then(r=>{const len=+r.headers.get('content-length')||0;
    if(r.ok&&len<5e6){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)))});
