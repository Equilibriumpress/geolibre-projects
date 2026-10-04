# Norway Scenic Camper Route

A MapLibre project for the Geiranger–Trollstigen route, with globe, terrain, the official route and four photo stops.

## Reproduce

`route.geojson` uses 3608 unchanged track coordinates from the official GPX linked in `sources.json`. The embedded route is identical. Its measured great-circle length is 105.556 km. The published official route length is 104 km.

Video sections use cumulative route-distance fractions to stop at the four viewpoints. Photos alternate with forward route travel, without returning from the route endpoint to its first stop. Camera position and bearing interpolate on the same playback clock in preview and recording.

Four resized, licensed JPEGs are stored with the project and published under `/GeoLibre/project-data/norway-scenic-camper-route/`. Sources and photo authors are in `sources.json`, Story Map text and video captions.

Open the project page to preview video, map or Story Map. MP4 and WebM are browser runtime exports, rather than prebuilt downloads. Check current road and ferry information before travel.

## GPX transformation

The source GPX includes a duplicated Gudbrandsjuvet–Trollstigen return loop and measures 155.387 km. Preserve the original in `official-route.gpx`. The canonical route retains `trkpt[0:2591] + trkpt[3814:]` using zero-based Python slices. Coordinates at indices 2590 and 3813, and both adjacent pairs, match exactly. Removing that loop avoids traversing the same section three times. It produces 3608 unchanged points measuring 105.556 km. `sources.json` records the original file hash.
