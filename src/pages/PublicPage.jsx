import React, { useEffect, useState } from 'react';
import { Miam, imageUrl } from '../domain/miam.js';
import { Badge, Button, DialogTitle, Empty, Field, money, useApp } from '../App.jsx';

const heroImages = ['/assets/hero-burger.jpeg', '/assets/hero-burger-alt.jpeg', '/assets/home_2hero_bg-1.png'];

export function PublicPage() {
  const { data, user, notify, execute, openDialog, closeDialog } = useApp();
  const [hero, setHero] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tous');
  const [mobile, setMobile] = useState(false);
  const [reservationState, setReservationState] = useState('');
  useEffect(() => {
    document.title = 'Mon Miam Miam · ZEDUC-SP@CE · Kinshasa';
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const id = setInterval(() => setHero(i => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(id);
  }, []);

  const products = data.products.filter(p => !p.archived &&
    (category === 'Tous' || p.category === category) &&
    `${p.name} ${p.description} ${p.category}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
  const categories = ['Tous', ...new Set(data.products.filter(p => !p.archived).map(p => p.category))];
  const daily = data.products.filter(p => p.daily && p.available && !p.archived).slice(0, 3);
  const accountUrl = user ? `/${user.role}.html` : '/connexion.html';

  function viewDish(product) {
    openDialog(<>
      <img className="mm-modal-image" src={imageUrl(product.image)} alt={product.name} />
      <DialogTitle>{product.name}</DialogTitle>
      <p>{product.description}</p><p className="mm-price">{money(product.price)}</p>
      {user?.role === 'etudiant' ? <Button disabled={!product.available} onClick={() => {
        execute(() => Miam.addToCart(product.id), 'Plat ajouté au panier.'); closeDialog();
      }}>Ajouter à mon panier</Button> : <a className="mm-button mm-primary" href={accountUrl}>Se connecter pour commander →</a>}
    </>);
  }

  function reserve(e) {
    e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget));
    if (!values.name.trim() || !values.phone.trim() || !values.date || !values.time) {
      setReservationState('Complétez votre nom, téléphone, date et heure.'); return;
    }
    const d = Miam.read();
    d.reservations.unshift({ id: Miam.uid('table'), ...values, dateAdded: new Date().toISOString() });
    Miam.save(d);
    e.currentTarget.reset();
    setReservationState('Votre souhait de réservation est enregistré sur cet appareil. Le restaurant ne l’a pas reçu.');
  }

  return <div className="mm-site">
    <a href="#main" className="mm-skip">Aller au contenu</a>
    <div className="mm-ribbon"><span>KINSHASA • RDC</span><span>LA TABLE DES ÉTUDIANTS ULC ICAM</span><span>LE GOÛT DE SE RETROUVER</span></div>
    <header className="mm-public-header">
      <a className="mm-brand" href="#top"><img src="/assets/zeduc-space-logo.png" alt="ZEDUC-SP@CE" /><span>MON MIAM MIAM<small>ZEDUC-SP@CE</small></span></a>
      <button className="mm-icon-btn mm-menu-toggle" aria-expanded={mobile} aria-controls="main-navigation" onClick={() => setMobile(!mobile)}>☰ <span className="mm-sr">Menu</span></button>
      <nav className={mobile ? 'mm-nav mm-nav-open' : 'mm-nav'} id="main-navigation" aria-label="Navigation principale" onClick={() => setMobile(false)}>
        <a href="#top">Accueil</a><a href="#histoire">Notre table</a><a href="#carte">La carte</a><a href="#offres">Les rendez-vous</a><a href="#contact">Contact</a>
      </nav>
      <div className="mm-header-ctas"><a href={accountUrl}>{user ? 'Mon espace' : 'Connexion'}</a>{!user && <a className="mm-button mm-primary" href="/inscription.html">S’inscrire ↗</a>}</div>
    </header>

    <main id="main">
      <section className="mm-hero" id="top">
        <div className="mm-hero-images" aria-hidden="true">{heroImages.map((img, i) => <div key={img} className={`mm-hero-image ${hero === i ? 'mm-hero-active' : ''}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(8,15,13,.86), rgba(8,15,13,.10)), url('${img}')` }} />)}</div>
        <div className="mm-hero-inner"><span className="mm-eyebrow">ZEDUC-SP@CE · KINSHASA</span><h1>ON SE RETROUVE<br /><em>AUTOUR DU GOÛT.</em></h1>
          <p>Entre deux cours, après une longue journée ou pour le plaisir : une table, des plats généreux et les bonnes personnes.</p>
          <div className="mm-inline-actions"><a className="mm-button mm-primary" href="#carte">Découvrir la carte ↓</a><a className="mm-button mm-outline-light" href="/inscription.html">Rejoindre la communauté</a></div>
          <p className="mm-hero-meta">L’ESPRIT DU CAMPUS · LES SAVEURS DE KINSHASA</p>
        </div>
        <div className="mm-hero-progress" aria-hidden="true">{heroImages.map((_, i) => <span key={i} className={hero === i ? 'active' : ''} />)}</div>
      </section>

      <section id="histoire" className="mm-story mm-container"><div><span className="mm-eyebrow">BIENVENUE À NOTRE TABLE</span><h2>UNE PAUSE QUI<br />RASSEMBLE.</h2><p>Mon Miam Miam, c’est l’univers gourmand du restaurant ZEDUC-SP@CE à Kinshasa. Un point de rencontre pour la communauté étudiante ULC ICAM : venir déjeuner, partager ses envies et profiter du moment.</p><p>Découvrez la carte dès maintenant. Pour préparer une commande, connectez-vous à votre espace étudiant.</p><a className="mm-text-link" href="/inscription.html">Créer mon espace →</a></div><img src="/assets/authentic_img1-1.png" alt="Assiette généreuse préparée au restaurant" loading="lazy" /></section>

      <section className="mm-daily mm-container"><div className="mm-section-heading"><div><span className="mm-eyebrow">EN CE MOMENT</span><h2>LES ENVIES DU JOUR.</h2></div><a href="#carte">Toute la carte →</a></div><div className="mm-three-grid">{daily.map(p => <button key={p.id} className="mm-photo-card" onClick={() => viewDish(p)}><img src={imageUrl(p.image)} alt="" loading="lazy" /><span><strong>{p.name}</strong><small>{money(p.price)} ↗</small></span></button>)}</div></section>

      <section className="mm-menu-section" id="carte"><div className="mm-container"><div className="mm-section-heading"><div><span className="mm-eyebrow">À SAVOURER</span><h2>LA CARTE, SELON VOS ENVIES.</h2></div><p>Prix en francs congolais • Disponibilité selon le service</p></div>
        <div className="mm-menu-controls"><div className="mm-category-list" aria-label="Catégories">{categories.map(c => <button key={c} className={category === c ? 'mm-chip active' : 'mm-chip'} onClick={() => setCategory(c)} aria-pressed={category === c}>{c}</button>)}</div><div className="mm-search"><label htmlFor="public-search" className="mm-sr">Rechercher un plat</label><input id="public-search" placeholder="Rechercher un plat…" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Effacer la recherche" onClick={() => setQuery('')}>×</button>}</div></div>
        {products.length ? <div className="mm-dishes-grid">{products.map(p => <button key={p.id} className="mm-dish" onClick={() => viewDish(p)}><img src={imageUrl(p.image)} alt="" loading="lazy" /><span className="mm-dish-body"><strong>{p.name}</strong><span>{p.description}</span><span className="mm-dish-foot"><b>{money(p.price)}</b><Badge tone={p.available ? 'success' : 'warning'}>{p.available ? 'Disponible' : 'Indisponible'}</Badge></span></span></button>)}</div> : <Empty title="Aucun plat trouvé" text="Essayez un autre nom ou une autre catégorie." action={<Button tone="outline" onClick={() => { setQuery(''); setCategory('Tous'); }}>Réinitialiser</Button>} />}
        {!user && <div className="mm-menu-join"><div><span className="mm-eyebrow">VOTRE PROCHAINE PAUSE</span><h3>ENVIE DE PASSER COMMANDE ?</h3><p>Créez votre espace pour accéder au panier, aux commandes et à la fidélité.</p></div><a className="mm-button mm-primary" href="/inscription.html">Créer mon compte →</a></div>}
      </div></section>

      <section className="mm-values mm-container"><article><span>01</span><h3>LES SAVEURS</h3><p>Des plats à retrouver sur place, de la grillade au dessert.</p></article><article><span>02</span><h3>LE MOMENT</h3><p>Un lieu imaginé pour les rencontres et les pauses du campus.</p></article><article><span>03</span><h3>LA FIDÉLITÉ</h3><p>Des points après les commandes terminées depuis votre espace.</p></article></section>

      <section className="mm-events-section" id="offres"><div className="mm-container"><div className="mm-section-heading"><div><span className="mm-eyebrow">LA VIE DU RESTO</span><h2>LES RENDEZ-VOUS À SUIVRE.</h2></div></div><div className="mm-event-grid">{data.promotions.filter(p => p.active).map(p => <article className="mm-event" key={p.id}><img src={imageUrl(p.image)} alt="" loading="lazy" /><div><Badge>{p.type}</Badge><h3>{p.title}</h3><p>{p.text}</p><small>{p.date && new Date(`${p.date}T12:00:00`).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</small></div></article>)}</div></div></section>

      <section className="mm-reservation mm-container"><div><span className="mm-eyebrow">ENVIE DE VOUS RETROUVER ?</span><h2>IMAGINEZ VOTRE<br />PROCHAINE TABLE.</h2><p>Indiquez votre souhait de passage. Ce formulaire sauvegarde votre demande dans votre navigateur ; il ne contacte pas encore le restaurant.</p></div><form noValidate onSubmit={reserve} className="mm-reservation-form"><Field name="name" label="Votre nom" required placeholder="Nom et prénom" /><Field name="phone" label="Téléphone" type="tel" required placeholder="+243…" /><Field name="date" label="Date" type="date" required /><Field name="time" label="Heure" type="time" required /><Field name="guests" label="Personnes" type="number" min="1" max="20" value="2" /><Button type="submit">Enregistrer mon souhait →</Button>{reservationState && <p className="mm-inline-message" role="status">{reservationState}</p>}</form></section>
    </main>
    <footer id="contact" className="mm-footer"><div className="mm-container mm-footer-grid"><div><img src="/assets/zeduc-space-logo.png" alt="" /><h2>MON MIAM MIAM.</h2><p>Le goût de se retrouver, à Kinshasa.</p></div><div><h3>Explorer</h3><a href="#histoire">Notre histoire</a><a href="#carte">La carte</a><a href="#offres">Offres et événements</a></div><div><h3>Votre espace</h3><a href="/connexion.html">Connexion</a><a href="/inscription.html">Inscription</a><p>ULC ICAM · Kinshasa, RDC</p></div></div><p className="mm-footer-foot">© {new Date().getFullYear()} ZEDUC-SP@CE · Mon Miam Miam</p></footer>
  </div>;
}
