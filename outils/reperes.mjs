// Construit decades/data-wikidata.js : des repères réels tirés de Wikidata, valeurs ramenées en unités SI.
// Usage : node outils/reperes.mjs
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
// Cache des réponses par requête : relancer le script ne refait que celles qui ont échoué.
const CACHE = new URL('./reperes-cache.json', import.meta.url);
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};

// [dimension, gabarit du nom, propriété, filtre SPARQL sur ?i, minimum de liens wiki, limite, échelle humaine]
const CLASSES = c => `VALUES ?c { ${c.map(x => 'wd:' + x).join(' ')} } ?i wdt:P31 ?c.`;
const REQUETES = [
  ['nombre', 'Habitants de {}', 'P1082', CLASSES(['Q1549591', 'Q1637706', 'Q200250']), 40, 400, 1],
  ['nombre', 'Habitants du pays : {}', 'P1082', CLASSES(['Q6256', 'Q3624078']), 40, 200, 1],
  ['nombre', 'Locuteurs : {}', 'P1098', '', 80, 120, 1],
  ['nombre', 'Salariés de {}', 'P1128', CLASSES(['Q4830453', 'Q891723', 'Q6881511', 'Q783794']), 60, 150, 1],
  ['nombre', 'Visiteurs par an : {}', 'P1174', '', 30, 120, 1],
  ['nombre', 'Places dans le stade : {}', 'P1083', CLASSES(['Q483110', 'Q1076486']), 25, 120, 1],
  ['nombre', 'Étages de {}', 'P1101', CLASSES(['Q11303', 'Q41176', 'Q1021645']), 25, 80, 1],
  ['longueur', 'Hauteur de {}', 'P2048', CLASSES(['Q11303', 'Q12518', 'Q41176', 'Q179700', 'Q4989906', 'Q11166728', 'Q2977', 'Q16970']), 25, 250, 1],
  ['longueur', 'Taille de {}', 'P2048', CLASSES(['Q5']), 120, 150, 1],
  ['longueur', 'Longueur : {}', 'P2043', CLASSES(['Q4022', 'Q12280', 'Q44377', 'Q11446', 'Q34442', 'Q12284', 'Q1248784']), 35, 300, 1],
  ['longueur', 'Altitude : {}', 'P2044', CLASSES(['Q8502', 'Q8072', 'Q46831']), 50, 150, 1],
  ['longueur', 'Rayon de {}', 'P2120', '', 40, 120, 0],
  ['longueur', 'Distance de {} à la Terre', 'P2583', '', 40, 150, 0],
  ['surface', 'Superficie : {}', 'P2046', CLASSES(['Q6256', 'Q3624078', 'Q23442', 'Q23397', 'Q46169', 'Q35666', 'Q165', 'Q39594']), 50, 350, 1],
  ['masse', 'Masse : {}', 'P2067', 'MINUS { ?i wdt:P31 wd:Q5 }', 60, 250, 1],
  ['duree', 'Durée du film {}', 'P2047', CLASSES(['Q11424']), 90, 220, 1],
  ['duree', 'Durée de la chanson {}', 'P2047', CLASSES(['Q7366', 'Q134556']), 45, 120, 1],
  ['duree', 'Demi-vie : {}', 'P2114', '', 6, 160, 0],
  ['duree', 'Espérance de vie : {}', 'P2250', '', 40, 100, 1],
  ['puissance', 'Puissance : {}', 'P2109', '', 15, 200, 1],
  ['vitesse', 'Vitesse maximale : {}', 'P2052', '', 20, 150, 1],
];

const pause = ms => new Promise(r => setTimeout(r, ms));
async function sparql(q) {
  for (let essai = 0; essai < 2; essai++) {
    const r = await fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(q), {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'GamesDecades/1.0 (projet personnel, jeu d\'ordres de grandeur)' },
      signal: AbortSignal.timeout(75000) }).catch(e => ({ ok: false, status: e.name }));
    if (r.ok) return (await r.json()).results.bindings;
    console.warn('  essai', essai + 1, r.status);
    await pause(5000 * (essai + 1));
  }
  return [];
}

const extra = [], vus = new Set();
for (const [d, gabarit, prop, filtre, minSl, limite, h] of REQUETES) {
  const q = `SELECT ?i ?l (MAX(?v) AS ?val) (MAX(?sl) AS ?n) WHERE {
    ${filtre}
    ?i wikibase:sitelinks ?sl. FILTER(?sl >= ${minSl})
    ?i p:${prop} ?st. ?st ${d === 'nombre' ? 'ps:' + prop : 'psn:' + prop + '/wikibase:quantityAmount'} ?v; wikibase:rank ?r. FILTER(?r != wikibase:DeprecatedRank)
    ?i rdfs:label ?l. FILTER(LANG(?l) = "fr")
  } GROUP BY ?i ?l ORDER BY DESC(?n) LIMIT ${limite}`;
  const cle0 = prop + gabarit;
  const enCache = !!cache[cle0];
  // HORS_LIGNE=1 : on n'utilise que les réponses déjà en cache.
  const res = cache[cle0] || (process.env.HORS_LIGNE ? [] : await sparql(q));
  if (res.length) { cache[cle0] = res; writeFileSync(CACHE, JSON.stringify(cache)); }
  let n = 0;
  for (const b of res) {
    const v = +b.val.value, l = b.l.value;
    if (!(v > 0) || !Number.isFinite(v) || /^Q\d+$/.test(l)) continue;
    if (prop === 'P2067' && v < 1e-20) continue;   // masses de molécules : trompeuses sous un nom de substance
    const nom = gabarit.replace('{}', l);
    const cle = d + '|' + nom.toLowerCase();
    if (vus.has(cle)) continue;
    vus.add(cle);
    extra.push([d, nom, +v.toPrecision(4), h]);
    n++;
  }
  console.log(prop, gabarit, n);
  if (!enCache && !process.env.HORS_LIGNE) await pause(4000);
}

writeFileSync(new URL('../decades/data-wikidata.js', import.meta.url),
  `// Généré par outils/reperes.mjs à partir de Wikidata, ne pas modifier à la main. [dimension, nom, valeur SI, échelle humaine]\nconst EXTRA = ${JSON.stringify(extra).replace(/\],\[/g, '],\n[')};\n`);
console.log(extra.length, 'repères');
