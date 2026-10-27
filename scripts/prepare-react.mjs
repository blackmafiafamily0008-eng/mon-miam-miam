import { copyFile, mkdir, readdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { cleanVisibleCopy } from '../src/visible-copy.js';

const source = resolve('dist');
const target = resolve('public');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

for (const entry of await readdir(source, { withFileTypes: true })) {
  const src = join(source, entry.name);
  const dst = join(target, entry.name);
  if (entry.isDirectory()) {
    if (entry.name === 'assets') await cp(src, dst, { recursive: true, force: true });
    continue;
  }
  if (entry.name.endsWith('.html')) continue; // Le HTML est désormais rendu par React.
  if (entry.name.endsWith('.js')) {
    await writeFile(dst, cleanVisibleCopy(await readFile(src, 'utf8')));
  } else {
    await copyFile(src, dst);
  }
}
console.log('Ressources et logique existantes préparées pour React + Vite.');
