import { queryClient } from './query-client'
import { queryKeys } from './query-keys'
import type { Paginated, SalesLogItem } from '../api/types'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readSalesLogCount(): number {
  const entries = queryClient.getQueriesData<Paginated<SalesLogItem>>({
    queryKey: ['api', 'salesLogs'],
  })

  return entries.reduce((max, [, data]) => Math.max(max, data?.items?.length ?? 0), 0)
}

async function pollGenesisContributions(baselineCount: number) {
  await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })
  await queryClient.refetchQueries({ queryKey: ['api', 'salesLogs'] })

  if (readSalesLogCount() > baselineCount) {
    return
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(2500)
    await queryClient.refetchQueries({ queryKey: ['api', 'salesLogs'] })
    await queryClient.refetchQueries({ queryKey: queryKeys.api.performance })

    if (readSalesLogCount() > baselineCount) {
      return
    }
  }
}

export function invalidateApiQueries() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.api.all })
}

/** User SIWE session became active — refresh API + wallet-scoped chain reads. */
export function invalidateAfterAuthLogin(address?: string) {
  void invalidateApiQueries()
  invalidatePresaleChainQueries(address)

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referral(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.walletBalances(address) })
}

/** Genesis phase start/end boundary crossed — refresh presale + authenticated API. */
export function invalidateAfterGenesisPhaseTransition(address?: string) {
  invalidatePresaleChainQueries(address)
  void invalidateApiQueries()
}

export function clearApiQueries() {
  return queryClient.removeQueries({ queryKey: queryKeys.api.all })
}

export function invalidatePresaleChainQueries(address?: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presalePhases })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleActivePhase })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleAgxPrice })

  if (!address) return

  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.presaleUserTotal(address) })
  void queryClient.invalidateQueries({ queryKey: ['chain', 'erc20'] })
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.walletBalances(address) })
}

export function invalidateAfterSwap(address: string, sellToken: string, buyToken: string) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.swapBalances(address, sellToken, buyToken),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.chain.walletBalances(address),
  })
}

export function invalidateAfterGenesisPurchase(address: string, purchaseAmount?: bigint) {
  if (purchaseAmount && purchaseAmount > 0n) {
    queryClient.setQueryData(queryKeys.chain.presaleUserTotal(address), (current?: bigint) => {
      const base = typeof current === 'bigint' ? current : 0n
      return base + purchaseAmount
    })
  }

  const salesLogBaseline = readSalesLogCount()
  invalidatePresaleChainQueries(address)
  void invalidateApiQueries()
  void pollGenesisContributions(salesLogBaseline)
}

export function invalidateAfterTeamClaim() {
  void queryClient.invalidateQueries({ queryKey: queryKeys.api.teamRewardTotal })
  void queryClient.invalidateQueries({ queryKey: queryKeys.api.rewardLogs() })
}

export function invalidateAfterReferralBind(address: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.chain.referral(address) })
  void queryClient.invalidateQueries({ queryKey: queryKeys.api.performance })
  void queryClient.invalidateQueries({ queryKey: queryKeys.api.referralTotal })
  void queryClient.invalidateQueries({ queryKey: queryKeys.api.teamReferrals() })
}
