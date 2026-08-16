#!/usr/bin/env python3
"""校验 docs/onchain-manual 的 Markdown 与 ABI 是否和 HTML 原文一致。"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANUAL = ROOT / "docs" / "onchain-manual"
HTML_PATH = MANUAL / "AEGIS_X_FRONTEND_MANUAL.html"
EXPECTED_SHA256 = "549465718a31e92f510c5e1a543d08047c7d4e01986e8b7ec5daa19525f2d342"

# HTML 页面骨架与路径元信息，不属于正文。
IGNORE_HTML_LINES = {
    "前端接入主指南",
    "docs/FRONTEND_INTEGRATION_GUIDE.md",
}


def die(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    raise SystemExit(1)


def article_title(body: str) -> str:
    match = re.search(r"<h1[^>]*>(.*?)</h1>", body, flags=re.I | re.S)
    return re.sub(r"<[^>]+>", "", match.group(1)).strip() if match else ""


def html_content_lines(body: str) -> list[str]:
    text = re.sub(r"<pre[\s\S]*?</pre>", "\n", body, flags=re.I)
    text = re.sub(r"<button[\s\S]*?</button>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "\n", text)
    text = unescape(text)
    skip = {
        "Copy-ready contract ABI",
        "完整 ABI",
        "展开查看 ABI JSON",
        "单合约使用文档",
        "entries",
        "functions",
        "events",
        "errors",
        "ABI",
        "部署 key",
        "方法",
        "说明",
        "监听",
    }
    out: list[str] = []
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip()
        if not line or line in skip:
            continue
        if re.fullmatch(r"\d+", line):
            continue
        if line.startswith("docs/contracts/") or (
            line.startswith("abi/") and line.endswith(".json")
        ):
            continue
        if line.startswith("SHA-256"):
            continue
        out.append(line)
    return out


def collapse(value: str) -> str:
    return re.sub(r"\s+", "", value).lower()


def main() -> None:
    if not HTML_PATH.is_file():
        die(f"missing HTML SSOT: {HTML_PATH}")

    digest = hashlib.sha256(HTML_PATH.read_bytes()).hexdigest()
    if digest != EXPECTED_SHA256:
        die(f"HTML sha256 changed: {digest} (expected {EXPECTED_SHA256})")

    html = HTML_PATH.read_text(encoding="utf-8")

    # --- 地址清单 ---
    rows = re.findall(r"<tr data-address-row[^>]*>(.*?)</tr>", html, flags=re.S)
    html_map: dict[str, str] = {}
    for body in rows:
        key = re.search(r"<td><code>([^<]+)</code></td>", body)
        addr = re.search(r'data-copy="(0x[a-fA-F0-9]{40})"', body)
        if not key or not addr:
            die("failed to parse address row")
        html_map[key.group(1)] = addr.group(1)

    md_addr = (MANUAL / "00-addresses.md").read_text(encoding="utf-8")
    md_map = {
        k: v
        for k, v in re.findall(
            r"`([A-Za-z0-9_]+)`\s*\|\s*\[`(0x[a-fA-F0-9]{40})`\]", md_addr
        )
    }
    if html_map != md_map:
        die(f"address catalog mismatch: html={len(html_map)} md={len(md_map)}")

    # --- ABI 集合 ---
    html_abis: set[str] = set()
    for body in re.findall(r"<pre[^>]*>(.*?)</pre>", html, flags=re.I | re.S):
        text = unescape(re.sub(r"<[^>]+>", "", body)).strip()
        if not (text.startswith("[") and '"inputs"' in text[:200]):
            continue
        abi = json.loads(text)
        html_abis.add(
            hashlib.sha256(
                json.dumps(abi, sort_keys=True, separators=(",", ":")).encode()
            ).hexdigest()
        )

    md_abis: set[str] = set()
    for path in sorted((MANUAL / "abis").glob("*.json")):
        abi = json.loads(path.read_text(encoding="utf-8"))
        md_abis.add(
            hashlib.sha256(
                json.dumps(abi, sort_keys=True, separators=(",", ":")).encode()
            ).hexdigest()
        )

    if html_abis != md_abis:
        die(f"ABI set mismatch: html={len(html_abis)} md={len(md_abis)}")

    # --- 正文：HTML 出现的行都应在对应 Markdown 中 ---
    articles = re.findall(r"<article([^>]*)>(.*?)</article>", html, flags=re.I | re.S)
    title_to_md = {
        path.read_text(encoding="utf-8").splitlines()[0].lstrip("# ").strip(): path
        for path in (MANUAL / "contracts").glob("*.md")
    }

    missing_total = 0
    checked_total = 0
    gaps: list[dict] = []

    for _attrs, body in articles:
        title = article_title(body)
        if not title or title == "所选主网发布地址":
            continue
        if "对接与功能流程" in title:
            md_text = (MANUAL / "01-frontend-integration-guide.md").read_text(
                encoding="utf-8"
            )
            label = "01-frontend-integration-guide.md"
        else:
            path = title_to_md.get(title)
            if path is None:
                die(f"no markdown for HTML article: {title}")
            md_text = path.read_text(encoding="utf-8")
            label = path.name

        md_collapsed = collapse(md_text)
        miss: list[str] = []
        for line in html_content_lines(body):
            if line == title or line in IGNORE_HTML_LINES:
                continue
            if (
                len(line) < 12
                and not re.search(r"[\u4e00-\u9fff]", line)
                and "0x" not in line
                and "(" not in line
            ):
                continue
            checked_total += 1
            if collapse(line) not in md_collapsed:
                miss.append(line)
        missing_total += len(miss)
        if miss:
            gaps.append({"file": label, "missing": miss[:10], "count": len(miss)})

    if missing_total:
        die(f"HTML prose missing from markdown: {missing_total} lines; sample={gaps[:3]}")

    report = {
        "html_sha256": digest,
        "addresses": len(html_map),
        "abis": len(md_abis),
        "meaningful_html_lines_checked": checked_total,
        "missing_in_md_lines": 0,
        "status": "PASS",
    }
    (MANUAL / "HTML_FIDELITY_REPORT.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        "PASS: HTML↔markdown fidelity "
        f"(addresses={len(html_map)}, abis={len(md_abis)}, lines={checked_total})"
    )


if __name__ == "__main__":
    main()
