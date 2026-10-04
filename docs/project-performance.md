# Project loading and source checks

The portal loads HTML and small geometry previews first. An interactive preview
starts only when opened and is removed when closed. GIS engines are loaded in
the app, rather than in the portal. Project JSON has a 30-second loading timeout.
Video exports check renderer and source readiness separately.

The current uncompressed baseline measured on 4 October 2026 is 23,135 bytes for
the catalog HTML, 38,143 bytes for the Utrecht project HTML, and 27,337–30,928
bytes per preview. These are file measurements, not device loading timings.
No comparable pre-change device benchmark was captured.

Run `node scripts/check-project-page-budget.mjs` after the documentation build.
The first budgets are 100,000 bytes per research HTML page and 65,536 bytes per
preview. Review these budgets if a deliberate content change requires more.

Run `npm run projects:sources` to refresh source-health.json. Checks use at most
three parallel requests, 15-second timeouts and 64 KiB samples. The report records
HTTP status and CORS headers, not a guarantee of complete or accurate datasets.
A dated check remains visible as historical evidence. It does not silently update
the source retrieval date. Failed sources leave the geometry preview, method
and SQL available. Never replace data with stale cached data without disclosure.

GPU map, dashboard and video timing must be measured on the same physical browser
and connection before claiming a performance improvement. Source preflight
is a reliability check and adds preparation time before video recording.
