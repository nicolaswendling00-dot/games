// Construit tendance/data.js à partir de vraies séries : Google Books Ngram (corpus français),
// prénoms INSEE (fichier nat2022.csv téléchargé à part) et Banque mondiale.
// Usage : node outils/courbes.mjs <chemin/vers/nat2022.csv>
import { readFileSync, writeFileSync } from 'node:fs';

// Mots et expressions suivis dans les livres en français, depuis 1900 sauf mention [mot, début].
const MOTS = [
  // Techniques
  'internet', 'ordinateur', 'smartphone', 'télévision', 'radio', 'téléphone portable', 'intelligence artificielle', 'robot', 'algorithme',
  'logiciel', 'informatique', 'numérique', 'courriel', 'site web', 'réseaux sociaux', 'Facebook', 'Google', 'Wikipédia', 'blog', 'wifi',
  'jeu vidéo', 'console', 'disquette', 'cassette', 'magnétoscope', 'DVD', 'CD-ROM', 'minitel', 'fax', 'télégramme', 'télégraphe',
  'machine à écrire', 'photocopie', 'appareil photo', 'cinéma', 'cinématographe', 'gramophone', 'phonographe', 'microsillon', 'baladeur',
  'électricité', 'automobile', 'voiture', 'avion', 'aéroplane', 'dirigeable', 'fusée', 'satellite', 'TGV', 'métro', 'tramway', 'trottinette',
  'vélo', 'bicyclette', 'moto', 'autoroute', 'parking', 'embouteillage', 'diligence', 'calèche', 'paquebot', 'locomotive', 'nucléaire',
  'atome', 'laser', 'transistor', 'microprocesseur', 'nanotechnologie', 'drone', 'imprimante 3D', 'blockchain', 'bitcoin', 'cloud',
  'start-up', 'application mobile', 'GPS', 'tablette', 'écran', 'pixel', 'virus informatique', 'cybersécurité', 'données personnelles',
  // Société et politique
  'chômage', 'mondialisation', 'terrorisme', 'féminisme', 'racisme', 'écologie', 'réchauffement climatique', 'changement climatique',
  'développement durable', 'biodiversité', 'pollution', 'recyclage', 'énergie renouvelable', 'éolienne', 'panneau solaire', 'transition énergétique',
  'communisme', 'socialisme', 'capitalisme', 'libéralisme', 'néolibéralisme', 'fascisme', 'nazisme', 'anarchisme', 'colonialisme', 'décolonisation',
  'démocratie', 'république', 'monarchie', 'dictature', 'populisme', 'nationalisme', 'patriotisme', 'laïcité', 'citoyenneté', 'égalité',
  'liberté', 'fraternité', 'solidarité', 'tolérance', 'droits de l\'homme', 'droits humains', 'immigration', 'intégration', 'identité',
  'discrimination', 'harcèlement', 'inclusion', 'diversité', 'parité', 'homosexualité', 'mariage pour tous', 'divorce', 'célibataire',
  'famille recomposée', 'retraite', 'sécurité sociale', 'syndicat', 'grève', 'manifestation', 'Union européenne', 'Communauté européenne',
  'Société des Nations', 'ONU', 'OTAN', 'guerre froide', 'mur de Berlin', 'Tiers-Monde', 'pays en développement', 'croissance économique',
  'inflation', 'crise économique', 'dette publique', 'euro', 'franc', 'pouvoir d\'achat', 'consommation', 'publicité', 'marketing', 'supermarché',
  'hypermarché', 'banlieue', 'gentrification', 'télétravail', 'confinement', 'pandémie', 'épidémie', 'vaccin', 'coronavirus', 'sida', 'cancer',
  'tuberculose', 'choléra', 'grippe', 'obésité', 'diabète', 'dépression', 'burn-out', 'stress', 'anxiété', 'bien-être', 'développement personnel',
  'méditation', 'yoga', 'végétarien', 'végan', 'bio', 'malbouffe', 'restauration rapide', 'pizza', 'hamburger', 'sushi', 'kebab', 'quinoa',
  'avocat', 'chocolat', 'café', 'thé', 'tabac', 'cigarette', 'alcoolisme', 'drogue', 'cannabis',
  // Idées et culture
  'bonheur', 'Dieu', 'âme', 'péché', 'prière', 'église', 'religion', 'athéisme', 'islam', 'bouddhisme', 'spiritualité', 'morale', 'éthique',
  'vertu', 'honneur', 'patrie', 'devoir', 'progrès', 'modernité', 'postmodernité', 'existentialisme', 'structuralisme', 'surréalisme',
  'impressionnisme', 'cubisme', 'romantisme', 'psychanalyse', 'inconscient', 'sexualité', 'érotisme', 'amour', 'amitié', 'solitude', 'ennui',
  'nostalgie', 'mélancolie', 'empathie', 'résilience', 'bienveillance', 'charisme', 'leadership', 'management', 'entrepreneur', 'innovation',
  'créativité', 'performance', 'compétence', 'efficacité', 'rentabilité', 'productivité', 'carrière', 'stage', 'CV', 'diplôme', 'baccalauréat',
  'université', 'grandes écoles', 'lycée', 'instituteur', 'professeur des écoles', 'jazz', 'rock', 'rap', 'hip-hop', 'disco', 'techno', 'opéra',
  'bande dessinée', 'manga', 'roman policier', 'science-fiction', 'série télévisée', 'téléréalité', 'football', 'rugby', 'tennis', 'cyclisme',
  'Tour de France', 'Jeux olympiques', 'marathon', 'jogging', 'fitness', 'ski', 'surf', 'vacances', 'tourisme', 'congés payés', 'camping', 'week-end',
  'loisirs', 'shopping', 'mode', 'jean', 'tatouage', 'piercing', 'selfie', 'influenceur', 'youtubeur', 'podcast', 'streaming',
  // Personnes et lieux
  'Napoléon', 'Staline', 'Hitler', 'de Gaulle', 'Mitterrand', 'Churchill', 'Lénine', 'Mao', 'Gandhi', 'Mandela', 'Kennedy', 'Obama', 'Poutine',
  'Einstein', 'Freud', 'Marx', 'Nietzsche', 'Sartre', 'Camus', 'Foucault', 'Picasso', 'Victor Hugo', 'Balzac', 'Zola', 'Proust', 'Voltaire',
  'Rousseau', 'Molière', 'Darwin', 'Pasteur', 'Marie Curie', 'Jeanne d\'Arc', 'Louis XIV', 'Charlemagne', 'Jésus', 'Bouddha', 'Mozart',
  'Beethoven', 'Chaplin', 'Elvis', 'Beatles', 'Amérique', 'Russie', 'URSS', 'Chine', 'Japon', 'Inde', 'Algérie', 'Indochine', 'Vietnam',
  'Afghanistan', 'Irak', 'Allemagne', 'Prusse', 'Angleterre', 'Europe', 'Afrique', 'Paris', 'Versailles', 'Hollywood', 'Silicon Valley',
  // Vie quotidienne
  'réfrigérateur', 'machine à laver', 'aspirateur', 'micro-ondes', 'lave-vaisselle', 'climatisation', 'chauffage central', 'gaz', 'charbon',
  'pétrole', 'essence', 'bougie', 'lampe à pétrole', 'ampoule', 'salle de bains', 'douche', 'baignoire', 'brosse à dents', 'shampooing',
  'déodorant', 'parfum', 'maquillage', 'chapeau', 'corset', 'cravate', 'baskets', 'lunettes de soleil', 'parapluie', 'montre', 'carte bleue',
  'chèque', 'monnaie', 'billet', 'timbre', 'lettre', 'carte postale', 'facteur', 'domestique', 'bonne', 'nourrice', 'crèche', 'baby-sitter',
  'adolescent', 'jeunesse', 'vieillesse', 'senior', 'retraité', 'grand-père', 'grand-mère', 'enfant', 'bébé', 'animal de compagnie', 'chat', 'chien',
];

const PAYS = { FRA: 'France', USA: 'États-Unis', CHN: 'Chine', IND: 'Inde', BRA: 'Brésil', NGA: 'Nigeria', JPN: 'Japon', DEU: 'Allemagne',
  KOR: 'Corée du Sud', ETH: 'Éthiopie', WLD: 'Monde', RUS: 'Russie', MEX: 'Mexique', ZAF: 'Afrique du Sud', EGY: 'Égypte', GBR: 'Royaume-Uni', ITA: 'Italie' };
const INDICATEURS = [
  ['SP.DYN.LE00.IN', 'Espérance de vie à la naissance', 'ans'],
  ['SP.DYN.TFRT.IN', 'Nombre d\'enfants par femme', 'enfants par femme'],
  ['SP.POP.TOTL', 'Population', 'millions d\'habitants'],
  ['NY.GDP.PCAP.CD', 'Richesse produite par habitant', 'dollars par an'],
  ['SP.URB.TOTL.IN.ZS', 'Part de la population vivant en ville', '% de la population'],
  ['IT.NET.USER.ZS', 'Part de la population qui utilise internet', '% de la population'],
  ['IT.CEL.SETS.P2', 'Abonnements de téléphone mobile', 'pour 100 habitants'],
  ['SP.POP.65UP.TO.ZS', 'Part des plus de 65 ans', '% de la population'],
  ['SP.DYN.IMRT.IN', 'Mortalité des bébés', 'décès pour 1 000 naissances'],
  ['EG.ELC.ACCS.ZS', 'Part de la population qui a l\'électricité', '% de la population'],
  ['NV.AGR.TOTL.ZS', 'Poids de l\'agriculture dans l\'économie', '% du PIB'],
  ['SL.TLF.CACT.FE.ZS', 'Part des femmes qui travaillent ou cherchent un emploi', '% des femmes de plus de 15 ans'],
  ['AG.LND.FRST.ZS', 'Part du territoire couverte de forêts', '% du territoire'],
  ['SP.DYN.CBRT.IN', 'Naissances par an', 'pour 1 000 habitants'],
];

const arrondi = v => +v.toPrecision(3);
// Coupe entre 55 % et 72 % de la période, variable d'une série à l'autre mais stable d'un lancement à l'autre.
const hache = t => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const coupe = (titre, debut, fin) => debut + Math.round((fin - debut) * (0.55 + (hache(titre) % 18) / 100));
const series = [];
const pause = ms => new Promise(r => setTimeout(r, ms));

// Ngram : 10 mots par requête.
for (let i = 0; i < MOTS.length; i += 10) {
  const lot = MOTS.slice(i, i + 10);
  const url = `https://books.google.com/ngrams/json?content=${encodeURIComponent(lot.join(','))}&year_start=1900&year_end=2022&corpus=fr&smoothing=3&case_insensitive=true`;
  let json;
  for (let essai = 0; essai < 4; essai++) {
    const r = await fetch(url);
    if (r.ok) { json = await r.json(); break; }
    await pause(3000 * (essai + 1));
  }
  if (!json) { console.warn('lot ignoré', lot); continue; }
  for (const mot of lot) {
    const e = json.find(x => x.ngram === `${mot} (All)`) || json.find(x => x.ngram.toLowerCase() === mot.toLowerCase());
    if (!e) continue;
    let v = e.timeseries.map(x => arrondi(x * 1e6));
    if (Math.max(...v) < 0.05) continue;                       // trop rare pour faire une courbe lisible
    let debut = 1900;
    const k = v.findIndex(x => x >= Math.max(...v) * 0.02);    // on démarre peu avant l'apparition du mot
    if (k > 10) { debut = 1900 + k - 10; v = v.slice(k - 10); }
    const titre = /^[A-ZÉ]/.test(mot) && !/^(TGV|GPS|DVD|CD-ROM|ONU|OTAN|URSS|CV|Union|Communauté|Société|Tiers|Tour|Jeux|Silicon|Google|Facebook|Wikipédia)/.test(mot)
      ? `Le nom « ${mot} » dans les livres` : `« ${mot} » dans les livres`;
    series.push({ titre, unite: 'occurrences par million de mots', source: 'Google Books Ngram, livres en français', debut, coupe: coupe(titre, debut, 2022), v });
  }
  await pause(700);
  process.stdout.write('.');
}
console.log('\nngram', series.length);

// Prénoms : les 240 prénoms qui ont atteint les plus hauts pics annuels depuis 1900.
const parNom = new Map();
for (const l of readFileSync(process.argv[2], 'utf8').split(/\r?\n/).slice(1)) {
  const [s, p, a, n] = l.split(';');
  if (!p || p.startsWith('_') || a === 'XXXX' || p.length < 2) continue;
  const cle = s + ';' + p;
  if (!parNom.has(cle)) parNom.set(cle, {});
  parNom.get(cle)[a] = +n;
}
const joli = p => p.toLowerCase().replace(/(^|[-\s])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
const candidats = [...parNom].map(([cle, par]) => ({ cle, par, pic: Math.max(...Object.values(par)) })).sort((a, b) => b.pic - a.pic).slice(0, 240);
for (const { cle, par, pic } of candidats) {
  const [sexe, p] = cle.split(';');
  const v = [];
  for (let a = 1900; a <= 2022; a++) v.push(par[a] || 0);
  let k = v.findIndex(x => x >= pic * 0.03);
  let debut = Math.max(1900, 1900 + k - 10);
  if (2022 - debut < 35) debut = 1987;
  const titre = `${sexe === '1' ? 'Garçons prénommés' : 'Filles prénommées'} ${joli(p)} en France`;
  series.push({ titre, unite: 'naissances par an', source: 'INSEE, fichier des prénoms', debut, coupe: coupe(titre, debut, 2022), v: v.slice(debut - 1900) });
}
console.log('prénoms', candidats.length);

// Banque mondiale.
let nbBM = 0;
for (const [ind, nom, unite] of INDICATEURS) {
  for (const [code, pays] of Object.entries(PAYS)) {
    let u = unite, div = 1;
    if (ind === 'SP.POP.TOTL' && code === 'WLD') { u = 'milliards d\'habitants'; div = 1e9; }
    else if (ind === 'SP.POP.TOTL') div = 1e6;
    let json;
    try { json = await (await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${ind}?format=json&per_page=200`)).json(); } catch { continue; }
    const pts = (json[1] || []).filter(x => x.value !== null).map(x => [+x.date, x.value]).sort((a, b) => a[0] - b[0]);
    if (pts.length < 25) continue;
    const debut = pts[0][0], fin = pts.at(-1)[0], par = Object.fromEntries(pts);
    const v = [];
    for (let a = debut; a <= fin; a++) v.push(par[a] !== undefined ? arrondi(par[a] / div) : null);
    v.forEach((x, i) => { if (x === null) v[i] = v[i - 1] ?? v[i + 1]; });
    if (v.some(x => x === null || x === undefined)) continue;
    const titre = `${nom} : ${pays}`;
    series.push({ titre, unite: u, source: 'Banque mondiale', debut, coupe: coupe(titre, debut, fin), v });
    nbBM++;
  }
}
console.log('banque mondiale', nbBM);

for (const s of series) {
  const fin = s.debut + s.v.length - 1;
  console.assert(s.coupe > s.debut + 5 && s.coupe < fin - 4, 'coupe mal placée', s.titre, s.debut, s.coupe, fin);
  console.assert(s.v.every(x => Number.isFinite(x) && x >= 0), 'valeur manquante', s.titre);
}
writeFileSync(new URL('../tendance/data.js', import.meta.url),
  `// Généré par outils/courbes.mjs, ne pas modifier à la main.\n// v : une valeur par an à partir de debut ; le joueur voit jusqu'à coupe.\nconst SERIES = ${JSON.stringify(series)};\n`);
console.log(series.length, 'séries');
