#!/usr/bin/env python3
"""Extract design tokens from Figma MCP design_context exports.

Sources (merged, deduped by node-id):
  - docs/figma-export/raw/*.tsx
  - ~/.cursor/projects/.../agent-tools/*.txt

Outputs to docs/figma-export/ — typography, spacing, colors per frame.
Ignores img/asset URLs per project scope.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT_TOOLS = Path.home() / ".cursor/projects/Users-ava-Documents-Projects-aegis/agent-tools"
OUT = ROOT / "docs/figma-export"
RAW = OUT / "raw"

# 31 UI page frames — figma-pages-inventory.md §2
INVENTORY_31: list[dict[str, str]] = [
    {"nodeId": "7:2", "title": "Homepage"},
    {"nodeId": "151:1129", "title": "Homepage (viewport)"},
    {"nodeId": "12:2", "title": "DApp — Swap"},
    {"nodeId": "182:17", "title": "DApp — Swap (collapsed)"},
    {"nodeId": "31:2", "title": "DApp — Genesis"},
    {"nodeId": "4150:16993", "title": "DApp — Genesis variant"},
    {"nodeId": "4150:3116", "title": "DApp — Genesis variant"},
    {"nodeId": "32:2", "title": "DApp — Rewards"},
    {"nodeId": "33:2", "title": "DApp — Community disconnected"},
    {"nodeId": "151:866", "title": "Slippage Tolerance"},
    {"nodeId": "40:56", "title": "Modal — Wallet Detail"},
    {"nodeId": "41:13", "title": "Drawer — Mobile Nav"},
    {"nodeId": "53:2", "title": "H5 — Homepage"},
    {"nodeId": "62:2", "title": "H5 — Swap"},
    {"nodeId": "101:347", "title": "H5 — Swap variant"},
    {"nodeId": "4004:349", "title": "H5 — Swap variant"},
    {"nodeId": "100:197", "title": "H5 — Swap variant"},
    {"nodeId": "63:2", "title": "H5 — Genesis"},
    {"nodeId": "4150:164", "title": "H5 — Genesis variant"},
    {"nodeId": "64:2", "title": "H5 — Rewards"},
    {"nodeId": "64:111", "title": "H5 — Community"},
    {"nodeId": "74:3", "title": "DApp — Swap disconnected"},
    {"nodeId": "75:2", "title": "DApp — Community connected"},
    {"nodeId": "76:2", "title": "Tooltips spec"},
    {"nodeId": "77:2", "title": "H5 — Swap disconnected"},
    {"nodeId": "77:76", "title": "H5 — Community connected"},
    {"nodeId": "82:430", "title": "DApp — Community connected"},
    {"nodeId": "4123:156", "title": "DApp — Rewards variant"},
    {"nodeId": "4161:683", "title": "DApp — 兑换主页"},
    {"nodeId": "4161:936", "title": "DApp — 闪兑"},
    {"nodeId": "4172:223", "title": "DApp — 交易"},
]
INVENTORY_IDS = {f["nodeId"] for f in INVENTORY_31}

TEXT_SIZE = re.compile(r"text-\[(\d+(?:\.\d+)?)px\]")
TEXT_VAR = re.compile(r"text-\[color:var\(--([^)]+)\)")
TEXT_HEX = re.compile(r"text-\[#([0-9a-fA-F]{3,8})\]")
FONT_WEIGHT = re.compile(r"font-(?:\['Montserrat:([^']+)'\]|(normal|medium|semibold|bold))")
LEADING = re.compile(r"leading-\[([^\]]+)\]")
GAP = re.compile(r"gap-\[(\d+(?:\.\d+)?)px\]")
PADDING = re.compile(r"[p][xytblr]?-\[(\d+(?:\.\d+)?)px\]")
ROUNDED = re.compile(r"rounded-\[(\d+(?:\.\d+)?)px\]")
SHADOW = re.compile(r"shadow-\[([^\]]+)\]")
BG_VAR = re.compile(r"bg-\[var\(--([^)]+)\)")
BG_HEX = re.compile(r"bg-\[#([0-9a-fA-F]{3,8})\]")
BORDER_VAR = re.compile(r"border-\[var\(--([^)]+)\)")
TRACKING = re.compile(r"tracking-\[([^\]]+)\]")
DATA_NAME = re.compile(r'data-name="([^"]+)"')


def parse_file(path: Path) -> dict | None:
    text = path.read_text(errors="ignore")

    # React+Tailwind export
    if "data-node-id=" in text and "text-[" in text:
        root_match = re.search(
            r'data-node-id="([^"]+)"[^>]*data-name="([^"]+)"'
            r'|data-name="([^"]+)"[^>]*data-node-id="([^"]+)"',
            text,
        )
        if not root_match:
            return None
        if root_match.group(1):
            node_id, frame_name = root_match.group(1), root_match.group(2)
        else:
            frame_name, node_id = root_match.group(3), root_match.group(4)
        return _parse_react_export(text, node_id, frame_name, path.name)

    # Figma metadata XML fallback (large frames without forceCode)
    if text.lstrip().startswith("<frame "):
        return _parse_metadata_xml(text, path.name)

    return None


def _parse_react_export(text: str, node_id: str, frame_name: str, source: str) -> dict:
    typography: list[dict] = []
    for block in re.finditer(
        r'<p className="([^"]*)"[^>]*data-node-id="([^"]+)"[^>]*(?:data-name="([^"]*)")?',
        text,
    ):
        cls, nid, dname = block.group(1), block.group(2), block.group(3) or ""
        sizes = TEXT_SIZE.findall(cls)
        if not sizes:
            continue
        weights = FONT_WEIGHT.findall(cls)
        weight = weights[0][0] or weights[0][1] if weights else ""
        if "Montserrat:" in weight:
            weight = weight.replace("Montserrat:", "")
        typography.append(
            {
                "node": nid,
                "layer": dname,
                "sizePx": float(sizes[0]),
                "weight": weight,
                "leading": LEADING.findall(cls)[0] if LEADING.findall(cls) else None,
                "tracking": TRACKING.findall(cls)[0] if TRACKING.findall(cls) else None,
                "colorVar": TEXT_VAR.findall(cls),
                "colorHex": TEXT_HEX.findall(cls),
            }
        )

    layers = Counter(DATA_NAME.findall(text))
    for k in list(layers):
        if k in ("Frame", "Rectangle", "Group", "Vector"):
            del layers[k]

    return {
        "nodeId": node_id,
        "frameName": frame_name,
        "sourceFile": source,
        "exportKind": "react",
        "typography": typography,
        "typographySizeHistogram": dict(Counter(int(t["sizePx"]) for t in typography)),
        "gaps": dict(Counter(int(float(x)) for x in GAP.findall(text))),
        "paddings": dict(Counter(int(float(x)) for x in PADDING.findall(text))),
        "rounded": dict(Counter(int(float(x)) for x in ROUNDED.findall(text))),
        "colorVars": dict(Counter(TEXT_VAR.findall(text) + BG_VAR.findall(text) + BORDER_VAR.findall(text))),
        "colorHex": dict(Counter(TEXT_HEX.findall(text) + BG_HEX.findall(text))),
        "shadows": list(dict.fromkeys(SHADOW.findall(text)))[:8],
        "layers": dict(layers.most_common(30)),
        "textNodeCount": len(typography),
    }


def _parse_metadata_xml(text: str, source: str) -> dict | None:
    root = re.search(r'<frame id="([^"]+)" name="([^"]+)"', text)
    if not root:
        return None
    node_id, frame_name = root.group(1), root.group(2)
    typography: list[dict] = []
    for m in re.finditer(r'<text id="([^"]+)" name="([^"]+)"[^>]*height="(\d+)"', text):
        typography.append(
            {
                "node": m.group(1),
                "layer": m.group(2),
                "sizePx": float(m.group(3)),
                "weight": "",
                "leading": None,
                "tracking": None,
                "colorVar": [],
                "colorHex": [],
                "approxFromHeight": True,
            }
        )
    layers = Counter(re.findall(r'name="([^"]+)"', text))
    for k in list(layers):
        if k in ("Frame", "Rectangle", "Group", "Vector", frame_name):
            del layers[k]
    return {
        "nodeId": node_id,
        "frameName": frame_name,
        "sourceFile": source,
        "exportKind": "metadata-xml",
        "typography": typography,
        "typographySizeHistogram": dict(Counter(int(t["sizePx"]) for t in typography)),
        "gaps": {},
        "paddings": {},
        "rounded": {},
        "colorVars": {},
        "colorHex": {},
        "shadows": [],
        "layers": dict(layers.most_common(30)),
        "textNodeCount": len(typography),
    }


def sync_all_sources_to_raw(by_node: dict[str, tuple[Path, dict]]) -> None:
    """Persist best MCP snippet per inventory node into docs/figma-export/raw/."""
    RAW.mkdir(parents=True, exist_ok=True)
    for entry in INVENTORY_31:
        nid = entry["nodeId"]
        if nid not in by_node:
            continue
        src_path, parsed = by_node[nid]
        safe = nid.replace(":", "-")
        ext = ".xml" if parsed.get("exportKind") == "metadata-xml" else ".tsx"
        dest = RAW / f"{safe}{ext}"
        if not dest.exists() or dest.stat().st_mtime < src_path.stat().st_mtime:
            dest.write_text(src_path.read_text(errors="ignore"))


def collect_sources() -> dict[str, tuple[Path, dict]]:
    by_node: dict[str, tuple[Path, dict]] = {}
    sources: list[Path] = []
    if RAW.exists():
        sources.extend(sorted(RAW.glob("*.tsx")))
    if AGENT_TOOLS.exists():
        sources.extend(sorted(AGENT_TOOLS.glob("*.txt")))

    for f in sources:
        parsed = parse_file(f)
        if not parsed:
            continue
        nid = parsed["nodeId"]
        if nid not in by_node or parsed["textNodeCount"] > by_node[nid][1]["textNodeCount"]:
            by_node[nid] = (f, parsed)
    return by_node


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "frames").mkdir(exist_ok=True)

    by_node = collect_sources()
    sync_all_sources_to_raw(by_node)

    inventory_frames: list[dict] = []
    for entry in INVENTORY_31:
        nid = entry["nodeId"]
        if nid in by_node:
            inventory_frames.append(by_node[nid][1])
        else:
            inventory_frames.append(
                {
                    "nodeId": nid,
                    "frameName": entry["title"],
                    "sourceFile": None,
                    "typography": [],
                    "typographySizeHistogram": {},
                    "gaps": {},
                    "paddings": {},
                    "rounded": {},
                    "colorVars": {},
                    "colorHex": {},
                    "shadows": [],
                    "layers": {},
                    "textNodeCount": 0,
                    "missing": True,
                }
            )

    extracted = [f for f in inventory_frames if not f.get("missing")]
    for frame in extracted:
        safe = frame["nodeId"].replace(":", "-")
        out_frame = {k: v for k, v in frame.items() if k != "missing"}
        (OUT / "frames" / f"{safe}.json").write_text(
            json.dumps(out_frame, indent=2, ensure_ascii=False) + "\n"
        )

    def agg_counter(frames: list[dict], key: str) -> dict:
        return dict(
            Counter(
                k
                for f in frames
                for k, v in f.get(key, {}).items()
                for _ in range(v)
            )
        )

    agg = {
        "extractedAt": date.today().isoformat(),
        "figmaFile": "n8nD6qqAtikNhP3xuH8PRS",
        "inventoryTotal": len(INVENTORY_31),
        "inventoryExtracted": len(extracted),
        "inventoryMissing": [f["nodeId"] for f in inventory_frames if f.get("missing")],
        "extraFrames": sorted(
            nid for nid in by_node if nid not in INVENTORY_IDS
        ),
        "frames": [
            {
                "nodeId": parsed["nodeId"],
                "frameName": parsed["frameName"],
                "textNodes": parsed["textNodeCount"],
                "inInventory": parsed["nodeId"] in INVENTORY_IDS,
            }
            for _, parsed in sorted(by_node.values(), key=lambda x: x[1]["frameName"])
        ],
        "typographySizes": agg_counter(extracted, "typographySizeHistogram"),
        "gaps": agg_counter(extracted, "gaps"),
        "paddings": agg_counter(extracted, "paddings"),
        "rounded": agg_counter(extracted, "rounded"),
        "colorVars": agg_counter(extracted, "colorVars"),
        "colorHex": agg_counter(extracted, "colorHex"),
    }
    (OUT / "tokens-aggregated.json").write_text(json.dumps(agg, indent=2, ensure_ascii=False) + "\n")

    status_rows = []
    for entry in INVENTORY_31:
        nid = entry["nodeId"]
        if nid in by_node:
            f = by_node[nid][1]
            status_rows.append(
                {
                    "nodeId": nid,
                    "title": entry["title"],
                    "frameName": f["frameName"],
                    "textNodes": f["textNodeCount"],
                    "hasCode": True,
                }
            )
        else:
            status_rows.append(
                {"nodeId": nid, "title": entry["title"], "textNodes": 0, "hasCode": False}
            )
    (OUT / "inventory-status.json").write_text(
        json.dumps(status_rows, indent=2, ensure_ascii=False) + "\n"
    )

    lines = [
        "# Figma MCP 导出数据（设计 token 提取）",
        "",
        "> **来源**：Figma MCP `get_design_context` → React+Tailwind 代码",
        "> **持久化**：[`raw/`](./raw/)（每帧 `.tsx`）+ [`frames/*.json`](./frames/)（结构化 token）",
        "> **提取脚本**：[`scripts/extract-figma-design-tokens.py`](../../scripts/extract-figma-design-tokens.py)",
        "> **不含**：图标 / 图片 asset URL",
        "",
        f"**清单帧**：{len(INVENTORY_31)} · **已提取**：{len(extracted)} · **缺失**：{len(INVENTORY_31) - len(extracted)}",
        "",
        "## 帧索引（31 页面清单）",
        "",
        "| # | Node | Frame | 文本节点 | JSON | MCP |",
        "|---|------|-------|----------|------|-----|",
    ]
    for i, row in enumerate(status_rows, 1):
        safe = row["nodeId"].replace(":", "-")
        mcp = "✓" if row["hasCode"] else "—"
        json_link = f"[`frames/{safe}.json`](./frames/{safe}.json)" if row["hasCode"] else "—"
        name = row.get("frameName") or row["title"]
        lines.append(
            f"| {i} | `{row['nodeId']}` | {name} | {row['textNodes']} | {json_link} | {mcp} |"
        )

    if agg["inventoryMissing"]:
        lines += ["", "## 缺失帧", ""]
        for nid in agg["inventoryMissing"]:
            lines.append(f"- `{nid}`")

    lines += [
        "",
        "## 全量聚合（31 清单帧）",
        "",
        f"- [`tokens-aggregated.json`](./tokens-aggregated.json)",
        f"- [`inventory-status.json`](./inventory-status.json)",
        "",
        "### 字号频次（px）",
        "",
    ]
    for px, cnt in sorted(agg["typographySizes"].items(), key=lambda x: -int(x[0])):
        lines.append(f"- **{px}px**：{cnt}")

    lines += ["", "### 颜色 Variable（Top 20）", ""]
    for var, cnt in sorted(agg["colorVars"].items(), key=lambda x: -x[1])[:20]:
        lines.append(f"- `{var}` ×{cnt}")

    (OUT / "README.md").write_text("\n".join(lines) + "\n")
    print(f"Inventory: {len(extracted)}/{len(INVENTORY_31)} → {OUT}")


if __name__ == "__main__":
    main()
