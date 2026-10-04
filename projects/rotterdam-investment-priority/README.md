# Rotterdam Investment Priority Lab

## Research question

Which 500 × 500 metre areas in Rotterdam's urban core remain high priorities
under different public-investment perspectives?

The project is designed to test multi-criteria scenario analysis rather than to
claim one objectively correct investment ranking.

## Spatial unit

The analysis uses the official CBS 500 × 500 metre statistical grid directly.
No neighbourhood statistic is redistributed across smaller cells.

The pilot extent is the Rotterdam urban core bounded approximately by:

- west 4.40
- south 51.87
- east 4.60
- north 51.99

The ranking is therefore relative to the grid cells loaded inside this extent.

## Data

The project reads the 2024 CBS Vierkantstatistieken 500m collection through the
PDOK OGC API. The source combines geometry with demographics, income, social
security and distance-to-service variables.

Provider negative sentinel values are treated as missing. They are never
converted to zero.

## Indicators

The model includes eleven transparent indicators:

- population pressure
- share aged 65+
- share aged 0-14
- low-income households
- residents receiving benefits
- single-parent households
- average household income
- distance to a GP practice
- distance to a primary school
- distance to a large supermarket
- distance to a train station

Every valid indicator is percentile-ranked from 0 to 100 inside the current
analysis extent. Indicators where a lower raw value means higher priority, such
as household income, have their percentile direction reversed.

## Scenarios

Five policy perspectives are included:

1. Balanced investment
2. Healthy ageing
3. Family access
4. Social vulnerability
5. Service pressure

The Investment Priority Lab panel lets you switch scenarios, change weights and
show a consensus view across all scenarios.

## Confidence

A priority score and a confidence score are kept separate. Missing weighted
indicators reduce confidence instead of silently counting as zero. A cell can
therefore have a high priority score with lower confidence, which signals that
the ranking should be treated cautiously.

## Consensus

The lab calculates every scenario and records how often a grid cell belongs to
a scenario's top decile. The consensus score is the mean of available scenario
scores.

This highlights places that stay important when policy weights change.

## Interpretation

The scores are descriptive prioritisation aids. They are not causal estimates,
health-risk predictions or automatic funding decisions.

A high score means that a cell ranks high on the variables selected by the
active scenario relative to the other cells in this project extent.

## Reproduce

- `indicators.json` defines raw variables and score directions.
- `scenarios.json` defines policy weights.
- `analysis.sql` reproduces the default Balanced investment scenario.
- `sources.json` records provenance and publication context.
- `project.geolibre` activates the built-in Investment Priority Lab.

The interactive panel calculates all configured scenarios locally in the
browser.


## Publication hub

GitHub Pages generates a public project page from `project.json`,
`outputs.json`, the GeoLibre project, source provenance and video story.

The publication page is the audience-facing hub for the interactive map,
dashboard, Story Map, print/atlas outputs, data exports, standalone embed,
methods and social-video variants. GeoLibre remains the analysis and authoring
workspace behind those outputs.

The single `video-story.json` timeline can be rendered as TikTok, Instagram
Reel, YouTube Short or a 16:9 explainer without duplicating the analytical
story.

## SQL and runtime parity

The SQL now derives its indicators and default weights from the saved runtime configuration. Tied values receive the average zero-based rank, with 50 for a single valid value. Each component ranks its valid observations separately. Missing weighted components reduce confidence, while available weights determine the priority mean. No positive-population filter is added beyond the published source query. Run `node scripts/build-project-sql.mjs rotterdam-investment-priority` after changing default indicators or weights.
