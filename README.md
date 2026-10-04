# GeoLibre projects

Public research projects authored through ChatGPT and versioned in GitHub.

- [Project catalog](https://equilibriumpress.github.io/geolibre-projects/projects/)
- [Web app](https://equilibriumpress.github.io/geolibre-projects/demo/)
- Project files: `projects/<slug>/`
- Source provenance: `sources.json`; calculations: `analysis.sql`
- App source is maintained separately. This repository contains project and publication tooling, documentation, and public compiled app releases.

## Update a project

Follow AGENTS.md. Run `npm ci`, `npm run projects:validate`, `npm run projects:contracts`, and `npm run projects:catalog`. Submit a focused PR. The Pages workflow publishes each main revision.

## App distribution

`app-release.json` selects an immutable compiled web app release hosted in this public repository. Project publishing downloads that release without access to the app source repository. The initial migration bootstraps the release from the exact source commit while that repository is public. Once the release exists, the bootstrap is skipped.

App changes require a new compiled release and an updated `app-release.json`. From the authenticated app checkout, run `scripts/publish-public-app.sh` in this repository after building. No app-source read token is needed for routine project updates.

## Migration

See [migration record](docs/repository-migration.md). The app repository has not been detached or made private. Original shared URLs depend on the old Pages site until a hosting decision is made. New project links use this repository and its Pages site.

GeoLibre and its documentation are MIT licensed. See LICENSE. External data licenses remain recorded per source.
