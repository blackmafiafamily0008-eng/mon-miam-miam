import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getCurrentPage, readLegacyPage } from './legacy-pages.js';
import './react-shell.css';

const page = getCurrentPage();

function loadScript(path, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Navigation interrompue', 'AbortError'));
    const script = document.createElement('script');
    script.src = `/${path}`;
    script.async = false;
    script.dataset.legacyScript = path;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Impossible de charger ${path}`));
    document.body.append(script);
  });
}

function LegacyScreen() {
  const view = useMemo(() => readLegacyPage(page), []);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    document.title = view.title;
    document.body.className = view.bodyClass;
    if (view.role) document.body.dataset.role = view.role;
    else delete document.body.dataset.role;
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `/${page.stylesheet}`;
    style.dataset.pageStylesheet = '';
    document.head.append(style);
    return () => style.remove();
  }, [view]);

  useEffect(() => {
    const controller = new AbortController();
    async function start() {
      try {
        for (const file of page.scripts) {
          if (controller.signal.aborted) return;
          await loadScript(file, controller.signal);
        }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause.message);
      }
    }
    start();
    return () => controller.abort();
  }, []);

  return (
    <>
      {error && (
        <div className="react-load-error" role="alert">
          <strong>Impossible de charger cet espace.</strong>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      )}
      <div id="legacy-screen" dangerouslySetInnerHTML={{ __html: view.markup }} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<LegacyScreen />);
