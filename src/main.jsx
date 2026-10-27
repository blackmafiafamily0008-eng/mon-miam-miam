import React, { createElement, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getCurrentPage, readLegacyPage } from './legacy-pages.js';
import './react-shell.css';

const page = getCurrentPage();

// Les pages historiques sont devenues un arbre d'éléments React. Leurs
// attributs/classes restent inchangés pour conserver le CSS et l'apparence.
// Les écouteurs métier seront remplacés un parcours à la fois, après contrôle
// de parité, sans réécriture simultanée du design.
const attributes = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex',
  readonly: 'readOnly', autofocus: 'autoFocus', colspan: 'colSpan',
  rowspan: 'rowSpan', maxlength: 'maxLength', minlength: 'minLength',
  srcset: 'srcSet', crossorigin: 'crossOrigin',
  autocomplete: 'autoComplete', novalidate: 'noValidate',
  inputmode: 'inputMode', spellcheck: 'spellCheck',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule',
  'clip-rule': 'clipRule', 'viewbox': 'viewBox',
};
const booleanAttributes = new Set([
  'hidden', 'disabled', 'required', 'checked', 'selected', 'multiple',
  'autofocus', 'readonly', 'open', 'controls', 'loop', 'muted', 'inert',
]);

function reactNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const type = node.localName;
  if (type === 'script' || type === 'noscript') return null;

  const props = { key };
  for (const { name, value } of node.attributes) {
    const normalized = name.toLowerCase();
    if (normalized === 'style') {
      const style = {};
      for (const property of node.style) {
        const camel = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        style[camel] = node.style.getPropertyValue(property).trim();
      }
      props.style = style;
    } else if (booleanAttributes.has(normalized)) {
      props[attributes[normalized] || normalized] = true;
    } else {
      props[attributes[normalized] || name] = value;
    }
  }
  const children = Array.from(node.childNodes, (child, index) => reactNode(child, index));
  if (type === 'textarea') return createElement(type, { ...props, defaultValue: node.textContent });
  if (type === 'input' && props.value !== undefined) {
    props.defaultValue = props.value;
    delete props.value;
  }
  return createElement(type, props, ...children);
}

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
  const content = useMemo(() => Array.from(view.body.childNodes, (node, index) => reactNode(node, index)), [view]);
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
      {content}
    </>
  );
}

createRoot(document.getElementById('root')).render(<LegacyScreen />);
