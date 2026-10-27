// Certains hébergeurs redirigent /connexion.html vers /connexion.
// Les deux adresses doivent toujours ouvrir le même écran React.
export function pageNameFromPath(pathname) {
  const name = pathname.split('/').filter(Boolean).pop() || 'index';
  return name.endsWith('.html') ? name : `${name}.html`;
}
