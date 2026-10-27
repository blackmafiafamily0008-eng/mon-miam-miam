---
version: alpha
colors:
  primary: "#d9b66f"
  ink: "#182321"
  paper: "#f4f3ee"
  forest: "#111b19"
  gold: "#d9b66f"
  muted: "#69736e"
  line: "#dcded6"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
  body:
    fontFamily: "Work Sans, Arial, sans-serif"
rounded:
  control: "2px"
  modal: "3px"
spacing:
  field: "18px"
  panel: "25px"
components:
  button:
    height: "46px"
  sidebar:
    width: "258px"
---

## Overview
Mon Miam Miam, restaurant ZEDUC-SP@CE à Kinshasa, communauté étudiante ULC ICAM. La référence Dishify et le logo noir/or fournis par l’utilisateur définissent l’identité. Accueil expressif sombre, espaces applicatifs lisibles sur fond clair. Le contraste entre la photographie culinaire, les capitales condensées et les petites indications précises forme la signature.

## Colors
Les valeurs ci-dessus alimentent les variables `--mm-forest`, `--mm-ink`, `--mm-paper`, `--mm-gold`, `--mm-muted` et `--mm-line` dans `src/app.css`. L'accueil conserve le noir profond et les accents or de la référence, les espaces connectés adoptent les panneaux blancs sur fond clair. Le vert indique la progression ou la réussite ; le rouge #a43b31 accompagne toujours un libellé explicite.

## Typography
Barlow Condensed pour les titres et grands chiffres ; Work Sans pour formulaires, menus, tableaux et paragraphes. Polices locales avec accents français. Corinthia reste réservée aux petits intertitres de l’accueil original.

## Layout
Accueil : photographie plein cadre et diaporama automatique, sans commande depuis l'espace public. Application : navigation latérale 258px, contenu fluide limité à 1500px. Cartes de plats en trois colonnes puis une sur petit téléphone. Listes de commandes et membres paginées par 12 éléments. Au-dessous de 900px, navigation repliée ; au-dessous de 640px, formulaires sur une colonne. Les formulaires restent en défilement naturel.

## Elevation & Depth
Pas d’ombres sur les panneaux usuels. Ombre réservée aux messages flottants, au panier fixe et aux fenêtres modales. Les photos et changements de fond créent la hiérarchie.

## Shapes
Coins à peine arrondis, lignes sobres, cercles réservés aux avatars et étapes. Aucune carte décorative sans contenu métier.

## Components
`src/main.jsx` constitue l'entrée React commune des huit routes. `src/App.jsx` est le propriétaire canonique des champs, boutons, panneaux, notifications et fenêtres modales ; `src/pages/PublicPage.jsx`, `AuthPage.jsx` et `Workspace.jsx` portent les parcours et les états des écrans. `src/app.css` est l'unique source runtime des tokens visuels. `src/domain/miam.js` adapte le moteur métier conservé dans `dist/miam-core.js`. Le script `scripts/prepare-react.mjs` ne copie que les images et polices. Aucun HTML historique n'est injecté dans React.

## Do's and Don'ts
Tant que Google OAuth n'est pas relié à un serveur, le site n'affiche pas de faux bouton de connexion Google : seuls les accès locaux explicités sur la page d'authentification sont présents. Les moyens de paiement réutilisent les contrôles radio natifs dans des choix à bordure fine ; leurs noms restent lisibles sans dépendre des couleurs. La fidélité est affichée dans le récapitulatif, au plus près du montant. L'accueil présente des photos dans un diaporama automatique, sans commandes play/précédent/suivant, désactivé pour mouvement réduit.

Conserver l’ambiance restaurant et les compositions approuvées. Écrire en français naturel, afficher les prix indicatifs en FC. Utiliser le logo fourni, sans inventer d’adresse, de contact réel ou de partenariat. Éviter les dégradés décoratifs, métriques promotionnelles inventées et interfaces génériques. Le contexte reste Kinshasa / ULC ICAM. Les limitations des flux locaux de paiement et réservation restent visibles afin de ne pas faire croire à des transactions réelles.
