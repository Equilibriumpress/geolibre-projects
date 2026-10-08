# Netherlands Buildings Through Time · Utrecht

This GeoLibre project uses the current Dutch BAG building stock to show how Utrecht's surviving buildings accumulate by recorded construction year.

The core sequence is:

`Netherlands → Utrecht → 1700 → 1850 → 1900 → 1950 → 2000 → present`

## Outputs

- **Buildings through time** — scalable BAG Vector Tiles with a cumulative Time Slider bound to `bouwjaar`.
- **How Utrecht grew** — Story Map chapters moving from national context to the historic centre, Kanaleneiland and Leidsche Rijn.
- **Building-age dashboard · central sample** — a bounded BAG Features sample for construction-year and use-function inspection. It is not a citywide count.
- **Utrecht grows · 9:16** — a vertical Video Story that filters the building layer cumulatively at the project milestones.
- **3D flyover** — a Cesium route from the Netherlands to Utrecht and the three focus areas, using the established 3DBAG LoD 2.2 3D Tiles endpoint.

## Data

The main source is the Kadaster / PDOK BAG OGC API. The `pand` schema exposes `bouwjaar`, `gebruiksdoel`, `geometry`, `identificatie` and `status`.

The main map uses PDOK's BAG WebMercator vector tiles so the project does not need to commit tens of thousands of building polygons.

PDOK's 3D Basisvoorziening is recorded as the official Dutch 3D reference. Its buildings/terrain collection is distributed through a CityJSON-oriented download/index workflow. GeoLibre's current browser flyover path is 3D Tiles, so the dedicated 3D output uses 3DBAG as the rendering companion rather than pretending the PDOK CityJSON index is a native 3D Tiles source.

## Interpretation

The timeline answers a narrow question: **when were the buildings that exist in today's BAG stock recorded as built?**

It does not reconstruct every historical building. A structure demolished before the current stock is absent. Buildings whose BAG status is `Pand gesloopt` are filtered from the main visual layer.

The focus areas are editorial waypoints, not analytical categories:

- **Binnenstad** — historic core and older surviving stock.
- **Kanaleneiland** — post-war expansion.
- **Leidsche Rijn** — recent large-scale urban expansion.

## Dashboard scope

The dashboard layer is deliberately called a sample. It loads at most 1,000 BAG pand features from a small central-Utrecht bounding box. It exists to make the dashboard useful without downloading the full municipality building stock into the browser.

Do not quote its counts as Utrecht-wide statistics.

## Reproduce

1. Inspect `sources.json`.
2. Use `analysis.sql` for the construction-year classification.
3. Open `project.geolibre` for the interactive time map, dashboard and Story Map.
4. Open `flyover.geolibre` for the Cesium 3D workspace.
5. Use `video-story.json` for the 9:16 timeline.
6. Use `flyover-story.json` for the 3D camera sequence.

## Runtime checks

Repository validation proves the file contracts and cross-file references. A final release check should still verify PDOK tile source-layer/property availability, Time Slider filtering, Cesium tile readiness and MP4 codec support in the target browser.
