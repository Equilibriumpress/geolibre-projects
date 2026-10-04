# Agent instructions for this fork

This repository stays close to upstream GeoLibre. Treat the GeoLibre engine as
upstream-owned unless the requested feature cannot be implemented in the thin
repository project layer.

## Primary workflow

For a request to create a spatial research project:

1. Restate the research question in operational terms.
2. Find authoritative public sources.
3. Prefer stable HTTPS, browser-accessible sources.
4. Create `projects/<slug>/` from `projects/_template/`.
5. Record every source in `sources.json`.
6. Put analytical logic in `analysis.sql`.
7. Create a valid `project.geolibre` using the current GeoLibre project format.
8. Write a concise project README with method, assumptions, interpretation, and reproduction steps.
9. Update the public catalog with `npm run projects:catalog`.
10. Validate with `npm run projects:validate`.
11. Keep changes scoped to the project unless infrastructure changes are required.
12. Submit the work through a small pull request.

## Data rules

- Public data only.
- Never commit API keys, tokens, signed URLs, private data, or local paths.
- Prefer live authoritative sources when stable.
- Use repository snapshots for small derived results or reproducibility.
- Use external cloud-native files for large datasets.
- Record publisher, URL, retrieval date, role, and license when known.

## SQL rules

- Keep `analysis.sql` readable and deterministic.
- Document joins, filters, denominators, missing-value handling, normalization,
  ranking, classification, and derived indicators.
- Avoid opaque constants. Explain thresholds in comments.
- Keep raw source fields when useful for auditability.

## GeoLibre rules

- Use the current project schema documented in `docs/project-format.md`.
- Prefer URL-backed layers or small embedded GeoJSON for public projects.
- For URL-backed vector layers, use GeoLibre's persisted Vector Layer restore shape (`metadata.sourceKind` = `maplibre-gl-vector` with `externalNativeLayer: true`, or the adopted variant). A plain `geojson` layer with only `source.url` will list in the project but render no features after reopen.
- Use a map extent appropriate to the research question.
- Add useful startup interaction such as Identify when supported.
- Add dashboard, story map, or print-layout configuration only when it serves
  the question.
- Do not fork or replace existing GeoLibre functionality without need.

## Publication URLs

Workspace:

```text
https://equilibriumpress.github.io/geolibre-projects/demo/?url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/<publication-sha>/projects/<slug>/project.geolibre
```

Read-only viewer:

```text
https://equilibriumpress.github.io/geolibre-projects/demo/?layout=viewer&url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/<publication-sha>/projects/<slug>/project.geolibre
```

Map only:

```text
https://equilibriumpress.github.io/geolibre-projects/demo/?maponly&url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/<publication-sha>/projects/<slug>/project.geolibre
```

## Upstream discipline

Before changing application code, check whether upstream already provides the
needed feature. Keep fork-specific additions under `projects/`, `scripts/`,
and fork documentation wherever practical.


## Scenario Lab projects

When a request asks for a weighted spatial prioritisation or policy scenario:

1. Add `indicators.json` and `scenarios.json`.
2. Prefer a source-supported statistical unit. Do not invent fine spatial
   precision by copying coarse-area values onto a finer grid.
3. Define the direction of every indicator explicitly.
4. Treat provider sentinel values and missing values as missing, never as zero.
5. Keep the weighting model transparent and reproduce its formula in
   `analysis.sql`.
6. Configure at least two materially different scenarios when comparison is part
   of the research question.
7. Record source year and quality for confidence scoring.
8. Use the built-in Investment Priority Lab plugin state in
   `project.geolibre` once that plugin is available.


## Video Story authoring

When a user asks for a TikTok, Reel, Short, explainer, or other project video:

1. Treat video as a first-class project output, not a detached script.
2. Create or update `video-story.json` and register the video in `outputs.json`.
3. Reuse real project layer ids, Story Map chapter ids, scenario ids, and
   dashboard widget ids. Do not duplicate or invent analytical results.
4. Use `tiktok`, `reel`, or `short` for 1080×1920 vertical output,
   `square` for 1080×1080, and `standard` for 1920×1080.
5. For short-form vertical video, put the hook in the first 1–2 seconds and keep
   on-screen captions compact; narration may carry the longer explanation.
6. Prefer a sequence of context map → spatial highlight → KPI/evidence →
   scenario change → chart/comparison → consensus/conclusion → CTA when it
   matches the research question.
7. Store `caption`, `narration`, and optional `audioCue` in the scene.
8. Never invent KPI values; video evidence must resolve from the live project.
9. Do not commit unlicensed music. Audio fields are metadata unless a licensed
   asset is intentionally added.
10. Validate and preview the video story before merge.

See `docs/video-story-authoring.md` for the full protocol.


## Research publication contract

- Only status `published` appears in the public catalog. A draft is not a release.
- Register each result in outputs.json. Featured identifies the sole main action.
- Availability, action and requirements must describe actual behavior. A runtime
  export is not a prebuilt download. Register only outputs useful for the question.
- Preserve missing indicator values. Local weights must remain identifiable and
  resettable. SQL and runtime scoring must agree on ties and missing weights.
- Generate links through scripts/publication-config.mjs. The Pages build pins
  project, video and source-file URLs to GITHUB_SHA and publishes publication.json.
- Live remote data is not an immutable snapshot. Do not call configuration hashes
  data hashes. Record actual retrieval dates and licenses separately.
- Run projects:validate, projects:contracts and projects:catalog for project edits.
  After building the site and demo, run projects:routes and the page budget check.
- A visible export button does not verify an exported file. Report GPU, Safari,
  physical-device and saved-file checks as pending if they could not be performed.
- For video, check each scene's source readiness and keep narration-script labels
  separate from audio. Never label WebM as MP4. Cancellation must restore view.

See docs/fork-maintenance.md for release, rollback and upstream checks.


## Repository separation

This public repository is the canonical home of projects. Do not add application engine source, credentials, or private development records. The app source lives in Equilibriumpress/GeoLibre. Publish only compiled web assets as releases. `app-release.json` locks the app revision independently of the project revision. Routine project publishing must work without reading the app source repository.
