// Étape de compatibilité : le rendu des pages est pris en charge par React.
// Les modules métier historiques restent inchangés jusqu'à leur migration
// progressive vers des composants et services React natifs.
import home from '../dist/index.html?raw';
import login from '../dist/connexion.html?raw';
import signup from '../dist/inscription.html?raw';
import forgot from '../dist/mot-de-passe-oublie.html?raw';
import student from '../dist/etudiant.html?raw';
import employee from '../dist/employe.html?raw';
import manager from '../dist/gerant.html?raw';
import admin from '../dist/admin.html?raw';
import { cleanVisibleCopy } from './visible-copy.js';
import { pageNameFromPath } from './route-path.js';

export const pages = {
  'index.html': { html: home, scripts: ['miam-core.js', 'app-fr.js'], stylesheet: 'styles.css' },
  'connexion.html': { html: login, scripts: ['miam-core.js', 'ui.js', 'auth.js'], stylesheet: 'espace.css' },
  'inscription.html': { html: signup, scripts: ['miam-core.js', 'ui.js', 'auth.js'], stylesheet: 'espace.css' },
  'mot-de-passe-oublie.html': { html: forgot, scripts: ['miam-core.js', 'ui.js', 'auth.js'], stylesheet: 'espace.css' },
  'etudiant.html': { html: student, scripts: ['miam-core.js', 'ui.js', 'espace.js'], stylesheet: 'espace.css' },
  'employe.html': { html: employee, scripts: ['miam-core.js', 'ui.js', 'espace.js'], stylesheet: 'espace.css' },
  'gerant.html': { html: manager, scripts: ['miam-core.js', 'ui.js', 'espace.js'], stylesheet: 'espace.css' },
  'admin.html': { html: admin, scripts: ['miam-core.js', 'ui.js', 'espace.js'], stylesheet: 'espace.css' },
};

export function getCurrentPage(pathname = window.location.pathname) {
  const name = pageNameFromPath(pathname);
  return pages[name] || pages['index.html'];
}

export function readLegacyPage(page) {
  const doc = new DOMParser().parseFromString(cleanVisibleCopy(page.html), 'text/html');
  return {
    // React reconstruit les éléments historiques, en conservant exactement
    // leur ordre, leurs classes, leurs attributs et leur contenu.
    body: doc.body,
    bodyClass: doc.body.className,
    role: doc.body.dataset.role || '',
    title: doc.title,
  };
}
