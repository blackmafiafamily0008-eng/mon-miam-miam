import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cleanVisibleCopy } from '../src/visible-copy.js';

const paths = ['index', 'connexion', 'inscription', 'mot-de-passe-oublie', 'etudiant', 'employe', 'gerant', 'admin'];
for (const name of paths) {
  const html = await readFile(new URL(`../${name}.html`, import.meta.url), 'utf8');
  assert.match(html, /id="root"/, `${name} doit monter React`);
  assert.match(html, /src="\/src\/main.jsx"/, `${name} doit partager l'entrée React`);
  assert.match(html, /zeduc-space-logo\.svg/, `${name} doit utiliser le logo vectoriel`);
  const source = await readFile(new URL(`../dist/${name}.html`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /(?:maquette|démonstration|\bdémo\b)/i, `${name} : aucun libellé provisoire`);
  assert.doesNotMatch(source, /data-demo=|data-google-confirm|google-demo-profile/, `${name} : aucun raccourci d'authentification`);
}
const login = cleanVisibleCopy(await readFile(new URL('../dist/connexion.html', import.meta.url), 'utf8'));
assert.match(login, /Se connecter avec Google/);
assert.match(login, /La connexion Google sera disponible après son intégration technique/);
assert.match(login, /<svg aria-hidden="true" viewBox="0 0 48 48">/);
assert.doesNotMatch(login, /maquette|démonstration/i);
console.log('Huit routes React et neutralisation des libellés de présentation : OK');
