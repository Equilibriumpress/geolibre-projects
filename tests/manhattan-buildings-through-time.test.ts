import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const base = new URL("../projects/manhattan-buildings-through-time/", import.meta.url);

async function json(name: string) {
  return JSON.parse(await readFile(new URL(name, base), "utf8"));
}

describe("Manhattan Buildings Through Time project", () => {
  it("uses the native GeoLibre GeoLens time-slider project shape", async () => {
    const [project, manifest] = await Promise.all([
      json("project.geolibre"),
      json("project.json"),
    ]);

    assert.equal(manifest.status, "published");
    assert.ok(Math.abs(project.mapView.pitch - 59.5) < 1e-9);

    const buildings = project.layers.find((layer: { metadata?: { geolensDatasetId?: string } }) =>
      layer.metadata?.geolensDatasetId === "4a0bd0db-cd92-424a-8a2e-62d270ae918a"
    );
    assert.ok(buildings);
    assert.equal(buildings.type, "vector-tiles");
    assert.equal(buildings.metadata.sourceKind, "geolens-vector-tiles");
    assert.equal(buildings.metadata.timeBinding.property, "construction_year");
    assert.equal(buildings.metadata.timeBinding.cumulative, true);
    assert.equal(buildings.style.extrusionEnabled, true);
    assert.equal(buildings.style.extrusionHeightProperty, "height_roof");
    assert.match(buildings.style.vectorStyleExpression, /"era"/);

    // Repository contains no live credential. exp=1 is deliberately dead and
    // triggers GeoLibre's existing healRestoredGeoLensLayers() path.
    assert.match(buildings.source.tiles[0], /[?&]exp=1(?:&|$)/);
    assert.doesNotMatch(buildings.source.tiles[0], /[?&](?:sig|token|api_key)=/i);

    const slider = project.plugins.settings["maplibre-gl-time-slider"];
    assert.equal(slider.startDate, "1850-01-01T00:00:00.000Z");
    assert.equal(slider.endDate, "2025-01-01T00:00:00.000Z");
    assert.equal(slider.interval, 5);
    assert.equal(slider.granularity, "year");
    assert.equal(slider.loop, true);

    const geolensLayers = project.layers.filter(
      (layer: { metadata?: { sourceKind?: string } }) =>
        layer.metadata?.sourceKind === "geolens-vector-tiles"
    );
    assert.equal(geolensLayers.length, 3);
    assert.ok(geolensLayers.every(
      (layer: { source: { tiles: string[] } }) => /[?&]exp=1(?:&|$)/.test(layer.source.tiles[0])
    ));
  });

  it("contains no committed live tile signature or credential", async () => {
    const raw = await readFile(new URL("project.geolibre", base), "utf8");
    assert.doesNotMatch(raw, /[?&](?:sig|token|api_key)=/i);
  });
});
