# Implement / 开页检查单（每次开新页必勾）

> **不是**第二套规范。细则 SSOT：[`ui-leaf-parity-workflow.md`](./ui-leaf-parity-workflow.md)（**page-done 唯一正文**）· [`AGENTS.md`](../../AGENTS.md) §8.0 · [`commands.md`](./commands.md)。  
> **用法：** 每开一个 Figma PC 产品帧，**复制下面「本页登记」填好**，再按序勾选。  
> **门禁：** 「允许写盘」以上未全部勾完 → **禁止**改 `src/`。修完一个组件不算本页完成。

---

## 本页登记（开页第一件事）

```
帧名称：
PC nodeId：
leaf 路径：.scratch/.../NN-*-page-leaf.md
队列 #（若 releaf）：
Status 起始：pre-design
日期：
Agent session：
```

---

## A. Pre-Design（全部勾完才允许写盘）

### A0. 开页

```
[ ] 已读 ui-leaf §0 禁语 + §1 硬序（本轮）
[ ] 本页登记已填；Status=`pre-design`
[ ] 确认只做这一帧（禁并行下一帧写盘）
```

### A1. 手册 + 钱路

```
[ ] 相关 `frontend-manual` 章 **逐行**已读（ui-leaf §2.1）
[ ] leaf 有：章节清单 + 逐条对照表（挂 G-id）
[ ] 写链触及 → 已读 money-path；R4a（手册有→手册；沉默→可证旧码）
```

### A2. OpenAPI

```
[ ] `~/Downloads/新/api-docs.html` 相关 path：summary + description + schema 已读（§2.1b）
[ ] 稿面数字位 → API/链上/皆无 对照已写；有源→接线计划；皆无→ gaps + 诚实空
```

### A3. 原型 WebBridge（IA）

```
[ ] 点通原型；五字段实录进 leaf（§2.2）
[ ] 未用 Playwright 代替；未抄原型 DOM/CSS 当视觉规格
```

### A4. Figma 全 leaf 清单

```
[ ] fileKey `uiKwzwIoD06phS0husdqjB`；`get_design_context` 前已 load figma-design-to-code
[ ] 页帧 context + metadata 已拉
[ ] **每一个可见最小子 leaf** 已列入清单（nodeId + 稿 h/w/pad/font/色/surface）— 行数须覆盖整帧，禁只列 AmountBox/CTA
[ ] 清单覆盖：栏→块→控件→最小叶（icon/thumb/handle/字色/padding）；无「左栏大概 PASS」
[ ] 自检 §2.3c：漏一项 = A4 未完成
```

### A5. 本站 WebBridge 实测（§2.3b）← 常被跳过，强制

```
[ ] 已打开 `pnpm dev` 本站对本帧路由
[ ] 对 **清单每一行**（不是抽样）用 WebBridge `evaluate` + getBoundingClientRect / getComputedStyle
[ ] leaf 有「实测矩阵」：稿 | 实测 | Δ | PASS/FAIL（定位方式可复测）
[ ] 未用「写了 min-h」或截图肉眼代替实测
[ ] FAIL 项已列入本页改码范围（**全部** FAIL，不是只挑一个）
```

### A6. 动态审计 + leaf 表

```
[ ] 动态审计表（真源 / 诚实空 / 禁假数）
[ ] 节点表三列：UI ∥ 钱路 ∥ 实测
[ ] 「稿无代码有」列已填
```

### A7. 尺寸硬禁（写盘前再勾一次）

```
[ ] 本页计划改动 **不含** 任何 `*[Npx]` / `*[Nrem]` 任意值（§2.6）
[ ] 若字阶/图标对不齐稿 → 计划改 `theme.css` token 或 primitive variant，不计划 call site 补 px
```

### ✅ 允许写盘

```
[ ] A0–A7 全部勾选 → Status 可改为 `in-progress` → 才改 src/
```

---

## B. 写盘中

```
[ ] 只改本帧 FAIL/清单内文件；deletion-first
[ ] 尺寸跟 §2.6：只许 token / variant / 标准刻度；**硬禁** `h-[Npx]` `text-[Npx]` `size-[Npx]` 等
[ ] 字阶不对 → 改 `--type-*`；图标不对 → 改 `--app-icon-*`；禁 call site 补任意值
[ ] 稿面控件 UI MUST；缺数 → gaps + 诚实空；禁砍控件
[ ] **本帧清单全部 FAIL 一起收**，禁只修一个组件就停
[ ] 动态数字优先链上/API；假数删
[ ] i18n：PC SSOT；键齐；真译可 locale-DEFER
[ ] shared 只 chrome；业务 options 在 call site
[ ] 子代理模型 = cursor-grok-4.5-high only
```

---

## C. 写盘后回测（未勾完不得称 UI 齐）

```
[ ] 对本页 **清单每一行** 再跑 §2.3b（含曾 PASS 的抽检）
[ ] 实测矩阵更新；无未解释 FAIL（Δ≤2 可记 Med）
[ ] 全清单无漏测项（§2.3c）
[ ] `rg` 本页 diff：**零** 新增 `\[[0-9.]+px\]` / 任意 rem 长度
```

---

## D. 验证 + R7 + 收工

```
[ ] pnpm check（含 knip + jscpd）exit 0
[ ] R7 Post-Design：五字段 + 实测矩阵 + 手册/API 对照 + R5a；缺 → Critical
[ ] R7 Post-Code：假数 / 稿外 / flip 冒充 picker / px 创可贴 / R4a；Critical=0
[ ] 审查结论落 `.scratch/.../research/`
[ ] R7 Critical=0 后 commit → Status=`page-done`
    （默认仍须用户明示；**releaf 队列**若用户已书面授权「R7 过即提交直到全页完成」则可连续 commit）
[ ] 仅此时可开下一帧（回到 A0）
```

---

## 习惯（反例）

| 做                                    | 反例                                  |
| ------------------------------------- | ------------------------------------- |
| 全 leaf 清单 + 逐项实测再改码         | 只修 AmountBox/CTA；清单只有几行      |
| UI PASS = 实测 Δ + token 合同         | `h-[53px]` / 截图「看起来像」         |
| 一页所有 FAIL 一起收                  | 修一个组件就开下一页或宣称完成        |
| 改 `--type-*` / `--app-icon-*` 对齐稿 | call site `text-[24px]` `size-[22px]` |
| 控件跟 Figma；钱跟手册+API            | 「稿∩手册才 MUST」；有 API 标无源     |
| 诚实空                                | 演示数 / 假 1:1                       |

---

## `/implement`（单帧一句话）

登记 → 手册 → OpenAPI → 原型点通 → Figma 全清单 → **本站实测矩阵** → 审计 → **允许写盘** → 改全部 FAIL → 再测 → check → R7 → 用户 commit → page-done → 下一帧。

## 报告（每页）

改了什么 · leaf 路径 · 实测前后 Δ · R7 · check · gaps 增删 · 风险 · 反面意见。
