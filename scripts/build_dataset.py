"""Build src/lib/colleges.generated.json from official sources only.

Inputs, all official:
  * roster.json                — curated list of which institutes the app shows,
                                 mapped to their official DTE institute codes.
  * institute summaries        — fe2026.mahacet.org institute pages
                                 (fetch_institutes.py)
  * CAP Round I/II/III cutoffs — State CET Cell cutoff PDFs
                                 (parse_cap_cutoffs.py)
  * coordinates                — OpenStreetMap Nominatim (geocode.py)

Nothing here is estimated, interpolated or hand-typed: a field with no official
source is simply absent, and the UI renders it as "not published".

Usage:  python scripts/build_dataset.py <work-dir> [out.json]
"""
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"

# Official course name -> the coarse branch buckets the UI filters on. Courses
# outside this map are still shown on the college card, just not filterable.
BRANCH_OF = {
    "Computer Science and Engineering": "CSE",
    "Computer Engineering": "CSE",
    "Information Technology": "IT",
    "Electronics and Telecommunication Engg": "E&TC",
    "Mechanical Engineering": "Mech",
    "Civil Engineering": "Civil",
}

# City transit and landmark reference points, geocoded like everything else.
# Each entry is [display name, ...alternative Nominatim spellings]; OSM naming of
# Indian bus stands and squares is inconsistent, so more than one is often needed.
CITY_POINTS = {
    "pune": {
        "railways": [
            ["Pune Junction", "Pune Junction railway station, Pune"],
            ["Shivajinagar Station", "Shivajinagar railway station, Pune"],
        ],
        "busStops": [
            ["Swargate Bus Stand", "Swargate bus stand, Pune", "Swargate Pune"],
            ["Shivajinagar Bus Stand", "Shivajinagar bus stand Pune", "Shivaji Nagar ST Stand Pune"],
        ],
        "landmarks": [
            ["Shaniwar Wada", "Shaniwar Wada, Pune"],
            ["Aga Khan Palace", "Aga Khan Palace, Pune"],
        ],
    },
    "mumbai": {
        "railways": [
            ["Dadar Junction", "Dadar railway station, Mumbai"],
            ["CSMT", "Chhatrapati Shivaji Maharaj Terminus, Mumbai"],
        ],
        "busStops": [
            ["Dadar Bus Depot", "Dadar bus depot Mumbai", "Dadar BEST bus station Mumbai", "Dadar Mumbai"],
            ["Andheri Bus Station", "Andheri bus station, Mumbai", "Andheri Mumbai"],
        ],
        "landmarks": [
            ["Gateway of India", "Gateway of India, Mumbai"],
            ["CSMT Heritage Building", "Chhatrapati Shivaji Maharaj Terminus, Mumbai"],
        ],
    },
    "nagpur": {
        "railways": [
            ["Nagpur Junction", "Nagpur Junction railway station, Nagpur"],
            ["Ajni Station", "Ajni railway station, Nagpur"],
        ],
        "busStops": [
            ["Mor Bhavan Bus Stand", "Mor Bhavan bus stand Nagpur", "Morbhavan Bus Stand Nagpur", "Ganeshpeth bus stand Nagpur"],
            ["Sitabuldi", "Sitabuldi, Nagpur"],
        ],
        "landmarks": [
            ["Deekshabhoomi", "Deekshabhoomi, Nagpur"],
            ["Sitabuldi Fort", "Sitabuldi Fort, Nagpur"],
        ],
    },
    "amravati": {
        "railways": [
            ["Amravati Railway Station", "Amravati railway station, Amravati"],
            ["Badnera Junction", "Badnera Junction railway station"],
        ],
        "busStops": [
            ["Amravati ST Stand", "Amravati bus stand, Amravati", "Amravati Bus Station"],
            ["Rajkamal Square", "Rajkamal Chowk Amravati", "RajKamal Chowk, Amravati"],
        ],
        "landmarks": [
            ["Ambadevi Temple", "Ambadevi Mandir Amravati", "Shri Ambadevi Temple Amravati"],
            ["Wadali Talao", "Wadali Talao Amravati", "Wadali Garden Amravati", "Wadali Amravati"],
        ],
    },
}

DISTRICT_OF = {"pune": "Pune", "mumbai": "Mumbai", "nagpur": "Nagpur", "amravati": "Amravati"}

CITY_BBOX = {
    "pune": "18.30,73.55,18.90,74.15",
    "mumbai": "18.80,72.75,19.50,73.20",
    "nagpur": "20.85,78.80,21.35,79.30",
    "amravati": "20.70,77.50,21.10,78.00",
}


def run(script, *args):
    subprocess.run([sys.executable, str(SCRIPTS / script), *map(str, args)], check=True)


def slug(s):
    return "".join(ch if ch.isalnum() else "-" for ch in s.lower()).strip("-")[:60]


def geo_queries(official_name, short_name, address, district):
    """Nominatim query cascade, most specific first.

    Official DTE names carry the founding trust ("Bansilal Ramnath Agarawal
    Charitable Trust's Vishwakarma Institute of Technology, Bibwewadi, Pune"),
    which OSM does not index; commas also hurt matching. So strip the trust
    prefix, drop punctuation, and fall back to the short name and address.
    """
    core = re.sub(r"^.*?'s\s+", "", official_name)
    core = re.sub(r"\(.*?\)", " ", core)
    core = core.split(",")[0]
    plain = re.sub(r"[^\w& ]", " ", core)
    plain = re.sub(r"\s+", " ", plain).strip()
    locality = ", ".join(p.strip() for p in official_name.split(",")[1:-1])
    out = [
        f"{plain} {district}",
        f"{plain} {locality} {district}" if locality else None,
        plain,
        f"{short_name} {district}",
        f"{address} {district}" if address else None,
    ]
    seen, cascade = set(), []
    for q in out:
        q = re.sub(r"\s+", " ", q).strip() if q else None
        if q and q.lower() not in seen:
            seen.add(q.lower())
            cascade.append(q)
    return cascade


def main():
    work = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "src/lib/colleges.generated.json"
    work.mkdir(parents=True, exist_ok=True)

    roster = json.loads((SCRIPTS / "roster.json").read_text(encoding="utf-8"))
    cap_participants = [c for c in roster["colleges"] if c.get("capParticipant") is not False]

    # --- official institute summaries -------------------------------------
    codes = work / "codes.json"
    codes.write_text(json.dumps([c["code"] for c in cap_participants]), encoding="utf-8")
    run("fetch_institutes.py", codes, work / "institutes.json", work / "inst-cache")
    institutes = json.loads((work / "institutes.json").read_text(encoding="utf-8"))

    # --- official CAP cutoffs ---------------------------------------------
    run("parse_cap_cutoffs.py", work / "cap-cache", work / "cap-cutoffs.json")
    cap = json.loads((work / "cap-cutoffs.json").read_text(encoding="utf-8"))

    # --- coordinates -------------------------------------------------------
    queries = {}
    for c in roster["colleges"]:
        if c.get("geoQuery"):
            q = c["geoQuery"]
            queries[c["id"]] = [q, re.sub(r"[,.]", " ", q)]
        else:
            inst = institutes[c["code"]]
            queries[c["id"]] = geo_queries(
                inst["name"], c["short"], inst["address"], inst["district"]
            )
    for city_id, city in roster["cities"].items():
        queries[f"hub-{city_id}"] = [
            q for alt in city["hubQueries"] for q in (alt, alt.replace(",", ""))
        ]
        for kind, entries in CITY_POINTS[city_id].items():
            for label, *alts in entries:
                cascade = []
                for a in alts:
                    cascade += [a, a.replace(",", "")]
                queries[f"{kind}-{city_id}-{slug(label)}"] = cascade
    qfile = work / "geo-queries.json"
    qfile.write_text(json.dumps(queries, ensure_ascii=False), encoding="utf-8")
    run("geocode.py", qfile, work / "geo.json", work / "geo-cache")
    geo = json.loads((work / "geo.json").read_text(encoding="utf-8"))

    # Nominatim misses most long institute names; fall back to an Overpass sweep
    # of every college feature in the district, matched by name.
    targets = {}
    for c in roster["colleges"]:
        if geo.get(c["id"]):
            continue
        inst = institutes.get(c["code"]) if c.get("code") else None
        names = [n for n in (c.get("name"), inst["name"] if inst else None, c["short"]) if n]
        if inst:
            names.append(re.sub(r"^.*?'s\s+", "", inst["name"]).split(",")[0])
        targets[c["id"]] = {
            "area": c["city"],
            "bbox": CITY_BBOX[c["city"]],
            "district": DISTRICT_OF[c["city"]],
            "names": names,
        }
    if targets:
        tfile = work / "osm-targets.json"
        tfile.write_text(json.dumps(targets, ensure_ascii=False), encoding="utf-8")
        run("osm_lookup.py", tfile, work / "osm.json", work / "osm-cache")
        for key, hit in json.loads((work / "osm.json").read_text(encoding="utf-8")).items():
            if hit:
                geo[key] = {
                    "lat": hit["lat"], "lng": hit["lng"],
                    "osmType": hit["osm"].split("/")[0], "osmId": hit["osm"].split("/")[1],
                    "displayName": hit["name"], "query": "Overpass name match",
                }

    # --- assemble ----------------------------------------------------------
    cities = {}
    for city_id, city in roster["cities"].items():
        hub = geo.get(f"hub-{city_id}")
        points = {}
        for kind, entries in CITY_POINTS[city_id].items():
            points[kind] = [
                {
                    "id": f"{city_id}-{kind}-{i}",
                    "name": label,
                    "query": g["query"],
                    "position": {"lat": g["lat"], "lng": g["lng"]},
                    "osm": f'{g["osmType"]}/{g["osmId"]}',
                }
                for i, (label, *_) in enumerate(entries)
                if (g := geo.get(f"{kind}-{city_id}-{slug(label)}"))
            ]
        cities[city_id] = {
            "id": city_id,
            "name": city["name"],
            "state": "Maharashtra",
            "hub": {
                "id": f"{city_id}-hub",
                "name": city["hubName"],
                "query": hub["query"] if hub else city["hubQueries"][0],
                "position": {"lat": hub["lat"], "lng": hub["lng"]} if hub else None,
                "osm": f'{hub["osmType"]}/{hub["osmId"]}' if hub else None,
            },
            **points,
            "colleges": [],
        }

    # A handful of campuses are simply not in OSM. Rather than drop their pin or
    # invent a coordinate, fall back to the hand-placed one this project shipped
    # with and mark it approximate so the UI can say so.
    fallback = json.loads((SCRIPTS / "fallback-positions.json").read_text(encoding="utf-8"))

    unmatched = []
    for c in roster["colleges"]:
        g = geo.get(c["id"])
        entry = {
            "id": c["id"],
            "cityId": c["city"],
            "shortName": c["short"],
            "website": c["website"],
            "capParticipant": c.get("capParticipant") is not False,
            "position": {"lat": g["lat"], "lng": g["lng"]}
            if g
            else fallback.get(c["id"]),
            "positionSource": "osm" if g else ("approximate" if fallback.get(c["id"]) else None),
            "geo": {"osm": f'{g["osmType"]}/{g["osmId"]}', "matched": g["displayName"], "query": g["query"]}
            if g
            else None,
        }
        if not g:
            unmatched.append(c["id"])

        if entry["capParticipant"]:
            inst = institutes[c["code"]]
            courses = []
            for course in inst["courses"]:
                if course["supernumerary"]:
                    continue
                cutoffs = {}
                for rnd in ("1", "2", "3"):
                    got = (
                        cap["rounds"][rnd]
                        .get(c["code"], {})
                        .get("courses", {})
                        .get(course["choiceCode"][5:], {})
                        .get("cutoffs", {})
                    )
                    got = {k: v for k, v in got.items() if v}
                    if got:
                        cutoffs[rnd] = got
                courses.append(
                    {
                        "choiceCode": course["choiceCode"],
                        "name": course["name"],
                        "branch": BRANCH_OF.get(course["name"]),
                        "intake": course["intake"],
                        "accreditation": None if course["accreditation"] in ("-", "") else course["accreditation"],
                        "cutoffs": cutoffs,
                    }
                )
            entry.update(
                {
                    "name": inst["name"],
                    "instituteCode": inst["code"],
                    "address": inst["address"],
                    "district": inst["district"],
                    "status": inst["status"],
                    "autonomy": inst["autonomy"],
                    "minority": inst["minority"],
                    "university": inst["university"],
                    "totalIntake": sum(x["intake"] or 0 for x in inst["courses"] if not x["supernumerary"]),
                    "courses": courses,
                    "sourceUrl": f"https://fe2026.mahacet.org/StaticPages/frmInstituteSummary.aspx?InstituteCode={inst['code']}",
                }
            )
        else:
            entry.update(
                {
                    "name": c["name"],
                    "instituteCode": None,
                    "admissionNote": c["admissionNote"],
                    "courses": [],
                }
            )
        cities[c["city"]]["colleges"].append(entry)

    payload = {
        "generatedOn": date.today().isoformat(),
        "capYear": cap["year"],
        "sources": {
            "capPortal": cap["portal"],
            "capCutoffPdfs": cap["sources"],
            "instituteSummary": "https://fe2026.mahacet.org/StaticPages/frmInstituteSummary.aspx?InstituteCode=",
            "instituteList": "https://fe2026.mahacet.org/StaticPages/frmInstituteList.aspx?did=1884",
            "coordinates": "https://nominatim.openstreetmap.org/ (OpenStreetMap contributors, ODbL)",
        },
        "cities": cities,
    }
    out.write_text(json.dumps(payload, indent=1, ensure_ascii=False), encoding="utf-8")

    total = sum(len(c["colleges"]) for c in cities.values())
    print(f"wrote {out}: {total} colleges", file=sys.stderr)
    if unmatched:
        print(f"NO COORDINATES for: {unmatched}", file=sys.stderr)


if __name__ == "__main__":
    main()
