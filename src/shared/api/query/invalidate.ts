import { queryClient } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { SWAP_CONFIG } from '~/shared/config/swap'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { Paginated, SalesLogItem } from '~/shared/api/types'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readSalesLogCount(): number {
  const entries = queryClient.getQueriesData<Paginated<SalesLogItem>>({
    queryKey: queryKeys.api.salesLogsRoot,
  })

  return entries.reduce((max, [, data]) => Math.max(max, data?.items?.length ?? 0), 0)
}

async function pollGenesisContributions(baselineCount: number) {
  await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })
  await queryClient.refetchQueries({ queryKey: queryKeys.api.salesLogsRoot })

  if (readSalesLogCount() > baselineCount) {
    return
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500)
    await queryClient.refetchQueries({ queryKey: queryKeys.api.salesLogsRoot })
    await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })

    if (readSalesLogCount() > baselineCount) {
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
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referral(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referralIsBound(address) })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.swapBalances(
      address,
      SWAP_CONFIG.tradePair.tokenA.address,
      SWAP_CONFIG.tradePair.tokenB.address,
    ),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.swapBalances(
      address,
      SWAP_CONFIG.tradePair.tokenB.address,
      SWAP_CONFIG.tradePair.tokenA.address,
    ),
  })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.flashSwapBalances(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.flashSwapQuoteRoot })
}

/** Wallet account changed — drop stale user-scoped reads; leave shared data untouched. */
export function invalidateAfterWalletSwitch(previousAddress?: string, nextAddress?: string, tab?: DappTab) {
  // Address-scoped chain reads (balances, allowances, referral state, user totals)
  // must refresh for the new account. Global phase/price data is shared and is
  // intentionally left alone.
  invalidateAddressScopedChainQueries(previousAddress)
  invalidateAddressScopedChainQueries(nextAddress)

  // API data is per-wallet; refresh only the currently visible tab's queries so
  // the user sees their own records without refetching background tabs.
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

/** Genesis phase start/end boundary crossed — refresh presale + authenticated API. */
export function invalidateAfterGenesisPhaseTransition(address?: string) {
  invalidatePresaleChainQueries(address)
  void invalidateApiQueries()
}

export function clearApiQueries() {
  return queryClient.resetQueries({ queryKey: queryKeys.api.all })
}

export function invalidatePresaleChainQueries(address?: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePhases })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleActivePhase })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAgxPrice })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleTotalPurchased })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAirdropThreshold })

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotal(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserPhaseRemainingByUser(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.erc20Root })
}

const TAB_QUERY_KEYS: Record<DappTab, readonly (readonly string[])[]> = {
  genesis: [
    queryKeys.api.performance,
    queryKeys.api.salesLogsRoot,
    queryKeys.api.referralTotal,
    queryKeys.api.teamOverview,
    queryKeys.chain.presalePhases,
    queryKeys.chain.presaleActivePhase,
    queryKeys.chain.presaleAgxPrice,
    queryKeys.chain.presaleTotalPurchased,
    queryKeys.chain.presaleAirdropThreshold,
    queryKeys.chain.presaleUserTotalRoot,
    queryKeys.chain.presaleUserPhaseRemainingRoot,
    queryKeys.chain.erc20Root,
    queryKeys.chain.referralRoot,
  ],
  rewards: [
    queryKeys.api.performance,
    queryKeys.api.qualifiedPartitions,
    queryKeys.api.rewardLogsRoot,
    queryKeys.api.referralTotal,
    queryKeys.api.teamRewardTotal,
    queryKeys.api.teamRewardClaimLogsRoot,
    queryKeys.api.communityFundTotal,
    queryKeys.api.communityFundLogsRoot,
    queryKeys.api.teamOverview,
  ],
  community: [
    queryKeys.api.teamOverview,
    queryKeys.api.teamReferralsRoot,
    queryKeys.api.referralTotal,
    queryKeys.api.performance,
    queryKeys.chain.referralRoot,
  ],
  swap: [
    queryKeys.chain.swapRoot,
    queryKeys.chain.erc20Root,
  ],
}

/** Invalidate all queries used by a single DApp tab. Called on tab switch. */
export function invalidateTabQueries(tab: DappTab) {
  TAB_QUERY_KEYS[tab].forEach((key) => {
    void queryClient.invalidateQueries({ queryKey: key })
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

  const salesLogBaseline = readSalesLogCount()
  invalidateTabQueries('genesis')
  void pollGenesisContributions(salesLogBaseline)
}

export function invalidateAfterTeamClaim() {
  invalidateTabQueries('rewards')
}

export function invalidateAfterReferralBind() {
  invalidateTabQueries('community')
}

export function invalidateAfterSwap() {
  invalidateTabQueries('swap')
}
