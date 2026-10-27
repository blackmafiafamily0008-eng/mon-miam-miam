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
Les valeurs ci-dessus sont reprises dans `dist/espace.css` : ink, paper, forest, gold, muted, line correspondent aux variables de même nom. L’accueil conserve les tokens de sa référence dans `dist/styles.css` : fond #0b1111, panneau #141819, or #bc8d53. Le vert indique la progression ou la réussite ; le rouge #a43b31 accompagne toujours un libellé explicite.

## Typography
Barlow Condensed pour les titres et grands chiffres ; Work Sans pour formulaires, menus, tableaux et paragraphes. Polices locales avec accents français. Corinthia reste réservée aux petits intertitres de l’accueil original.

## Layout
Accueil : photographie plein cadre et compositions de la référence. Application : navigation latérale 258px, contenu fluide limité à 1500px. Cartes de plats en trois colonnes puis deux sur téléphone. Tableaux défilants à l’intérieur de leur conteneur, pagination par 12 lignes. Au-dessous de 900px, navigation repliée ; au-dessous de 640px, formulaires sur une colonne. Les formulaires restent en défilement naturel.

## Elevation & Depth
Pas d’ombres sur les panneaux usuels. Ombre réservée aux messages flottants, au panier fixe et aux fenêtres modales. Les photos et changements de fond créent la hiérarchie.

## Shapes
Coins à peine arrondis, lignes sobres, cercles réservés aux avatars et étapes. Aucune carte décorative sans contenu métier.

## Components
`src/main.jsx` constitue l'entrée React commune des huit routes. Pendant la migration, `src/legacy-pages.js` adapte le DOM historique ; `dist/espace.css` porte les composants applicatifs partagés, `dist/ui.js` gère validation, recherche et pagination, `dist/espace.js` porte navigation, fenêtres et notifications des quatre rôles, et `dist/miam-core.js` porte les données locales et transitions. Le script `scripts/prepare-react.mjs` copie les ressources et scripts compatibles vers le dossier public généré. Ce modèle de compatibilité n'est pas l'architecture React cible : les écrans seront extraits progressivement en composants natifs.

## Do's and Don'ts
Le bouton Google conserve son logo et indique que la connexion est indisponible tant que le fournisseur OAuth n'est pas configuré. Il n'ouvre jamais une session locale et n'affiche aucun profil prérempli. Les moyens de paiement réutilisent les contrôles radio natifs dans des choix à bordure fine ; leurs noms restent lisibles sans dépendre des couleurs. La fidélité est affichée dans le récapitulatif, au plus près du montant. La galerie du pied de page conserve les photos et leur traitement de la référence, avec une translation lente, un contrôle de pause et une variante fixe en mouvement réduit.

Conserver l’ambiance restaurant et les compositions approuvées. Écrire en français naturel, afficher les prix indicatifs en FC. Utiliser le logo fourni, sans inventer d’adresse, de contact réel ou de partenariat. Éviter les dégradés décoratifs, métriques promotionnelles inventées et interfaces génériques. Le contexte reste Kinshasa / ULC ICAM. Les limitations des flux locaux de paiement et réservation restent visibles afin de ne pas faire croire à des transactions réelles.
