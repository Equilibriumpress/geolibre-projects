"""Bounded source checks. HTTP/CORS headers do not prove GPU rendering or complete data."""
import concurrent.futures
import datetime
import json
import pathlib
import time
import urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
projects = [(p.parent, json.loads(p.read_text())["sources"]) for p in sorted((root / "projects").glob("*/sources.json")) if not p.parent.name.startswith("_")]
urls = sorted({s["url"] for _, sources in projects for s in sources if s.get("url", "").startswith("https://")})
def check(url):
    started = time.monotonic()
    try:
        request = urllib.request.Request(url, headers={"Range": "bytes=0-65535", "User-Agent": "GeoLibre-source-health/1.0"})
        with urllib.request.urlopen(request, timeout=15) as response:
            sample = response.read(65536)
            return url, {"status": response.status, "sampleBytes": len(sample), "corsAllowOrigin": response.headers.get("Access-Control-Allow-Origin"), "elapsedMs": round((time.monotonic()-started)*1000), "error": None}
    except Exception as error:
        return url, {"status": getattr(error, "code", None), "elapsedMs": round((time.monotonic()-started)*1000), "error": str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    results = dict(executor.map(check, urls))
checked = datetime.datetime.now(datetime.timezone.utc).isoformat()
for directory, sources in projects:
    report = {"checkedAt": checked, "scope": "Bounded HTTP sample. Browser CORS and renderer readiness require runtime checks.", "fallbackPolicy": "Never substitute stale data silently. Geometry preview, method and SQL remain available if a live source fails.", "sources": [{"id": s["id"], "url": s["url"], **results[s["url"]]} for s in sources if s["url"] in results]}
    (directory / "source-health.json").write_text(json.dumps(report, indent=2)+"\n")
    print(directory.name, [(s["id"], s["status"]) for s in report["sources"]])
