# Repository Structure

This repository contains a React/Vite website and a generated static JSON API.

```text
.
├── .github/                 GitHub issue and pull-request templates
├── public/api/v1/
│   ├── duas.json             Generated complete API response
│   └── index.json            Generated API metadata and counts
├── scripts/
│   └── build-api.mjs         Data validation and API/catalog generation
├── src/
│   ├── App.tsx               Main UI and category/detail navigation
│   ├── components/           Category, dua, settings, tracker, and list views
│   ├── contexts/              Theme, bookmarks, and notifications state
│   └── data/                  Source JSON and supplementary TypeScript data
├── index.html                Vite entry page
├── package.json              Commands and dependencies
├── render.yaml               Render Static Site Blueprint
├── tsconfig.json             TypeScript settings
└── vite.config.js            Vite configuration
```

## Data and generated files

The category sources are the JSON files in `src/data/`. Supplementary collections—such as the full Asma ul Husna and Asma ul Anbiya lists, Rabbana duas, salawat, prophet duas, and important texts—are maintained in TypeScript data modules in that directory.

`npm run dev`, `npm run typecheck`, and `npm run build` first run `scripts/build-api.mjs`. That generator validates the category data and required full lists, then creates:

- `src/data/catalog.json` for the web app (generated, ignored by Git)
- `public/api/v1/duas.json` for the complete data response
- `public/api/v1/index.json` for counts and category metadata

Vite copies the public API files to `dist/api/v1/` during production builds.

## Current data counts

- 45 categories
- 123 categorized duas
- 10 languages
- Supplementary collection counts are provided in the generated API index.

The categorized counts do not include supplementary collections.

## Local commands

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

## Render deployment

Push the repository to GitHub and create a Render Blueprint from it. The included configuration installs development dependencies, runs the validating production build, and publishes `dist/` as a static site. The API is served at `/api/v1/duas.json` and `/api/v1/index.json` on the Render site domain. This project has no backend server or start command.

See [README.md](README.md) for project usage and [API.md](API.md) for API details.
