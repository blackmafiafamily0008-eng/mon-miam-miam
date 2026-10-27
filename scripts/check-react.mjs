import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const paths = ['index', 'connexion', 'inscription', 'mot-de-passe-oublie', 'etudiant', 'employe', 'gerant', 'admin'];
for (const name of paths) {
  const html = await readFile(new URL(`../${name}.html`, import.meta.url), 'utf8');
  assert.match(html, /id="root"/, `${name} doit monter React`);
  assert.match(html, /src="\/src\/main.jsx"/, `${name} doit partager l'entrée React`);
}
const main = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const screens = await Promise.all(['PublicPage', 'AuthPage', 'Workspace'].map(name => readFile(new URL(`../src/pages/${name}.jsx`, import.meta.url), 'utf8')));
assert.match(main, /<App\s*\/>/);
assert.doesNotMatch(main, /legacy|dangerouslySetInnerHTML|loadScript/i);
for (const screen of screens) assert.doesNotMatch(screen, /dangerouslySetInnerHTML|\.innerHTML\s*=|(?:maquette|démonstration|démo)/i);
assert.match(app, /createContext/);
assert.match(screens[0], /setInterval/);
assert.match(screens[2], /function Cart|function Orders|function ManageMenu/);
console.log('Huit routes, composants React natifs et absence de scripts de rendu historiques : OK');
