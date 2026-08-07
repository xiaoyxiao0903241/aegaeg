# Matrix draft · community（`CM-`）

> 只读章节草稿 · 供并入 [`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md) §7  
> 新鲜度：2026-08-08 · **非**结论缓存；并入前须再对最新手册/审计/代码

## 方法（重读）

| 源      | 路径                                                                                                                                                                                      |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 手册    | `docs/onchain-manual/contracts/referral.md` · `01-frontend-integration-guide.md` §5 · legacy §2 邀请绑定                                                                                  |
| 审计    | `docs/ui-manual-api-alignment-audit.md`（开放 **C-19**）· 继承索引 B-30/B-38/B-40→C-19                                                                                                    |
| API     | `docs/backend-api/api.md` `/team/overview` · `/team/referrals` · `/performance`                                                                                                           |
| 代码    | `src/views/dapp/community/**` · `src/shared/config/referral.ts` · `src/web3/referral/**` · `src/hooks/api/community.ts` · `src/hooks/use-shareholder-rank.ts` · `invalidate` community 桶 |
| UI 基线 | 已实现（Figma 仅空态 `4300:212`）                                                                                                                                                         |

盘点：UI+Code 双扫；动态位 = Num+Copy（Visible+FAQ）。写 = 动作级（门闸/预检/成功后刷新）。  
继承 **H**：A/C 可继承；**B-30 / B-38 / B-40** 本轮 **recheck**（不盲信 closed）。

**邀请链接（硬点）：**

- **展示** `formatReferralLinkDisplay` → `{host}/r/{shortAddress}`（无 `/r/` 路由）
- **真实入口 / 复制** `referralSharePath` → 当前 path + `?ref=0x…`；`parseReferrerFromSearch` 只认 `ref`

---

## 主表（`CM-`）

| 行号   | 章节      | 页面/表面             | 数据或动作                              | 读/写 | 权威来源                                    | 是否正确接入 | T1归因                        | 继承自              | 证据                                                                                         | A/B/C链     | 备注                                       |
| ------ | --------- | --------------------- | --------------------------------------- | ----- | ------------------------------------------- | ------------ | ----------------------------- | ------------------- | -------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| CM-001 | community | Dock·绑定态           | `isBound`（是否已绑定）                 | 读    | 链 `Referral.isBindReferral`                | ✅           | —                             | —                   | `use-referral.ts` `readIsBindReferral`；仅需钱包                                             | —           | 不要求 SIWE                                |
| CM-002 | community | Dock·已绑定面板       | 推荐人地址展示                          | 读    | 链 `getReferral`；缺则 API `invite_address` | ✅           | —                             | recheck B-30        | `displayReferrer`：**链优先**，API 回退；`usePerformance(sessionReady)`                      | B-30 closed | 类型注释仍写「API 优先」已过时，非取数 bug |
| CM-003 | community | Dock·邀请链接（展示） | 链接文案 `{host}/r/{short}`             | 读    | 产品展示形态（≠链入口）                     | 部分         | 设计取舍（故意空/0）          | C-19                | `formatReferralLinkDisplay`；仓库无 `/r/` 路由                                               | C-19        | 用户照抄展示串无法建立推荐                 |
| CM-004 | community | Dock·复制邀请链接     | 剪贴板 URL                              | 写    | FE 约定 `?ref=`                             | ✅           | —                             | C-19（对照）        | `getRuntimeOrigin()+pathname+referralSharePath(addr)`                                        | C-19        | 与展示形态分叉；复制路径正确               |
| CM-005 | community | Dock·绑定输入预填     | URL/`sessionStorage` pending 推荐人     | 读    | FE `?ref=`                                  | ✅           | —                             | —                   | `parseReferrerFromSearch` → `PENDING_REFERRER_KEY`                                           | —           | 仅预填，不自动写链                         |
| CM-006 | community | Dock·绑定按钮         | `canBind` 门闸                          | 读    | 链查询就绪 + 未绑定 + 有输入                | ✅           | —                             | recheck B-38        | 须 `isFetched` 且非 loading；≠「有输入即可点」                                               | B-38 closed | 父节点合法性在 mutate 预检                 |
| CM-007 | community | Dock·绑定             | `bindReferral(parent)`                  | 写    | 链 `Referral.bindReferral`                  | ✅           | —                             | —                   | 预检 `isReferralParentAllowed`（已绑或 root）；`WRITE_PATH.REFERRAL_BIND`；自荐/非法地址软错 | —           | 冷却 5s；unknown → path lock               |
| CM-008 | community | Dock·绑定成功后       | 缓存刷新                                | 写    | FE invalidate                               | ✅           | —                             | —                   | `invalidateAfterReferralBind` → community 桶含 `chain.referralRoot` + team/performance       | —           | 成员表仍等 indexer                         |
| CM-009 | community | Dock·未连接           | 绑定/链接隐藏；仅外链+Connect           | 读    | UI 基线                                     | ✅           | —                             | —                   | `CommunityDisconnectedDock`                                                                  | —           | 不造空成员态（与 Detail 一致）             |
| CM-010 | community | Detail·统计卡         | 直推人数 `direct_referral_count`        | 读    | API `/team/overview`                        | 部分         | FE 读源/算法/门闸/刷新错误    | recheck（手册偏链） | UI 用 overview；链 `getReferralCount` 在 hook 取了但**未展示**                               | —           | 手册 §5.3 面板可用链计数；社区树口径跟 API |
| CM-011 | community | Detail·统计卡         | 直推业绩 `direct_presale_volume`（`$`） | 读    | API `/team/overview`                        | 待核实       | 待核实                        | —                   | 展示 `volumePrefix`+`$`；api.md 叙源 `sales_direct_team_market` 命名纠结                     | —           | 金钱 L：未做 Prod 只读对账                 |
| CM-012 | community | Detail·统计卡         | 社区人数 `descendant_count`             | 读    | API `/team/overview`                        | ✅           | —                             | —                   | `referral_ancestors` 全下级；链无廉价等价                                                    | —           |                                            |
| CM-013 | community | Detail·统计卡         | 社区业绩 `sales_team_market`（`$`）     | 读    | API `/team/overview`                        | 待核实       | 待核实                        | —                   | 同 CM-011                                                                                    | —           |                                            |
| CM-014 | community | Detail·统计卡         | 共建等级（创世 S*）                     | 读    | API `/performance`.presale_rank             | ✅           | —                             | —                   | `useShareholderRank`→`displayPresaleRank`；**不用** `making_rank`                            | —           | 注释硬约束；未登录显 S0                    |
| CM-015 | community | Detail·统计卡         | `today_addition_*` 四字段               | 读    | API 有、UI 无                               | 不适用       | 设计取舍（故意空/0）          | —                   | Detail 注释：无「今日」行；i18n `statToday` 等未接线                                         | —           | 能力在 API，产品未展                       |
| CM-016 | community | Detail·统计卡         | 已连钱包未 SIWE 时数值                  | 读    | UI 门闸                                     | 部分         | 设计取舍（故意空/0）          | —                   | `walletReady && !sessionReady` → 概览不请求，卡面 **0 / S0**；表走 Auth                      | —           | 非 loading 骨架                            |
| CM-017 | community | Detail·成员标题       | `我的社区成员（{count}）`               | 读    | API overview 或 referrals.total             | ✅           | —                             | —                   | `direct_referral_count ?? referrals.total`；未登录固定 0                                     | —           |                                            |
| CM-018 | community | Detail·成员表         | 加入时间 `register_time`                | 读    | API `/team/referrals`                       | ✅           | —                             | —                   | `formatRegisterDate`                                                                         | —           |                                            |
| CM-019 | community | Detail·成员表         | 地址                                    | 读    | API item.address                            | ✅           | —                             | —                   | `ExplorerLink`                                                                               | —           |                                            |
| CM-020 | community | Detail·成员表         | 列「参与共建」← `presale_volume` `$`    | 读    | API                                         | 部分         | 文案/单位与链不匹配（稿如此） | —                   | 表头 `shareholder`「参与共建」对个人认购额                                                   | —           | 标签≠「个人业绩」字面                      |
| CM-021 | community | Detail·成员表         | 共建等级 `presale_rank`                 | 读    | API                                         | ✅           | —                             | —                   | `formatTableGenesisRank`（缺/0 → `-`）                                                       | —           |                                            |
| CM-022 | community | Detail·成员表         | 直推人数 `direct_referral_count`        | 读    | API                                         | ✅           | —                             | —                   | 行内人数                                                                                     | —           |                                            |
| CM-023 | community | Detail·成员表         | 列「社区业绩」← `sales_team_market`     | 读    | API                                         | 部分         | 文案/单位与链不匹配（稿如此） | —                   | **无 `$` 前缀**（概览卡有 `$`）                                                              | —           | 同字段展示不一致                           |
| CM-024 | community | Detail·成员表         | 分页 `total` / page                     | 读    | API Paginated                               | ✅           | —                             | —                   | `Table.Pagination`；`keepPreviousData`                                                       | —           |                                            |
| CM-025 | community | Detail·成员表         | 未登录 Auth 空态                        | 读    | sessionReady                                | ✅           | —                             | —                   | `dappTableViewState` + `WalletConnectChip`                                                   | —           |                                            |
| CM-026 | community | Detail·邀请引导       | 三步文案（分享/共建/奖励）              | 读    | i18n Copy                                   | 部分         | 文案/单位与链不匹配（稿如此） | —                   | 「链接注册后即可」；真路径=连钱包+显式绑定                                                   | —           | Visible Copy                               |
| CM-027 | community | Detail·生态支持       | 创世期数 `{season}`                     | 读    | Genesis promo store                         | ✅           | —                             | —                   | `useGenesisPromoChrome().activeSeasonNumber` 填 label                                        | —           | Num                                        |
| CM-028 | community | Detail·生态支持       | Notion 外链 CTA                         | 读    | 静态配置                                    | 不适用       | —                             | —                   | `program.href` 外链；无链上数                                                                | —           |                                            |
| CM-029 | community | Detail·FAQ            | 「邀请关系…自动建立且永久」             | 读    | i18n FAQ                                    | 部分         | 文案/单位与链不匹配（稿如此） | —                   | 链上须 `bindReferral`；链接仅预填                                                            | 建议新 C    | 永久一经绑定则真                           |
| CM-030 | community | Detail·FAQ            | 「创世推荐奖励 3%…压缩」                | 读    | i18n FAQ（PreSale 叙事）                    | 待核实       | 待核实                        | —                   | 对标手册预售推荐预算 3%；非本页取数                                                          | —           | 社区页无奖励读源                           |
| CM-031 | community | Detail·FAQ            | 「S1 至 S10」晋升                       | 读    | i18n FAQ                                    | ✅           | —                             | —                   | 与 `MAX_PRESALE_RANK=10` / `formatPresaleRank` 一致                                          | —           |                                            |
| CM-032 | community | Dock·快捷外链         | docs/youtube/…                          | 读    | 静态                                        | 不适用       | —                             | —                   | `communityQuickLinkItems`                                                                    | —           |                                            |

**行数：32**（CM-001…CM-032）

---

## B recheck 结论

| ID   | 索引状态           | 本轮结论                                                        |
| ---- | ------------------ | --------------------------------------------------------------- |
| B-30 | closed · recheck-B | **仍关闭**：`displayReferrer` 链优先（CM-002 ✅）               |
| B-38 | closed · recheck-B | **仍关闭**：`canBind` 依赖 referral query fetched（CM-006 ✅）  |
| B-40 | migrated→C-19      | **仍为 C**：展示 `/r/` vs 真 `?ref=`（CM-003 部分 / CM-004 ✅） |

---

## Code 反查候选（建议附录 `Z-`）

| 建议 | 符号 / 能力                                                                 | 说明                                 |
| ---- | --------------------------------------------------------------------------- | ------------------------------------ |
| Z-?  | `useCommunityReferral().directCount`（链 `getReferralCount`）               | 已读未展；UI 用 API 直推数           |
| Z-?  | 链 `getChildren` / `getReferrals` / `getChildAt`                            | 手册可读；成员表走 `/team/referrals` |
| Z-?  | `queryKeys.api.referralTotal` · `makingOverview` 在 community invalidate 桶 | 社区页无对应 UI（奖励/别处）         |
| Z-?  | `useReferralTotal` / `useCommunityFund*` 等同文件 hooks                     | 非 community 页表面；勿并入 CM 主表  |
| Z-?  | i18n `statToday` / `postLaunch*` 等                                         | 无 call site                         |

---

## 拟增 A/B/C（草稿建议 · 未改审计）

| 建议       | gist                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| C-?        | FAQ/引导「邀请关系自动建立」vs 须显式 `bindReferral`（CM-026/029）            |
| （文档债） | `UserPerformance.invite_address` 注释仍写 API 优先——与 `displayReferrer` 不符 |

---

## Top ❌ / 部分（给主代理）

1. **CM-003 部分** — 邀请链接**展示** `/r/short` ≠ 真实入口 `?ref=`（**C-19**）；照抄展示不可用
2. **CM-010 部分** — 直推人数 UI 跟 API，链 `getReferralCount` 已取未展
3. **CM-029 / CM-026 部分** — FAQ/引导暗示「链接即自动绑定」，与写路径不符
4. **CM-023 / CM-020 部分** — 表列标签/金额格式与概览卡不一致
5. **CM-011 / CM-013 待核实** — 团队业绩金钱未 Prod 对账

无本轮实锤 **❌**（缺接线级）；展示/文案分叉记 **部分** + C-19。
