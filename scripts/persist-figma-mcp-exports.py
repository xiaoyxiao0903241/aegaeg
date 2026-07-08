#!/usr/bin/env python3
"""Write Figma MCP get_design_context exports to docs/figma-export/raw/.

Usage: python3 scripts/persist-figma-mcp-exports.py <node-id> <source.txt> ...
Or:    python3 scripts/persist-figma-mcp-exports.py --from-agent-tools

Strips MCP footer after 'SUPER CRITICAL:'.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "docs/figma-export/raw"
AGENT_TOOLS = Path.home() / ".cursor/projects/Users-ava-Documents-Projects-aegis/agent-tools"
FOOTER = "SUPER CRITICAL:"


def clean(body: str) -> str:
    idx = body.find(FOOTER)
    if idx > 0:
        body = body[:idx]
    return body.rstrip() + "\n"


def node_from_body(body: str) -> str | None:
    m = re.search(r'data-node-id="(\d+:\d+)"', body)
    return m.group(1) if m else None


def persist_body(body: str) -> Path | None:
    body = clean(body)
    nid = node_from_body(body)
    if not nid or "export default function" not in body:
        return None
    RAW.mkdir(parents=True, exist_ok=True)
    dest = RAW / f"{nid.replace(':', '-')}.tsx"
    dest.write_text(body)
    return dest


def from_file(src: Path) -> Path | None:
    return persist_body(src.read_text(errors="ignore"))


def from_agent_tools() -> list[Path]:
    saved: list[Path] = []
    if not AGENT_TOOLS.exists():
        return saved
    for f in sorted(AGENT_TOOLS.glob("*.txt")):
        dest = from_file(f)
        if dest and dest not in saved:
            saved.append(dest)
    return saved


def main() -> None:
    saved: list[Path] = []
    if len(sys.argv) == 2 and sys.argv[1] == "--from-agent-tools":
        saved = from_agent_tools()
    else:
        args = sys.argv[1:]
        if len(args) % 2:
            print("Usage: persist-figma-mcp-exports.py <node-id> <file> ...", file=sys.stderr)
            sys.exit(1)
        for i in range(0, len(args), 2):
            src = Path(args[i + 1])
            dest = from_file(src)
            if dest:
                saved.append(dest)
    for p in saved:
        print(p.relative_to(ROOT))
    print(f"saved {len(saved)} file(s)")


if __name__ == "__main__":
    main()
