<?php
// Simple email signup form that saves to utilities/emails.txt

$message = '';
$emailValue = '';
$storageDir = __DIR__ . '/utilities';
$file = $storageDir . '/emails.txt';
$success = false;

$isJsonRequest = false;
if (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json')) {
    $isJsonRequest = true;
}

if (!$isJsonRequest && isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    $isJsonRequest = strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailValue = trim($_POST['email'] ?? '');

    if (!filter_var($emailValue, FILTER_VALIDATE_EMAIL)) {
        $message = 'Please enter a valid email.';
    } else {
        if (!is_dir($storageDir) && !mkdir($storageDir, 0755, true) && !is_dir($storageDir)) {
            $message = 'Unable to prepare storage right now. Please try again later.';
        } else {
            $line = $emailValue . ',' . date('c') . PHP_EOL;

            if (file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
                $message = 'Unable to save your email right now. Please try again later.';
            } else {
                $message = "Thanks! You're signed up.";
                $emailValue = '';
                $success = true;
            }
        }
    }

    if ($isJsonRequest) {
        if (!$success) {
            http_response_code(422);
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => $success,
            'message' => $message,
        ]);
        exit;
    }
}

// Want to sync signups to GitHub instead of a local file?
// Replace the file_put_contents() call above with a GitHub REST API request.
// See the README for a drop-in example that updates a repository file.
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Newsletter Sign-Up</title>
<style>
body { font-family: sans-serif; padding: 2em; max-width: 36rem; margin: 0 auto; }
form { display: flex; gap: .5em; }
input[type=email] { flex: 1; padding: .5em; border: 1px solid #94a3b8; border-radius: 6px; }
button { padding: .5em 1em; border: none; border-radius: 6px; background: #0f172a; color: #f1f5f9; cursor: pointer; }
button:hover, button:focus { background: #1e293b; }
p.message { margin-top: 1em; color: #15803d; font-weight: 600; }
p.error { color: #b91c1c; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
</style>
</head>
<body>
  <h1>Subscribe to our Newsletter</h1>
  <form method="POST" novalidate>
    <label for="email" class="sr-only">Email</label>
    <input type="email" id="email" name="email" placeholder="you@example.com" required value="<?= htmlspecialchars($emailValue, ENT_QUOTES) ?>">
    <button type="submit">Sign up</button>
  </form>
  <?php if ($message !== ''): ?>
    <?php $isError = !$success; ?>
    <p class="message<?= $isError ? ' error' : '' ?>"><?= htmlspecialchars($message, ENT_QUOTES) ?></p>
  <?php endif; ?>
</body>
</html>
