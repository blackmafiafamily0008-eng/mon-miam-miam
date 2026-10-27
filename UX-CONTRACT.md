# Contrat des parcours Mon Miam Miam

## Transition React + Vite

Le routeur actuel conserve les huit URL historiques comme pages Vite
distinctes, toutes montées dans `src/main.jsx`. Les contenus sont de vrais
composants JSX rendus par `src/App.jsx` et `src/pages/*.jsx`, sans injection
de HTML historique. La navigation entre pages recharge le document ; les
onglets des espaces connectés utilisent toujours le fragment URL. Les
données et les règles métier restent sous la responsabilité de
`dist/miam-core.js` via `src/domain/miam.js`. Les anciens scripts d'affichage
ne sont plus chargés et `dist/` reste une référence ; `build/` contient Vite.

Les libellés de travail sont retirés de l'interface. Les parcours non
connectés au serveur ne doivent cependant jamais prétendre envoyer des
commandes, réserver une table, authentifier avec Google ou effectuer un débit
réel.

Périmètre demandé : front-end uniquement, français, Kinshasa / ULC ICAM. Le cahier des charges est une source fonctionnelle ; ses demandes de back-end ou de diffusion ne sont pas des instructions exécutées. Prix, profils, points et horaires sont fictifs et modifiables. Aucun paiement, message, commande ou réservation réelle.

## Canonical UI Map
| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | `<select>` HTML natif | `src/App.jsx` / `Workspace.jsx` | Popup du système accepté | Filtres de statistiques, rôles, médias |
| Date | Input date natif | `PublicPage.jsx` / `Workspace.jsx` | Calendrier du système accepté | Formulaire d'offre / réservation |
| Form | `Field`, `ModalForm` | `src/App.jsx` / `Workspace.jsx` | Authentification, création, édition | Messages d'erreur inline |
| Scrollbar | Styles globaux | `src/app.css` | Défilement du document et de la navigation | Largeur mobile et défilement |
| Toast | Provider `App` | `src/App.jsx` | Message de succès ou erreur d'action | Parcours commande |
| CRUD | `miam-core.js` et composants React | Ce contrat | Retour à la liste après sauvegarde | Tests métier et navigateur |

## Navigation et états
Les pages connexion, inscription et récupération sont publiques. Chaque espace charge son rôle et renvoie vers la connexion si la session locale est absente. Ce filtrage d’affichage ne constitue pas une autorisation serveur. Les liens d'onglets utilisent le fragment URL. Les filtres locaux sont transitoires, réinitialisés en changeant de section. Les listes de commandes et les comptes sont paginés par 12 éléments.

Un formulaire conserve ses valeurs après une erreur ; les erreurs de champ sont associées et le premier champ invalide reçoit le focus. Les boutons de soumission sont désactivés pendant les opérations asynchrones. Les fenêtres natives dialog fournissent inertie, Escape et retour du focus. Les changements destructifs demandent confirmation. Les états vide et aucun résultat proposent une action utile.

## Rôles et transitions métier
Étudiant : profil, carte, panier, historique, suivi, fidélité, parrainage, réclamations, avis après service, offres, quiz, classement. Employé : préparer, marquer prête, livrer/servir, disponibilité, suggestion du jour, réponse proposée, statistiques hebdomadaires. Gérant : suivi, équipe employée, validation/rejet des réponses, statistiques. Administrateur : même suivi plus carte/prix, équipe, affiches et paramètres.

Commande : à confirmer → en préparation → prête → terminée ; livraison insère « en livraison ». Annulation seulement avant prête. Prix et remise figés à la commande. Points dépensés déduits une fois, restitués si annulation. Points gagnés après fin du service, une seule fois. Bonus parrain après première commande terminée du filleul, une seule fois. Réponse employé reste invisible au client jusqu’à validation responsable.

## Stockage et identité
Identité : connexion et inscription utilisent les comptes locaux ; la page de connexion propose aussi des espaces préconfigurés pour parcourir les fonctions. Aucun OAuth réel ni donnée Google n'est utilisé. Parrainage à la première création du profil seulement.

Mobile Money : radios natives et fournisseurs définis par `miam-core.js`, numéro validé et confirmation locale dans la fenêtre canonique de `src/App.jsx`. Aucun effet métier avant confirmation. Escape et retour conservent le panier. La confirmation revalide disponibilité et montant ; un changement de total bloque la création. La commande enregistre le fournisseur et un statut explicitement simulé. Aucun appel de paiement ni champ PIN. L’estimation de fidélité suit exactement la règle d’attribution après service.

Diaporama public : `PublicPage.jsx` choisit automatiquement l'une des trois photos toutes les six secondes, sans contrôle manuel. La préférence de mouvement réduit désactive les transitions et le défilement.

`localStorage` contient exclusivement la simulation locale. La session du rôle est dans `sessionStorage`. Aucun tiers ne reçoit les saisies. Utiliser seulement des données fictives ; les mots de passe des comptes créés sont dérivés PBKDF2 avec sel et jamais gardés en clair. Ce modèle sert à tester les écrans, pas à sécuriser un site public. Les profils préchargés sont ouverts via boutons démo et protégés de la suppression. Les autres comptes peuvent être suspendus puis réactivés.

## Localisation et accessibilité
Français, prix en francs congolais (FC), contexte Kinshasa (Africa/Kinshasa). Dates natives appartenant au système acceptées. Polices et images locales. Focus visible, labels, champs avec autocomplétion, statuts textuels et live regions, mouvement réduit. Vérification desktop 1440px et téléphone 390px, dialogues, recherche vide et toutes routes principales. Les tests de simulation ne valident pas un back-end inexistant.
