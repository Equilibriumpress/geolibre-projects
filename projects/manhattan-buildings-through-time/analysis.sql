-- Manhattan Buildings Through Time
-- Reproducible source query behind the 3D time-slider project.
-- The project itself loads the GeoJSON endpoint directly and binds
-- construction_year to GeoLibre's cumulative Time Slider.
--
-- This query summarizes the same bounded source by the broad visual eras used
-- in the project. It is descriptive only: the animation is not an estimate of
-- demolished historical stock.

INSTALL httpfs;
LOAD httpfs;

WITH buildings AS (
  SELECT
    try_cast(construction_year AS INTEGER) AS construction_year,
    try_cast(height_roof AS DOUBLE) AS height_roof_ft
  FROM read_json_auto(
    'https://data.cityofnewyork.us/resource/5zhs-2jue.json?%24where=height_roof%3E0%20AND%20within_box(the_geom%2C40.770%2C-74.020%2C40.700%2C-73.965)&%24limit=50000'
  )
),
classified AS (
  SELECT
    CASE
      WHEN construction_year < 1900 THEN 'Pre-1900'
      WHEN construction_year < 1930 THEN '1900-1929'
      WHEN construction_year < 1950 THEN '1930-1949'
      WHEN construction_year < 1980 THEN '1950-1979'
      WHEN construction_year < 2000 THEN '1980-1999'
      WHEN construction_year < 2015 THEN '2000-2014'
      ELSE '2015+'
    END AS era,
    construction_year,
    height_roof_ft
  FROM buildings
  WHERE construction_year BETWEEN 1850 AND 2025
)
SELECT
  era,
  count(*) AS buildings,
  round(avg(height_roof_ft), 1) AS mean_roof_height_ft
FROM classified
GROUP BY era
ORDER BY min(construction_year);
