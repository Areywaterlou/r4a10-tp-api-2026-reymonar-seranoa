<?php
try {
  // On lit tout le contenu du fichier d'un coup
  $obj = file_get_contents('fav.json');
  
  // On l'envoie direct au JavaScript
  echo $obj;
  
} catch (Exception $ex) {
  http_response_code(500);
  throw new Exception("Erreur Serveur (Problème sur le fichier)");
}
?>