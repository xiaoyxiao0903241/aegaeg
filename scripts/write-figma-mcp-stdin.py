#!/usr/bin/env python3
"""Read Figma MCP get_design_context body from stdin; write docs/figma-export/raw/{node}.tsx."""
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


def main() -> None:
    body = clean(sys.stdin.read())
    m = re.search(r'data-node-id="(\d+:\d+)"', body)
    if not m or "export default function" not in body:
        print("invalid export body", file=sys.stderr)
        sys.exit(1)
    nid = m.group(1)
    RAW.mkdir(parents=True, exist_ok=True)
    dest = RAW / f"{nid.replace(':', '-')}.tsx"
    dest.write_text(body)
    print(dest.relative_to(ROOT))


if __name__ == "__main__":
    main()
