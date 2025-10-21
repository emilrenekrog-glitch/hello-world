<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Allow: POST, OPTIONS');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are supported.',
    ]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = [];

if (!empty($_POST)) {
    $data = $_POST;
} elseif ($rawInput !== false && $rawInput !== '') {
    $contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');

    if (str_contains($contentType, 'application/json')) {
        $decoded = json_decode($rawInput, true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
    } elseif (str_contains($contentType, 'application/x-www-form-urlencoded')) {
        parse_str($rawInput, $parsed);
        if (is_array($parsed)) {
            $data = $parsed;
        }
    }
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide your name, email, and a message so we can respond.',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.',
    ]);
    exit;
}

$maxNameLength = 200;
$maxMessageLength = 5000;

if (mb_strlen($name) > $maxNameLength) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Name is too long. Please use 200 characters or fewer.',
    ]);
    exit;
}

if (mb_strlen($message) > $maxMessageLength) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Message is too long. Please keep it under 5,000 characters.',
    ]);
    exit;
}

$storageDir = __DIR__ . '/utilities';
if (!is_dir($storageDir) && !mkdir($storageDir, 0755, true) && !is_dir($storageDir)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare storage for contact messages.',
    ]);
    exit;
}

$record = [
    'name' => $name,
    'email' => $email,
    'message' => $message,
    'submittedAt' => date('c'),
];

$file = $storageDir . '/contact-submissions.jsonl';
$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;

if (file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not save your message right now. Please try again later.',
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Thanks! We received your message and will be in touch soon.',
]);
