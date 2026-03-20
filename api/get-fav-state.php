<?php
//script qui lit le fichier JSON pour afficher tes favoris au chargement de la page.

try {
    $stateData;
  // Ouverture du fichier en mode écriture
  $file = fopen('fav.json', 'r');
  // Écriture de la chaine récupérée dans le fichier etat.json
  fgets($file, $stateData);
  // Fermeture du fichier
  fclose($file);
} catch (Exception $ex) {
  // Définition du statut de la réponse puis levée d'une exception
  http_response_code(500);
  throw new Exception("Erreur Serveur (Problème sur le fichier)");
}