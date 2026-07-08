#!/usr/bin/env python3
"""Write stdin (MCP get_design_context body) to docs/figma-export/.staging/{name}.txt."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/figma-export/.staging"


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: mcp-body-to-staging.py <safe-id>", file=sys.stderr)
        sys.exit(1)
    safe = sys.argv[1]
    STAGING.mkdir(parents=True, exist_ok=True)
    body = sys.stdin.read()
    dest = STAGING / f"{safe}.txt"
    dest.write_text(body)
    print(dest.relative_to(ROOT))
    subprocess.run(
        [sys.executable, str(ROOT / "scripts/write-figma-mcp-stdin.py")],
        input=body,
        text=True,
        check=True,
        cwd=ROOT,
    )


if __name__ == "__main__":
    main()
