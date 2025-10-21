<?php
$message = '';
$emailValue = '';

$githubToken = getenv('GITHUB_TOKEN') ?: '';
$githubRepo = getenv('GITHUB_REPO') ?: '';
$githubPath = getenv('GITHUB_PATH') ?: 'email.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailValue = trim($_POST['email'] ?? '');
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

    if (!$email) {
        $message = 'Please enter a valid email.';
    } elseif ($githubToken === '' || $githubRepo === '') {
        $message = 'Signup storage is not configured right now. Please try again later.';
    } else {
        $line = $email . ',' . date('c') . PHP_EOL;
        $errorMessage = 'Unable to save your email right now. Please try again later.';

        if (appendSignupToGitHub($email, $line, $githubToken, $githubRepo, $githubPath, $errorMessage)) {
            $message = "Thanks! You're signed up.";
            $emailValue = '';
        } else {
            $message = $errorMessage;
        }
    }
}

function appendSignupToGitHub(
    string $email,
    string $line,
    string $token,
    string $repo,
    string $path,
    string &$errorMessage
): bool {
    $errorMessage = 'Unable to save your email right now. Please try again later.';
    $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
    $apiUrl = "https://api.github.com/repos/{$repo}/contents/{$encodedPath}";
    $headers = [
        'Authorization: token ' . $token,
        'User-Agent: SimpleSignup',
        'Accept: application/vnd.github+json',
        'Content-Type: application/json',
    ];
    $headerString = implode("\r\n", $headers) . "\r\n";

    $baseContext = [
        'http' => [
            'header' => $headerString,
            'ignore_errors' => true,
            'timeout' => 10,
        ],
    ];

    $maxAttempts = 3;

    for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
        $getContext = $baseContext;
        $getContext['http']['method'] = 'GET';
        $current = @file_get_contents($apiUrl, false, stream_context_create($getContext));
        $responseHeaders = $http_response_header ?? [];

        if ($current === false && $responseHeaders === []) {
            return false;
        }

        $statusLine = $responseHeaders[0] ?? '';
        $existing = '';
        $sha = null;

        if ($statusLine !== '') {
            if (str_contains($statusLine, '200')) {
                $data = json_decode($current, true);
                if (!is_array($data) || !isset($data['content'])) {
                    return false;
                }

                $decoded = base64_decode((string)($data['content'] ?? ''), true);
                if ($decoded === false) {
                    return false;
                }

                $existing = $decoded;
                $sha = $data['sha'] ?? null;
            } elseif (str_contains($statusLine, '404')) {
                // File does not exist yet; treat as empty content.
            } elseif (str_contains($statusLine, '401') || str_contains($statusLine, '403')) {
                $errorMessage = 'Signup storage credentials are invalid. Please try again later.';
                return false;
            } else {
                return false;
            }
        }

        $payload = [
            'message' => 'Add signup for ' . $email,
            'content' => base64_encode($existing . $line),
        ];

        if ($sha !== null) {
            $payload['sha'] = $sha;
        }

        $payloadJson = json_encode($payload, JSON_UNESCAPED_SLASHES);
        if ($payloadJson === false) {
            return false;
        }

        $putContext = $baseContext;
        $putContext['http']['method'] = 'PUT';
        $putContext['http']['content'] = $payloadJson;

        $result = @file_get_contents($apiUrl, false, stream_context_create($putContext));
        $putHeaders = $http_response_header ?? [];

        if ($result === false && $putHeaders === []) {
            return false;
        }

        $putStatus = $putHeaders[0] ?? '';

        if ($putStatus !== '') {
            if (str_contains($putStatus, '200') || str_contains($putStatus, '201')) {
                return true;
            }

            if (str_contains($putStatus, '409')) {
                // Another process updated the file; retry with the new state.
                continue;
            }

            if (str_contains($putStatus, '401') || str_contains($putStatus, '403')) {
                $errorMessage = 'Signup storage credentials are invalid. Please try again later.';
            }
        }

        return false;
    }

    return false;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter Sign-Up</title>
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 2.5rem 1.5rem;
      margin: 0 auto;
      max-width: 40rem;
      line-height: 1.6;
    }

    h1 {
      margin-bottom: 1.5rem;
      font-size: clamp(1.75rem, 3vw + 1rem, 2.5rem);
    }

    form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    label {
      font-weight: 600;
    }

    input[type="email"] {
      flex: 1 1 14rem;
      min-width: 12rem;
      padding: 0.75rem 1rem;
      border: 1px solid #94a3b8;
      border-radius: 0.75rem;
      font-size: 1rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      background: #0f172a;
      color: #f8fafc;
      font-weight: 600;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    button:hover,
    button:focus-visible {
      background: #1e293b;
    }

    .message {
      margin-top: 1.25rem;
      font-weight: 600;
      color: #16a34a;
    }

    .message.error {
      color: #dc2626;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  </style>
</head>
<body>
  <h1>Subscribe to our newsletter</h1>
  <p>Join our mailing list to get the latest updates delivered straight to your inbox.</p>
  <form method="post" novalidate>
    <label class="sr-only" for="email">Email address</label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="you@example.com"
      required
      value="<?= htmlspecialchars($emailValue, ENT_QUOTES) ?>"
      autocomplete="email"
    >
    <button type="submit">Sign up</button>
  </form>
  <?php if ($message !== ''): ?>
    <?php $isError = $message !== "Thanks! You're signed up."; ?>
    <p class="message<?= $isError ? ' error' : '' ?>"><?= htmlspecialchars($message, ENT_QUOTES) ?></p>
  <?php endif; ?>
</body>
</html>
