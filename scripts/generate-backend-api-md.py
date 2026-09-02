#!/usr/bin/env python3
"""从 docs/backend-api/openapi.json 生成人读 api.md。冲突以 json 为准。"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / "docs" / "backend-api" / "openapi.json"
OUT = ROOT / "docs" / "backend-api" / "api.md"


def slug(name: str) -> str:
    s = name.replace("（", "-").replace("）", "")
    s = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", s, flags=re.UNICODE)
    return s.strip("-").lower()


def ref_name(schema: dict | None) -> str | None:
    if not schema:
        return None
    ref = schema.get("$ref")
    if isinstance(ref, str) and ref.startswith("#/components/schemas/"):
        return ref.rsplit("/", 1)[-1]
    return None


def schema_by_name(spec: dict, name: str) -> dict:
    return spec.get("components", {}).get("schemas", {}).get(name) or {}


def type_label(schema: dict) -> str:
    name = ref_name(schema)
    if name:
        return name
    t = schema.get("type")
    if t:
        return str(t)
    return "object"


def inline_props(spec: dict, schema: dict) -> str:
    name = ref_name(schema)
    body = schema_by_name(spec, name) if name else schema
    props = body.get("properties") or {}
    required = set(body.get("required") or [])
    if not props:
        return "{}"
    parts = []
    for key, prop in props.items():
        star = "*" if key in required else ""
        parts.append(f"`{key}`{star}:{type_label(prop)}")
    return "{" + ", ".join(parts) + "}"


def response_schema_label(spec: dict, schema: dict | None) -> str:
    if not schema:
        return ""
    name = ref_name(schema)
    if not name:
        return inline_props(spec, schema)
    body = schema_by_name(spec, name)
    props = body.get("properties") or {}
    if not props:
        return f"`{name}`"
    parts = []
    for key, prop in props.items():
        parts.append(f"`{key}`:{type_label(prop)}")
    return f"`{name}` " + "{" + ", ".join(parts) + "}"


def heading_auth(op: dict) -> str:
    security = op.get("security")
    if security == []:
        return "none"
    return "required"


def emit_operation(spec: dict, path: str, method: str, op: dict) -> list[str]:
    lines = [
        f"### `{method.upper()}` `{path}`",
        "",
        f"**{op.get('summary') or path}**",
        "",
        f"- auth: {heading_auth(op)}",
        "",
    ]
    desc = (op.get("description") or "").strip()
    if desc:
        lines.extend([desc, ""])
    rb = op.get("requestBody") or {}
    content = (rb.get("content") or {}).get("application/json") or {}
    schema = content.get("schema") or {}
    lines.append("**Request body**")
    lines.append("")
    if schema:
        name = ref_name(schema) or "object"
        lines.append(f"- `application/json`: `{name}` {inline_props(spec, schema)}")
    else:
        lines.append("- none")
    lines.append("")
    lines.append("|status|description|schema|")
    lines.append("|---|---|---|")
    for status, resp in (op.get("responses") or {}).items():
        desc_r = (resp or {}).get("description") or ""
        rschema = (
            ((resp or {}).get("content") or {}).get("application/json") or {}
        ).get("schema")
        lines.append(f"|{status}|{desc_r}|{response_schema_label(spec, rschema)}|")
    lines.append("")
    return lines


def main() -> None:
    spec = json.loads(SPEC.read_text(encoding="utf-8"))
    info = spec.get("info") or {}
    paths = spec.get("paths") or {}
    by_tag: dict[str, list[tuple[str, str, dict]]] = defaultdict(list)
    for path, item in paths.items():
        for method, op in item.items():
            if method.startswith("x-") or not isinstance(op, dict):
                continue
            tags = op.get("tags") or ["(untagged)"]
            by_tag[tags[0]].append((path, method, op))

    tag_order = [t.get("name") for t in spec.get("tags") or [] if t.get("name")]
    for extra in by_tag:
        if extra not in tag_order:
            tag_order.append(extra)

    lines: list[str] = [
        f"# {info.get('title') or 'API'}",
        "",
        f"> OpenAPI `{spec.get('openapi')}` · version `{info.get('version')}`  ",
        "> 机器真源：[`openapi.json`](./openapi.json)",
        "",
        info.get("description") or "",
        "",
        "## Servers",
        "",
    ]
    for server in spec.get("servers") or []:
        lines.append(f"- `{server.get('url')}`")
    lines.extend(["", "## Auth", "", "- **BearerAuth**：`http` `bearer`", "", "## Tag 索引", ""])
    for tag in tag_order:
        ops = by_tag.get(tag) or []
        if not ops:
            continue
        lines.append(f"- [{tag}](#{slug(tag)})（{len(ops)}）")
    lines.append("")

    tags_meta = {t.get("name"): t for t in spec.get("tags") or []}
    for tag in tag_order:
        ops = by_tag.get(tag) or []
        if not ops:
            continue
        lines.extend([f"## {tag}", ""])
        tag_desc = (tags_meta.get(tag) or {}).get("description") or ""
        if tag_desc:
            lines.extend([tag_desc.strip(), ""])
        ops.sort(key=lambda row: row[0])
        for path, method, op in ops:
            lines.extend(emit_operation(spec, path, method, op))

    OUT.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
