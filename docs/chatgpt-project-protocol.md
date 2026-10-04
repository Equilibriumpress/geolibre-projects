# ChatGPT project authoring protocol

This fork supports a repository-first workflow in which a natural-language
research request becomes a versioned GeoLibre project through GitHub. A remote
MCP server is not required for this first stage.

## Input

A request should identify a spatial question, for example:

> Which Utrecht neighbourhoods combine a high share of residents aged 65+ with
> high population density?

A good request can also specify geography, year, preferred source, desired
outputs, classification method, or publication style.

## Authoring sequence

```text
research question
      ↓
public source selection
      ↓
sources.json
      ↓
analysis.sql
      ↓
derived data or live layer
      ↓
project.geolibre
      ↓
README
      ↓
catalog
      ↓
validation
      ↓
pull request
      ↓
GitHub Pages viewer
```

## Source selection

Prefer authoritative publishers such as national statistics offices,
municipalities, cadastral/open-data agencies, standards bodies, and official
OGC/ArcGIS services.

For every selected source, verify:

- public access
- stable HTTPS URL
- suitable license
- retrieval date
- relevant fields and geography
- browser suitability
- whether a snapshot is required for reproducibility

## Project authoring

Start from `projects/_template/`.

The manifest drives the catalog. The GeoLibre file drives the map. SQL documents
the analytical transformation. Provenance stays separate from both.

A project should be understandable without reading the chat that created it.

## Analytical transparency

For composite indicators, record the formula explicitly. If two variables use
different scales, normalize them before combining them and document the chosen
method.

For rankings or choropleths, explain the classification rule. Do not silently
replace missing values with zero unless zero is the correct substantive value.

## Publication

After authoring:

```bash
npm run projects:validate
npm run projects:catalog
```

Commit the project and regenerated catalog in the same pull request.

The catalog exposes full workspace, read-only viewer, map-only, and source-code
links.

## Updating an existing project

Treat updates as new analytical versions:

1. refresh source metadata
2. update SQL
3. update project data/layers
4. set `updated` in `project.json`
5. explain methodological changes in the README
6. regenerate catalog
7. validate
8. submit a focused PR

Git history provides the audit trail.
