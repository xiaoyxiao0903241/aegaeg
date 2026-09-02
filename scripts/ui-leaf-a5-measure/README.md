# UI leaf A5 全量实测

> 贴稿实测：A4 inventory 有 N 行 → 产出 R 行且 **R = N**（禁抽检）。

## 命令

```bash
# 需：pnpm dev（:5174）+ Kimi WebBridge（:10086）
pnpm measure:leaf --profile assets-hub
pnpm measure:leaf --list
```

## 说明

- 页面 nodeId 见 [`docs/figma-pages.md`](../../docs/figma-pages.md)。
- `inventory` / `out` 默认在 `tmp/ui-leaf-measure/`（gitignored）；跑前自备 inventory JSON，并在对应 profile 中确认路径。
- 禁止把过程 inventory 提交为 SSOT。
