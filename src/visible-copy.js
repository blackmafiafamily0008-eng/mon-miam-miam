// La migration retire les mentions de « maquette » et de « démonstration »
// du parcours. Les avertissements indispensables restent explicites :
// les paiements, réservations et identités externes ne sont pas réels.
const replacements = [
  ['zeduc-space-logo.png', 'zeduc-space-logo.svg'],
  ['Démonstration front-end.', ''],
  ['DÉMONSTRATION FRONT-END', 'MON MIAM MIAM'],
  ['ACCÈS GOOGLE · DÉMONSTRATION', 'CONNEXION GOOGLE'],
  ['Continuer avec Google', 'Se connecter avec Google'],
  ['Parcours de démonstration · Aucun compte Google réel utilisé.', 'La connexion Google sera disponible après son intégration technique.'],
  ['Prenez place, Camille.', 'Connexion Google en préparation'],
  ['Découvrez le parcours avec ce profil fictif. Aucune connexion à Google ni donnée de votre compte réel n’est utilisée.', 'La connexion avec votre compte Google sera proposée lorsque le service d’authentification sera configuré.'],
  ['Essayer avec ce profil →', 'Fermer'],
  ['Mobile Money · Démo', 'Mobile Money · sans débit réel'],
  ['EXPLORER LA DÉMONSTRATION', 'ACCÈS AUX ESPACES'],
  ['Choisissez un profil fictif, sans mot de passe.', 'Choisissez un espace pour poursuivre.'],
  ['Maquette front-end · Données conservées dans ce navigateur.', 'Vos données sont conservées dans ce navigateur.'],
  ['Cette maquette utilise uniquement le stockage de votre navigateur', 'Cette application utilise uniquement le stockage de votre navigateur'],
  ['Ce formulaire est une démonstration : aucune réservation n’est envoyée.', 'Préparez les détails de votre venue. Ce formulaire ne transmet pas encore de réservation au restaurant.'],
  ['Carte et prix de démonstration · Francs congolais', 'Carte et prix indicatifs · Francs congolais'],
  ['Prix de démonstration. Aucune commande ni aucun paiement réel.', 'Prix indicatifs. Aucun paiement réel n’est effectué.'],
  ['Horaires de démonstration', 'Horaires indicatifs'],
  ['Carte et prix de démonstration', 'Carte et prix indicatifs'],
  ['Votre commande de démonstration a été enregistrée.', 'Votre commande a été enregistrée dans cet espace.'],
  ['Numéro de démonstration', 'Numéro saisi'],
  ['Règles de démonstration', 'Règles du programme'],
  ['Règle de démonstration', 'Règle du programme'],
  ['Programme de démonstration', 'Programme proposé'],
  ['Classement de démonstration', 'Classement'],
  ['Comptes et profils de démonstration uniquement', 'Comptes disponibles dans cet espace'],
  ['Chiffres calculés à partir des commandes de démonstration', 'Chiffres calculés à partir des commandes enregistrées'],
  ['Mot de passe de démonstration', 'Mot de passe'],
  ['Dans cette maquette, aucun e-mail n’est envoyé.', 'Aucun e-mail n’est envoyé pour le moment.'],
  ['Je comprends qu’il s’agit d’une démonstration locale et j’utilise des informations fictives.', 'Je comprends que les données de mon compte restent dans ce navigateur.'],
  ['Données de démonstration', 'Données locales'],
  ['Les espaces de démonstration', 'Les espaces'],
  ['À propos de cette démo', 'À propos de l’application'],
  ['Une maquette, de vrais parcours', 'À propos de Mon Miam Miam'],
  ['Photo de la maquette', 'Photo du plat'],
  ['SIMULER MA RÉSERVATION', 'PRÉPARER MA RÉSERVATION'],
  ['Simulation pour ', 'Détails saisis pour '],
  ['Camille Démo', 'Camille'],
  ['Profils de démonstration', 'Profils locaux'],
  ['Profil de démonstration', 'Profil local'],
  ['Les profils de démonstration', 'Les profils locaux'],
  ['Les comptes de démonstration', 'Les comptes locaux'],
  ['Les commandes de démonstration', 'Les commandes locales'],
  ['Cette adresse est déjà utilisée dans la démo.', 'Cette adresse est déjà utilisée.'],
  ['Pour un profil fictif, utilisez les boutons de démonstration.', 'Vérifiez votre adresse et votre mot de passe.'],
  ['Démonstration', 'Application'],
  ['démonstration', 'présentation'],
  ['DÉMONSTRATION', 'ACCÈS LOCAL'],
  ['Maquette', 'Application'],
  ['maquette', 'application'],
  ['DÉMO', 'LOCAL'],
  ['Démo', 'Local'],
  ['démo', 'local'],
];

export function cleanVisibleCopy(text) {
  // Les termes courts ne doivent remplacer que des mots entiers : « démo »
  // est contenu dans « démocratique », qui ne doit jamais être modifié.
  const isolated = new Set(['Démonstration', 'démonstration', 'DÉMONSTRATION', 'Maquette', 'maquette', 'DÉMO', 'Démo', 'démo']);
  return replacements.reduce((output, [before, after]) => {
    if (isolated.has(before)) {
      return output.replace(new RegExp(`(?<![\\p{L}\\p{N}])${before}(?![\\p{L}\\p{N}])`, 'gu'), after);
    }
    return output.replaceAll(before, after);
  }, text);
}
