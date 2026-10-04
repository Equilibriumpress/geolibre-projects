# GeoLibre public projects

Public project files, SQL, data provenance and results authored through ChatGPT.

[Open the project website](https://equilibriumpress.github.io/GeoLibre/projects/).

The app and website source live in the private Equilibriumpress/GeoLibre repository. That repository builds and publishes the website, then the browser loads project files from this public repository.

## Update a project

Follow AGENTS.md. Run `npm ci`, `npm run projects:validate`, `npm run projects:contracts`, and `npm test`. Merge a focused PR, then trigger the private GeoLibre pages.yml workflow through the GitHub connection to publish the project update.

Project files: projects/<slug>/. SQL: analysis.sql. Sources: sources.json. Results: outputs.json. Preview: preview.png. Authoring protocols: authoring/.

The old /geolibre-projects/ website URL redirects to /GeoLibre/. No app bundles or website implementation are maintained here. External data licenses are recorded per source.
