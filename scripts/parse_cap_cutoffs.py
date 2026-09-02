"""Parse the official DTE / State CET Cell CAP cutoff PDFs into JSON.

Source PDFs (Maharashtra & Minority seats, First Year Engineering 2026-27),
linked from the official CAP portal https://fe2026.mahacet.org/ :
  https://cappublicdocs2026.blob.core.windows.net/documents/2026ENGG_CAP{1,2,3}_MH_CutOff*.pdf

Requires `pdftotext` (xpdf or poppler) on PATH.

Usage:  python scripts/parse_cap_cutoffs.py <cache-dir> <out.json>
"""
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

YEAR = "2026-27"
PORTAL = "https://fe2026.mahacet.org/"
ROUNDS = {
    "1": "https://cappublicdocs2026.blob.core.windows.net/documents/2026ENGG_CAP1_MH_CutOff_V1.pdf",
    "2": "https://cappublicdocs2026.blob.core.windows.net/documents/2026ENGG_CAP2_MH_CutOff.pdf",
    "3": "https://cappublicdocs2026.blob.core.windows.net/documents/2026ENGG_CAP3_MH_CutOff.pdf",
}

INST_RE = re.compile(r"^(\d{5}) - (.+?)\s*$")
# Women-only institutes suffix the choice code with F.
COURSE_RE = re.compile(r"^(\d{5})(\d{5}F?) - (.+?)\s*$")
STATUS_RE = re.compile(r"^Status:\s*(.+?)\s*$")
STAGE_HDR_RE = re.compile(r"^(\s*Stage\s+)(\S.*?)\s*$")
STAGE_ROW_RE = re.compile(r"^(\s*)(I|II|III|IV|V|VI|VII|VIII|IX|X)(\s+)(\d.*?)\s*$")
PCT_TOKEN_RE = re.compile(r"\(\d+\.\d+\)")
SECTIONS = {
    "Home University Seats Allotted to Home University Candidates": "home",
    "Other Than Home University Seats Allotted to Other Than Home University Candidates": "other",
    "Home University Seats Allotted to Other Than Home University Candidates": "home-to-other",
    "Other Than Home University Seats Allotted to Home University Candidates": "other-to-home",
    "State Level": "state",
}
# Only the unreserved Open buckets are kept; the rest is category data this app
# does not model. L* is the Ladies quota — at a women-only institute it is the
# only Open bucket there is.
KEEP = ("GOPENH", "GOPENO", "GOPENS", "LOPENH", "LOPENO", "LOPENS")


def align(headers, values):
    """Map percentile tokens to category labels by text column.

    `headers` and `values` are [(column, text)]. A row can skip categories (an
    empty cell), so this is a monotonic alignment, not a zip. pdftotext centres
    header text but left-aligns cell text, so a per-row shift is searched.
    """
    if not headers or not values:
        return []
    best = None
    for shift in range(-20, 21):
        # DP: values[i] must map to a strictly increasing header index.
        INF = float("inf")
        prev = [0.0] + [INF] * len(headers)
        back = []
        for vcol, _ in values:
            cur = [INF] * (len(headers) + 1)
            row = [-1] * (len(headers) + 1)
            bestprev, bestj = INF, -1
            for j, (hcol, _) in enumerate(headers):
                if prev[j] < bestprev:
                    bestprev, bestj = prev[j], j
                cost = bestprev + abs(vcol - (hcol + shift))
                if cost < cur[j + 1]:
                    cur[j + 1], row[j + 1] = cost, bestj
            prev, _ = cur, back.append(row)
        end = min(range(len(prev)), key=lambda j: prev[j])
        if prev[end] == INF:
            continue
        if best is None or prev[end] < best[0]:
            pairs, j = [], end
            for row in reversed(back):
                pairs.append(j - 1)
                j = row[j]
            best = (prev[end], list(reversed(pairs)))
    if best is None:
        return []
    total, idxs = best
    # A good alignment sits within roughly half a column of its header.
    if total / len(values) > 12:
        return []
    return [(headers[i][1], values[k][1]) for k, i in enumerate(idxs) if i >= 0]


def tokens(text, offset=0):
    return [(m.start() + offset, m.group()) for m in re.finditer(r"\S+", text)]


def parse(lines):
    data = {}
    inst = course = section = None
    header = None
    pending = False

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            continue

        m = COURSE_RE.match(line)
        if m and m.group(1) in data:
            inst = data[m.group(1)]
            course = inst["courses"].setdefault(
                m.group(2), {"name": re.sub(r"\s+", " ", m.group(3)), "cutoffs": {}}
            )
            section, header, pending = None, None, False
            continue

        m = INST_RE.match(line)
        if m:
            inst = data.setdefault(
                m.group(1),
                {"name": re.sub(r"\s+", " ", m.group(2)), "status": "", "courses": {}},
            )
            course, section, header, pending = None, None, None, False
            continue

        m = STATUS_RE.match(line)
        if m and inst is not None and not inst["status"]:
            inst["status"] = re.sub(r"\s+", " ", m.group(1))
            continue

        flat = re.sub(r"\s+", " ", line.strip())
        if flat in SECTIONS:
            section, header, pending = SECTIONS[flat], None, False
            continue

        m = STAGE_HDR_RE.match(line)
        if m:
            header = tokens(m.group(2), len(m.group(1)))
            pending = False
            continue

        if STAGE_ROW_RE.match(line) and header:
            pending = True  # percentiles come on the next line, same columns
            continue

        if pending and PCT_TOKEN_RE.search(line) and course is not None:
            pending = False
            pcts = [(m.start(), m.group()[1:-1]) for m in PCT_TOKEN_RE.finditer(line)]
            bucket = course["cutoffs"].setdefault(section or "state", {})
            for cat, pct in align(header, pcts):
                if cat in KEEP:
                    bucket.setdefault(cat, float(pct))  # first stage = closing line

    return data


def pdf_lines(pdf):
    out = subprocess.run(["pdftotext", "-table", str(pdf), "-"], capture_output=True, check=True)
    return out.stdout.decode("utf-8", "replace").splitlines()


def main():
    cache = Path(sys.argv[1] if len(sys.argv) > 1 else "cap-cache")
    out = Path(sys.argv[2] if len(sys.argv) > 2 else "cap-cutoffs.json")
    cache.mkdir(parents=True, exist_ok=True)

    rounds = {}
    for rnd, url in ROUNDS.items():
        pdf = cache / f"cap{rnd}.pdf"
        if not pdf.exists():
            print(f"downloading round {rnd} …", file=sys.stderr)
            pdf.write_bytes(urlopen(url).read())
        rounds[rnd] = parse(pdf_lines(pdf))
        filled = sum(
            1
            for i in rounds[rnd].values()
            for c in i["courses"].values()
            for b in c["cutoffs"].values()
            if b
        )
        print(f"round {rnd}: {len(rounds[rnd])} institutes, {filled} filled buckets", file=sys.stderr)

    out.write_text(
        json.dumps({"year": YEAR, "portal": PORTAL, "sources": ROUNDS, "rounds": rounds}, indent=1),
        encoding="utf-8",
    )
    print(f"wrote {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
