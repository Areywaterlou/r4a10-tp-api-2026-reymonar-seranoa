<?php
//script qui écrit dans le fichier JSON pour enregistrer un nouveau favori.

if (!array_key_exists('state', $_POST)) {
  // Définition du statut de réponse de la requête (500 = Internal Server Error)
  http_response_code(500);
  // puis levée d'une exception
  throw new Exception("Erreur Serveur (Donnée manquante)");
}

// Récupération des données sous la forme d'une chaine
$stateData = $_POST['state'];

// Vérification du JSON
$obj = json_decode($stateData);
if ($obj === NULL) {
  // Définition du statut de la réponse puis levée d'une exception
  http_response_code(500);
  throw new Exception("Erreur Serveur (Chaine qui n'est pas au format JSON)");
}

if (!is_writable('etat.json')) {
  // Définition du statut de la réponse puis levée d'une exception
  http_response_code(500);
  throw new Exception("Erreur Serveur (Fichier non accessible en écriture)");
}

try {
  // Ouverture du fichier en mode écriture
  $file = fopen('fav.json', 'w');
  // Écriture de la chaine récupérée dans le fichier etat.json
  fputs($file, $stateData);
  // Fermeture du fichier
  fclose($file);
} catch (Exception $ex) {
  // Définition du statut de la réponse puis levée d'une exception
  http_response_code(500);
  throw new Exception("Erreur Serveur (Problème sur le fichier)");
}