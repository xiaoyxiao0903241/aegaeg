#!/usr/bin/env python3
"""Persist Figma MCP export bodies from staging/*.txt into docs/figma-export/raw/.

Usage:
  mkdir -p /tmp/aegis-figma-staging
  # paste each get_design_context body to /tmp/aegis-figma-staging/{node}.txt
  python3 scripts/fetch-figma-raw-via-mcp.py /tmp/aegis-figma-staging
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "docs/figma-export/raw"
FOOTER = "SUPER CRITICAL:"

TARGETS = [
    "182:17", "33:2", "101:347", "4004:349", "100:197", "63:2", "4150:164",
    "64:2", "64:111", "74:3", "76:2", "77:2", "77:76", "4161:936",
]


def clean(body: str) -> str:
    idx = body.find(FOOTER)
    if idx > 0:
        body = body[:idx]
    return body.rstrip() + "\n"


def persist(body: str) -> Path | None:
    body = clean(body)
    m = re.search(r'data-node-id="(\d+:\d+)"', body)
    if not m or "export default function" not in body:
        return None
    nid = m.group(1)
    RAW.mkdir(parents=True, exist_ok=True)
    dest = RAW / f"{nid.replace(':', '-')}.tsx"
    dest.write_text(body)
    return dest


def main() -> None:
    staging = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/aegis-figma-staging")
    saved: list[str] = []
    missing: list[str] = []
    for nid in TARGETS:
        safe = nid.replace(":", "-")
        candidates = list(staging.glob(f"{safe}*.txt")) + list(staging.glob(f"*{safe}*.txt"))
        dest = RAW / f"{safe}.tsx"
        if candidates:
            if persist(candidates[0].read_text(errors="ignore")):
                saved.append(nid)
                continue
        if dest.exists() and len(dest.read_text().splitlines()) > 50:
            saved.append(nid)
        else:
            missing.append(nid)
    print(f"saved_or_ok: {len(saved)}")
    print(f"missing: {missing}")


if __name__ == "__main__":
    main()
