-- Population density in Utrecht
-- Generated from the published indicator definitions and default scenario: Population density.
-- Ties use average rank. A single valid observation scores 50.
-- Invalid values stay missing. Available weights are renormalized, confidence uses all weights.
-- Source query defines the geographic/year extent. Preserve geometry and raw fields.
WITH
source AS (SELECT * FROM ST_Read('https://api.pdok.nl/cbs/wijken-en-buurten-2025/ogc/v1/collections/buurten/items?f=json&bbox=5.00,52.00,5.25,52.17&limit=1000&filter=gemeentecode%20%3D%20%27GM0344%27&filter-lang=cql2-text')),
base AS (SELECT row_number() OVER () AS _row_id, *,
  CASE WHEN (TRY_CAST("bevolkingsdichtheid_inwoners_per_km2" AS DOUBLE)) IS NOT NULL AND (TRY_CAST("bevolkingsdichtheid_inwoners_per_km2" AS DOUBLE)) >= 0 THEN TRY_CAST("bevolkingsdichtheid_inwoners_per_km2" AS DOUBLE) END AS value_0 FROM source),
rank_0 AS (SELECT _row_id, CASE WHEN count(*) OVER () = 1 THEN 50.0 ELSE 100.0 * (rank() OVER (ORDER BY value_0) - 1 + (count(*) OVER (PARTITION BY value_0) - 1) / 2.0) / (count(*) OVER () - 1) END AS score FROM base WHERE value_0 IS NOT NULL),
result AS (SELECT b.*, round((coalesce(r0.score * 1, 0)) / nullif((CASE WHEN r0.score IS NOT NULL THEN 1 ELSE 0 END), 0), 1) AS priority_score, round(100.0 * (CASE WHEN r0.score IS NOT NULL THEN 1 ELSE 0 END) / 1, 1) AS confidence FROM base b
LEFT JOIN rank_0 r0 USING (_row_id))
SELECT * FROM result ORDER BY priority_score DESC NULLS LAST;
