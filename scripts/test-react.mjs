import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanVisibleCopy } from '../src/visible-copy.js';

test('retire les libellés de présentation sans masquer les limites réelles', () => {
  const copy = cleanVisibleCopy('Maquette front-end · Données conservées dans ce navigateur. Aucun paiement réel.');
  assert.doesNotMatch(copy, /Maquette/i);
  assert.match(copy, /Aucun paiement réel/);
});
test('ne touche pas aux identifiants fonctionnels historiques', () => {
  const source = '<button data-demo="admin">Administrateur</button> googleDemoSignIn()';
  assert.equal(cleanVisibleCopy(source), source);
});
