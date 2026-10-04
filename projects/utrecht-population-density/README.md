# Population density in Utrecht

Question: which Utrecht neighbourhoods have the highest population density?

This small reference project was assembled from the repository template using
existing source-layer, indicator and dashboard configuration. It adds no
project-specific application code and intentionally offers only map, dashboard,
data and SQL outputs.

CBS/PDOK provides 2025 neighbourhood geometry and residents/km². The query uses
the Utrecht bounding box and municipality code GM0344. Negative or missing
values are excluded from ranking. Ties share an average percentile rank. A single
valid observation receives rank score 50. Higher scores mean higher density,
not poorer conditions. Original values remain in identify and exports.

The input is remote-first and live. Record the retrieval date and source revision
when repeating the analysis. SQL is generated from the same one-indicator
configuration. Sources, units, limitations and publication version are visible
on the generated page. The geometry preview describes the extent, not ranks.

To update through ChatGPT, inspect REQUEST.md, sources.json and analysis.sql,
then validate and regenerate the catalog. A GPU browser still needs to verify the
interactive map and saved outputs before claiming end-to-end visual validation.
