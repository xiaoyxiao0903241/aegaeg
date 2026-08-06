/**
 * Knip entry only — static imports for symbols reached solely via dynamic
 * `loadModule()` in unit tests (knip cannot follow those string paths).
 * Not imported by production code or by the test runner.
 */
export { claimSplitFromReleasePct } from '../../src/core/assets/claim-plans'
export { xTokenAirdropUsdForPurchase } from '../../src/core/presale/presale-math'
export { nextTierProgress } from '../../src/core/presale/tier-progress'
export {
  commitmentFloorBoostCopy,
  commitmentFloorRank,
  getCommitmentFloorPostLaunchLabel,
  rewardTierRows,
} from '../../src/core/presale/tier-table'
export { resetAccountBannedReportCooldownForTests } from '../../src/shared/api/account-banned'
export {
  getCommunityFundLogs,
  getQualifiedPartitions,
  getReferralTotal,
  getRewardLogs,
  getTeamRewardClaimLogs,
  parseClaimSignature,
  searchPerformance,
} from '../../src/shared/api/endpoints'
export { ClaimSplitSlider } from '../../src/shared/components/claim-split-slider'
export {
  isSegmentOptionEnabled,
  Segment,
  SEGMENT_MOTION_EASING,
  SEGMENT_MOTION_MS,
  segmentPillThumbStyle,
} from '../../src/shared/components/segment'
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
export {
  formatApiDateTime,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '../../src/shared/presenters/format'
export {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
} from '../../src/views/dapp/rewards/shared'
export { useShareholderRankLabels } from '../../src/views/dapp/rewards/use-shareholder-rank-labels'
export { readWalletSession } from '../../src/web3/auth/login-with-wallet'
export { createMemoryAuthSessionStorage } from '../../src/web3/auth/session'
export { clearExchangePoolImmutableCache } from '../../src/web3/exchange/read-exchange-pool'
export {
  rehydrateUnknownReceiptLocksForTests,
  resetUnknownReceiptLocksForTests,
} from '../../src/web3/wallet/unknown-receipt-lock'
/** CommunityFund signed claim — genesis 发展基金 only; referral uses Dao Mixed REFERRAL_REWARD. */
export {
  useAgxContributionBurnLogs,
  useAgxContributionConsumeLogs,
  useMakingOverview,
  useSearchPerformance,
} from '../../src/hooks/use-api-data'
export type { LuckyRewardWinnersRequest } from '../../src/shared/api/types'
export { claimCommunityFund } from '../../src/web3/claim/claim-reward'
/** Stake liquid warmup claim — UI entry DEFER; keep write for knip + money-path. */
export { submitLiquidWarmupClaim } from '../../src/views/dapp/staking/stake/submit-stake'
