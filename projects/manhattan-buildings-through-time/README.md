# Manhattan Buildings Through Time

This project brings the official GeoLibre **Manhattan Buildings Through Time** showcase into the repository project catalog.

It is deliberately not a binary copy of the upstream asset. The upstream project currently contains generated GeoLens vector-tile URLs with expiry parameters. This version keeps the same core visual idea and time configuration but loads the authoritative public NYC and MTA sources directly.

## What it shows

- Manhattan buildings extruded from the NYC `height_roof` field.
- Building color grouped into broad construction eras.
- A cumulative GeoLibre Time Slider from **1850 to 2025** in five-year steps.
- MTA subway lines and stations as geographic context.
- The same pitched 3D Manhattan framing used by the official showcase.

Open the project and press **Play** on the Time Slider. The filter begins with the oldest surviving buildings in the current footprint dataset and accumulates later construction years until the present-day skyline is visible.

## Relationship to the official example

Official GeoLibre project:

https://github.com/opengeos/geolibre-assets/blob/main/projects/manhattan-buildings-through-time.geolibre.json

Official full-quality WebM reference render:

https://assets.geolibre.app/demos/nyc-buildings.webm

The upstream example is the visual and functional reference. This repository copy replaces its expiring hosted tile requests with source queries against NYC Open Data and New York State/MTA Open Data.

## Interpretation

This is a visualization of **today's recorded building footprints by recorded construction year**. It should not be read as a complete historical skyline for each date: buildings demolished before the current footprint dataset are absent.

## Reproduction

`analysis.sql` records the exact NYC source window and the era classification. `sources.json` records the upstream GeoLibre example and the authoritative datasets.
