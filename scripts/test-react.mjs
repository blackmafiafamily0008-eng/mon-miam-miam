import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('huit pages Vite reliées à des composants React, sans rendu HTML historique', async () => {
  const pages = ['index', 'connexion', 'inscription', 'mot-de-passe-oublie', 'etudiant', 'employe', 'gerant', 'admin'];
  for (const name of pages) {
    const html = await read(`${name}.html`);
    assert.match(html, /id="root"/);
    assert.match(html, /src="\/src\/main.jsx"/);
  }
  const main = await read('src/main.jsx');
  assert.match(main, /<App\s*\/>/);
  assert.doesNotMatch(main, /dangerouslySetInnerHTML|legacy-screen|loadScript/);
});

test('le catalogue, l’authentification et les quatre rôles possèdent des composants React', async () => {
  const publicPage = await read('src/pages/PublicPage.jsx');
  const auth = await read('src/pages/AuthPage.jsx');
  const workspace = await read('src/pages/Workspace.jsx');
  for (const source of [publicPage, auth, workspace]) {
    assert.doesNotMatch(source, /dangerouslySetInnerHTML|\.innerHTML\s*=|\bmaquette\b|\bdémonstration\b|\bdémo\b/i);
  }
  assert.match(publicPage, /setInterval/); // Défilement automatique du visuel.
  assert.doesNotMatch(publicPage, /hero-prev|hero-next/); // Aucun contrôle manuel ajouté.
  assert.match(auth, /Miam\.login|Miam\.register/);
  for (const feature of ['Cart', 'Orders', 'Loyalty', 'Referral', 'Complaints', 'ManageMenu', 'Team', 'Promotions', 'Statistics', 'Settings']) {
    assert.match(workspace, new RegExp(`function ${feature}\\(`), feature);
  }
  assert.match(workspace, /saveImage/);
});

test('les modules de rendu historiques ne sont plus servis par Vite', async () => {
  const script = await read('scripts/prepare-react.mjs');
  assert.match(script, /entry\.name === 'assets'/);
  assert.doesNotMatch(script, /writeFile|cleanVisibleCopy/);
});
