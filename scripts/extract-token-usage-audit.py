#!/usr/bin/env python3
"""Extract typography/spacing/color usage from figma-export/raw → token-usage-audit.json"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "docs" / "figma-export" / "raw"
OUT = ROOT / "docs" / "figma-export" / "token-usage-audit.json"

ROLE_RE = re.compile(r'data-name="([^"]+)"')


def role_at(text: str, pos: int) -> str:
    roles = ROLE_RE.findall(text[max(0, pos - 1200) : pos])
    return roles[-1] if roles else "?"


def bucket_role(role: str) -> str:
    m = {
        "rail/rit": {"rail", "rit"},
        "wh": {"wh"},
        "dl": {"dl"},
        "topbar": {"tb", "topbar", "tr", "net", "wal", "lang"},
        "faq": {"qa", "qhd"},
        "box-meta": {"box", "meta", "r", "tk", "m", "num", "pct", "hint"},
        "stat-card": {"sc", "ovc", "tc", "stg", "pcard", "scard", "lf", "pc"},
        "table": {"tbl", "th", "td"},
        "cta": {"cta", "claim", "btn", "btn-contract", "s2", "share", "swap", "ham"},
        "home": {"hero", "nav", "footer", "sechead", "links", "sleft", "hd", "Group"},
    }
    for name, roles in m.items():
        if role in roles:
            return name
    if role.startswith("ic-") or role in ("Frame", "Ellipse", "g"):
        return "chrome"
    return "other"


def main() -> None:
    typo = Counter()
    typo_bucket: dict[int, Counter] = defaultdict(Counter)
    gap_px = Counter()
    pad_px = Counter()
    space_props = Counter()
    color_var = Counter()
    raw_hex = Counter()
    radius = Counter()
    shadow = Counter()

    for path in sorted(RAW.glob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"text-\[(\d+(?:\.\d+)?)px\]", text):
            px = int(round(float(m.group(1))))
            typo[px] += 1
            typo_bucket[px][bucket_role(role_at(text, m.start()))] += 1

        for m in re.finditer(r"\b(gap|p|px|py|pt|pb|pl|pr)-\[(\d+(?:\.\d+)?)px\]", text):
            prop, val = m.group(1), float(m.group(2))
            pi = int(val) if val == int(val) else val
            space_props[f"{prop}-{pi}"] += 1
            if prop == "gap":
                gap_px[pi] += 1
            else:
                pad_px[pi] += 1

        for m in re.finditer(
            r"var\(--((?:text|bg|border|accent|functional)[^,)\\]*(?:\\\/[^,)\\]*)*)", text
        ):
            v = m.group(1).replace("\\/", "/").split(",")[0].strip()
            color_var[v] += 1
        for m in re.finditer(r"#([0-9a-fA-F]{6})\b", text):
            raw_hex["#" + m.group(1).lower()] += 1

        for m in re.finditer(r"rounded-\[(\d+(?:\.\d+)?)px\]", text):
            radius[int(round(float(m.group(1))))] += 1
        if "radius\\/pill" in text or "rounded-[999px]" in text:
            radius["pill/999"] += text.count("radius\\/pill") + text.count("rounded-[999px]")
        for m in re.finditer(r"shadow-\[([^\]]+)\]", text):
            shadow[m.group(1)[:80]] += 1

    out = {
        "typography": {
            str(k): {"count": v, "buckets": dict(typo_bucket[k].most_common(8))}
            for k, v in typo.most_common()
        },
        "gap_px": {str(k): v for k, v in gap_px.most_common()},
        "padding_px": {str(k): v for k, v in pad_px.most_common()},
        "space_props_top40": dict(space_props.most_common(40)),
        "color_vars": dict(color_var.most_common()),
        "raw_hex": dict(raw_hex.most_common()),
        "radius": {str(k): v for k, v in radius.most_common()},
        "shadow_top10": dict(shadow.most_common(10)),
        "summary": {
            "typo_distinct": len(typo),
            "typo_nodes": sum(typo.values()),
            "gap_distinct_px": len(gap_px),
            "pad_distinct_px": len(pad_px),
            "color_var_distinct": len(color_var),
            "raw_hex_distinct": len(raw_hex),
            "radius_distinct": len(radius),
            "shadow_distinct": len(shadow),
        },
    }
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    print(json.dumps(out["summary"], indent=2))


if __name__ == "__main__":
    main()
