"""Self-check for the CAP cutoff parser.

The risky part is align(): a Stage row can skip categories, so percentiles are
matched to their column heading by text position, not by zip(). Run it with:

    python scripts/test_parse_cap_cutoffs.py [work-dir]

With a work-dir containing the downloaded cutoff PDFs it also re-parses them and
asserts three values read by eye off the official Round I / Round II PDFs.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from parse_cap_cutoffs import align, parse, pdf_lines, tokens  # noqa: E402


def test_align_skips_empty_cells():
    # Real shape from 2026 Round II, institute 01002, Civil Engineering: the
    # ORPHANI column has a heading but no value, so there are 9 headings and 8
    # percentiles. Zipping them would shift EWS onto ORPHANI.
    header_line = (
        "   Stage     GOPENS               GSCS          GVJS      GOBCS         "
        "LOPENS        LOBCS                                   TFWS   ORPHANI    "
        "           EWS"
    )
    pct_line = (
        "             (93.8941980)  (86.2722396)  (92.6489748)     (91.7989964)  "
        "(92.7564924)  (91.2331407)                     (92.1611438)             "
        "   (86.3037543)"
    )
    import re

    offset = len("   Stage     ")
    header = tokens(header_line[offset:], offset)
    pcts = [(m.start(), m.group()[1:-1]) for m in re.finditer(r"\(\d+\.\d+\)", pct_line)]

    got = dict(align(header, pcts))
    assert got["GOPENS"] == "93.8941980", got
    assert got["EWS"] == "86.3037543", got
    assert "ORPHANI" not in got, got
    assert got["TFWS"] == "92.1611438", got


def test_align_exact_match():
    header = [(10, "GOPENS"), (24, "GSCS"), (38, "EWS")]
    pcts = [(10, "99.1"), (24, "98.2"), (38, "97.3")]
    assert dict(align(header, pcts)) == {
        "GOPENS": "99.1",
        "GSCS": "98.2",
        "EWS": "97.3",
    }


def test_against_official_pdfs(work: Path):
    """Values read directly off the published PDFs."""
    expected = {
        # round, institute, course code, seat pool, category -> percentile
        ("1", "01002", "19110", "state", "GOPENS"): 91.7858261,
        ("2", "01002", "19110", "state", "GOPENS"): 93.894198,
        ("1", "06271", "24510", "state", "GOPENS"): 99.7857034,
        # A women-only institute publishes only Ladies-quota Open lines.
        ("1", "06276", "24550F", "state", "LOPENS"): 99.4005994,
    }
    cache = {}
    for (rnd, inst, course, pool, cat), want in expected.items():
        if rnd not in cache:
            pdf = work / "cap-cache" / f"cap{rnd}.pdf"
            if not pdf.exists():
                print(f"skip: {pdf} not downloaded", file=sys.stderr)
                return
            cache[rnd] = parse(pdf_lines(pdf))
        got = cache[rnd][inst]["courses"][course]["cutoffs"][pool][cat]
        assert got == want, f"round {rnd} {inst}/{course} {cat}: {got} != {want}"
    print(f"official-PDF checks passed ({len(expected)} values)")


if __name__ == "__main__":
    test_align_skips_empty_cells()
    test_align_exact_match()
    print("align() checks passed")
    if len(sys.argv) > 1:
        test_against_official_pdfs(Path(sys.argv[1]))
