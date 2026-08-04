# 组件用法（leaf / call site）

> 公开轴见 [`ui-tokens.md`](./ui-tokens.md)；改 primitive 流程见 [`runbook.md`](./runbook.md)。

## 一句话

**调用方只传「是什么」（数据与意图）；组件消化「怎么画」（chrome / 布局）。**  
同一 Figma leaf chrome → 一个组件；不同 leaf → 不要硬合成万能卡。

## MUST

| #   | 规则                            | 说明                                           |
| --- | ------------------------------- | ---------------------------------------------- |
| 1   | 同 chrome = 一组件              | 禁止按业务名拆多份 `*Copy`                     |
| 2   | 差异用数据，不用 index 分支     | 结构差用可选 prop                              |
| 3   | Props 传数据，组件内渲染        | 图标优先 URL 元组，勿默认 `ReactNode icon`     |
| 4   | Call site 组内容，组件管 chrome | 文案 / 跳转在页袋；圆角阴影字阶在组件          |
| 5   | 可点才用 `button`               | 禁止用原生 `disabled` 冒充「不可点但样式不变」 |
| 6   | 小 API                          | 没有第二 call site 不要提前升 shell            |

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
- 布局词冒充业务名（`Row` / `Nav` / `Tile` / 泛 `Entry`）

## MUST NOT

- 业务档位 / locale 默认值进 `shared/components`
- `switch (index)` 画不同 chrome
- 一个万能卡吃全部 rail variant
