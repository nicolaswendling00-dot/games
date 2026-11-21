// Construit tendance/data.js à partir de vraies séries : Google Books Ngram (corpus français),
// prénoms INSEE (fichier nat2022.csv téléchargé à part) et Banque mondiale.
// Usage : node outils/courbes.mjs <chemin/vers/nat2022.csv>
import { readFileSync, writeFileSync } from 'node:fs';

const NGRAM = [
  // [mot, titre, début, coupe]
  ['internet', 'Le mot « internet » dans les livres', 1960, 1995],
  ['intelligence artificielle', 'L\'expression « intelligence artificielle » dans les livres', 1950, 1990],
  ['ordinateur', 'Le mot « ordinateur » dans les livres', 1940, 1975],
  ['télévision', 'Le mot « télévision » dans les livres', 1900, 1950],
  ['écologie', 'Le mot « écologie » dans les livres', 1900, 1968],
  ['réchauffement climatique', 'L\'expression « réchauffement climatique » dans les livres', 1960, 2000],
  ['chômage', 'Le mot « chômage » dans les livres', 1900, 1970],
  ['mondialisation', 'Le mot « mondialisation » dans les livres', 1960, 1992],
  ['terrorisme', 'Le mot « terrorisme » dans les livres', 1900, 1965],
  ['Napoléon', 'Le nom « Napoléon » dans les livres', 1850, 1930],
  ['Staline', 'Le nom « Staline » dans les livres', 1900, 1940],
  ['Einstein', 'Le nom « Einstein » dans les livres', 1900, 1950],
  ['smartphone', 'Le mot « smartphone » dans les livres', 1990, 2010],
  ['féminisme', 'Le mot « féminisme » dans les livres', 1880, 1960],
  ['nucléaire', 'Le mot « nucléaire » dans les livres', 1900, 1955],
  ['vélo', 'Le mot « vélo » dans les livres', 1880, 1950],
  ['radio', 'Le mot « radio » dans les livres', 1890, 1935],
  ['bonheur', 'Le mot « bonheur » dans les livres', 1800, 1900],
  ['Dieu', 'Le mot « Dieu » dans les livres', 1800, 1900],
  ['communisme', 'Le mot « communisme » dans les livres', 1880, 1945],
  ['robot', 'Le mot « robot » dans les livres', 1900, 1960],
  ['Europe', 'Le mot « Europe » dans les livres', 1850, 1940],
  ['start-up', 'Le mot « start-up » dans les livres', 1980, 1998],
  ['végétarien', 'Le mot « végétarien » dans les livres', 1900, 1990],
];

const PRENOMS = [
  // [prénom, sexe (1 garçon, 2 fille), début, coupe]
  ['ACHILLE', 1, 1900, 1990], ['KEVIN', 1, 1960, 1985], ['NICOLAS', 1, 1940, 1970], ['LEA', 2, 1960, 1990],
  ['EMMA', 2, 1960, 1995], ['JADE', 2, 1970, 1998], ['MARIE', 2, 1900, 1940], ['JEAN', 1, 1900, 1945],
  ['DYLAN', 1, 1970, 1990], ['ENZO', 1, 1970, 1995], ['LOUISE', 2, 1900, 1990], ['GABRIEL', 1, 1900, 1985],
  ['KYLIAN', 1, 1990, 2010], ['NATHALIE', 2, 1930, 1960], ['THIERRY', 1, 1930, 1955], ['INES', 2, 1970, 1995],
  ['LUCAS', 1, 1960, 1985], ['ROSE', 2, 1900, 1995], ['CAMILLE', 2, 1950, 1980], ['JORDAN', 1, 1970, 1990],
  ['ARYA', 2, 2005, 2014], ['BRIGITTE', 2, 1920, 1945], ['NOAH', 1, 1985, 2005], ['MANON', 2, 1960, 1985],
];

const BANQUE = [
  // [pays, indicateur, titre, unité, coupe]
  ['FRA', 'SP.DYN.LE00.IN', 'Espérance de vie à la naissance en France', 'ans', 1995],
  ['WLD', 'SP.POP.TOTL', 'Population mondiale', 'milliards d\'habitants', 1990],
  ['FRA', 'SP.DYN.TFRT.IN', 'Nombre d\'enfants par femme en France', 'enfants par femme', 1985],
  ['FRA', 'IT.NET.USER.ZS', 'Part des Français qui utilisent internet', '% de la population', 2002],
  ['FRA', 'IT.CEL.SETS.P2', 'Abonnements de téléphone mobile en France', 'pour 100 habitants', 1996],
  ['CHN', 'NY.GDP.PCAP.CD', 'Richesse produite par habitant en Chine', 'dollars par an', 2000],
  ['NGA', 'SP.POP.TOTL', 'Population du Nigeria', 'millions d\'habitants', 1995],
  ['WLD', 'SP.DYN.IMRT.IN', 'Mortalité des bébés dans le monde', 'décès pour 1 000 naissances', 2005],
  ['CHN', 'SP.DYN.LE00.IN', 'Espérance de vie à la naissance en Chine', 'ans', 1985],
  ['JPN', 'SP.POP.65UP.TO.ZS', 'Part des plus de 65 ans au Japon', '% de la population', 1990],
  ['FRA', 'SL.UEM.TOTL.ZS', 'Taux de chômage en France', '% de la population active', 2005],
  ['IND', 'SP.URB.TOTL.IN.ZS', 'Part des Indiens qui vivent en ville', '% de la population', 1990],
];

const arrondi = v => +v.toPrecision(3);
const series = [];

for (const [mot, titre, debut, coupe] of NGRAM) {
  const url = `https://books.google.com/ngrams/json?content=${encodeURIComponent(mot)}&year_start=${debut}&year_end=2022&corpus=fr&smoothing=3&case_insensitive=true`;
  const json = await (await fetch(url)).json();
  // Avec case_insensitive, l'entrée « (All) » additionne les variantes de casse.
  const e = json.find(x => x.ngram.endsWith('(All)')) || json[0];
  if (!e) { console.warn('ngram vide', mot); continue; }
  series.push({ titre, unite: 'occurrences par million de mots', source: 'Google Books Ngram, livres en français',
    debut, coupe, v: e.timeseries.map(x => arrondi(x * 1e6)) });
  await new Promise(r => setTimeout(r, 400));
}

const csv = readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
for (const [nom, sexe, debut, coupe] of PRENOMS) {
  const par = {};
  for (const l of csv) {
    const [s, p, a, n] = l.split(';');
    if (p === nom && +s === sexe && a !== 'XXXX') par[a] = +n;
  }
  const v = [];
  for (let a = debut; a <= 2022; a++) v.push(par[a] || 0);
  const joli = { LEA: 'Léa', INES: 'Inès' }[nom] || nom[0] + nom.slice(1).toLowerCase();
  series.push({ titre: `${sexe === 1 ? 'Garçons prénommés' : 'Filles prénommées'} ${joli} en France`,
    unite: 'naissances par an', source: 'INSEE, fichier des prénoms', debut, coupe, v });
}

for (const [pays, ind, titre, unite, coupe] of BANQUE) {
  const json = await (await fetch(`https://api.worldbank.org/v2/country/${pays}/indicator/${ind}?format=json&per_page=200`)).json();
  const pts = json[1].filter(x => x.value !== null).map(x => [+x.date, x.value]).sort((a, b) => a[0] - b[0]);
  const div = unite.startsWith('milliards') ? 1e9 : unite.startsWith('millions') ? 1e6 : 1;
  const debut = pts[0][0], fin = pts.at(-1)[0];
  const v = [];
  for (let a = debut; a <= fin; a++) { const p = pts.find(x => x[0] === a); v.push(p ? arrondi(p[1] / div) : null); }
  // Trous isolés : on relie les voisins.
  v.forEach((x, i) => { if (x === null) v[i] = v[i - 1] ?? v[i + 1]; });
  series.push({ titre, unite, source: 'Banque mondiale', debut, coupe, v });
}

for (const s of series) {
  const fin = s.debut + s.v.length - 1;
  console.assert(s.coupe > s.debut + 5 && s.coupe < fin - 4, 'coupe mal placée', s.titre, s.debut, s.coupe, fin);
  console.assert(s.v.every(x => Number.isFinite(x)), 'valeur manquante', s.titre);
}
writeFileSync(new URL('../tendance/data.js', import.meta.url),
  `// Généré par outils/courbes.mjs, ne pas modifier à la main.\n// v : une valeur par an à partir de debut ; le joueur voit jusqu'à coupe.\nconst SERIES = ${JSON.stringify(series)};\n`);
console.log(series.length, 'séries');
