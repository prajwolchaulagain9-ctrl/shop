<?php
session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: register.html');
    exit;
}

$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

// Accept first_name & last_name from the modal, combine into a single name
$first = trim($_POST['first_name'] ?? '');
$last = trim($_POST['last_name'] ?? '');
$name = trim(($first . ' ' . $last));
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

$errors = [];

if ($name === '') $errors[] = 'Name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email required.';
if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';

if ($errors) {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        exit;
    }
    $_SESSION['register_errors'] = $errors;
    header('Location: register.html');
    exit;
}

// Check if email exists
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    $_SESSION['register_errors'] = ['Email already registered.'];
    header('Location: register.html');
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
try {
    $insert->execute([$name, $email, $passwordHash]);
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['user_name'] = $name;
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
        exit;
    }
    header('Location: index.html');
    exit;
} catch (Exception $e) {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again later.']);
        exit;
    }
    $_SESSION['register_errors'] = ['Registration failed. Please try again later.'];
    header('Location: register.html');
    exit;
}

?>
