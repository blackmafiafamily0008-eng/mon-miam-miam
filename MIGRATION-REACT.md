# Migration native vers React + Vite

## Résultat

Les **huit écrans** utilisent des composants React (`src/pages/*.jsx`) et une
entrée partagée (`src/main.jsx`). Le DOM des pages historiques n'est plus lu,
injecté ni piloté par des scripts impératifs. Vite 7 compile huit entrées HTML
et assemble les composants et les styles dans `build/`.

## Préservation des données et comportements

- Le domaine reste encapsulé dans `dist/miam-core.js`, chargé en module par
  `src/domain/miam.js`. Ses clés `mon-miam-miam-v2` et `miam-session-v2` restent
  inchangées, afin de conserver les données déjà saisies.
- Les transitions de commande, les règles de remboursement des points,
  l'attribution après service, le parrainage et la validation de paiement
  conservent leurs tests métier.
- L'interface des quatre rôles, les formulaires et les dialogues passent
  maintenant par des états et événements React. Les nouveaux composants
  partagent le même système de notifications et de boîtes de dialogue.
- L'import de photo est disponible dans les formulaires de plats et d'offres :
  PNG/JPEG/WebP, maximum 500 Ko, enregistré sur le navigateur.
- Le diaporama d'accueil change automatiquement d'image toutes les 6 secondes,
  sans boutons manuels, et respecte la préférence de mouvement réduit.
- Les anciens libellés de travail ont été retirés de l'interface ; les limites
  concrètes concernant les transactions et envois non connectés restent
  indiquées aux endroits concernés.

## Zones à valider avant la production

1. Tests manuels sur navigateur réel : les huit routes, navigation clavier,
   téléphone 390 px, recherche vide, dialogues, comptes et images importées.
2. Tests de parité fonctionnelle avec la version historique sur les scénarios
   complexes (panier et refus du paiement, annulation, réponse aux réclamations,
   suspension des comptes, point de fidélité gagné une seule fois).
3. Migration du moteur métier vers une API et une authentification serveur.
   Les comptes, permissions et données uniquement locales ne conviennent pas
   à des transactions réelles.
4. Sauvegarde distante des photos et autres ressources. Le stockage base64 dans
   le navigateur n'est qu'une solution transitoire.

## Vérification automatisée

```bash
npm run check
npm test
npm run build
```

Les tests métier `scripts/test-core.mjs` sont exécutés sur le moteur utilisé
par React. Les tests `scripts/test-react.mjs` vérifient les points de structure
et les principaux parcours React. Ils ne remplacent pas une campagne E2E.

## Retour arrière

Les fichiers historiques `dist/` restent conservés pour comparaison ;
`npm run dev:legacy` démarre l'ancienne interface. La branche de migration
initiale `feature/react-vite-migration` reste un point de retour GitHub.
