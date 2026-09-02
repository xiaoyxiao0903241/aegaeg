# 暂时关闭 X 挖矿子页

> **状态：现行（暂时关闭）**  
> 触发：恢复入口、改深链接、改质押/资产 Hub 卡、改测算产品 Tab 时读。

## 裁决

X 挖矿子页（质押 `#staking/xmine`、资产 `#assets/xmine`）暂时不对用户开放。  
Hub 上仍展示入口卡，标「即将推出」、不可点。测算器产品 Tab **隐藏**挖矿项。  
质押 / LP 债券 / 销毁债券不动。写链函数不额外加闸：进不去页面即不可提交。

开关 SSOT：`src/shared/config/dapp-deep-links.ts` 的 `XMINE_SUBVIEW_CLOSED`。

## 如何恢复

1. 把 `XMINE_SUBVIEW_CLOSED` 改成 `false`。
2. 跑 `pnpm check`（至少 `tests/unit/shared/exchange-deep-link.test.mjs`：单测按 `isXmineSubviewClosed` 分支，不用改断言）。
3. 提交这一行开关即可。Hub 卡恢复可点、hash 再解析进子页、测算 Tab 重新出现。

不要删 `isXmineSubviewClosed` / `replaceClosedXmineHash` / Hub 徽章接线；开关为 false 时它们是空操作。产品永久下线再另开切片拆除。

## 关闭时行为

|面|关闭时|
|---|---|
|`#staking/xmine` / `#assets/xmine`|解析为对应 Tab 的 hub；地址栏改写成 `#staking` / `#assets`|
|`openStakingView('xmine')` / `openAssetsView('xmine')`|落到 hub|
|质押 / 资产 Hub 挖矿卡|不可点 + `common.comingSoon` 徽章|
|测算产品 Tab|不列出 X 挖矿；内存若仍是挖矿则切回质押|

## 不要动

- 入仓手册正文、`env/manual.bsc.addresses.env`
- `calc-estimate-store` 挖矿公式与其单测（store 仍能 `setProduct('xmine')`）
- 创世卡「即将关闭」文案与可点行为（对照的是徽章样式，不是禁用）
