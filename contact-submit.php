<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    header('Content-Type: application/json; charset=utf-8');
}

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

$jsonlFile = $storageDir . '/contact-submissions.jsonl';
$jsonLine = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;

if (file_put_contents($jsonlFile, $jsonLine, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not save your message right now. Please try again later.',
    ]);
    exit;
}

$flatMessage = preg_replace('/\r\n|\r|\n/u', ' ', $message);
$readableLine = sprintf(
    '%s for name, %s for email and for how can we help : %s',
    $name,
    $email,
    trim($flatMessage)
);
$textFile = $storageDir . '/contact-submissions.txt';
$textLine = $readableLine . PHP_EOL;

if (file_put_contents($textFile, $textLine, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not save your message right now. Please try again later.',
    ]);
    exit;
}

$githubRepo = trim((string) getenv('CONTACT_GITHUB_REPO'));
$githubToken = trim((string) (getenv('CONTACT_GITHUB_TOKEN') ?: getenv('GITHUB_TOKEN')));
$githubPath = trim((string) (getenv('CONTACT_GITHUB_PATH') ?: 'contact-submissions.txt'));

if ($githubRepo !== '' && $githubToken !== '') {
    $githubResult = append_submission_to_github($githubRepo, $githubPath, $readableLine, $githubToken, $name);

    if ($githubResult === false) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'We received your message but could not sync it to GitHub. Please try again later.',
        ]);
        exit;
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Thanks! We received your message and will be in touch soon.',
]);

if (!function_exists('append_submission_to_github')) {
    function append_submission_to_github(string $repo, string $path, string $line, string $token, string $name): bool
    {
        $normalizedLine = preg_replace('/\r\n|\r|\n/u', ' ', $line);
        $normalizedLine = trim($normalizedLine);
        $normalizedLine .= "\n";

        $apiBase = 'https://api.github.com/repos/' . $repo . '/contents/';
        $pathSegments = array_map('rawurlencode', explode('/', $path));
        $encodedPath = implode('/', $pathSegments);
        $resourceUrl = $apiBase . $encodedPath;

        $headers = [
            'Authorization: token ' . $token,
            'User-Agent: ContactSubmissionBot',
            'Accept: application/vnd.github+json',
        ];

        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'ignore_errors' => true,
                'header' => $headers,
            ],
        ]);

        $sha = null;
        $existingContent = '';
        $response = @file_get_contents($resourceUrl, false, $context);
        $statusCode = extract_status_code($http_response_header ?? []);

        if ($statusCode === 0 && $response === false) {
            return false;
        }

        if ($statusCode === 200 && $response !== false) {
            $payload = json_decode($response, true);
            if (!is_array($payload)) {
                return false;
            }

            $sha = $payload['sha'] ?? null;
            $existingEncoded = $payload['content'] ?? '';
            $existingContent = base64_decode($existingEncoded, true);

            if ($existingContent === false) {
                return false;
            }
        } elseif ($statusCode === 404) {
            $existingContent = '';
            $sha = null;
        } elseif ($statusCode !== 0) {
            return false;
        }

        if ($existingContent !== '' && !str_ends_with($existingContent, "\n")) {
            $existingContent .= "\n";
        }

        $updatedContent = $existingContent . $normalizedLine;
        $encodedContent = base64_encode($updatedContent);

        $putContext = stream_context_create([
            'http' => [
                'method' => 'PUT',
                'ignore_errors' => true,
                'header' => array_merge($headers, ['Content-Type: application/json']),
                'content' => json_encode([
                    'message' => 'Add contact submission from ' . $name,
                    'content' => $encodedContent,
                    'sha' => $sha,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ]);

        $putResponse = @file_get_contents($resourceUrl, false, $putContext);
        $putStatus = extract_status_code($http_response_header ?? []);

        return $putStatus === 200 || $putStatus === 201;
    }
}

if (!function_exists('extract_status_code')) {
    function extract_status_code(array $headers): int
    {
        if ($headers === []) {
            return 0;
        }

        if (!preg_match('{HTTP/\S+\s+(\d+)}', $headers[0], $matches)) {
            return 0;
        }

        return (int) $matches[1];
    }
}
