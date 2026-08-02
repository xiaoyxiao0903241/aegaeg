# UI 页面实现工作流（全仓通用 · 强制）

> **状态：** 用户锁定 2026-07-30（对抗纠偏：堵 R5 合取漏洞 · 手册沉默 ≠ 取消 UI · WebBridge 实录字段）；**2026-07-31 加锁：手册逐行对照 + R4a（手册有→手册；手册无→可证旧码）**  
> **本文件 = `page-done` 与工具序唯一正文。** `AGENTS.md` 管分层；`implement-checklist.md` 只管勾选。  
> **挂载：** [`AGENTS.md`](../../AGENTS.md) §8.0 R4a / R5 / R5a / R6 / R7

---

## 0. 禁止再犯（合并禁语）

| 坏做法                                           | 必须                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 手册摘要略读 / 「整体符合 §X」无逐条对照表       | **逐行**读相关章；leaf 落对照表（§2.1）；缺 → Critical                                        |
| WebBridge「可选 / DEFER / 稍后补」后标 page-done | 无 §2.2 实录字段 → Status ≤ `needs-proto-reverify`；R7 不得 PASS                              |
| 手册缺数据 / 只写钱路 → 不做下拉、用 flip 冒充   | **UI MUST 做完**；缺口记文档；动态数字空态=`0`/`0.00`（FAQ 同，无 count 动效）；flip ≠ picker |
| 「稿∩手册才 MUST」缩 UI                          | 控件跟 Figma/原型；钱跟手册                                                                   |
| 手册沉默 → 拆旧写 / 发明第三条写链               | **R4a**：手册有→手册；手册无+可证旧码→恢复；皆无→关写暴露                                     |
| 多页并行写盘                                     | 一帧闭环到 page-done 后才开下一帧                                                             |
| `pnpm check` / 钱路 PASS / High 波 = 完成        | 仅 §5 全满                                                                                    |
| 证据栏套话（「一致」「N/A」无路径）              | Critical                                                                                      |
| 旧 scratch「选币=flip PASS」                     | **作废**（见 §9）                                                                             |
| 页级/组件级「大概像」冒充 leaf 对齐              | **必须**钻到 Figma **最小可见子节点**（§2.3）；漏 thumb / 色 / 卡 surface = Critical          |
| commit 只跑 eslint/tsc、跳过 knip/jscpd          | **pre-commit + `pnpm check`** 均含 `lint:deadcode` + `lint:duplicates`（§5 / commands）       |

---

## 1. 交付单位与硬序

**交付单位：** 一个现行 Figma **PC 产品帧** = 一页。

```text
手册逐行对照（钱/门闸）→ OpenAPI 字段对照 → 原型 WebBridge（DApp MUST）
→ Figma：页帧 + **每一个可见子 leaf**（get_design_context / get_metadata）
→ 文案动态审计 → leaf 表（UI∥钱路，逐子节点）→ 最小改码 → 回看
→ pnpm check（含 knip + jscpd）→ R7（Grok 双轨）→ 用户明示 commit → page-done → 下一页
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

### 2.2 原型

**路径：** `~/Downloads/新/` → `AEGIS X DApp.html` / `AEGIS DApp 无数据.html` / `AEGIS DApp Shell 演示.html`

- **DApp 七轨：** 默认必须 WebBridge；禁止自称「本页无原型」。
- 学 IA / 空态 / **图标与素材**用 WebBridge 点通原型；**不用 Playwright**。
- 素材：原型或正式 Figma export；禁止手画替代 gAGX 等 token 图标。

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

**leaf 表每一行必须能回答：**

1. Figma node id（如 `4462:639` handle）
2. 规格：h/w/radius/fill/stroke/font/色（从 context 或 metadata，**禁止截图估**）
3. 现码路径 + 用了哪个 primitive/`surface`/`tone`
4. Δpx / 色是否 PASS；FAIL 不得称完成

**稿面可见控件 = MUST 做完 UI**；手册缺数据 → 缺口记文档 + 诚实空；**禁止**不实现该控件。  
Card：稿无描边+抬起阴影 → `surface="elevated"`；稿有描边 → `outlined`。**禁止**手搓 `shadow-sm` 冒充 elevated。

仅当产品/grilling Answer **书面杀控**才可不做。自写 DEFER /「手册没有」不够。

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

Med 1–2px / 字阶微调：可记 Low，**不单独**挡 page-done（结构错、状态错、假数、缺控件仍挡）。  
缺译：键须齐；真译可 `locale-DEFER` 另票，**不**把七语全译绑进同一帧 DoD。

---

## 3. 单面步骤（串行）

```text
1. 手册逐行对照   1b. 后端 OpenAPI 对照（§2.1b）   2. WebBridge 实录   3. Figma context
4. 动态审计 5. leaf（UI∥钱路） 6. 改码（禁并行下一帧）
7. 回看     8. pnpm check       9. R7（缺实录/缺对照表/未查 API=Critical）
10. 用户明示 commit → page-done → 下一页
```

---

## 4. leaf 最低字段

1. Frame ids
2. 手册章节 + **§2.1 逐行对照表**（展示/写/门闸/注意 → 现码）
3. WebBridge 实录（或 N/A + 路径证据）
4. 动态审计表
5. 节点表：**UI 标** 与 **钱路标** 分列
6. 稿无代码有 → 删/缺口
7. Status：`pre-design` | `in-progress` | `needs-proto-reverify` | `page-done`

---

## 5. page-done（硬）

- [ ] 本帧可见控件 **UI 均已实现**（或产品书面杀控）；手册缺数 → 缺口已记文档且值面诚实空——**不得**用缺口当「可不做 UI」
- [ ] 手册 **逐行**已读且 leaf 有对照表；有源接线；无源=`0`/`0.00`且 **UI 仍在**
- [ ] WebBridge 实录五字段齐全（或合法 N/A）
- [ ] Figma 页+子 context 已拉
- [ ] 「稿无代码有」已处理
- [ ] `pnpm check` exit 0
- [ ] R7 Post-Design：实录字段 + R5a + R4a 旧码核；缺则 Critical
- [ ] R7 Post-Code：假数/稿外 chrome Critical=0
- [ ] 用户明示后 commit（或用户书面「本页不 commit」原句进 leaf）
- [ ] 仅此时 Status=`page-done`；此前禁止下一 Figma PC 帧写盘

**纠偏：** 凡旧 page-done 缺原型实录 → `needs-proto-reverify`；**零交付证明**（禁止「代码轴仍有价值」话术冒充半完成）。

---

## 6. 子代理

实现 / 补审 / R7：一律 `cursor-grok-4.5-high`。

---

## 7. 文档分工

| 文件                      | 职责                                            |
| ------------------------- | ----------------------------------------------- |
| **本文件**                | 工具序 + page-done + 实录字段 + DEFER 分型      |
| `AGENTS.md` R1/R4a/R5/R5a | 分层；钱路手册优先/沉默→旧码；「手册不取消 UI」 |
| `AGENTS.md` R6/R7         | 三门含义、模型、Critical                        |
| `implement-checklist.md`  | 勾选；禁止第二套叙事                            |
| `.scratch/...`            | 页证据；不得覆盖本文件                          |

---

## 8. 重新开始（5 步）

1. 合并本纠偏（R5a + 本文件）并 commit（用户明示时）。
2. 队列全部非 page-done：`needs-proto-reverify` / `not started`。
3. 从兑换主页 `4267:212` 起：**一页一闭环**（含原型 + Trade 类控件 MUST）。
4. Trade：picker 下拉 = UI FAIL 直至实现；§7.1 钱路可先 PASS。
5. 全部真 page-done 后再通知用户。

---

## 9. 作废的旧 scratch 口径

下列指导 **superseded**（可留文件但须当错）：

- 「选币 pill = flip」「点选 = flip → PASS」「结构 PASS；真 picker DEFER 不挡」
- 出现在：`55-trade-page-leaf`、`13-exchange-tab-pre-design`、`39`/`40`/`41` exchange leaf、`16-exchange-r7-review` 等

**保留：** 钱路「Trade = USD1↔AGX」（手册 §7.1）——那是路径，不是 UI 免责声明。
