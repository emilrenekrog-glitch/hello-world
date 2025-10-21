# BluePlanet Newsletter Demo

This project is a Vite-powered React application that showcases the BluePlanet landing page. The newsletter subscription form captures email addresses and stores them on disk inside the repository so they can be reviewed or committed as part of your project history.

## Getting started

1. Install dependencies (already provided in this workspace):

   ```bash
   npm install
   ```

2. Run the storage API so newsletter submissions can be persisted to the repository:

   ```bash
   npm run server
   ```

   The API listens on <http://localhost:3001> and appends signups to [`data/newsletter-signups.json`](data/newsletter-signups.json).

3. In a separate terminal, launch the React development server:

   ```bash
   npm run dev
   ```

   The Vite dev server proxies `/api` requests to the storage API, so the contact form can save and retrieve entries without additional configuration.

## Production build

To create an optimized production build of the site, run:

```bash
npm run build
```

Serve the static files from `dist/` and run the newsletter storage server (`npm run server`) alongside it to capture subscription requests.

## Data storage

Newsletter signups are stored as JSON objects in [`data/newsletter-signups.json`](data/newsletter-signups.json). Each entry includes the submitted email address and an ISO-8601 timestamp. You can commit this file to source control to preserve signups captured during development or testing.
