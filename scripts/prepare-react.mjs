import { mkdir, readdir, cp, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const source = resolve('dist');
const target = resolve('public');
await mkdir(target, { recursive: true });

// Les scripts et CSS historiques ne doivent plus se retrouver dans le site
// compilé : Vite regroupe désormais l'interface React et les styles actuels.
for (const name of ['miam-core.js', 'ui.js', 'auth.js', 'espace.js', 'app-fr.js', 'styles.css', 'espace.css']) {
  try { await unlink(join(target, name)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

for (const entry of await readdir(source, { withFileTypes: true })) {
  const src = join(source, entry.name);
  const dst = join(target, entry.name);
  if (entry.isDirectory() && entry.name === 'assets') await cp(src, dst, { recursive: true, force: true });
}
console.log('Images et polices préparées pour React + Vite.');
