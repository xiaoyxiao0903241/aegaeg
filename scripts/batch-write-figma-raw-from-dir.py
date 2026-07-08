#!/usr/bin/env python3
"""Persist all *.txt MCP exports from a directory into docs/figma-export/raw/."""
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


def node_from_body(body: str) -> str | None:
    m = re.search(r'data-node-id="(\d+:\d+)"', body)
    return m.group(1) if m else None


def persist_file(src: Path) -> Path | None:
    body = clean(src.read_text(errors="ignore"))
    nid = node_from_body(body)
    if not nid or "export default function" not in body:
        return None
    RAW.mkdir(parents=True, exist_ok=True)
    dest = RAW / f"{nid.replace(':', '-')}.tsx"
    dest.write_text(body)
    return dest


def main() -> None:
    staging = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "docs/figma-export/.staging"
    if not staging.is_dir():
        print(f"missing staging dir: {staging}", file=sys.stderr)
        sys.exit(1)
    saved = []
    for src in sorted(staging.glob("*.txt")):
        dest = persist_file(src)
        if dest:
            saved.append(dest)
            print(dest.relative_to(ROOT))
    print(f"saved {len(saved)} file(s)")


if __name__ == "__main__":
    main()
