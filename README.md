# BluePlanet Landing Page

This project is a Vite-powered React application that showcases the BluePlanet landing page. The original in-app newsletter storage has been removed. Instead, the repository now includes [`index.php`](index.php), a minimal PHP email sign-up form that captures addresses without any external dependencies.

## Development

1. Install dependencies (already provided in this workspace):

   ```bash
   npm install
   ```

2. Launch the React development server:

   ```bash
   npm run dev
   ```

3. Create an optimized production build when you're ready to deploy:

   ```bash
   npm run build
   ```

Serve the files from `dist/` with your preferred static host.

## Minimal PHP email sign-up form

* [`index.php`](index.php) is a single-file email capture form that runs on any PHP 8+ host.
* Submissions are validated server-side and appended to `emails.txt` in the same directory with an ISO-8601 timestamp.
* The generated `emails.txt` file is ignored by Git to keep accidental signups out of version control.

### Deploying the PHP form

1. Copy `index.php` (and an optional empty `emails.txt`) to a PHP-enabled web server.
2. Ensure the directory is writable by the web server user so new signups can be appended.
3. Visit the page and submit an email address—the form handles everything else.

### Saving signups to GitHub instead of a flat file

If you prefer to store addresses in a GitHub repository, replace the `file_put_contents()` block in `index.php` with the following snippet. Set a `GITHUB_TOKEN` environment variable with permissions to update the target repository before deploying.

```php
$token = getenv('GITHUB_TOKEN');
$repo = 'yourusername/newsletter-data';
$path = 'emails.txt';
$emailLine = $emailValue . ',' . date('c') . "\n";

$apiUrl = "https://api.github.com/repos/$repo/contents/$path";
$options = [
    'http' => [
        'header' => [
            'Authorization: token ' . $token,
            'User-Agent: SimpleSignup',
            'Content-Type: application/json',
        ],
        'method' => 'GET',
    ],
];

$current = @file_get_contents($apiUrl, false, stream_context_create($options));
$data = json_decode($current, true);
$sha = $data['sha'] ?? null;
$existing = base64_decode($data['content'] ?? '');
$newContent = base64_encode($existing . $emailLine);

$payload = json_encode([
    'message' => 'add ' . $emailValue,
    'content' => $newContent,
    'sha' => $sha,
]);

$options['http']['method'] = 'PUT';
$options['http']['content'] = $payload;

file_get_contents($apiUrl, false, stream_context_create($options));
```

This mirrors the logic from the README instructions so you can keep using Git history as a simple backing store.
