// Games : outils communs à toutes les pages (catalogue, icônes, joueurs, stockage, modale, sons).
'use strict';

const JEUX = [
  { id: 'imposteur', nom: 'Imposteur', groupe: true, c: ['#DB2777', '#FCE7F3', '#9D174D'], pitch: 'Un mot secret pour tous, sauf pour l\'intrus. Démasquez-le.' },
  { id: 'fauxdico', nom: 'Faux dico', groupe: true, c: ['#EA580C', '#FFEDD5', '#9A3412'], pitch: 'Inventez une définition à un mot rare et piégez les autres.' },
  { id: 'bombe', nom: 'Bombe', groupe: true, c: ['#DC2626', '#FEE2E2', '#991B1B'], pitch: 'Un mot de la catégorie et on passe, avant que ça saute.' },
  { id: 'encheres', nom: 'Enchères', groupe: true, c: ['#2563EB', '#DBEAFE', '#1E40AF'], pitch: '« J\'en cite huit. » Tenez votre promesse en trente secondes.' },
  { id: 'dilemmes', nom: 'Dilemmes', groupe: true, c: ['#0891B2', '#CFFAFE', '#155E75'], pitch: 'Choisissez, puis découvrez qui pense comme vous.' },
  { id: 'tendance', nom: 'Tendance', groupe: false, c: ['#65A30D', '#ECFCCB', '#3F6212'], pitch: 'Dessinez la suite de la courbe, puis comparez avec la réalité.' },
  { id: 'decades', nom: 'Décades', groupe: false, c: ['#0284C7', '#E0F2FE', '#075985'], pitch: 'Combien de fois plus grand ? Visez la bonne puissance de dix.' },
  { id: 'quiditca', nom: 'Qui a dit ça', groupe: false, c: ['#0D9488', '#CCFBF1', '#115E59'], pitch: 'Une citation, quatre auteurs. Un seul l\'a vraiment dite.' },
  { id: 'vraifaux', nom: 'Vrai ou inventé', groupe: false, c: ['#CA8A04', '#FEF9C3', '#854D0E'], pitch: 'Des anecdotes incroyables. Certaines sont fausses.' },
];

// Icônes : carré arrondi à la couleur du jeu, dessin à l'encre.
const ENCRE = '#2C2520';
const GLYPHES = {
  imposteur: `<circle cx="14" cy="14" r="6.5" fill="#fff"/><path d="M19 19l6 6"/><path d="M11.5 13.2h.01M16.5 13.2h.01" stroke-width="2.6"/>`,
  fauxdico: `<path d="M6 9.5c3-1.6 6.5-1.6 10 0v14c-3.5-1.6-7-1.6-10 0z" fill="#fff"/><path d="M16 9.5c3.5-1.6 7-1.6 10 0v14c-3-1.6-6.5-1.6-10 0z" fill="#fff"/>`,
  bombe: `<circle cx="14.5" cy="18.5" r="7.5" fill="#fff"/><path d="M19.5 13l2.5-2.5M22 10.5c1-1.5 3-1.5 3.5 0"/><path d="M11 16.5a3.5 3.5 0 013-2.5"/>`,
  encheres: `<path d="M8.5 13.5l6-6 4 4-6 6z" fill="#fff"/><path d="M15.5 14.5l8.5 8.5"/><path d="M7 25h10"/>`,
  dilemmes: `<path d="M16 26v-8M16 18l-7-7M16 18l7-7"/><path d="M6 13V8h5M26 13V8h-5"/>`,
  tendance: `<path d="M6 24h20" /><path d="M7 20l4-4 4 2 3-4" /><path d="M18 14l3-4 4-2" stroke-dasharray="2 2.4"/><circle cx="18" cy="14" r="1.8" fill="#fff"/>`,
  decades: `<rect x="6" y="11" width="20" height="10" rx="2.5" fill="#fff"/><path d="M10 11v4M14 11v3M18 11v4M22 11v3"/>`,
  quiditca: `<path d="M7 12.5a4 4 0 014-4v3a1.5 1.5 0 00-1.5 1.5H11v6H7zM17 12.5a4 4 0 014-4v3a1.5 1.5 0 00-1.5 1.5H21v6h-4z" fill="#fff"/>`,
  vraifaux: `<path d="M6.5 16.5l3.5 3.5 6-7"/><path d="M19 12l7 7M26 12l-7 7"/>`,
};
function icone(id) {
  const j = JEUX.find(x => x.id === id);
  return `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="${j.c[1]}" stroke="${j.c[0]}" stroke-width="1.6"/>${GLYPHES[id]}</svg>`;
}
const LOGO = `<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="116" fill="#EA580C"/>
  <g transform="rotate(-10 256 256)"><rect x="118" y="138" width="276" height="276" rx="64" fill="#7C2D12"/><rect x="118" y="110" width="276" height="276" rx="64" fill="#FFFDF5"/>
  <circle cx="190" cy="182" r="32" fill="#DB2777"/><circle cx="322" cy="182" r="32" fill="#2563EB"/><circle cx="256" cy="248" r="32" fill="#2C2520"/>
  <circle cx="190" cy="314" r="32" fill="#65A30D"/><circle cx="322" cy="314" r="32" fill="#CA8A04"/></g></svg>`;

const G = {
  esc: t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  hasard: n => Math.floor(Math.random() * n),
  melanger(t) {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = G.hasard(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  },
  lire(cle, defaut = null) {
    try { const v = JSON.parse(localStorage.getItem('games:' + cle)); return v ?? defaut; } catch (e) { return defaut; }
  },
  ecrire(cle, v) { try { localStorage.setItem('games:' + cle, JSON.stringify(v)); } catch (e) { /* mode privé */ } },

  // Tire n éléments jamais vus récemment (mémoire par jeu, remise à zéro quand tout a servi).
  tirer(cle, liste, n) {
    let vus = new Set(G.lire('vus:' + cle, []));
    let libres = liste.map((_, i) => i).filter(i => !vus.has(i));
    if (libres.length < n) { vus = new Set(); libres = liste.map((_, i) => i); }
    const pris = G.melanger(libres).slice(0, n);
    pris.forEach(i => vus.add(i));
    G.ecrire('vus:' + cle, [...vus]);
    return pris.map(i => liste[i]);
  },

  record(jeu, score) {
    const ancien = G.lire('record:' + jeu, 0);
    if (score > ancien) G.ecrire('record:' + jeu, score);
    return ancien;
  },

  // Liste de joueurs partagée par tous les jeux de groupe.
  joueurs: () => G.lire('joueurs', []),
  couleur: i => ['#DB2777', '#2563EB', '#EA580C', '#0D9488', '#65A30D', '#CA8A04', '#0891B2', '#DC2626', '#4B5563', '#9D174D'][i % 10],
  pastille: (nom, i) => `<span class="pastille-j" style="--pj:${G.couleur(i)}" aria-hidden="true">${G.esc(nom[0].toUpperCase())}</span>`,

  // Éditeur de joueurs monté dans el ; appelle maj() à chaque changement.
  editeurJoueurs(el, maj = () => {}, max = 16) {
    const rendre = () => {
      const J = G.joueurs();
      el.innerHTML = `<div class="joueurs">${J.map((nom, i) => `<div class="joueur">${G.pastille(nom, i)}
          <input value="${G.esc(nom)}" data-i="${i}" maxlength="18" aria-label="Nom du joueur ${i + 1}" enterkeyhint="done">
          <button class="suppr" data-suppr="${i}" aria-label="Retirer ${G.esc(nom)}">✕</button></div>`).join('')}</div>
        ${J.length < max ? `<form class="ajout" style="margin-top:10px"><input class="champ" placeholder="Prénom du joueur" maxlength="18" autocomplete="off" enterkeyhint="send" aria-label="Prénom du joueur à ajouter">
          <button class="btn vert" type="submit">Ajouter</button></form>` : ''}`;
    };
    el.addEventListener('submit', e => {
      e.preventDefault();
      const champ = el.querySelector('.ajout input');
      const nom = champ.value.trim().replace(/\s+/g, ' ');
      if (!nom) return;
      const J = G.joueurs();
      if (J.some(n => n.toLowerCase() === nom.toLowerCase())) return G.toast('Ce prénom est déjà pris');
      G.ecrire('joueurs', [...J, nom]);
      rendre(); maj();
      el.querySelector('.ajout input')?.focus();
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-suppr]');
      if (!b) return;
      const J = G.joueurs(); J.splice(+b.dataset.suppr, 1);
      G.ecrire('joueurs', J); rendre(); maj();
    });
    el.addEventListener('change', e => {
      const i = e.target.dataset.i;
      if (i === undefined) return;
      const J = G.joueurs(), nom = e.target.value.trim().replace(/\s+/g, ' ');
      if (!nom || J.some((n, k) => k !== +i && n.toLowerCase() === nom.toLowerCase())) { e.target.value = J[i]; return G.toast('Prénom vide ou déjà pris'); }
      J[i] = nom; G.ecrire('joueurs', J); rendre(); maj();
    });
    rendre();
  },

  modale(html) {
    const m = document.getElementById('modale');
    m.innerHTML = `<div class="boite" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    m.querySelector('button, input, textarea')?.focus({ preventScroll: true });
  },
  fermer() { const m = document.getElementById('modale'); m.hidden = true; m.innerHTML = ''; },

  toast(texte) {
    document.querySelector('.toast')?.remove();
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = texte;
    document.body.append(t);
    setTimeout(() => t.remove(), 2200);
  },
  vibrer(ms = 15) { try { navigator.vibrate?.(ms); } catch (e) { /* ignoré */ } },

  // Petits sons synthétisés (pas de fichier audio à charger).
  _audio: null,
  son(freq = 880, duree = 0.06, type = 'square', volume = 0.08) {
    try {
      const A = G._audio || (G._audio = new (window.AudioContext || window.webkitAudioContext)());
      const o = A.createOscillator(), g = A.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(volume, A.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + duree);
      o.connect(g).connect(A.destination); o.start(); o.stop(A.currentTime + duree);
    } catch (e) { /* audio indisponible */ }
  },

  fmt: n => Math.round(n).toLocaleString('fr-FR'),
  reduit: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// Barre du haut des pages de jeu : couleurs et pilule d'après <body data-jeu>.
(function habiller() {
  const id = document.body.dataset.jeu;
  const j = JEUX.find(x => x.id === id);
  if (j) {
    const s = document.documentElement.style;
    s.setProperty('--c', j.c[0]); s.setProperty('--c-clair', j.c[1]); s.setProperty('--c-bord', j.c[2]);
    const p = document.querySelector('.pilule-jeu');
    if (p) p.innerHTML = `${icone(id)}${j.nom}`;
  }
  const l = document.querySelector('.marque');
  if (l) l.innerHTML = `${LOGO}<span>Games</span>`;
  document.getElementById('modale')?.addEventListener('click', e => { if (e.target.id === 'modale') G.fermer(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !document.getElementById('modale')?.hidden) G.fermer(); });
})();

if ('serviceWorker' in navigator && location.protocol !== 'file:' && location.hostname !== 'localhost') {
  const racine = new URL(document.querySelector('link[rel=manifest]')?.getAttribute('href') || 'manifest.webmanifest', location).href.replace(/manifest\.webmanifest$/, '');
  navigator.serviceWorker.register(racine + 'sw.js', { scope: racine }).catch(() => {});
}

// Animation au toucher, rejouée à chaque appui même rapide (le seul :active est trop bref sur téléphone).
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('button, a, .choix, .tuile');
  if (!el || el.disabled) return;
  el.classList.remove('tape');
  void el.offsetWidth;
  el.classList.add('tape');
}, { passive: true });
document.addEventListener('animationend', e => { if (e.animationName === 'tape' || e.animationName === 'de') e.target.closest('.tape')?.classList.remove('tape'); });
// Les liens internes attendent la fin de l'animation avant de changer de page.
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || new URL(a.href).origin !== location.origin) return;
  if (G.reduit()) return;
  e.preventDefault();
  setTimeout(() => document.body.classList.add('sortie'), 120);
  setTimeout(() => { location.href = a.href; }, 300);
});
// Retour arrière sur une page restée en cache : on efface l'état de sortie.
addEventListener('pageshow', () => document.body.classList.remove('sortie'));
