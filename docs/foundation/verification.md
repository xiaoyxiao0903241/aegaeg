# Foundation 验收与 Gate（L1 · 验证 SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **API**：[`api.md`](./api.md)

---

## 1. 环境

| 端口 | 角色 |
|------|------|
| **4175** | dev computed SSOT · `/private/tmp/aegis-dev-baseline` |
| **5174** | 当前 refactor 分支 |

```bash
pnpm dev:baseline    # 4175
pnpm dev             # 5174
```

worktree 首次：`git worktree add /private/tmp/aegis-dev-baseline dev && cd … && pnpm install`

---

## 2. 双 Gate（P1 阻塞）

| Gate | 含义 | PASS |
|------|------|------|
| **Parity** | dev computed 一致 | Swap PC `compare:style-baseline` **diff=0**（H5 同 gate 或登记 debt） |
| **API** | 公开键数 = api.md | 各 § gate 行；无 alias；legacy rg 零命中 |

**探针 PASS 且 API 未收束 = NOT DONE**

---

## 3. 命令 SSOT

```bash
# Phase 0
pnpm capture:phase0-baseline

# P1 每组件写盘后
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5
pnpm lint:all

# 可选：全页视觉（P2 / 用户要求时）
pnpm compare:screenshots
pnpm compare:diff-audit
```

**基线数据**：`docs/baselines/swap-pc-computed.json` · `swap-h5-computed.json`

---

## 4. 分组件 Gate 命令

### Text（§3）

```bash
rg 'deprecatedAliases' src/shared/ui/text.tsx
rg 'variant="(faq-question|body|title-lg|compact-body|swap-hub|caption)' src
```

### Button（§2）

```bash
rg 'max-dapp:(text-|font-|leading-|tracking-)' src/shared/ui/button.tsx
```

### Card（§1）

```bash
rg 'surface=' src/views/dapp/swap --no-filename | sort -u
```

### FaqList（§4）

```bash
rg 'faq-question' src
```

### 通用 Swap

```bash
rg 'max-dapp:(text-|font-|leading-|tracking-)' src/views/dapp/swap
rg '<(p|span|strong|h[1-4])\s' src/views/dapp/swap --glob '*.tsx'
```

---

## 5. 切片视觉验收（P2 / 大改 optional）

Foundation P1 **不依赖**截图 diff；页面级切片使用：

```bash
pnpm compare:screenshots
pnpm compare:diff-audit
```

**Agent 规则**：产出差异清单 → **等用户确认** → 再改代码（禁止跳过确认声称对齐）

### 报告模板

```markdown
## 切片：<名> · <branch>

### 双 gate
- Parity: compare:style-baseline PC diff=
- API: <组件> 键数=

### 截图 diff（若跑）
| target | pct | 建议修？ |

### 请你确认
- [ ] 修 #…
```

---

## 6. Figma 对照规则

| 场景 | SSOT |
|------|------|
| Foundation P1 回归 | **4175** |
| 4175=Figma、5174偏 | Figma frame（[`figma-pages-inventory.md`](../figma-pages-inventory.md)） |
| 4175≠Figma | 单列 figma-gap，产品确认 |

正式 Figma：https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 gates.md + visual-parity + slice-visual-acceptance |
