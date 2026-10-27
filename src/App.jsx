import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Miam } from './domain/miam.js';
import { PublicPage } from './pages/PublicPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Workspace } from './pages/Workspace.jsx';

const AppContext = createContext(null);

export const money = Miam.money;
export const date = Miam.date;
export const roles = Miam.roles;
export const statuses = Miam.statuses;
export const getForm = e => Object.fromEntries(new FormData(e.currentTarget));
export const hrefFor = user => `${user.role}.html${user.role === 'etudiant' && Miam.cartLines().length ? '#panier' : ''}`;

export function useApp() { return useContext(AppContext); }

export function Button({ children, tone = 'primary', onClick, ...props }) {
  return <button className={`mm-button mm-${tone}`} type="button" onClick={onClick} {...props}>{children}</button>;
}

export function Field({ label, name, value, children, ...props }) {
  return <label className="mm-field"><span>{label}</span>{children || <input name={name} defaultValue={value} {...props} />}</label>;
}

export function Empty({ title, text, action }) {
  return <div className="mm-empty"><span aria-hidden="true">✦</span><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function Badge({ children, tone = '' }) {
  return <span className={`mm-badge ${tone && `mm-badge-${tone}`}`}>{children}</span>;
}

export function Panel({ title, children, action, className = '' }) {
  return <section className={`mm-panel ${className}`}>
    {(title || action) && <div className="mm-panel-head">{title && <h3>{title}</h3>}{action}</div>}
    {children}
  </section>;
}

function Dialog({ content, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const restore = document.activeElement;
    if (!dialog.open) dialog.showModal();
    const close = () => { onClose(); restore?.focus?.({ preventScroll: true }); };
    dialog.addEventListener('close', close);
    return () => { dialog.removeEventListener('close', close); if (dialog.open) dialog.close(); };
  }, [onClose]);
  return <dialog className="mm-dialog" ref={ref} aria-labelledby="mm-dialog-title" onClick={e => { if (e.target === ref.current) ref.current.close(); }}>
    <div className="mm-dialog-inner"><button className="mm-icon-btn mm-dialog-close" type="button" onClick={() => ref.current?.close()} aria-label="Fermer">×</button>{content}</div>
  </dialog>;
}

export function DialogTitle({ children }) { return <><span className="mm-eyebrow">MON MIAM MIAM</span><h2 id="mm-dialog-title">{children}</h2></>; }

export function FormError({ children }) { return <p className="mm-error" role="alert">{children || ''}</p>; }

export function App() {
  const [data, setData] = useState(() => Miam.read());
  const [user, setUser] = useState(() => Miam.current());
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const refresh = useCallback(() => { setData(Miam.read()); setUser(Miam.current()); }, []);
  useEffect(() => {
    window.addEventListener('miam:change', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('miam:change', refresh); window.removeEventListener('storage', refresh); clearTimeout(noticeTimer.current); };
  }, [refresh]);
  const notify = useCallback(message => { setNotice(message); clearTimeout(noticeTimer.current); noticeTimer.current = setTimeout(() => setNotice(''), 4000); }, []);
  const execute = useCallback((fn, message) => {
    try { const result = fn(); if (message) notify(message); refresh(); return result; }
    catch (error) { notify(error.message); return null; }
  }, [notify, refresh]);

  const path = window.location.pathname.split('/').pop() || 'index.html';
  const value = { data, user, refresh, notify, execute, openDialog: setDialog, closeDialog };
  return <AppContext.Provider value={value}>
    {path === 'index.html' ? <PublicPage /> :
      ['connexion.html', 'inscription.html', 'mot-de-passe-oublie.html'].includes(path) ? <AuthPage page={path} /> :
        ['etudiant.html', 'employe.html', 'gerant.html', 'admin.html'].includes(path) ? <Workspace role={path.slice(0, -5)} /> : <PublicPage />}
    <div className={`mm-toast ${notice ? 'mm-toast-show' : ''}`} role="status" aria-live="polite">{notice}</div>
    {dialog && <Dialog content={dialog} onClose={closeDialog} />}
  </AppContext.Provider>;
}
