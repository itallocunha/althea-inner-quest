// Builds a self-contained page for publishing the game as a Claude Artifact.
// The JS and CSS are inlined into one HTML file; the artwork stays as files next to it.
// Run with `npm run artifact`, then publish `dist-artifact/page.html`.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'dist-artifact';
fs.rmSync(OUT, { recursive: true, force: true });
execSync(`npx vite build --base=./ --outDir ${OUT}`, { stdio: 'inherit', env: { ...process.env, VITE_ROUTER: 'hash' } });

// Only the splash video is used by the game; the other clips would just make the upload heavier
const videos = path.join(OUT, 'art', 'videos');
for (const f of fs.readdirSync(videos)) if (f !== 'logo-orbs.mp4') fs.rmSync(path.join(videos, f));

const assets = path.join(OUT, 'assets');
const js = fs.readdirSync(assets).find(f => f.endsWith('.js'));
const css = fs.readdirSync(assets).find(f => f.endsWith('.css'));
const read = f => fs.readFileSync(path.join(assets, f), 'utf8');

// A literal closing script tag inside the bundle would end the inline script early
const safeJs = read(js).replace(/<\/script/gi, '<\\/script');

const html = `<title>Althea Inner Quest</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700;800;900&family=Alegreya+Sans:wght@400;500;700;800&display=swap">
<style>${read(css)}</style>
<div id="root"></div>
<script type="module">${safeJs}</script>
`;
fs.writeFileSync(path.join(OUT, 'page.html'), html);

const listFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? listFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const art = listFiles(path.join(OUT, 'art')).map(f => path.relative(OUT, f).split(path.sep).join('/'));
fs.writeFileSync(path.join(OUT, 'files.json'), JSON.stringify(art));
const size = art.reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`page.html: ${(html.length / 1048576).toFixed(2)} MB, ${art.length} art files (${(size / 1048576).toFixed(1)} MB)`);
