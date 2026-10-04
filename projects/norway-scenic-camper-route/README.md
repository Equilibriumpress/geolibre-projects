# Norway Scenic Camper Route · Geiranger–Trollstigen

This project tests GeoLibre as a repository-authored short-form route-video renderer.

The route follows Norwegian Scenic Route Geiranger–Trollstigen, published as 104 km by Norwegian Scenic Routes. The official route includes the Eidsdal–Linge ferry and viewpoints such as Flydalsjuvet, Ørnesvingen, Gudbrandsjuvet and Trollstigen.

## Output

The featured output is a 9:16 video story:

1. globe → Western Norway
2. route overview
3. geometry-driven route follow
4. Flydalsjuvet photo stop
5. Ørnesvingen photo stop
6. Gudbrandsjuvet photo stop
7. Trollstigen photo stop
8. route overview / CTA

The same project also opens as an interactive 3D map and a Story Map.

## Route geometry

`route.geojson` and the embedded route layer contain a simplified authoring line through the official endpoints and published viewpoint coordinates. It is intended for the GeoLibre flyover demo, not turn-by-turn navigation. The official GPX download is recorded in `sources.json` and should replace the simplified line when an exact GPX snapshot is imported.

## Media

Story Map images come from Wikimedia Commons. Author, file page and licence are recorded in `sources.json`. Runtime image URLs use direct `upload.wikimedia.org` files instead of Commons redirect URLs so Safari can preload them with canvas/CORS access before recording.

## Travel use

The route has seasonal closures and a ferry crossing. Road openings, weather and ferry times must be checked against current Norwegian road information before a real trip.
