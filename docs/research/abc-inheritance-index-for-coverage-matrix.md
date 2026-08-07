# A/B/C 继承索引（覆盖矩阵用）

> 只读索引 · 2026-08-07  
> 源：[`docs/ui-manual-api-alignment-audit.md`](../ui-manual-api-alignment-audit.md) · 方法：[`docs/ui-manual-api-alignment-prompt.md`](../ui-manual-api-alignment-prompt.md)  
> Map 继承策略 **H**（[`dapp-data-coverage-matrix-wayfinder.md`](../decisions/dapp-data-coverage-matrix-wayfinder.md)）：**A/C → `inherit`**；**B 读/写/刷新 → `recheck-B`**。  
> **不**重写审计正文；编号关闭/迁出不复用。

## 计数（H 标签）

| H-strategy  | 条数   | 说明                                                  |
| ----------- | ------ | ----------------------------------------------------- |
| `inherit`   | **41** | A-01…A-21（21）+ C-01…C-20（20）                      |
| `recheck-B` | **44** | B-01…B-44（含已关 / 迁出 / 筛出；矩阵读路径仍须重审） |
| `unclear`   | **0**  | —                                                     |

状态口径：审计**未**给 A/C 显式「已关闭」栏 → 表内 A/C 记 **open**（冲突表=可列不修，仍 open）。B：**open** = 需修复表现存；**closed** = 「已关闭」；**migrated** = 「已迁出」；**excluded** = 筛出非取数逻辑。

---

## A — 手册 / API / 链能力（`inherit`）

| ID   | Gist                                                          | Status | Tab      | H       |
| ---- | ------------------------------------------------------------- | ------ | -------- | ------- |
| A-01 | 闪兑输入币文档写死 USDT；链上 `usdtToken`=XX                  | open   | exchange | inherit |
| A-02 | 无「卖 X」链/API 交易路径                                     | open   | exchange | inherit |
| A-03 | 市价「预估 Gas」无算法/字段                                   | open   | exchange | inherit |
| A-04 | 涡轮配额链上 AGX；文档/叙事常写 gAGX                          | open   | exchange | inherit |
| A-05 | 涡轮未领：手册 silence 分态 vs API `unclaimed_total` 口径打架 | open   | exchange | inherit |
| A-06 | 涡轮配额记根账户 vs `turbineBalances(user)` 手册自相矛盾      | open   | exchange | inherit |
| A-07 | Mixed/profit/Queue 链上 AGX；API 多处标 gAGX                  | open   | shared   | inherit |
| A-08 | 活期 `released_pct` 启发式 vs 链无线性 `getReleasedPrincipal` | open   | staking  | inherit |
| A-09 | 发展津贴链发 AGX；API 文案 gAGX / claim 写 AGX                | open   | rewards  | inherit |
| A-10 | DAO/Market `signType` 手册 vs 现行 API 互斥                   | open   | rewards  | inherit |
| A-11 | Mixed 贡献 API 写 1:1；链 `contributionDivisor=6`             | open   | rewards  | inherit |
| A-12 | 释放池链 `RewardQueue.token()`=AGX；API 标 gAGX               | open   | release  | inherit |
| A-13 | `claimable_gagx` 名与成分（DAO/释放 AGX + 涡轮 gAGX）语义混杂 | open   | assets   | inherit |
| A-14 | API `total_released_agx`（历史流水）vs 仓位可赎回同名不同义   | open   | assets   | inherit |
| A-15 | Xmine 解押进 PRV 后无「缓冲/可领本金」拆分字段                | open   | staking  | inherit |
| A-16 | 缓冲可领本金链可算；API 无同口径 claimable                    | open   | assets   | inherit |
| A-17 | Xmine「下次产出」无链/API 字段                                | open   | staking  | inherit |
| A-18 | Staking Hub 趋势图无历史序列                                  | open   | staking  | inherit |
| A-19 | Staking Hub Runway 无数据源                                   | open   | staking  | inherit |
| A-20 | Rewards「下次发放」无 `next_payout`                           | open   | rewards  | inherit |
| A-21 | DAO Mixed 无未签名只读预览接口                                | open   | rewards  | inherit |

---

## B — 纯前端取数/接线（`recheck-B`）

| ID   | Gist                                                  | Status           | Tab       | H         |
| ---- | ----------------------------------------------------- | ---------------- | --------- | --------- |
| B-01 | 闪兑余额/授权用 env USDT                              | closed           | exchange  | recheck-B |
| B-02 | Hub「获取 USD1」未切 usdt 对                          | closed           | exchange  | recheck-B |
| B-03 | Hub「出售 X」可点进错误对（入口已关）                 | closed           | exchange  | recheck-B |
| B-04 | 涡轮单位标 gAGX                                       | migrated→C-01    | exchange  | recheck-B |
| B-05 | 涡轮冷却漏已解锁未领                                  | closed           | exchange  | recheck-B |
| B-06 | 涡轮预览用输入配额                                    | closed           | exchange  | recheck-B |
| B-07 | 涡轮 approve(preUsd)/send(liveUsd) 不一致             | closed           | exchange  | recheck-B |
| B-08 | 涡轮配额未跟迁移 root                                 | closed           | exchange  | recheck-B |
| B-09 | 燃烧未连接展示全网当个人                              | migrated→C-20    | exchange  | recheck-B |
| B-10 | Burn `originalOf==0` 无回退                           | closed           | exchange  | recheck-B |
| B-11 | 复利/奖励单位 AGX vs gAGX                             | migrated→C-02    | shared    | recheck-B |
| B-12 | 活期 `releasedPrincipal` 写死 0n；待释放/已释放口径错 | open             | staking   | recheck-B |
| B-13 | 债券「溢价率」标签 vs `discountRateBP` 语义           | migrated→C-16    | staking   | recheck-B |
| B-14 | Xmine 额度用 spendable                                | closed           | staking   | recheck-B |
| B-15 | Xmine「24h 自动释放」文案断言                         | migrated→C-03    | staking   | recheck-B |
| B-16 | Xmine「X 价格」展示 AGX 比                            | migrated→C-17    | staking   | recheck-B |
| B-17 | Xmine 终身产出只加第 1 页                             | closed           | staking   | recheck-B |
| B-18 | 计算器债券/xmine 公式错                               | closed           | staking   | recheck-B |
| B-19 | EarlyStaking 仓位/领奖面未接线                        | migrated→blocker | staking   | recheck-B |
| B-20 | Hub 未登录可领取含 X pending                          | closed           | assets    | recheck-B |
| B-21 | Hub 登录直出 API `claimable_gagx`                     | closed           | assets    | recheck-B |
| B-22 | 「可赎回已释放」标签 vs API 同名不同义                | migrated→C-04    | assets    | recheck-B |
| B-23 | Hub APR 串产品                                        | closed           | assets    | recheck-B |
| B-24 | Xmine「已释放」冒充 `miningStake`                     | closed           | staking   | recheck-B |
| B-25 | 发展津贴单位标 gAGX                                   | migrated→C-05    | rewards   | recheck-B |
| B-26 | Mixed 文案 1:1 vs divisor=6                           | migrated→C-06    | rewards   | recheck-B |
| B-27 | Mixed 领取后未刷 release/staking                      | closed           | rewards   | recheck-B |
| B-28 | 释放池标 gAGX                                         | migrated→C-07    | release   | recheck-B |
| B-29 | 释放详情 releasing API 优先（应链优先）               | closed           | release   | recheck-B |
| B-30 | 推荐人 API 优先（应链优先）                           | closed           | community | recheck-B |
| B-31 | 幸运奖日期仅近 5 个 UTC 日                            | migrated→C-18    | rewards   | recheck-B |
| B-32 | FAQ 收益=gAGX、可直接挖 X                             | migrated→C-08    | shared    | recheck-B |
| B-33 | 倒计时块时写死 3s                                     | closed           | shared    | recheck-B |
| B-34 | 债券丢 maxPayout / 缺预检                             | closed           | staking   | recheck-B |
| B-35 | 跨块卖税一律 extraSellBP                              | closed           | exchange  | recheck-B |
| B-36 | 活期预检缺个人限额                                    | closed           | staking   | recheck-B |
| B-37 | assets claim 不刷 release                             | closed           | assets    | recheck-B |
| B-38 | canBind 不等推荐查询                                  | closed           | community | recheck-B |
| B-39 | 异链预热污染缓存                                      | closed           | host      | recheck-B |
| B-40 | 邀请链接展示 `/r/…`                                   | migrated→C-19    | community | recheck-B |
| B-41 | `$` 展示格式（非取数）                                | excluded         | shared    | recheck-B |
| B-42 | Genesis 门槛 loading 显 `$0`                          | closed           | genesis   | recheck-B |
| B-43 | 流水 i18n 映射（非取数）                              | excluded         | shared    | recheck-B |
| B-44 | 日收益硬编码 ×2（应跟 `epoch().length`）              | closed           | staking   | recheck-B |

**B 状态小结：** open **1**（B-12）· closed **27** · migrated→C **13** · migrated→blocker **1**（B-19）· excluded **2**（B-41/B-43）。

---

## C — 冲突表（`inherit`；可列不修）

### 🎨 设计如此

| ID   | Gist                                | Status | Tab       | H       |
| ---- | ----------------------------------- | ------ | --------- | ------- |
| C-17 | 「X 价格」稿面示例为 AGX 比价       | open   | staking   | inherit |
| C-18 | 幸运奖日期筛选仅近 5 个 UTC 日      | open   | rewards   | inherit |
| C-19 | 邀请链接展示 `/r/…` vs 真实 `?ref=` | open   | community | inherit |
| C-20 | 未连接时销毁页展示全网累计          | open   | exchange  | inherit |

### 📝 稿 / 文案 vs 链

| ID   | Gist                                                   | Status | Tab      | H       |
| ---- | ------------------------------------------------------ | ------ | -------- | ------- |
| C-01 | 涡轮待解锁/冷却标 gAGX                                 | open   | exchange | inherit |
| C-02 | rebase/利润标 gAGX                                     | open   | shared   | inherit |
| C-03 | Xmine「24 小时后释放」断言                             | open   | staking  | inherit |
| C-04 | 「可赎回已释放」标签 vs API 流水语义                   | open   | assets   | inherit |
| C-05 | 发展津贴到账 AGX、界面标 gAGX                          | open   | rewards  | inherit |
| C-06 | Mixed 文案 1:1；链 divisor=6                           | open   | rewards  | inherit |
| C-07 | 释放队列标 gAGX；链 token=AGX                          | open   | release  | inherit |
| C-08 | FAQ 写收益=gAGX、可直接挖 X                            | open   | shared   | inherit |
| C-09 | Hub「总销毁量」hint 含债券；读数偏配置累计             | open   | staking  | inherit |
| C-10 | Genesis FAQ「单账户累计」vs 单期累计                   | open   | genesis  | inherit |
| C-11 | Genesis FAQ 空投线性释放等无合约支撑                   | open   | genesis  | inherit |
| C-12 | Genesis 文案「100 USD」标的 USD1                       | open   | genesis  | inherit |
| C-13 | 债券 FAQ 漏 180；xmine FAQ「每日 UTC」vs 连续计息      | open   | shared   | inherit |
| C-14 | 质押 FAQ「每日 2 次 / ~12h」可能过时                   | open   | staking  | inherit |
| C-15 | 幸运/DAO 面板标 gAGX；链付多为 AGX                     | open   | rewards  | inherit |
| C-16 | 债券「溢价率」标签 vs discountRateBP / FAQ「收益空间」 | open   | staking  | inherit |

---

## 阻塞·待产品（非 A/B/C 号；矩阵可链备注）

| 主题                               | 相关 ID                | 备注           |
| ---------------------------------- | ---------------------- | -------------- |
| Hub「可领取 / 可赎回」最终产品形态 | A-13、A-14、B-21、C-04 | 须产品定拆行   |
| 是否交付「卖 X」真能力             | A-02、曾 B-03          | 入口已暂不可点 |
| EarlyStaking 仓位/领奖面           | 曾 B-19                | 缺仓位 UI      |
| 迁移页 / 迁移状态 UI               | —                      | 超出当前 Figma |
| 冲突表文案/设计纠偏                | C-01…C-20              | 改稿后方可关   |

---

## 填矩阵时怎么用

1. 问题行链 A/C：**直接继承** gist + 状态；勿因 FE 已关 B 而默认同题已消（能力/文案仍可能 open）。
2. 读/写/刷新行若曾属 B：**即使 B 已 closed**，仍标 **`recheck-B`**，对照现码与链再确认。
3. Tab 为审计「页面」粗映射；Host 专章另扫 `host`+`views/dapp/shared`（本索引仅 B-39 显式 host）。
