<?php
session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Please enter valid credentials.']);
        exit;
    }
    $_SESSION['login_error'] = 'Please enter valid credentials.';
    header('Location: login.html');
    exit;
}

$stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }
    $_SESSION['login_error'] = 'Invalid email or password.';
    header('Location: login.html');
    exit;
}

// Successful login
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];

// Regenerate session id to prevent fixation
session_regenerate_id(true);

if ($isAjax) {
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Login successful']);
    exit;
}

header('Location: index.html');
exit;

?>
