import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const result = await build({
  entryPoints: [resolve('src/App.jsx')], bundle: true, write: false,
  format: 'cjs', platform: 'node', external: ['react', 'react-dom'],
  logLevel: 'silent',
});

function store() { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) }; }

function createRuntime(pathname) {
  const location = { pathname: `/${pathname}`, search: '', hash: '' };
  const window = { location, dispatchEvent() {}, addEventListener() {}, removeEventListener() {} };
  const module = { exports: {} };
  const globals = { module, exports: module.exports, require, window, location, crypto: webcrypto, TextEncoder, localStorage: store(), sessionStorage: store(), structuredClone, Event, URLSearchParams, console, setTimeout, clearTimeout };
  runInNewContext(result.outputFiles[0].text, globals);
  return { App: module.exports.App, Miam: window.Miam, location };
}

test('les huit pages React sont rendues sans erreur, par rôle', () => {
  const routes = [
    ['index.html', null, /ON SE RETROUVE/],
    ['connexion.html', null, /Se connecter/],
    ['inscription.html', null, /Créer mon compte/],
    ['mot-de-passe-oublie.html', null, /Mot de passe oublié/],
    ['etudiant.html', 'etudiant', /ON S’OCCUPE/],
    ['employe.html', 'employe', /Vue du service/],
    ['gerant.html', 'gerant', /Vue d’ensemble/],
    ['admin.html', 'admin', /Vue d’ensemble/],
  ];
  for (const [path, role, expected] of routes) {
    const app = createRuntime(path);
    if (role) app.Miam.demoLogin(role);
    const markup = renderToStaticMarkup(createElement(app.App));
    assert.match(markup, expected, `${path} doit générer son propre contenu JSX`);
    assert.doesNotMatch(markup, /dangerouslySetInnerHTML|maquette|démonstration/gi);
  }
});

test('les espaces d’administration et le panier rendent des commandes et formulaires', () => {
  const student = createRuntime('etudiant.html');
  student.Miam.demoLogin('etudiant');
  student.Miam.addToCart('p1');
  student.location.hash = '#panier';
  const cart = renderToStaticMarkup(createElement(student.App));
  assert.match(cart, /Préparer ma commande/);
  assert.match(cart, /M-Pesa/);
  const admin = createRuntime('admin.html');
  admin.Miam.demoLogin('admin');
  admin.location.hash = '#menu';
  const menu = renderToStaticMarkup(createElement(admin.App));
  assert.match(menu, /Gestion de la carte/);
  assert.match(menu, /Ajouter un plat/);
});

test('les 29 vues des quatre rôles se rendent sans exception', () => {
  const tabs = {
    etudiant: ['accueil', 'menu', 'panier', 'commandes', 'fidelite', 'parrainage', 'evenements', 'reclamations', 'classement', 'profil'],
    employe: ['accueil', 'commandes', 'menu', 'reclamations', 'statistiques'],
    gerant: ['accueil', 'commandes', 'menu', 'equipe', 'reclamations', 'statistiques'],
    admin: ['accueil', 'commandes', 'menu', 'equipe', 'promotions', 'reclamations', 'statistiques', 'parametres'],
  };
  for (const [role, views] of Object.entries(tabs)) {
    const app = createRuntime(`${role}.html`);
    app.Miam.demoLogin(role);
    for (const tab of views) {
      app.location.hash = `#${tab}`;
      const markup = renderToStaticMarkup(createElement(app.App));
      assert.match(markup, /id="workspace"/, `${role}#${tab}`);
      assert.ok(markup.length > 500, `${role}#${tab} doit contenir sa vue`);
    }
  }
});
