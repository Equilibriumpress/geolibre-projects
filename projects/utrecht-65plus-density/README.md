# Ageing and population density in Utrecht

## Research question

Which Utrecht neighbourhoods combine a high share of residents aged 65 or older
with high population density?

## Data

The project uses the public CBS Wijken en Buurten 2025 neighbourhood layer
served through the PDOK OGC API Features service. The layer contains both the
neighbourhood geometry and the indicators used here.

The live map request is limited to a bounding box around Utrecht for browser
performance. The project then applies a persistent filter for municipality code
`GM0344`.

## Method

`analysis.sql` preserves the source extent and treats invalid CBS sentinel values as missing. It calculates two within-Utrecht average-tie percentile ranks:

1. percentage of residents aged 65 or older
2. population density in residents per square kilometre

The final `ageing_density_index` is the equal-weight mean of both percentile
ranks, scaled from 0 to 100.

A high average indicates a high combined rank relative to other Utrecht neighbourhoods. One high component also raises the mean. Inspect both component values. The indicator is descriptive. It is
not a health-risk score and does not include income, housing quality, heat,
mobility, care demand, or other vulnerability dimensions.

## GeoLibre project

The saved project opens the source neighbourhood layer, filters it to Utrecht,
configures Identify/popups, and adds dashboard histograms for the two source
variables.

The SQL file is the reproducible analytical definition of the combined
indicator. Run it in the GeoLibre SQL workspace to create the derived result
layer and style `ageing_density_index` as a graduated choropleth.

## Open

Workspace:

https://equilibriumpress.github.io/geolibre-projects/demo/?url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/main/projects/utrecht-65plus-density/project.geolibre

Read-only viewer:

https://equilibriumpress.github.io/geolibre-projects/demo/?layout=viewer&url=https://raw.githubusercontent.com/Equilibriumpress/geolibre-projects/main/projects/utrecht-65plus-density/project.geolibre

## Reproduce

1. Open the workspace link.
2. Open the SQL Workspace.
3. Run `analysis.sql`.
4. Add the query result to the map.
5. Apply a graduated style to `ageing_density_index`.
6. Compare the result with the two dashboard distributions.


## 30-second Visual Story / Flyover test

This project is also the end-to-end test case for GeoLibre's Visual Story /
Flyover workflow.

The saved project activates the Investment Priority Lab with exactly the same
two indicators as `analysis.sql`:

- population density
- share of residents aged 65+

Both receive a weight of 0.50. The PDOK request is filtered server-side to
municipality code `GM0344`, so the runtime percentile ranking is calculated
only from Utrecht neighbourhoods.

`video-story.json` is a 30.0 second vertical 1080 × 1920 story at 30 fps. It
tests:

- pitched and bearing-aware flyover cameras
- city overview to detail transitions
- the runtime ageing + density result layer
- a score >= 80 highlight
- timed layer cues and annotations
- source attribution
- 20 Mbps MP4-first / WebM-fallback browser export

The three close-up camera passes deliberately describe city sectors rather than
claim that a named neighbourhood is in the top three. The actual high-score
polygons come from the live analysis result, so the visual remains tied to the
current CBS/PDOK source instead of hard-coding a ranking into the narration.


## Project page flyover entry

The publication page exposes **3D Flyover video** directly after the interactive
map. The button is a video deep-link, so GeoLibre loads the project and
automatically opens the Visual Story / Flyover player with this project's
`video-story.json`. No manual navigation through the workspace is required.


## Globe → Nederland → Utrecht → 3D → Overvecht → data

The project page now exposes a dedicated showcase output that opens
`flyover.geolibre` instead of the normal analytical workspace. This keeps the
main Utrecht project MapLibre-first while the showcase starts directly in
Cesium.

The six scenes are:

1. Globe
2. Nederland
3. Utrecht
4. 3D buildings — public 3DBAG LoD 2.2
5. Overvecht
6. Data layer — CBS Utrecht neighbourhoods

The output deep-link also loads `globe-utrecht-3d-story.json`, so the Visual
Story / Flyover player opens immediately in the correct workspace.

## SQL and runtime parity

The SQL now derives its indicators and default weights from the saved runtime configuration. Tied values receive the average zero-based rank, with 50 for a single valid value. Each component ranks its valid observations separately. Missing weighted components reduce confidence, while available weights determine the priority mean. No positive-population filter is added beyond the published source query. Run `node scripts/build-project-sql.mjs utrecht-65plus-density` after changing default indicators or weights.


### Flyover verification status

The player now checks each scene's camera and visible sources before recording.
A source failure names the scene and stops the export. Preparation and recording
restore the original camera. Buildings in the globe showcase are real 3DBAG
LoD 2.2 geometry. Any extrusion in the separate analysis flyover is a schematic
indicator visualization, not surveyed building height.

The six-camera configuration, Overvecht coordinates, source version and layer
references are checked automatically. A successful GPU playback and exported
video still require manual verification on Chrome and Safari/iPad. The cloud
review browser does not provide working WebGL2. Do not treat configuration tests
or a visible export button as proof of rendered frames.
