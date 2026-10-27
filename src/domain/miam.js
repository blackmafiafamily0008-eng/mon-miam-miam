// Le moteur métier existant conserve les règles de commande et les données.
// Les anciens scripts de rendu ne sont plus chargés par l'interface React.
import '../../dist/miam-core.js';

export const Miam = window.Miam;

// Nettoyage ciblé des libellés hérités dans les données déjà enregistrées,
// sans modifier les contenus créés par l'utilisateur ni les commandes.
try {
  const data = Miam.read();
  let changed = false;
  const event = data.promotions.find(p => p.id === 'promo-2');
  if (event?.text === 'Retrouvons-nous autour d’un bon repas après les cours. Événement de démonstration.') {
    event.text = 'Retrouvons-nous autour d’un bon repas après les cours.';
    changed = true;
  }
  const profile = data.users.find(u => u.id === 'demo-google-etudiant');
  if (profile?.name === 'Camille Démo') { profile.name = 'Camille Kanku'; changed = true; }
  if (changed) Miam.save(data);
} catch { /* Le stockage navigateur peut être désactivé. */ }

export function imageUrl(image) {
  if (!image) return '/assets/burger-5.png';
  if (/^data:image\/(?:png|jpeg|webp);base64,/.test(image)) return image;
  return `/assets/${encodeURIComponent(image)}`;
}

export function saveImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      reject(new Error('Choisissez une image PNG, JPEG ou WebP.'));
      return;
    }
    if (file.size > 500 * 1024) {
      reject(new Error('La photo ne doit pas dépasser 500 Ko (stockage local).'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Impossible de lire cette photo.'));
    reader.readAsDataURL(file);
  });
}
