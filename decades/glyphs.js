// Silhouettes des longueurs : [largeur viewBox, hauteur viewBox, cote mesurée, dessin].
// La valeur de l'objet est sa hauteur ('h'), sa largeur ('w') ou son rayon ('r') : la boîte colle au dessin.
const T = 'var(--text-2)';
const disc = (fill, extra = '') => [100, 100, 'w', `<circle cx="50" cy="50" r="50" fill="${fill}"/>${extra}`];
const dist = [100, 6, 'w', `<rect x="3" y="2.2" width="94" height="1.6" fill="${T}"/><circle cx="3" cy="3" r="3" fill="${T}"/><circle cx="97" cy="3" r="3" fill="${T}"/>`];

const GL = {
  planck: [100, 100, 'w', '<circle cx="50" cy="50" r="48" fill="none" stroke="#8FA6FF" stroke-width="4" stroke-dasharray="6 6"/><circle cx="50" cy="50" r="14" fill="#8FA6FF" opacity=".5"/>'],
  proton: disc('#E0565B', '<circle cx="35" cy="38" r="11" fill="#F6B0B3"/><circle cx="65" cy="38" r="11" fill="#F6B0B3"/><circle cx="50" cy="66" r="11" fill="#7FB7FF"/>'),
  atome: disc('rgba(127,183,255,.22)', '<ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#7FB7FF" stroke-width="2.5"/><circle cx="50" cy="50" r="4" fill="#E0565B"/><circle cx="96" cy="50" r="3.5" fill="#7FB7FF"/>'),
  adn: [40, 100, 'w', '<path d="M2 0C2 12 38 13 38 25S2 38 2 50s36 13 36 25S2 88 2 100" fill="none" stroke="#5EC8E5" stroke-width="3.5"/><path d="M38 0C38 12 2 13 2 25s36 13 36 25S2 63 2 75s36 13 36 25" fill="none" stroke="#F2B807" stroke-width="3.5"/><path d="M8 6h24M8 19h24M8 31h24M8 44h24M8 56h24M8 69h24M8 81h24M8 94h24" stroke="var(--text-3)" stroke-width="2"/>'],
  virus: [100, 100, 'w', '<g stroke="#D16F8E" stroke-width="4">' + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<line x1="${50 + 36 * c}" y1="${50 + 36 * s}" x2="${50 + 46 * c}" y2="${50 + 46 * s}"/>`; }).join('') + '</g><circle cx="50" cy="50" r="36" fill="#D16F8E"/>' + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<circle cx="${50 + 46 * Math.cos(a)}" cy="${50 + 46 * Math.sin(a)}" r="4" fill="#F0A5BC"/>`; }).join('')],
  onde: [100, 40, 'w', '<path d="M0 20C12.5 -6 37.5 -6 50 20S87.5 46 100 20" fill="none" stroke="#5ED16F" stroke-width="4"/>'],
  ecoli: [100, 40, 'w', '<rect width="100" height="40" rx="20" fill="#7BB662"/><rect x="14" y="12" width="72" height="16" rx="8" fill="#9BCF80"/>'],
  globule: disc('#C8313D', '<circle cx="50" cy="50" r="26" fill="#E0606A"/>'),
  cheveu: [20, 100, 'w', '<rect width="20" height="100" rx="3" fill="#7A5230"/><rect x="5" width="3" height="100" fill="#9C6E45"/>'],
  sel: [100, 100, 'w', '<path d="M0 22 30 0h70v78L70 100H0z" fill="#C9D3DE"/><path d="M0 22h70v78H0z" fill="#EEF2F6"/><path d="M70 22 100 0v78L70 100z" fill="#AEB9C6"/>'],
  fourmi: [100, 44, 'w', `<g stroke="${T}" stroke-width="3" fill="none"><path d="M40 26 28 44M44 26l-6 18M48 26l10 18M42 22 30 6M50 22l4-16M8 14 0 2M12 12 14 0"/></g><ellipse cx="12" cy="20" rx="12" ry="10" fill="${T}"/><ellipse cx="44" cy="24" rx="14" ry="7" fill="${T}"/><ellipse cx="78" cy="26" rx="22" ry="14" fill="${T}"/>`],
  piece: disc('#B88A1E', '<circle cx="50" cy="50" r="34" fill="#D8B24A"/><circle cx="50" cy="50" r="34" fill="none" stroke="#9C7416" stroke-width="3"/>'),
  telephone: [50, 100, 'h', `<rect width="50" height="100" rx="8" fill="${T}"/><rect x="4" y="6" width="42" height="86" rx="4" fill="var(--surface-3)"/><rect x="18" y="2" width="14" height="2" rx="1" fill="var(--surface-3)"/>`],
  humain: [40, 100, 'h', `<circle cx="20" cy="9" r="8.5" fill="${T}"/><path d="M11 20h18a5 5 0 0 1 5 5v31h-5V40h-1v60h-6.5V64h-3v36H12V40h-1v16H6V25a5 5 0 0 1 5-5z" fill="${T}"/>`],
  girafe: [70, 100, 'h', '<path d="M44 0h4v6h-4zM52 0h4v6h-4z" fill="#A8762C"/><ellipse cx="54" cy="10" rx="14" ry="6" fill="#D9A441"/><path d="M46 12h12L48 60H38z" fill="#D9A441"/><rect x="6" y="54" width="46" height="18" rx="8" fill="#D9A441"/><path d="M9 68h5v32H9zM20 68h5v32h-5zM36 68h5v32h-5zM45 68h5v32h-5z" fill="#D9A441"/><path d="M0 58 7 62" stroke="#D9A441" stroke-width="3"/><circle cx="20" cy="62" r="3" fill="#A8762C"/><circle cx="34" cy="60" r="3" fill="#A8762C"/><circle cx="46" cy="40" r="2.5" fill="#A8762C"/>'],
  bus: [100, 32, 'w', '<rect width="100" height="26" rx="4" fill="#E0A800"/><path d="M6 5h14v9H6zM24 5h14v9H24zM42 5h14v9H42zM60 5h14v9H60zM80 5h14v13H80z" fill="#3B4A5C"/><circle cx="20" cy="26" r="6" fill="#1C2029"/><circle cx="80" cy="26" r="6" fill="#1C2029"/>'],
  baleine: [100, 30, 'w', '<path d="M0 14C10 2 48 0 78 9l12-8 10 2-8 10 8 10-10 1-12-8C58 28 18 30 0 14z" fill="#4A78A8"/><path d="M4 18c16 8 40 9 60 5" stroke="#7FA3C8" stroke-width="2" fill="none"/><circle cx="14" cy="12" r="1.8" fill="#1C2029"/>'],
  terrain: [100, 8, 'w', '<rect width="100" height="8" fill="#3C8D3C"/><path d="M50 0v8M0 .6h100M0 7.4h100" stroke="#CFE8CF" stroke-width=".8"/>'],
  eiffel: [60, 100, 'h', '<path d="M29 0h2l2 20 4 22 9 26 14 32H44c-4-10-8-14-14-14s-10 4-14 14H0l14-32 9-26 4-22z" fill="#8A6E4B"/><path d="M14 66h32v4H14zM22 40h16v3H22z" fill="#6E5638"/>'],
  burj: [20, 100, 'h', '<path d="M9.6 0h.8l.6 18 1.4 18 1.6 20 2 22L20 100H0l4-22 2-22 1.6-20L9 18z" fill="#9DB3C8"/><path d="M10 30v70" stroke="#C9D8E6" stroke-width="1"/>'],
  pont: [100, 30, 'w', '<path d="M0 0h5v30H0zM95 0h5v30h-5z" fill="#C0362C"/><path d="M0 22h100v2.5H0z" fill="#C0362C"/><path d="M2.5 1Q50 34 97.5 1" fill="none" stroke="#C0362C" stroke-width="1.5"/>'],
  troudenoir: [100, 100, 'r', '<circle cx="50" cy="50" r="50" fill="#F7B32B" opacity=".25"/><circle cx="50" cy="50" r="40" fill="#000"/><circle cx="50" cy="50" r="42" fill="none" stroke="#F7B32B" stroke-width="3"/>'],
  montagne: [100, 60, 'h', '<path d="M0 60 36 12l8 8L58 0l42 60z" fill="#7C8696"/><path d="M48 13 58 0l10 14-6-2-4 5-5-6z" fill="#F4F6FA"/>'],
  fosse: [100, 60, 'h', '<path d="M0 0h100L62 60h-6l-6-6-6 6h-6z" fill="#1F4E79"/><path d="M0 0h100v3H0z" fill="#4A8BC2"/>'],
  distance: dist,
  lune: disc('#A3A6AD', '<circle cx="34" cy="36" r="10" fill="#8A8D94"/><circle cx="64" cy="62" r="14" fill="#8A8D94"/><circle cx="68" cy="28" r="6" fill="#8A8D94"/>'),
  terre: disc('#2C6FB7', '<path d="M22 20c12-8 26-4 30 6s-8 14-6 24-14 12-22 4S10 28 22 20zM62 52c10-4 22 2 22 12S70 84 62 78s-8-22 0-26z" fill="#4FA35A"/><path d="M30 4c12-4 28-4 40 0-12 4-28 4-40 0z" fill="#F4F6FA"/>'),
  soleil: disc('#F7B32B', '<circle cx="50" cy="50" r="40" fill="#FBC94F"/><circle cx="36" cy="40" r="5" fill="#E99A1C"/><circle cx="62" cy="62" r="3" fill="#E99A1C"/>'),
  galaxie: [100, 40, 'w', '<ellipse cx="50" cy="20" rx="50" ry="20" fill="#8FA6FF" opacity=".25"/><path d="M50 20c18-14 40-6 42 2M50 20C32 34 10 26 8 18" fill="none" stroke="#C9D6FF" stroke-width="3"/><ellipse cx="50" cy="20" rx="12" ry="6" fill="#FFF2C9"/>'],
  univers: disc('#141A33', [...Array(40)].map((_, i) => { const a = i * 2.39996, r = 46 * Math.sqrt((i + .5) / 40); return `<circle cx="${(50 + r * Math.cos(a)).toFixed(1)}" cy="${(50 + r * Math.sin(a)).toFixed(1)}" r="${1 + (i % 3)}" fill="${['#8FA6FF', '#FFF2C9', '#F0A5BC'][i % 3]}"/>`; }).join('')),
};

const LONG_GLYPH = {
  'Longueur de Planck': 'planck', 'Rayon d\'un proton': 'proton', 'Rayon d\'un atome d\'hydrogène': 'atome',
  'Largeur de la double hélice d\'ADN': 'adn', 'Virus de la grippe': 'virus', 'Longueur d\'onde de la lumière verte': 'onde',
  'Bactérie E. coli': 'ecoli', 'Globule rouge': 'globule', 'Épaisseur d\'un cheveu': 'cheveu', 'Grain de sel': 'sel',
  'Fourmi': 'fourmi', 'Diamètre d\'une pièce de 1 euro': 'piece', 'Smartphone': 'telephone', 'Humain adulte': 'humain',
  'Girafe': 'girafe', 'Bus': 'bus', 'Baleine bleue': 'baleine', 'Terrain de football': 'terrain', 'Tour Eiffel': 'eiffel',
  'Burj Khalifa': 'burj', 'Travée du Golden Gate Bridge': 'pont', 'Horizon d\'un trou noir d\'une masse solaire': 'troudenoir',
  'Mont Everest': 'montagne', 'Fosse des Mariannes': 'fosse', 'Marathon': 'distance', 'Paris Marseille à vol d\'oiseau': 'distance',
  'Diamètre de la Lune': 'lune', 'Diamètre de la Terre': 'terre', 'Distance Terre Lune': 'distance', 'Diamètre du Soleil': 'soleil',
  'Distance Terre Soleil': 'distance', 'Distance Soleil Neptune': 'distance', 'Une année lumière': 'distance',
  'Distance de Proxima du Centaure': 'distance', 'Diamètre de la Voie lactée': 'galaxie',
  'Distance de la galaxie d\'Andromède': 'distance', 'Diamètre de l\'univers observable': 'univers',
};
// Rayons : le dessin fait deux rayons de large.
GL.proton[2] = GL.atome[2] = 'r';
ITEMS.forEach(it => { if (it.d === 'longueur') it.g = LONG_GLYPH[it.n]; });
console.assert(ITEMS.every(it => it.d !== 'longueur' || !(it.n in LONG_GLYPH) || GL[it.g]), 'silhouette manquante');

const glyphSvg = k => `<svg viewBox="0 0 ${GL[k][0]} ${GL[k][1]}" aria-hidden="true">${GL[k][3]}</svg>`;
// Taille réelle en mètres [largeur, hauteur].
function realSize(it) {
  const [W, H, m] = GL[it.g], w = m === 'h' ? it.v * W / H : m === 'r' ? 2 * it.v : it.v;
  return [w, w * H / W];
}
