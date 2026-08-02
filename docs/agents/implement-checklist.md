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
[ ] 已读 ui-leaf §0 禁语 + §1 硬序 + §8 重启铁律（含 §8.1 稿/原型 · §8.2 抽取）
[ ] 本页登记已填；Status=`pre-design`
[ ] 确认只做这一帧（从队列顺序；禁并行下一帧；禁并行 spawn 多页改 src/）
[ ] 现行队列为 `200-releaf-restart-queue.md`；未引用已删的旧 leaf/page-done
[ ] 已停掉与本页无关的后台 releaf/check 任务（或确认无运行中）
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

### A3. 原型 WebBridge（IA · 稿缺态 SSOT）

```
[ ] 点通原型；五字段实录进 leaf（§2.2）
[ ] 未用 Playwright 代替；未抄原型 DOM/CSS 当**有稿**表面的视觉规格
[ ] 若本页有 Figma 无/未设计完全的状态（空态等）→ 该状态 UI 跟原型，leaf 注明「稿缺→原型」
```

### A4. Figma 全 leaf 清单（写盘前门禁 · 缺证据 = 本页未开始）

```
[ ] fileKey `uiKwzwIoD06phS0husdqjB`；`get_design_context` 前已 load figma-design-to-code
[ ] 本轮已调用 `get_metadata(页帧)`（全树 w/h/x/y）并按 §2.3a 计出 meta_min_leaf_count=N
[ ] **§8.2a：** 已抽且一眼同构的块标 `reuse:<Component>`（整块计 1，子叶不强制计入 N）；本页独有 chrome 仍逐叶计入
[ ] 本轮已对页帧 **以及** 每一个**须深钻**最小 leaf（§2.3a − §8.2a reuse）调用 `get_design_context`；gdc_min_leaf_count=M
[ ] **机械门：** M ≥ N（N 已扣 reuse 子叶）；leaf 每一行有独立 `gdc_at`（父框时间不可继承；reuse 行写组件名即可）
[ ] leaf 文首写明：N、M、拉取日、fileKey、页帧 nodeId、reuse 清单
[ ] 每一行含：nodeId + kind + 稿 h/w/pad/font/色/surface + gdc_at — 禁只列 AmountBox/CTA/「mode×4」
[ ] 清单覆盖：栏→块→控件→最小叶（icon/thumb/字色/padding/surface）；无「左栏大概 PASS」
[ ] 自检 §2.3c + §2.3a + §8.2a：漏独有叶或 M<N = A4 未完成 → **禁止**进入 A5/写盘
[ ] **未**用旧 scratch / 旧 page-done 抄规格冒充本轮拉取
```

### A5. 本站 WebBridge 实测（§2.3b）← 测本站 ≠ 拉稿；**禁抽检**

```
[ ] A4 已齐（否则本步无效，禁止当进度）
[ ] 已打开 `pnpm dev` 本站对本帧路由
[ ] 输入 = A4 全表；**跑** `pnpm measure:leaf --profile <本页>`（§2.3b / `scripts/ui-leaf-a5-measure`）；禁止会话内手写抽检
[ ] 产出 `*-measure-full.json`：measure_row_count R == meta_min_leaf_count N；顶栏写明 N / R / R==N
[ ] 每一个 A4 nodeId 恰好一行：定位方式 + getBoundingClientRect / getComputedStyle + Δ + PASS/FAIL
[ ] 定位失败 = 该行 FAIL（不得删行 / 并入父卡冒充已测）
[ ] 未用抽检 /「关键 17/17」/ 截图肉眼 /「写了 min-h」代替全量实测
[ ] FAIL 项已列入本页改码范围（**全部** FAIL，不是只挑一个）
[ ] 自检 §2.3b：R<N 或缺 nodeId = A5 未完成 → **禁止**写盘 / 禁止称 UI PASS
```

### A6. 动态审计 + leaf 表

```
[ ] 动态审计表（真源 / 诚实空 / 禁假数）
[ ] 节点表三列：UI ∥ 钱路 ∥ 实测
[ ] 「稿无代码有」列已填
```

### A7. 尺寸硬禁 + 组件复用/抽取（写盘前再勾）

```
[ ] 本页计划改动 **不含** 任何 `*[Npx]` / `*[Nrem]` 任意值（§2.6）
[ ] 若字阶/图标对不齐稿 → 计划改 `theme.css` token 或 primitive variant，不计划 call site 补 px
[ ] 已搜现有 `shared/ui` / shell：能复用的不新造（§8.2）
[ ] **§8.2a：** 运行机制 / MetricGrid / Chart / FAQ 等已抽且一眼同构 → 复用，不为本页深钻该块
[ ] chart / 同 chrome 多实例 → 走或扩共用组件，禁止页袋复制分叉
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
[ ] 对本页 **清单每一行**（R 必须再 == N）再跑 §2.3b；含曾 PASS，**禁止只复测 FAIL 子集就勾齐**
[ ] 实测矩阵更新；无未解释 FAIL（Δ≤2 可记 Med）
[ ] 全清单无漏测项（§2.3b · R==N）
[ ] `rg` 本页 diff：**零** 新增 `\[[0-9.]+px\]` / 任意 rem 长度
```

---

## D. 验证 + R7 + 收工

```
[ ] pnpm check（含 knip + jscpd）exit 0
[ ] R7 Post-Design：五字段 + 实测矩阵 + 手册/API 对照 + R5a；缺 → Critical
[ ] R7 Post-Code：假数 / 稿外 / flip 冒充 picker / px 创可贴 / R4a；Critical=0
[ ] 审查结论落 `.scratch/.../research/`
[ ] R7 Critical=0 后，**用户明示**才 commit → Status=`page-done` → 更新 `200-releaf-restart-queue.md`
[ ] **仅此时**可开下一帧（回到 A0）；禁止并行下一页
[ ] page-done 前复查：leaf 含本轮 MCP 拉取证据（时间·fileKey·全 nodeId）；缺 → 不得勾 page-done
```

---

## 习惯（反例）

| 做                                            | 反例                                  |
| --------------------------------------------- | ------------------------------------- |
| 全 leaf 清单 + 逐项实测再改码                 | 只修 AmountBox/CTA；清单只有几行      |
| UI PASS = 实测 Δ + token 合同                 | `h-[53px]` / 截图「看起来像」         |
| 一页所有 FAIL 一起收                          | 修一个组件就开下一页或宣称完成        |
| 改 `--type-*` / `--app-icon-*` 对齐稿         | call site `text-[24px]` `size-[22px]` |
| 控件跟 Figma；钱跟手册+API                    | 「稿∩手册才 MUST」；有 API 标无源     |
| 「稿无代码有」先对原型/grilling；书面杀控才删 | R7 把 hideZero 当「稿外」静默删       |
| 诚实空                                        | 演示数 / 假 1:1                       |

---

## `/implement`（单帧一句话）

登记 → 手册 → OpenAPI → 原型点通 → Figma 全清单 → **本站实测矩阵** → 审计 → **允许写盘** → 改全部 FAIL → 再测 → check → R7 → 用户 commit → page-done → 下一帧。

## 报告（每页）

改了什么 · leaf 路径 · 实测前后 Δ · R7 · check · gaps 增删 · 风险 · 反面意见。
