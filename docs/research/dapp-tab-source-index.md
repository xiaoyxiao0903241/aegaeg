# Dapp 各章对照源索引

> 现行目录：各章对应的手册 / API / Figma / 原型 / 代码根。  
> 对齐结论以 [`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md) 为准。  
> 规则：[`docs/decisions/dapp-data-coverage-matrix-wayfinder.md`](../decisions/dapp-data-coverage-matrix-wayfinder.md)

## 全局真源（各章共用）

| 类               | 路径 / 说明                                                                                                                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 链上手册入口     | [`docs/onchain-manual/README.md`](../onchain-manual/README.md) · 流程主文 [`01-frontend-integration-guide.md`](../onchain-manual/01-frontend-integration-guide.md) · 地址 [`00-addresses.md`](../onchain-manual/00-addresses.md) · 合约拆页 [`contracts/`](../onchain-manual/contracts/) · ABI [`abis/`](../onchain-manual/abis/) |
| 旧手册（仅缺口） | [`docs/onchain-manual-legacy.md`](../onchain-manual-legacy.md)（绑定 / 预售 / 预售团队奖）                                                                                                                                                                                                                                        |
| Backend API      | [`docs/backend-api/openapi.json`](../backend-api/openapi.json)（机器真源）· [`api.md`](../backend-api/api.md) · [`README.md`](../backend-api/README.md)（16 tags / 58 paths）                                                                                                                                                     |
| Figma 页表       | [`docs/figma-pages.md`](../figma-pages.md) · fileKey `uiKwzwIoD06phS0husdqjB` · canvas `4253:365`                                                                                                                                                                                                                                 |
| HTML 原型        | 仓库内**仅** [`public/proto/aegis-dapp-empty.html`](../../public/proto/aegis-dapp-empty.html)（标题「新用户空数据演示」；单文件多轨演示，非按 tab 拆文件）。`docs/onchain-manual/AEGIS_X_FRONTEND_MANUAL.html` 为手册源 HTML，**不是** UI 原型。`index.html` / `app.html` 为 Vite 入口，不计原型。                                |
| Tab 注册         | [`src/views/dapp/dapp-tab-registry.tsx`](../../src/views/dapp/dapp-tab-registry.tsx) · 会话 [`dapp-tab-sessions.ts`](../../src/views/dapp/dapp-tab-sessions.ts) · 槽位 [`tab-slots.tsx`](../../src/views/dapp/tab-slots.tsx)                                                                                                      |

**覆盖质量口径（本章末一行）：** 四源（手册章节 · API tag · Figma 产品帧 · 代码根）齐且可对扫 → **strong**；缺一主要源或仅空态/一期 → **weak**；几乎无可用源 → **missing**。

---

## 1. host + shared

> Host 专章含 `views/dapp/host` + `views/dapp/shared`（非 tab；壳 / 窗口宿主）。

### Onchain manual

| 相关                                          | 路径 / 锚点                                                |
| --------------------------------------------- | ---------------------------------------------------------- |
| 全局状态 / 交易态                             | `01-frontend-integration-guide.md` §1.3–1.4、§3 用户端流程 |
| 「钱包资产」页（余额/连网；偏资产也服务宿主） | §4 钱包资产页；页→合约表「钱包资产」                       |
| 推荐绑定前置（宿主门闸常触）                  | §5 Referral · `contracts/referral.md`                      |
| 账户迁移（钱包细节偶触）                      | §17 · `contracts/accountmigrationmanager.md`               |
| 地址 / ABI 总表                               | `00-addresses.md` · `abis/`                                |

Legacy：无专章；绑定细节可补 [`onchain-manual-legacy.md`](../onchain-manual-legacy.md) §2。

### Backend API / OpenAPI

| Tag / 区                | Paths（摘要）                                                          |
| ----------------------- | ---------------------------------------------------------------------- |
| **一期接口** · 鉴权     | `POST /auth/login`（SIWE/JWT 业务登录；连接 ≠ 登录）                   |
| 一期 · 弹窗（若宿主挂） | `POST /home/popup-notices`（home 边界；矩阵范围不含 home，仅注明存在） |

无独立 `host` / `session` / `onboarding` tag。

### Figma（`figma-pages.md`）

| 用途                                        | 条目                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| 新手教程（宿主 onboarding 主对照）          | PC 教程 1/12–12/12 · `4305:212`…`4317:212`（跨兑换/质押/资产/释放/涡轮/奖励/社区导航） |
| 独立「Host / AppBar / Rail / 未连接」产品帧 | **无**（备注：稿几乎全为 connected；无 title 级未连接页）                              |

### HTML 原型

- [`public/proto/aegis-dapp-empty.html`](../../public/proto/aegis-dapp-empty.html)（含壳层导航；未拆文件）

### 代码根

| 根                           | 内容                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/views/dapp/host/`       | `dapp-host.tsx` · `rail.tsx` · `app-bar.tsx` · `mobile-nav.tsx` · `onboarding/` · `wallet/` · `primitives.tsx` … |
| `src/views/dapp/shared/`     | `dock-frame.tsx` · `tab-header.tsx` · `tab-host.tsx` · `subview-*` · connect promo · `about-card.tsx` …          |
| 组合根（非 Fold 正文，对照） | `src/boot/`（map 外；窗口组合）                                                                                  |

**Coverage quality: weak** — 代码根清晰；手册/API/Figma 无独立 Host 页，教程与 §4/§5 仅侧面覆盖。

---

## 2. staking

### Onchain manual

| 相关    | 路径 / 锚点                                                                                                                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 流程    | `01-…` §8 质押（活期/定期/Early）· §10 债券 Bond/BurnBond · §15 XStakingPool                                                                                                                                                                                                             |
| 合约页  | `contracts/liquidstaking.md` · `lockedstaking.md` · `earlystaking.md` · `stakingpool.md` · `bonddepository.md` · `burnbonddepository.md` · `bondhelper.md` · `aegislpbondingcalculator.md` · `xstakingpool.md` · `restakeconfig.md` · `sagx.md` · `xtoken.md` / `xxtoken.md`（挖矿代币） |
| 页→合约 | 活期/定期/EarlyStake/债券/X 挖矿行（§2.3）                                                                                                                                                                                                                                               |

Legacy：无质押专章（一般不需）。

### Backend API / OpenAPI

| Tag                      | Paths                                                                  |
| ------------------------ | ---------------------------------------------------------------------- |
| `stake-flow（质押流水）` | `/stake-flow/logs` · `/stake-flow/positions`                           |
| `bond-flow（债券流水）`  | `/bond-flow/lp-logs` · `burn-logs` · `lp-purchases` · `burn-purchases` |
| `x0-mining（X0 挖矿）`   | `/x0-mining/logs` · `/x0-mining/positions`                             |
| `protocol-market-stats`  | `/protocol-market-stats/series`（Hub/Detail 趋势图；无需登录）         |
| 旁路                     | `performance`（做市/质押地址统计，概览向）                             |

### Figma

| PC 产品页       | nodeId                                                                       |
| --------------- | ---------------------------------------------------------------------------- |
| 质押 · 无数据   | `4287:212`                                                                   |
| 质押/质押       | `4448:220`（Segment 样本 `4448:601`）                                        |
| 质押/LP债券     | `4454:220`                                                                   |
| 质押/销毁债券   | `4458:220`                                                                   |
| 质押/X挖矿      | `4460:220`                                                                   |
| 质押/收益计算器 | `4462:220`                                                                   |
| H5              | `4657:308` · `4665:316` · `4665:848` · `4665:1361` · `4667:340` · `4667:899` |
| 教程            | 3/12–4/12 · `4308:212` · `4309:212`                                          |

### HTML 原型

- 同全局单文件（含「质押」文案轨）

### 代码根

`src/views/dapp/staking/` — `hub/` · `stake/` · `bond/` · `xmine/` · `calc/` · `dock.tsx` · `detail.tsx`

**Coverage quality: strong**

---

## 3. rewards

### Onchain manual

| 相关                 | 路径 / 锚点                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 流程                 | §9 贡献值与 Mixed 领奖 · §14 LuckyPool ·（创世共建领奖见 RewardClaimer / §6 预售注）                                                                                                                                    |
| 合约页               | `contracts/aegisluckypool.md` · `agxcontributionswap.md` · `rewardmanager.md` · `reward.md`（预售奖励领取） · `daopool.md` · `communityfund.md` · `marketfund.md` · `incentivepool.md` · `aegisdailypurchasetracker.md` |
| 治理（若奖励侧展示） | §11 · `contracts/governance.md`（非奖励 tab 主路径，列供对照）                                                                                                                                                          |

Legacy：§4 团队奖励领取（预售签名领奖；与 `rewards/genesis` 详情相关）。

### Backend API / OpenAPI

| Tag                              | Paths                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lucky-reward`                   | `/lucky-reward/my-rounds` · `summary` · `winners`                                                                                                       |
| `referral-award`                 | `/referral-award/summary` · `logs` · `direct-referrals`                                                                                                 |
| `participation-award`            | `/participation-award/summary` · `logs` · `inviter`                                                                                                     |
| `rank-reward`                    | `/rank-reward/summary` · `logs` · `peer-surpass-logs` · `team-members`                                                                                  |
| `market-allowance`               | `/market-allowance/summary` · `paid-logs` · `claim-logs`                                                                                                |
| `claim（DAO领取签名）`           | `/claim/dao-reward` · `/claim/market-fund`                                                                                                              |
| `agx-contribution`（Mixed 贡献） | `/agx-contribution/summary` · `burn-logs` · `consume-logs`                                                                                              |
| 一期                             | `/claim/team-reward` · `/claim/community-fund` · `/claim/parse-signature` · `/claim/confirm` · `/team-reward/*` · `/community-fund/*` · `/rewards/logs` |

### Figma

| PC                                              | nodeId                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| 奖励 · 无数据                                   | `4291:212`                                                                  |
| 幸运 / 推荐 / 参与 / 共建 / 发展津贴 / 创世共建 | `4390:220` · `4403:220` · `4407:220` · `4408:220` · `4410:220` · `4413:220` |
| H5 同名详情 + 无数据                            | `4741:356`…`4751:404`                                                       |
| 教程                                            | 11/12 · `4316:212`                                                          |
| 非验收对照                                      | Rewards 四 tab `4498:945`                                                   |

### HTML 原型

- 同全局单文件（含「奖励」轨）

### 代码根

`src/views/dapp/rewards/` — `hub/` · `lucky/` · `referral/` · `participate/` · `cobuild/` · `grant/` · `genesis/` · claim helpers · `dock.tsx` · `detail.tsx`

**Coverage quality: strong**

---

## 4. release

### Onchain manual

| 相关         | 路径 / 锚点                                                         |
| ------------ | ------------------------------------------------------------------- |
| 流程         | §12 RewardQueue · §13 PrincipalReleaseVault                         |
| 合约页       | `contracts/rewardqueue.md` · `principalreleasevault.md`             |
| 相关写出入口 | 质押/领奖成功后进队列（§8–9）；Turbine 与 Queue 辅助关系（§12/§16） |

### Backend API / OpenAPI

| Tag                      | Paths                                          |
| ------------------------ | ---------------------------------------------- |
| `release-pool（释放池）` | `/release-pool/summary` · `/release-pool/logs` |
| `buffer-pool（缓冲池）`  | `/buffer-pool/summary` · `/buffer-pool/logs`   |

### Figma

| PC            | nodeId                            |
| ------------- | --------------------------------- |
| 释放 · 无数据 | `4298:212`                        |
| 释放/释放池   | `4466:220`                        |
| 释放/缓冲池   | `4469:220`                        |
| H5            | `4803:412`                        |
| 教程          | 7/12–9/12 · `4312:212`…`4314:212` |

### HTML 原型

- 同全局单文件（「释放」文案密度高）

### 代码根

`src/views/dapp/release/` — `hub/` · `queue/` · `buffer/` · `dock.tsx` · `detail.tsx`

**Coverage quality: strong**

---

## 5. exchange

### Onchain manual

| 相关    | 路径 / 锚点                                                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 流程    | §7 Swap（Pancake 买 AGX · Usd1Swap）· §16 Turbine · §9.2 贡献值/销毁换贡献（燃烧轨）                                                                                                       |
| 合约页  | `contracts/usd1swap.md` · `turbine.md` · `agxcontributionswap.md` · `pancakepair.md` · `pancakefactory.md` · `rbs.md`（做市/储备旁路）· `feebot.md` / `tokenfeebot.md`（一般非用户主路径） |
| 页→合约 | Swap · Turbine · Mixed 贡献                                                                                                                                                                |

### Backend API / OpenAPI

| Tag                 | Paths                                                      |
| ------------------- | ---------------------------------------------------------- |
| `turbine`           | `/turbine/logs` · `/turbine/summary`                       |
| `agx-contribution`  | `/agx-contribution/summary` · `burn-logs` · `consume-logs` |
| 闪兑 / 市价交易流水 | **无**独立二期 tag（读写偏链上；扫矩阵时勿假接 API）       |

### Figma

| PC                        | nodeId                                                         |
| ------------------------- | -------------------------------------------------------------- |
| 兑换主页 · 无数据         | `4267:212`                                                     |
| 闪兑 / 交易 / 销毁 / 涡轮 | `4430:220` · `4433:220` · `4434:220` · `4435:220`              |
| H5                        | `4630:260` · `4604:228` · `4608:236` · `4608:631` · `4629:442` |
| 教程                      | 1/12–2/12 · 10/12 · `4305:212` · `4307:212` · `4315:212`       |
| 非验收                    | 闪兑变体 `4498:593`                                            |

### HTML 原型

- 同全局单文件（「兑换」轨存在；英文 `exchange` 字面计数为 0，以中文轨为准）

### 代码根

`src/views/dapp/exchange/` — `hub/` · `flash-exchange/` · `market-trade/` · `burn/` · `turbine/` · `dock.tsx` · `detail.tsx`

**Coverage quality: strong**（API 对闪兑/市价偏弱，手册+Figma+代码仍齐）

---

## 6. assets

### Onchain manual

| 相关    | 路径 / 锚点                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| 流程    | §4 钱包资产页（余额/授权展示基线）· 仓位数据散落 §8/§10/§13/§15（质押/债券/PRV/X 挖矿读模型）                         |
| 合约页  | ERC20/`agx.md`/`sagx.md`/`redeemablegagx.md` + 各仓位合约（同上 staking/release/xmine）· `accountmigrationmanager.md` |
| 页→合约 | 「钱包资产」行                                                                                                        |

### Backend API / OpenAPI

| Tag                | Paths                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| `assets（资产页）` | `/assets/reward-summary` · `/assets/holdings-summary` · `/assets/holdings-distribution` |
| 仓位流水复用       | `stake-flow` · `bond-flow` · `x0-mining` · `buffer-pool`（持仓/赎回对照）               |

### Figma

| PC                                    | nodeId                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| 资产 · 无数据                         | `4281:212`                                                                            |
| 质押 / LP债券 / 销毁债券 / X挖矿 仓位 | `4518:5594` · `4518:5993` · `4518:6384` · `4518:6775`                                 |
| H5                                    | `4645:300` · `4641:268` · `4643:276` · `4643:836` · `4643:1396` · 赎回确认 `4824:412` |
| 教程                                  | 5/12–6/12 · `4310:212` · `4311:212`                                                   |
| 非验收                                | 质押仓位+modal `4781:3137`                                                            |

### HTML 原型

- 同全局单文件

### 代码根

`src/views/dapp/assets/` — `hub/` · `position/` · `xmine/` · `redeem/` · `claim-modal/` · `dock.tsx` · `detail.tsx`

**Coverage quality: strong**

---

## 7. community

### Onchain manual

| 相关   | 路径 / 锚点                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------ |
| 流程   | §5 推荐关系 Referral                                                                             |
| 合约页 | `contracts/referral.md`（主）· `communityfund.md`（基金合约；产品「社区」页≠必然同构，扫时区分） |

Legacy：**优先补缺口** — [`onchain-manual-legacy.md`](../onchain-manual-legacy.md) §2 邀请绑定（流程/错误/展示建议更全）。

### Backend API / OpenAPI

| Tag / 区                               | Paths                                                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 二期邻近（奖励域直推，社区页可能复用） | `referral-award` · 尤其 `/referral-award/direct-referrals`                                                                              |
| `performance`                          | `/performance/making-overview` · `/performance/stake-address-count`                                                                     |
| 一期（团队/推荐历史）                  | `/referral/total` · `/team/referrals` · `/team/overview` · `/search/performance` · `/performance` · `/performance/qualified-partitions` |

无名为 `community` 的二期 tag。

### Figma

| PC            | nodeId                                       |
| ------------- | -------------------------------------------- |
| 社区 · 无数据 | `4300:212`（**仅空态**；无已连接详情产品帧） |
| H5 社区专页   | **无**                                       |
| 教程          | 12/12 · 社区·导航 `4317:212`                 |

### HTML 原型

- 同全局单文件（「社区」出现较少）

### 代码根

`src/views/dapp/community/` — `dock.tsx` · `detail.tsx` · `use-community.ts` · `use-referral.ts` · `primitives.tsx` · `shared.tsx`

**Coverage quality: weak** — 链手册+代码有；Figma 仅空态；API 分散在一期/`referral-award`/`performance`。

---

## 8. genesis（共建 / 预售）

> 产品轨名「共建」；代码 tab id `genesis`。勿与 `rewards/genesis`（创世共建**奖励**详情）混淆。

### Onchain manual

| 相关    | 路径 / 锚点                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------- |
| 流程    | §6 预售 PreSale                                                                                |
| 合约页  | `contracts/presale.md` · `reward.md`（预售奖励领取，领奖常落奖励轨）· USD1/`faucet.md`（测试） |
| 页→合约 | 「预售」行                                                                                     |

Legacy：**强烈需要** — [`onchain-manual-legacy.md`](../onchain-manual-legacy.md) §3 创世预售（空投价值、额度、购买流程、示例）· §4 团队奖励领取。

### Backend API / OpenAPI

| Tag / 区      | Paths                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一期销售/奖励 | `/sales/logs` · `/rewards/logs` · `/team-reward/total` · `/team-reward/logs` · `/claim/team-reward` · `/community-fund/*`（预售社区发展基金；文案注明≠二期 market-allowance） |
| 二期          | **无** `genesis` / `presale` tag；购买与档位以链上为主                                                                                                                        |

### Figma

| PC                         | nodeId                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| 共建 · 无数据              | `4303:212`（**仅空态**；亦为文档示例帧）                           |
| H5 共建专页                | **无**                                                             |
| 奖励侧「创世共建奖励详情」 | `4413:220` / H5 `4747:372` → 归 **rewards**，不替代 genesis 产品页 |

### HTML 原型

- 同全局单文件（含「创世」「共建」）

### 代码根

`src/views/dapp/genesis/` — `dock.tsx` · `detail.tsx` · `genesis-session-host.tsx` · `use-genesis-*.ts` · `primitives-*.tsx`

**Coverage quality: weak** — 链+legacy+代码强；Figma 仅空态；二期 API 缺失（一期可补销售/团队奖）。

---

## 章末速查

| 章          | Manual 主锚           | API 主 tag                                               | Figma             | Proto                                | Code root           | Quality    |
| ----------- | --------------------- | -------------------------------------------------------- | ----------------- | ------------------------------------ | ------------------- | ---------- |
| host+shared | §1/§3/§4/§5；无壳专章 | 一期 `/auth/login`                                       | 教程 1–12；无壳帧 | `public/proto/aegis-dapp-empty.html` | `host/` + `shared/` | **weak**   |
| staking     | §8/§10/§15 + 合约页   | stake-flow · bond-flow · x0-mining                       | 全子页 PC+H5      | 同上（共享）                         | `staking/`          | **strong** |
| rewards     | §9/§14 + 多奖励合约   | lucky/referral/participation/rank/market-allowance/claim | 全详情 PC+H5      | 同上                                 | `rewards/`          | **strong** |
| release     | §12/§13               | release-pool · buffer-pool                               | 释放池+缓冲池     | 同上                                 | `release/`          | **strong** |
| exchange    | §7/§16/§9.2           | turbine · agx-contribution（闪兑/市价无 tag）            | 四子页+主页       | 同上                                 | `exchange/`         | **strong** |
| assets      | §4 + 仓位散章         | assets (+ flow 复用)                                     | 总览+四仓位       | 同上                                 | `assets/`           | **strong** |
| community   | §5 + legacy §2        | 一期 team/referral + referral-award 旁路                 | 仅空态            | 同上                                 | `community/`        | **weak**   |
| genesis     | §6 + legacy §3–4      | 一期 sales/team-reward；无二期 tag                       | 仅空态            | 同上                                 | `genesis/`          | **weak**   |

## 本索引边界

- 对齐结论 → [`dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md)；规则 → [`dapp-data-coverage-matrix-wayfinder.md`](../decisions/dapp-data-coverage-matrix-wayfinder.md)
- 不改写 `onchain-manual/` / `backend-api/` 入仓正文
- 不含 home；治理 / 管理台 / 账户迁移若不在现行 tab 注册表，仅交叉引用
