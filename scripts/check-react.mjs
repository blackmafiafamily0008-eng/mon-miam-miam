import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cleanVisibleCopy } from '../src/visible-copy.js';

const paths = ['index', 'connexion', 'inscription', 'mot-de-passe-oublie', 'etudiant', 'employe', 'gerant', 'admin'];
for (const name of paths) {
  const html = await readFile(new URL(`../${name}.html`, import.meta.url), 'utf8');
  assert.match(html, /id="root"/, `${name} doit monter React`);
  assert.match(html, /src="\/src\/main.jsx"/, `${name} doit partager l'entrée React`);
}
const login = cleanVisibleCopy(await readFile(new URL('../dist/connexion.html', import.meta.url), 'utf8'));
assert.match(login, /Accès rapide étudiant/);
assert.doesNotMatch(login, /maquette|démonstration/i);
console.log('Huit routes React et neutralisation des libellés de présentation : OK');
