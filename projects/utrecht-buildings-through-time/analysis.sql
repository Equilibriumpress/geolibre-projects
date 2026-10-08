-- Netherlands Buildings Through Time · Utrecht
-- Analytical contract for the BAG construction-year project.
--
-- The interactive map reads the authoritative PDOK BAG vector tiles directly.
-- The SQL below records the equivalent classification and filtering logic so
-- the visual treatment is reproducible in a materialized BAG extract.
--
-- Expected input relation: bag_pand_utrecht
-- Required columns:
--   identificatie, bouwjaar, gebruiksdoel, status, geometry
--
-- The current-stock view deliberately excludes BAG records marked demolished.
-- It is not a reconstruction of buildings that no longer exist.

WITH current_buildings AS (
  SELECT
    identificatie,
    TRY_CAST(bouwjaar AS INTEGER) AS bouwjaar,
    gebruiksdoel,
    status,
    geometry
  FROM bag_pand_utrecht
  WHERE status IS DISTINCT FROM 'Pand gesloopt'
    AND TRY_CAST(bouwjaar AS INTEGER) IS NOT NULL
),
classified AS (
  SELECT
    *,
    CASE
      WHEN bouwjaar <= 1700 THEN '≤1700'
      WHEN bouwjaar <= 1850 THEN '1701–1850'
      WHEN bouwjaar <= 1900 THEN '1851–1900'
      WHEN bouwjaar <= 1950 THEN '1901–1950'
      WHEN bouwjaar <= 2000 THEN '1951–2000'
      ELSE '2001–present'
    END AS build_period,
    CASE
      WHEN bouwjaar <= 1700 THEN 1
      WHEN bouwjaar <= 1850 THEN 2
      WHEN bouwjaar <= 1900 THEN 3
      WHEN bouwjaar <= 1950 THEN 4
      WHEN bouwjaar <= 2000 THEN 5
      ELSE 6
    END AS build_period_order
  FROM current_buildings
)
SELECT
  build_period,
  build_period_order,
  COUNT(*) AS buildings,
  MIN(bouwjaar) AS earliest_recorded_year,
  MAX(bouwjaar) AS latest_recorded_year
FROM classified
GROUP BY build_period, build_period_order
ORDER BY build_period_order;

-- Full-source extraction note
-- ---------------------------
-- The BAG OGC API Features collection is paged. A reproducible bulk extract for
-- analysis must follow every rel="next" link for the chosen Utrecht geometry or
-- study extent rather than reading only the first /items page.
--
-- The published map avoids materializing the complete city extract by using:
-- https://api.pdok.nl/kadaster/bag/ogc/v2/tiles/WebMercatorQuad/{z}/{y}/{x}?f=mvt
--
-- The dashboard intentionally uses a small central-Utrecht /items request and
-- is labelled as a sample; it must not be interpreted as citywide statistics.
