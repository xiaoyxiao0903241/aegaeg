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

## MUST NOT

- 业务档位 / locale 默认值进 `shared/ui`
- `switch (index)` 画不同 chrome
- 一个万能卡吃全部 rail variant
