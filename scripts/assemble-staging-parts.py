#!/usr/bin/env python3
"""Assemble staging parts and persist to raw/."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/figma-export/.staging"
PARTS = STAGING / "parts"
WRITE = ROOT / "scripts/write-figma-mcp-stdin.py"

ASSEMBLY = {
    "63-2": ["63-2-a.txt", "63-2-b.txt", "63-2-c.txt"],
    "4150-164": ["4150-164-a.txt", "4150-164-b.txt", "4150-164-c.txt"],
    "64-111": ["64-111-a.txt", "64-111-b.txt", "64-111-c.txt"],
    "4161-936": ["4161-936-a.txt", "4161-936-b.txt", "4161-936-c.txt", "4161-936-d.txt"],
}


def main() -> None:
    targets = sys.argv[1:] or list(ASSEMBLY)
    for safe in targets:
        files = ASSEMBLY.get(safe)
        if not files:
            continue
        body = "".join((PARTS / f).read_text() for f in files)
        dest = STAGING / f"{safe}.txt"
        dest.write_text(body)
        subprocess.run(
            [sys.executable, str(WRITE)],
            input=body,
            text=True,
            check=True,
            cwd=ROOT,
        )
        raw = ROOT / "docs/figma-export/raw" / f"{safe}.tsx"
        print(f"{safe}: staging={len(body.splitlines())} raw={len(raw.read_text().splitlines())}")


if __name__ == "__main__":
    main()
