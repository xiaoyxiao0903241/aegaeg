#!/usr/bin/env python3
"""Write stdin MCP body to docs/figma-export/.staging/{safe-id}.txt."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/figma-export/.staging"


def main() -> None:
    safe = sys.argv[1]
    body = sys.stdin.read()
    STAGING.mkdir(parents=True, exist_ok=True)
    dest = STAGING / f"{safe}.txt"
    dest.write_text(body)
    print(dest.relative_to(ROOT), len(body.splitlines()))


if __name__ == "__main__":
    main()
