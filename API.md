# Static JSON API

The app and API are generated from the same source data during `npm run build`. This is a static JSON API; it requires no server runtime, database, credentials, or environment variables.

## Deploy on Render

Push the repository to GitHub and connect it to Render as a **Static Site**. The included `render.yaml` configures the build command (`npm ci --include=dev && npm run build`) and publishes `dist/`. For manual setup, use the same build command and set the publish directory to `dist`.

Use the Render service URL as the origin, for example:

```text
https://<your-render-service>.onrender.com
```

| Endpoint | Description |
| --- | --- |
| `/api/v1/index.json` | Generated API metadata, category summary, and collection counts |
| `/api/v1/duas.json` | Full category data, duas, languages, and supplementary collections |

For local development, run `npm run dev`. The endpoints are served at `http://localhost:3000/api/v1/`.

## Response shape

`duas.json` is the complete API response. `total_categories` and `total_duas` count categorized records; full supplementary data is included under `collections`.

```json
{
  "api_version": "1.0.0",
  "description": "Islamic duas, adhkar, and supplementary collections",
  "total_categories": 45,
  "total_duas": 123,
  "supported_languages": ["en", "ar", "ur"],
  "languages": [],
  "categories": [
    {
      "id": "morning-evening",
      "icon": "🌅",
      "color": "amber",
      "gradient": "from-amber-400 to-orange-500",
      "bg": "bg-amber-50",
      "border": "border-amber-200",
      "text": "text-amber-700",
      "name": { "en": "Morning & Evening" },
      "duas": [
        {
          "id": "me-1",
          "title": { "en": "Morning Remembrance" },
          "arabic": "Arabic text",
          "translation": { "en": "Translation" },
          "reference": "Source reference",
          "times": 1
        }
      ]
    }
  ],
  "collections": {
    "asma_ul_husna": [],
    "asma_ul_anbiya": [],
    "rabbana_duas": [],
    "all_rabbana_duas": [],
    "comprehensive_rabbana_duas": [],
    "all_salawats": [],
    "prophets_with_duas": [],
    "prophet_names_with_meanings": [],
    "famous_salawat": [],
    "qaseedatul_burdah_chapter_1": {},
    "additional_important_texts": []
  }
}
```

Each categorized dua uses `times` for its recommended recitation count. Supported language codes and all counts are generated from the app's actual data.

## Example

```js
const response = await fetch('https://<your-render-service>.onrender.com/api/v1/duas.json');
if (!response.ok) throw new Error(`API request failed: ${response.status}`);
const api = await response.json();

const morning = api.categories.find(category => category.id === 'morning-evening');
console.log(api.total_categories, api.total_duas, morning?.duas);
console.log(api.collections.asma_ul_husna);
```

The API is served from the same origin as the website. To allow a separate app on another domain to fetch it in browsers, add a custom response header in the Render Dashboard: open the static site **Settings → Custom Headers**, add path `/api/*`, header `Access-Control-Allow-Origin`, and set its value to the exact origin of the main app (for example `https://app.example.com`). Render static sites configure headers in the dashboard, not in `render.yaml`; do not use `*` if you can specify the consuming app's origin.

## Data integrity and updates

Do not edit generated `src/data/catalog.json` or `public/api/v1/*.json` directly. Update the source data under `src/data/`, then run:

```sh
npm ci
npm run typecheck
npm run build
```

The build validates required category/dua fields, globally unique category and dua IDs, positive integer recitation counts, and complete 99-name and 25-prophet lists. It then generates the app catalog and both API files. Validation errors stop the build, preventing an incomplete API from being deployed.
