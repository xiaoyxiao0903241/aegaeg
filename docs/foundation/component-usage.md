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

> **模型**：组合式 elevated 薄壳。网格仍走 `Grid`。  
> `Tile.Label`（可嵌 `Tooltip.Info`）· 主值 **children** · 可选 `Tile.Note`（另起一行说明；≠ info tip；内容恰巧常是 `≈ $…`）。  
> **禁止** `MetricCard` / `*StatCard` / `*OverviewTiles` / `variant` 选布局；禁 `label=`/`note=`/`tooltip=` 袋装 API。

### 壳 — `Tile`（`src/app/shell/tile.tsx`）

| 项   | 合同                                                                                                                                                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 表面 | 内建 `Card surface="elevated"`（`rounded-md` · `p-4` · `shadow-card`）                                                                                                                                                                                                     |
| 布局 | `flex flex-col gap-1.5`；**禁** `h-*` / `min-h-*` / `max-h-*` / `size-full`                                                                                                                                                                                                |
| API  | `Tile` · `Tile.Label` · 主值 children · `Tile.Note`                                                                                                                                                                                                                        |
| 网格 | `Grid`（`app/shell/grid.tsx`；PC `gap-3` · H5 `gap-2.5`；3/4 列 H5 默认两卡；`stackOnDapp`→H5 单列；`6` / `upper3-lower2` = span 壳）；**禁**页内平行 `gap-*` / 盖 gap / 盖列数                                                                                            |
| OUT  | program 导航 · 资产持仓/缓冲复卡 · 共建等级大卡 · 机制文案 · 奖励 Hub（pill/deco）→ **自建具名组件**（禁 `*-content` 内联 Card+div 汤）；表 → `Table`（下节）。标准 Label+主值+可选 Note 的 elevated 指标瓦漏迁必须 `Tile`+`Grid`；缓冲池 AGX/gAGX 多列行归「缓冲复卡」OUT |

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
- 指标瓦网格自写平行 `gap-*`（唯一 owner = `Grid`）

## DApp 轮播（`Carousel`）

> **模型**：组合式 Embla 壳。`shared/components/carousel.tsx`。  
> 页袋**只组卡片**；禁 `setApi` / `CarouselApi` / 自建 indicator / 自管 autoplay。  
> `Carousel.Content` · `Carousel.Item` · `Carousel.Indicators`（peek 内建 EdgeFade）。

| 零件                  | 职责                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `Carousel`            | Embla 根；`opts` · `autoplayMs`（仅 PC）· `syncIndex`                                         |
| `Carousel.Content`    | `chrome="about"`（全幅）\|`"peek"`（多卡窥视+淡出）；chrome 下传给 Item                       |
| `Carousel.Item`       | 单页；可选 `index` → 组件管 `aria-hidden`                                                     |
| `Carousel.Indicators` | 箭头+圆点；`chrome="about"`\|`"plain"`（plain 不跟 about H5 大圆钮）；active **必须** `h-1.5` |

### MUST NOT（轮播）

- 页袋持有 Embla api / `selectedScrollSnap` / 平行 autoplay import
- 平行 `DappCarousel` / 页内 indicator tv / `seasonCarousel` 轨 chrome
- active 圆点缺 `h-*`

## DApp 空态（`Empty`）

> **模型**：纯文案空态 chrome。`shared/components/empty.tsx`。  
> 居中 · `text-foreground/40` · 偏大 pad（`py-11` / H5 `py-8`）。文案由 call site。

| 项     | 合同                                        |
| ------ | ------------------------------------------- |
| Props  | `title` · `body?`                           |
| 复用   | `Table.Empty` / `Chart.Empty` 指向本件      |
| 非职责 | 插画 / CTA / Auth 未登录 / 数字占位业务语义 |

### MUST NOT（空态）

- 页袋自写平行 `py-*` + muted 空文案（应用 `Empty`）
- 把 `AssetsPositionEmptyCard`（插画+CTA）并进本件

## DApp 图（`Chart`）

> **模型**：组合式面积图壳。`shared/components/chart.tsx`。  
> `Chart` · `Header` · `Plot` · `Empty`。点数 / tip 格式由业务件传入。

| 零件           | 职责                                          |
| -------------- | --------------------------------------------- |
| `Chart`        | elevated 卡壳（Figma chart-card / ccard）     |
| `Chart.Header` | 顶栏行（value+delta+range 或 hint+value）     |
| `Chart.Plot`   | Lightweight Charts area + 点阵底 + tip + 轴标 |
| `Chart.Empty`  | 全局 `Empty`                                  |

业务：`StakingTvlChart`（hub/aside）· `StakingCurveChart`（calc，自管本地曲线）。

### MUST NOT（图）

- 页袋直触 `lightweight-charts` / 平行 `TvAreaChart` / `StakingChartCard`
- shared 内嵌 locale 或拉历史索引

## DApp 键值列表（`List`）

> **模型**：数据驱动 infoBox 行轨（**不含 Card**）。`shared/components/list.tsx`。  
> `List` · `Label` · `Value`。卡壳由页袋包：`<Card surface="outlined"><List items={…} /></Card>`。

| 零件         | 职责                                                                |
| ------------ | ------------------------------------------------------------------- |
| `List`       | `items: { label, value, valueClassName? }[]`；行距 SSOT `gap-2.5`   |
| `List.Label` | detail · `text-foreground/40`（Figma muted）                        |
| `List.Value` | detail semibold；**内容原样**（string = 文案）；禁隐式 `CountValue` |

数字 reel：call site 显式 `value: <CountValue text={…} />`。复杂值（划线价、链接+icon）直接塞 ReactNode。

### MUST NOT（列表）

- shared 内嵌 Card / locale
- 平行 `DappMetaPanel` / `DappMetaList`
- `List` 内按 string 自动包 `CountValue`
- call site 用 `className` 盖行距 `gap-*`（统一 `gap-2.5`）

## DApp 步骤（`Steps`）

> **模型**：组合式步骤条（**不含 Card**）。`shared/components/steps.tsx`。  
> `Steps` · `Item`。PC 横排 / H5 竖时间线。卡壳由页袋包。

| 零件         | 职责                                                                |
| ------------ | ------------------------------------------------------------------- |
| `Steps`      | `align="start"`\|`"center"` · `activeIndex?`（0-based；缺省全实心） |
| `Steps.Item` | `title` · `body`                                                    |

| `align`  | 稿         | 连线                    | 间距 / 文案（PC）                                                          |
| -------- | ---------- | ----------------------- | -------------------------------------------------------------------------- |
| `start`  | `4301:226` | **2px**（`h-0.5`）圆→圆 | 无 gap · 非末项 `pr-4` · 轨 `-mr-4` 接线 · 圆→文 12 · 题→说明 8 · 文左齐圆 |
| `center` | `4359:531` | **2px** 贯通 · 首末圆心 | 同上 padding · 文案 max≈148 · 圆→文 16 · 题→说明 4 · 居中                  |

### MUST NOT（步骤）

- shared 内嵌 Card / locale
- 平行 `DappProcessSteps`
- call site 自写编号步骤 chrome（点轴时间线 ≠ Steps，见资产 Rebase）

## 右栏详情壳（`Detail`）

> **模型**：右栏内容区外壳。`shared/components/detail.tsx`。  
> PC `px-7 pt-10` + shadow-bleed 底距；H5 `p-0`（边距归 shell window）。节距由 Detail `gap-8.5` / `max-dapp:gap-6` 承担（PC 34 / H5 24）；子级直接列 Section（禁 bag Fragment 藏节）。

### MUST NOT（详情壳）

- 平行 `DappDetailPage`
- 右栏内容页自写同等 padding / 节距（禁 `Section` `mt-*` 或页级平行 gap）

## 右栏内容节（`Section`）

> **模型**：组合式右栏节。`shared/components/section.tsx`。  
> `Section` · `Title` · `Description`。节间距归 Detail；节内 Title / Description / body 一律 `gap-4`。

| 零件 / 轴             | 职责                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Section`             | 节壳：`flex flex-col gap-4`；可选 `collapsible` · `defaultOpen` · `reveal`；折叠箭头 ≡ `CollapseChevron` `lg` |
| `Section.Title`       | `Text` `section` · `m-0`；仅 `children` + 可选 `id`；折叠时进标题行 button（`as="span"`）                     |
| `Section.Description` | `Text` `copy` · `m-0 text-foreground/40`；仅 `children`；与 Title/body 间距由 Section `gap-4` 承担            |

`collapsible` **隐含**：进场 `reveal`；展开 settle 后内层 `overflow-visible`（展开中保持 clip，放表卡阴影）。call site 只写 `collapsible`，勿再叠 `reveal` / `bodyClassName`。

### MUST NOT（节）

- 平行 `DappDetailBlock` / `DappContentHeading` / `DappSection` / `DappCollapsibleSection`
- call site 给 `Title` / `Description` 挂 `className` 改字阶或间距（禁 `text-xl` / `pb-*` / `mb-*` 等 fork）
- 折叠节再传 `reveal` / `bodyClassName="overflow-visible"`（已是 `collapsible` 默认）
- 平行折叠箭头（须用 `CollapseChevron`；禁稿面 img / 自写 rotate+色）
- 抽仅含 `Section` / `Section.Title` + 透传 children 的 helper（如 `*ChartFaq` / `*Heading`）；跨页雷同留在 `*-detail.tsx` 内联，用 `jscpd:ignore`（理由含「页内拼装」），勿为过重复检测升独立壳

### 结构例外（允许）

- 标题行伴生（CTA、chips）：在 **detail 页内** 用外层 flex 组合包住 Title + 伴生控件，**不**改 Title `className`，**不**升独立壳；折叠箭头由 `collapsible`→`CollapseChevron` 自带，禁装饰假折叠
- 非折叠节单独 `reveal`（社区 / Genesis 等进场动画）

## DApp 表（`Table`）

> **模型**：组合式 elevated 表壳。`shared/components/table.tsx`。  
> `Table.Header`（卡内顶槽）· `Table.Body`（网格+空态）· `Table.Cell` · `Table.Footer` · `Table.Pagination`。  
> 区块标题仍在卡外 `Section.Title`。Header ≠ 列名 thead。

| 零件                             | 职责                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- |
| `Table`                          | elevated 壳（`rounded-2xl` · `p-0` · `shadow-card`）；认 Header/Footer 槽 |
| `Table.Header`                   | 卡内顶槽（pill / 进度…）                                                  |
| `Table.Body`                     | 列头+行；`empty` 时空态；列强调 props                                     |
| `Table.Cell`                     | 单元格 chrome（手写表 / Body 内部）                                       |
| `Table.Footer`                   | 卡内底槽                                                                  |
| `Table.Pagination`               | 分页控件（贴 Footer）                                                     |
| `Table.Empty` / `Auth` / `Shell` | 空态（复用全局 `Empty`）/ 未连接（title·body·CTA 由 call site）/ 自建壳   |

### MUST NOT（表）

- `DappTable*` / `ResponsiveTable`；`header=`/`footer=` 袋装冒充结构
- call site 再抹表壳 `p-*` / `rounded-*` / `shadow-*` / 外框 `border`

## MUST NOT

- 业务档位 / locale 默认值进 `shared/components`
- `switch (index)` 画不同 chrome
- 一个万能卡吃全部 rail variant
