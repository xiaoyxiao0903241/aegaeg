# UI 页面实现工作流（全仓通用 · 强制）

> **状态：** 用户锁定 2026-07-30（对抗纠偏：堵 R5 合取漏洞 · 手册沉默 ≠ 取消 UI · WebBridge 实录字段）；**2026-07-31 加锁：手册逐行对照 + R4a**；**2026-08-02 加锁：全 leaf 清单 + WebBridge 实测 computed style + 禁 px 创可贴**；**2026-08-02 晚重启：一页一闭环 · 测本站≠拉稿 · 缺 MCP 证据不许 page-done**  
> **本文件 = `page-done` 与工具序唯一正文。** `AGENTS.md` 管分层；[`implement-checklist.md`](./implement-checklist.md) = **每次开页必勾**（禁止跳步写盘）。  
> **挂载：** [`AGENTS.md`](../../AGENTS.md) §8.0 R4a / R5 / R5a / R6 / R7  
> **现行队列：** [`.scratch/dapp-7rail-parity/research/200-releaf-restart-queue.md`](../../.scratch/dapp-7rail-parity/research/200-releaf-restart-queue.md)（旧 fresh / page-leaf / 假 page-done **已删**，不得当 SSOT）

---

## 0. 禁止再犯（合并禁语）

| 坏做法                                                                                              | 必须                                                                                                                  |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **多页并行写盘 / 并行 spawn 多页改 `src/`**                                                         | **每次只做一页**；从 #01 **顺序**推进；本页未 `page-done` 禁止开下一页                                                |
| **稿缺态却发明 UI / 用假数填空**                                                                    | Figma 无或未设计完全的状态（如资产空态）→ **跟 HTML 原型**；有稿则尽量跟稿（§8.1）                                    |
| **同 chrome 多处复制 / 每页自造 chart**                                                             | **复用**现有组件；能抽则抽到 `shared/ui`；chart 走共用实现（§8.2）                                                    |
| **测本站 / `pnpm check` 冒充「已从 Figma 拉取」**                                                   | 拉稿 = 本轮 `get_metadata` + 全最小 leaf `get_design_context`；测本站只对照清单，**不是**进度门禁                     |
| **缺 MCP 证据标 page-done / 报「已对齐」**                                                          | leaf 须有：拉取时间 · fileKey · 页帧 nodeId · **全最小 leaf nodeId 清单**；缺任一项 = 本页未开始                      |
| **旧 scratch / 旧 page-done / 旧 fresh leaf 当规格**                                                | 一律作废；开页必须重新拉 Figma；旧文件仅可作 nodeId 线索（现行队列外的 leaf 已删除）                                  |
| 手册摘要略读 / 「整体符合 §X」无逐条对照表                                                          | **逐行**读相关章；leaf 落对照表（§2.1）；缺 → Critical                                                                |
| WebBridge「可选 / DEFER / 稍后补」后标 page-done                                                    | 无 §2.2 实录字段 → Status ≤ `needs-proto-reverify`；R7 不得 PASS                                                      |
| 只点通原型、**不**对本站每个 leaf 做 `getComputedStyle`                                             | 无 §2.3b 实测矩阵 → **禁止**标 UI PASS；R7 Critical                                                                   |
| 修一个组件 / 写一句 `min-h-[53px]` 冒充本页贴稿完成                                                 | **每一个**可见最小 leaf 都要进表 + 实测；漏一项 = 未对齐                                                              |
| 用 `min-h-[Npx]` / `h-[Npx]` / `text-[Npx]` / `size-[Npx]` / `leading-[Npx]` / `p-[Npx]` 等任意长度 | **硬禁**（§2.6）：尺寸只许 token / `Text` variant / 标准刻度 / `var(--*)`；违反 = 写盘 Critical，不论实测是否碰巧对齐 |
| 手册缺数据 / 只写钱路 → 不做下拉、用 flip 冒充                                                      | **UI MUST 做完**；缺口记文档；动态数字空态=`0`/`0.00`（FAQ 同，无 count 动效）；flip ≠ picker                         |
| 「稿∩手册才 MUST」缩 UI                                                                             | 控件跟 Figma/原型；钱跟手册                                                                                           |
| 手册沉默 → 拆旧写 / 发明第三条写链                                                                  | **R4a**：手册有→手册；手册无+可证旧码→恢复；皆无→关写暴露                                                             |
| 清单未齐就改码                                                                                      | 一帧闭环；**§3 步 1–5 / checklist A0–A7 未勾完禁止写产品码**                                                          |
| `pnpm check` / 钱路 PASS / High 波 / 类名像稿 = 完成                                                | 仅 §5 全满；UI PASS **必须**含实测 Δ                                                                                  |
| 证据栏套话（「一致」「N/A」无路径）                                                                 | Critical                                                                                                              |
| 页级/组件级「大概像」冒充 leaf 对齐                                                                 | **必须**钻到 Figma **最小可见子节点**（§2.3）；漏 thumb / 色 / 卡 surface = Critical                                  |
| commit 只跑 eslint/tsc、跳过 knip/jscpd                                                             | **pre-commit + `pnpm check`** 均含 `lint:deadcode` + `lint:duplicates`（§5 / commands）                               |

---

## 1. 交付单位与硬序

**交付单位：** 一个现行 Figma **PC 产品帧** = 一页。  
**开页门禁：** 每开一页必须先打开 [`implement-checklist.md`](./implement-checklist.md) 从顶勾到「允许写盘」；未勾完 **禁止**改 `src/`。

```text
0. 打开 checklist · 登记本帧 nodeId / leaf 路径 · Status=pre-design
1. 手册逐行对照（钱/门闸）
2. OpenAPI 字段对照
3. 原型 WebBridge 点通（五字段）
4. Figma：页帧 + **每一个可见最小子 leaf**（context / metadata → 完整清单）
5. WebBridge **本站**对清单逐项 getComputedStyle（§2.3b）→ 实测 Δ 表
6. 文案动态审计 → leaf 表（UI∥钱路；UI 列挂实测）
✅ 允许写盘：A0–A7 齐
→ 按 FAIL 改码（该页全部相关组件；禁并行下一帧；硬禁任意 px）
→ 再测全清单 → pnpm check → R7 → 用户明示 commit → page-done → 下一页
```

---

## 2. 四源

| 源                      | 钉什么                        | 禁止                                 |
| ----------------------- | ----------------------------- | ------------------------------------ |
| **手册 ∩ money-path**   | 流、读/写、币对、门闸         | 假数；**取消稿/原型控件**            |
| **后端 OpenAPI**        | 展示读字段、精度、分页        | 只扫 path 名不读说明；有字段却标无源 |
| **原型**（DApp 默认有） | IA / 开层 / 空态 / 图标素材源 | 抄 DOM；摘要代替点通；素材臆造       |
| **Figma**               | **最小可见 leaf**             | 截图当规格；粘贴 MCP 整页；只对父框  |

裁决：**视觉跟 Figma 子 leaf · 交互跟原型 · 钱/数跟手册 + 后端 API**（= AGENTS R5a）；手册对该写/读**沉默**时 → **可证旧码**（= AGENTS **R4a**），禁止发明第三条写链。有 API 则 **尽量接线**，缺口登记 [`dapp-data-gaps.md`](../dapp-data-gaps.md)。

### 2.1 手册（逐行 · 强制 · 用户锁定 2026-07-31）

> **禁止摘要式略读。** 对本票触及的 `frontend-manual` 章节（至少 `01-frontend-integration-guide.md` 对应节 + 相关 `contracts/*.md`）以及写链时的 [`money-path-map.md`](../money-path-map.md)，**必须逐行阅读**，使读/写方法、参数、前置检查、成功刷新、注意事项与现码**逐条一致**。这是钱路正确性门闸，不是可跳过的背景。

**写盘前产出（进 leaf，缺一 = Pre-Design / R7 Critical）：**

1. **章节清单**：精确到 guide §号 + 相关 `contracts/*.md` 文件名（禁止只写「已读手册」）。
2. **逐条对照表**：手册每一行（展示字段 / 写方法 / 前置检查 / 成功后刷新 / 注意事项）→ 现码路径或「缺口/产品扩展」；**挂覆盖矩阵 [`manual-coverage/`](../../.scratch/dapp-7rail-parity/research/manual-coverage/README.md) 的 `G-id`**。
3. **张力暴露**：手册字面窄于稿/原型 → leaf 写明扩展边界。
4. **R4a 旧码核**（写入口）：手册未写明 → 查可证旧码；皆无 → 关写暴露。

**数据接线硬序（展示数 · 强制）：**

```text
1. 手册：该数字位的读方法 / 合约 view / 事件？
2. OpenAPI：同语义 path 的 schema 字段？（summary+description+schema 全文）
3. 有任一源 → 接真读；空态 = `0`/`0.00`/`—`（按 docs 约定）
4. 二者皆无 → UI 控件仍做；值诚实空；写入 dapp-data-gaps（页→子页→数据位）
```

禁止：未读手册+API 就标「无源」；用演示数 / 假 1:1 冒充；把两个无关写方法塞进同一 CTA「顺序执行」而不改手册/产品 Answer。

### 2.1b 后端 OpenAPI（展示读 · 强制 · 用户锁定 2026-08-02）

> **后续每一页**的动态数字位：在手册对照之外，**必须**打开现行后端文档 `~/Downloads/新/api-docs.html`，读相关 path 的 **summary + description + schema**（禁止只扫路由名），判断是否有可接字段。

**写盘前产出（进 leaf / [`dapp-data-gaps.md`](../dapp-data-gaps.md)）：**

1. **相关 path 清单**（如 `POST /stake-flow/positions`）。
2. **字段对照**：稿面数值位 → API 字段或「API 无 · 手册/链上有 · 皆无」。
3. **接线裁决**：有 API 或链上源 → **尽量接入**；仅皆无 → 缺口 + 诚实空；禁止未查 API 就写「无源」。

### 2.2 原型（IA · 点通）

**路径：** `~/Downloads/新/` → `AEGIS X DApp.html` / `AEGIS DApp 无数据.html` / `AEGIS DApp Shell 演示.html`

- **DApp 七轨：** 默认必须 WebBridge；禁止自称「本页无原型」。
- 学 IA / 空态 / **图标与素材**用 WebBridge 点通原型；**不用 Playwright**。
- 素材：原型或正式 Figma export；禁止手画替代 gAGX 等 token 图标。
- **原型点通 ≠ 视觉验收。** 视觉以 Figma + **本站** §2.3b 实测为准；禁止用原型 DOM/CSS 当规格。

**WebBridge 实录字段（缺一 = 未点通 → R7 Critical）：**

1. http URL（含文件名）
2. 本面路由/入口怎么进
3. **有序**点击控件列表（含稿有则连接/未连接）
4. 与 `pnpm dev` 本站差异一句（或「一致」）
5. 执行时间（ISO 日即可）

### 2.3 Figma（子 leaf 钻取 · 强制 · 用户锁定 2026-08-02）

`get_design_context` **页级 + 每一个用户可见子节点**；必要时 `get_metadata` 取 **w/h/x/y**；`skillNames` 含 `figma-design-to-code`。

**不是** Figma 图层树 = DOM 树一一映射；**是**每个**可见设计叶子**在运行时有可指出的节点，且规格跟稿一致（尺寸差 ≤2px；色走 token 或稿指定 hex）。

**强制钻取序（漏一层 = 未对齐）：**

```text
页帧 → 左栏/右栏 → 区块（form / rcard / slider…）
→ 控件（AmountBox / Chip / Card surface…）
→ 最小 leaf：thumb/handle、字色、icon 22×22、卡 surface（elevated≠outlined）、padding
```

**开写前必须先产出「本帧全 leaf 清单」**（可与 metadata 树对齐）：每一行一个可见最小 leaf，含 nodeId + 稿规格。  
**禁止**清单只写父框（如「左栏 PASS」）或只挑 1～2 个「用户点名过的」组件。

**leaf 表每一行必须能回答：**

1. Figma node id（如 `4462:639` handle）
2. 规格：h/w/radius/fill/stroke/font/色（从 context 或 metadata，**禁止截图估**）
3. 现码路径 + 用了哪个 primitive/`surface`/`tone`
4. **§2.3b 实测** h/pad/font/lh/… + Δpx / 色是否 PASS；FAIL 不得称完成

**稿面可见控件 = MUST 做完 UI**；手册缺数据 → 缺口记文档 + 诚实空；**禁止**不实现该控件。  
Card：稿无描边+抬起阴影 → `surface="elevated"`；稿有描边 → `outlined`。**禁止**手搓 `shadow-sm` 冒充 elevated。

仅当产品/grilling Answer **书面杀控**才可不做。自写 DEFER /「手册没有」不够。

### 2.3b WebBridge 本站实测（强制 · 用户锁定 2026-08-02）

> **UI PASS 的唯一运行时证据 = 本站 DOM 的 `getBoundingClientRect` / `getComputedStyle`，不是类名、不是 `min-h` 声明、不是 Figma MCP 截图肉眼。**

**何时：** Figma 全 leaf 清单齐之后、**写盘前**做基线实测；改码后对 FAIL 项 **再测**直至闭合。

**对谁：** `pnpm dev` 本站（如 `http://127.0.0.1:5174/...`）上本帧每一个清单 leaf 的对应节点。  
原型可辅证 IA，**不得**替代本站实测。

**怎么测（Kimi WebBridge `evaluate`）：** 对每个 leaf 记录至少：

| 字段                                                                   | 来源                                           |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| 选择器 / 如何定位（aria-label、role、文案）                            | 稳定可复测                                     |
| `height` / `width`（getBoundingClientRect）                            | 对稿 h/w                                       |
| `padding` · `gap` · `border*Width` · `borderRadius` · `box-sizing`     | 对稿间距/描边                                  |
| `fontSize` · `lineHeight` · `fontWeight` · `color` · `backgroundColor` | 对稿字/色                                      |
| 与稿 Δ（px）                                                           | ≤2 → Med/可过；结构错 / ≥3 或错 surface → FAIL |

**leaf 表必须多一列「实测」**（或独立「实测矩阵」节）：稿规格 | 实测 | Δ | PASS/FAIL。  
缺实测列却写 UI PASS → R7 **Critical**。

**禁止：**

- 「已设 `min-h-[53px]` 故 PASS」却从未量 rect（实测可能仍是 57：border + 内容撑破）
- 只测 AmountBox、不测 Chip / CTA / slider / rcard / icon / gap
- 用 Playwright 代替 WebBridge

### 2.4 文案动态审计

| 判定                      | 动作                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| 有链上和/或后端 API       | **尽量接真读**；空=`0`/`0.00`（带单位）+ 非 FAQ count/pop；FAQ 插值同零、无动效；leaf 注明源  |
| 协议不变量                | 可展示；leaf 注手册出处                                                                       |
| 无源（手册+API+链上皆无） | 控件留、值 `0`/`0.00`；**禁止**抄演示数；缺口写入 [`dapp-data-gaps.md`](../dapp-data-gaps.md) |

### 2.5 DEFER 分型（唯一合法）

| 类型                                                         | 合法？             | 例                                                 |
| ------------------------------------------------------------ | ------------------ | -------------------------------------------------- |
| **数据无源**                                                 | 是（只缓数据）     | UI 必须已实现；TVL=`0`/`0.00`；leaf 记「手册缺源」 |
| **产品书面杀控**                                             | 是（可不做该控件） | Answer 写明删 picker                               |
| **因手册不全而不做 UI / WebBridge 未做 / 用 DEFER 关控件门** | **否**             | T-D1 下拉未做、WebBridge「可选」                   |

Med 1–2px / 字阶微调：可记 Low，**不单独**挡 page-done（结构错、状态错、假数、缺控件、**缺实测**仍挡）。  
缺译：键须齐；真译可 `locale-DEFER` 另票，**不**把七语全译绑进同一帧 DoD。

### 2.6 尺寸硬约束（禁任意 px · 用户锁定 2026-08-02）

> **硬禁：** 在 `src/` **不得**新增（也不得在本页改码中保留）Tailwind **任意长度**：`h-[53px]`、`min-h-[52px]`、`text-[24px]`、`leading-[29px]`、`size-[22px]`、`p-[11px]`、`gap-[13px]`、`w-[351px]` 等。  
> **同等禁止：** 手写 hex 当色（应用语义 token）；页袋四处抄数字。  
> **违反本条 = 流程 Critical**，即使 WebBridge 实测碰巧等于稿高也不算 PASS。

目标：**视觉结果 = 稿**；手段只能是设计系统，不是把 Figma 数字抄进 class。

| 优先 | 做法                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `Text` / `Input` 的 `variant` → `theme.css` `--type-*`（改字阶 = 改 token，不改 call site `text-[Npx]`）                                                            |
| 2    | 色：`text-foreground` / `text-primary` / `border-border` / `bg-card` 等                                                                                             |
| 3    | 间距：标准刻度或 `--space-*`（如 `py-3`≡12、`gap-4`≡16、`px-3.5`≡14 若已映射）                                                                                      |
| 4    | **合成稿高**：壳 = 垂直 padding（space token）+ 字盒（`--type-figure-size` + `--type-figure-leading`）+ border；先清冲突（Card 默认 `p-3.5`、input UA pad → `p-0`） |
| 5    | 图标：`--app-icon-*` / `DappIcon` `size`；要对 22 就改 token，禁 `size-[22px]`                                                                                      |
| 6    | 若 token 与稿不一致 → **改 `theme.css` / primitive 一处**，全仓跟 token；**禁止**在 leaf call site 用任意值「补差」                                                 |

**唯一允许的「数字」形态：**

- 已映射的 Tailwind 刻度名：`h-7` `p-3` `gap-2` `text-base`（背后是 token，不是 `[Npx]`）
- `text-(length:--type-figure-size)` / `leading-(--type-figure-leading)` / `size-(--app-icon-token)` 等 **CSS 变量引用**

**删除的旧例外：** 不再允许「Figma 锁死 → 一处 `min-h-[53px]` + 注释 nodeId」。稿高必须靠 token 合成或调整 token；合成后实测 Δ≤2 记 Med，Δ≥3 继续改 token/结构，**禁止**回退到任意 px。

### 2.3c 全 leaf 对照完整性（强制）

> **「大概齐了 / 修了 AmountBox」≠ 本页完成。**  
> 本帧 metadata 树上每一个**用户可见**最小叶都必须：进清单 → 有稿规格 → 有本站实测 → 有 PASS/FAIL。漏一项 = 未对齐。

写盘前自问：清单行数是否接近「可见控件数」？若只有 5～8 行而稿面有 tabs/input/slider/CTA/rcard/bars/legend/nodes/notes —— **清单未完成，禁止写盘。**

---

## 3. 单面步骤（串行）

```text
0. checklist 开页登记
1. 手册逐行   1b. OpenAPI
2. 原型 WebBridge 五字段
3. Figma 全 leaf 清单（context + metadata）
4. 本站 WebBridge 实测矩阵（§2.3b）← 未完成禁止写 src/
5. 动态审计 + leaf 表（UI∥钱路∥实测）
6. 按 FAIL 改码（该页全部相关组件；禁并行下一帧）
7. 再测 FAIL 项闭合
8. pnpm check
9. R7（缺实录 / 缺对照 / 缺实测矩阵 / 未查 API = Critical）
10. 用户明示 commit → page-done → 下一页
```

---

## 4. leaf 最低字段

1. Frame ids
2. 手册章节 + **§2.1 逐行对照表**（展示/写/门闸/注意 → 现码）
3. OpenAPI path 对照（§2.1b）
4. WebBridge 原型实录五字段（或 N/A + 路径证据）
5. **全 leaf 清单** + **§2.3b 实测矩阵**
6. 动态审计表
7. 节点表：**UI 标** ∥ **钱路标** ∥ **实测**（分列）
8. 稿无代码有 → 删/缺口
9. Status：`pre-design` | `in-progress` | `needs-proto-reverify` | `needs-measure` | `page-done`

---

## 5. page-done（硬）

- [ ] 本帧可见控件 **UI 均已实现**（或产品书面杀控）；手册缺数 → 缺口已记文档且值面诚实空——**不得**用缺口当「可不做 UI」
- [ ] 手册 **逐行**已读且 leaf 有对照表；有源接线；无源=`0`/`0.00`且 **UI 仍在**
- [ ] WebBridge 原型实录五字段齐全（或合法 N/A）
- [ ] Figma 页+**每一个**最小子 leaf context/metadata 已拉；全清单无漏项
- [ ] **§2.3b 本站实测矩阵**已写；UI PASS 行均有实测证据；改后回测过
- [ ] 尺寸跟 §2.6：**零** 任意 `*[Npx]`（硬禁）；不对齐则改 token
- [ ] **全 leaf 清单无漏项**（§2.3c）；不是只修了用户点名的一两个控件
- [ ] 「稿无代码有」已处理
- [ ] `pnpm check` exit 0
- [ ] R7 Post-Design：实录 + 实测矩阵 + 全清单 + R5a + R4a；缺则 Critical
- [ ] R7 Post-Code：假数/稿外 chrome/**任意 px** Critical=0
- [ ] 用户明示后 commit（或用户书面「本页不 commit」原句进 leaf）
- [ ] 仅此时 Status=`page-done`；此前禁止下一 Figma PC 帧写盘

**纠偏：** 凡旧 page-done 缺原型实录或缺实测矩阵 → `needs-proto-reverify` / `needs-measure`；**零交付证明**。

---

## 6. 子代理

实现 / 补审 / R7：一律 `cursor-grok-4.5-high`。

---

## 7. 文档分工

| 文件                      | 职责                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| **本文件**                | 工具序 + page-done + 实录 + **实测 §2.3b** + **尺寸 §2.6** + DEFER |
| `AGENTS.md` R1/R4a/R5/R5a | 分层；钱路手册优先/沉默→旧码；「手册不取消 UI」                    |
| `AGENTS.md` R6/R7         | 三门含义、模型、Critical                                           |
| `implement-checklist.md`  | **每次开页必勾**；写盘门禁；禁止第二套叙事                         |
| `.scratch/...`            | 页证据；不得覆盖本文件                                             |

---

## 8. 2026-08-02 晚 · 重启铁律（用户锁定）

> **现行队列：** [`200-releaf-restart-queue.md`](../../.scratch/dapp-7rail-parity/research/200-releaf-restart-queue.md)  
> **旧 fresh leaf / 旧 page-leaf / 假 page-done / 旧 R7 PASS 文档：已删除，禁止再引用当规格。**  
> **顺序：** 从队列 **#01** 起顺序执行；**本页未 `page-done` 禁止开下一页**；禁止并行 spawn 多页改 `src/`。

```text
每次只做一页（从 #01 顺序推进）。
① 本页 get_metadata（页帧）
② 页帧 + 每一个用户可见最小 leaf：get_design_context（skillNames 含 figma-design-to-code）
③ leaf 落：拉取时间 · fileKey · 全 nodeId 清单 · 稿规格
④ 清单齐了 → 才允许写盘
⑤ 本站 WebBridge 实测只对照清单（测本站 ≠ 拉稿）
⑥ Critical=0 → 用户明示 commit → page-done → 才开下一页
缺 MCP 证据 → 不许 page-done · 不许报「已对齐」
```

### 8.1 视觉 SSOT 分层（稿优先 · 稿缺态跟原型）

| 情况                                                         | 跟谁                                                                | 禁止                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------- |
| Figma 有该表面/控件/状态                                     | **尽量对齐 Figma**（在 §2.6 / Foundation / guideline 内）           | 用原型 DOM/CSS 覆盖稿        |
| Figma **无**该状态，或稿面**未设计完全**（例：资产仓位空态） | **HTML 原型**（`~/Downloads/新/` · WebBridge 点通）为该状态 UI SSOT | 发明第三套空态；用假数填满稿 |
| 钱路 / 门闸 / 读写真源                                       | 手册 + OpenAPI + R4a                                                | 用原型演示数当验收           |

### 8.2 组件复用与抽取（强制偏好）

1. **优先复用**现有 `shared/ui` / shell / 本轨已有 primitive（Card / Text / Chip / Segment / AmountBox / FaqList / DropdownMenu / `TvAreaChart` 等）。
2. **同 chrome 多实例 → 抽取**：多页/多轨视觉与行为一致的块，抽到 `shared/ui`（或已有 shell），**禁止**页袋复制粘贴分叉。
3. **Chart：** 面积/折线类图默认走共用 chart 组件（现行 `TvAreaChart`）；新图先扩共用 API，禁止每页另起一套 chart 实现。
4. 抽取只扩 **chrome**（视觉/a11y/动效合同）；业务 options / locale / 合约地址仍在 call site（见 AGENTS R3）。

`manual-coverage/`（手册 G-id）保留，仅服务钱路对照，**不是**视觉 leaf SSOT。

---

## 9. 作废口径

- 一切「旧 page-done / fresh leaf / 测本站即进度 / 并行多页」
- 「选币 pill = flip」「结构 PASS；真 picker DEFER 不挡」
- **保留钱路：** Trade = USD1↔AGX（手册 §7.1）——路径约束，不是 UI 免责声明。
