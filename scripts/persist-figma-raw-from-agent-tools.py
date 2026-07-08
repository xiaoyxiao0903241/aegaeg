#!/usr/bin/env python3
"""Copy Figma MCP exports from agent-tools cache into docs/figma-export/raw/."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT_TOOLS = Path.home() / ".cursor/projects/Users-ava-Documents-Projects-aegis/agent-tools"
RAW = ROOT / "docs/figma-export/raw"

INVENTORY_IDS = {
    "7:2", "151:1129", "12:2", "182:17", "31:2", "4150:16993", "4150:3116", "32:2", "33:2",
    "151:866", "40:56", "41:13", "53:2", "62:2", "101:347", "4004:349", "100:197", "63:2",
    "4150:164", "64:2", "64:111", "74:3", "75:2", "76:2", "77:2", "77:76", "82:430",
    "4123:156", "4161:683", "4161:936", "4172:223",
}

ROOT_REACT = re.compile(
    r'data-node-id="([^"]+)"[^>]*data-name="([^"]+)"'
    r'|data-name="([^"]+)"[^>]*data-node-id="([^"]+)"'
)
ROOT_XML = re.compile(r'^<frame id="([^"]+)"', re.M)


def root_node(text: str) -> str | None:
    if "export default function" in text or "data-node-id=" in text:
        m = ROOT_REACT.search(text)
        if m:
            return m.group(1) or m.group(4)
    if text.lstrip().startswith("<frame "):
        m = ROOT_XML.search(text)
        if m:
            return m.group(1)
    return None


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    copied = 0
    for f in sorted(AGENT_TOOLS.glob("*.txt"), key=lambda p: p.stat().st_mtime):
        text = f.read_text(errors="ignore")
        nid = root_node(text)
        if not nid or nid not in INVENTORY_IDS:
            continue
        safe = nid.replace(":", "-")
        ext = ".xml" if text.lstrip().startswith("<frame ") else ".tsx"
        dest = RAW / f"{safe}{ext}"
        if not dest.exists() or f.stat().st_mtime > dest.stat().st_mtime:
            shutil.copy2(f, dest)
            copied += 1
            print(f"copied {nid} -> {dest.name}")
    print(f"done, {copied} updated")


if __name__ == "__main__":
    main()
