# 组件使用原则（leaf / composite call site）

> **范围**：页袋 leaf、shell chrome、`shared/ui` composite 的**用法**（如何组 props、何时抽组件）。  
> **不替代**：公开轴 / surface 表 → [`api.md`](./api.md)；样式切片流程 → [`runbook.md`](./runbook.md)；落点 → [`../src-layout.md`](../src-layout.md)；产品 vs 实现归属 → 根 [`AGENTS.md`](../../AGENTS.md) §8.0。

---

## 0. 一句话

**调用方只传「是什么」（数据与意图）；组件消化「怎么画」（chrome / 布局 / 单双图标）。**  
同一 Figma leaf chrome → 一个组件；稿上不同 leaf → 不要硬合成万能卡。

---

## 1. MUST

| #   | 规则                                  | 说明                                                                                                                                                                                                                               |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **同 chrome = 一组件**                | 右侧六张 program 卡样式相同 → 一个 `ExchangeProgramCard`；禁止按业务名拆六份，禁止为「标题+正文」再造 `*Copy` / `*ContentBlock` 工程名                                                                                             |
| 2   | **差异用数据，不用 index / 魔法分支** | 唯一结构差用可选 prop 表达（如 `icon?: [url] \| [url, url]`）；禁止 `if (index === 5)` 决定布局                                                                                                                                    |
| 3   | **Props 传数据，组件内渲染**          | 图标传 URL 元组；单币 / 叠币由组件内部决定。默认不要传 `ReactNode icon` 除非真有第三方任意槽                                                                                                                                       |
| 4   | **Call site 组内容，组件管 chrome**   | 文案（i18n）、跳转、图标表、链上替换串 → 列表 / 页袋；圆角、阴影、字阶、gap → 组件内                                                                                                                                               |
| 5   | **按稿分 leaf，不造万能卡**           | 左栏 `DappModeCard`（outlined · 左图标）≠ 右栏 program（elevated · 右图标）。通用壳是 `Card`；hub leaf 可有多套，每套仍遵守 1–4                                                                                                    |
| 6   | **可点才用 `button`**                 | 有 `onClick` → `as="button"`；不可点且稿面**同视觉** → `article` / `div`（或其它非 button）。**禁止**为「不能点」挂原生 `disabled` 却指望样式不变——全局 `button:disabled` 会 `opacity: .5` + `box-shadow: none`（见 `shared.css`） |
| 7   | **小 API；停在最简层**                | 固定布局用薄 props。结构开始爆炸再考虑 slots / compound；**没有第二 call site 不要提前升 shell**（`src-layout`：≥2 tab 才进 `app/shell`）                                                                                          |

---

## 2. MUST NOT

| 反例                                                            | 为何差                                 |
| --------------------------------------------------------------- | -------------------------------------- |
| `ProgramCardCopy` / `TitleBodyHelper` 当公开概念                | 工程翻译名；业务 / 稿面不认            |
| `icon={<DualCoin …/>}` 作为默认合同                             | 把展示决策推回 call site；URL 数组即可 |
| `switch (index)` 画不同 chrome                                  | 数据与布局耦合；加第七张必改组件       |
| 一个 `DappCard` 吃 left+right+rewards 全部 variant              | prop 爆炸；稿上本是不同 leaf           |
| 不可点卡挂 `disabled` 再叠 `disabled:opacity-100`「盖」全局灰态 | 阴影仍被全局剥掉；语义与样式打架       |
| 业务档位 / locale 默认值进 `shared/ui`                          | 见 §8.0 R3；chrome only                |

---

## 3. Props 阶梯（够用即停）

```text
1. 数据 props（title / body / icon URLs / value）     ← 固定 leaf 默认停这
2. 行为 props（onClick / onChange）
3. children / 具名 slot                              ← 结构开始分叉
4. compound（Card.Header …）                         ← 多块可重组
5. render prop / headless                            ← 逻辑复用、UI 全开
```

参考业界共识：先 props，再 composition；**为假想扩展加 prop = 反模式**。

---

## 4. 交互禁用 vs 视觉禁用

| 意图                                               | 做法                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 稿面**同视觉**，只是暂不可点（如「出售 X」未开放） | **非 `button`**（`article`/`div`）+ 无 `onClick`；或确需 button 语义时用原生 `disabled` **并**用足够优先级覆盖全局 `button:disabled` 的 opacity/shadow（勿只盖 opacity） |
| 稿面**有灰态 / 不可用外观**                        | 原生 `disabled`（或设计系统 Button 的 disabled 轴）；接受 / 对齐 UA 与 foundation 样式                                                                                   |
| 需保留焦点并说明「为何不可用」                     | `aria-disabled` + 自管点击拦截 + 自管样式；**不要**与原生 `disabled` 同挂                                                                                                |

优先原生能力（OpenA11y / MDN）；本仓全局 `button:disabled` 会剥 elevation——「同视觉不可点」默认走 **非 button**。

---

## 5. 范例（兑换 hub program 卡）

```tsx
// call site：数据表
icon={['…/gagx.png', '…/agx.png']}  // 双币
icon={['…/x.png']}                  // 单币
icon={undefined}                    // 纯文案

// 组件：消化展示；无 onClick → as="article"
<ExchangeProgramCard title={…} body={…} icon={…} onClick={…} />
```

---

## 6. 写盘自检（leaf / 入口卡）

```
[ ] 同稿 chrome 是否已并成一组件（无平行 Copy / 分身）
[ ] 结构差是否只用可选数据 prop（无 index 分支）
[ ] 图标 / 素材是否传 URL 或最小数据（非默认 ReactNode 合同）
[ ] 文案 / 跳转 / 业务表是否在 call site + i18n
[ ] 不可点且同视觉：是否避免了裸 `disabled` 灰态
[ ] 是否在没有第二 tab 复用时就塞进 shared/shell
```
