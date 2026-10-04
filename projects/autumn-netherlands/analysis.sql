-- Autumn Netherlands: executable study-extent audit in DuckDB Spatial.
-- Run against the embedded GeoLibre layer autumn-study-areas.
-- No NDVI/EVI values are inferred from RGB map tiles.
SELECT region_id, name, extent_kind,
       ROUND(ST_Area(ST_Transform(geometry, 'EPSG:4326', 'EPSG:28992', always_xy := true)) / 1000000.0, 2) AS study_window_km2,
       interpretation
FROM "autumn-study-areas"
ORDER BY name;

-- Future numerical analysis requires actual raster observations:
-- region_id, date, sensor, index_name, mean_index, valid_pixel_fraction,
-- forest_mask_version, source_product, observation_window_start/end.
-- Filter QA/NoData, use deciduous/mixed forest pixels, area-weight in EPSG:28992.
-- Compare the same sensor/index and same seasonal dates across years.
-- Do not infer peak leaf colour or daily biological change from rendered tiles.
