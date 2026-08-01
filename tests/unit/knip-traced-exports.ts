/**
 * Knip entry only — static imports for symbols reached solely via dynamic
 * `loadModule()` in unit tests (knip cannot follow those string paths).
 * Not imported by production code or by the test runner.
 */
export { xTokenAirdropUsdForPurchase } from '../../src/core/presale/presale-math'
export { ClaimSplitSlider } from '../../src/shared/ui/claim-split-slider'
export { claimSplitFromReleasePct } from '../../src/core/assets/claim-plans'
export {
  SEGMENT_MOTION_EASING,
  SEGMENT_MOTION_MS,
  SEGMENT_PILL_GAP_PX,
  SEGMENT_PILL_PAD_PX,
  Segment,
  isSegmentOptionEnabled,
  segmentPillThumbStyle,
} from '../../src/shared/ui/segment'
export { resetAccountBannedReportCooldownForTests } from '../../src/shared/api/account-banned'
export {
  BREAKPOINT_DESIGN_BASE_PX,
  BREAKPOINT_FLUID_MAX_ROOT_PX,
  BREAKPOINT_FLUID_MAX_SCALE,
  BREAKPOINT_FLUID_MAX_WIDTH_PX,
  BREAKPOINT_FLUID_MIN_ROOT_PX,
  BREAKPOINT_NARROW_MAX_PX,
  BREAKPOINT_TABLET_MAX_PX,
  BREAKPOINT_ULTRA_WIDE_SCALE,
} from '../../src/shared/config/breakpoints'
export { readWalletSession } from '../../src/web3/auth/login-with-wallet'
export { createMemoryAuthSessionStorage } from '../../src/web3/auth/session'
export { clearExchangePoolImmutableCache } from '../../src/web3/exchange/read-exchange-pool'
export { resetUnknownReceiptLocksForTests } from '../../src/web3/wallet/unknown-receipt-lock'

export {
  rewardTierRows,
  getCommitmentFloorPostLaunchLabel,
  commitmentFloorBoostCopy,
  commitmentFloorRank,
} from '../../src/core/presale/tier-table'
export { nextTierProgress } from '../../src/core/presale/tier-progress'
export {
  formatApiDateTime,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '../../src/shared/api/format-display'
export {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
} from '../../src/views/dapp/rewards/rewards-display'
export { useShareholderRankLabels } from '../../src/views/dapp/rewards/use-shareholder-rank-labels'
export {
  getCommunityFundLogs,
  getQualifiedPartitions,
  getReferralTotal,
  getRewardLogs,
  getTeamRewardClaimLogs,
  parseClaimSignature,
  searchPerformance,
} from '../../src/shared/api/endpoints'
/** CommunityFund signed claim — genesis 发展基金 only; referral uses Dao Mixed REFERRAL_REWARD. */
export { claimCommunityFund } from '../../src/web3/claim/claim-reward'
export {
  useAgxContributionBurnLogs,
  useAgxContributionConsumeLogs,
  useMakingOverview,
  useSearchPerformance,
} from '../../src/hooks/use-api-data'
export type { LuckyRewardWinnersRequest } from '../../src/shared/api/types'
