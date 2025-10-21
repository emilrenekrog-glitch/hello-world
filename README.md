# BluePlanet Landing Page

This project is a Vite-powered React application that showcases the BluePlanet landing page. The original in-app newsletter storage has been removed. Instead, the repository now includes [`index.php`](index.php), a minimal PHP email sign-up form that captures addresses without any external dependencies. For the in-page contact form, deploy [`contact-submit.php`](contact-submit.php) so messages are stored on the server instead of the visitor's browser.

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
* Submissions are validated server-side and appended to a file in a GitHub repository using the [GitHub Contents API](https://docs.github.com/rest/repos/contents?apiVersion=2022-11-28).
* Each signup is stored as `email@example.com,2024-01-01T12:00:00+00:00` on its own line so the history doubles as a CSV archive.

### Deploying the PHP form

1. Copy `index.php` to a PHP-enabled web server.
2. Provide the following environment variables through your web server's configuration before serving the form:
   * `GITHUB_TOKEN`: A token with permission to write to the destination repository (`contents:write` on fine-grained tokens or the classic `repo` scope).
   * `GITHUB_REPO`: The `owner/repository` identifier where signups should be stored.
   * `GITHUB_PATH` (optional): The path inside the repository for the signup log. Defaults to `email.txt`.
3. Ensure the server can reach `api.github.com` and submit a test email address to confirm the integration.

## Contact form submission endpoint

* [`contact-submit.php`](contact-submit.php) accepts `POST` requests from the contact form in the React app.
* Valid submissions are appended as JSON Lines to `utilities/contact-submissions.jsonl` alongside an ISO-8601 timestamp.
* The frontend posts to `/contact-submit.php` by default. Set `VITE_CONTACT_ENDPOINT` before building if you need to target a different URL.

### Deploying the contact endpoint

1. Copy `contact-submit.php` to the same PHP-enabled host that serves your production build.
2. Ensure the `utilities/` directory is writable so new `contact-submissions.jsonl` entries can be appended.
3. Visit the site, submit the contact form, and verify that `utilities/contact-submissions.jsonl` is created with your test entry.

### GitHub storage behaviour

The signup handler automatically creates the target file if it does not exist and retries once if another process updates the file at the same time. Commit messages follow the format `Add signup for email@example.com` so you can audit additions directly from the repository history.
