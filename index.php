<?php
$message = '';
$emailValue = '';

$storageDir = __DIR__ . '/utilities';
if (!is_dir($storageDir) && !mkdir($storageDir, 0755, true) && !is_dir($storageDir)) {
    $message = 'Unable to prepare storage right now. Please try again later.';
}
$file = $storageDir . '/emails.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailValue = trim($_POST['email'] ?? '');
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

    if (!$email) {
        $message = 'Please enter a valid email.';
    } elseif ($message === '') {
        $line = $email . ',' . date('c') . PHP_EOL;

        if (file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
            $message = 'Unable to save your email right now. Please try again later.';
        } else {
            $message = "Thanks! You're signed up.";
            $emailValue = '';
        }
    }
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
