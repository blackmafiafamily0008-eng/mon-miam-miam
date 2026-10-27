import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanVisibleCopy } from '../src/visible-copy.js';
import { pageNameFromPath } from '../src/route-path.js';

test('retire les libellés de présentation sans masquer les limites réelles', () => {
  const copy = cleanVisibleCopy('Maquette front-end · Données conservées dans ce navigateur. Aucun paiement réel.');
  assert.doesNotMatch(copy, /Maquette/i);
  assert.match(copy, /Aucun paiement réel/);
});
test('ne touche pas aux identifiants fonctionnels historiques', () => {
  const source = '<button data-demo="admin">Administrateur</button> googleDemoSignIn()';
  assert.equal(cleanVisibleCopy(source), source);
});
test('préserve le nom de la République démocratique du Congo', () => {
  assert.equal(cleanVisibleCopy('République démocratique du Congo'), 'République démocratique du Congo');
});
test('retire les libellés de simulation de réservation', () => {
  assert.equal(cleanVisibleCopy('SIMULER MA RÉSERVATION'), 'PRÉPARER MA RÉSERVATION');
});
test('conserve le bouton Google et indique honnêtement sa limite', () => {
  const copy = cleanVisibleCopy('Continuer avec Google Parcours de démonstration · Aucun compte Google réel utilisé.');
  assert.match(copy, /Se connecter avec Google/);
  assert.match(copy, /connexion Google sera disponible/);
});
test('accepte les routes historiques avec et sans extension', () => {
  for (const name of ['index', 'connexion', 'inscription', 'mot-de-passe-oublie', 'etudiant', 'employe', 'gerant', 'admin']) {
    const url = name === 'index' ? '/' : `/${name}`;
    assert.equal(pageNameFromPath(url), `${name}.html`);
    assert.equal(pageNameFromPath(`/${name}.html`), `${name}.html`);
  }
});
