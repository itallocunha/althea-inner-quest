import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

if (process.platform !== 'win32') throw new Error('O iniciador .exe deve ser gerado no Windows.');
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const framework = path.join(process.env.WINDIR || 'C:\\Windows', 'Microsoft.NET');
const compiler = ['Framework64', 'Framework'].map(name => path.join(framework, name, 'v4.0.30319', 'csc.exe')).find(file => fs.existsSync(file));
if (!compiler) throw new Error('O compilador do .NET Framework não foi encontrado neste Windows.');

// Reuse the website favicon as a Windows icon without changing the uploaded artwork.
const size = 48;
const pixels = await sharp(path.join(root, 'public', 'favicon.png')).resize(size, size).ensureAlpha().raw().toBuffer();
const maskStride = Math.ceil(size / 32) * 4;
const bitmap = Buffer.alloc(40 + size * size * 4 + maskStride * size);
bitmap.writeUInt32LE(40, 0);
bitmap.writeInt32LE(size, 4);
bitmap.writeInt32LE(size * 2, 8);
bitmap.writeUInt16LE(1, 12);
bitmap.writeUInt16LE(32, 14);
bitmap.writeUInt32LE(size * size * 4 + maskStride * size, 20);
for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
  const source = (y * size + x) * 4;
  const target = 40 + ((size - y - 1) * size + x) * 4;
  bitmap[target] = pixels[source + 2];
  bitmap[target + 1] = pixels[source + 1];
  bitmap[target + 2] = pixels[source];
  bitmap[target + 3] = pixels[source + 3];
  if (pixels[source + 3] === 0) bitmap[40 + size * size * 4 + (size - y - 1) * maskStride + Math.floor(x / 8)] |= 1 << (7 - x % 8);
}
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = size;
header[7] = size;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(bitmap.length, 14);
header.writeUInt32LE(header.length, 18);
const icon = path.join(root, 'scripts', 'launcher', 'althea.ico');
fs.writeFileSync(icon, Buffer.concat([header, bitmap]));

const output = path.join(root, 'Iniciar Althea.exe');
const result = spawnSync(compiler, [
  '/nologo', '/target:winexe', '/platform:anycpu', '/optimize+', '/codepage:65001',
  `/out:${output}`, `/win32icon:${icon}`,
  '/reference:System.dll', '/reference:System.Core.dll', '/reference:System.Drawing.dll', '/reference:System.Windows.Forms.dll',
  path.join(root, 'scripts', 'launcher', 'AltheaLauncher.cs'),
], { cwd: root, stdio: 'inherit', windowsHide: true });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Executável criado: ${output}`);
