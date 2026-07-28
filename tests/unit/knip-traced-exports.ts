/**
 * Knip entry only — static imports for symbols reached solely via dynamic
 * `loadModule()` in unit tests (knip cannot follow those string paths).
 * Not imported by production code or by the test runner.
 */
export { resolveXTokenAirdropUsdForPurchase } from '../../src/core/presale/presale-math'
export { ClaimSplitSlider, claimSplitFromReleasePct } from '../../src/shared/ui/claim-split-slider'
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
export { readWalletSession } from '../../src/views/dapp/auth/login-with-wallet'
export { createMemoryAuthSessionStorage } from '../../src/views/dapp/auth/session'
export { clearExchangePoolImmutableCache } from '../../src/web3/exchange/read-exchange-pool'
export { resetUnknownReceiptLocksForTests } from '../../src/web3/wallet/unknown-receipt-lock'
