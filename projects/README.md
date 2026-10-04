# Repository-driven GeoLibre projects

Each published spatial research project lives in its own directory:

```text
projects/<slug>/
├── project.geolibre
├── project.json
├── analysis.sql
├── sources.json
├── README.md
├── data/
└── exports/
```

The project directory is the reproducible source of truth. GeoLibre renders the
`project.geolibre` file. `analysis.sql` records the analytical logic.
`sources.json` records provenance. `project.json` drives the public catalog.

Use `projects/_template/` when starting a new project.

## Public launch URL

Published projects are opened by the fork-hosted web app through the raw GitHub
URL of the project file:

```text
https://equilibriumpress.github.io/geolibre-projects/demo/?url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/main/projects/<slug>/project.geolibre
```

Viewer mode:

```text
https://equilibriumpress.github.io/geolibre-projects/demo/?layout=viewer&url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/main/projects/<slug>/project.geolibre
```

Keep projects public-only. Never commit credentials, private URLs, signed URLs,
personal data, or local filesystem paths.


## Publication helper

Print the canonical URLs for a project with:

```bash
npm run projects:url -- <slug>
```

The helper emits the raw project URL, full workspace, read-only viewer, map-only
view, and GitHub source URL.


## Advanced Scenario Lab projects

A multi-criteria prioritisation project can additionally include:

```text
indicators.json
scenarios.json
```

`indicators.json` defines how raw attributes become comparable 0–100 scores.
`scenarios.json` defines named policy weight sets. See
`docs/scenario-lab-projects.md` for the contract.
