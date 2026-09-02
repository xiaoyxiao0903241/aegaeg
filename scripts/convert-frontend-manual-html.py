#!/usr/bin/env python3
"""将 AEGIS_X_FRONTEND_MANUAL.html 转为 docs/onchain-manual 下的 Markdown + ABI。

依赖：lxml（`pip install lxml`）。

用法：
  python3 scripts/convert-frontend-manual-html.py
  python3 scripts/convert-frontend-manual-html.py --out /tmp/aegis-manual-md-new

默认写回 docs/onchain-manual：重建 contracts/ 与 abis/，覆盖
00-addresses.md / 01-frontend-integration-guide.md / README.md；
不触碰 AEGIS_X_FRONTEND_MANUAL.html 与 HTML_FIDELITY_REPORT.json。

转换后请更新 scripts/verify-frontend-manual-html-fidelity.py 的 EXPECTED_SHA256，
再跑该校验脚本。
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

try:
    from lxml import html as lhtml
except ImportError:  # pragma: no cover
    print("FAIL: need lxml (`pip install lxml`)", file=sys.stderr)
    raise SystemExit(1)

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_HTML = ROOT / "docs" / "onchain-manual" / "AEGIS_X_FRONTEND_MANUAL.html"
DEFAULT_OUT = ROOT / "docs" / "onchain-manual"

SKIP_CLASS_SUBSTR = (
    "sidebar",
    "toc-rail",
    "topbar",
    "search-empty",
    "nav-group",
    "brand",
    "top-actions",
    "copy-address",
    "copy-abi",
    "copy-code",
    "address-shortcut",
    "manual-meta",
    "skip-link",
)


def text_of(el) -> str:
    return re.sub(r"\s+", " ", "".join(el.itertext())).strip()


def should_skip(el) -> bool:
    cls = el.get("class") or ""
    return any(s in cls for s in SKIP_CLASS_SUBSTR)


def inline_md(el) -> str:
    parts: list[str] = []
    if el.text:
        parts.append(el.text)
    for child in el:
        tag = child.tag.lower() if isinstance(child.tag, str) else ""
        if tag == "br":
            parts.append("  \n")
        elif tag in ("strong", "b"):
            parts.append(f"**{inline_md(child)}**")
        elif tag in ("em", "i"):
            parts.append(f"*{inline_md(child)}*")
        elif tag == "code":
            parts.append(f"`{text_of(child)}`")
        elif tag == "a":
            href = child.get("href") or ""
            label = inline_md(child) or href
            if href.startswith("#") or not href:
                parts.append(label)
            else:
                parts.append(f"[{label}]({href})")
        elif tag in ("span", "mark", "div"):
            parts.append(inline_md(child))
        elif tag == "img":
            parts.append(f'![{child.get("alt") or ""}]({child.get("src") or ""})')
        else:
            parts.append(inline_md(child))
        if child.tail:
            parts.append(child.tail)
    return "".join(parts)


def cell_md(el) -> str:
    return inline_md(el).replace("|", "\\|").replace("\n", " ").strip()


def table_md(table) -> str:
    rows: list[list[str]] = []
    for tr in table.xpath(".//tr"):
        cells = tr.xpath("./th|./td")
        if cells:
            rows.append([cell_md(c) for c in cells])
    if not rows:
        return ""
    width = max(len(r) for r in rows)
    rows = [r + [""] * (width - len(r)) for r in rows]
    lines = [
        "| " + " | ".join(rows[0]) + " |",
        "| " + " | ".join(["---"] * width) + " |",
    ]
    for r in rows[1:]:
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


def code_block(code_text: str, lang: str = "") -> str:
    code_text = code_text.replace("\r\n", "\n").strip("\n")
    fence = "````" if "```" in code_text else "```"
    return f"{fence}{lang}\n{code_text}\n{fence}"


def cleanup_md(md: str) -> str:
    md = re.sub(r"\n{3,}", "\n\n", md)
    md = re.sub(r"[ \t]+\n", "\n", md)
    return md.strip() + "\n"


def element_to_md(
    el,
    *,
    abi_dir: Path,
    abi_sink: list[str] | None,
    article_slug: str,
    depth: int = 0,
) -> str:
    if not isinstance(el.tag, str):
        return ""
    tag = el.tag.lower()
    if tag in ("script", "style", "noscript", "svg", "button", "input", "template"):
        return ""
    if should_skip(el):
        return ""

    if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        title = text_of(el)
        if title:
            return "\n" + "#" * int(tag[1]) + " " + title + "\n"
        return ""

    if tag == "p":
        t = inline_md(el).strip()
        return (t + "\n") if t else ""

    if tag == "blockquote":
        chunks = [
            element_to_md(
                child,
                abi_dir=abi_dir,
                abi_sink=abi_sink,
                article_slug=article_slug,
                depth=depth + 1,
            )
            for child in el
        ]
        text = "\n".join(x for x in chunks if x).strip()
        if not text:
            text = inline_md(el).strip()
        quoted = "\n".join(("> " + line) if line else ">" for line in text.splitlines())
        return quoted + "\n"

    if tag == "hr":
        return "\n---\n"

    if tag in ("ul", "ol"):
        items: list[str] = []
        for i, li in enumerate(el.xpath("./li"), 1):
            prefix = f"{i}. " if tag == "ol" else "- "
            chunks: list[str] = []
            if li.text and li.text.strip():
                chunks.append(li.text.strip())
            for child in li:
                ctag = child.tag.lower() if isinstance(child.tag, str) else ""
                if ctag in ("ul", "ol"):
                    nested = element_to_md(
                        child,
                        abi_dir=abi_dir,
                        abi_sink=abi_sink,
                        article_slug=article_slug,
                        depth=depth + 1,
                    )
                    nested = "\n".join(("  " + line) for line in nested.splitlines())
                    chunks.append("\n" + nested)
                elif ctag == "p":
                    chunks.append(inline_md(child).strip())
                elif ctag in ("pre", "table", "blockquote", "details"):
                    chunks.append(
                        "\n"
                        + element_to_md(
                            child,
                            abi_dir=abi_dir,
                            abi_sink=abi_sink,
                            article_slug=article_slug,
                            depth=depth + 1,
                        )
                    )
                else:
                    chunks.append(inline_md(child).strip())
                if child.tail and child.tail.strip():
                    chunks.append(child.tail.strip())
            item = re.sub(r" +\n", "\n", " ".join(c for c in chunks if c).strip())
            items.append(prefix + item)
        return "\n".join(items) + "\n"

    if tag == "table":
        return table_md(el) + "\n"

    if tag == "pre":
        code_el = el.find(".//code")
        code = ""
        if code_el is not None:
            code = "".join(code_el.itertext())
        if not code:
            code = "".join(el.itertext())
        stripped = code.strip()
        lang = ""
        if code_el is not None:
            m = re.search(r"language-([a-zA-Z0-9_+-]+)", code_el.get("class") or "")
            if m:
                lang = m.group(1)
        if stripped.startswith("[") or stripped.startswith("{"):
            try:
                parsed = json.loads(stripped)
                lang = "json"
                if (
                    abi_sink is not None
                    and isinstance(parsed, list)
                    and parsed
                    and isinstance(parsed[0], dict)
                    and "type" in parsed[0]
                ):
                    abi_name = f"{article_slug}.json"
                    (abi_dir / abi_name).write_text(
                        json.dumps(parsed, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8",
                    )
                    abi_sink.append(abi_name)
                    rel = (
                        f"../abis/{abi_name}"
                        if article_slug != "frontend-integration-guide"
                        else f"abis/{abi_name}"
                    )
                    return f"\n完整 ABI 已导出为 [`abis/{abi_name}`]({rel})（{len(parsed)} entries）。\n"
            except Exception:
                pass
        return code_block(code, lang) + "\n"

    if tag == "details":
        summary = el.find("./summary")
        title = text_of(summary) if summary is not None else "详情"
        parts = [f"\n<details>\n<summary>{title}</summary>\n"]
        for child in el:
            if child is summary:
                continue
            parts.append(
                element_to_md(
                    child,
                    abi_dir=abi_dir,
                    abi_sink=abi_sink,
                    article_slug=article_slug,
                    depth=depth + 1,
                )
            )
        parts.append("\n</details>\n")
        return "\n".join(parts)

    parts: list[str] = []
    if el.text and el.text.strip() and tag not in {
        "div",
        "section",
        "article",
        "main",
        "header",
        "footer",
        "aside",
        "figure",
        "td",
        "th",
        "li",
    }:
        parts.append(el.text.strip())
    for child in el:
        parts.append(
            element_to_md(
                child,
                abi_dir=abi_dir,
                abi_sink=abi_sink,
                article_slug=article_slug,
                depth=depth + 1,
            )
        )
    return "\n".join(x for x in parts if x)


def convert(html_path: Path, out_dir: Path) -> None:
    if not html_path.is_file():
        print(f"FAIL: missing HTML: {html_path}", file=sys.stderr)
        raise SystemExit(1)

    abi_dir = out_dir / "abis"
    contracts_dir = out_dir / "contracts"
    out_dir.mkdir(parents=True, exist_ok=True)
    for sub in (abi_dir, contracts_dir):
        if sub.exists():
            shutil.rmtree(sub)
        sub.mkdir(parents=True)

    parser = lhtml.HTMLParser(recover=True, huge_tree=True)
    root = lhtml.parse(str(html_path), parser=parser).getroot()

    addr = root.get_element_by_id("mainnet-addresses")
    if addr is None:
        print("FAIL: #mainnet-addresses not found", file=sys.stderr)
        raise SystemExit(1)
    (out_dir / "00-addresses.md").write_text(
        cleanup_md("# 所选主网发布地址\n\n" + element_to_md(
            addr,
            abi_dir=abi_dir,
            abi_sink=None,
            article_slug="addresses",
        )),
        encoding="utf-8",
    )

    articles = root.xpath(
        '//*[contains(concat(" ", normalize-space(@class), " "), " doc-article ")]'
    )
    index_rows: list[tuple[str, str, bool]] = []
    for art in articles:
        art_id = art.get("id") or "unknown"
        h1 = art.find(".//h1")
        title = text_of(h1) if h1 is not None else art_id

        if art_id == "doc-frontend-integration-guide":
            slug = "frontend-integration-guide"
            fname = "01-frontend-integration-guide.md"
            rel_prefix = ""
        else:
            slug = art_id.replace("doc-contracts-", "").replace("doc-", "")
            slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", slug).strip("-") or "article"
            fname = f"contracts/{slug}.md"
            rel_prefix = "../"

        abi_sink: list[str] = []
        body = element_to_md(
            art,
            abi_dir=abi_dir,
            abi_sink=abi_sink,
            article_slug=slug,
        )
        body_clean = re.sub(rf"^\s*#\s+{re.escape(title)}\s*\n+", "", body)

        header_lines = [f"# {title}", "", f"> 来源：`{art_id}`"]
        if abi_sink:
            links = ", ".join(f"[`abis/{n}`]({rel_prefix}abis/{n})" for n in abi_sink)
            header_lines.append(f"> ABI：{links}")
        header_lines.append("")

        path = out_dir / fname
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            cleanup_md("\n".join(header_lines) + "\n" + body_clean),
            encoding="utf-8",
        )
        index_rows.append((title, fname, bool(abi_sink)))

    readme = [
        "# AEGIS X 前端专用合约接入手册（Markdown）",
        "",
        "由 `AEGIS_X_FRONTEND_MANUAL.html` 自动转换。完整 ABI JSON 拆到 `abis/`，正文里只保留链接。",
        "",
        "再生：`python3 scripts/convert-frontend-manual-html.py`",
        "",
        "## 目录",
        "",
        "- [主网发布地址](00-addresses.md)",
    ]
    for title, fname, has_abi in index_rows:
        note = " · 含 ABI" if has_abi else ""
        readme.append(f"- [{title}]({fname}){note}")
    readme += [
        "",
        "## 统计",
        "",
        f"- 文档章节：{len(index_rows)}",
        f"- ABI 文件：{len(list(abi_dir.glob('*.json')))}",
        f"- 总大小：{sum(p.stat().st_size for p in out_dir.rglob('*') if p.is_file()):,} bytes",
        "",
    ]
    (out_dir / "README.md").write_text("\n".join(readme), encoding="utf-8")

    print(
        f"OK: articles={len(index_rows)} contracts={len(list(contracts_dir.glob('*.md')))} "
        f"abis={len(list(abi_dir.glob('*.json')))} → {out_dir}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n", 1)[0])
    parser.add_argument(
        "--html",
        type=Path,
        default=DEFAULT_HTML,
        help=f"HTML SSOT (default: {DEFAULT_HTML})",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUT,
        help=f"Markdown output dir (default: {DEFAULT_OUT})",
    )
    args = parser.parse_args()
    convert(args.html.resolve(), args.out.resolve())


if __name__ == "__main__":
    main()
