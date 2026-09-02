# DApp 视觉验收：原型优先

> **状态：现行**（本轮对照修复）  
> 触发：用户点名布局 / 空态 / 壳层 /「跟原型改」时读本文件，再改代码。  
> 文件仍在本机 Downloads，**不入仓**（各约 9MB 打包 HTML）。

## 裁决

|层|真源|
|---|---|
|控件位置、间距、空态、壳层、未登录贴底|下面三份 HTML 原型|
|数 / 写链 / fail-closed|手册 + API（不变）|
|用户可见文案|`src/i18n/messages/`（PC）；原型中文只对布局，不改文案表，除非用户点名|

Figma 页表仍在 [`docs/figma-pages.md`](../figma-pages.md)，**本轮不拿稿否决与原型一致的改动**。

一次只修用户点名的那一处。修完停，等下一问。

## 三份原型

|文件|标题|用来对什么|
|---|---|---|
|`/Users/ava/Downloads/新/AEGIS X DApp.html`|AEGIS X DApp — 简体中文|已连接、有数据|
|`/Users/ava/Downloads/新/AEGIS DApp 无数据.html`|AEGIS X DApp — 新用户空数据演示|已连接、空数据 / 零值 / 「暂无」|
|`/Users/ava/Downloads/新/AEGIS DApp Shell 演示.html`|AEGIS X DApp — 简体中文|壳层 + 新手 `data-tour-id` / `tourSteps`|

顶栏有 Drawcode 开关 `walletConnected`（默认 `true`）。未连接主要改顶栏「连接钱包」；左栏引导卡文案「连接以探索 AEGIS X 功能」在产品代码里，原型未必有同句——对位置时看左栏 `min-height: 100%` 的贴底，不要去稿里找同文案。

## 怎么读（打包 HTML）

这是 Drawcode 单文件包：页面在 `<script type="__bundler/template">` 的 JSON 字符串里。

```bash
python3 - <<'PY'
import json, re, pathlib, sys
src = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
m = re.search(r'<script type="__bundler/template"[^>]*>(.*?)</script>', src, re.S)
pathlib.Path('/tmp/aegis-proto.html').write_text(json.loads(m.group(1).strip()), encoding='utf-8')
print('wrote /tmp/aegis-proto.html')
PY
"/Users/ava/Downloads/新/AEGIS DApp 无数据.html"
```

然后在 `/tmp/aegis-proto.html` 里搜：

1. `<!-- ===== … widget ===== -->` / `<!-- ===== … detail ===== -->`（左栏 / 右栏分块）
2. `data-screen-label="…"`（屏名）
3. `<sc-if value="{{ isXxx }}">`（哪块在亮）
4. 文件后部 `<script type="text/x-dc">` 的 `renderVals()`（数据与 `isSwapHub` 等开关）

左栏每一屏根节点都是 `display:flex; flex-direction:column; min-height:100%`，内层 `flex:1; min-height:0`。贴底、拉高、空态占位都按这个骨架对，不要按稿的绝对坐标。

## 屏 → 代码

Rail id：`swap` · `staking` · `assets` · `genesis` · `rewards` · `release` · `community` · `governance`（治理在原型有占位，产品轨以注册表为准）。

|`data-screen-label` / 注释|代码|
|---|---|
|兑换|`src/views/dapp/exchange/hub/`|
|闪兑 / 交易 / 销毁 / 涡轮|`exchange/flash-exchange/` · `market-trade/` · `burn/` · `turbine/`|
|质押 / 质押-质押 / LP债券 / 销毁债券 / X挖矿 / 收益计算器|`staking/hub/` · `stake/` · `bond/` · `xmine/` · `calc/`|
|资产 / 资产-质押 / 资产 子页（通用）|`assets/hub/` · `assets/position/` · `assets/xmine/`|
|释放 / 释放-释放池 / 释放-缓冲池|`release/hub/` · `queue/` · `buffer/`|
|奖励 / 推荐奖 / 共建奖励|`rewards/hub/` · 各 claim 袋 · `rewards/genesis/`|
|社区|`community/`|
|共建|`genesis/`|
|壳（顶栏 / rail / 窗口）|`views/dapp/host/` · `views/dapp/shared/dock-frame.tsx`|

子视图开关与原型一致：`swapView` · `stakingView` · `assetsView` · `releaseView` · `rewardsView`。

## 每问步骤

1. 读本文件。
2. 按「有数据 / 空数据 / 壳·教程」打开对应 HTML；需要搜结构时先解出 `/tmp/aegis-proto.html`。
3. 用上表落到代码；布局先看 `DockPanel` / `DockStack` / `TabHeader`，再进页袋。
4. 只改这一处；token / `<Text>` / 手册钱路规则仍遵守。
5. 对照句：原型里该屏的结构（flex 贴底、空态卡、间距）已经在产品里复现。

原型没有的块（例如产品里才有的未登录引导卡）：对齐最近的空态/未连接骨架（左栏拉满、底边贴内容区底），不要发明第二套布局。
