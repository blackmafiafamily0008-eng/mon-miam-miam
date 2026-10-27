# Mon Miam Miam — React + Vite

Interface web du restaurant **ZEDUC-SP@CE**, à Kinshasa, pour la communauté ULC ICAM.

## Démarrer

Node.js 20.19+ ou 22.12+ recommandé pour Vite 7.

```bash
npm install
npm run dev
```

Ouvrir <http://127.0.0.1:5173>.

```bash
npm run check   # Vérification des routes et sources
npm test        # Règles métier, règles de paiement et composants
npm run build   # Compilation des huit routes dans build/
npm run preview # Vérification des fichiers compilés
```

## Architecture

```text
src/
  main.jsx              Montage de React
  App.jsx               Contexte, notifications, dialogues et composants communs
  app.css               Styles communs, vitrine, authentification et espaces
  pages/
    PublicPage.jsx      Accueil, recherche, plats, événements, réservation locale
    AuthPage.jsx        Connexion, inscription, récupération informative
    Workspace.jsx       Étudiant, employé, gérant, administrateur
  domain/
    miam.js             Adaptation React du moteur métier, images des plats
dist/
  miam-core.js          Moteur de données et règles métier partagé
  ...                   Sources historiques pour vérification et comparaison
public/assets/         Photos, logo et polices copiés automatiquement
build/                 Production Vite (générée)
```

Les huit URL continuent de fonctionner : `/`, `/connexion.html`,
`/inscription.html`, `/mot-de-passe-oublie.html`, `/etudiant.html`,
`/employe.html`, `/gerant.html` et `/admin.html`.

**Toutes les pages visibles sont écrites en JSX et rendues par React.**
Les anciennes pages HTML ne sont plus injectées dans React et les anciens
scripts `app-fr.js`, `auth.js`, `espace.js` et `ui.js` ne sont pas chargés.
Le moteur métier `dist/miam-core.js` reste réutilisé pour préserver les clés
du stockage, les transitions de commande et les règles de fidélité ; sa
conversion en services back-end fera partie d'une étape distincte.

## Parcours

| Page ou espace | Fonctions |
| --- | --- |
| Vitrine | Diaporama automatique, restaurant, carte, recherche et catégories, détails des plats, offres, événements, souhait de réservation local |
| Accès | Connexion, inscription étudiante, parrainage, récupération informative, profils locaux préconfigurés |
| Étudiant | Tableau de bord, carte, panier, livraison/sur place, règlement à venir ou confirmation locale Mobile Money, historique, suivi, avis, fidélité, invitations, événements, quiz, classement, réclamations, profil |
| Employé | Commandes, étapes de préparation, disponibilités, plat du jour, proposition de réponse aux réclamations, statistiques |
| Gérant | Commandes, carte du jour, comptes employés, validation des réponses, statistiques |
| Administrateur | Gestion de la carte (avec import d'images), comptes, offres, événements, réclamations, statistiques, paramètres |

Les fonctionnalités et les autorisations sont décrites dans
[UX-CONTRACT.md](UX-CONTRACT.md) et [MIGRATION-REACT.md](MIGRATION-REACT.md).

## Limites avant production

Cette application utilise actuellement `localStorage` et `sessionStorage`.
**Aucune API serveur, identité Google, transaction Mobile Money, réservation
envoyée ou e-mail n'est connecté.** Les accès rapides aux espaces existent
pour permettre de parcourir les interfaces locales : ce n'est pas une
authentification sécurisée. Ne saisissez pas de données personnelles réelles.

Avant de lancer le service avec de vrais utilisateurs, connecter une API,
sécuriser les identités et permissions sur le serveur, intégrer le traitement
fiable des commandes et paiements, puis réaliser les tests E2E et de sécurité.

## Historique du projet

Le code précédant la migration reste consultable dans `dist/` ; il peut être
lancé séparément par `npm run dev:legacy`. Le nouveau front-end React utilise
les mêmes données métier, mais ne charge plus ses scripts d'interface.
