import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const base = new URL("../projects/norway-scenic-camper-route/", import.meta.url);

async function json(name: string) {
  return JSON.parse(await readFile(new URL(name, base), "utf8"));
}

describe("Norway scenic camper route project", () => {
  it("keeps the route, Story Map and vertical video connected", async () => {
    const [project, story, outputs] = await Promise.all([
      json("project.geolibre"),
      json("video-story.json"),
      json("outputs.json"),
    ]);

    assert.equal(project.primaryRenderer, "cesium");
    const route = project.layers.find((layer: { id: string }) => layer.id === "norway-camper-route");
    assert.ok(route);
    assert.equal(route.geojson.features[0].geometry.type, "LineString");
    assert.equal(route.geojson.features[0].properties.length_km, 104);

    const chapters = project.storymap.chapters;
    assert.equal(chapters.length, 4);
    assert.ok(chapters.every((chapter: { image?: string }) => Boolean(chapter.image)));

    assert.equal(story.preset, "tiktok");
    assert.equal(story.aspectRatio, "9:16");
    assert.equal(story.fps, 30);
    assert.equal(
      story.scenes.reduce((sum: number, scene: { durationMs: number }) => sum + scene.durationMs, 0),
      48_500,
    );

    const routeScene = story.scenes.find((scene: { routeLayerId?: string }) => scene.routeLayerId);
    assert.equal(routeScene.routeLayerId, "norway-camper-route");
    assert.equal(routeScene.routeFollow.samples, 12);

    const photoStops = story.scenes.filter(
      (scene: { sourceStoryChapterId?: string }) => Boolean(scene.sourceStoryChapterId),
    );
    assert.equal(photoStops.length, 4);
    const chapterIds = new Set(chapters.map((chapter: { id: string }) => chapter.id));
    assert.ok(photoStops.every((scene: { sourceStoryChapterId: string }) => chapterIds.has(scene.sourceStoryChapterId)));

    assert.equal(outputs.featured, "video");
    const videoOutput = outputs.outputs.find((output: { id: string }) => output.id === "video");
    assert.ok(videoOutput.requires.includes("media-recorder"));
  });
});
