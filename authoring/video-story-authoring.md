# Video Story authoring

GeoLibre treats short-form video as another project output alongside maps,
dashboards, stories, print layouts and datasets.

A repository-authored video project uses:

```text
video-story.json
outputs.json
project.geolibre
analysis.sql
sources.json
```

The video must remain traceable to the same map layers, scenarios, dashboard
widgets and analysis used by the other project outputs.

## ChatGPT authoring protocol

When a user asks for a TikTok, Reel, Short, route video or other project video:

1. Choose the analytical finding, route or spatial story before writing scenes.
2. Reuse project scenario ids, layer ids, widget ids and Story Map chapters.
3. Pick the appropriate render preset:
   - `tiktok`, `reel`, `short`: 1080 × 1920, 9:16.
   - `square`: 1080 × 1080.
   - `standard`: 1920 × 1080, 16:9.
4. Put the hook in the first scene and resolve it within roughly two seconds for
   short-form vertical video.
5. Prefer compact on-screen captions. A useful default is two to five words per
   visual beat; longer explanation belongs in `narration`.
6. Use `map`, `highlight`, `kpi`, `chart` and `comparison` scenes only
   when they add evidence rather than decoration.
7. Keep scenario changes explicit with `scenarioId` or `viewMode: consensus`.
8. End with a concrete CTA that points to the project's published outputs.
9. Do not invent statistics for the video. Every KPI/chart must resolve from a
   project layer or dashboard widget.
10. Store narration, captions and audio cues in Git with the timeline.
11. Do not commit copyrighted music or other media without an appropriate
    licence. `audio.music` is descriptive metadata unless a public/licensed
    asset is deliberately added.
12. Validate the project before merge.

## Scene pattern

A strong 30-second analytical social video commonly follows:

```text
0–2s    hook
2–6s    context map
6–10s   spatial highlight
10–14s  KPI / evidence
14–18s  scenario change
18–22s  chart / second lens
22–27s  consensus / conclusion
27–30s  CTA
```

The pattern is guidance, not a hard schema constraint.

## Browser preview and export

The video preview reads `video-story.json`, resolves Story Map camera references
and drives the live project. Scenario scenes can update the Investment Priority
Lab; KPI and chart scenes read the calculated project result.

Browser export composites the live map and video overlays onto a dedicated
canvas at the selected social resolution and records that canvas through
`MediaRecorder`.

Preview and recording use the same playback clock. Scene boundaries, cues,
camera transitions, overlays and export progress therefore resolve against one
timeline. A `fly` scene honors its authored `camera.transitionMs` in preview
and recording.

MP4 and WebM are explicit export choices. MP4 uses an H.264-capable
`MediaRecorder` path when the browser exposes one. Choosing MP4 never silently
falls back to WebM. If MP4 is unavailable, GeoLibre reports that limitation and
the user may explicitly select WebM.

## Reproducibility

A video should be reproducible from Git. Changing a project scenario or data
source does not silently rewrite `video-story.json`; update the story in a PR
when the narrative itself needs to change.

The video story may be rendered in multiple social presets without duplicating
the analytical timeline.

## Automatic story generation API

The composer and agent workflows share `createVisualStory(request)`. The request accepts an analytical objective, output format, verified findings and camera locations. The generator only arranges supplied evidence into scenes; it does not calculate or invent analytical results. This keeps ChatGPT-authored videos reproducible from the project data and SQL.

## 3D flyover presets

The composer includes engine-neutral camera presets for city overview, low flyover, orbit, route follow, terrain reveal, building reveal, data extrusion reveal, globe-to-city and city-to-detail. Presets marked Cesium are intended for terrain, 3D Tiles or globe-heavy scenes, while lighter 2.5D sequences remain suitable for MapLibre.


## Route video

A route video remains a normal GeoLibre project. Store the route as a GeoJSON
LineString layer in `project.geolibre` and reference that layer from a scene:

```json
{
  "id": "route-follow",
  "type": "map",
  "durationMs": 12000,
  "routeLayerId": "scenic-route",
  "routeFollow": {
    "samples": 10,
    "zoom": 11.5,
    "pitch": 70
  }
}
```

The video compiler samples the existing LineString by distance, derives camera
bearing from the geometry and expands the scene into camera segments while
preserving the authored duration. Do not duplicate the route coordinates in
`video-story.json`.

For a photo stop, create a Story Map chapter with its camera, title, text and
`image`, then reference it with `sourceStoryChapterId`. Video preview and
recording inherit the same chapter camera and image. Recording preloads chapter
images before capture so inaccessible media fails before the video starts.

A typical route project therefore needs only:

```text
project.geolibre
route.geojson
video-story.json
outputs.json
sources.json
VIDEO_REQUEST.md
```

ChatGPT should author and revise these project files rather than adding
route-specific application code.
