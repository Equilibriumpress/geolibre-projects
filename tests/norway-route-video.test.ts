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

    assert.equal(project.primaryRenderer, "maplibre");
    assert.equal(project.preferences.map.terrainEnabled, true);
    const route = project.layers.find((layer: { id: string }) => layer.id === "norway-camper-route");
    assert.ok(route);
    assert.equal(route.geojson.features[0].geometry.type, "LineString");
    assert.equal(route.geojson.features[0].properties.length_km, 104);
    assert.equal(route.geojson.features[0].geometry.coordinates.length, 3608);
    assert.deepEqual(route.geojson, await json("route.geojson"));

    const chapters = project.storymap.chapters;
    assert.equal(chapters.length, 4);
    assert.ok(chapters.every((chapter: { image?: string }) => Boolean(chapter.image)));

    assert.equal(story.preset, "tiktok");
    assert.equal(story.aspectRatio, "9:16");
    assert.equal(story.fps, 30);
    assert.equal(
      story.scenes.reduce((sum: number, scene: { durationMs: number }) => sum + scene.durationMs, 0),
      27_000,
    );

    const routeScene = story.scenes.find((scene: { routeLayerId?: string }) => scene.routeLayerId);
    assert.equal(routeScene.routeLayerId, "norway-camper-route");
    const routeScenes = story.scenes.filter((scene: { routeLayerId?: string }) => scene.routeLayerId);
    assert.equal(routeScenes.length, 4);
    assert.equal(routeScene.routeFollow.startFraction, 0);
    for (let i = 0; i < routeScenes.length; i++) {
      assert.ok(routeScenes[i].routeFollow.endFraction > routeScenes[i].routeFollow.startFraction);
      if (i) assert.equal(routeScenes[i].routeFollow.startFraction, routeScenes[i - 1].routeFollow.endFraction);
      const index = story.scenes.indexOf(routeScenes[i]);
      assert.ok(story.scenes[index + 1].sourceStoryChapterId);
    }
    for (const chapter of chapters) {
      assert.ok(chapter.image.startsWith("https://equilibriumpress.github.io/GeoLibre/project-data/"));
      const image = await readFile(new URL(chapter.id + ".jpg", base));
      assert.equal(image[0], 0xff);
      assert.equal(image[1], 0xd8);
    }

    const photoStops = story.scenes.filter(
      (scene: { sourceStoryChapterId?: string }) => Boolean(scene.sourceStoryChapterId),
    );
    assert.equal(photoStops.length, 4);
    assert.equal(story.scenes.length, 13);
    assert.ok(story.scenes.every((scene: { caption?: string }) => !scene.caption));
    assert.equal(story.output.showSafeArea, false);
    assert.equal(story.output.includeBranding, false);
    const chapterIds = new Set(chapters.map((chapter: { id: string }) => chapter.id));
    assert.ok(photoStops.every((scene: { sourceStoryChapterId: string }) => chapterIds.has(scene.sourceStoryChapterId)));

    const textScenes = story.scenes.filter((scene: { headline?: string }) => Boolean(scene.headline));
    assert.deepEqual(textScenes.map((scene: { headline: string }) => scene.headline), [
      "104 km. Norway’s wildest camper road.",
      "Geiranger → Trollstigen",
      "Would you drive this?",
    ]);
    assert.equal(story.scenes[0].durationMs, 1200);
    assert.equal(story.scenes[0].camera.transitionMs, 0);
    assert.ok(story.scenes[0].image);
    assert.equal(story.scenes.at(-1).image, story.scenes[0].image);
    assert.equal(story.scenes.at(-1).durationMs, 500);

    assert.equal(outputs.featured, "video");
    const videoOutput = outputs.outputs.find((output: { id: string }) => output.id === "video");
    assert.ok(videoOutput.requires.includes("media-recorder"));
  });
});
