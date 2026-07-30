import { queryClient } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { TAB_QUERY_KEYS } from '~/shared/api/query/tab-query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { Paginated, SalesLogItem } from '~/shared/api/types'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type SalesLogFingerprint = { total: number; firstId: number | null }

/** Pure: pick the strongest sales-log fingerprint from cached pages. */
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

/** Pure: whether polling should stop because a newer sales log appeared. */
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

function invalidateApiQueries() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.api.all })
}

function invalidateAddressScopedChainQueries(address?: string) {
  if (!address) return
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotal(address) })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
  })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referral(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralIsBound(address) })
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

/** User SIWE session became active — refresh API + wallet-scoped chain reads. */
export function invalidateAfterAuthLogin(address?: string) {
  void invalidateApiQueries()
  invalidatePresaleChainQueries(address)

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referral(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralIsBound(address) })
}

/** Genesis phase start/end boundary crossed — refresh presale + session API. */
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

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotal(address) })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address),
  })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Root })
}

/** 使当前 Tab 相关 query 标记过期，并只 refetch 已挂载的观察者。 */
export function invalidateTabQueries(tab: DappTab) {
  TAB_QUERY_KEYS[tab].forEach((key) => {
    void queryClient.invalidateQueries({ queryKey: key, refetchType: 'active' })
  })
}

/** Invalidate every query that makes up the Genesis page. */
export function invalidateGenesisPage() {
  invalidateTabQueries('genesis')
}

export function invalidateAfterGenesisPurchase(address: string, purchaseAmount?: bigint) {
  if (purchaseAmount && purchaseAmount > 0n) {
    queryClient.setQueryData(queryKeys.chain.presaleUserTotal(address), (current?: bigint) => {
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

export function invalidateAfterStaking() {
  invalidateTabQueries('staking')
}

/** Mixed claim / redeem / xmine claim+unstake — refresh positions + plans + contribution. */
export function invalidateAfterAssetsClaim() {
  invalidateTabQueries('assets')
  invalidateTabQueries('staking')
}

/**
 * Queue vested claim → Turbine quota (EX-U5) + release reads.
 * Buffer claim → release + AGX balance (turbineRoot invalidation is cheap/harmless).
 */
export function invalidateAfterReleaseClaim() {
  invalidateTabQueries('release')
}
