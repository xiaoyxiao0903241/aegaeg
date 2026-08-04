# Foundation Runbook

> Token / 轴：[`ui-tokens.md`](./ui-tokens.md) · 用法：[`component-usage.md`](./component-usage.md)

## 何时走本 runbook

触达 **Token / Text / Button / Card / InteractiveCard / Chip / Input / shell primitive** 时必走。  
新建 / 重构 hub 入口卡、同 chrome 多实例 → 同时读 [`component-usage.md`](./component-usage.md)。

## 流程

1. 对照 [`ui-tokens.md`](./ui-tokens.md) 确认公开轴；不扩轴、不新增 alias。
2. 对照 Figma + 当前分支同位置源码，写清根因。
3. primitive 收束 + **全仓 call site** 同 PR 迁完。
4. `tsc` + 人工对照。

## 全站文本

- 用户可见文案必须 `<Text variant tone>`。
- Shell（rail / topbar / mobile-nav）只留布局 / 色 / 间距；字阶归 `<Text>`。
- 禁止组件硬编码 `text-[Npx]` / `#hex`；色进 `tokens.json`。
- 禁止在 `shared/components` 硬编码业务枚举与 locale 文案。

## MUST NOT

- `deprecatedAliases` / 半迁移
- call site `!min-h-*` / `!text-*` 绕过 Button size
- 新增 `ink-*` / `faint` / `on-dark` 等遗留色
- 为凑截图改全局 token
