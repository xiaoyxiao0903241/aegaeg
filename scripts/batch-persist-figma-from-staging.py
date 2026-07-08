#!/usr/bin/env python3
"""Persist all .txt bodies from a staging dir into docs/figma-export/raw/."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "docs/figma-export/raw"
FOOTER = "SUPER CRITICAL:"


def clean(body: str) -> str:
    idx = body.find(FOOTER)
    if idx > 0:
        body = body[:idx]
    return body.rstrip() + "\n"


def persist(src: Path) -> Path | None:
    body = clean(src.read_text(errors="ignore"))
    m = re.search(r'data-node-id="(\d+:\d+)"', body)
    if not m or "export default function" not in body:
        print(f"skip invalid: {src.name}", file=sys.stderr)
        return None
    nid = m.group(1)
    RAW.mkdir(parents=True, exist_ok=True)
    dest = RAW / f"{nid.replace(':', '-')}.tsx"
    dest.write_text(body)
    print(dest.relative_to(ROOT), len(body.splitlines()))
    return dest


def main() -> None:
    staging = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/aegis-figma-staging")
    if not staging.is_dir():
        print(f"missing staging dir: {staging}", file=sys.stderr)
        sys.exit(1)
    saved = [p for f in sorted(staging.glob("*.txt")) if (p := persist(f))]
    print(f"saved {len(saved)} file(s)")


if __name__ == "__main__":
    main()
