import React, { useEffect, useState } from 'react';
import { Miam } from '../domain/miam.js';
import { Button, Field, FormError, getForm, hrefFor, useApp } from '../App.jsx';

const paths = { 'connexion.html': 'Connexion', 'inscription.html': 'Inscription', 'mot-de-passe-oublie.html': 'Mot de passe oublié' };

export function AuthPage({ page }) {
  const { refresh } = useApp();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState('');
  useEffect(() => { document.title = `${paths[page]} · Mon Miam Miam`; }, [page]);
  const loginPage = page === 'connexion.html', signup = page === 'inscription.html';

  async function submit(e) {
    e.preventDefault(); setError(''); setInfo('');
    if (page === 'mot-de-passe-oublie.html') {
      setInfo('La récupération par e-mail n’est pas encore connectée. Contactez le responsable de votre compte. Aucun message n’a été envoyé.');
      return;
    }
    setBusy(true);
    try {
      const form = getForm(e);
      const user = loginPage ? await Miam.login(form.email, form.password) : await Miam.register(form);
      refresh(); window.location.href = hrefFor(user);
    } catch (cause) {
      setError(cause.message);
    } finally { setBusy(false); }
  }

  function quickAccess(role) {
    try { const user = Miam.demoLogin(role); refresh(); window.location.href = hrefFor(user); }
    catch (cause) { setError('Impossible d’ouvrir cet espace : ' + cause.message); }
  }

  return <main className="mm-auth-screen"><aside className="mm-auth-visual"><a href="/" className="mm-brand"><img src="/assets/zeduc-space-logo.png" alt="" /><span>MON MIAM MIAM<small>ZEDUC-SP@CE · KINSHASA</small></span></a><div><span className="mm-eyebrow">LE GOÛT DE SE RETROUVER</span><h1>VOTRE TABLE<br />VOUS ATTEND.</h1><p>Vos plats, vos commandes et votre fidélité, tout simplement. Bienvenue dans la communauté.</p><small>ULC ICAM • KINSHASA • RDC</small></div></aside>
    <section className="mm-auth-panel"><a href="/" className="mm-back">← Retour au restaurant</a><div className="mm-auth-content"><span className="mm-eyebrow">BIENVENUE CHEZ ZEDUC-SP@CE</span><h2>{paths[page]}</h2><p className="mm-lead">{loginPage ? 'Retrouvez votre espace et vos envies du moment.' : signup ? 'Rejoignez-nous pour commander et profiter de votre fidélité.' : 'Retrouvons votre accès à Mon Miam Miam.'}</p>
      <form className="mm-form" noValidate onSubmit={submit}>
        {signup && <><Field label="Nom et prénom" name="name" required autoComplete="name" /><Field label="Téléphone" name="phone" required autoComplete="tel" placeholder="+243…" type="tel" /><Field label="Adresse à Kinshasa" name="address" required autoComplete="street-address" /></>}
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" required placeholder="vous@exemple.com" />
        {(loginPage || signup) && <label className="mm-field"><span>Mot de passe</span><span className="mm-password"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={loginPage ? 'current-password' : 'new-password'} minLength="8" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? 'Masquer' : 'Afficher'}</button></span></label>}
        {signup && <><Field label="Confirmer le mot de passe" name="confirm" type="password" autoComplete="new-password" required /><Field label="Code de parrainage (facultatif)" name="referral" value={new URLSearchParams(location.search).get('parrain') || ''} /></>}
        {loginPage && <a href="/mot-de-passe-oublie.html" className="mm-form-link">Mot de passe oublié ?</a>}
        <FormError>{error}</FormError>{info && <p className="mm-inline-message" role="status">{info}</p>}
        <Button type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Un instant…' : loginPage ? 'Se connecter →' : signup ? 'Créer mon compte →' : 'Continuer →'}</Button>
      </form>
      <p className="mm-auth-switch">{loginPage ? <>Pas encore de compte ? <a href="/inscription.html">S’inscrire</a></> : <>Déjà membre ? <a href="/connexion.html">Se connecter</a></>}</p>
      {loginPage && <div className="mm-quick-access"><span className="mm-eyebrow">ACCÈS AUX ESPACES PRÉCONFIGURÉS</span><p>Pour parcourir les fonctionnalités avec les profils disponibles sur cet appareil.</p><div className="mm-quick-grid">{Object.entries(Miam.roles).map(([role, name]) => <button type="button" key={role} onClick={() => quickAccess(role)}>{name}<span aria-hidden="true">↗</span></button>)}</div><small>Ces accès locaux ne constituent pas une authentification sécurisée.</small></div>}
      <p className="mm-auth-foot">Les données saisies sont conservées dans ce navigateur. Aucun paiement n’est exécuté.</p>
    </div></section>
  </main>;
}
