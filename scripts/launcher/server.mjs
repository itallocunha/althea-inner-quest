import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const project = createHash('sha256').update(root.replace(/[\\/]+$/, '').toUpperCase()).digest('hex').slice(0, 24);
const healthPath = '/__althea_launcher_status';
const port = Number(process.env.ALTHEA_LAUNCHER_PORT || 8080);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Porta local inválida.');

// The executable owns this process and its children through a Windows Job Object.
// Keep the original origin so the player's saved progress remains available.
const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  clearScreen: false,
  optimizeDeps: { entries: [path.join(root, 'index.html')] },
  server: {
    host: '127.0.0.1',
    port,
    strictPort: true,
    open: false,
    watch: { ignored: ['**/logs/**', '**/scripts/launcher/**', '**/dist-artifact/**', '**/*.exe'] },
  },
  plugins: [{
    name: 'althea-launcher-health',
    configureServer(vite) {
      vite.middlewares.use((request, response, next) => {
        if (request.url !== healthPath) return next();
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        response.end(JSON.stringify({ application: 'althea', project }));
      });
    },
  }],
});

await server.listen();
console.log(`Althea pronto em http://127.0.0.1:${port}/`);

async function shutdown() {
  await server.close();
  process.exit(0);
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
