import React, { useEffect, useState } from 'react';
import { Miam, imageUrl, saveImage } from '../domain/miam.js';
import { Badge, Button, DialogTitle, Empty, Field, FormError, Panel, date, getForm, money, statuses, useApp } from '../App.jsx';

const navigation = {
  etudiant: [['accueil', 'Mon quotidien'], ['menu', 'La carte'], ['panier', 'Mon panier'], ['commandes', 'Mes commandes'], ['fidelite', 'Ma fidélité'], ['parrainage', 'Inviter mes amis'], ['evenements', 'Offres & événements'], ['reclamations', 'Réclamations'], ['classement', 'Classement'], ['profil', 'Mon profil']],
  employe: [['accueil', 'Vue du service'], ['commandes', 'Les commandes'], ['menu', 'Disponibilité'], ['reclamations', 'Réclamations'], ['statistiques', 'Statistiques']],
  gerant: [['accueil', 'Vue d’ensemble'], ['commandes', 'Commandes'], ['menu', 'Carte du jour'], ['equipe', 'Mon équipe'], ['reclamations', 'Réclamations'], ['statistiques', 'Statistiques']],
  admin: [['accueil', 'Vue d’ensemble'], ['commandes', 'Commandes'], ['menu', 'Gestion de la carte'], ['equipe', 'Comptes'], ['promotions', 'Offres & événements'], ['reclamations', 'Réclamations'], ['statistiques', 'Statistiques'], ['parametres', 'Paramètres']],
};
const pending = status => !['terminee', 'annulee'].includes(status);

function Status({ status }) { return <Badge tone={status === 'terminee' || status === 'resolue' ? 'success' : status === 'annulee' ? 'danger' : 'warning'}>{statuses[status] || { ouverte: 'Ouverte', validation: 'À valider', resolue: 'Résolue' }[status] || status}</Badge>; }

function ModalForm({ title, children, save, success = 'Modifications enregistrées.', submit = 'Enregistrer' }) {
  const { notify, closeDialog } = useApp();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function send(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await save(getForm(e), e.currentTarget); notify(success); closeDialog(); }
    catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  return <><DialogTitle>{title}</DialogTitle><form noValidate className="mm-form mm-modal-form" onSubmit={send}>{children}<FormError>{error}</FormError><div className="mm-inline-actions"><Button tone="outline" onClick={closeDialog}>Annuler</Button><Button type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Enregistrement…' : submit}</Button></div></form></>;
}

function Confirm({ title, text, confirm, label = 'Confirmer' }) {
  const { notify, closeDialog } = useApp();
  const [error, setError] = useState('');
  return <><DialogTitle>{title}</DialogTitle><p>{text}</p><FormError>{error}</FormError><div className="mm-inline-actions"><Button tone="outline" onClick={closeDialog}>Revenir</Button><Button tone="danger" onClick={() => { try { confirm(); closeDialog(); notify('Action effectuée.'); } catch (e) { setError(e.message); } }}>{label}</Button></div></>;
}

function StatCards({ entries }) { return <div className="mm-stats">{entries.map(([name, value, hint]) => <div key={name} className="mm-stat"><small>{name}</small><strong>{value}</strong><span>{hint}</span></div>)}</div>; }

export function Workspace({ role }) {
  const { data, user, refresh } = useApp();
  const [tab, setTab] = useState(() => location.hash.slice(1) || 'accueil');
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { const update = () => { setTab(location.hash.slice(1) || 'accueil'); setDrawer(false); }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  useEffect(() => {
    if (!user) { location.replace('/connexion.html'); return; }
    if (user.role !== role) { location.replace(`/${user.role}.html`); return; }
    document.title = `${navigation[role].find(([id]) => id === tab)?.[1] || 'Mon espace'} · Mon Miam Miam`;
  }, [role, user, tab]);
  if (!user || user.role !== role) return <div className="mm-loading" role="status">Ouverture de votre espace…</div>;
  const actualTab = navigation[role].some(([id]) => id === tab) ? tab : 'accueil';
  const cartCount = Miam.cartLines(data).reduce((sum, p) => sum + p.quantity, 0);

  const content = {
    accueil: <Overview role={role} />,
    menu: role === 'etudiant' ? <StudentMenu /> : <ManageMenu role={role} />,
    panier: <Cart />,
    commandes: <Orders role={role} />,
    fidelite: <Loyalty />,
    parrainage: <Referral />,
    evenements: <Events />,
    reclamations: <Complaints role={role} />,
    classement: <Ranking />,
    profil: <Profile />,
    equipe: <Team role={role} />,
    promotions: <Promotions />,
    statistiques: <Statistics />,
    parametres: <Settings />,
  }[actualTab];

  return <div className="mm-workspace"><a href="#workspace" className="mm-skip">Aller au contenu</a>
    <aside className={`mm-sidebar ${drawer ? 'mm-sidebar-visible' : ''}`} id="mm-sidebar"><a className="mm-sidebar-brand" href="/"><img src="/assets/zeduc-space-logo.png" alt="" /><span>MON MIAM MIAM<small>ZEDUC-SP@CE</small></span></a><span className="mm-sidebar-caption">ESPACE {Miam.roles[role]?.toUpperCase()}</span>
      <nav aria-label="Navigation de mon espace">{navigation[role].map(([id, title]) => <a className={id === actualTab ? 'mm-side-active' : ''} href={`#${id}`} key={id} aria-current={id === actualTab ? 'page' : undefined}><span>{title}</span>{id === 'panier' && cartCount > 0 && <b>{cartCount}</b>}</a>)}</nav>
      <div className="mm-sidebar-bottom"><span className="mm-avatar">{Miam.initials(user.name)}</span><div><strong>{user.name}</strong><small>{Miam.roles[role]}</small></div><button aria-label="Se déconnecter" title="Se déconnecter" onClick={() => { Miam.logout(); refresh(); location.href = '/connexion.html'; }}>↪</button></div>
    </aside>
    {drawer && <button className="mm-drawer-shade" onClick={() => setDrawer(false)} aria-label="Fermer le menu" />}
    <div className="mm-work-main"><header className="mm-work-header"><button className="mm-icon-btn mm-work-menu" onClick={() => setDrawer(!drawer)} aria-expanded={drawer} aria-controls="mm-sidebar">☰</button><div><span className="mm-eyebrow">MON MIAM MIAM · KINSHASA</span><h1>{navigation[role].find(([id]) => id === actualTab)?.[1]}</h1></div><div className="mm-work-user"><span>{user.name}</span><span className="mm-avatar">{Miam.initials(user.name)}</span></div></header><main id="workspace" tabIndex="-1" className="mm-work-content" key={actualTab}>{content}</main><footer className="mm-work-footer">ZEDUC-SP@CE · Kinshasa · Les actions de cette version sont enregistrées localement sur votre appareil.</footer></div>
  </div>;
}

function Overview({ role }) {
  const { data, user } = useApp();
  const active = data.orders.filter(o => pending(o.status));
  const stats = Miam.stats(data, 7);
  if (role === 'etudiant') {
    const own = data.orders.filter(o => o.userId === user.id);
    const latest = own.find(o => pending(o.status));
    return <><div className="mm-welcome"><span className="mm-eyebrow">UNE PAUSE BIEN MÉRITÉE</span><h2>ON S’OCCUPE<br />DE VOTRE FAIM.</h2><p>Bonjour {user.name.split(' ')[0]}. Retrouvez vos plats et vos commandes au même endroit.</p><a className="mm-button mm-primary" href="#menu">Voir la carte →</a></div>
      <StatCards entries={[["Mes commandes", own.length, 'Tout mon historique'], ['Points fidélité', user.points || 0, 'À utiliser au panier'], ['Commandes en cours', own.filter(o => pending(o.status)).length, 'Suivre leur évolution']]} />
      {latest ? <Panel title="Votre commande en cours" action={<a href="#commandes">Voir le suivi →</a>}><OrderRow order={latest} showPerson={false} /></Panel> : <Panel title="Une envie pour aujourd’hui ?"><p>Aucune commande en cours. Découvrez les plats disponibles.</p><a className="mm-button mm-primary" href="#menu">Choisir un plat</a></Panel>}
      <Panel title="À découvrir"><div className="mm-three-grid">{data.products.filter(p => p.daily && p.available && !p.archived).slice(0, 3).map(p => <a key={p.id} className="mm-mini-dish" href="#menu"><img src={imageUrl(p.image)} alt="" /><strong>{p.name}</strong><span>{money(p.price)}</span></a>)}</div></Panel></>;
  }
  return <><div className="mm-welcome mm-staff-welcome"><span className="mm-eyebrow">LE SERVICE AU QUOTIDIEN</span><h2>BONJOUR {user.name.split(' ')[0].toUpperCase()}.</h2><p>Vos informations et les actions du restaurant, au même endroit.</p></div>
    <StatCards entries={[["Commandes à traiter", active.length, 'Tous les services'], ['Commandes terminées · 7 j', stats.done.length, 'Historique récent'], ['Plats disponibles', data.products.filter(p => p.available && !p.archived).length, 'Sur la carte'], ['Chiffre des commandes terminées', money(stats.revenue), 'Période de 7 jours']]} />
    <Panel title="Commandes à suivre" action={<a href="#commandes">Toutes les commandes →</a>}>{active.length ? active.slice(0, 5).map(o => <OrderRow order={o} key={o.id} showPerson />) : <Empty title="Service à jour" text="Aucune commande en attente." />}</Panel></>;
}

function ProductCard({ product, onSelect, add }) {
  const { execute } = useApp();
  return <article className="mm-product"><button type="button" className="mm-product-image" onClick={() => onSelect(product)}><img src={imageUrl(product.image)} loading="lazy" alt={product.name} />{product.daily && <span className="mm-image-label">PLAT DU JOUR</span>}</button><div className="mm-product-body"><small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p><div className="mm-product-bottom"><strong>{money(product.price)}</strong><Button disabled={!product.available} onClick={() => execute(() => Miam.addToCart(product.id), 'Ajouté au panier.')}>{product.available ? '+ Ajouter' : 'Indisponible'}</Button></div></div></article>;
}

function StudentMenu() {
  const { data, openDialog, closeDialog, execute } = useApp();
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('Tous');
  const products = data.products.filter(p => !p.archived && (category === 'Tous' || p.category === category) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  const categories = ['Tous', ...new Set(data.products.filter(p => !p.archived).map(p => p.category))];
  function detail(p) { openDialog(<><img className="mm-modal-image" src={imageUrl(p.image)} alt={p.name} /><DialogTitle>{p.name}</DialogTitle><p>{p.description}</p><p className="mm-price">{money(p.price)}</p><Button disabled={!p.available} onClick={() => { execute(() => Miam.addToCart(p.id), 'Ajouté à votre panier.'); closeDialog(); }}>Ajouter au panier</Button></>); }
  return <><p className="mm-lead">La carte du restaurant, les favoris du jour et vos envies.</p><div className="mm-filter-row"><div className="mm-category-list">{categories.map(c => <button key={c} className={c === category ? 'mm-chip active' : 'mm-chip'} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="mm-search"><input aria-label="Rechercher un plat" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un plat…" />{query && <button aria-label="Effacer la recherche" onClick={() => setQuery('')}>×</button>}</div></div>
    {products.length ? <div className="mm-product-grid">{products.map(p => <ProductCard key={p.id} product={p} onSelect={detail} />)}</div> : <Empty title="Aucun plat trouvé" text="Essayez une autre recherche." action={<Button tone="outline" onClick={() => { setQuery(''); setCategory('Tous'); }}>Tout afficher</Button>} />}</>;
}

function OrderRow({ order, showPerson = false, onDetail }) {
  const { data } = useApp();
  return <div className="mm-order-row"><div><strong>{order.id}</strong><small>{date(order.date)}{showPerson && ` · ${data.users.find(u => u.id === order.userId)?.name || 'Client'}`}</small></div><Status status={order.status} /><strong>{money(order.total)}</strong>{onDetail && <Button tone="outline" onClick={() => onDetail(order)}>Voir le détail</Button>}</div>;
}

function Cart() {
  const { data, user, execute, notify, openDialog, closeDialog } = useApp();
  const [mode, setMode] = useState('surplace');
  const [payment, setPayment] = useState('cash');
  const [usePoints, setUsePoints] = useState(false);
  const [error, setError] = useState('');
  const lines = Miam.cartLines(data);
  const totals = Miam.quote(data, user, { mode, usePoints });
  function finish(values) {
    const order = Miam.placeOrder(user.id, values);
    closeDialog();
    notify(`Commande ${order.id} enregistrée sur cet appareil. Aucun règlement réel effectué.`);
    location.hash = 'commandes';
    return order;
  }
  function checkout(e) {
    e.preventDefault(); setError('');
    const values = { ...getForm(e), mode, payment, usePoints, expectedTotal: totals.total };
    try {
      if (payment !== 'cash') {
        Miam.paymentDetails(values, false);
        openDialog(<ModalForm title="Confirmation Mobile Money" submit="Confirmer localement" success="Commande enregistrée. Aucun débit n’a été exécuté." save={() => finish({ ...values, paymentConfirmed: true })}>
          <p>Montant : <strong>{money(totals.total)}</strong> · {Miam.paymentProviders[payment]}.</p>
          <p>Cette confirmation enregistre la commande dans votre navigateur. Aucune opération financière n’est réalisée et aucun code PIN n’est demandé.</p>
        </ModalForm>);
      } else finish(values);
    } catch (cause) { setError(cause.message); }
  }
  if (!lines.length) return <Empty title="Votre panier est vide." text="Découvrez les plats disponibles et composez votre prochaine pause." action={<a className="mm-button mm-primary" href="#menu">Voir la carte →</a>} />;
  return <div className="mm-two-columns"><section className="mm-panel"><h3>Les plats choisis</h3>{lines.map(p => <div className="mm-cart-line" key={p.id}><img src={imageUrl(p.image)} alt="" /><div><strong>{p.name}</strong><small>{money(p.price)} / unité</small><button className="mm-text-link" onClick={() => execute(() => Miam.setQuantity(p.id, 0), 'Plat retiré.')}>Retirer</button></div><div className="mm-quantity"><button aria-label={`Retirer une unité de ${p.name}`} onClick={() => execute(() => Miam.setQuantity(p.id, p.quantity - 1))}>−</button><span>{p.quantity}</span><button aria-label={`Ajouter une unité de ${p.name}`} disabled={p.quantity >= 20} onClick={() => execute(() => Miam.setQuantity(p.id, p.quantity + 1))}>+</button></div><b>{money(p.price * p.quantity)}</b></div>)}</section>
    <form className="mm-panel mm-form mm-checkout" noValidate onSubmit={checkout}><h3>Préparer ma commande</h3><fieldset className="mm-radio-group"><legend>Mode de service</legend><label><input type="radio" name="mode" checked={mode === 'surplace'} onChange={() => setMode('surplace')} /> Sur place</label><label><input type="radio" name="mode" checked={mode === 'livraison'} onChange={() => setMode('livraison')} /> Livraison</label></fieldset>
      {mode === 'livraison' ? <><Field label="Adresse à Kinshasa" name="address" required defaultValue={user.address || ''} /><Field label="Téléphone de contact" name="phone" type="tel" required defaultValue={user.phone || ''} /></> : <Field label="Heure d’arrivée" name="arrival" type="time" value="13:00" required />}
      <Field label="Une précision pour la cuisine (facultatif)" name="note"><textarea className="resize-none" name="note" rows="3" maxLength="500" placeholder="Ex. sans piment" /></Field>
      <fieldset className="mm-radio-group"><legend>Règlement</legend><label><input type="radio" name="payment" checked={payment === 'cash'} onChange={() => setPayment('cash')} /> À régler sur place / à la livraison</label>{Object.entries(Miam.paymentProviders).map(([key, name]) => <label key={key}><input type="radio" name="payment" checked={payment === key} onChange={() => setPayment(key)} /> {name}</label>)}</fieldset>
      {payment !== 'cash' && <><Field label="Numéro Mobile Money" name="paymentPhone" type="tel" placeholder="+243 8…" /><p className="mm-note">Aucun transfert d’argent n’est effectué par cette application locale.</p></>}
      <label className="mm-checkbox"><input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} disabled={(user.points || 0) < data.settings.rewardPoints} /> Utiliser mes points ({user.points || 0} disponibles)</label>
      <div className="mm-recap"><div><span>Sous-total</span><strong>{money(totals.subtotal)}</strong></div><div><span>Livraison</span><strong>{money(totals.delivery)}</strong></div><div><span>Remise fidélité</span><strong>− {money(totals.discount)}</strong></div><div className="mm-total"><span>Total</span><strong>{money(totals.total)}</strong></div><small>{Math.floor((totals.subtotal - totals.discount) / data.settings.pointRate)} points après la fin du service.</small></div>
      <FormError>{error}</FormError><Button type="submit">Confirmer ma commande →</Button>
    </form>
  </div>;
}

function Orders({ role }) {
  const { data, user, execute, openDialog, closeDialog } = useApp();
  const [statusFilter, setStatusFilter] = useState('toutes');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const own = role === 'etudiant' ? data.orders.filter(o => o.userId === user.id) : data.orders;
  const rows = own.filter(o => (statusFilter === 'toutes' || (statusFilter === 'encours' ? pending(o.status) : o.status === statusFilter)) && `${o.id} ${data.users.find(u => u.id === o.userId)?.name || ''}`.toLowerCase().includes(query.toLowerCase()));
  const shown = rows.slice(page * 12, page * 12 + 12);
  function openOrder(order) {
    const transitions = { nouvelle: ['preparation', 'Confirmer et préparer'], preparation: ['prete', 'Marquer comme prête'], prete: order.mode === 'livraison' ? ['livraison', 'Lancer la livraison'] : ['terminee', 'Terminer le service'], livraison: ['terminee', 'Marquer terminée'] };
    const next = transitions[order.status];
    openDialog(<><DialogTitle>Commande {order.id}</DialogTitle><div className="mm-inline-actions"><Status status={order.status} /><span>{date(order.date)}</span></div><p><strong>Client :</strong> {data.users.find(u => u.id === order.userId)?.name || 'Client'}</p><p><strong>Service :</strong> {order.mode === 'livraison' ? 'Livraison' : `Sur place · ${order.arrival || ''}`}</p>{order.address && <p><strong>Adresse :</strong> {order.address}</p>}{order.note && <p><strong>Note :</strong> {order.note}</p>}
      <ul className="mm-order-items">{order.items.map((p, i) => <li key={i}>{p.quantity} × {p.name}<b>{money(p.price * p.quantity)}</b></li>)}</ul><p className="mm-modal-total">Total : {money(order.total)}</p><p><strong>Règlement :</strong> {order.payment}</p>
      <div className="mm-progress">{(order.mode === 'livraison' ? ['nouvelle', 'preparation', 'prete', 'livraison', 'terminee'] : ['nouvelle', 'preparation', 'prete', 'terminee']).map(s => <span key={s} className={s === order.status ? 'active' : ''}>{statuses[s]}</span>)}</div>
      {role !== 'etudiant' && next && <div className="mm-inline-actions"><Button onClick={() => { execute(() => Miam.transition(user.id, order.id, next[0]), 'Commande mise à jour.'); closeDialog(); }}>{next[1]}</Button>{['nouvelle', 'preparation'].includes(order.status) && <Button tone="danger" onClick={() => openDialog(<Confirm title="Annuler cette commande ?" text="La commande ne sera plus préparée. Les points utilisés seront restitués." label="Annuler la commande" confirm={() => Miam.transition(user.id, order.id, 'annulee')} />)}>Annuler</Button>}</div>}
      {role === 'etudiant' && order.status === 'terminee' && <Button tone="outline" onClick={() => openReview(order)}>Laisser un avis</Button>}
      </>);
  }
  function openReview(order) {
    const previous = data.comments.find(c => c.userId === user.id && c.orderId === order.id);
    openDialog(<ModalForm title="Comment était votre repas ?" submit="Publier mon avis" save={values => {
      if (values.message.trim().length < 10) throw new Error('Décrivez votre expérience en au moins 10 caractères.');
      const d = Miam.read(); d.comments = d.comments.filter(c => !(c.userId === user.id && c.orderId === order.id)); d.comments.push({ userId: user.id, orderId: order.id, rating: Number(values.rating), message: values.message.trim(), date: new Date().toISOString() }); Miam.save(d);
    }}><Field label="Note de 1 à 5" name="rating"><select name="rating" defaultValue={previous?.rating || 5}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></Field><Field label="Votre expérience" name="message"><textarea className="resize-none" name="message" defaultValue={previous?.message || ''} rows="4" required /></Field></ModalForm>);
  }
  return <><div className="mm-filter-row"><div className="mm-search"><input value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} aria-label="Rechercher une commande" placeholder="N° ou nom du client…" />{query && <button aria-label="Effacer la recherche" onClick={() => { setQuery(''); setPage(0); }}>×</button>}</div><label className="mm-filter-select">Statut <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}><option value="toutes">Toutes</option><option value="encours">En cours</option>{Object.entries(statuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
  <Panel>{rows.length ? <>{shown.map(o => <OrderRow key={o.id} order={o} showPerson={role !== 'etudiant'} onDetail={openOrder} />)}<div className="mm-pagination"><span>{page * 12 + 1}–{Math.min(rows.length, (page + 1) * 12)} sur {rows.length}</span><Button tone="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>←</Button><Button tone="outline" disabled={(page + 1) * 12 >= rows.length} onClick={() => setPage(page + 1)}>→</Button></div></> : <Empty title="Aucune commande" text="Aucune commande ne correspond à ce filtre." action={<Button tone="outline" onClick={() => { setQuery(''); setStatusFilter('toutes'); setPage(0); }}>Réinitialiser</Button>} />}</Panel></>;
}

function Loyalty() {
  const { data, user } = useApp();
  const log = data.pointsLog.filter(p => p.userId === user.id);
  return <><div className="mm-points-banner"><span className="mm-eyebrow">VOTRE FIDÉLITÉ</span><strong>{user.points || 0}<small> POINTS</small></strong><p>Après chaque commande terminée, vos points s’ajoutent ici. Vous pouvez les utiliser pour réduire le total de votre prochain panier.</p><a className="mm-button mm-primary" href="#menu">Choisir un plat</a></div><Panel title="Mouvements de points">{log.length ? log.map(p => <div className="mm-order-row" key={p.id}><div><strong>{p.label}</strong><small>{date(p.date)}</small></div><b className={p.amount >= 0 ? 'mm-positive' : 'mm-negative'}>{p.amount > 0 ? '+' : ''}{p.amount} points</b></div>) : <Empty title="Aucun mouvement" text="Vos points apparaîtront ici après votre première commande terminée." />}</Panel></>;
}

function Referral() {
  const { user, data, notify } = useApp();
  const refs = data.referrals.filter(r => r.sponsorId === user.id);
  async function copy(text) { try { await navigator.clipboard.writeText(text); notify('Lien copié.'); } catch { notify(`Code : ${user.code}`); } }
  return <><div className="mm-points-banner"><span className="mm-eyebrow">LA TABLE S’AGRANDIT</span><h2>INVITEZ VOS AMIS.</h2><p>Partagez votre code : un bonus est attribué après la première commande terminée de votre filleul.</p><div className="mm-referral-code"><strong>{user.code}</strong><Button onClick={() => copy(user.code)}>Copier le code</Button><Button tone="outline" onClick={() => copy(new URL(`/inscription.html?parrain=${encodeURIComponent(user.code)}`, location.href).href)}>Copier le lien</Button></div></div><Panel title="Mes invitations">{refs.length ? refs.map(r => <div className="mm-order-row" key={r.id}><strong>{data.users.find(u => u.id === r.childId)?.name}</strong><Badge tone={r.rewarded ? 'success' : 'warning'}>{r.rewarded ? 'Bonus attribué' : 'Première commande attendue'}</Badge></div>) : <Empty title="Aucune invitation enregistrée" text="Partagez votre code pour inviter des amis." />}</Panel></>;
}

function Events() {
  const { data, user, execute, openDialog, closeDialog } = useApp();
  const promotions = data.promotions.filter(p => p.active);
  const played = data.quiz.some(q => q.userId === user.id && q.day === new Date().toISOString().slice(0, 10));
  function quiz() {
    openDialog(<ModalForm title="La pause quiz" submit="Valider ma réponse" save={values => {
      const d = Miam.read(), day = new Date().toISOString().slice(0, 10);
      if (d.quiz.some(q => q.userId === user.id && q.day === day)) throw new Error('Vous avez déjà participé aujourd’hui.');
      const won = values.answer === 'Kinshasa';
      d.quiz.push({ userId: user.id, day, answer: values.answer, won });
      if (won) { const member = d.users.find(u => u.id === user.id); member.points += 5; d.pointsLog.unshift({ id: Miam.uid('pt'), userId: user.id, date: new Date().toISOString(), amount: 5, label: 'Quiz du jour' }); }
      Miam.save(d);
    }}><p>Dans quelle ville se trouve la communauté Mon Miam Miam ?</p><Field label="Votre réponse" name="answer"><select name="answer"><option>Kinshasa</option><option>Brazzaville</option><option>Douala</option></select></Field></ModalForm>);
  }
  return <><p className="mm-lead">Retrouvez les offres et les moments partagés autour du restaurant.</p><div className="mm-event-grid">{promotions.map(p => {
    const joined = data.participations.some(e => e.userId === user.id && e.promoId === p.id);
    return <article className="mm-event" key={p.id}><img src={imageUrl(p.image)} alt="" /><div><Badge>{p.type}</Badge><h3>{p.title}</h3><p>{p.text}</p><small>{p.date}</small><Button tone={joined ? 'outline' : 'primary'} onClick={() => execute(() => {
      const d = Miam.read(), index = d.participations.findIndex(x => x.userId === user.id && x.promoId === p.id);
      if (index < 0) d.participations.push({ userId: user.id, promoId: p.id }); else d.participations.splice(index, 1);
      Miam.save(d);
    }, joined ? 'Participation retirée.' : 'Participation enregistrée sur cet appareil.')}>{joined ? 'Ne plus participer' : 'Je participe →'}</Button></div></article>;
  })}</div><Panel title="Question du jour"><p>Une question rapide sur votre communauté, pour gagner 5 points.</p><Button disabled={played} onClick={quiz}>{played ? 'Déjà joué aujourd’hui' : 'Répondre au quiz'}</Button></Panel></>;
}

function Complaints({ role }) {
  const { data, user, openDialog, execute } = useApp();
  const [query, setQuery] = useState('');
  const own = role === 'etudiant' ? data.complaints.filter(c => c.userId === user.id) : data.complaints;
  const complaints = own.filter(c => `${c.subject} ${c.orderId}`.toLowerCase().includes(query.toLowerCase()));
  function createComplaint() {
    const orders = data.orders.filter(o => o.userId === user.id);
    if (!orders.length) return;
    openDialog(<ModalForm title="Signaler un problème" success="Votre demande a été enregistrée." save={values => Miam.complaint(user.id, values)}><Field label="Commande concernée" name="orderId"><select name="orderId">{orders.map(o => <option key={o.id} value={o.id}>{o.id} · {date(o.date)}</option>)}</select></Field><Field label="Objet" name="subject" required /><Field label="Votre message (10 caractères minimum)" name="message"><textarea className="resize-none" name="message" rows="4" required /></Field></ModalForm>);
  }
  function inspect(c) {
    openDialog(<><DialogTitle>{c.subject}</DialogTitle><p><strong>Commande :</strong> {c.orderId}</p><Status status={c.status} /><p>{c.message}</p>{c.reply && c.status === 'resolue' && <blockquote className="mm-quote"><strong>Réponse de l’équipe</strong><p>{c.reply}</p></blockquote>}
      {role !== 'etudiant' && <ModalForm title="Répondre à la demande" submit={role === 'employe' ? 'Proposer la réponse' : 'Valider la réponse'} save={values => Miam.replyComplaint(user.id, c.id, values.reply, role !== 'employe')}><Field label="Réponse" name="reply"><textarea className="resize-none" name="reply" defaultValue={c.reply} rows="4" required /></Field></ModalForm>}
      {['admin', 'gerant'].includes(role) && c.status === 'resolue' && <Button tone="outline" onClick={() => execute(() => { const d = Miam.read(); d.complaints.find(x => x.id === c.id).status = 'ouverte'; Miam.save(d); }, 'Demande réouverte.')}>Rouvrir la demande</Button>}
    </>);
  }
  return <><div className="mm-filter-row"><p className="mm-lead">{role === 'etudiant' ? 'Un souci avec un repas ? Écrivez-nous.' : 'Les demandes de la communauté et leurs réponses.'}</p>{role === 'etudiant' && <Button disabled={!data.orders.some(o => o.userId === user.id)} onClick={createComplaint}>Nouvelle réclamation +</Button>}</div>
    <div className="mm-search mm-search-spaced"><input aria-label="Rechercher une réclamation" value={query} onChange={e => setQuery(e.target.value)} placeholder="Objet ou commande…" />{query && <button onClick={() => setQuery('')} aria-label="Effacer la recherche">×</button>}</div>
    <Panel>{complaints.length ? complaints.map(c => <div className="mm-order-row" key={c.id}><div><strong>{c.subject}</strong><small>{c.orderId} · {date(c.date)}</small></div><Status status={c.status} /><Button tone="outline" onClick={() => inspect(c)}>Voir / répondre</Button></div>) : <Empty title="Aucune réclamation" text="Les demandes apparaîtront ici." />}</Panel></>;
}

function Ranking() {
  const { data, user } = useApp();
  const [days, setDays] = useState(7);
  const counts = new Map();
  data.orders.filter(o => o.status === 'terminee' && new Date(o.date).getTime() >= Date.now() - days * 86400000).forEach(o => counts.set(o.userId, (counts.get(o.userId) || 0) + 1));
  const leaders = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 20);
  return <><div className="mm-filter-row"><p className="mm-lead">Les habitués de notre communauté, selon les commandes terminées.</p><label className="mm-filter-select">Période <select value={days} onChange={e => setDays(Number(e.target.value))}><option value="7">7 jours</option><option value="30">30 jours</option><option value="90">90 jours</option></select></label></div><Panel title="Classement des gourmands">{leaders.length ? leaders.map(([id, count], i) => <div className="mm-order-row" key={id}><strong>{i + 1}. {id === user.id ? 'Vous' : data.users.find(u => u.id === id)?.name || 'Membre'}</strong><span>{count} commande{count > 1 ? 's' : ''}</span></div>) : <Empty title="Pas encore de classement" text="Les commandes terminées constitueront le classement." />}</Panel></>;
}

function Profile() {
  const { user, data, notify } = useApp();
  const [error, setError] = useState('');
  function save(e) {
    e.preventDefault(); setError(''); const values = getForm(e);
    const d = Miam.read();
    if (!values.name.trim() || !values.email.trim()) return setError('Indiquez votre nom et votre adresse e-mail.');
    if (d.users.some(u => u.id !== user.id && u.email.toLowerCase() === values.email.toLowerCase())) return setError('Adresse e-mail déjà utilisée.');
    Object.assign(d.users.find(u => u.id === user.id), { name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), address: values.address.trim() });
    Miam.save(d); notify('Profil enregistré.');
  }
  return <div className="mm-two-columns"><Panel title="Mes coordonnées"><form key={user.id} noValidate onSubmit={save} className="mm-form"><Field label="Nom" name="name" value={user.name} required /><Field label="E-mail" name="email" type="email" value={user.email} required /><Field label="Téléphone" name="phone" value={user.phone || ''} /><Field label="Adresse" name="address" value={user.address || ''} /><FormError>{error}</FormError><Button type="submit">Enregistrer mes modifications</Button></form></Panel><Panel title="Mon espace"><div className="mm-profile-avatar">{Miam.initials(user.name)}</div><h3>{user.name}</h3><p>{user.email}</p><div className="mm-recap"><div><span>Points</span><strong>{user.points || 0}</strong></div><div><span>Code de parrainage</span><strong>{user.code}</strong></div><div><span>Commandes</span><strong>{data.orders.filter(o => o.userId === user.id).length}</strong></div></div></Panel></div>;
}

function ManageMenu({ role }) {
  const { data, user, execute, openDialog } = useApp();
  const [query, setQuery] = useState('');
  const products = data.products.filter(p => !p.archived && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  function productForm(product = null) {
    const p = product || { name: '', description: '', category: 'Plats', price: 15000, image: 'burger-5.png', available: true, daily: false };
    openDialog(<ModalForm title={product ? 'Modifier le plat' : 'Ajouter un plat'} success="La carte a été mise à jour." save={async (values, form) => {
      const image = await saveImage(form.elements.photo.files?.[0]);
      Miam.saveProduct(user.id, { ...p, name: values.name.trim(), description: values.description.trim(), category: values.category.trim(), price: Number(values.price), image: image || values.image || p.image, available: form.elements.available.checked, daily: form.elements.daily.checked });
    }}><Field label="Nom du plat" name="name" value={p.name} required /><Field label="Catégorie" name="category" value={p.category} required /><Field label="Prix en CDF" name="price" type="number" min="1" value={p.price} required /><Field label="Description" name="description"><textarea className="resize-none" name="description" rows="3" defaultValue={p.description} /></Field><Field label="Photo existante" name="image"><select name="image" defaultValue={p.image?.startsWith('data:') ? '' : p.image}>{['burger-5.png', 'shushi-1.png', 'fried_rice-1.png', 'exploring_img-1.png', 'Mango-Sorbet-1.png', 'classic_cheez_pizza-1-1.png', 'gallery_img2-1-1.png'].map(name => <option key={name} value={name}>{name}</option>)}</select></Field><Field label="Ou importer une photo PNG, JPG, WebP (500 Ko max)" name="photo" type="file" accept="image/png,image/jpeg,image/webp" /><label className="mm-checkbox"><input name="available" type="checkbox" defaultChecked={p.available} /> Disponible</label><label className="mm-checkbox"><input name="daily" type="checkbox" defaultChecked={p.daily} /> Plat du jour</label></ModalForm>);
  }
  return <><div className="mm-filter-row"><div className="mm-search"><input placeholder="Rechercher un plat…" aria-label="Rechercher un plat" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Effacer la recherche" onClick={() => setQuery('')}>×</button>}</div>{role === 'admin' && <Button onClick={() => productForm()}>Ajouter un plat +</Button>}</div>
    <Panel>{products.length ? products.map(p => <div className="mm-manage-row" key={p.id}><img src={imageUrl(p.image)} alt="" /><div><strong>{p.name}</strong><small>{p.category} · {money(p.price)}</small></div><label className="mm-checklabel"><input type="checkbox" checked={!!p.available} onChange={() => execute(() => Miam.toggleProduct(user.id, p.id, 'available'))} /> Disponible</label><label className="mm-checklabel"><input type="checkbox" checked={!!p.daily} onChange={() => execute(() => Miam.toggleProduct(user.id, p.id, 'daily'))} /> Du jour</label>{role === 'admin' && <div className="mm-inline-actions"><Button tone="outline" onClick={() => productForm(p)}>Modifier</Button><Button tone="danger" onClick={() => openDialog(<Confirm title="Retirer ce plat ?" text={`${p.name} sera retiré de la carte. Les anciennes commandes conserveront leur détail.`} label="Retirer le plat" confirm={() => Miam.archiveProduct(user.id, p.id)} />)}>Retirer</Button></div>}</div>) : <Empty title="Aucun plat" text="Aucun plat ne correspond à la recherche." />}</Panel></>;
}

function Team({ role }) {
  const { data, user, execute, openDialog } = useApp();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const allowed = data.users.filter(u => !u.archived && (role === 'admin' || u.role === 'employe') && `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));
  function edit(member = null) {
    const u = member || { name: '', email: '', role: 'employe' };
    openDialog(<ModalForm title={member ? 'Modifier ce compte' : 'Créer un compte'} success="Compte enregistré." save={values => Miam.saveStaff(user.id, { ...u, ...values, name: values.name.trim(), email: values.email.trim() })}>
      <Field label="Nom" name="name" value={u.name} required /><Field label="E-mail" name="email" type="email" value={u.email} required />
      <Field label="Rôle" name="role"><select name="role" defaultValue={u.role}>{(role === 'gerant' ? ['employe'] : ['etudiant', 'employe', 'gerant']).map(r => <option key={r} value={r}>{Miam.roles[r]}</option>)}</select></Field>
      <Field label={member ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe (8 caractères, une majuscule, un chiffre)'} name="password" type="password" autoComplete="new-password" />
    </ModalForm>);
  }
  return <><div className="mm-filter-row"><div className="mm-search"><input aria-label="Rechercher un membre" placeholder="Nom ou e-mail…" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} />{query && <button aria-label="Effacer la recherche" onClick={() => { setQuery(''); setPage(0); }}>×</button>}</div><Button onClick={() => edit()}>Ajouter un membre +</Button></div>
    <Panel>{allowed.slice(page * 12, page * 12 + 12).map(member => <div className="mm-manage-row" key={member.id}><span className="mm-avatar">{Miam.initials(member.name)}</span><div><strong>{member.name}</strong><small>{member.email} · {Miam.roles[member.role]}</small></div><Badge tone={member.active ? 'success' : 'warning'}>{member.active ? 'Actif' : 'Suspendu'}</Badge><div className="mm-inline-actions"><Button tone="outline" disabled={member.id.startsWith('demo-') || member.id === user.id} onClick={() => edit(member)}>Modifier</Button><Button tone="outline" disabled={member.id.startsWith('demo-') || member.id === user.id} onClick={() => openDialog(<Confirm title={member.active ? 'Suspendre ce compte ?' : 'Réactiver ce compte ?'} text={`${member.name} ${member.active ? 'ne pourra plus se connecter' : 'retrouvera son accès'}.`} label={member.active ? 'Suspendre' : 'Réactiver'} confirm={() => Miam.toggleStaff(user.id, member.id)} />)}>{member.active ? 'Suspendre' : 'Réactiver'}</Button>{role === 'admin' && <Button tone="danger" disabled={member.id.startsWith('demo-') || member.id === user.id} onClick={() => openDialog(<Confirm title="Archiver ce compte ?" text={`Le compte ${member.name} ne pourra plus se connecter. Son historique sera conservé.`} label="Archiver" confirm={() => Miam.archiveAccount(user.id, member.id)} />)}>Archiver</Button>}</div></div>)}{!allowed.length && <Empty title="Aucun compte" text="Aucun membre ne correspond à la recherche." />}{allowed.length > 12 && <div className="mm-pagination"><span>{page * 12 + 1}–{Math.min(allowed.length, page * 12 + 12)} sur {allowed.length}</span><Button tone="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>←</Button><Button tone="outline" disabled={(page + 1) * 12 >= allowed.length} onClick={() => setPage(page + 1)}>→</Button></div>}</Panel></>;
}

function Promotions() {
  const { data, user, execute, openDialog } = useApp();
  function edit(p = null) {
    const old = p || { title: '', text: '', image: 'burger-5.png', type: 'Offre', date: new Date().toISOString().slice(0, 10), active: true };
    openDialog(<ModalForm title={p ? 'Modifier cette affiche' : 'Créer une affiche'} success="Offre enregistrée." save={async (v, form) => {
      Miam.requireRole(user, ['admin']);
      if (!v.title.trim() || !v.text.trim()) throw new Error('Ajoutez un titre et une description.');
      const image = await saveImage(form.elements.photo.files?.[0]);
      const d = Miam.read(), changed = { ...old, id: old.id || Miam.uid('affiche'), title: v.title.trim(), text: v.text.trim(), type: v.type, date: v.date, image: image || v.image || old.image, active: form.elements.active.checked };
      if (p) Object.assign(d.promotions.find(x => x.id === p.id), changed); else d.promotions.unshift(changed);
      Miam.save(d);
    }}><Field label="Titre" name="title" value={old.title} required /><Field label="Description" name="text"><textarea className="resize-none" name="text" rows="4" defaultValue={old.text} required /></Field><Field label="Type" name="type"><select name="type" defaultValue={old.type}><option>Offre</option><option>Événement</option></select></Field><Field label="Date" name="date" type="date" value={old.date} /><Field label="Image existante" name="image"><select name="image" defaultValue={old.image?.startsWith('data:') ? '' : old.image}>{['burger-5.png', 'make_reservation-1.png', 'a_collection_img-1.png', 'gallery_image3.png'].map(n => <option key={n} value={n}>{n}</option>)}</select></Field><Field label="Ou importer une image (500 Ko max)" name="photo" type="file" accept="image/png,image/jpeg,image/webp" /><label className="mm-checkbox"><input name="active" type="checkbox" defaultChecked={old.active} /> Visible pour les étudiants</label></ModalForm>);
  }
  return <><div className="mm-filter-row"><p className="mm-lead">Préparez les offres et événements visibles par la communauté.</p><Button onClick={() => edit()}>Créer une affiche +</Button></div><div className="mm-event-grid">{data.promotions.map(p => <article className="mm-event" key={p.id}><img src={imageUrl(p.image)} alt="" /><div><Badge tone={p.active ? 'success' : 'warning'}>{p.active ? 'Visible' : 'Masquée'}</Badge><h3>{p.title}</h3><p>{p.text}</p><small>{p.type} · {p.date}</small><div className="mm-inline-actions"><Button tone="outline" onClick={() => edit(p)}>Modifier</Button><Button tone="outline" onClick={() => execute(() => { Miam.requireRole(user, ['admin']); const d = Miam.read(); d.promotions.find(x => x.id === p.id).active = !p.active; Miam.save(d); })}>{p.active ? 'Masquer' : 'Afficher'}</Button></div></div></article>)}</div></>;
}

function Statistics() {
  const { data } = useApp();
  const [days, setDays] = useState(7);
  const s = Miam.stats(data, days);
  const counts = new Map();
  s.done.forEach(o => o.items.forEach(p => counts.set(p.name, (counts.get(p.name) || 0) + p.quantity)));
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return <><div className="mm-filter-row"><p className="mm-lead">Les chiffres issus des commandes enregistrées dans l’application.</p><label className="mm-filter-select">Période <select value={days} onChange={e => setDays(Number(e.target.value))}><option value="7">7 jours</option><option value="30">30 jours</option><option value="90">90 jours</option></select></label></div><StatCards entries={[["Commandes", s.orders.length, `${days} jours`], ['Terminées', s.done.length, 'Service effectué'], ['Recettes enregistrées', money(s.revenue), 'À partir des commandes terminées'], ['Panier moyen', money(s.average), 'Commandes terminées']]} /><Panel title="Les plats les plus commandés">{top.length ? top.map(([name, count], i) => <div className="mm-order-row" key={name}><strong>{i + 1}. {name}</strong><span>{count} vendu{count > 1 ? 's' : ''}</span><div className="mm-bar" style={{ width: `${Math.round(count / top[0][1] * 100)}%` }} /></div>) : <Empty title="Pas encore de ventes" text="Les plats les plus choisis apparaîtront ici." />}</Panel></>;
}

function Settings() {
  const { data, user, notify } = useApp();
  const [error, setError] = useState('');
  const s = data.settings;
  function submit(e) {
    e.preventDefault(); setError(''); const values = getForm(e);
    try {
      Miam.requireRole(user, ['admin']);
      const d = Miam.read();
      for (const key of ['pointRate', 'rewardPoints', 'rewardValue', 'referralBonus', 'deliveryFee']) {
        const value = Number(values[key]);
        if (!Number.isInteger(value) || value < (['referralBonus', 'deliveryFee'].includes(key) ? 0 : 1)) throw new Error('Vérifiez les montants et taux : entrez des nombres valides.');
        d.settings[key] = value;
      }
      d.settings.restaurant = values.restaurant.trim(); d.settings.city = values.city.trim(); d.settings.hours = values.hours.trim();
      if (!d.settings.restaurant || !d.settings.city) throw new Error('Précisez le restaurant et la ville.');
      Miam.save(d); notify('Paramètres enregistrés.');
    } catch (cause) { setError(cause.message); }
  }
  return <Panel title="Règles du restaurant"><form noValidate onSubmit={submit} className="mm-form mm-settings-grid"><Field label="Nom du restaurant" name="restaurant" value={s.restaurant} required /><Field label="Ville" name="city" value={s.city} required /><Field label="Horaires" name="hours" value={s.hours} /><Field label="Francs dépensés pour un point" name="pointRate" type="number" min="1" value={s.pointRate} /><Field label="Points nécessaires pour une récompense" name="rewardPoints" type="number" min="1" value={s.rewardPoints} /><Field label="Valeur d’une récompense (CDF)" name="rewardValue" type="number" min="1" value={s.rewardValue} /><Field label="Bonus parrainage" name="referralBonus" type="number" min="0" value={s.referralBonus} /><Field label="Livraison (CDF)" name="deliveryFee" type="number" min="0" value={s.deliveryFee} /><FormError>{error}</FormError><Button type="submit">Enregistrer les paramètres</Button></form></Panel>;
}
