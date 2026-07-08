# Figma 全页面清单（MCP 提取）

> **Figma**：[`n8nD6qqAtikNhP3xuH8PRS`](https://www.figma.com/design/n8nD6qqAtikNhP3xuH8PRS/AEGIS-X--Copy---Copy-?node-id=4-2) · Canvas `4:2`
> **提取**：`get_metadata` 全 canvas + `get_design_context` 逐帧（**不含**图标/图片 asset URL）
> **用途**：与当前应用 / **dev 分支 4175 computed** 对比前的设计稿侧 SSOT
> **冲突裁决**：**以 dev 分支现有代码 effective 样式为 SSOT**；本文记录 Figma 目标，差异记为「Figma→dev delta」待多 agent 讨论
> **关联**：[`aegis-design-system.md`](./aegis-design-system.md) · [`figma-export/README.md`](./figma-export/README.md) · 工程映射 [`typography-baseline.md`](./typography-baseline.md)

**UI 页面帧**：31（已排除 LOGO / 代币导出 / Group / viewport 切片）

---

## 1. SSOT 与对比流程（预定）

1. **本文**：Figma 每帧的结构 / 字阶抽样 / 间距抽样
2. **dev 4175**：[`typography-baseline.md`](./typography-baseline.md) + `compare:computed`
3. **当前分支 5174**：重构目标；与 Figma 不一致时 **先对齐 dev**，再决定是否改 dev
4. **多 agent 对抗**（已完成）：[`design-spec-adversarial-review.md`](./design-spec-adversarial-review.md) — 10 flat variant + 5 parity + delta 表；**dev 优先**

---

## 2. 页面总览（31 帧）

| # | Node | Frame title | 画布尺寸 | 工程路由 / 说明 | MCP code |
|---|------|-------------|----------|-----------------|----------|
| 1 | `7:2` | Homepage | 1440×6760 | /en/ (PC) | ✓ |
| 2 | `151:1129` | Homepage | 1440×1080 | /en/ PC **视口帧**（1080 高，非全页滚动） | ✓ |
| 3 | `12:2` | DApp — Swap | 1920×1080 | app.html swap **三列**（1320px 窗） | ✓ |
| 4 | `182:17` | DApp — Swap | 1920×1080 | app.html swap **折叠**（482px 窗） | ✓ |
| 5 | `31:2` | DApp — Genesis | 1440×936 | tab=genesis | ✓ |
| 6 | `4150:16993` | DApp — Genesis | 1440×936 | Genesis PC **变体** node 4150:16993 | ✓ |
| 7 | `4150:3116` | DApp — Genesis | 1440×936 | Genesis PC **变体** node 4150:3116 | ✓ |
| 8 | `32:2` | DApp — Rewards | 1440×1144 | tab=rewards | ✓ |
| 9 | `33:2` | DApp — Community 未连接 | 1440×1123 | tab=community disconnected | ✓ |
| 10 | `151:866` | Slippage Tolerance | 560×720 | swap slippage modal | ✓ |
| 11 | `40:56` | Modal — Wallet Detail | 560×560 | wallet details modal | ✓ |
| 12 | `41:13` | Drawer — Mobile Nav | 390×780 | mobile nav drawer | ✓ |
| 13 | `53:2` | H5 — Homepage | 402×6380 | /en/ (H5) | ✓ |
| 14 | `62:2` | H5 — Swap | 402×1685 | tab=swap H5 | ✓ |
| 15 | `101:347` | H5 — Swap | 402×966 | Swap H5 **变体** (402×966) | ✓ |
| 16 | `4004:349` | H5 — Swap | 402×966 | Swap H5 **变体** (402×966) | ✓ |
| 17 | `100:197` | H5 — Swap | 402×874 | Swap H5 **变体** (402×874) | ✓ |
| 18 | `63:2` | H5 — Genesis | 402×1403 | tab=genesis H5 | ✓ |
| 19 | `4150:164` | H5 — Genesis | 402×1312 | tab=genesis H5 | ✓ |
| 20 | `64:2` | H5 — Rewards | 402×1238 | tab=rewards H5 | ✓ |
| 21 | `64:111` | H5 — Community | 402×1591 | tab=community H5 | ✓ |
| 22 | `74:3` | DApp — Swap · 未连接钱包 (Desktop) | 1440×1004 | tab=swap disconnected | ✓ |
| 23 | `75:2` | DApp — Community · 已连接 (Desktop) | 1440×1004 | tab=community connected | ✓ |
| 24 | `76:2` | 状态规范 · 网络 & Tooltips (Desktop) | 1200×791 | network/tooltip spec | ✓ |
| 25 | `77:2` | H5 — Swap · 未连接钱包 | 402×955 | Swap H5 **变体** (402×955) | ✓ |
| 26 | `77:76` | H5 — Community · 已连接 | 402×1113 | community H5 connected | ✓ |
| 27 | `82:430` | DApp — Community · 已连接 (Desktop) | 1440×1123 | tab=community connected | ✓ |
| 28 | `4123:156` | DApp — Rewards | 1440×1144 | Rewards PC **变体** | ✓ |
| 29 | `4161:683` | DApp — 兑换主页 | 1920×1311 | — | ✓ |
| 30 | `4161:936` | DApp — 闪兑 | 1920×1080 | — | ✓ |
| 31 | `4172:223` | DApp — 交易 | 1920×1080 | — | ✓ |

---

## 3. 分区域页面明细

### 3.1 Home · PC

#### `7:2` — Homepage

- **画布**：1440 × 6760 px
- **L1 结构**：`nav`, `hero`
- **关键组件层**：`qa`×6, `nav`×1, `hero`×1, `footer`×1
- **布局宽度出现**：1200px×15, 1440px×12, 400px×3
- **metadata 文本行高分布**（≈字号）：17px:34, 18px:24, 16px:11, 24px:7, 69px:7, 25px:6, 19px:6, 34px:4

#### `151:1129` — Homepage

- **画布**：1440 × 1080 px
- **L1 结构**：`nav`, `hero`
- **关键组件层**：`qa`×6, `nav`×1, `hero`×1, `footer`×1
- **布局宽度出现**：1200px×15, 1440px×13, 400px×3
- **metadata 文本行高分布**（≈字号）：17px:40, 18px:26, 16px:11, 19px:11, 24px:7, 69px:7, 25px:6, 13px:6

### 3.2 Home · H5

#### `53:2` — H5 — Homepage

- **画布**：402 × 6380.32861328125 px
- **L1 结构**：`nav`, `hero`, `protocol`, `engine`
- **关键组件层**：`qa`×5, `nav`×1, `hero`×1, `footer`×1
- **布局宽度出现**：402px×12
- **MCP 字阶抽样**：13px:27, 14px:25, 11px:12, 12px:10, 16px:8, 19px:7, 26px:6, 22px:4, 30px:4, 15px:2
- **gap 高频**：10px×20, 6px×11, 8px×10, 14px×8, 16px×5, 12px×5
- **padding 高频**：16px×27, 10px×20, 20px×18, 12px×18, 14px×14, 8px×11

### 3.3 DApp · PC

#### `12:2` — DApp — Swap

- **画布**：1920 × 1080 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `box`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1920px×2, 1320px×1, 84px×1, 400px×1, 836px×1
- **MCP 字阶抽样**：13px:26, 14px:13, 12px:11, 11px:7, 18px:4, 16px:4, 15px:3, 22px:2, 17px:1, 21px:1
- **gap 高频**：8px×11, 7px×7, 12px×6, 5px×5, 6px×4, 10px×2
- **padding 高频**：16px×20, 10px×16, 8px×12, 7px×11, 14px×9, 5px×9

#### `182:17` — DApp — Swap

- **画布**：1920 × 1080 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `meta`×1
- **布局宽度出现**：1920px×2, 482px×1, 84px×1, 400px×1
- **metadata 文本行高分布**（≈字号）：16px:14, 15px:9, 17px:6, 27px:2, 21px:1, 12px:1, 26px:1, 18px:1

#### `31:2` — DApp — Genesis

- **画布**：1440 × 936 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `meta`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **MCP 字阶抽样**：13px:29, 10px:7, 12px:7, 11px:7, 16px:5, 14px:4, 18px:3, 15px:3, 21px:2, 17px:1
- **gap 高频**：8px×6, 7px×5, 6px×4, 5px×4, 10px×3, 11px×3
- **padding 高频**：14px×12, 11px×11, 16px×10, 8px×8, 12px×7, 4px×7

#### `4150:16993` — DApp — Genesis

- **画布**：1440 × 936 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `meta`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：20px:26, 17px:21, 13px:8, 18px:8, 21px:6, 16px:4, 19px:3, 22px:2

#### `4150:3116` — DApp — Genesis

- **画布**：1440 × 936 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `meta`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：20px:26, 17px:20, 18px:8, 13px:7, 21px:6, 16px:4, 19px:3, 22px:2

#### `32:2` — DApp — Rewards

- **画布**：1440 × 1144 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×4, `tbl`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **MCP 字阶抽样**：13px:66, 12px:7, 18px:5, 10px:4, 17px:2, 21px:2, 11px:2, 22px:1, 14px:1, 15px:1
- **gap 高频**：6px×7, 8px×4, 5px×4, 10px×3
- **padding 高频**：16px×13, 10px×11, 6px×8, 14px×7, 8px×5, 5px×4

#### `33:2` — DApp — Community 未连接

- **画布**：1440 × 1123 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `dcol`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：18px:7, 36px:6, 16px:5, 17px:4, 13px:4, 22px:2, 23px:2, 42px:2

#### `74:3` — DApp — Swap · 未连接钱包 (Desktop)

- **画布**：1440 × 1004 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `meta`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：18px:9, 20px:7, 16px:5, 17px:4, 22px:3, 12px:2, 26px:2, 24px:2

#### `75:2` — DApp — Community · 已连接 (Desktop)

- **画布**：1440 × 1004 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `box`×1, `dcol`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **MCP 字阶抽样**：13px:31, 14px:12, 12px:10, 30px:3, 10px:2, 20px:2, 18px:1, 26px:1
- **gap 高频**：12px×6, 10px×4, 5px×4, 8px×3, 4px×3, 6px×2
- **padding 高频**：12px×11, 14px×11, 16px×5, 13px×5, 10px×4, 5px×4

#### `82:430` — DApp — Community · 已连接 (Desktop)

- **画布**：1440 × 1123 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1, `box`×1, `dcol`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **MCP 字阶抽样**：13px:49, 12px:12, 14px:11, 10px:6, 18px:4, 30px:3, 11px:2, 16px:2, 17px:1, 21px:1
- **gap 高频**：8px×9, 10px×5, 12px×5, 5px×4, 6px×3, 4px×3
- **padding 高频**：14px×12, 10px×11, 8px×10, 4px×10, 12px×6, 6px×4

#### `4123:156` — DApp — Rewards

- **画布**：1440 × 1144 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×4, `tbl`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1440px×3, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：20px:36, 18px:7, 16px:6, 23px:5, 13px:4, 17px:3, 22px:2, 27px:2

### 3.4 DApp · H5

#### `62:2` — H5 — Swap

- **画布**：402 × 1685 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `qa`×2, `topbar`×1, `stage`×1, `app-window`×1, `meta`×1, `tbl`×1
- **布局宽度出现**：402px×3
- **MCP 字阶抽样**：13px:28, 12px:9, 14px:8, 11px:4, 15px:4, 22px:3, 17px:3, 16px:1
- **gap 高频**：8px×9, 6px×8, 9px×7, 5px×4, 12px×2, 10px×2
- **padding 高频**：14px×17, 6px×13, 8px×11, 12px×11, 16px×8, 10px×8

#### `101:347` — H5 — Swap

- **画布**：402 × 966 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×2, `topbar`×1, `stage`×1, `app-window`×1, `tbl`×1
- **布局宽度出现**：402px×4
- **metadata 文本行高分布**（≈字号）：20px:19, 18px:4, 17px:3, 14px:2, 15px:1, 80px:1, 60px:1

#### `4004:349` — H5 — Swap

- **画布**：402 × 966 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×2, `topbar`×1, `stage`×1, `app-window`×1, `tbl`×1
- **布局宽度出现**：402px×4
- **metadata 文本行高分布**（≈字号）：20px:15, 18px:5, 19px:4, 14px:2, 17px:2, 15px:1, 80px:1, 60px:1

#### `100:197` — H5 — Swap

- **画布**：402 × 874 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `qa`×2, `topbar`×1, `stage`×1, `app-window`×1, `meta`×1, `tbl`×1
- **布局宽度出现**：402px×4
- **metadata 文本行高分布**（≈字号）：20px:26, 17px:7, 18px:5, 13px:4, 16px:3, 14px:2, 12px:2, 26px:2

#### `63:2` — H5 — Genesis

- **画布**：402 × 1403.5 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`topbar`×1, `stage`×1, `app-window`×1, `meta`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：18px:26, 16px:10, 17px:10, 20px:8, 14px:3, 13px:3, 15px:1, 26px:1

#### `4150:164` — H5 — Genesis

- **画布**：402 × 1312.5 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`topbar`×1, `stage`×1, `app-window`×1, `meta`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：18px:26, 17px:16, 20px:8, 16px:7, 14px:3, 13px:3, 15px:1, 26px:1

#### `64:2` — H5 — Rewards

- **画布**：402 × 1238 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×4, `topbar`×1, `stage`×1, `app-window`×1, `qa`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：20px:28, 14px:5, 18px:5, 13px:2, 15px:1, 26px:1, 36px:1, 17px:1

#### `64:111` — H5 — Community

- **画布**：402 × 1591.5 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `topbar`×1, `stage`×1, `app-window`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：18px:21, 17px:7, 20px:7, 16px:6, 14px:3, 22px:3, 40px:2, 13px:2

#### `77:2` — H5 — Swap · 未连接钱包

- **画布**：402 × 955 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×2, `topbar`×1, `stage`×1, `app-window`×1, `meta`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：20px:9, 16px:4, 17px:4, 13px:4, 18px:3, 26px:3, 12px:2

#### `77:76` — H5 — Community · 已连接

- **画布**：402 × 1113.5 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`topbar`×1, `stage`×1, `app-window`×1, `box`×1
- **布局宽度出现**：402px×3
- **metadata 文本行高分布**（≈字号）：18px:21, 17px:5, 24px:3, 13px:3, 14px:2, 20px:2, 15px:1, 26px:1

### 3.5 Overlay / Modal

#### `151:866` — Slippage Tolerance

- **画布**：560 × 720 px
- **L1 结构**：`card`
- **布局宽度出现**：560px×1
- **metadata 文本行高分布**（≈字号）：16px:5, 21px:2, 27px:1, 18px:1

#### `40:56` — Modal — Wallet Detail

- **画布**：560 × 560 px
- **L1 结构**：`card`
- **布局宽度出现**：560px×1
- **metadata 文本行高分布**（≈字号）：18px:2, 27px:1, 22px:1, 19px:1

#### `41:13` — Drawer — Mobile Nav

- **画布**：390 × 780 px
- **L1 结构**：`drawer`
- **关键组件层**：`drawer`×1
- **布局宽度出现**：390px×1
- **metadata 文本行高分布**（≈字号）：19px:4

### 3.6 Spec / 规范

#### `76:2` — 状态规范 · 网络 & Tooltips (Desktop)

- **画布**：1200 × 791 px
- **L1 结构**：`section`, `section`
- **布局宽度出现**：1200px×1
- **metadata 文本行高分布**（≈字号）：36px:7, 14px:4, 22px:3, 20px:3, 12px:1, 16px:1, 18px:1

### 3.7 DApp · 中文稿（参考）

#### `4161:683` — DApp — 兑换主页

- **画布**：1920 × 1311 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`box`×3, `qa`×3, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1920px×2, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：16px:20, 17px:17, 13px:11, 19px:7, 15px:5, 20px:3, 32px:2, 105px:2

#### `4161:936` — DApp — 闪兑

- **画布**：1920 × 1080 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `box`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1920px×2, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：16px:15, 15px:11, 22px:5, 17px:4, 19px:4, 27px:2, 21px:1, 26px:1

#### `4172:223` — DApp — 交易

- **画布**：1920 × 1080 px
- **L1 结构**：`topbar`, `stage`
- **关键组件层**：`qa`×3, `box`×2, `topbar`×1, `stage`×1, `app-window`×1, `rail`×1, `wcol`×1, `wh`×1
- **布局宽度出现**：1920px×2, 1320px×1, 84px×1, 400px×1, 836px×1
- **metadata 文本行高分布**（≈字号）：16px:23, 15px:10, 17px:8, 19px:7, 22px:5, 20px:4, 27px:2, 21px:1

---

## 4. 跨页稳定布局（Figma）

| 模式 | PC DApp 三列 | PC DApp 折叠 | H5 DApp |
|------|--------------|--------------|---------|
| app-window 宽 | **1320px** | **482px**（仅 rail+wcol） | **402px** 单栏全宽 |
| 列宽 | rail **84** + wcol **400** + dcol **836** | rail 84 + wcol 400 | 无 rail |
| topbar 高 | **76px** | 同 | **60px** |
| stage 外 padding | pt 80 pb 40 px 20 | 同 | px **12** pb **24** |
| app-window 圆角 | **28px** (radius/xl) | 同 | **24px** |
| wcol padding | pt 20–40 px **24** pb 22 | 同 | pt **18** px **18** |
| dcol padding | pt 40 px **28** pb 28–30 | — | 内嵌于单栏 |

---

## 5. 跨页稳定间距（Figma MCP 聚合）

| px | 典型用途 |
|----|----------|
| **8** | icon+文案、meta 行、box 内 gap |
| **6** | rail 栈、pct 组 |
| **10** | topbar 行、步骤条 |
| **12** | FAQ 卡内、qlink 行 |
| **14** | swap box padding |
| **16** | 卡片 px、FAQ px |
| **18** | FAQ py、promo px |
| **24** | wcol/dcol 水平 padding |
| **34** | 区块 pt（dl 标题上） |

---

## 6. 跨页字阶（Figma MCP 聚合，非 dev SSOT）

| px | Figma 角色 | dev 对齐备注 |
|----|------------|--------------|
| **13** | 正文/meta/box 行 | footnote SSOT |
| **14** | token 名、CTA、表格 | body |
| **15** | FAQ qhd、Connect CTA、空态标题 | subheadline — 以 dev computed 为准 |
| **17** | 顶栏品牌、H5 区块 dl | title3 — 以 dev computed 为准 |
| **21–22** | widget 标题 / amount | title2 / title1 |
| **12** | rail 标签、表头 | caption1 |
| **18** | detail 区块标题、stat 值 | title3 H5 / display 子档 |

---

## 7. 排除项（本文不记录）

- 图标 / 图片 / SVG asset URL（`img` / Figma asset 常量）
- LOGO 导出帧、代币插画帧（`4022:*`、`4040:*`）
- `viewport` 切片（780×92）

---

## 8. 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-07-08 | 全 31 UI 帧 MCP metadata + 部分 design_context |
| v0.2 | 2026-07-08 | **31/31** design_context 落盘 `figma-export/raw/`；清单 MCP code 列全 ✓ |