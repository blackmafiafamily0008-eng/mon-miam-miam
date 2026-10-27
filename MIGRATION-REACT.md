# Migration React + Vite — Mon Miam Miam

## Objectif et état

Cette étape installe React 19 et Vite 7 sans réécrire prématurément les
parcours de commande et de fidélité. Elle n'est **pas** une conversion complète
des écrans en composants React natifs.

1. Huit entrées HTML utilisent `src/main.jsx` et `createRoot`.
2. `src/legacy-pages.js` lit les pages historiques et fournit leur DOM à
   la couche React, puis les scripts métier existants sont chargés dans l'ordre.
3. `scripts/prepare-react.mjs` copie les CSS, scripts et assets historiques
   dans `public/` (généré, ignoré par Git) pour préserver les URLs.
4. `src/visible-copy.js` retire le vocabulaire de prototype visible ;
   les messages de non-paiement et de non-réservation restent honnêtes.
5. `npm run build` publie vers `build/`, sans écraser les anciennes sources
   conservées dans `dist/`.

## Routes et fonctionnalités à conserver

| Route | Parcours | Moteur actuel | Cible |
| --- | --- | --- | --- |
| `/` | Vitrine, menu, panier, recherche, galerie | `app-fr.js` | React + composants publics |
| `/connexion.html` | Connexion locale, accès rapide | `auth.js` | React Auth |
| `/inscription.html` | Inscription, parrainage | `auth.js` | React Auth |
| `/mot-de-passe-oublie.html` | Récupération informative | `auth.js` | React Auth |
| `/etudiant.html` | Carte, panier, commandes, fidélité, avis | `espace.js` | React Student |
| `/employe.html` | Préparation, disponibilité, suivi | `espace.js` | React Staff |
| `/gerant.html` | Équipe, réclamations, statistiques | `espace.js` | React Manager |
| `/admin.html` | Carte, comptes, promotions, paramètres | `espace.js` | React Admin |

## Ordre de migration recommandé

1. Extraire `miam-core.js` en services testables, sans changer les clés
   `localStorage` ni les règles de points, remises, annulation et statut.
2. Construire les composants communs (boutons, champs, dialogue, toast,
   tableaux paginés, filtres, contrôle des permissions).
3. Remplacer les pages d'authentification puis la vitrine, avec tests clavier,
   mobile et réduction des animations.
4. Migrer verticalement le parcours étudiant (carte → panier → commande →
   suivi → fidélité), puis employé, gérant et admin.
5. Supprimer `dangerouslySetInnerHTML` et les scripts historiques seulement
   après parité fonctionnelle confirmée.

## Limites de sécurité

La migration d'outillage ne crée ni backend, ni authentification sécurisée,
ni paiement réel. Les rôles et données restent locaux. Une API et une
autorisation serveur seront obligatoires avant mise en production commerciale.
L'accès rapide n'est pas une connexion Google ; aucun débit Mobile Money,
e-mail de récupération ou réservation n'est envoyé.

## Validation

```bash
npm install
npm run check
npm test
npm run build
npm run preview
```

Comparer le résultat avec `npm run dev:legacy` : recherche et détail des plats,
panier, inscription, navigation des quatre rôles, transitions des commandes,
points, parrainage, promotions, images des plats, paiement refusé et
confirmation locale. Ne pas conclure à la parité depuis un build seul.
