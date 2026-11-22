// Service worker : réseau d'abord, cache en secours (dernière version en ligne, jouable hors ligne).
// cache: 'no-cache' contourne le cache HTTP de GitHub Pages. Changer CACHE_NAME à chaque version.
const CACHE_NAME = 'games-v3';
const JEUX = ['imposteur', 'fauxdico', 'bombe', 'encheres', 'dilemmes', 'tendance', 'decades', 'quiditca', 'vraifaux'];
const COQUILLE = [
  './', 'index.html', 'commun.css', 'commun.js', 'manifest.webmanifest', 'donnees/categories.js', 'donnees/categories-plus.js', 'decades/data-wikidata.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable.png', 'icons/apple-touch-icon.png',
  ...JEUX.map(j => j + '/'), ...JEUX.filter(j => j !== 'bombe' && j !== 'encheres' && j !== 'imposteur').map(j => j + '/data.js'),
  'imposteur/app.js', 'imposteur/style.css', 'imposteur/data/paires.json', 'decades/glyphs.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(rep => {
        if (rep.ok && (new URL(req.url).origin === location.origin || req.url.includes('fonts.g'))) {
          const copie = rep.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copie));
        }
        return rep;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
