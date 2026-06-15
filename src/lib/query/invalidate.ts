import { queryClient } from './query-client'
import { queryKeys } from './query-keys'

export function invalidateApiQueries() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.api.all })
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

export function invalidateAfterGenesisPurchase(address: string) {
  invalidatePresaleChainQueries(address)
  void invalidateApiQueries()
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
