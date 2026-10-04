# Rotterdam output benchmark

This directory tests the publication outputs of the repository-authored
Investment Priority Lab from one shared project.

The source of truth remains `../project.geolibre`. Runtime-generated files
such as PNG, PDF, atlas pages, vector exports and video are deliberately not
committed after every run. They are generated from the current project so the
benchmark tests the actual browser export pipeline rather than stale binary
artifacts.

## Outputs

| Output | Benchmark |
| --- | --- |
| Interactive workspace | Main project URL |
| Viewer | Read-only project URL |
| Map-only | Embed-friendly project URL |
| Dashboard | 14 saved widgets, including all KPI aggregations plus histogram, scatter, bar, line, box, pie, selector and list |
| Story map | 5 saved chapters across the Rotterdam study area |
| PNG | Configured Print Layout, export at runtime |
| PDF | Configured Print Layout, export at runtime |
| Atlas | Result-layer atlas, score >= 80, sorted by priority |
| Data | GeoJSON, CSV, KML, KMZ, GeoParquet, GeoPackage and zipped Shapefile |
| SQL | `../analysis.sql` |
| Video | `video/rotterdam-priority-tour.json` plus Record Tour / Record Video |
| Standalone HTML | `html/index.html`, published with GitHub Pages |

## Runtime export principle

PNG, PDF, atlas and video depend on the browser's live canvas and therefore are
generated on demand. Data exports depend on the current calculated Scenario Lab
result and are also generated on demand. This ensures every export corresponds
to the currently selected scenario and weights.

## Video setup

Load `video/rotterdam-priority-tour.json` in Record Map Tour. It contains five
camera keyframes and is approximately 17 seconds before encoding overhead.

The browser chooses the supported MediaRecorder format. GeoLibre currently
prefers WebM codecs in browsers that support them. Treat MP4 availability as a
browser/codec capability rather than a guaranteed format.

## Standalone HTML

GitHub Pages publishes `html/index.html` at:

`https://equilibriumpress.github.io/geolibre-projects/outputs/rotterdam/`

The page embeds the public GeoLibre map-only viewer and the versioned project
URL. It contains no private data or credentials.
