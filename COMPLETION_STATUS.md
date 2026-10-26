# Project and Deployment Status

This repository contains a React/Vite website and a static JSON API. Render should deploy it as a **Static Site**, using the repository's `render.yaml` Blueprint.

## Build and deploy

- Build command: `npm ci --include=dev && npm run build`
- Publish directory: `dist`
- API endpoints: `/api/v1/index.json` and `/api/v1/duas.json`
- No backend server, database, API key, or start command is required.

The build generates the UI catalog and API responses from the data sources in `src/data/`. Validation checks required text and all supported translations for categorized records, globally unique IDs, recitation counts, and the full 99-name and 25-prophet collections. A validation failure fails the deployment build.

## Current categorized data

- 45 categories
- 123 categorized dua records
- 10 app languages: English, Arabic, Urdu, French, Turkish, Indonesian, Bengali, Malay, Tamil, and Malayalam
- Supplementary collections include Asma ul Husna, Asma ul Anbiya, Rabbana duas, salawat, prophet duas and names, and important Islamic texts.

The categorized totals do not include supplementary collections; the API index reports each supplemental collection's record count separately.

## Deploy checklist

1. Push source changes to GitHub.
2. Connect that repository to Render as a Blueprint or create a Static Site with the build and publish settings above.
3. Wait for a successful build.
4. Open `/api/v1/index.json` and `/api/v1/duas.json` on the deployed service and verify the metadata and category records.
5. Load the website and check the complete-list category views and at least one dua detail.

See [API.md](API.md) for the response format and [SETUP_GUIDE.md](SETUP_GUIDE.md) for local setup.
