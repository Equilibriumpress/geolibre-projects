# Rotterdam Output Benchmark

The Rotterdam Investment Priority Lab is the reference project for testing the
fork's publication and export outputs from one live analysis.

## Open the project

- Workspace: https://equilibriumpress.github.io/geolibre-projects/demo/?url=https%3A%2F%2Fraw.githubusercontent.com%2FEquilibriumpress%2FGeoLibre%2Fmain%2Fprojects%2Frotterdam-investment-priority%2Fproject.geolibre
- Viewer: https://equilibriumpress.github.io/geolibre-projects/demo/?layout=viewer&url=https%3A%2F%2Fraw.githubusercontent.com%2FEquilibriumpress%2FGeoLibre%2Fmain%2Fprojects%2Frotterdam-investment-priority%2Fproject.geolibre
- Map-only: https://equilibriumpress.github.io/geolibre-projects/demo/?maponly&url=https%3A%2F%2Fraw.githubusercontent.com%2FEquilibriumpress%2FGeoLibre%2Fmain%2Fprojects%2Frotterdam-investment-priority%2Fproject.geolibre
- Standalone HTML: https://equilibriumpress.github.io/geolibre-projects/outputs/rotterdam/

The Investment Priority Lab panel contains an **Output benchmark** section. Use
that section as the single starting point for the tests below.

## Interactive map

Use **Map-only view** to open an embed-friendly map. The project keeps its map
position, result layer, source provenance, legend and Scenario Lab settings.

## Dashboard

Choose **Dashboard**. The project stores 14 widgets covering:

- count, sum, mean, min, max and median KPI indicators
- histogram
- scatterplot
- bar chart
- line chart
- boxplot
- pie chart
- selector
- ranked list

The selector cross-filters the other dashboard widgets bound to the result
layer. The result layer itself also exposes two map quick filters for priority
score and confidence score, so the interactive map can be narrowed independently.

## Story map

Choose **Story Map** to edit the saved five-chapter narrative or **Present
story** to start the scroll-driven presentation. The chapters cover the full
study area, central Rotterdam, Rotterdam South, west/port-side areas and the
consensus interpretation.

The Story Map editor can export its own standalone HTML and PDF handout.

## PNG and PDF

Choose **PNG / PDF layout**. The project already carries a complete A4 landscape
Print Layout with:

- title and subtitle
- legend
- scale bar
- north arrow
- attribution
- priority colorbar
- ranked attribute table
- consensus-frequency chart
- project information block

Use the layout's export controls to save PNG or PDF from the live map.

## Atlas / map series

Choose **Atlas / map series**. The same saved Print Layout is configured for the
Investment Priority result layer and selects cells with:

`priority_score >= 80`

Pages are sorted by priority score and named with the CBS 500 metre grid id.
The atlas can be exported as a multi-page PDF or as per-page map images.

## Data export

The Output benchmark section exports the live calculated result in:

- GeoJSON
- CSV
- KML
- KMZ
- GeoParquet
- GeoPackage
- zipped Shapefile

These exports include the current `priority_score`, `confidence_score`,
`consensus_score`, scenario scores and indicator contributions.

## SQL

The transparent analytical definition remains versioned at:

`projects/rotterdam-investment-priority/analysis.sql`

`indicators.json` and `scenarios.json` define the browser-side Scenario Lab
model.

## Video

Choose **Record video** for a free-form canvas recording.

Choose **Camera tour** for a preloaded camera animation. Its five keyframes are
derived from the saved Story Map chapters, so the tour opens ready to record.
The reusable setup is also published at:

https://equilibriumpress.github.io/geolibre-projects/outputs/rotterdam/video/rotterdam-priority-tour.json

GeoLibre records with the codecs supported by the current browser. WebM is the
normal browser target in the current recorder. MP4 availability depends on the
browser's MediaRecorder support.

## Standalone HTML

Choose **Standalone HTML** to download a self-contained HTML wrapper containing
the current embedded project.

A fixed public benchmark version is also deployed with Pages:

https://equilibriumpress.github.io/geolibre-projects/outputs/rotterdam/

This output is deliberately separate from the Story Map HTML export. It tests a
general embedded GeoLibre project while Story Map HTML tests a narrative export.
