"""Locate campuses in OpenStreetMap via Overpass, for names Nominatim misses.

Nominatim's free-text search does poorly on long Indian institute names. Pulling
every college/university feature in a bounding box around the city and matching
names locally is far more reliable, and is still an OSM (ODbL) source we cite.

Usage:  python scripts/osm_lookup.py <targets.json> <out.json> [cache-dir]
        targets.json: {"<id>": {"area": "pune", "bbox": "s,w,n,e",
                                "district": "Pune", "names": ["...", "..."]}}
"""
import difflib
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen, Request

# Public Overpass instances are shared and frequently rate-limit; try in turn.
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]
UA = {"User-Agent": "campus-compass-dataset-builder/1.0 (+educational, non-commercial)"}
# Two passes: every college/university feature in the box (fast, indexed), plus
# anything inside the district whose *name* looks like an engineering campus —
# many Indian campuses are mapped without an amenity tag.
QUERY_BBOX = '[out:json][timeout:120];nwr["amenity"~"^(college|university)$"]["name"](%s);out center tags;'
QUERY_NAMED = (
    '[out:json][timeout:180];'
    'area["name"="%s"]["boundary"="administrative"]["admin_level"~"^(5|6)$"]->.a;'
    'nwr["name"~"Engineering|Institute of Technology|Polytechnic",i](area.a);'
    'out center tags;'
)

STOP = set(
    """s the of and for in at institute institutes institution college colleges school
    engineering engg technology tech management research education society trust shri
    smt dr prof sir campus autonomous charitable shikshan sanstha mandal""".split()
)
# A name match this strong is a campus; anything weaker is same-city noise and is
# deliberately left unresolved rather than guessed at.
THRESHOLD = 0.62


def norm(s):
    return {t for t in re.sub(r"[^a-z0-9 ]", " ", s.lower()).split() if t not in STOP and len(t) > 1}


def score(a, b):
    ta, tb = norm(a), norm(b)
    if not ta or not tb:
        return 0.0
    overlap = len(ta & tb) / min(len(ta), len(tb))
    return 0.7 * overlap + 0.3 * difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()


def overpass(query):
    last = None
    for endpoint in ENDPOINTS:
        for attempt in range(3):
            try:
                data = urlencode({"data": query}).encode()
                with urlopen(Request(endpoint, data=data, headers=UA), timeout=240) as r:
                    return json.loads(r.read())["elements"]
            except Exception as exc:  # noqa: BLE001 — any failure means "try the next mirror"
                last = exc
                print(f"  overpass retry ({endpoint}): {type(exc).__name__}", file=sys.stderr)
                time.sleep(8 * (attempt + 1))
    raise RuntimeError(f"all Overpass endpoints failed: {last}")


def fetch_area(area, bbox, district, cache):
    elements = []
    for tag, query in (("bbox", QUERY_BBOX % bbox), ("named", QUERY_NAMED % district)):
        f = cache / f"area-{area}-{tag}.json"
        if not f.exists():
            print(f"overpass: {area} ({tag}) …", file=sys.stderr)
            f.write_text(json.dumps(overpass(query)), encoding="utf-8")
            time.sleep(4)
        elements += json.loads(f.read_text(encoding="utf-8"))

    out, seen = [], set()
    for e in elements:
        key = f'{e["type"]}/{e["id"]}'
        name = e.get("tags", {}).get("name")
        centre = e.get("center") or {"lat": e.get("lat"), "lon": e.get("lon")}
        if name and centre.get("lat") is not None and key not in seen:
            seen.add(key)
            out.append({"name": name, "lat": centre["lat"], "lng": centre["lon"], "osm": key})
    return out


def main():
    targets = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = Path(sys.argv[2])
    cache = Path(sys.argv[3] if len(sys.argv) > 3 else "osm-cache")
    cache.mkdir(parents=True, exist_ok=True)

    areas, result = {}, {}
    for key, t in targets.items():
        if t["area"] not in areas:
            areas[t["area"]] = fetch_area(t["area"], t["bbox"], t["district"], cache)
        best = None
        for cand in areas[t["area"]]:
            s = max(score(n, cand["name"]) for n in t["names"])
            if best is None or s > best[0]:
                best = (s, cand)
        result[key] = {**best[1], "matchScore": round(best[0], 3)} if best and best[0] >= THRESHOLD else None

    out.write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding="utf-8")
    hits = sum(1 for v in result.values() if v)
    print(f"wrote {out}; {hits}/{len(result)} matched", file=sys.stderr)


if __name__ == "__main__":
    main()
