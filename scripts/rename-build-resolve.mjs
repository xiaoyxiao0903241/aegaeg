#!/usr/bin/env node
/**
 * Mechanical rename: drop lead build/resolve verbs and gate metaphors from product symbols.
 * Run from repo root. Does not touch ABI/backend JSON field names or CoBuild product paths.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

/** Longer names first to avoid partial collisions. */
const RENAMES = [
  // ── gate → block (longest first) ──────────────────────────────────────────
  ['evaluateXmineActivateWarmupGate', 'evaluateXmineActivateWarmup'],
  ['evaluateRewardsSimpleClaimGate', 'evaluateRewardsSimpleClaim'],
  ['evaluateRewardsMixedClaimGate', 'evaluateRewardsMixedClaim'],
  ['evaluateGenesisPostApproveGate', 'evaluateGenesisPostApprove'],
  ['evaluateBondZapLiveGate', 'evaluateBondZapLive'],
  ['evaluateXmineUnstakeGate', 'evaluateXmineUnstake'],
  ['evaluateXmineClaimGate', 'evaluateXmineClaim'],
  ['evaluateXmineLiveGate', 'evaluateXmineLive'],
  ['evaluateMixedClaimGate', 'evaluateMixedClaim'],
  ['evaluateStakeLiveGate', 'evaluateStakeLive'],
  ['evaluateRedeemGate', 'evaluateRedeem'],
  ['XmineActivateWarmupGateReason', 'XmineActivateWarmupBlockReason'],
  ['BurnContributionSwapGateReason', 'BurnContributionSwapBlockReason'],
  ['RewardsSimpleClaimGateReason', 'RewardsSimpleClaimBlockReason'],
  ['RewardsMixedGateReason', 'RewardsMixedBlockReason'],
  ['FlashUsd1SwapGateReason', 'FlashUsd1SwapBlockReason'],
  ['BondZapLiveGateReason', 'BondZapLiveBlockReason'],
  ['MigrationUserGateReason', 'MigrationUserBlockReason'],
  ['GenesisPostApproveGate', 'GenesisPostApprove'],
  ['MixedClaimGateReason', 'MixedClaimBlockReason'],
  ['XmineClaimGateReason', 'XmineClaimBlockReason'],
  ['XmineLiveGateReason', 'XmineLiveBlockReason'],
  ['StakeLiveGateReason', 'StakeLiveBlockReason'],
  ['RedeemGateReason', 'RedeemBlockReason'],
  ['DualGateMixedClaimResult', 'DualCheckMixedClaimResult'],
  ['burnContributionSwapGateBlocksSubmit', 'burnContributionSwapBlocksSubmit'],
  ['fetchLiveGenesisPostApproveGate', 'fetchLiveGenesisPostApprove'],
  ['dualGateMixedClaim', 'dualCheckMixedClaim'],
  ['genesisPurchaseGate', 'genesisPurchaseBlock'],
  ['resolveFlashUsd1SwapGate', 'evaluateFlashUsd1Swap'],
  ['resolveBurnContributionSwapGate', 'evaluateBurnContributionSwap'],
  ['resolveMigrationUserGate', 'evaluateMigrationUser'],
  ['EXCHANGE_SUBMIT_GATE_FAILED', 'EXCHANGE_SUBMIT_BLOCKED'],
  ['FLASH_USD1_GATE_ERROR', 'FLASH_USD1_BLOCKED'],
  ['BOND_ZAP_GATE_ERROR', 'BOND_ZAP_BLOCKED'],
  ['WALLET_GATE_ERROR', 'WALLET_BLOCKED'],
  ['ASSETS_GATE_ERROR', 'ASSETS_BLOCKED'],
  ['RELEASE_GATE_ERROR', 'RELEASE_BLOCKED'],
  ['REWARDS_GATE_ERROR', 'REWARDS_BLOCKED'],
  ['STAKING_GATE_ERROR', 'STAKING_BLOCKED'],
  ['XMINE_GATE_ERROR', 'XMINE_BLOCKED'],
  ['BURN_GATE_ERROR', 'BURN_BLOCKED'],
  ['preGate', 'preBlock'],
  ['liveGate', 'liveBlock'],

  // ── auth / login ──────────────────────────────────────────────────────────
  ['buildSiweLoginMessage', 'siweLoginMessage'],
  ['buildSimpleLoginMessage', 'simpleLoginMessage'],
  ['buildLoginMessage', 'loginMessage'],
  ['resolveLoginMessageFormats', 'loginMessageFormats'],
  ['resolveLoginMessageFormat', 'loginMessageFormat'],
  ['buildLoginAttemptKey', 'loginAttemptKey'],
  ['resolveAuthStatus', 'authStatus'],
  ['resolveAuthLoginErrorMessage', 'authLoginErrorMessage'],
  ['resolveLoginToastMessage', 'loginToastMessage'],
  ['resolveSessionRenewAtMs', 'sessionRenewAtMs'],

  // ── genesis / presale ─────────────────────────────────────────────────────
  ['buildGenesisFaqTemplateValues', 'genesisFaqTemplateValues'],
  ['buildGenesisWidgetModel', 'genesisPurchaseSummary'],
  ['buildGenesisPromoSnapshot', 'genesisPromoSnapshot'],
  ['buildSeasonOptions', 'seasonOptionsFromPhases'],
  ['buildRewardTierRows', 'rewardTierRows'],
  ['buildNextTierProgress', 'nextTierProgress'],
  ['buildPhaseCountdownKey', 'phaseCountdownKey'],
  ['resolveCommitmentFloorBoostCopy', 'commitmentFloorBoostCopy'],
  ['resolveCommitmentFloorRank', 'commitmentFloorRank'],
  ['resolveDisplayPresaleRank', 'displayPresaleRank'],
  ['resolveNextPresaleRank', 'nextPresaleRank'],
  ['resolveRemainingPhaseAmount', 'remainingPhaseAmount'],
  ['resolveRemainingUserAmount', 'remainingUserAmount'],
  ['resolveSharePriceWei', 'sharePriceWei'],
  ['resolveShareIncrement', 'shareIncrement'],
  ['resolveGenesisMaxShares', 'genesisMaxShares'],
  ['resolvePhaseCountdownTarget', 'phaseCountdownTarget'],
  ['resolvePhaseDiscountBps', 'phaseDiscountBps'],
  ['resolveXTokenAirdropUsdForPurchase', 'xTokenAirdropUsdForPurchase'],
  ['resolveFeaturedPhaseIndex', 'featuredPhaseIndex'],
  ['resolveSeasonCarouselScrollIndex', 'seasonCarouselScrollIndex'],
  ['resolveMinUsd', 'minUsd'],

  // ── exchange ──────────────────────────────────────────────────────────────
  ['resolveNeedReferral', 'evaluateNeedReferral'],
  ['resolveWriteButtonPhase', 'evaluateWriteButtonPhase'],
  ['resolveClaimRewardOutcome', 'claimRewardOutcome'],
  ['resolveLiveQuotedOut', 'liveQuotedOut'],
  ['resolveTradePath', 'tradePath'],
  ['resolveBuyKeyAfterSellChange', 'buyKeyAfterSellChange'],
  ['resolveAgxSellTaxBps', 'agxSellTaxBps'],
  ['resolveCappedTokenAmountRaw', 'cappedTokenAmountRaw'],
  ['buildExchangeDeadline', 'exchangeDeadline'],
  ['resolvePairReservesForTokenIn', 'pairReservesForTokenIn'],
  ['resolveTokenAmountOptions', 'tokenAmountOptions'],
  ['resolveZapPrincipleAmount', 'zapPrincipleAmount'],
  ['buildPancakeSwapUrl', 'pancakeSwapUrl'],
  ['buildWriteCallParams', 'writeCallParams'],

  // ── staking addresses / keys ──────────────────────────────────────────────
  ['resolveBurnBondDepositoryKey', 'burnBondDepositoryKey'],
  ['resolveLpBondDepositoryKey', 'lpBondDepositoryKey'],
  ['resolveStakePoolKey', 'stakePoolKey'],
  ['resolveBurnBondDepository', 'burnBondDepositoryAddress'],
  ['resolveLpBondDepository', 'lpBondDepositoryAddress'],
  ['resolveStakePoolAddress', 'stakePoolAddress'],
  ['resolveDepository', 'depositoryAddress'],

  // ── wallet / chain ────────────────────────────────────────────────────────
  ['resolveWalletEip1193Provider', 'walletEip1193Provider'],
  ['resolveLegacyInjectedProvider', 'legacyInjectedProvider'],
  ['resolveWalletTransactionError', 'walletTransactionError'],
  ['resolveWalletRemountKey', 'walletRemountKey'],
  ['resolveChainReadClient', 'chainReadClient'],
  ['resolveChainQueryEnabled', 'chainQueryEnabled'],

  // ── navigation / links / config / display ─────────────────────────────────
  ['resolveDappLocationFromHash', 'dappLocationFromHash'],
  ['resolveTabFromHash', 'tabFromHash'],
  ['resolvePancakeSwapDeepLink', 'pancakeSwapDeepLink'],
  ['resolveDisplayReferrer', 'displayReferrer'],
  ['buildReferralSharePath', 'referralSharePath'],
  ['resolveNotionLink', 'notionLink'],
  ['resolveCommunitySocialLink', 'communitySocialLink'],
  ['buildCommunityQuickLinkItems', 'communityQuickLinkItems'],
  ['resolveNavigableHref', 'navigableHref'],
  ['resolveVisibleTourTarget', 'visibleTourTarget'],
  ['resolveBrowserLocale', 'browserLocale'],
  ['resolveFooterLinkHref', 'footerLinkHref'],
  ['resolveMenuPlacement', 'menuPlacement'],
  ['resolveMenuStyle', 'menuStyle'],
  ['resolveCommunityFundLogStatusKey', 'communityFundLogStatusKey'],
  ['resolveRewardLogStatusKey', 'rewardLogStatusKey'],
  ['resolveTeamRewardClaimStatusKey', 'teamRewardClaimStatusKey'],
  ['buildRayWedgePath', 'rayWedgePath'],
  ['buildSteps', 'onboardingSteps'],

  // ── api infra ─────────────────────────────────────────────────────────────
  ['resolveApiUserFacingError', 'apiUserFacingError'],
  ['resolveApiBaseUrl', 'apiBaseUrl'],
  ['buildApiClientUrl', 'apiClientUrl'],
  ['buildApiUrl', 'apiUrl'],
  ['resolveFirstMatch', 'firstMatch'],
  ['resolveContractErrorMessage', 'contractErrorMessage'],
]

/** Path / basename segments (kebab). Longer first. Avoid bare "gate" / "gates" alone. */
const PATH_RENAMES = [
  ['fetch-live-genesis-post-approve-gate', 'fetch-live-genesis-post-approve'],
  ['build-genesis-widget-model', 'shared'],
  ['build-login-message', 'login-message'],
  ['resolve-migration-user-gate', 'migration-user'],
  ['migration-user-gate', 'migration-user'],
  ['resolve-need-referral', 'need-referral'],
  ['resolve-write-button-phase', 'write-button-phase'],
  ['resolve-chain-query-enabled', 'chain-query-enabled'],
  ['resolve-claim-reward-outcome', 'claim-reward-outcome'],
  ['resolve-live-quoted-out', 'live-quoted-out'],
  ['resolve-trade-path', 'trade-path'],
  ['build-exchange-deadline', 'exchange-deadline'],
  ['resolve-auth-status', 'auth-status'],
  ['resolve-api-base-url', 'api-base-url'],
  ['resolve-api-user-facing-error', 'api-user-facing-error'],
  ['resolve-wallet-remount-key', 'wallet-remount-key'],
  ['resolve-wallet-eip1193-provider', 'wallet-eip1193-provider'],
  ['resolve-staking-addresses', 'staking-addresses'],
  ['resolve-contract-error-message', 'contract-error-message'],
  ['dual-gate-mixed-claim', 'dual-check-mixed-claim'],
  ['burn-contribution-swap-gates', 'burn-contribution-swap'],
  ['flash-usd1-swap-gates', 'flash-usd1-swap'],
  ['live-post-approve-gates', 'live-post-approve'],
  ['xmine-activate-warmup-gate', 'xmine-activate-warmup'],
  ['assets-write-gate-errors', 'assets-write-block-errors'],
  ['exchange-write-gate-errors', 'exchange-write-block-errors'],
  ['release-write-gate-errors', 'release-write-block-errors'],
  ['rewards-write-gate-errors', 'rewards-write-block-errors'],
  ['staking-write-gate-errors', 'staking-write-block-errors'],
  ['assets-gates', 'assets-block-reasons'],
  ['release-gates', 'release-block-reasons'],
  ['rewards-gates', 'rewards-block-reasons'],
  ['staking-gates', 'staking-block-reasons'],
  ['react-quality-gates', 'react-quality-checks'],
]

const FILE_MOVES = [
  ['src/views/dapp/genesis/build-genesis-widget-model.ts', 'src/views/dapp/genesis/shared.tsx'],
  [
    'src/views/dapp/genesis/fetch-live-genesis-post-approve-gate.ts',
    'src/views/dapp/genesis/fetch-live-genesis-post-approve.ts',
  ],
  ['src/web3/auth/build-login-message.ts', 'src/web3/auth/login-message.ts'],
  ['src/web3/resolve-contract-error-message.ts', 'src/web3/contract-error-message.ts'],
  ['src/core/migration/resolve-migration-user-gate.ts', 'src/core/migration/migration-user.ts'],
  ['src/core/referral/resolve-need-referral.ts', 'src/core/referral/need-referral.ts'],
  ['src/core/wallet/resolve-write-button-phase.ts', 'src/core/wallet/write-button-phase.ts'],
  ['src/core/wallet/resolve-chain-query-enabled.ts', 'src/core/wallet/chain-query-enabled.ts'],
  ['src/core/rewards/resolve-claim-reward-outcome.ts', 'src/core/rewards/claim-reward-outcome.ts'],
  ['src/core/exchange/resolve-live-quoted-out.ts', 'src/core/exchange/live-quoted-out.ts'],
  ['src/core/exchange/resolve-trade-path.ts', 'src/core/exchange/trade-path.ts'],
  ['src/core/exchange/build-exchange-deadline.ts', 'src/core/exchange/exchange-deadline.ts'],
  ['src/core/exchange/flash-usd1-swap-gates.ts', 'src/core/exchange/flash-usd1-swap.ts'],
  [
    'src/core/exchange/burn-contribution-swap-gates.ts',
    'src/core/exchange/burn-contribution-swap.ts',
  ],
  ['src/core/auth/resolve-auth-status.ts', 'src/core/auth/auth-status.ts'],
  ['src/core/assets/assets-gates.ts', 'src/core/assets/assets-block-reasons.ts'],
  ['src/core/assets/dual-gate-mixed-claim.ts', 'src/core/assets/dual-check-mixed-claim.ts'],
  ['src/core/release/release-gates.ts', 'src/core/release/release-block-reasons.ts'],
  ['src/core/rewards/rewards-gates.ts', 'src/core/rewards/rewards-block-reasons.ts'],
  ['src/core/staking/staking-gates.ts', 'src/core/staking/staking-block-reasons.ts'],
  ['src/shared/api/resolve-api-base-url.ts', 'src/shared/api/api-base-url.ts'],
  ['src/shared/api/resolve-api-user-facing-error.ts', 'src/shared/api/api-user-facing-error.ts'],
  ['src/shared/lib/resolve-wallet-remount-key.ts', 'src/shared/lib/wallet-remount-key.ts'],
  [
    'src/web3/wallet/resolve-wallet-eip1193-provider.ts',
    'src/web3/wallet/wallet-eip1193-provider.ts',
  ],
  ['src/web3/staking/resolve-staking-addresses.ts', 'src/web3/staking/staking-addresses.ts'],
  ['src/web3/errors/assets-write-gate-errors.ts', 'src/web3/errors/assets-write-block-errors.ts'],
  [
    'src/web3/errors/exchange-write-gate-errors.ts',
    'src/web3/errors/exchange-write-block-errors.ts',
  ],
  ['src/web3/errors/release-write-gate-errors.ts', 'src/web3/errors/release-write-block-errors.ts'],
  ['src/web3/errors/rewards-write-gate-errors.ts', 'src/web3/errors/rewards-write-block-errors.ts'],
  ['src/web3/errors/staking-write-gate-errors.ts', 'src/web3/errors/staking-write-block-errors.ts'],
  ['tests/unit/build-login-message.test.mjs', 'tests/unit/login-message.test.mjs'],
  ['tests/unit/resolve-api-base-url.test.mjs', 'tests/unit/api-base-url.test.mjs'],
  [
    'tests/unit/resolve-api-user-facing-error.test.mjs',
    'tests/unit/api-user-facing-error.test.mjs',
  ],
  ['tests/unit/resolve-need-referral.test.mjs', 'tests/unit/need-referral.test.mjs'],
  ['tests/unit/resolve-write-button-phase.test.mjs', 'tests/unit/write-button-phase.test.mjs'],
  ['tests/unit/resolve-migration-user-gate.test.mjs', 'tests/unit/migration-user.test.mjs'],
  ['tests/unit/resolve-claim-reward-outcome.test.mjs', 'tests/unit/claim-reward-outcome.test.mjs'],
  ['tests/unit/resolve-chain-query-enabled.test.mjs', 'tests/unit/chain-query-enabled.test.mjs'],
  ['tests/unit/resolve-trade-path.test.mjs', 'tests/unit/trade-path.test.mjs'],
  [
    'tests/unit/resolve-contract-error-message.test.mjs',
    'tests/unit/contract-error-message.test.mjs',
  ],
  ['tests/unit/assets-gates.test.mjs', 'tests/unit/assets-block-reasons.test.mjs'],
  ['tests/unit/dual-gate-mixed-claim.test.mjs', 'tests/unit/dual-check-mixed-claim.test.mjs'],
  [
    'tests/unit/burn-contribution-swap-gates.test.mjs',
    'tests/unit/burn-contribution-swap.test.mjs',
  ],
  ['tests/unit/flash-usd1-swap-gates.test.mjs', 'tests/unit/flash-usd1-swap.test.mjs'],
  ['tests/unit/live-post-approve-gates.test.mjs', 'tests/unit/live-post-approve.test.mjs'],
  ['tests/unit/release-gates.test.mjs', 'tests/unit/release-block-reasons.test.mjs'],
  ['tests/unit/rewards-gates.test.mjs', 'tests/unit/rewards-block-reasons.test.mjs'],
  ['tests/unit/staking-gates.test.mjs', 'tests/unit/staking-block-reasons.test.mjs'],
  ['tests/unit/xmine-activate-warmup-gate.test.mjs', 'tests/unit/xmine-activate-warmup.test.mjs'],
  ['tests/unit/react-quality-gates.test.mjs', 'tests/unit/react-quality-checks.test.mjs'],
]

/** i18n nested keys: messages.*.gates → messages.*.blocked */
const I18N_KEY_RENAMES = [
  ['.gates.', '.blocked.'],
  ['gates:', 'blocked:'],
]

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      ent.name === 'node_modules' ||
      ent.name === 'dist' ||
      ent.name === '.git' ||
      ent.name === '.codegraph'
    )
      continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|mjs|js|cjs|md|json)$/.test(ent.name)) out.push(p)
  }
  return out
}

function renameInText(text) {
  let next = text
  for (const [from, to] of RENAMES) {
    next = next.replaceAll(from, to)
  }
  return next
}

const dirs = ['src', 'tests', 'docs', 'scripts'].map((d) => path.join(ROOT, d))
const files = dirs.flatMap((d) => walk(d))

let contentTouches = 0
for (const file of files) {
  // Do not rewrite this script's own RENAMES table mid-flight via PATH on itself twice
  if (file.endsWith('rename-build-resolve.mjs')) continue
  const raw = fs.readFileSync(file, 'utf8')
  let next = renameInText(raw)
  for (const [from, to] of PATH_RENAMES) {
    next = next.replaceAll(from, to)
  }
  if (
    file.includes(`${path.sep}i18n${path.sep}`) ||
    file.includes(`${path.sep}messages${path.sep}`)
  ) {
    for (const [from, to] of I18N_KEY_RENAMES) {
      next = next.replaceAll(from, to)
    }
  }
  // error-messages and views that reference t.*.gates
  if (
    next.includes('.gates.') ||
    next.includes('t.staking.gates') ||
    next.includes('t.assets.gates')
  ) {
    next = next.replaceAll('.gates.', '.blocked.')
  }
  if (next !== raw) {
    fs.writeFileSync(file, next)
    contentTouches++
  }
}

console.log(`content files touched: ${contentTouches}`)

let moved = 0
for (const [from, to] of FILE_MOVES) {
  const absFrom = path.join(ROOT, from)
  const absTo = path.join(ROOT, to)
  if (!fs.existsSync(absFrom)) {
    if (fs.existsSync(absTo)) {
      console.log(`skip (already moved): ${from}`)
      continue
    }
    console.warn(`missing: ${from}`)
    continue
  }
  fs.mkdirSync(path.dirname(absTo), { recursive: true })
  fs.renameSync(absFrom, absTo)
  moved++
  console.log(`moved: ${from} => ${to}`)
}
console.log(`files moved: ${moved}`)
