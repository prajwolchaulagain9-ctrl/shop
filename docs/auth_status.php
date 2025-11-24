<?php
session_start();
header('Content-Type: application/json');

$loggedIn = isset($_SESSION['user_id']);
$name = $loggedIn ? ($_SESSION['user_name'] ?? '') : '';

echo json_encode(['loggedIn' => $loggedIn, 'name' => $name]);
exit;

?>
