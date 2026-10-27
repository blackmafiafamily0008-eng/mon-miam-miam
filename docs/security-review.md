# Revue de sécurité — Mon Miam Miam

Date : 28 octobre 2026. Périmètre : les huit écrans React + Vite, les scripts `dist/`, le stockage du navigateur et les parcours de connexion / commande.

## Corrections apportées

- Les boutons publics qui connectaient instantanément un visiteur comme étudiant, employé, gérant ou administrateur ont été retirés des pages Connexion et Inscription.
- L'API JavaScript n'expose plus `demoLogin`, `googleDemoSignIn` ni `signIn`. Le bouton Google ouvre désormais une information claire : OAuth n'est pas encore configuré.
- Les opérations métiers sensibles vérifient l'identité de la session locale en plus du rôle déclaré. Les réclamations vérifient également le propriétaire de la commande.
- Les liens directs vers les espaces du personnel ont été retirés du pied de page public. Les routes privées renvoient à Connexion lorsque la session n'est pas autorisée.
- Sur la vitrine, le détail d'un plat oriente vers Connexion pour commander ; le panier public est masqué.
- Le formulaire « Mot de passe oublié » ne prétend plus envoyer un e-mail.

- Les raccourcis et profils Google préremplis ont aussi été supprimés des fichiers HTML historiques, pas uniquement masqués dans React.
- Le rôle est relu depuis la session pour chaque contrôle : un objet passé à `requireRole` avec un rôle falsifié est refusé.
- Les écrans revérifient le rôle lors du rendu ; les actions et soumissions revérifient la session pour réduire les actions après déconnexion ou suspension.
- Le SVG fourni dispose d’un `viewBox` et remplace également les favicons.

## Risques **toujours critiques** avant toute production

1. **Pas de backend d'authentification.** Les données (dont comptes, rôles, commandes, points et parfois empreintes de mot de passe) résident dans `localStorage`. Une personne peut modifier son stockage et usurper un rôle. Les vérifications JavaScript ne constituent pas un contrôle d'accès sécurisé.
2. **Pas de base de données côté serveur.** Les données sont propres à chaque navigateur, non synchronisées, non protégées contre la modification volontaire ou la suppression locale.
3. **Pas d'encaissement réel.** M-Pesa, Orange Money et Airtel Money sont des choix visuels ; une confirmation locale ne démontre pas qu'un opérateur a transféré de l'argent.
4. **Connexion Google non opérationnelle.** Il manque un fournisseur OAuth/OpenID Connect configuré côté serveur, avec validation des jetons et création d'une session serveur.
5. **Récupération du compte non opérationnelle.** Aucun service d'e-mail ni processus de réinitialisation sécurisé.
6. **Données personnelles.** Les noms, téléphones, adresses et éventuelles empreintes de mot de passe de comptes locaux peuvent être lus par le code exécuté dans le navigateur ; il faut les transférer vers une API et une base de données protégées.

**Conclusion :** la suppression des raccourcis ferme la faille de navigation immédiatement exploitable dans l'interface ; elle ne rend pas l'application apte à traiter de vrais comptes, commandes ou paiements. Ne pas publier comme service transactionnel avant la migration du stockage et de l'autorisation vers le serveur.

## Comptes présents dans les données initiales du dépôt

Il s'agit de **profils d'exemple**, jamais d'identités réelles vérifiées. Ils n'ont **aucun mot de passe prédéfini** ; depuis la suppression des raccourcis, ils ne permettent plus de se connecter par l'interface. Les comptes créés ultérieurement par les visiteurs ne sont accessibles que dans le navigateur où ils ont été créés ; le dépôt ne contient pas leurs identifiants ni mots de passe.

| Identifiant local | Nom | Adresse locale d'exemple | Rôle |
| --- | --- | --- | --- |
| `demo-etudiant` | Alex Mbuyi | `alex@exemple.test` | Étudiant |
| `demo-employe` | Grâce Mbala | `grace@exemple.test` | Employé |
| `demo-gerant` | David Ilunga | `david@exemple.test` | Gérant |
| `demo-admin` | Sarah Kanku | `sarah@exemple.test` | Administrateur |

Le jeu de données contient aussi dix profils étudiants non connectables (`client-0` à `client-9`, adresses `client0@exemple.test` à `client9@exemple.test`), uniquement pour illustrer les historiques et statistiques. Aucun mot de passe n'y est défini.

## Étapes obligatoires avant un lancement réel

1. Créer une API et une base de données serveur ; ne plus faire confiance aux rôles, prix, totaux, soldes de points ou identifiants provenant du navigateur.
2. Authentifier et autoriser chaque requête serveur. Créer les comptes administrateurs et du personnel par un mécanisme d'invitation sécurisé, sans identifiants codés en dur dans le front-end.
3. Stocker les mots de passe avec un algorithme adapté côté serveur, limiter les tentatives de connexion et utiliser des sessions sûres (`HttpOnly`, `Secure`, `SameSite`).
4. Intégrer Google OAuth et vérifier les jetons côté serveur. Ajouter un véritable flux de récupération de compte.
5. Intégrer les opérateurs Mobile Money via un prestataire agréé, vérifier les confirmations sur le serveur, gérer annulations/idempotence, et ne jamais accepter un simple booléen `paymentConfirmed` du navigateur.
6. Ajouter tests de sécurité automatisés, journaux d'audit, CSP adaptée, contrôles d'entrées et analyse des dépendances avant ouverture au public.
