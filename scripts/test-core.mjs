import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';

const code = readFileSync(new URL('../dist/miam-core.js', import.meta.url), 'utf8');
const input = {
  name: 'Camille Mutombo', email: 'camille@exemple.test', phone: '+243 000 000 000',
  address: 'Kinshasa', password: 'MotPasse123', confirm: 'MotPasse123', referral: 'MIAM-ALEX',
};

function setup() {
  const storage = () => {
    const map = new Map();
    return {
      getItem: key => map.get(key) || null,
      setItem: (key, value) => map.set(key, value),
      removeItem: key => map.delete(key),
    };
  };
  const localStorage = storage();
  const sessionStorage = storage();
  const window = { dispatchEvent() {} };
  vm.runInNewContext(code, { window, localStorage, sessionStorage, crypto: webcrypto, TextEncoder, structuredClone, Event });
  const m = window.Miam;
  // Fixture réservée aux tests : aucune méthode de connexion forcée n'est exportée dans l'app.
  const as = id => sessionStorage.setItem(m.SESSION, JSON.stringify({ id }));
  return { m, as };
}

test('aucune connexion directe à un rôle ni fausse connexion Google', () => {
  const { m } = setup();
  assert.equal(m.current(), null);
  assert.equal(m.demoLogin, undefined);
  assert.equal(m.googleDemoSignIn, undefined);
  assert.equal(m.signIn, undefined);
  assert.throws(() => m.saveProduct('demo-admin', { name: 'Sans session', price: 1000 }), /session autorisée/);
});

test('un objet acteur falsifié ne remplace pas le rôle de la session', () => {
  const { m, as } = setup();
  as('demo-etudiant');
  const actor = { ...m.current(), role: 'admin' };
  assert.throws(() => m.requireRole(actor, ['admin']), /session autorisée/);
  assert.doesNotThrow(() => m.requireRole(m.current(), ['etudiant']));
  const previous = m.current();
  m.logout();
  assert.throws(() => m.requireRole(previous, ['etudiant']), /session autorisée/);
});

test('les plats congolais sont proposés et restaurés sans écraser les autres', () => {
  const { m } = setup();
  const dishes = m.activeProducts().filter(p => p.category === 'Plats congolais');
  assert.equal(dishes.map(p => p.id).join(','), 'p11,p12,p13');
  assert.ok(dishes.every(p => p.image.endsWith('.webp') && p.price > 0));
  const state = m.read();
  state.products = state.products.filter(p => p.id !== 'p11');
  state.products.find(p => p.id === 'p1').price = 999;
  state.products.find(p => p.id === 'p12').image = 'liboke-mbisi.png';
  m.save(state);
  assert.equal(m.read().products.find(p => p.id === 'p1').price, 999);
  assert.equal(m.read().products.filter(p => p.id === 'p11').length, 1);
  assert.equal(m.read().products.find(p => p.id === 'p12').image, 'liboke-mbisi.webp');
});

test('inscription et connexion réelles du navigateur : rôle étudiant seulement', async () => {
  const { m } = setup();
  await assert.rejects(m.register({ ...input, password: 'court', confirm: 'court' }), /8 caractères/);
  const user = await m.register(input);
  assert.equal(user.role, 'etudiant');
  assert.equal(m.current().id, user.id);
  assert.ok(user.passwordHash && !('password' in user));
  m.logout();
  await assert.rejects(m.login(input.email, 'mauvais'), /incorrect/);
  assert.equal((await m.login(input.email, input.password)).id, user.id);
  await assert.rejects(m.register(input), /déjà utilisée/);
  await assert.rejects(m.saveStaff('demo-admin', { name: 'Intrus' }), /session autorisée/);
});

test('Mobile Money conserve les validations, mais exige une session étudiante', () => {
  for (const payment of ['mpesa', 'orange', 'airtel']) {
    const { m, as } = setup();
    m.addToCart('p1');
    const form = { mode: 'surplace', arrival: '13:00', payment, paymentPhone: '+243 000 000 001', usePoints: true };
    assert.throws(() => m.placeOrder('demo-etudiant', form), /session autorisée/);
    as('demo-etudiant');
    const before = m.read();
    assert.throws(() => m.placeOrder('demo-etudiant', form), /Confirmez/);
    assert.deepEqual(m.read(), before);
    assert.throws(() => m.placeOrder('demo-etudiant', { ...form, paymentConfirmed: true, paymentPhone: '123' }), /numéro/);
    assert.throws(() => m.placeOrder('demo-etudiant', { ...form, paymentConfirmed: true, expectedTotal: 1 }), /montant/);
    const order = m.placeOrder('demo-etudiant', { ...form, paymentConfirmed: true, expectedTotal: 13000 });
    assert.equal(order.paymentStatus, 'confirme-simulation');
    assert.equal(order.payment, m.paymentProviders[payment]);
    assert.equal(m.read().users[0].points, 10);
    assert.throws(() => m.placeOrder('demo-etudiant', { ...form, paymentConfirmed: true }), /vide/);
    as('demo-employe');
    for (const status of ['preparation', 'prete', 'terminee']) m.transition('demo-employe', order.id, status);
    assert.equal(m.read().users[0].points, 23);
  }
});

test('annulation Mobile Money : remboursement local et méthode inconnue refusée', () => {
  const { m, as } = setup();
  as('demo-etudiant');
  m.addToCart('p1');
  const form = { mode: 'surplace', arrival: '13:00', payment: 'inconnu' };
  assert.throws(() => m.placeOrder('demo-etudiant', form), /moyen/);
  const order = m.placeOrder('demo-etudiant', { ...form, payment: 'orange', paymentPhone: '0000000000', paymentConfirmed: true });
  as('demo-employe');
  m.transition('demo-employe', order.id, 'annulee');
  assert.equal(m.read().orders[0].paymentStatus, 'rembourse-simulation');
});

test('fidélité, statut des commandes et interdiction des rôles non autorisés', () => {
  const { m, as } = setup();
  as('demo-etudiant');
  m.addToCart('p1');
  const order = m.placeOrder('demo-etudiant', { mode: 'surplace', arrival: '13:00', usePoints: true });
  assert.equal(order.discount, 5000);
  assert.equal(order.pointsUsed, 75);
  assert.throws(() => m.transition('demo-etudiant', order.id, 'preparation'), /session autorisée/);
  as('demo-employe');
  m.transition('demo-employe', order.id, 'annulee');
  assert.equal(m.read().users[0].points, 85);
  assert.throws(() => m.transition('demo-employe', order.id, 'annulee'), /pas possible/);
});

test('parrainage, commande livrée et points attribués une seule fois', async () => {
  const { m, as } = setup();
  const user = await m.register(input);
  m.addToCart('p1');
  const order = m.placeOrder(user.id, { mode: 'livraison', address: input.address, phone: input.phone });
  assert.throws(() => m.transition('demo-employe', order.id, 'terminee'), /session autorisée/);
  as('demo-employe');
  assert.throws(() => m.transition('demo-employe', order.id, 'terminee'), /pas possible/);
  for (const status of ['preparation', 'prete', 'livraison', 'terminee']) m.transition('demo-employe', order.id, status);
  assert.equal(m.read().users.find(u => u.id === user.id).points, 18);
  assert.equal(m.read().users[0].points, 95);
  assert.throws(() => m.transition('demo-employe', order.id, 'terminee'), /pas possible/);
});

test('disponibilité des plats et réponse de réclamation selon le rôle', () => {
  const { m, as } = setup();
  as('demo-etudiant');
  m.addToCart('p1');
  const complaint = m.complaint('demo-etudiant', { orderId: 'MM-1048', subject: 'Question', message: 'Une question sur ma commande.' });
  assert.throws(() => m.replyComplaint('demo-employe', complaint.id, 'Nous vérifions cette commande.', true), /session autorisée/);
  as('demo-employe');
  m.toggleProduct('demo-employe', 'p1', 'available');
  m.replyComplaint('demo-employe', complaint.id, 'Nous vérifions cette commande.', true);
  assert.equal(m.read().complaints[0].status, 'validation');
  assert.throws(() => m.saveProduct('demo-employe', { name: 'Non autorisé', price: 1000 }), /session autorisée/);
  as('demo-etudiant');
  assert.throws(() => m.placeOrder('demo-etudiant', { mode: 'surplace', arrival: '13:00' }), /plus disponible/);
  as('demo-gerant');
  m.replyComplaint('demo-gerant', complaint.id, 'Votre demande a été traitée.', true);
  assert.equal(m.read().complaints[0].status, 'resolue');
});

test('création et suspension d’un employé par le gérant connecté', async () => {
  const { m, as } = setup();
  as('demo-gerant');
  await m.saveStaff('demo-gerant', { name: 'Employé Test', email: 'employe@exemple.test', role: 'employe', password: 'MotPasse123' });
  const staff = await m.login('employe@exemple.test', 'MotPasse123');
  assert.equal(staff.role, 'employe');
  as('demo-gerant');
  m.toggleStaff('demo-gerant', staff.id);
  await assert.rejects(m.login('employe@exemple.test', 'MotPasse123'), /incorrect/);
  m.toggleStaff('demo-gerant', staff.id);
  assert.equal((await m.login('employe@exemple.test', 'MotPasse123')).id, staff.id);
});
