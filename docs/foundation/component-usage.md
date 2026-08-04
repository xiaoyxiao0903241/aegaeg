# 组件用法（leaf / call site）

> 公开轴见 [`ui-tokens.md`](./ui-tokens.md)；改 primitive 流程见 [`runbook.md`](./runbook.md)。

## 一句话

**调用方只传「是什么」（数据与意图）；组件消化「怎么画」（chrome / 布局）。**  
同一 Figma leaf chrome → 一个组件；不同 leaf → 不要硬合成万能卡。

## MUST

| #   | 规则                            | 说明                                                                                                                            |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 同 chrome = 一组件              | 禁止按业务名拆多份 `*Copy`                                                                                                      |
| 2   | 差异用数据，不用 index 分支     | 结构差用可选 prop                                                                                                               |
| 3   | Props 传数据，组件内渲染        | 图标优先 URL 元组，勿默认 `ReactNode icon`                                                                                      |
| 4   | Call site 组内容，组件管 chrome | 文案 / 跳转在页袋；圆角阴影字阶在组件                                                                                           |
| 5   | 可点才用 `button`               | 禁止用原生 `disabled` 冒充「不可点但样式不变」                                                                                  |
| 6   | 小 API                          | 没有第二 call site 不要提前升 shell                                                                                             |
| 7   | **优先组合式**                  | 壳 + 具名子件（`Tile.Label` / `Table.Header`）；槽用子树表达，禁袋装 `header=`/`tooltip=` 冒充结构。无第二 call site 不硬抽子件 |

## Hub 左栏（B+D · `InteractiveCard`）

> **模型**：薄壳（B）+ 仅当有**同一业务名**且骨架 ≥2 才抽（D）。壳管行为；字阶走 `Text`。

### 壳 — `InteractiveCard`

| 项     | 合同                                                                |
| ------ | ------------------------------------------------------------------- |
| 表面   | `Card outlined`（pad / radius / border 由 Card；禁 call site 再抹） |
| 职责   | 可点才挂交互：hover、整卡 `button` 或 `hitArea="overlay"`           |
| 非职责 | 无 Title / Description 等文案子件；不挂文案角色 prop                |
| 布局   | call site `className`（gap / grid / min-h）                         |

### 内容 — `Text`（页袋按业务组合）

| Hub 角色（稿）                 | 写法                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 标题（14 SB）                  | `variant="detail"` + `font-semibold`                                                                                                |
| 说明 / 列旁注 / ≈（copy @40%） | `variant="copy"` + `text-foreground/40`（资产仓位/收益列标、释放 releasing 等；**勿** `Card.Description` / `muted-foreground`≈70%） |
| 贴主额的字段标签（copy @70%）  | `variant="copy"` + `text-foreground/70`（如奖励「余额」）                                                                           |
| 中额（14 SB）                  | `as="strong"` `variant="detail"` + `font-semibold`                                                                                  |
| 主额                           | `as="strong"` `variant="headline"`                                                                                                  |

### 命名与抽取

- **数据 / 常量用业务名**：`EXCHANGE_MODES`（闪兑/交易/…）、`STAKING_MODES`、`REWARD_CARDS`、释放队列/缓冲池——跟产品说话。
- **禁止**为「图标+标题+说明」这种纯 chrome 骨架发明共享名：`HubNavRow` / `HubModeEntry` / `ModeEntry` / `*Row`（布局词）一律不要。
- **何时抽组件**：有稳定**业务**身份（如「LP 债券仓位」）且 ≥2 处复用；chrome 雷同但业务不同 → **各页袋内联**，不抽假共享。

### MUST NOT（Hub）

- 硬套 `Card.Title` / `Card.Description` 再拧字阶
- 平行文案子件 API（`HubEntry.*` / `InteractiveCard.Title`）
- 万能卡 / `switch (index)` 吞多种骨架
- 布局词冒充**左栏入口**业务名（`Row` / `Nav` / 泛 `Entry`）；右栏数据卡壳 `Tile` 见下节

## 右栏数据卡（B+D · `Tile`）

> **模型**：组合式 elevated 薄壳。网格仍走 `OverviewGrid`。  
> `Tile.Label`（可嵌 `Tooltip.Info`）· 主值 **children** · 可选 `Tile.Note`（另起一行说明；≠ info tip；内容恰巧常是 `≈ $…`）。  
> **禁止** `MetricCard` / `*StatCard` / `*OverviewTiles` / `variant` 选布局；禁 `label=`/`note=`/`tooltip=` 袋装 API。

### 壳 — `Tile`（`src/app/shell/tile.tsx`）

| 项   | 合同                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 表面 | 内建 `Card surface="elevated"`（`rounded-md` · `p-4` · `shadow-card`）                                                                                            |
| 布局 | `flex flex-col gap-1.5`；**禁** `h-*` / `min-h-*` / `max-h-*` / `size-full`                                                                                       |
| API  | `Tile` · `Tile.Label` · 主值 children · `Tile.Note`                                                                                                               |
| 网格 | `OverviewGrid`（PC `gap-3` · H5 `gap-2.5`；3/4 列 H5 默认两卡；`stackOnDapp`→H5 单列；`6` / `upper3-lower2` = span 壳）；**禁**页内平行 `gap-*` / 盖 gap / 盖列数 |
| OUT  | program 导航 · 资产持仓/缓冲复卡 · 共建等级大卡 · 机制文案 · 奖励 Hub（pill/deco）→ **自建组件**；表 → `Table`（下节）                                            |

### 内容 — 页袋组合

| 角色            | 写法                                                  |
| --------------- | ----------------------------------------------------- |
| 标签            | `Tile.Label`（字阶由 Label 钉）                       |
| tooltip         | `Tooltip.Info` 嵌在 Label 内                          |
| 主值 / 图标行   | **`Tile` children**（`Text` / `CountValue` / `Icon`） |
| 另起一行说明    | `Tile.Note`（弱字阶；同行内联旁注仍进主值 children）  |
| pill CTA / deco | OUT：自建组件                                         |

### MUST NOT（右栏）

- `variant` / layout 参数；`hint` 双义（tooltip 与说明行）
- `*StatCard` / `*MetricCard` / `*OverviewTiles`；call site 再抹 `p-*` / `rounded-*` / `shadow-*`
- 指标瓦网格自写平行 `gap-*`（唯一 owner = `OverviewGrid`）

## DApp 表（`Table`）

> **模型**：组合式 elevated 表壳。`shared/components/table.tsx`。  
> `Table.Header`（卡内顶槽）· `Table.Body`（网格+空态）· `Table.Cell` · `Table.Footer` · `Table.Pagination`。  
> 区块标题仍在卡外 `DappContentHeading`。Header ≠ 列名 thead。

| 零件                             | 职责                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- |
| `Table`                          | elevated 壳（`rounded-2xl` · `p-0` · `shadow-card`）；认 Header/Footer 槽 |
| `Table.Header`                   | 卡内顶槽（pill / 进度…）                                                  |
| `Table.Body`                     | 列头+行；`empty` 时空态；列强调 props                                     |
| `Table.Cell`                     | 单元格 chrome（手写表 / Body 内部）                                       |
| `Table.Footer`                   | 卡内底槽                                                                  |
| `Table.Pagination`               | 分页控件（贴 Footer）                                                     |
| `Table.Empty` / `Auth` / `Shell` | 空态 / 未连接（title·body·CTA 由 call site）/ 自建壳                      |

### MUST NOT（表）

- `DappTable*` / `ResponsiveTable`；`header=`/`footer=` 袋装冒充结构
- call site 再抹表壳 `p-*` / `rounded-*` / `shadow-*` / 外框 `border`

## MUST NOT

- 业务档位 / locale 默认值进 `shared/components`
- `switch (index)` 画不同 chrome
- 一个万能卡吃全部 rail variant
