# Figma MCP 导出数据（设计 token 提取）

> **来源**：Figma MCP `get_design_context` → React+Tailwind 代码
> **持久化**：[`raw/`](./raw/)（每帧 `.tsx`）+ [`frames/*.json`](./frames/)（结构化 token）
> **提取脚本**：[`scripts/extract-figma-design-tokens.py`](../../scripts/extract-figma-design-tokens.py) · **用法审计**：[`scripts/extract-token-usage-audit.py`](../../scripts/extract-token-usage-audit.py) → [`token-usage-audit.json`](./token-usage-audit.json)
> **不含**：图标 / 图片 asset URL
>
> **视觉 SSOT**：Figma 画板实节点 + **当前分支**（见 [`docs/foundation/`](../foundation/README.md)）。
> **勿恢复**已删除的口号 Spec JSON / Phase0 baselines。

**清单帧**：31 · **已提取**：31 · **缺失**：0

## 帧索引（31 页面清单）

| # | Node | Frame | 文本节点 | JSON | MCP |
|---|------|-------|----------|------|-----|
| 1 | `7:2` | Homepage | 131 | [`frames/7-2.json`](./frames/7-2.json) | ✓ |
| 2 | `151:1129` | Homepage | 152 | [`frames/151-1129.json`](./frames/151-1129.json) | ✓ |
| 3 | `12:2` | DApp — Swap | 77 | [`frames/12-2.json`](./frames/12-2.json) | ✓ |
| 4 | `182:17` | DApp — Swap | 27 | [`frames/182-17.json`](./frames/182-17.json) | ✓ |
| 5 | `31:2` | DApp — Genesis | 78 | [`frames/31-2.json`](./frames/31-2.json) | ✓ |
| 6 | `4150:16993` | DApp — Genesis | 83 | [`frames/4150-16993.json`](./frames/4150-16993.json) | ✓ |
| 7 | `4150:3116` | DApp — Genesis | 81 | [`frames/4150-3116.json`](./frames/4150-3116.json) | ✓ |
| 8 | `32:2` | DApp — Rewards | 90 | [`frames/32-2.json`](./frames/32-2.json) | ✓ |
| 9 | `33:2` | DApp — Community 未连接 | 36 | [`frames/33-2.json`](./frames/33-2.json) | ✓ |
| 10 | `151:866` | Slippage Tolerance | 7 | [`frames/151-866.json`](./frames/151-866.json) | ✓ |
| 11 | `40:56` | Modal — Wallet Detail | 5 | [`frames/40-56.json`](./frames/40-56.json) | ✓ |
| 12 | `41:13` | Drawer — Mobile Nav | 4 | [`frames/41-13.json`](./frames/41-13.json) | ✓ |
| 13 | `53:2` | H5 — Homepage | 109 | [`frames/53-2.json`](./frames/53-2.json) | ✓ |
| 14 | `62:2` | H5 — Swap | 56 | [`frames/62-2.json`](./frames/62-2.json) | ✓ |
| 15 | `101:347` | H5 — Swap | 31 | [`frames/101-347.json`](./frames/101-347.json) | ✓ |
| 16 | `4004:349` | H5 — Swap | 31 | [`frames/4004-349.json`](./frames/4004-349.json) | ✓ |
| 17 | `100:197` | H5 — Swap | 48 | [`frames/100-197.json`](./frames/100-197.json) | ✓ |
| 18 | `63:2` | H5 — Genesis | 51 | [`frames/63-2.json`](./frames/63-2.json) | ✓ |
| 19 | `4150:164` | H5 — Genesis | 54 | [`frames/4150-164.json`](./frames/4150-164.json) | ✓ |
| 20 | `64:2` | H5 — Rewards | 37 | [`frames/64-2.json`](./frames/64-2.json) | ✓ |
| 21 | `64:111` | H5 — Community | 55 | [`frames/64-111.json`](./frames/64-111.json) | ✓ |
| 22 | `74:3` | DApp — Swap · 未连接钱包 (Desktop) | 28 | [`frames/74-3.json`](./frames/74-3.json) | ✓ |
| 23 | `75:2` | DApp — Community · 已连接 (Desktop) | 62 | [`frames/75-2.json`](./frames/75-2.json) | ✓ |
| 24 | `76:2` | 状态规范 · 网络 & Tooltips (Desktop) | 20 | [`frames/76-2.json`](./frames/76-2.json) | ✓ |
| 25 | `77:2` | H5 — Swap · 未连接钱包 | 19 | [`frames/77-2.json`](./frames/77-2.json) | ✓ |
| 26 | `77:76` | H5 — Community · 已连接 | 42 | [`frames/77-76.json`](./frames/77-76.json) | ✓ |
| 27 | `82:430` | DApp — Community · 已连接 (Desktop) | 91 | [`frames/82-430.json`](./frames/82-430.json) | ✓ |
| 28 | `4123:156` | DApp — Rewards | 63 | [`frames/4123-156.json`](./frames/4123-156.json) | ✓ |
| 29 | `4161:683` | DApp — 兑换主页 | 70 | [`frames/4161-683.json`](./frames/4161-683.json) | ✓ |
| 30 | `4161:936` | DApp — 闪兑 | 41 | [`frames/4161-936.json`](./frames/4161-936.json) | ✓ |
| 31 | `4172:223` | DApp — 交易 | 59 | [`frames/4172-223.json`](./frames/4172-223.json) | ✓ |

## 全量聚合（31 清单帧）

- [`tokens-aggregated.json`](./tokens-aggregated.json)
- [`inventory-status.json`](./inventory-status.json)

### 字号频次（px）

- **138px**：2
- **92px**：2
- **81px**：2
- **69px**：14
- **54px**：8
- **52px**：4
- **48px**：2
- **46px**：6
- **44px**：2
- **42px**：8
- **40px**：5
- **34px**：9
- **30px**：11
- **27px**：7
- **26px**：12
- **25px**：12
- **24px**：14
- **23px**：7
- **22px**：38
- **21px**：35
- **20px**：98
- **19px**：33
- **18px**：117
- **17px**：172
- **16px**：70
- **15px**：42
- **14px**：168
- **13px**：473
- **12px**：245
- **11px**：85
- **10px**：34
- **9px**：1

### 颜色 Variable（Top 20）

- `text\/ink,#0b0e14` ×593
- `bg\/surface,white` ×367
- `border\/default,#eceef2` ×348
- `text\/body,rgba(0,0,0,0.7` ×235
- `text\/muted,rgba(0,0,0,0.4` ×147
- `text\/inverse,white` ×108
- `accent\/primary-\(coral\` ×83
- `accent\/coral-button,#e66a47` ×74
- `functional\/up,#16b979` ×44
- `accent\/coral-soft,#fceae2` ×37
- `bg\/dark,#11141d` ×27
- `text\/on-dark,#b8c0ce` ×22
- `bg\/page,#f5f6f8` ×19
- `accent\/coral-bright,#f4a98f` ×6
- `token\/agx,#232833` ×4
- `bg\/band,#ebeef3` ×4
- `token\/usd1,#e86a43` ×1
- `token\/x,#5e2a40` ×1
- `token\/gagx,#7c6230` ×1
- `colors\/orange,#ff9500` ×1
