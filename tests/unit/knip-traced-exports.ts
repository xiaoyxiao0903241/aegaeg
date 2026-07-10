/**
 * Knip entry only — static imports for symbols reached solely via dynamic
 * `loadModule()` in unit tests (knip cannot follow those string paths).
 * Not imported by production code or by the test runner.
 */
export { resolveXTokenAirdropUsdForPurchase } from '../../src/core/presale/presale-math'
export { resetAccountBannedReportCooldownForTests } from '../../src/shared/api/account-banned'
export {
  BREAKPOINT_DESIGN_BASE_PX,
  BREAKPOINT_NARROW_MAX_PX,
  BREAKPOINT_TABLET_MAX_PX,
  BREAKPOINT_ULTRA_WIDE_SCALE,
} from '../../src/shared/config/breakpoints'
export { readWalletSession } from '../../src/views/dapp/auth/login-with-wallet'
export { createMemoryAuthSessionStorage } from '../../src/views/dapp/auth/session'
export { clearSwapPoolImmutableCache } from '../../src/views/dapp/web3/read-swap-pool'
