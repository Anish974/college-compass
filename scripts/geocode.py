"""Geocode institutes against OpenStreetMap Nominatim.

Coordinates come from OSM (ODbL) rather than being hand-placed, so every campus
pin on the map is attributable. Nominatim asks for <=1 request/second and a
real User-Agent; both are honoured below.

Usage:  python scripts/geocode.py <queries.json> <out.json> [cache-dir]
        queries.json: {"<id>": ["<query>", "<fallback query>", ...], ...}
        Queries are tried in order; the first that resolves wins.
"""
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen, Request

ENDPOINT = "https://nominatim.openstreetmap.org/search?"
UA = {"User-Agent": "campus-compass-dataset-builder/1.0 (+educational, non-commercial)"}


def lookup(query):
    url = ENDPOINT + urlencode(
        {"q": query, "format": "jsonv2", "limit": 3, "countrycodes": "in"}
    )
    with urlopen(Request(url, headers=UA), timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    queries = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = Path(sys.argv[2])
    cache = Path(sys.argv[3] if len(sys.argv) > 3 else "geo-cache")
    cache.mkdir(parents=True, exist_ok=True)

    result = {}
    for key, query in queries.items():
        attempts = [query] if isinstance(query, str) else query
        result[key] = None
        for n, attempt in enumerate(attempts):
            f = cache / f"{key}.{n}.json"
            if not f.exists():
                print(f"geocoding {key} [{n}] …", file=sys.stderr)
                f.write_text(json.dumps(lookup(attempt)), encoding="utf-8")
                time.sleep(1.1)  # Nominatim usage policy: max 1 req/s
            hits = json.loads(f.read_text(encoding="utf-8"))
            if hits:
                result[key] = {
                    "lat": float(hits[0]["lat"]),
                    "lng": float(hits[0]["lon"]),
                    "osmType": hits[0]["osm_type"],
                    "osmId": hits[0]["osm_id"],
                    "displayName": hits[0]["display_name"],
                    "query": attempt,
                }
                break

    out.write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding="utf-8")
    miss = [k for k, v in result.items() if not v]
    print(f"wrote {out}; {len(result) - len(miss)} hits, {len(miss)} misses: {miss}", file=sys.stderr)


if __name__ == "__main__":
    main()
