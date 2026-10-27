# Migration React + Vite — Mon Miam Miam

## Objectif et état

Cette étape installe React 19 et Vite 7 sans réécrire prématurément les
parcours de commande et de fidélité. Elle n'est **pas** une conversion complète
des écrans en composants React natifs.

1. Huit entrées HTML utilisent `src/main.jsx` et `createRoot`.
2. `src/legacy-pages.js` lit les pages historiques. `src/main.jsx` recrée
   leurs éléments avec React, sans injection `dangerouslySetInnerHTML` ; les
   classes, sections et styles d'origine sont conservés.
3. Les scripts métier historiques restent chargés dans l'ordre pour préserver
   les parcours pendant leur migration progressive vers des événements React.
4. `scripts/prepare-react.mjs` copie les CSS, scripts et assets historiques
   dans `public/` (généré, ignoré par Git) pour préserver les URLs.
5. `src/visible-copy.js` retire le vocabulaire de prototype visible ;
   les messages de non-paiement et de non-réservation restent honnêtes.
6. `npm run build` publie vers `build/`, sans écraser les anciennes sources
   conservées dans `dist/`.

## Routes et fonctionnalités à conserver

| Route | Parcours | Moteur actuel | Cible |
| --- | --- | --- | --- |
| `/` | Vitrine, menu, panier, recherche, galerie | `app-fr.js` | React + composants publics |
| `/connexion.html` | Connexion locale | `auth.js` | React Auth |
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
5. Convertir les derniers comportements impératifs en états et gestionnaires
   React seulement après parité fonctionnelle confirmée. Le HTML injecté a
   déjà été remplacé par des éléments React.

Les routes avec ou sans `.html` sont acceptées sur les hébergeurs qui
réécrivent automatiquement les URLs.

## Limites de sécurité

La migration d'outillage ne crée ni backend, ni authentification sécurisée,
ni paiement réel. Les rôles et données restent locaux. Une API et une
autorisation serveur seront obligatoires avant mise en production commerciale.
Le bouton Google n'authentifie aucun utilisateur tant qu'OAuth n'est pas configuré ; aucun débit Mobile Money,
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
