"""Scrape official institute summaries from the State CET Cell CAP portal.

Each institute's page (address, status, autonomy, minority status, affiliating
university, course-wise intake) is public at
  https://fe2026.mahacet.org/StaticPages/frmInstituteSummary.aspx?InstituteCode=XXXXX

Usage:  python scripts/fetch_institutes.py <codes.json> <out.json> [cache-dir]
        codes.json is a JSON array of 5-digit institute codes.
"""
import json
import re
import sys
import time
from pathlib import Path
from urllib.request import urlopen, Request

BASE = "https://fe2026.mahacet.org/StaticPages/frmInstituteSummary.aspx?InstituteCode="
UA = {"User-Agent": "campus-compass-dataset-builder/1.0 (+educational, non-commercial)"}


def cell_after(html, label):
    """Value of the table cell that follows a <td>label</td>."""
    m = re.search(
        r">\s*" + re.escape(label) + r"\s*</td>\s*<td[^>]*>(.*?)</td>", html, re.S | re.I
    )
    return clean(m.group(1)) if m else ""


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = (
        s.replace("&nbsp;", " ").replace("&#39;", "'").replace("&amp;", "&")
        .replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">")
    )
    return re.sub(r"\s+", " ", s).strip()


def parse(html):
    courses = []
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.S):
        cells = [clean(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)]
        # Choice code | Course | University | Status | Autonomy | Minority |
        # Shift | Accreditation | Gender | Intake
        # Women-only institutes suffix the choice code with F; T marks the
        # supernumerary TFWS row, which is not a separate programme.
        if len(cells) >= 10 and re.fullmatch(r"\d{10}F?T?", cells[0]):
            courses.append(
                {
                    "choiceCode": cells[0],
                    "courseCode": cells[0][5:10],
                    "supernumerary": cells[0].endswith("T"),
                    "name": cells[1],
                    "university": cells[2],
                    "accreditation": cells[7],
                    "intake": int(cells[9]) if cells[9].isdigit() else None,
                }
            )
    return {
        "code": cell_after(html, "Institute Code"),
        "name": cell_after(html, "Institute Name"),
        "address": cell_after(html, "Institute Address"),
        "region": cell_after(html, "Region"),
        "district": cell_after(html, "District"),
        "status": cell_after(html, "Status"),
        "autonomy": cell_after(html, "Autonomy Status"),
        "minority": cell_after(html, "Minority Status"),
        "university": courses[0]["university"] if courses else "",
        "courses": courses,
    }


def main():
    codes = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = Path(sys.argv[2])
    cache = Path(sys.argv[3] if len(sys.argv) > 3 else "inst-cache")
    cache.mkdir(parents=True, exist_ok=True)

    result = {}
    for code in codes:
        page = cache / f"{code}.html"
        if not page.exists():
            print(f"fetching {code} …", file=sys.stderr)
            with urlopen(Request(BASE + code, headers=UA), timeout=60) as r:
                page.write_bytes(r.read())
            time.sleep(0.4)  # be polite to a government portal
        info = parse(page.read_text(encoding="utf-8", errors="replace"))
        if info["code"] != code:
            print(f"  !! {code}: page reported {info['code']!r}", file=sys.stderr)
        result[code] = info

    out.write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {out} ({len(result)} institutes)", file=sys.stderr)


if __name__ == "__main__":
    main()
