> **归档 · 只读背景** — 执行 SSOT：[`../foundation/README.md`](../foundation/README.md)  
> **版本**：v3.0 · **2026-07-08**  
> **方法**：5 路 Composer 2.5 专项 **独立盲评** → 主 Agent 仲裁  
> **数据 SSOT**：[`../figma-export/token-usage-audit.json`](../figma-export/token-usage-audit.json)  
> **定稿输出**：[`../design-token-tiers.md`](../design-token-tiers.md) · [`../aegis-design-system-spec.md`](../aegis-design-system-spec.md) · [`../foundation/`](../foundation/README.md)

> **2026-07-08**：执行已收束至 **foundation 三核**；本文不再作为 agent 必读。

---

## 1. 五路审查（Composer 2.5 · 独立结论）

### Agent 1 — Typography

- **冻结 10+3 compound**（rail 10→10 仅 rit）
- **Tier B**：12/20/26/30 px → StatCard / Modal / WidgetHeader
- **冲突**：`mobile-type-scale.css` blanket +1 与 Figma 逐 variant H5 **系统性矛盾**
- **rem 建议**：Tier A 用 `--dapp-type-*` rem；**rail 锁 0.625rem**
- **风险**：site-fluid 放大 rem 时 rail vs meta 比例失真
- **世界级缺口**：variant × PC/H5 × 超宽 **computed CI 矩阵**

### Agent 2 — Spacing

- **Tier A 9 slot** 覆盖 >75% 频次；**不扩 @theme spacing**
- **Tier B**：box(9/14)、rail(5/6/11)、qa、dcol/wcol
- **Tier C**：stage magic px inline
- **rem × site-fluid**：Tailwind spacing 随根 rem 缩放 ✅
- **风险**：slot 名与 Tailwind 类无 lint 绑定
- **缺口**：spacing token lint / 非 Tailwind 消费者 CSS 别名

### Agent 3 — Color & Surface

- **Tier A 14 semantic**（text/ink → foreground 等）
- **Tier B 收编**：#5b6472、#8b93a1、#c9cfda、#111625、#e9785a
- **tone 收敛**（背景）：旧 `strong`/`faint`/`subtle`/`faq`/`accent` → 语义 tone；**执行**：P1 各 Foundation PR 同 PR 删 call site，无 alias 层
- **风险**：`--foreground #252628` vs Figma ink `#0b0e14` **系统性偏浅**
- **缺口**：surface elevation + state（hover/disabled）矩阵

### Agent 4 — Radius / Elevation / Rem

- **Tier A**：pill/sm/md/lg/xl + **E1–E6** shadow
- **Tier B**：tooltip r9、ham r13；rit r14 **复用 sm**
- **三层缩放**：821–1919 固定 16px 根 · H5 逐 variant 覆写 · site-fluid **只缩放 shell/layout**
- **Typography 不跟 site-fluid 根 rem**（px 锁或 fluid 反缩放）
- **风险**：现 `--dapp-type-*` 为 rem，3840 下 **3× 放大**

### Agent 5 — 迁移治理

- **12 章世界级规范目录**（见 [`aegis-design-system-spec.md`](./aegis-design-system-spec.md)）
- **Phase 0–6** tokens-first（见 [`design-system-migration-plan.md`](./design-system-migration-plan.md)）
- **dev diff 三行模板**
- **仲裁**：Figma 验收 · canonical 帧进规范 · rit 10px
- **缺口**：Motion SSOT · A11y SSOT
- **文档冲突**：inventory §1 仍写 dev 优先 → **已废止**

---

## 2. 分歧仲裁（主 Agent）

| 分歧 | Agent 立场 | **v2 定稿** |
|------|------------|-------------|
| Typography 是否随 site-fluid 缩放 | Agent1 部分跟 rem · Agent4 **不跟** | **不跟** — 字号用 **px 锁定的 `--dapp-type-*`** 或 `calc(px / var(--fluid-scale))` 反缩放；shell/spacing/radius 可 rem+fluid |
| rail 10px 与 fluid | Agent1 锁 10px | **锁 10px**（不随 fluid 变） |
| @theme spacing 扩展 | Agent2 **否** | **否** — 9 slot + Tailwind |
| foreground 色值 | Agent3 Figma ink | **Phase 1 校准 `--foreground` → `#0b0e14`**（或 dual token 迁移） |
| shadow 档数 | Agent4 E1–E6 | **6 档**，合并 theme 现有 10+ 名 |
| 验收基准 | Agent5 Figma | **Figma + 切片 dev diff** |
| mobile-type-scale | Agent1/4 废止 DApp 毯式 +1 | **DApp 不用 blanket +1**；H5 走 variant 表 |

---

## 3. 低频 Token 妥协（五路一致）

| 条件 | 处理 |
|------|------|
| ≤9 次 / 单组件 / 单帧 | **Tier C** — 组件内 `--*` 或 scoped class；**禁止**新 Text variant |
| 第三方 UI | SDK / wallet.css inline |
| 布局 magic number | 保留 px inline + 注释 |
| 代币插画色 | `--token-*` 已有；不进 tone 轴 |

---

## 4. rem / 断点架构（冻结）

```mermaid
flowchart TB
  subgraph default [821-1919px]
    R16[html 16px]
    ShellRem[shell spacing radius rem]
    TypePx[typography px-locked vars]
  end
  subgraph h5 [max 820px]
    H5Var[per-variant CSS overrides]
  end
  subgraph ultra [1920+ site-fluid]
    FluidRoot[html root step up]
    ShellScale[shell layout scales]
    TypeLock[typography unchanged px]
  end
  R16 --> ShellRem
  R16 --> TypePx
  TypePx --> H5Var
  FluidRoot --> ShellScale
  TypePx -.->|no scale| TypeLock
```

---

## 5. 收束数字（对比 v1）

| 维度 | v1 全文入库 | **v2 收束** |
|------|-------------|-------------|
| Text variant | ~28 | **10 + 3 compound** |
| Home display | ~15 | **3–4** |
| @theme spacing | 倾向膨胀 | **0 新增**（9 slot 文档） |
| Color semantic | 散落 | **14 A + 5 B 收编** |
| Radius | 29 档 | **5 A + 组件 B** |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-07-08 | 本地等价五路（Task 认证失败） |
| **v2.0** | **2026-07-08** | **Composer 2.5 ×5 真实盲评 + 仲裁 + rem 架构** |
| **v3.0** | **2026-07-08** | **Foundation→Pages v2 方案 · Composer 2.5 ×5 二次盲评 + 仲裁** |

---

## 6. v3 — Foundation→Pages 二次审查（Composer 2.5 ×5）

**审查对象**：[`design-system-migration-plan.md`](./design-system-migration-plan.md) v2.0 · [`component-anatomy.md`](./component-anatomy.md) v1.0 · 用户定稿（Swap 探针 · parity-first · Card 收束）

### 6.1 五路结论摘要

| Agent | 专项 | Verdict |
|-------|------|---------|
| 1 P0 Token | px-lock · Legacy · Tier 分层 | **接近世界级** — P0 scope 对；缺 H5 对照表 + site-fluid 机制定稿 |
| 2 P1 Component | Card/Text/Button · parity 两 PR | **有条件通过** — surface 蓝图好；`card.tsx` 未落地；文档 variant 名需对齐 |
| 3 Breakpoint | max-dapp 清零策略 | **方向正确** — 不可删变体定义；白名单需扩；Home 是主债 |
| 4 Migration 治理 | Foundation→Pages · CI | **B+** — 流程可执行；computed 与 visual-parity 须统一 SSOT；CI 门禁缺 |
| 5 世界级完整性 | 9 维度 | **3.4/5** — 能产出强工程结果；Motion/A11y/CI 未闭合；**不阻塞 P0** |

### 6.2 v3 分歧仲裁

| 分歧 | 立场 | **v3 定稿** |
|------|------|-------------|
| site-fluid typography | px 或反缩放 | **纯 px-lock**（`--dapp-type-*: Npx`）；不默认 calc 反缩放 |
| parity vs Figma 验收 | Agent4 与 visual-parity 冲突 | **两阶段**：Foundation/P2 **先 dev computed parity**；Figma 对照为 **第二 PR / P2 后半**；screenshot 作 Figma 切片辅助 |
| computed 是否唯一 gate | Agent4 认为不够 | **主 gate = computed parity**；`compare:screenshots` = Figma 切片辅助；CI 待接 |
| Card `elevated` | surface vs modifier 歧义 | **仅 surface 枚举**；无 modifier 轴 |
| 删 `dapp:`/`max-dapp:` 变体 | 部分 agent 问可否全删 | **保留** `legacy-breakpoints.css` 定义；**清零** call site typography |
| Motion/A11y 是否阻塞 P0 | Agent5 否 | **不阻塞 P0**；P1 开 PR 前起草最小 SSOT（3 页） |
| Phase 0 基线 | Agent1/4 必须入库 | **commit 到** `docs/baselines/`（JSON + 样式栈 markdown） |

### 6.3 v3 Must-fix（已写入 migration / anatomy）

1. **10 variant PC→H5 px 表** → migration plan P0 + 下表  
2. **site-fluid = 纯 px-lock** → 冻结，不用 rem 字号  
3. **断点白名单扩全** → `component-anatomy.md` §7  
4. **Phase 0 基线路径** → `docs/baselines/swap-{pc,h5}-*.json`  
5. **P1 最小 CI 脚本**（后续）：typography grep · token test · prod build smoke  

### 6.4 10 variant PC→H5 px（P0 验收 SSOT）

| variant | PC | H5 |
|---------|----|----|
| rail | 10 | 10 |
| kicker | 11 | 12 |
| meta | 13 | 13 |
| detail | 14 | 14 |
| question | 15 | 15 |
| headline | 16 | 15 |
| brand | 17 | 18 |
| section | 18 | 16 |
| widget-title | 21 | 22 |
| amount | 22 | 23 |

### 6.5 世界级总评

| 维度 | v2 文档 | v3 方案+结果预期 |
|------|---------|------------------|
| 规范完整度 | 4/5 | 4/5 |
| 迁移可执行性 | 3.5/5 | **4/5**（Foundation 切片更清晰） |
| 自动化治理 | 2.5/5 | 3/5（基线路径 + grep 规则已定；CI 待接） |
| 终态简洁度 | 3/5 | **4/5**（Card 收束 + max-dapp 清零目标） |

**结论**：方案 **接近世界级**；按 v3 仲裁执行 P0→P1 可产出 **世界级工程结果**（非仅文档）。距 Material/Atlassian **治理自动化**仍差一档——P3 前接最小 CI 可补齐。

### 6.6 P1 前待补文档（不阻塞 P0）

1. **Motion 最小 SSOT** — duration/easing + hover 白名单  
2. **A11y 最小 SSOT** — focus ring · 4.5:1 对照 · Connect aria 边界  
3. **computed CI 规格** — 10 variant × PC/H5 × site-fluid 期望值表
