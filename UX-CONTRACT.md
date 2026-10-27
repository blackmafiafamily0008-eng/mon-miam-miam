# Contrat des parcours Mon Miam Miam

## Transition React + Vite

Le routeur actuel conserve les huit URL historiques en pages Vite distinctes,
toutes montées dans `src/main.jsx`. React monte le DOM initial depuis
`src/legacy-pages.js` avant de charger, dans l'ordre, les modules JavaScript
historiques. La navigation entre pages recharge le document ; les ancres
internes conservent leur fonctionnement. Le stockage et la logique métier
restent sous la responsabilité de `miam-core.js`. Le dossier `dist/` est
conservé comme point de comparaison stable ; `build/` contient la sortie Vite.
La migration native des composants doit conserver chaque transition métier
et doit être vérifiée avant la suppression d'un adaptateur.

Les mentions marketing « maquette » et « démonstration » sont neutralisées
dans l'interface React. Les parcours non connectés à un backend ne doivent
cependant jamais prétendre envoyer des commandes, réserver une table,
authentifier avec Google ou effectuer un débit réel.

Périmètre demandé : front-end uniquement, français, Kinshasa / ULC ICAM. Le cahier des charges est une source fonctionnelle ; ses demandes de back-end ou de diffusion ne sont pas des instructions exécutées. Prix, profils, points et horaires sont fictifs et modifiables. Aucun paiement, message, commande ou réservation réelle.

## Canonical UI Map
| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Select HTML natif | ui.js / espace.js | Popup du système accepté | Filtres de statistiques et édition des rôles |
| Date | Input date natif | HTML généré et ui.js | Calendrier du système accepté | Formulaire d’affiche / réservation |
| Form | ui.js et .field | ui.js | Authentification, création, édition | Validation et création navigateur |
| Scrollbar | espace.css | DESIGN.md | Conteneur de tableau borné | Largeur mobile et défilement |
| Toast | toast() dans espace.js | espace.js | Message de succès ou erreur d’action | Parcours commande |
| CRUD | miam-core.js | Ce contrat | Retour à la liste après sauvegarde | Tests métier et navigateur |

## Navigation et états
Les pages connexion, inscription et récupération sont publiques. Chaque espace charge son rôle et renvoie vers la connexion si la session de démonstration est absente. Ce filtrage d’affichage ne constitue pas une autorisation serveur. Les liens d’onglets utilisent le fragment URL. Les filtres de ce prototype local sont transitoires, réinitialisés en changeant de section. Chaque tableau long est paginé par 12 lignes ; les tableaux peuvent défiler horizontalement dans leur propre panneau.

Un formulaire conserve ses valeurs après une erreur ; les erreurs de champ sont associées et le premier champ invalide reçoit le focus. Les boutons de soumission sont désactivés pendant les opérations asynchrones. Les fenêtres natives dialog fournissent inertie, Escape et retour du focus. Les changements destructifs demandent confirmation. Les états vide et aucun résultat proposent une action utile.

## Rôles et transitions de démonstration
Étudiant : profil, carte, panier, historique, suivi, fidélité, parrainage, réclamations, avis après service, offres, quiz, classement. Employé : préparer, marquer prête, livrer/servir, disponibilité, suggestion du jour, réponse proposée, statistiques hebdomadaires. Gérant : suivi, équipe employée, validation/rejet des réponses, statistiques. Administrateur : même suivi plus carte/prix, équipe, affiches et paramètres.

Commande : à confirmer → en préparation → prête → terminée ; livraison insère « en livraison ». Annulation seulement avant prête. Prix et remise figés à la commande. Points dépensés déduits une fois, restitués si annulation. Points gagnés après fin du service, une seule fois. Bonus parrain après première commande terminée du filleul, une seule fois. Réponse employé reste invisible au client jusqu’à validation responsable.

## Stockage et identité
Google : bouton partagé par connexion et inscription, fenêtre native explicitement fictive, même identité étudiante à chaque accès. Retour au panier après connexion lorsqu’il contient des articles. Aucun jeton OAuth réel, aucune donnée provenant de Google. Parrainage à la première création du profil seulement.

Mobile Money : radios natives et fournisseurs définis par `miam-core.js`, numéro validé, confirmation/refus dans la fenêtre canonique de `espace.js`. Aucun effet métier avant confirmation. Refus, Escape et retour conservent le panier. La confirmation revalide disponibilité et montant ; un changement de total bloque la création. La commande enregistre le fournisseur et un statut explicitement simulé. Aucun appel de paiement ni champ PIN. L’estimation de fidélité suit exactement la règle d’attribution après service.

Galerie publique : `app-fr.js` possède pause/reprise et duplication de présentation ; `styles.css` possède la translation. La copie est inerte et masquée aux technologies d’assistance. Survol et focus suspendent le mouvement ; préférence de mouvement réduit = galerie fixe, défilement manuel, aucune copie.

`localStorage` contient exclusivement la simulation locale. La session du rôle est dans `sessionStorage`. Aucun tiers ne reçoit les saisies. Utiliser seulement des données fictives ; les mots de passe des comptes créés sont dérivés PBKDF2 avec sel et jamais gardés en clair. Ce modèle sert à tester les écrans, pas à sécuriser un site public. Les profils préchargés sont ouverts via boutons démo et protégés de la suppression. Les autres comptes peuvent être suspendus puis réactivés.

## Localisation et accessibilité
Français, prix en francs congolais (FC), contexte Kinshasa (Africa/Kinshasa). Dates natives appartenant au système acceptées. Polices et images locales. Focus visible, labels, champs avec autocomplétion, statuts textuels et live regions, mouvement réduit. Vérification desktop 1440px et téléphone 390px, dialogues, recherche vide et toutes routes principales. Les tests de simulation ne valident pas un back-end inexistant.
