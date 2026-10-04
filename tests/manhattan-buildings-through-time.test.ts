import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const base = new URL("../projects/manhattan-buildings-through-time/", import.meta.url);

async function json(name: string) {
  return JSON.parse(await readFile(new URL(name, base), "utf8"));
}

describe("Manhattan Buildings Through Time project", () => {
  it("keeps the official time-story semantics on stable public sources", async () => {
    const [project, manifest] = await Promise.all([
      json("project.geolibre"),
      json("project.json"),
    ]);

    assert.equal(manifest.status, "published");
    assert.equal(project.mapView.pitch, 59.5);

    const buildings = project.layers.find((layer: { id: string }) => layer.id === "manhattan-buildings");
    assert.ok(buildings);
    assert.equal(buildings.metadata.timeBinding.property, "construction_year");
    assert.equal(buildings.metadata.timeBinding.cumulative, true);
    assert.equal(buildings.style.extrusionEnabled, true);
    assert.equal(buildings.style.extrusionHeightScale, 0.3048);
    assert.match(buildings.source.url, /^https:\/\/data\.cityofnewyork\.us\//);
    assert.doesNotMatch(buildings.source.url, /[?&]exp=/);

    const slider = project.plugins.settings["maplibre-gl-time-slider"];
    assert.equal(slider.startDate, "1850-01-01T00:00:00.000Z");
    assert.equal(slider.endDate, "2025-01-01T00:00:00.000Z");
    assert.equal(slider.granularity, "year");
    assert.equal(slider.interval, 5);
    assert.equal(slider.loop, true);

    assert.equal(project.layers.some((layer: { id: string }) => layer.id === "mta-subway-lines"), true);
    assert.equal(project.layers.some((layer: { id: string }) => layer.id === "mta-subway-stations"), true);
  });

  it("contains no temporary signed GeoLens tile URL", async () => {
    const raw = await readFile(new URL("project.geolibre", base), "utf8");
    assert.doesNotMatch(raw, /datasets\.geolibre\.app\/api\/tiles\/.*[?&]exp=/);
  });
});
