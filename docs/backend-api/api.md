# AEGIS API

> OpenAPI `3.0.3` · version `1.0.0`  
> 机器真源：[`openapi.json`](./openapi.json)

EVM 签名登录与销售记录接口 / EVM login and sales APIs

## Servers

- `/api`

## Auth

- **BearerAuth**：`http` `bearer`

## Tag 索引

- [lucky-reward（幸运奖）](#lucky-reward-幸运奖)（3）
- [referral-award（推荐奖）](#referral-award-推荐奖)（3）
- [participation-award（参与奖）](#participation-award-参与奖)（3）
- [rank-reward（等级共建奖）](#rank-reward-等级共建奖)（4）
- [claim（DAO领取签名）](#claim-dao领取签名)（2）
- [market-allowance（发展津贴）](#market-allowance-发展津贴)（3）
- [release-pool（释放池）](#release-pool-释放池)（2）
- [buffer-pool（缓冲池）](#buffer-pool-缓冲池)（2）
- [agx-contribution（销毁与贡献点）](#agx-contribution-销毁与贡献点)（3）
- [assets（资产页）](#assets-资产页)（4）
- [performance（做市概览）](#performance-做市概览)（2）
- [stake-flow（质押流水）](#stake-flow-质押流水)（2）
- [bond-flow（债券流水）](#bond-flow-债券流水)（6）
- [turbine（涡轮）](#turbine-涡轮)（2）
- [x0-mining（X0 挖矿）](#x0-mining-x0-挖矿)（2）
- [protocol-market-stats（协议市值质押）](#protocol-market-stats-协议市值质押)（3）
- [一期接口](#一期接口)（18）
- [二期·未分类](#二期-未分类)（2）

## lucky-reward（幸运奖）

幸运奖：中奖名单、奖池汇总、我的参与轮次

一级路由：`POST /api/lucky-reward/…`

本组接口：
- `POST /lucky-reward/my-rounds`
- `POST /lucky-reward/summary`
- `POST /lucky-reward/winners`

### `POST` `/lucky-reward/my-rounds`

**当前用户参与过的已开奖幸运奖轮次（含未中）/ My drawn lucky rounds including non-wins**

- auth: required

以 lucky_eligible_users 为主表，JOIN lucky_rounds（仅 status=DRAWN）；
LEFT JOIN lucky_winners（是否中奖、奖金、名次）。
date 取 lucky_winners.created_at 的日历日（yyyy-MM-dd）；未中奖为 null；
lucky_claims 已改为账户级混合领取（无 round_id），本接口不返回按轮次领取字段。
participation_amount 为质押金额(USDT)，取 user_performance_daily.sum_invest_usdt（与 DATE(winners.created_at) 同日快照；未中奖为 "0"）；
reward_amount 为中奖 AGX（未中为 "0"）；
draw_tx_hash 为开奖交易 hash。
按 round_id 倒序分页。需登录。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseLuckyRewardMyRounds` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/lucky-reward/summary`

**当前用户幸运奖概览 / Lucky reward summary for current user**

- auth: required

today_total_prize：今日整池总额(USD)，lucky_rounds.reward_value_usd1 × max_winners；
今日轮次按 DATE(created_at) 匹配（不用 display_day）；
is_winner：今日是否中奖（lucky_winners）；
win_count：累计中奖次数（lucky_winners）；
total_reward_amount：累计中奖金额(AGX)，SUM(lucky_winners.reward_amount)。
需登录。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseLuckyRewardSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/lucky-reward/winners`

**按日期查询幸运奖中奖名单 / List lucky reward winners by day**

- auth: required

查询 lucky_winners JOIN lucky_rounds，按 DATE(lucky_rounds.created_at) 匹配入参 date（yyyy-MM-dd），
且仅 status=DRAWN（已开奖）轮次；同日多轮取 round_id 最大。
date 可选：不传或空则返回最近已开奖有中奖记录的一天。
传入日期（含今天）一律按入参查询，无特殊回退。
返回 rank、address、participation_amount(USDT)、reward_amount(AGX)、round_id、draw_tx_hash；
dates：全部已开奖轮次日期去重倒序（status=DRAWN）。
participation_amount 取自 user_performance_daily.sum_invest_usdt（与返回 date 同日快照）。
需登录。

**Request body**

- `application/json`: `LuckyRewardWinnersRequest` {`date`:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseLuckyRewardWinners` {`code`:integer, `data`:object}|
|400|非法日期参数 / Invalid date|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## referral-award（推荐奖）

推荐奖：统计、发放记录、直推列表（与一期 /referral/total 无关）

一级路由：`POST /api/referral-award/…`

本组接口：
- `POST /referral-award/direct-referrals`
- `POST /referral-award/logs`
- `POST /referral-award/summary`

### `POST` `/referral-award/direct-referrals`

**分页我的直推用户 / Paginated direct referrals**

- auth: required

referral_ancestors depth=1；bound_at 来自 users（绑定时间）；
active_stake_balance 来自 user_performance（ACTIVE）；
contributed_reward_total = 该直推为我产生的推荐奖 SUM(dao_reward_ledger.gross_amount)，按 source_account_id 汇总（gAGX，仅 active_generation 可见代次）。
hide_zero_position=true 时仅返回 active_stake_balance &gt; 0 的直推。

**Request body**

- `application/json`: `ReferralAwardDirectReferralsRequest` {`page`:integer, `page_size`:integer, `hide_zero_position`:boolean}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseReferralAwardDirectReferrals` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/referral-award/logs`

**分页推荐奖发放记录 / Paginated referral award logs**

- auth: required

查询 dao_reward_grants，reward_type=REFERRAL_REWARD，recipient 匹配当前用户。
返回 created_at（published_at）、status、fully_claimed_at、awarded_gross(gAGX)。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseReferralAwardLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/referral-award/summary`

**推荐奖统计（当前用户）/ Referral award summary**

- auth: required

与一期 POST /referral/total（sq_referral_totals 可领汇总）不是同一功能。
total_referral_reward = SUM(dao_reward_grants.awarded_gross) WHERE reward_type=REFERRAL_REWARD（gAGX，仅 active_generation 可见代次）；
active_stake_balance = user_performance.active_stake_balance（AGX，含质押与债券）；
direct_referral_count = user_performance.direct_referral_count（ACTIVE）；
available_contribution = agx_contribution_totals.available_contribution_raw（转 9 位 decimal）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseReferralAwardSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## participation-award（参与奖）

参与奖：统计、利息发放记录、邀请人贡献

一级路由：`POST /api/participation-award/…`

本组接口：
- `POST /participation-award/inviter`
- `POST /participation-award/logs`
- `POST /participation-award/summary`

### `POST` `/participation-award/inviter`

**我的邀请人信息 / My inviter (single record)**

- auth: required

users.invite_address、bound_at；上级持仓 active_stake_balance；
total_brought_reward = SUM(dao_reward_ledger.gross_amount) WHERE reward_type=PARTICIPATION_REWARD、user=当前用户、source=上级（gAGX，仅 active_generation 可见代次）。
无上级时 inviter 为 null。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseParticipationAwardInviter` {`code`:integer, `data`:object}|

### `POST` `/participation-award/logs`

**分页参与奖发放记录 / Paginated participation award logs**

- auth: required

查询 dao_reward_grants，reward_type=PARTICIPATION_REWARD，recipient 匹配当前用户。
返回 created_at（published_at）、status、fully_claimed_at、awarded_gross(gAGX)。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseParticipationAwardLogs` {`code`:integer, `data`:object}|

### `POST` `/participation-award/summary`

**参与奖统计（当前用户）/ Participation award summary**

- auth: required

total_participation_reward = SUM(dao_reward_grants.awarded_gross) WHERE reward_type=PARTICIPATION_REWARD（gAGX，仅 active_generation 可见代次）；
active_stake_balance、available_contribution 与推荐奖 summary 同源。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseParticipationAwardSummary` {`code`:integer, `data`:object}|

## rank-reward（等级共建奖）

等级共建奖：统计、发放记录、平级/超越奖、团队成员

一级路由：`POST /api/rank-reward/…`

本组接口：
- `POST /rank-reward/logs`
- `POST /rank-reward/peer-surpass-logs`
- `POST /rank-reward/summary`
- `POST /rank-reward/team-members`

### `POST` `/rank-reward/logs`

**分页共建奖发放明细 / Paginated rank_reward logs**

- auth: required

查询 dao_reward_grants，reward_type=RANK_REWARD，recipient 匹配当前用户。
返回 benefit_level（rank_level_snapshot）、created_at（published_at）、status、fully_claimed_at、awarded_gross(gAGX)。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功|`ApiResponseRankRewardLogs` {`code`:integer, `data`:object}|

### `POST` `/rank-reward/peer-surpass-logs`

**分页平越奖发放明细 / Paginated peer & surpass logs**

- auth: required

查询 dao_reward_grants，reward_type=SURPASS_REWARD，recipient 匹配当前用户。
返回 benefit_level（rank_level_snapshot）、created_at（published_at）、status、fully_claimed_at、awarded_gross(gAGX)。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功|`ApiResponseRankRewardPeerSurpassLogs` {`code`:integer, `data`:object}|

### `POST` `/rank-reward/summary`

**共建奖统计 / Rank reward summary**

- auth: required

total_rank_reward = SUM(dao_reward_grants.awarded_gross) WHERE reward_type IN (RANK_REWARD, SURPASS_REWARD)（共建奖励合计，gAGX，仅 active_generation 可见代次）；
making_market、direct_referral_count、effective_direct_referral_count、making_rank 来自 user_performance(ACTIVE)；
active_stake_balance、available_contribution 与推荐奖同源。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功|`ApiResponseRankRewardSummary` {`code`:integer, `data`:object}|

### `POST` `/rank-reward/team-members`

**分页我的团队明细（全部下级）/ Paginated team members**

- auth: required

referral_ancestors depth&gt;=1（全部下级，非仅直推）；
bound_at(users)、making_market/making_rank(user_performance ACTIVE)。
排序（均可选，可同时生效，固定优先级：加入时间 → 业绩 → 级别）：
sort_bound_at / sort_making_market / sort_making_rank = asc|desc；
均未传时默认 sort_bound_at=desc。兼容旧参数 sort_time（等同 sort_bound_at）。
hide_zero_market=true 时仅 making_market&gt;0。

**Request body**

- `application/json`: `RankRewardTeamMembersRequest` {`page`:integer, `page_size`:integer, `sort_bound_at`:string, `sort_making_market`:string, `sort_making_rank`:string, `sort_time`:string, `hide_zero_market`:boolean}

|status|description|schema|
|---|---|---|
|200|成功|`ApiResponseRankRewardTeamMembers` {`code`:integer, `data`:object}|

## claim（DAO领取签名）

领取签名：DAO 奖励（order_type=2）与做市社区津贴（order_type=5）；team-reward / community-fund / confirm 仍为一期

一级路由：`POST /api/claim/…`

本组接口：
- `POST /claim/dao-reward`
- `POST /claim/market-fund`

### `POST` `/claim/dao-reward`

**申请 DAO 奖励领取签名 / Request DAO reward claim signature**

- auth: required

按 token 用户地址与 rewardType 申请 DAO 奖励领取签名。
签名阶段在同一数据库事务内写入 reward_claim_orders、dao_claim_order_ledger_allocations，
并将覆盖的 dao_reward_ledger 由 READY 更新为 ISSUED；链上领取成功后由扫描器核销，本接口不更新领取状态。
仅查询 status=0 的待领取订单；未过期直接返回原签名；已过期则同事务释放 allocation、订单置 status=2，
ledger 回滚 ISSUED→READY 后重新签名并写 3 张表。signType 按奖励类型固定为 41–45。
签名前校验 agx_contribution_totals.available_contribution_raw ≥ 本次领取 gross（amount_wei），贡献点与领取金额 1:1。

**Request body**

- `application/json`: `DaoRewardClaimRequest` {`rewardType`*:string}

|status|description|schema|
|---|---|---|
|200|返回 signature / signature returned|`ApiResponseDaoRewardSignature` {`code`:integer, `data`:object}|
|400|无可领取 DAO 奖励、rewardType 无效、claim gate 关闭或贡献点不足||
|401|未授权||
|502|签名服务不可用||

### `POST` `/claim/market-fund`

**申请做市社区津贴领取签名 / Request market fund allowance claim signature**

- auth: required

按 token 用户地址申请做市社区津贴领取签名，无需请求体。
先从 market_fund_reward_totals 读取 unlocked_claimable（AGX），须大于 0；
signType 固定为 51，order_type=5，合约地址为 MARKET_FUND_VAULT_ADDRESS；
仅查询 status=0 的待领取订单；未过期直接返回原签名及 expireTime（不延长）；
无 status=0 订单时向签名服务申请（expireTime=now+TTL）并写入 reward_claim_orders(status=0)；
已过期则将旧订单置为 status=3 并创建新订单（expireTime=now+TTL，新 salt/amount/签名）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|返回 signature / signature returned|`ApiResponseMarketFundSignature` {`code`:integer, `data`:object}|
|400|无可领取做市社区津贴||
|401|未授权||
|502|签名服务不可用||

## market-allowance（发展津贴）

做市发展津贴：统计、发放明细、领取记录（market_fund_*，与一期 community_fund 无关）

一级路由：`POST /api/market-allowance/…`

本组接口：
- `POST /market-allowance/claim-logs`
- `POST /market-allowance/paid-logs`
- `POST /market-allowance/summary`

### `POST` `/market-allowance/claim-logs`

**分页津贴领取记录 / Paginated allowance claim logs**

- auth: required

查询 market_fund_claim_logs：claim_time=block_time，allowance_amount=reward（gAGX），tx_hash。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseMarketAllowanceClaimLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/market-allowance/paid-logs`

**分页津贴发放记录 / Paginated allowance paid logs**

- auth: required

查询 market_fund_reward_paid_logs（当前用户为基金节点 recipient，user_address=登录地址）。
paid_time=block_time；agx_amount=operator_amount；operation_type 由 trigger_type 映射为质押/赎回；
subsidy_rate=|amount|/|operator_amount| 百分比；allowance_amount=amount（gAGX）。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseMarketAllowancePaidLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/market-allowance/summary`

**发展津贴统计 / Market development allowance summary**

- auth: required

making_rank = user_performance.making_rank（ACTIVE）；
total_claimed_allowance = market_fund_reward_totals.claimed（gAGX）。
与一期 POST /community-fund/*（community_fund_* 预售社区发展基金）不是同一功能。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseMarketAllowanceSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## release-pool（释放池）

奖励释放池：统计与事件流（reward_queue_logs，与 /turbine 无关）

一级路由：`POST /api/release-pool/…`

本组接口：
- `POST /release-pool/logs`
- `POST /release-pool/summary`

### `POST` `/release-pool/logs`

**分页释放池记录 / Paginated release pool logs**

- auth: required

查询 reward_queue_logs，不按 status 过滤。
可选 event_type（string[]，多值为 OR）；未传或空数组则返回全部事件类型。
event_type 枚举：entered_queue=进入队列，claimed_from_queue=领取，released=已释放。
列表项 event_type 原值返回。

**Request body**

- `application/json`: `ReleasePoolLogsRequest` {`page`:integer, `page_size`:integer, `event_type`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseReleasePoolLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/release-pool/summary`

**释放池统计 / Release pool summary**

- auth: required

基于 reward_queue_logs 事件流（只追加）汇总，amount 均为 gAGX。
releasing_amount = SUM(entered_queue.amount) − SUM(claimed_from_queue.amount) − SUM(released.amount)，结果不小于 0；
released_amount = SUM(released.amount)；
total_claimed_amount = SUM(claimed_from_queue.amount)。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseReleasePoolSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## buffer-pool（缓冲池）

缓冲池：splitter_events 分页流水（contract_address 原值返回）

一级路由：`POST /api/buffer-pool/…`

本组接口：
- `POST /buffer-pool/logs`
- `POST /buffer-pool/summary`

### `POST` `/buffer-pool/logs`

**分页缓冲池记录 / Paginated buffer pool logs**

- auth: required

查询 splitter_events，user_address 为当前用户，按 block_time 倒序。
可选 event_type（string[]，多值为 OR）；未传或空数组则返回全部类型。
event_type：RELEASE_CREATED=进入，PRINCIPAL_CLAIMED=提取。
contract_address 原值返回（币种由前端按合约枚举映射）。

**Request body**

- `application/json`: `BufferPoolLogsRequest` {`page`:integer, `page_size`:integer, `event_type`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBufferPoolLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/buffer-pool/summary`

**缓冲池统计 / Buffer pool summary**

- auth: required

基于 splitter_events 汇总 AGX 本金缓冲池。
cumulative_amount = SUM(DEPOSITED)；released_amount = SUM(CLAIMED)；
releasing_amount = cumulative − released（不小于 0）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBufferPoolSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## agx-contribution（销毁与贡献点）

销毁 AGX 换贡献点：累计统计、销毁记录、贡献点消耗记录（agx_contribution_*）

一级路由：`POST /api/agx-contribution/…`

本组接口：
- `POST /agx-contribution/burn-logs`
- `POST /agx-contribution/consume-logs`
- `POST /agx-contribution/summary`

### `POST` `/agx-contribution/burn-logs`

**分页销毁记录 / Paginated AGX burn logs**

- auth: required

agx_contribution_logs，event_type = CONVERTED（销毁换贡献点）。
burned_agx 取 agx_amount_raw（兑换输入 AGX，与 contribution_earned 约 1:6）；
与 summary.total_burned_agx（total_agx_in_raw）口径一致。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAgxContributionBurnLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/agx-contribution/consume-logs`

**分页贡献点消耗记录 / Paginated contribution consume logs**

- auth: required

agx_contribution_logs，event_type = CONSUMED（消耗贡献点领取奖励）。
contract_address 取 actor_address（实际发起操作的账户地址）。
sign_type：按 tx_hash LEFT JOIN dao_mixed_claim_logs（同 tx 多行取 MAX(sign_type)）；无匹配为 null。
注：DAO claimRewardsMixed 链上 sign_type 固定为 4，不代表具体奖励类型。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAgxContributionConsumeLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/agx-contribution/summary`

**销毁与贡献点统计 / AGX burn & contribution summary**

- auth: required

读取 agx_contribution_totals 投影：累计兑换 AGX、获得/消耗贡献点、剩余可用贡献点。
total_burned_agx 取 total_agx_in_raw（累计输入/兑换 AGX，与贡献点 1:6）；
不用 total_burned_raw（那是 burn_split 后的实际销毁分拆量，与贡献点不成 1:6）。
数量字段由链上 raw 整数按 9 位小数换算为 decimal 字符串。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAgxContributionSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## assets（资产页）

用户资产页统计：奖励概览、持仓汇总、持仓分布、各产品收益与投资

一级路由：`POST /api/assets/…`

本组接口：
- `POST /assets/holdings-distribution`
- `POST /assets/holdings-summary`
- `POST /assets/product-invest-reward`
- `POST /assets/reward-summary`

### `POST` `/assets/holdings-distribution`

**资产页持仓分布 / Assets holdings distribution**

- auth: required

基于 user_performance（projection_status=ACTIVE）四桶拆分，不含 bond_stable。
stake_total_agx = 全部质押 lock 周期之和（liquid/early/30/90/180/270/360/540）；
bond_lp、bond_burn 为 AGX；stake_x_pool 为 gAGX。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAssetsHoldingsDistribution` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/assets/holdings-summary`

**资产页持仓与缓冲池概览 / Assets holdings summary**

- auth: required

total_holdings_agx = user_performance.active_stake_balance（AGX）；
buffer_pool_cumulative / buffer_pool_released / buffer_pool_releasing 来自 splitter_events；
stake_redeemed_agx = SUM(stake_flow_logs.amount) WHERE operation=CLAIM_PRINCIPAL；
total_released_agx = buffer_pool_released + stake_redeemed_agx。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAssetsHoldingsSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/assets/product-invest-reward`

**各产品已领取收益与实际投资 / Product claimed reward & invest amount**

- auth: required

返回当前用户四类产品各自的已领取收益与实际投资金额（含地址家族）；无数据字段返回 "0"：
- stake.claimed_reward（gAGX）= SUM(stake_flow_logs.amount) WHERE REWARD/EXTRA_REWARD；
- stake.invest_amount（AGX）= SUM(stake_flow_logs.amount) WHERE STAKE；
- lp_bond.claimed_reward（gAGX）= SUM(bond_flow_logs.payout) WHERE LP_BOND + REWARD；
- lp_bond.invest_amount（AGX）= SUM(payout) WHERE LP_BOND + PURCHASE；
- burn_bond.claimed_reward（gAGX）= SUM(payout) WHERE BURN_BOND + REWARD；
- burn_bond.invest_amount（AGX）= SUM(payout) WHERE BURN_BOND + PURCHASE；
- x_mining.claimed_reward（X）= SUM(x_token_flow_logs.amount) WHERE REWARD；
- x_mining.invest_amount（gAGX）= SUM(STAKE_X) − SUM(UNSTAKE_X)（gagx_flow_logs）。
流水汇总均仅计 status=completed。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAssetsProductInvestReward` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/assets/reward-summary`

**资产页奖励概览 / Assets reward summary**

- auth: required

返回总资产价值、可领取收益、累计已领取收益、剩余贡献点。
stake_invest_usd_value = user_performance.stake_invest_usd_value（ACTIVE）；
total_reward_claimed = DAO CLAIMED + 释放池 claimed_from_queue + 涡轮 cooled_claimed（gAGX；
不再读 user_performance.total_reward_claimed，该列 Scanner 未维护）；
available_contribution = agx_contribution_totals.available_contribution_raw（÷ 10^9）；
claimable_gagx = DAO READY（按贡献点 cap）+ 释放池 releasing_amount + 涡轮 unclaimed_total；
market_fund_claimable_agx = 做市津贴 unlocked_claimable（AGX，单独字段）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseAssetsRewardSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## performance（做市概览）

做市业绩概览与质押地址统计（二期）；同模块其它路径仍为一期 /performance

一级路由：`POST /api/performance/…`

本组接口：
- `POST /performance/making-overview`
- `POST /performance/stake-address-count`

### `POST` `/performance/making-overview`

**用户做市业绩概览 / Making-market performance overview**

- auth: required

汇总当前用户做市相关概览数据：
total_reward = user_performance.total_dao_reward（总奖励 gAGX）；
making_rank = 团队/做市等级；
personal_position = user_performance.active_stake_balance（个人总持仓 AGX，与资产页一致）；
making_market = 总业绩 AGX；
small_market = making_market − MAX(直推 making_market + making_personal_balance)（小区业绩）；
available_contribution = agx_contribution_totals.available_contribution_raw（÷ 10^9）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseMakingOverview` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/performance/stake-address-count`

**质押地址数统计 / Active stake address count**

- auth: required

统计 user_performance 中 projection_status=ACTIVE 且 active_stake_balance &gt; 0 的地址数量。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseStakeAddressCount` {`code`:integer, `data`:StakeAddressCountStats}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## stake-flow（质押流水）

质押流水与持仓

一级路由：`POST /api/stake-flow/…`

本组接口：
- `POST /stake-flow/logs`
- `POST /stake-flow/positions`

### `POST` `/stake-flow/logs`

**分页获取当前用户资产-质押记录 / Paginated stake flow logs**

- auth: required

查询 stake_flow_logs，匹配 user_address 为当前用户，按 block_time 倒序。
可选 operation（string[]，多值为 OR）；未传或空数组则返回全部操作类型。
operation 枚举：STAKE=质押，REWARD=奖励领取，EXTRA_REWARD=额外奖励领取，
CLAIM_PRINCIPAL=赎回/取回本金，RESTAKE=复投。
amount：领取（REWARD/EXTRA_REWARD）和复投（RESTAKE）时为 gAGX；
质押（STAKE）和赎回（CLAIM_PRINCIPAL）时为 AGX。
operation=RESTAKE 时：amount 取 restake_amount，term_days 取 restake_term_days。

**Request body**

- `application/json`: `StakeFlowLogsRequest` {`page`:integer, `page_size`:integer, `operation`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseStakeFlowLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/stake-flow/positions`

**分页获取当前用户质押持仓记录 / Paginated stake positions**

- auth: required

查询 stake_flow_logs，仅 operation=STAKE，按 block_time 倒序。
产品分类：LIQUID=活期，LOCKED=锁仓，EARLY=早期（对应 stake_category）。
释放进度：expire_at = block_time + term_days×86400；
released_pct = min(100, (now - block_time) / (term_days×86400) × 100)；
活期 term_days=0：expire_at = block_time + 86400；
已质押超过 24 小时 released_pct=100，24 小时以内为 0。
total_stake_amount 为当前用户全部 STAKE 流水 amount 合计（AGX）。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseStakePositions` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## bond-flow（债券流水）

债券 LP / 销毁流水与申购记录

一级路由：`POST /api/bond-flow/…`

本组接口：
- `POST /bond-flow/burn-logs`
- `POST /bond-flow/burn-purchases`
- `POST /bond-flow/burn-reward-total`
- `POST /bond-flow/lp-logs`
- `POST /bond-flow/lp-purchases`
- `POST /bond-flow/lp-reward-total`

### `POST` `/bond-flow/burn-logs`

**分页获取当前用户资产-销毁债券记录 / Paginated burn bond logs**

- auth: required

查询 bond_flow_logs，bond_type=BURN_BOND，匹配当前用户，按 block_time 倒序。
未传 operation 时排除 operation=BURN。
可选 operation（string[]，多值为 OR）；未传或空数组则仍排除 BURN，返回其余操作类型。
operation 枚举：PURCHASE=购买/质押，REDEEM=赎回，REWARD=领取，RESTAKE=复投。
payout：领取（REWARD）和复投（RESTAKE）时为 gAGX；
质押/购买（PURCHASE）和赎回（REDEEM）时为 AGX。
operation=RESTAKE 时：payout 取 restake_amount，term_days 取 restake_term_days。

**Request body**

- `application/json`: `BondFlowLpLogsRequest` {`page`:integer, `page_size`:integer, `operation`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondFlowLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/bond-flow/burn-purchases`

**分页获取当前用户销毁债券购买记录 / Paginated burn bond purchases**

- auth: required

查询 bond_flow_logs，bond_type=BURN_BOND 且 operation=PURCHASE，按 block_time 倒序。
不查询 STABLE_BOND。
返回：block_time、term_days、deposit_amount（支付金额=usd_value，USD）、discount_bp（折扣基点）、
payout（获取 AGX）、tx_hash；以及 total_purchase_amount（全部 PURCHASE 的 usd_value 累计）。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondPurchases` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/bond-flow/burn-reward-total`

**当前用户销毁债券累计收益（gAGX）/ Burn bond total reward**

- auth: required

SUM(bond_flow_logs.payout)，条件：bond_type=BURN_BOND、operation=REWARD、status=completed。
含当前用户地址家族；单位 gAGX。无数据返回 "0"。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondRewardTotal` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/bond-flow/lp-logs`

**分页获取当前用户资产-LP债券记录 / Paginated LP bond logs**

- auth: required

查询 bond_flow_logs，bond_type=LP_BOND，匹配当前用户，按 block_time 倒序。
未传 operation 时排除 operation=BURN。
可选 operation（string[]，多值为 OR）；未传或空数组则仍排除 BURN，返回其余操作类型。
operation 枚举：PURCHASE=购买/质押，REDEEM=赎回，REWARD=领取，RESTAKE=复投。
payout：领取（REWARD）和复投（RESTAKE）时为 gAGX；
质押/购买（PURCHASE）和赎回（REDEEM）时为 AGX。
operation=RESTAKE 时：payout 取 restake_amount，term_days 取 restake_term_days。

**Request body**

- `application/json`: `BondFlowLpLogsRequest` {`page`:integer, `page_size`:integer, `operation`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondFlowLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/bond-flow/lp-purchases`

**分页获取当前用户LP债券购买记录 / Paginated LP bond purchases**

- auth: required

查询 bond_flow_logs，bond_type=LP_BOND 且 operation=PURCHASE，按 block_time 倒序。
不查询 STABLE_BOND。
返回：block_time、term_days、deposit_amount（支付金额=usd_value，USD）、discount_bp（折扣基点）、
payout（获取 AGX）、tx_hash；以及 total_purchase_amount（全部 PURCHASE 的 usd_value 累计）。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondPurchases` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/bond-flow/lp-reward-total`

**当前用户 LP 债券累计收益（gAGX）/ LP bond total reward**

- auth: required

SUM(bond_flow_logs.payout)，条件：bond_type=LP_BOND、operation=REWARD、status=completed。
含当前用户地址家族；单位 gAGX。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseBondRewardTotal` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## turbine（涡轮）

涡轮：流水与汇总

一级路由：`POST /api/turbine/…`

本组接口：
- `POST /turbine/logs`
- `POST /turbine/summary`

### `POST` `/turbine/logs`

**分页获取当前用户涡轮记录 / Paginated turbine logs**

- auth: required

查询 turbine_logs，匹配 recipient 为当前用户，按 block_time 倒序。
可选 turbine_type（string[]，多值为 OR）；未传或空数组则返回全部类型。
turbine_type 枚举：received=进入，silenced=解锁，cooled_claimed=提取。

**Request body**

- `application/json`: `TurbineLogsRequest` {`page`:integer, `page_size`:integer, `turbine_type`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTurbineLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/turbine/summary`

**获取当前用户涡轮数据汇总 / Turbine summary**

- auth: required

按 turbine_type 汇总当前用户金额：
pending_unlock（待解锁）= SUM(received.amount) - SUM(silenced.amount)；
unclaimed_total（尚未提取总额）= SUM(silenced.amount) - SUM(cooled_claimed.amount)；
claimed_total（累计已提取）= SUM(cooled_claimed.amount)。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTurbineSummary` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## x0-mining（X0 挖矿）

X0 挖矿流水与持仓

一级路由：`POST /api/x0-mining/…`

本组接口：
- `POST /x0-mining/logs`
- `POST /x0-mining/positions`

### `POST` `/x0-mining/logs`

**分页获取当前用户资产-x0挖矿记录 / Paginated x0 mining logs**

- auth: required

合并 x_token_flow_logs（operation=REWARD，领取 X 奖励）与
gagx_flow_logs（operation=STAKE_X 质押、UNSTAKE_X 解押），
按 block_time 倒序分页返回；仅 status=2（completed）。
可选 operation（string[]，多值为 OR）；未传或空数组则返回上述全部类型。
operation 枚举：STAKE_X=质押，UNSTAKE_X=解押，REWARD=领取。
amount：仅 operation=REWARD 时币种为 X，其他情况为 gAGX。

**Request body**

- `application/json`: `X0MiningLogsRequest` {`page`:integer, `page_size`:integer, `operation`:array}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseX0MiningLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/x0-mining/positions`

**分页获取当前用户X池挖矿质押记录 / Paginated X-pool stake positions**

- auth: required

查询 gagx_flow_logs，operation=STAKE_X 或 UNSTAKE_X，按 block_time 倒序；仅 status=2。
total_stake_amount = SUM(STAKE_X) − SUM(UNSTAKE_X)（gAGX 净质押，与投影 stake_x_pool 口径一致）。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseX0MiningPositions` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## protocol-market-stats（协议市值质押）

协议总市值/总质押日点与四类汇总趋势：Redis 缓存；周/月/年/全部序列与 latest_growth_rate

一级路由：`POST /api/protocol-market-stats/…`

本组接口：
- `POST /protocol-market-stats/aggregate-series`
- `POST /protocol-market-stats/rebuild`
- `POST /protocol-market-stats/series`

### `POST` `/protocol-market-stats/aggregate-series`

**四类汇总趋势（质押/LP债券/销毁债券/X质押） / Aggregate trends series**

- auth: required

数据源：user_performance_daily 日快照（scanner 权威投影）。
指标列（balance 口径，SUM 全用户快照值）：
  stake    = active_stake_balance（AGX 活跃质押余额；与 /series 的 stake=SUM(sum_invest_usdt) USD 累计投入口径不同）
  lp_bond  = bond_lp
  burn_bond= bond_burn
  x_stake  = stake_x_pool（gAGX）
mode：balance（默认）| delta（预留，使用 *_delta 增量列）

range：week(最近7日逐日 YYYY-MM-DD) / month(最近31日逐日 YYYY-MM-DD) /
year(跨度≥6个月按月 YYYY-MM，不足则最近365日 YYYY-MM-DD) /
all(跨度≥6个月按月 YYYY-MM，不足则全部日点 YYYY-MM-DD)

历史日点读 Redis；最新日（本地今天）不走缓存，从 user_performance（projection_status=ACTIVE）
实时 SUM：stake=active_stake_balance，lp_bond=bond_lp，burn_bond=bond_burn，x_stake=stake_x_pool。

响应 data：{ metric, range, mode, list:[{ date, amount }], latest_growth_rate }
latest_growth_rate：最新点相对前一周期（week−7天 / month上月同日 / year上年同日 / all最早>0）；
前一周期无快照或金额<=0则对比最早金额>0的日；无可比快照一律返回 0（不返回 null）。

**Request body**

- `application/json`: `object` {`metric`*:string, `range`*:string, `mode`:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|{`code`:integer, `data`:object}|
|400|参数错误（metric/range/mode 非法）|`ApiErrorResponse`|
|401|未授权|`ApiErrorResponse`|

### `POST` `/protocol-market-stats/rebuild`

**全量重建协议统计 Redis 缓存 / Rebuild protocol stats caches**

- auth: required

从 DB 全量覆盖写入 Redis：
- stats:protocol:daily_series（总市值/总质押日点；市值=usd1_reserve*2）
- stats:protocol:aggregate_daily（四类汇总日点）
用于口径变更或缓存异常后的手动刷新；无需 body。

**Request body**

- none

|status|description|schema|
|---|---|---|
|200|成功 / Success|{`code`:integer, `data`:object}|
|401|未授权|`ApiErrorResponse`|

### `POST` `/protocol-market-stats/series`

**协议总市值与总质押序列 / Protocol market & stake series**

- auth: required

日点来源：总市值 = pool_liquidity_daily.usd1_reserve * 2（USD）；
若当日无池子快照，写当日缓存时回退为 snapshot_date ≤ 当日 的最新市值。
总质押 = SUM(user_performance_daily.sum_invest_usdt) 按日（USD 累计投入口径）。
日点缓存于 Redis；miss 时全量回源后重查。定时：本地 01:00 增量、01:30 补偿。
最新日（服务器本地今天）不走 Redis：stake=SUM(user_performance.sum_invest_usdt, ACTIVE)；
market 从 pool_liquidity_daily 实时解析（非缓存）。

请求：range + metric（必填）
- range：week=最近 7 日逐日；month=最近 31 日逐日；
  year=跨度≥6个月则最近 12 个月按月（date=YYYY-MM），不足 6 个月则最近 365 日逐日（date=YYYY-MM-DD）；
  all=跨度≥6个月则全部按月（date=YYYY-MM），不足 6 个月则全部日点逐日（date=YYYY-MM-DD）
- metric：market=总市值，stake=总质押

响应 data：
{ metric, range, list:[{ date, amount }], latest_growth_rate }
- amount：USD 字符串
- latest_growth_rate：最新点相对前一周期增长率（百分比数值）；
  week=最新−7天，month=上月同日，year=上年同日，all=相对最早金额>0的日；
  前一周期无快照或金额<=0则对比最早金额>0的日；无可比快照一律返回 0（不返回 null）

**Request body**

- `application/json`: `object` {`range`*:string, `metric`*:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseProtocolMarketStatsSeries` {`code`:integer, `data`:object}|
|400|参数错误|`ApiErrorResponse`|
|401|未授权|`ApiErrorResponse`|

## 一期接口

一期已上线接口（历史）。位于文档最下方「历史接口（一期）」分组，默认折叠。/ Phase-1 legacy APIs.

### `POST` `/auth/login`

**使用签名登录并返回JWT / Login with signature and get JWT**

- auth: required

前端用钱包对 message 签名，提交 address + message + signature；验签通过即签发 JWT。
用户可在绑定上级前登录（此时 users 表可能尚无记录，不因此拒绝）；
仅当该地址已入库且 status=封禁时返回 403。
已迁移的旧地址（account_identity_aliases.old_address）禁止登录，返回 403，请使用新地址。
已入库用户会更新 last_login_time / last_login_ip。

**Request body**

- `application/json`: `LoginRequest` {`address`*:string, `message`*:string, `signature`*:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseLogin` {`code`:integer, `data`:object}|
|400|参数错误 / Bad Request|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|
|401|验签失败 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|
|403|账号被封禁或地址已迁移 / Forbidden (banned or migrated address)|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/claim/community-fund`

**申请社区发展基金领取签名 / Request community fund claim signature**

- auth: required

按 token 用户地址申请社区发展基金领取签名，无需请求体。
先从 community_fund_reward_totals（source_type=PRESALE）读取 unlocked_claimable，须大于 0；
signType 固定为 1，合约地址为 COMMUNITY_FUND_VAULT_ADDRESS；
仅查询 order_type=4、status=0 的待领取订单；未过期直接返回原签名及 expireTime（不延长）；
无 status=0 订单时向签名服务申请（expireTime=now+TTL）并写入 reward_claim_orders(status=0)；
已过期则将旧订单置为 status=3 并创建新订单（expireTime=now+TTL，新 salt/amount/签名）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|返回 signature / signature returned|`ApiResponseCommunityFundSignature` {`code`:integer, `data`:object}|
|400|无可领取社区发展基金||
|401|未授权||
|502|签名服务不可用||

### `POST` `/claim/confirm`

**确认领取订单 / Confirm claim order**

- auth: required

前端链上领取完成后调用，服务端不校验链上交易，直接更新本地订单与业绩数据。
salt 须与 /claim/team-reward 或 /claim/community-fund 返回的 bytes32 一致；请求体需包含 salt 与 txHash。
order_type=1（团队奖）：更新 sq_team_reward_totals.claimed、reward_claim_orders、user_performance 等；
内部账户签名金额不超过账面 pending，confirm 与普通用户相同；
order_type=4（社区发展基金）：更新 community_fund_reward_totals（claimed += unlocked_claimable，unlocked_claimable=0）及 reward_claim_orders。
order_type=2（DAO 奖励）与 order_type=5（做市津贴）不支持本接口，由链上扫描器核销；请勿调用 confirm。

**Request body**

- `application/json`: `ClaimConfirmRequest` {`salt`*:string, `txHash`*:string}

|status|description|schema|
|---|---|---|
|200|确认成功|`ApiResponseClaimConfirm` {`code`:integer, `data`:ClaimConfirmResult}|

### `POST` `/claim/parse-signature`

**解析团队奖 signSc 签名 / Parse team reward signSc signature**

- auth: required

须完整传入 signSc 请求参数与 signature，不使用环境变量或数据库默认值。
通过 ecrecover 解析签名并返回 contract/account/amount/salt/expireTime/signType 及 hash、签名者地址。

**Request body**

- `application/json`: `ClaimParseSignatureRequest` {`signature`*:string, `contract`*:string, `salt`*:string, `account`*:string, `amount`*:string, `expireTime`*:integer, `signType`*:integer}

|status|description|schema|
|---|---|---|
|200|解析成功|`ApiResponseClaimParseSignature` {`code`:integer, `data`:ClaimParseSignatureResult}|
|400|参数无效或 signature 格式错误||
|404|无法解析签名||

### `POST` `/claim/team-reward`

**申请团队奖励领取签名 / Request team reward claim signature**

- auth: required

按 token 用户地址申请团队奖领取签名，无需请求体。
先从 sq_team_reward_totals 汇总待领取金额 sum(total-claimed)，须大于 0；
仅查询 status=0 的待领取订单；未过期直接返回原签名及 expireTime（不延长）；
无 status=0 订单时向签名服务申请（expireTime=now+TTL）并写入 reward_claim_orders(status=0)；
已过期则将旧订单置为 status=3 并创建新订单（expireTime=now+TTL，新 salt/amount/签名）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|返回 signature / signature returned|`ApiResponseTeamRewardSignature` {`code`:integer, `data`:object}|
|400|无可领取团队奖||
|401|未授权||
|502|签名服务不可用||

### `POST` `/community-fund/logs`

**分页获取社区发展基金领取记录 / Paginated community fund reward logs**

- auth: required

查询 community_fund_claim_logs，匹配 user_address 为当前用户，按 block_time 倒序。
响应 amount 对应表字段 reward。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseCommunityFundRewardPaidLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/community-fund/total`

**获取社区发展基金预售汇总 / Get community fund presale totals**

- auth: required

匹配 community_fund_reward_totals.user_address 且 source_type=PRESALE。
返回 total、claimed、unlocked_claimable、is_presale_fund_node；无汇总记录时金额均为 "0"。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseCommunityFundPresaleTotals` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/home/popup-notices`

**获取当前生效的首页弹窗公告 / Get active home popup notices**

- auth: none

查询 home_popup_notice：enabled=1，且当前时间在 start_time～end_time 内
（start_time/end_time 为空表示不限制该边界）。
关联 home_popup_notice_i18n；可选 locale 仅返回对应语言文案。
无需登录。

**Request body**

- `application/json`: `object` {`locale`:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseHomePopupNotices` {`code`:integer, `data`:object}|

### `POST` `/performance`

**获取当前用户业绩 / Get current user performance**

- auth: required

按 token 地址查询 user_performance。
返回字段在代码中通过 USER_PERFORMANCE_RESPONSE_FIELDS 配置。
direct_presale_volume（user_performance.sales_direct_team_market）、
invite_address（users.invite_address）。
无记录时 DECIMAL 返回 "0"，INTEGER 返回 0。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseUserPerformance` {`code`:integer, `data`:UserPerformanceItem}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/performance/qualified-partitions`

**满足条件的分区数量 / Qualified partition count**

- auth: required

用于统计下一等级升级条件。分区 = 每个直推（含其团队），每分区最多计 1。
设当前用户预售等级为 R，target_rank = R。
1. 统计 presale_rank >= R 的直推分区数；
2. 若该数 > 约定阈值（默认 2），直接返回；
3. 否则遍历未达标直推，若其下级存在 presale_rank >= R 则该分区计 1；
4. count = direct_qualified_count + team_qualified_count。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功|`ApiResponseQualifiedPartitions` {`code`:integer, `data`:QualifiedPartitionStats}|
|401|未授权||

### `POST` `/referral/total`

**获取当前用户推荐奖收益汇总 / Get referral reward totals**

- auth: required

匹配 sq_referral_totals.user_address

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseRewardTotals` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/rewards/logs`

**获取当前用户预售推荐奖励记录(分页) / Get paginated presale referral reward logs**

- auth: required

查询 sales_reward_logs，匹配 to_address 为当前用户地址；
order_amount 关联 sales_logs（buyer=from_address 且 tx_hash 相同）的 amount。
按 id 倒序分页返回。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseRewardLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/sales/logs`

**获取当前用户销售记录(分页) / Get paginated sales logs**

- auth: required

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseSalesLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/search/performance`

**按地址查询用户业绩 / Get user performance by address**

- auth: none

与 POST /performance 返回字段与逻辑一致，但通过请求体 address 查询，无需 Token。
无 user_performance 记录时 DECIMAL 返回 "0"，INTEGER 返回 0。

**Request body**

- `application/json`: `SearchPerformanceRequest` {`address`*:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseUserPerformance` {`code`:integer, `data`:UserPerformanceItem}|
|400|缺少 address / Missing address|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/team-reward/logs`

**分页获取预售团队奖领取记录 / Paginated presale team reward claim logs**

- auth: required

查询 reward_claim_logs，匹配 user_address 为当前用户。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTeamRewardClaimLogs` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/team-reward/total`

**获取当前用户团队奖收益汇总 / Get team reward totals**

- auth: required

匹配 sq_team_reward_totals.user_address，按 source_type 分组。
total/claimed 为各来源合计；items 为 MARKET/PRESALE 明细。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseRewardTotals` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/team/overview`

**获取社区概览 / Get community overview**

- auth: required

返回当前用户社区概览四项指标：
direct_referral_count（user_performance.direct_referral_count，ACTIVE）、
descendant_count（referral_ancestors 所有下级数量）、
sales_team_market（预售团队业绩）、
direct_presale_volume（user_performance.sales_direct_team_market）、
today_addition_direct_count（user_performance.direct_referral_count 减今日 daily 快照）、
today_addition_team_count（当前总下级数减今日 daily.team_count）、
today_addition_direct_presale_volume（直推业绩减今日 daily.sales_direct_team_market）、
today_addition_sales_team_market（团队业绩减今日 daily.sales_team_market）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTeamOverview` {`code`:integer, `data`:TeamCommunityOverview}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

### `POST` `/team/referrals`

**分页获取当前用户直推下级 / Paginated direct referrals**

- auth: required

通过 referral_ancestors 查询 ancestor_account_id 为当前用户且 depth=1 的直推下级，
关联 users.register_time、user_performance.direct_referral_count（ACTIVE）、
user_performance.presale_rank 与 sales_team_market（ACTIVE）；
making_market（团队业绩 AGX）、making_rank（做市等级）、active_stake_balance（持仓 AGX）；
making_market_usd / active_stake_balance_usd = 对应 AGX × agx_price_logs 最新价。

**Request body**

- `application/json`: `PaginationRequest` {`page`:integer, `page_size`:integer}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTeamReferrals` {`code`:integer, `data`:object}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|

## 二期·未分类

### `POST` `/dao-reward/type-totals`

**当前用户各类型 DAO 奖励待领取汇总（gAGX）**

- auth: required

从 dao_reward_grants 按 reward_type 分组，SUM(pending_gross)（gAGX 税前待领取）。
仅统计 active_generation 可见代次；接收方含别名家族（地址快照 OR 稳定账户ID）。
data 为 map：key=奖励类型，value=金额字符串。
不传 type：返回全部类型（无数据为 "0"）：
RANK_REWARD、REFERRAL_REWARD、PARTICIPATION_REWARD、SURPASS_REWARD、LIFETIME_REWARD、
LUCKY_REWARD（幸运奖：SUM(lucky_winners.reward_amount) − SUM(lucky_claims.total_reward)，≤0 记 0）、
MARKET_FUND（发展津贴：market_fund_reward_totals.unlocked_claimable，AGX）。
传 type：仅返回该类型一项，如 `{ "REFERRAL_REWARD": "12.34" }`。

**Request body**

- `application/json`: `object` {`type`:string}

|status|description|schema|
|---|---|---|
|200|成功 / Success|{`code`:integer, `data`:object}|
|400|type 非法|`ApiErrorResponse`|
|401|未授权|`ApiErrorResponse`|

### `POST` `/team/making-overview`

**获取做市社区概览 / Making-market community overview**

- auth: required

当前用户做市社区指标（user_performance ACTIVE + 今日 user_performance_daily）：
direct_referral_count（直推人数）、
making_direct_team_market（直推业绩 USD = AGX × agx_price_logs 最新价）、
today_addition_making_direct_team_market（今日直推业绩增量 USD，daily.making_direct_team_market_delta × 最新价）、
team_count（团队人数）、
making_market（团队业绩 USD = AGX × 最新价）、
today_addition_making_market（今日团队业绩增量 USD，daily.making_market_delta × 最新价）、
making_rank（做市等级）。

**Request body**

- `application/json`: `EmptyRequest` {}

|status|description|schema|
|---|---|---|
|200|成功 / Success|`ApiResponseTeamMakingOverview` {`code`:integer, `data`:TeamMakingCommunityOverview}|
|401|未授权 / Unauthorized|`ErrorResponse` {`code`:integer, `error`:string, `message`:string, `data`:object}|
