// Converts the raw artwork in `imagens/` into optimized WebP files under `public/art/`
// with stable, ASCII file names. Run with `npm run art`. The originals are never modified.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'imagens';
const OUT = path.join('public', 'art');

const ORB_BY_FOLDER = { azul: 'blue', verde: 'green', roxo: 'purple', vermelho: 'red', amarelo: 'yellow' };
const CHALLENGE_PREFIX = { blue: 'b', green: 'g', purple: 'p', red: 'r', yellow: 'y' };
const ORB_ORDER = ['blue', 'green', 'purple', 'red', 'yellow'];

const RACE_BY_FOLDER = {
  humanos: 'human', 'elfo da floresta': 'elf', 'anoes das montanhas': 'dwarf',
  draconianos: 'draconian', 'fadas do crepusculo': 'fairy', 'orcs sombrios': 'orc',
};
const CLASS_BY_FOLDER = {
  paladino: 'paladin', 'mago elemental': 'mage', 'guerreiro da lamina': 'warrior',
  'arqueiro sombrio': 'archer', 'ladino das sombras': 'rogue',
};

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const slug = (s) => norm(s).replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const jobs = [];
const unmatched = [];
const add = (file, dest, width, kind = 'photo') => jobs.push({ file, dest, width, kind });

const list = (dir) => fs.readdirSync(dir, { withFileTypes: true });
const files = (dir) => list(dir).filter((e) => e.isFile()).map((e) => e.name);
const dirs = (dir) => list(dir).filter((e) => e.isDirectory()).map((e) => e.name);

// Races and classes: cover (CAPA), card (CARTA) and banner (thumbnail)
function collectTraits(folder, table, outFolder) {
  const base = path.join(SRC, folder);
  for (const d of dirs(base)) {
    const key = table[norm(d)];
    if (!key) { unmatched.push(path.join(base, d)); continue; }
    for (const f of files(path.join(base, d))) {
      const n = norm(f);
      const file = path.join(base, d, f);
      if (n.startsWith('capa')) add(file, `${outFolder}/${key}/cover.webp`, 320, 'alpha');
      else if (n.startsWith('carta')) add(file, `${outFolder}/${key}/card.webp`, 620, 'alpha');
      else if (n.includes('thumbnail')) add(file, `${outFolder}/${key}/banner.webp`, 960, 'alpha');
      else unmatched.push(file);
    }
  }
}
collectTraits('Raças', RACE_BY_FOLDER, 'races');
collectTraits('Classes', CLASS_BY_FOLDER, 'classes');

// Continents (one per orb + the whole map)
for (const f of files(path.join(SRC, 'Continentes'))) {
  const n = norm(f);
  const file = path.join(SRC, 'Continentes', f);
  if (n.includes('todos')) { add(file, 'continents/all.webp', 1400); continue; }
  const orb = Object.entries({ azul: 'blue', verde: 'green', roxo: 'purple', vermelho: 'red', amarelo: 'yellow' }).find(([c]) => n.includes(c));
  if (orb) add(file, `continents/${orb[1]}.webp`, 1200); else unmatched.push(file);
}

// Character sheets (FICHA ORBE 1 AZUL ...)
for (const f of files(path.join(SRC, 'FICHAS DE PERSONAGEM'))) {
  const num = Number(/orbe (\d)/i.exec(norm(f))?.[1]);
  const orb = ORB_ORDER[num - 1];
  if (orb) add(path.join(SRC, 'FICHAS DE PERSONAGEM', f), `sheets/${orb}.webp`, 900); else unmatched.push(f);
}

// Backgrounds
// Order matters: the more specific needles must come before the generic ones.
const BG_NAMES = [
  ['carregando energia', 'lauro-charging'], ['todas as orbes', 'lauro-all-orbs'],
  ['orbe amarela outra', 'lauro-yellow-alt'], ['orbe azul', 'lauro-blue'], ['orbe roxa', 'lauro-purple'],
  ['orbe verde', 'lauro-green'], ['orbe vermelha', 'lauro-red'], ['orbe amarela', 'lauro-yellow'],
  ['sem orbe', 'lauro-empty'], ['logo althea', 'logo-pulse'],
];
for (const f of files(path.join(SRC, 'Fundos'))) {
  const n = norm(f);
  const hit = BG_NAMES.find(([needle]) => n.includes(needle));
  if (hit) add(path.join(SRC, 'Fundos', f), `backgrounds/${hit[1]}.webp`, 1400); else unmatched.push(f);
}

// Logos and Lauro
for (const f of files(path.join(SRC, 'Logo'))) {
  const n = norm(f);
  if (n.includes('somente letra')) add(path.join(SRC, 'Logo', f), 'logo/title.webp', 1280, 'keyout');
  else add(path.join(SRC, 'Logo', f), 'logo/full.webp', 1000);
}
const LAURO = { 'nova arte personagem logo outra pose.png': 'pose-logo-alt', 'nova arte personagem logo.png': 'pose-logo',
  'personagem canalisando energia 2.png': 'channeling-2', 'personagem canalisando energia.png': 'channeling',
  'personagem mais 3d.png': '3d', 'personagem serio.png': 'serious' };
for (const f of files(path.join(SRC, 'Personagem Lauro'))) {
  const key = LAURO[norm(f)];
  if (key) add(path.join(SRC, 'Personagem Lauro', f), `lauro/${key}.webp`, 900, 'alpha'); else unmatched.push(f);
}

// Medals (only orb 1 delivered so far). File suffix is the challenge number.
for (const d of dirs(path.join(SRC, 'MEDALHAS'))) {
  const orb = ORB_ORDER[Number(/orbe (\d)/i.exec(norm(d))?.[1]) - 1];
  if (!orb) { unmatched.push(d); continue; }
  for (const f of files(path.join(SRC, 'MEDALHAS', d))) {
    const num = Number(/(\d+)\.png$/i.exec(f)?.[1]);
    if (num) add(path.join(SRC, 'MEDALHAS', d, f), `medals/${CHALLENGE_PREFIX[orb]}${num}.webp`, 480);
    else unmatched.push(f);
  }
}

// Orbs: art, titles, story, levels, rewards and one thumbnail per challenge
const challengeTitles = []; // for the sanity report
for (const d of dirs(path.join(SRC, 'Orbes'))) {
  const orb = ORB_BY_FOLDER[norm(d)];
  if (!orb) { unmatched.push(d); continue; }
  const base = path.join(SRC, 'Orbes', d);
  for (const f of files(base)) {
    const n = norm(f);
    const file = path.join(base, f);
    if (n.includes('sem fundo')) add(file, `orbs/${orb}/orb.webp`, 640, 'alpha');
    else if (n.includes('com fundo')) add(file, `orbs/${orb}/with-bg.webp`, 640);
    else if (n.includes('thumbnail')) add(file, `orbs/${orb}/title.webp`, 960, 'alpha');
    else unmatched.push(file);
  }
  const dd = path.join(base, 'DESAFIOS');
  const numbered = new Map();
  let unnumbered = null;
  for (const f of files(dd)) {
    const n = norm(f);
    const file = path.join(dd, f);
    if (n.startsWith('historia')) add(file, `orbs/${orb}/story.webp`, 960);
    else if (/^nivel \d+/.test(n)) add(file, `orbs/${orb}/level-${/(\d+)/.exec(n)[1]}.webp`, 960);
    else if (n.startsWith('recompensa')) add(file, `orbs/${orb}/reward.webp`, 960);
    else if (n.startsWith('vitoria')) add(file, `orbs/${orb}/victory.webp`, 960);
    else if (n.startsWith('o fim da jornada')) add(file, `orbs/${orb}/journey-end.webp`, 960);
    else if (n.startsWith('thumbnail desafios')) {
      const m = /desafio (\d+)/.exec(n);
      if (m) numbered.set(((Number(m[1]) - 1) % 10) + 1, file); else unnumbered = file;
    } else unmatched.push(file);
  }
  if (unnumbered) {
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((i) => !numbered.has(i));
    if (missing.length === 1) numbered.set(missing[0], unnumbered); else unmatched.push(unnumbered);
  }
  for (const [i, file] of numbered) {
    add(file, `challenges/${CHALLENGE_PREFIX[orb]}${i}.webp`, 960);
    challengeTitles.push({ id: `${CHALLENGE_PREFIX[orb]}${i}`, file: path.basename(file) });
  }
}

// Videos are copied as they are
const videoJobs = [];
const VIDEOS = { 'lauro carregando orbe azul.mp4': 'lauro-blue', 'lauro energizando orbe verde.mp4': 'lauro-green',
  'lauro energizando orbe roxa.mp4': 'lauro-purple', 'lauro carregando sua forca.mp4': 'lauro-power', 'logo energizada com as orbes.mp4': 'logo-orbs' };
for (const f of files(path.join(SRC, 'Vídeos'))) {
  const key = VIDEOS[norm(f)];
  if (key) videoJobs.push({ file: path.join(SRC, 'Vídeos', f), dest: `videos/${key}.mp4` }); else unmatched.push(f);
}

// Makes the flat white background of an opaque logo transparent: flood-fills from the
// borders through near-white pixels, so white areas inside the artwork are left alone.
async function keyOutWhite(file, width) {
  const { data, info } = await sharp(file).resize({ width, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const isBg = (i) => data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const p = y * w + x; if (!seen[p] && isBg(p * 4)) { seen[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop(); const x = p % w; const y = (p - x) / w;
    if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
  }
  for (let p = 0; p < w * h; p++) if (seen[p]) data[p * 4 + 3] = 0;
  return sharp(data, { raw: { width: w, height: h, channels: 4 } });
}

async function run() {
  let before = 0; let after = 0;
  for (const job of jobs) {
    const dest = path.join(OUT, job.dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const opts = job.kind === 'photo' ? { quality: 80, effort: 5 } : { quality: 86, alphaQuality: 92, effort: 5 };
    const image = job.kind === 'keyout' ? await keyOutWhite(job.file, job.width) : sharp(job.file).resize({ width: job.width, withoutEnlargement: true });
    await image.webp(opts).toFile(dest);
    before += fs.statSync(job.file).size; after += fs.statSync(dest).size;
  }
  for (const job of videoJobs) {
    const dest = path.join(OUT, job.dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(job.file, dest);
    after += fs.statSync(dest).size;
  }
  const mb = (n) => (n / 1048576).toFixed(1);
  console.log(`${jobs.length} images + ${videoJobs.length} videos -> ${OUT}`);
  console.log(`images: ${mb(before)} MB -> ${mb(after - videoJobs.reduce((s, j) => s + fs.statSync(path.join(OUT, j.dest)).size, 0))} MB`);
  console.log('challenge thumbnails:'); for (const c of challengeTitles.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))) console.log(`  ${c.id}  <-  ${c.file}`);
  if (unmatched.length) console.log('UNMATCHED:', unmatched);
}
run();
