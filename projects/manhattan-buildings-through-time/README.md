# Manhattan Buildings Through Time

This project brings the official GeoLibre **Manhattan Buildings Through Time** showcase into the repository project catalog.

It uses the official GeoLibre project structure and GeoLens vector-tile datasets. The repository stores only non-secret expired `exp=1` bootstrap tile URLs. On project restore, GeoLibre's existing GeoLens integration mints fresh public tile URLs and keeps them refreshed. This preserves the fast upstream rendering path without committing credentials.

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

The upstream example is the visual and functional reference. This repository copy keeps the same GeoLens dataset IDs, source layers, 3D styling, `era` categories and Time Slider binding. Only the short-lived tile URL itself is replaced by an expired non-secret bootstrap value that GeoLibre heals at runtime.

## Interpretation

This is a visualization of **today's recorded building footprints by recorded construction year**. It should not be read as a complete historical skyline for each date: buildings demolished before the current footprint dataset are absent.

## Reproduction

`analysis.sql` records the exact NYC source window and the era classification. `sources.json` records the upstream GeoLibre example and the authoritative datasets.
