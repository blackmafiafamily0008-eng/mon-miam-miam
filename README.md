# Mon Miam Miam — Front-end français

Restaurant **ZEDUC-SP@CE**, Kinshasa, communauté des étudiants de l’ULC ICAM. L’accueil conserve les compositions et les photos de la référence Dishify fournie ; le logo noir et or provient du fichier utilisateur.

## Essayer les écrans

Ouvrir `connexion.html` et choisir l’un des quatre profils de démonstration, sans mot de passe : Étudiant, Employé, Gérant, Administrateur. L’inscription permet aussi de créer un compte étudiant fictif, puis de se reconnecter avec son mot de passe.

Le bouton **Continuer avec Google** est disponible sur les pages de connexion et d’inscription. Une fenêtre clairement identifiée comme démonstration ouvre le profil étudiant fictif « Camille Démo ». Ce profil est conservé pour les visites suivantes ; le panier choisi sur l’accueil est retrouvé après connexion. Aucun compte Google réel n’est consulté.

## Paiement, fidélité et galerie

- Le panier propose **M-Pesa, Orange Money, Airtel Money**, ou les espèces au restaurant / à la livraison selon le service choisi.
- Le parcours Mobile Money demande un numéro fictif puis permet de simuler une confirmation ou un refus. Aucun PIN ni paiement réel. En cas de refus ou de fermeture, aucune commande n’est créée, le panier et les points sont conservés. La confirmation crée une seule commande et conserve l’opérateur dans son détail.
- Le panier annonce les points qui seront gagnés après service ou livraison : par défaut **1 000 FC de repas après remise = 1 point**, hors frais de livraison. **15 points = 1 000 FC de remise**. L’annulation restitue les points dépensés ; un paiement Mobile Money annulé porte la mention « remboursé (simulation) ».
- Les cinq photos au-dessus du pied de page défilent de droite à gauche en boucle. Pause/reprise explicite, arrêt au survol ou au focus. Si le système demande moins d’animations, la galerie est fixe et peut défiler manuellement.

Les noms des services ont été vérifiés sur les pages officielles de [M-Pesa RDC](https://www.vodacom.cd/fr/particulier/m-pesa/entreprise/compte-marchand), [Orange Money RDC](https://www.orange.cd/fr/paiement-marchand.html?sku=paiementmarchandbyorange) et [Airtel Money RDC](https://www.airtelmoney.cd/faq). Le bouton Google reprend les couleurs et le libellé des [consignes Google Identity](https://developers.google.com/identity/branding-guidelines). Leur présence dans cette maquette n’implique aucun partenariat ni compte marchand actif.

Pour une future version réelle, remplacer `googleDemoSignIn()` par Google Identity Services avec vérification serveur de l’identité ; remplacer `paymentDetails()` et le parcours de simulation par une intégration marchande validée, avec confirmation serveur, vérification des montants et traitement des remboursements. Les points, prix, autorisations et statuts doivent alors être contrôlés côté serveur. Les devises et conditions de chaque prestataire sont à valider lors de cette phase. Aucun secret ne doit être ajouté aux fichiers `dist/`.

| Espace | Parcours disponibles |
|---|---|
| Étudiant | Carte, recherche, catégories, panier, sur place ou livraison, paiement simulé, suivi et historique, avis, fidélité, parrainage, offres et événements, quiz, classement, réclamations et profil |
| Employé | Préparation, disponibilité et menu du jour, progression jusqu’au service ou à la livraison, proposition de réponse aux réclamations, statistiques sur 7 jours |
| Gérant | Suivi des commandes, gestion des employés, validation ou renvoi des réponses, statistiques sur 7 ou 30 jours |
| Administrateur | Gestion de tous les comptes, carte et prix, affiches d’offres/événements, réclamations, statistiques et paramètres de fidélité/livraison |

Les comptes préchargés restent protégés pour garder les accès de démonstration disponibles. Les autres comptes peuvent être créés, modifiés, suspendus/réactivés et archivés par l’administrateur. Les plats retirés disparaissent de la carte sans effacer les anciennes commandes.

## Parcours de présentation conseillé

1. Depuis Étudiant, ajouter un plat et valider une commande fictive.
2. Cliquer sur « Changer d’espace », puis choisir Employé.
3. Préparer la nouvelle commande, la marquer prête et valider le service ou la livraison.
4. Revenir dans l’espace étudiant : l’historique et les points sont actualisés.
5. Créer un second compte avec le code `MIAM-ALEX` pour tester le parrainage : le bonus arrive après la première commande terminée du filleul.

## Portée et données

Version entièrement **front-end** : aucune commande, transaction, réservation ou communication réelle. Les données sont fictives et stockées dans ce navigateur, sous la clé `mon-miam-miam-v2`. La session du profil est propre à l’onglet. Pour une démo vierge, utiliser une fenêtre privée ou effacer les données locales du site.

L’authentification et les rôles sont des simulations d’interface, sans sécurité serveur. Les mots de passe des comptes fictifs créés sont dérivés localement avec PBKDF2 et sel, jamais enregistrés en clair. Ne pas saisir de données personnelles ni réutiliser un véritable mot de passe. La récupération de mot de passe montre uniquement l’écran de confirmation et n’envoie aucun e-mail.

Prix en francs congolais, horaires, taux de fidélité et bonus sont des valeurs de démonstration à confirmer avec le restaurant. Le calcul des points ignore les frais de livraison et tient compte des remises. Les points sont ajoutés une seule fois après une commande terminée ; les points utilisés sont restitués après annulation. Les affiches d’offres sont informatives, sans réduction automatique non annoncée.

Le contexte Cameroun / UCAC ICAM du cahier des charges a été remplacé par Kinshasa / ULC ICAM, selon la demande. Les exigences de back-end du document ne font pas partie de cette livraison.

## Lancer localement

Node.js suffit, sans installation de dépendances :

```
node server.mjs
```

Puis ouvrir http://127.0.0.1:4173. Les sources finales sont directement dans `dist/` ; aucune compilation n’est nécessaire. Ne pas ouvrir les pages en `file://`, car les fonctions de compte utilisent les API de navigateur disponibles sur localhost ou HTTPS.

```
node scripts/check.mjs
node --test scripts/test-core.mjs
```

Les essais navigateur sont dans `scripts/qa-browser.cjs` (Playwright à installer séparément et Microsoft Edge). Le rapport `qa-browser-report.json` consigne les parcours réellement vérifiés. `DESIGN.md` décrit l’identité visuelle et `UX-CONTRACT.md` les comportements partagés.

`qa-update-report.json` décrit les vérifications de cette mise à jour et leurs limites. Les tests métier couvrent également les trois opérateurs, l’absence d’effets après refus, les montants périmés, les points après service et l’identité Google de démonstration.

## Fichiers principaux

- `dist/index.html`, `styles.css`, `app-fr.js` : accueil français.
- `dist/connexion.html`, `inscription.html`, `mot-de-passe-oublie.html`, `auth.js` : accès.
- `dist/etudiant.html`, `employe.html`, `gerant.html`, `admin.html`, `espace.js`, `espace.css` : espaces et vues.
- `dist/miam-core.js` : données et logique de simulation à remplacer par une API lors d’une future phase back-end.
- `dist/ui.js` : validation des champs, pagination, recherche et protection des formulaires non enregistrés.
- `dist/assets/` : photos de la référence, logo fourni et polices locales.

Ce dépôt contient la version actuelle complète du front-end, ses ressources, ses tests et sa documentation. L’ancien historique de développement et les paramètres privés de publication ne sont pas inclus.
