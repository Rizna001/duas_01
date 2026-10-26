# Setup and Render Deployment

## Run locally

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

The local website runs on `http://localhost:3000`. The API is available at:

- `http://localhost:3000/api/v1/index.json`
- `http://localhost:3000/api/v1/duas.json`

To check types and create the production build:

```sh
npm run typecheck
npm run build
```

The build generator reads the source collections in `src/data/`, validates them, creates `src/data/catalog.json` for the app, and generates both API JSON files under `public/api/v1/`. Vite copies those API files to `dist/api/v1/`.

## Deploy from GitHub to Render

1. Push the complete repository to GitHub.
2. In Render, choose **New + → Blueprint** and connect the repository.
3. Confirm the static site configuration from `render.yaml`.

The Blueprint runs `npm ci --include=dev && npm run build` and publishes `dist/`. This is a static site; do not create a Node web service or supply a start command.

After deployment, check both the website and the API:

```text
https://<your-render-service>.onrender.com/
https://<your-render-service>.onrender.com/api/v1/index.json
https://<your-render-service>.onrender.com/api/v1/duas.json
```

The generated metadata and content come from the same validated source. A missing field or categorized-record translation, duplicate ID, or incomplete 99-name/25-prophet list stops the build rather than deploying partial data.

If a separate main app will request the API from another domain, add an `Access-Control-Allow-Origin` custom header for `/api/*` in the Render Dashboard and set it to the main app's exact origin. This setting is managed in Render, not in the Blueprint file.
