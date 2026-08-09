/**
 * Knip entry only — static imports for symbols reached solely via dynamic
 * `loadModule()` in unit tests (knip cannot follow those string paths).
 * Not imported by production code or by the test runner.
 *
 * Only list symbols that have zero static `import` from `src/`.
 * If production already imports a symbol, knip sees it — do not add it here.
 */
export { xTokenAirdropUsdForPurchase } from '../../src/core/presale/presale-math'
export {
  commitmentFloorBoostCopy,
  commitmentFloorRank,
  getCommitmentFloorPostLaunchLabel,
} from '../../src/core/presale/tier-table'
export { resetAccountBannedReportCooldownForTests } from '../../src/shared/api/account-banned'
export {
  isSegmentOptionEnabled,
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
export { createMemoryAuthSessionStorage } from '../../src/web3/auth/session'
export { clearExchangePoolImmutableCache } from '../../src/web3/exchange/read-exchange-pool'
export {
  rehydrateUnknownReceiptLocksForTests,
  resetUnknownReceiptLocksForTests,
} from '../../src/web3/wallet/unknown-receipt-lock'
