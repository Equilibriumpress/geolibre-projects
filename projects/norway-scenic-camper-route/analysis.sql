-- Narrative route-video project.
-- No statistical transformation is required.
-- The video follows the embedded GeoJSON route layer and Story Map chapters.
--
-- Authoritative route facts:
-- Norwegian Scenic Route Geiranger–Trollstigen · 104 km.
-- The embedded LineString is intentionally simplified for camera authoring.
SELECT
  'Geiranger–Trollstigen' AS route_name,
  104 AS official_length_km,
  4 AS featured_viewpoints;
