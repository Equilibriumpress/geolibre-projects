# Public GeoLibre research projects

This repository owns public project files, data provenance, SQL, outputs, preview images and project authoring checks. The private Equilibriumpress/GeoLibre repository owns app source, website source and deployment. Do not add app bundles, app releases, website templates or site generators here.

## Create or update a project

1. Restate the spatial question, place, year and desired outputs.
2. Prefer authoritative public HTTPS sources with browser access.
3. Create projects/<slug>/ from projects/_template/.
4. Record publisher, URL, retrieval date, role and license in sources.json.
5. Keep calculations deterministic and readable in analysis.sql. Explain thresholds, joins, denominators, classification, ranking and missing values.
6. Create a valid project.geolibre using authoring/project-format.md.
7. Document interpretation, assumptions, limitations and reproduction in the project README.
8. Register useful outputs in outputs.json. Featured identifies one main action. Runtime exports must not be described as prebuilt downloads.
9. Save previews as projects/<slug>/preview.png.
10. Run npm run projects:validate, npm run projects:contracts and npm test. Submit a focused PR.
11. After merge, trigger workflow_dispatch for pages.yml in Equilibriumpress/GeoLibre through the GitHub connection. This publishes the current public project revision.

## Public data rules

Public data only. Never commit API keys, tokens, signed URLs, private data or local paths. Prefer live authoritative sources where stable. Record small snapshots when needed for reproducibility. Use external cloud-native files for large datasets. Keep source fields available for audit.

## GeoLibre rules

Prefer existing GeoLibre functions. URL-backed vector layers must use the supported persisted Vector Layer restore shape. Do not use a plain geojson layer with only source.url. Set an appropriate map extent. Add dashboard, story and print settings only when useful for the question.

## Scenario Lab

Add indicators.json and scenarios.json for weighted spatial analysis. Use the source-supported statistical unit. Preserve sentinel and missing values as missing. Define indicator direction, record data year and confidence, and reproduce the runtime formula in analysis.sql. Offer materially different scenarios when comparison serves the question.

## Video Story

Follow authoring/video-story-authoring.md. Register video-story.json in outputs.json. Reuse actual layer, scenario, widget and story chapter IDs. Never invent KPI values. Vertical formats use 1080x1920. Avoid unlicensed audio. Store captions and narration separately from actual audio. Validate scenes and references.

## Publication

Only published projects appear in the catalog. The private website build pins public project files to the public repository SHA and records its own app SHA independently. Never publish raw GitHub URLs to the private app repo. The website is https://equilibriumpress.github.io/GeoLibre/. The former /geolibre-projects/ Pages endpoint contains redirects only.

A visible export button does not prove a saved export. Report GPU, Safari, physical-device and saved-file checks as pending when not performed.
