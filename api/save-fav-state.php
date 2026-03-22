<?php
header('Content-Type: application/json');

if (!isset($_POST['state'])) {
    http_response_code(400);
    echo json_encode(["error" => "Donnée manquante"]);
    exit;
}

$stateData = $_POST['state'];

// vérifie JSON
if (json_decode($stateData) === null) {
    http_response_code(400);
    echo json_encode(["error" => "Format JSON invalide"]);
    exit;
}

$file = 'fav.json';

try {

if (file_put_contents($file, $stateData) !== false) {
        echo json_encode(["status" => "success"]);
    } else {
        throw new Exception("Impossible d'écrire dans le fichier");
    }
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(["error" => $ex->getMessage()]);
}