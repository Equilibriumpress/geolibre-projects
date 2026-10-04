-- Official route facts and locally reproduced GPX length.
-- Geometry: official trkpt[0:2591] + trkpt[3814:], removing the duplicate return loop.
-- Original GPX is preserved in official-route.gpx. Retained coordinates are unchanged.
-- Camera sections use cumulative great-circle distance fractions.
SELECT
  'Geiranger–Trollstigen' AS route_name,
  104 AS official_length_km,
  105.556 AS gpx_length_km,
  3608 AS track_coordinates,
  4 AS featured_viewpoints;
