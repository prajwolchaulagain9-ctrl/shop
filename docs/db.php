<?php
// Database connection using PDO
// Update $db if you choose a different database name
$host = '127.0.0.1';
$db   = 'shopdb';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // In production do not echo errors. Log them instead.
    http_response_code(500);
    echo 'Database connection failed.';
    exit;
}

// Helper: simple function to escape output for HTML
function e($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

?>
