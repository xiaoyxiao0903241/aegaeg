import { queryClient } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { TAB_QUERY_KEYS } from '~/shared/api/query/tab-query-keys'
import type { Paginated, SalesLogItem } from '~/shared/api/types'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { sleep } from '~/shared/lib/utils'

/** 奖励发放/领取列表首行：扫描器把 READY 改成 CLAIMED 时 total 往往不变。 */
type RewardStatusRow = {
  status?: string | number
  fully_claimed_at?: string | null
  claimed_at?: string | null
  claim_status?: string | null
  tx_hash?: string | null
  claim_tx_hash?: string | null
}

/** 奖励领取扫描指纹：待领汇总 + 列表首行状态 + 被轮询的汇总。 */
type RewardScanFingerprint = {
  typeTotals: string
  grantLogs: string
  luckyLogs: string
  luckySummary: string
  teamLogs: string
  teamTotal: string
  marketLogs: string
  marketSummary: string
  communityLogs: string
  communityTotal: string
  assetsReward: string
}

type SalesLogFingerprint = { total: number; firstId: number | null }

/** 索引器/API 页指纹——总量 + 首条键（tx_hash / id）。 */
export type IndexerPageFingerprint = { total: number; head: string | null }

type IndexerPage = { total: number; items: ReadonlyArray<{ tx_hash?: string | null }> }

/** 纯函数：从多个分页页中取最强指纹（先比总量，再补首条 head）。 */
export function pickIndexerPageFingerprint(
  pages: Array<IndexerPage | undefined | null>,
): IndexerPageFingerprint {
  let best: IndexerPageFingerprint = { total: 0, head: null }
  for (const data of pages) {
    if (!data) continue
    const head = data.items[0]?.tx_hash ?? null
    if (data.total > best.total) {
      best = { total: data.total, head }
      continue
    }
    if (data.total === best.total && head != null && best.head == null) {
      best = { total: data.total, head }
    }
  }
  return best
}

/** 纯函数：是否应停止轮询（出现了更新的页）。 */
export function indexerPageAdvanced(
  baseline: IndexerPageFingerprint,
  current: IndexerPageFingerprint,
): boolean {
  if (current.total > baseline.total) return true
  if (current.head != null && baseline.head != null && current.head !== baseline.head) {
    return true
  }
  return false
}

/** 纯函数：从缓存的销售日志分页中取最强指纹。 */
export function pickSalesLogFingerprint(
  pages: Array<Paginated<SalesLogItem> | undefined | null>,
): SalesLogFingerprint {
  let best: SalesLogFingerprint = { total: 0, firstId: null }
  for (const data of pages) {
    if (!data) continue
    const firstId = data.items[0]?.id ?? null
    if (data.total > best.total) {
      best = { total: data.total, firstId }
      continue
    }
    if (data.total === best.total && firstId != null && best.firstId == null) {
      best = { total: data.total, firstId }
    }
  }
  return best
}

/** 纯函数：是否应停止轮询（出现了更新的销售日志）。 */
export function salesLogAdvanced(
  baseline: SalesLogFingerprint,
  current: SalesLogFingerprint,
): boolean {
  if (current.total > baseline.total) return true
  if (current.firstId != null && baseline.firstId != null && current.firstId !== baseline.firstId) {
    return true
  }
  return false
}

/**
 * 奖励列表页指纹：总量 + 首条状态 / 领取时间 / 交易哈希。
 *
 * 领取核销常改同一行 READY→CLAIMED，不能只盯 total。
 *
 * @param pages 缓存中的分页结果
 */
export function pickRewardStatusPageFingerprint(
  pages: Array<Paginated<RewardStatusRow> | undefined | null>,
): string {
  let bestTotal = 0
  let head = ''
  for (const data of pages) {
    if (!data) continue
    const item = data.items[0]
    const sig = item
      ? [
          item.status ?? '',
          item.fully_claimed_at ?? item.claimed_at ?? '',
          item.claim_status ?? '',
          item.tx_hash ?? item.claim_tx_hash ?? '',
        ].join('|')
      : ''
    if (data.total > bestTotal) {
      bestTotal = data.total
      head = sig
      continue
    }
    if (data.total === bestTotal && sig && !head) {
      head = sig
    }
  }
  return `${bestTotal}:${head}`
}

/**
 * 扫描器是否已推进奖励领取视图。
 *
 * @param baseline 写链前缓存指纹
 * @param current 最近一次 refetch 后的指纹
 * @returns 任一列表或待领汇总变化则为 true
 */
export function rewardScanAdvanced(
  baseline: RewardScanFingerprint,
  current: RewardScanFingerprint,
): boolean {
  return (Object.keys(baseline) as Array<keyof RewardScanFingerprint>).some(
    (key) => baseline[key] !== current[key],
  )
}

function readSalesLogFingerprint(): SalesLogFingerprint {
  const entries = queryClient.getQueriesData<Paginated<SalesLogItem>>({
    queryKey: queryKeys.api.salesLogsRoot,
  })
  return pickSalesLogFingerprint(entries.map(([, data]) => data))
}

function readIndexerFingerprint(rootKey: readonly string[]): IndexerPageFingerprint {
  const entries = queryClient.getQueriesData<IndexerPage>({ queryKey: rootKey })
  return pickIndexerPageFingerprint(entries.map(([, data]) => data))
}

async function pollGenesisContributions(baseline: { total: number; firstId: number | null }) {
  await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })
  await queryClient.refetchQueries({ queryKey: queryKeys.api.salesLogsRoot })

  if (salesLogAdvanced(baseline, readSalesLogFingerprint())) {
    return
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500, { unref: true })
    await queryClient.refetchQueries({ queryKey: queryKeys.api.salesLogsRoot })
    await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })

    if (salesLogAdvanced(baseline, readSalesLogFingerprint())) {
      return
    }
  }
}

/**
 * 质押/债券/挖矿写成功后：后端索引常落后于链确认。
 * 对标 Genesis `pollGenesisContributions`——立即 refetch + 有限次延迟轮询，指纹前进即停。
 * 业界常见做法：invalidate 链读即时校正；API/indexer 用短窗 poll（勿无限 setInterval）。
 */
async function pollStakingIndexer(baselines: {
  stakePositions: IndexerPageFingerprint
  stakeLogs: IndexerPageFingerprint
  bondLp: IndexerPageFingerprint
  bondBurn: IndexerPageFingerprint
  x0Positions: IndexerPageFingerprint
  x0Logs: IndexerPageFingerprint
}) {
  const apiRoots = [
    queryKeys.api.stakeFlowPositionsRoot,
    queryKeys.api.stakeFlowLogsRoot,
    queryKeys.api.bondFlowLpPurchasesRoot,
    queryKeys.api.bondFlowBurnPurchasesRoot,
    queryKeys.api.bondFlowLpLogsRoot,
    queryKeys.api.bondFlowBurnLogsRoot,
    queryKeys.api.x0MiningPositionsRoot,
    queryKeys.api.x0MiningLogsRoot,
    queryKeys.api.luckyRewardSummary,
    queryKeys.api.luckyRewardMyRoundsRoot,
  ] as const

  const anyAdvanced = () =>
    indexerPageAdvanced(
      baselines.stakePositions,
      readIndexerFingerprint(queryKeys.api.stakeFlowPositionsRoot),
    ) ||
    indexerPageAdvanced(
      baselines.stakeLogs,
      readIndexerFingerprint(queryKeys.api.stakeFlowLogsRoot),
    ) ||
    indexerPageAdvanced(
      baselines.bondLp,
      readIndexerFingerprint(queryKeys.api.bondFlowLpPurchasesRoot),
    ) ||
    indexerPageAdvanced(
      baselines.bondBurn,
      readIndexerFingerprint(queryKeys.api.bondFlowBurnPurchasesRoot),
    ) ||
    indexerPageAdvanced(
      baselines.x0Positions,
      readIndexerFingerprint(queryKeys.api.x0MiningPositionsRoot),
    ) ||
    indexerPageAdvanced(baselines.x0Logs, readIndexerFingerprint(queryKeys.api.x0MiningLogsRoot))

  const refetchIndexer = async () => {
    await Promise.all(apiRoots.map((key) => queryClient.refetchQueries({ queryKey: key })))
  }

  await refetchIndexer()
  if (anyAdvanced()) return

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500, { unref: true })
    await refetchIndexer()
    if (anyAdvanced()) return
  }
}

const GRANT_LOG_ROOTS = [
  queryKeys.api.referralAwardLogsRoot,
  queryKeys.api.participationAwardLogsRoot,
  queryKeys.api.rankRewardLogsRoot,
  queryKeys.api.rankRewardPeerSurpassLogsRoot,
] as const

const REWARD_CLAIM_POLL_KEYS = [
  queryKeys.api.daoRewardTypeTotals,
  ...GRANT_LOG_ROOTS,
  queryKeys.api.luckyRewardSummary,
  queryKeys.api.luckyRewardMyRoundsRoot,
  queryKeys.api.marketAllowanceSummary,
  queryKeys.api.marketAllowanceClaimLogsRoot,
  queryKeys.api.teamRewardTotal,
  queryKeys.api.teamRewardClaimLogsRoot,
  queryKeys.api.communityFundTotal,
  queryKeys.api.communityFundLogsRoot,
  queryKeys.api.assetsRewardSummary,
] as const

function snapshotQueryData(key: readonly string[]): string {
  const data = queryClient.getQueryData(key)
  if (data == null) return ''
  try {
    return JSON.stringify(data)
  } catch {
    return ''
  }
}

function readStatusPages(rootKey: readonly string[]): string {
  const entries = queryClient.getQueriesData<Paginated<RewardStatusRow>>({ queryKey: rootKey })
  return pickRewardStatusPageFingerprint(entries.map(([, data]) => data))
}

function readRewardScanFingerprint(): RewardScanFingerprint {
  return {
    typeTotals: snapshotQueryData(queryKeys.api.daoRewardTypeTotals),
    grantLogs: GRANT_LOG_ROOTS.map((root) => readStatusPages(root)).join('~'),
    luckyLogs: readStatusPages(queryKeys.api.luckyRewardMyRoundsRoot),
    luckySummary: snapshotQueryData(queryKeys.api.luckyRewardSummary),
    teamLogs: readStatusPages(queryKeys.api.teamRewardClaimLogsRoot),
    teamTotal: snapshotQueryData(queryKeys.api.teamRewardTotal),
    marketLogs: readStatusPages(queryKeys.api.marketAllowanceClaimLogsRoot),
    marketSummary: snapshotQueryData(queryKeys.api.marketAllowanceSummary),
    communityLogs: readStatusPages(queryKeys.api.communityFundLogsRoot),
    communityTotal: snapshotQueryData(queryKeys.api.communityFundTotal),
    assetsReward: snapshotQueryData(queryKeys.api.assetsRewardSummary),
  }
}

function refetchPollKey(key: readonly string[]) {
  const matches = queryClient.getQueryCache().findAll({ queryKey: key })
  if (matches.every((query) => query.options.queryFn == null)) return Promise.resolve()
  return queryClient.refetchQueries({ queryKey: key })
}

function hasFetchableQuery(key: readonly string[]): boolean {
  return queryClient
    .getQueryCache()
    .findAll({ queryKey: key, type: 'active' })
    .some((query) => query.options.queryFn != null)
}

type CapturedIndexerLog = {
  root: readonly string[]
  baseline: IndexerPageFingerprint
}

const ASSETS_CLAIM_LOG_ROOTS = [
  queryKeys.api.stakeFlowLogsRoot,
  queryKeys.api.bondFlowLpLogsRoot,
  queryKeys.api.bondFlowBurnLogsRoot,
  queryKeys.api.x0MiningLogsRoot,
] as const

const RELEASE_CLAIM_LOG_ROOTS = [
  queryKeys.api.releasePoolLogsRoot,
  queryKeys.api.bufferPoolLogsRoot,
] as const

const EXCHANGE_LOG_ROOTS = [
  queryKeys.api.turbineLogsRoot,
  queryKeys.api.agxContributionBurnLogsRoot,
  queryKeys.api.agxContributionConsumeLogsRoot,
] as const

/** 写前快照已挂载的流水根；闪兑等无记录表的路径得到空列表，poll 直接返回。 */
function captureIndexerLogPoll(roots: readonly (readonly string[])[]): CapturedIndexerLog[] {
  return roots.filter(hasFetchableQuery).map((root) => ({
    root,
    baseline: readIndexerFingerprint(root),
  }))
}

/**
 * 后端索引落后于链确认时，对流水根立即 refetch + 有限次延迟轮询，指纹前进即停。
 *
 * 只轮询写成功时仍有观察者的流水；闪兑/市价未挂记录表则空列表直接返回。
 *
 * @param captured 写前快照；空则 no-op
 * @param extraKeys 随轮询一起拉的非分页键（如 xmine 累计产出）；不参与停表指纹
 * @see docs/backend-api/api.md #stake-flow/logs
 * @see docs/backend-api/api.md #release-pool/logs
 * @see docs/backend-api/api.md #turbine/logs
 */
async function pollCapturedIndexerLogs(
  captured: readonly CapturedIndexerLog[],
  extraKeys: readonly (readonly string[])[] = [],
) {
  if (captured.length === 0) return

  const extras = extraKeys.filter(hasFetchableQuery)
  const refetch = () =>
    Promise.all([
      ...captured.map(({ root }) => refetchPollKey(root)),
      ...extras.map((key) => refetchPollKey(key)),
    ])
  const advanced = () =>
    captured.some(({ root, baseline }) =>
      indexerPageAdvanced(baseline, readIndexerFingerprint(root)),
    )

  await refetch()
  if (advanced()) return

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500, { unref: true })
    await refetch()
    if (advanced()) return
  }
}

/**
 * 奖励领取后扫描器核销 READY→CLAIMED、待领汇总下降常落后于链确认。
 * 立即 refetch + 有限次延迟轮询，指纹变化即停。
 *
 * @param baseline 写链前的列表/汇总指纹
 * @see docs/backend-api/api.md #claim/dao-reward
 */
async function pollRewardsClaimIndexer(baseline: RewardScanFingerprint) {
  const refetch = () => Promise.all(REWARD_CLAIM_POLL_KEYS.map((key) => refetchPollKey(key)))

  await refetch()
  if (rewardScanAdvanced(baseline, readRewardScanFingerprint())) return

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500, { unref: true })
    await refetch()
    if (rewardScanAdvanced(baseline, readRewardScanFingerprint())) return
  }
}

function invalidateActive(key: readonly string[]) {
  void queryClient.invalidateQueries({ queryKey: key, refetchType: 'active' })
}

function invalidateAssetsRewardSummary() {
  invalidateActive(queryKeys.api.assetsRewardSummary)
}

/** 贡献点变动：总表 + 带 available_contribution 的发放汇总。 */
function invalidateContributionChanged() {
  invalidateActive(queryKeys.api.agxContributionSummary)
  invalidateActive(queryKeys.api.referralAwardSummary)
  invalidateActive(queryKeys.api.participationAwardSummary)
  invalidateActive(queryKeys.api.rankRewardSummary)
}

function invalidateApiQueries() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.api.all })
}

function invalidatePresaleUserPhaseRemainingOf(address: string) {
  const owner = address.toLowerCase()
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.presaleUserPhaseRemainingRoot,
    predicate: (query) => query.queryKey.at(-1) === owner,
  })
}

function invalidateAddressScopedChainQueries(address?: string) {
  if (!address) return
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotalOf(address) })
  invalidatePresaleUserPhaseRemainingOf(address)
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20BalanceOf(BSC_CONTRACTS.usd1, address),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20AllowanceOf(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
  })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralOf(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralIsBoundOf(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Root })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.flashSwapRoot })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.burnSwapRoot })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.turbineRoot })
}

/** 钱包账户切换：刷新新地址链上读；旧地址缓存保留至自然过期。 */
export function invalidateAfterWalletSwitch(nextAddress?: string, tab?: DappTab) {
  invalidateAddressScopedChainQueries(nextAddress)

  if (tab) {
    invalidateTabQueries(tab)
  }
}

/** 用户 SIWE 会话变为活跃——刷新 API 与钱包作用域的链上读取。 */
export function invalidateAfterAuthLogin(address?: string) {
  void invalidateApiQueries()
  invalidatePresaleChainQueries(address)

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralOf(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralIsBoundOf(address) })
}

/** 跨过 Genesis 阶段起止边界——刷新预售链上读取与会话 API。 */
export function invalidateAfterGenesisPhaseTransition(address?: string) {
  invalidatePresaleChainQueries(address)
  void invalidateApiQueries()
}

/** 清空全部后端 API 查询缓存（登出 / 数据源重置时使用）。 */
export function clearApiQueries() {
  return queryClient.resetQueries({ queryKey: queryKeys.api.all })
}

/** 使预售相关链上查询过期；传入地址时一并刷新该地址的用户额度与余额。 */
export function invalidatePresaleChainQueries(address?: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePhases })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAgxPrice })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleTotalPurchased })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAirdropThreshold })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePaused })

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotalOf(address) })
  invalidatePresaleUserPhaseRemainingOf(address)
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Root })
}

/** 使当前 Tab 相关 query 标记过期，并只 refetch 已挂载的观察者（写后 / 钱包切换）。 */
export function invalidateTabQueries(tab: DappTab) {
  TAB_QUERY_KEYS[tab].forEach((key) => {
    void queryClient.invalidateQueries({ queryKey: key, refetchType: 'active' })
  })
}

/**
 * 切 Tab：只 refetch 已 stale 的 active 观察者。
 * 不把仍在 staleTime 内的缓存标脏（避免抵消 hover 预热）。
 */
export function refetchStaleTabQueries(tab: DappTab) {
  TAB_QUERY_KEYS[tab].forEach((key) => {
    void queryClient.refetchQueries({ queryKey: key, type: 'active', stale: true })
  })
}

/** 使构成 Genesis 页的全部查询失效。 */
export function invalidateGenesisPage() {
  invalidateTabQueries('genesis')
}

/**
 * Genesis 购买成功后的缓存更新。
 *
 * 先按链上确认金额乐观累加累计购买量，再刷新页面查询并轮询销售日志，
 * 直到后端索引追上确认结果。
 */
export function invalidateAfterGenesisPurchase(address: string, purchaseAmount?: bigint) {
  if (purchaseAmount && purchaseAmount > 0n) {
    queryClient.setQueryData(queryKeys.chain.presaleUserTotalOf(address), (current?: bigint) => {
      const base = typeof current === 'bigint' ? current : 0n
      return base + purchaseAmount
    })
    queryClient.setQueryData(queryKeys.chain.presaleTotalPurchased, (current?: bigint) => {
      const base = typeof current === 'bigint' ? current : 0n
      return base + purchaseAmount
    })
  }

  const salesLogBaseline = readSalesLogFingerprint()
  invalidateTabQueries('genesis')
  void pollGenesisContributions(salesLogBaseline)
}

/**
 * 团队奖 / 发展津贴 / 社区基金签名领取写成功。
 *
 * rewards：待领汇总、发放记录；assetsRewardSummary：累计已领取 / 做市可领。
 * 列表等扫描器 READY→CLAIMED，短窗轮询。
 */
export function invalidateAfterTeamClaim() {
  const baseline = readRewardScanFingerprint()
  invalidateTabQueries('rewards')
  invalidateAssetsRewardSummary()
  void pollRewardsClaimIndexer(baseline)
}

/**
 * 奖励侧 Mixed（Lucky / Dao）写成功：
 * 进释放队列 / 可能复投 → 刷 rewards + release + staking；
 * 复投改持仓分布，累计已领取在 assetsRewardSummary。
 * 发放记录 / type-totals 等扫描器核销，短窗轮询。
 */
export function invalidateAfterRewardsMixedClaim() {
  const baseline = readRewardScanFingerprint()
  invalidateTabQueries('rewards')
  invalidateTabQueries('release')
  invalidateTabQueries('staking')
  invalidateAssetsRewardSummary()
  invalidateActive(queryKeys.api.assetsHoldingsSummary)
  invalidateActive(queryKeys.api.assetsHoldingsDistribution)
  invalidateActive(queryKeys.api.assetsProductInvestReward)
  void pollRewardsClaimIndexer(baseline)
}

/** 推荐绑定成功后刷新 community Tab 的查询。 */
export function invalidateAfterReferralBind() {
  invalidateTabQueries('community')
}

/**
 * 兑换写成功后刷新 exchange Tab。
 *
 * 涡轮领取改 claimable_gagx，标脏 assetsRewardSummary。
 * 销毁改贡献点走 `invalidateAfterBurnExchange`。
 * 涡轮 / 销毁流水走短窗 poll（当前页未订阅则跳过）。
 */
export function invalidateAfterExchange() {
  const logPoll = captureIndexerLogPoll(EXCHANGE_LOG_ROOTS)
  invalidateTabQueries('exchange')
  invalidateAssetsRewardSummary()
  void pollCapturedIndexerLogs(logPoll)
}

/** 销毁 AGX 换贡献点：兑换缓存 + 贡献点总表 / 发放汇总。 */
export function invalidateAfterBurnExchange() {
  invalidateAfterExchange()
  invalidateContributionChanged()
}

/**
 * Stake / Bond / Xmine 写成功（手册 §8/10/15）：
 * - 链：staking + assets（仓位 aside 用 assetsStakePositions；余额/额度在两桶交叉）
 * - 抽奖资格：lucky API（手册「成功后刷新…抽奖资格」；活期通常达不到门槛仍标脏）
 * - API 流水/持仓：立即 invalidate + 有限轮询（索引延迟）
 */
export function invalidateAfterStaking() {
  const baselines = {
    stakePositions: readIndexerFingerprint(queryKeys.api.stakeFlowPositionsRoot),
    stakeLogs: readIndexerFingerprint(queryKeys.api.stakeFlowLogsRoot),
    bondLp: readIndexerFingerprint(queryKeys.api.bondFlowLpPurchasesRoot),
    bondBurn: readIndexerFingerprint(queryKeys.api.bondFlowBurnPurchasesRoot),
    x0Positions: readIndexerFingerprint(queryKeys.api.x0MiningPositionsRoot),
    x0Logs: readIndexerFingerprint(queryKeys.api.x0MiningLogsRoot),
  }

  invalidateTabQueries('staking')
  invalidateTabQueries('assets')
  // claimPrincipal / redeem(..., false) / startUnstake 经 Manager 进分流器
  invalidateTabQueries('release')
  void queryClient.invalidateQueries({
    queryKey: queryKeys.api.luckyRewardSummary,
    refetchType: 'active',
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.api.luckyRewardMyRoundsRoot,
    refetchType: 'active',
  })
  void pollStakingIndexer(baselines)
}

/** Mixed 领取 / 赎回 / xmine 领取+退出——刷新持仓、计划、贡献值、释放，并短窗轮询操作流水。 */
export function invalidateAfterAssetsClaim() {
  const logPoll = captureIndexerLogPoll(ASSETS_CLAIM_LOG_ROOTS)
  invalidateTabQueries('assets')
  invalidateTabQueries('staking')
  invalidateTabQueries('release')
  invalidateContributionChanged()
  void pollCapturedIndexerLogs(logPoll, [queryKeys.api.x0MiningLifetimeReward])
}

/**
 * 释放队列领取 → 可能增加 Turbine 配额 + 释放相关读取。
 * 缓冲池领取 → 释放 + AGX 余额（turbineRoot 失效开销小、无副作用）。
 * 资产页 claimable_gagx 含释放池 / 涡轮未领。
 * 队列 / 缓冲流水走短窗 poll（当前页未订阅则跳过）。
 */
export function invalidateAfterReleaseClaim() {
  const logPoll = captureIndexerLogPoll(RELEASE_CLAIM_LOG_ROOTS)
  invalidateTabQueries('release')
  invalidateAssetsRewardSummary()
  void pollCapturedIndexerLogs(logPoll)
}
