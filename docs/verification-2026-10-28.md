# Vérifications du 28 octobre 2026

## Contrôles automatisés

- `npm run check` : syntaxe, liens locaux, huit routes React, favicon SVG, absence de libellés provisoires et de raccourcis d'authentification dans les huit sources HTML.
- `npm test` : 16 tests réussis, couvrant connexion/inscription locales, refus de rôle falsifié, actions après déconnexion, commande, paiement local, fidélité, parrainage, réclamations et gestion des comptes.
- `npm run build` : compilation Vite des huit entrées réussie.
- `npm audit` : 0 vulnérabilité connue signalée par le registre au moment du contrôle.
- Audit statique Frontend Design Premium, mode strict sur `src` et `dist` : aucun constat bloquant.

## Contrôles dans le navigateur

- Vitrine : logo SVG visible, trois plats congolais présents dans la carte, détail du liboké avec lien vers Connexion pour commander.
- Connexion : aucun choix de rôle ; erreurs de champs vides, focus sur le premier champ invalide ; Google ouvre uniquement une information d'indisponibilité, avec fermeture au clavier.
- Inscription et récupération : pages distinctes, aucun accès rapide aux rôles ni mention de maquette ou démonstration.
- Administration sans session : redirection vers Connexion.
- Espaces étudiant, employé, gérant et administrateur : contrôle visuel et navigation entre les sections. Les profils initiaux ont été utilisés exclusivement via une page de contrôle locale, exclue du dépôt et du build.
- Étudiant : catégorie Plats congolais, photos, ajout du liboké au panier, sélection des moyens de paiement et logos ; panier et formulaires examinés à une largeur de 390 px.
- Administrateur : édition du liboké, catégorie Plats congolais et photo correspondante correctement sélectionnées.

## Limites

Ces vérifications ne certifient pas la sécurité d'un service transactionnel. Il n'existe toujours ni authentification/autorisation serveur, ni OAuth Google fonctionnel, ni service de récupération par e-mail, ni paiement Mobile Money réel. Le stockage local reste modifiable par le propriétaire du navigateur. Les parcours authentifiés ont été inspectés avec des données de contrôle, sans comptes réels. L'authentification locale est couverte par les tests automatisés ; aucun mot de passe utilisateur réel n'a été demandé ou manipulé. L'audit statique ne vaut pas certification d'accessibilité.
