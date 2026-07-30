import { queryKeys } from '~/shared/api/query/query-keys'
import type { DappTab } from '~/shared/config/dapp-tabs'

/** Per-tab query root prefixes — shared by invalidate + prefetch. */
export const TAB_QUERY_KEYS: Record<DappTab, readonly (readonly string[])[]> = {
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
    queryKeys.chain.presalePaused,
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
    queryKeys.chain.rewardsRoot,
    queryKeys.chain.assetsRoot,
    queryKeys.chain.erc20Root,
  ],
  community: [
    queryKeys.api.teamOverview,
    queryKeys.api.teamReferralsRoot,
    queryKeys.api.referralTotal,
    queryKeys.api.performance,
    queryKeys.chain.referralRoot,
  ],
  exchange: [
    queryKeys.chain.swapRoot,
    queryKeys.chain.erc20Root,
    queryKeys.chain.flashSwapRoot,
    queryKeys.chain.burnSwapRoot,
    queryKeys.chain.turbineRoot,
  ],
  assets: [
    queryKeys.chain.assetsRoot,
    queryKeys.chain.stakingRoot,
    queryKeys.chain.erc20Root,
    queryKeys.chain.burnSwapRoot,
  ],
  staking: [queryKeys.chain.stakingRoot, queryKeys.chain.erc20Root, queryKeys.chain.referralRoot],
  release: [queryKeys.chain.releaseRoot, queryKeys.chain.erc20Root, queryKeys.chain.turbineRoot],
}
