# Product implementation record

The 22-part product plan was implemented as sequential PRs in October 2026.
The first 21 are merged as PR53–PR73. This document is delivered in the final
maintenance PR. The original review plan remains a historical planning document.

| Plan | GitHub PR | Result |
| --- | --- | --- |
| 01–03 | 53–55 | Correct project routes, output availability contract and startup recovery |
| 04–09 | 56–61 | Own portal, searchable catalog, question-led details, result profiles, light previews and ChatGPT prompts |
| 10–12 | 62–64 | SQL/runtime scoring parity, provenance, local scenarios and missing-score interpretation |
| 13–15 | 65–67 | Explicit data exports, video formats/codecs, cancellation and six-scene source preflight |
| 16–18 | 68–70 | Publication sharing, commit-pinned files, touch/focus and reduced motion |
| 19–21 | 71–73 | Source health, page budgets, third template project and release gates |
| 22 | This PR | Fork boundaries, release procedure, migration, rollback and toolbar-free print/scenario controls and video scenario restoration |

## Verification evidence

The production app build and strict documentation build passed. All three
projects passed manifest and schema/reference validation. The built user-route
check verified 169 internal links, including project/video references pinned to
one revision. Page and preview budgets passed. Forty-six targeted tests passed
for scoring, source loading, output parsing, CSV, video, renderer readiness,
embed origin checks and rejection of broken publication contracts. SQL/runtime
scores were compared on 111 Utrecht neighbourhoods and 770 Rotterdam cells.

The public site was exercised through catalog search and the Utrecht project
route. Search persisted q=Utrecht and returned one project. The project opened
without the original 404. The data result screen showed the project title,
return link, format choice and explicit export action. With no renderable source,
export reported that analysis data was not ready, allowing retry.

All six unique source URLs responded successfully to bounded HTTP samples.
These checks do not establish complete browser data retrieval or tile rendering.
The review browser reported GPUInitializationError because WebGL2 is unavailable.

## Remaining manual acceptance

The implementation is merged, but the original plan's full acceptance is not
complete. A GPU-backed map/video playback, actual PNG/PDF/data/video downloads,
Safari/iPad validation, four-width visual measurements, screen-reader and contrast
checks remain to be performed. Binary exports remain available through existing
workspace adapters; the focused data export screen offers CSV and GeoJSON.
Video exports are silent. Video sessions preserve and restore local scenario
settings, and the legend now shows the actual continuous color stops. No generated voice-over, successful GPU recording or
fully verified accessibility claim is implied.
