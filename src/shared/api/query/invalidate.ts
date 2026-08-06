import { queryClient } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { TAB_QUERY_KEYS } from '~/shared/api/query/tab-query-keys'
import type { Paginated, SalesLogItem } from '~/shared/api/types'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { sleep } from '~/shared/lib/utils'

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
    await sleep(2500)
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
    await sleep(2500)
    await refetchIndexer()
    if (anyAdvanced()) return
  }
}

function invalidateApiQueries() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.api.all })
}

function invalidateAddressScopedChainQueries(address?: string) {
  if (!address) return
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotalOf(address) })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20BalanceOf(BSC_CONTRACTS.usd1, address),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
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

export function clearApiQueries() {
  return queryClient.resetQueries({ queryKey: queryKeys.api.all })
}

export function invalidatePresaleChainQueries(address?: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePhases })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAgxPrice })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleTotalPurchased })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAirdropThreshold })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePaused })

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotalOf(address) })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address),
  })
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

export function invalidateAfterTeamClaim() {
  invalidateTabQueries('rewards')
}

export function invalidateAfterReferralBind() {
  invalidateTabQueries('community')
}

export function invalidateAfterExchange() {
  invalidateTabQueries('exchange')
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

/** Mixed 领取 / 赎回 / xmine 领取+退出——刷新持仓、计划与贡献值相关查询。 */
export function invalidateAfterAssetsClaim() {
  invalidateTabQueries('assets')
  invalidateTabQueries('staking')
}

/**
 * 释放队列领取 → 可能增加 Turbine 配额 + 释放相关读取。
 * 缓冲池领取 → 释放 + AGX 余额（turbineRoot 失效开销小、无副作用）。
 */
export function invalidateAfterReleaseClaim() {
  invalidateTabQueries('release')
}
