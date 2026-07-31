import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { ASSETS_GATE_ERROR } from '~/web3/errors/assets-write-gate-errors'
import { BURN_GATE_ERROR } from '~/web3/errors/exchange-write-gate-errors'
import {
  type ErrorText,
  hasSelector,
  nameOrSelector,
  readErrorCode,
  toErrorText,
} from '~/web3/errors/error-text'
import { RELEASE_GATE_ERROR } from '~/web3/errors/release-write-gate-errors'
import { REWARDS_GATE_ERROR } from '~/web3/errors/rewards-write-gate-errors'
import {
  CLAIM_CONFIRM_SYNC_FAILED,
  EXCHANGE_QUOTE_FAILED,
  EXCHANGE_SUBMIT_GATE_FAILED,
  FLASH_USD1_GATE_ERROR,
  GENESIS_PURCHASE_ERROR,
  REFERRAL_BIND_ERROR,
  WALLET_GATE_ERROR,
  WALLET_WRITE_ERROR,
} from '~/web3/errors/sentinels'
import {
  BOND_ZAP_GATE_ERROR,
  STAKING_GATE_ERROR,
  XMINE_GATE_ERROR,
} from '~/web3/errors/staking-write-gate-errors'

type MessageFn = (t: AppMessagesBundle) => string

/**
 * Exact soft-gate / domain sentinels → i18n.
 * Soft gates stay locale-free strings; user messages live only here.
 */
export const SENTINEL_MESSAGES: Record<string, MessageFn> = {
  // —— staking / bond / xmine ——
  [STAKING_GATE_ERROR.accountMigrated]: (t) => t.staking.gates.accountMigrated,
  [BOND_ZAP_GATE_ERROR.accountMigrated]: (t) => t.staking.gates.accountMigrated,
  [STAKING_GATE_ERROR.notBound]: (t) => t.staking.gates.notBound,
  [BOND_ZAP_GATE_ERROR.notBound]: (t) => t.staking.gates.notBound,
  [STAKING_GATE_ERROR.insufficientBalance]: (t) => t.staking.gates.insufficientBalance,
  [BOND_ZAP_GATE_ERROR.insufficientBalance]: (t) => t.staking.gates.insufficientBalance,
  [XMINE_GATE_ERROR.insufficientBalance]: (t) => t.staking.gates.insufficientGagx,
  [STAKING_GATE_ERROR.insufficientAllowance]: (t) => t.staking.gates.insufficientAllowance,
  [BOND_ZAP_GATE_ERROR.insufficientAllowance]: (t) => t.staking.gates.insufficientAllowance,
  [XMINE_GATE_ERROR.insufficientAllowance]: (t) => t.staking.gates.insufficientAllowance,
  [STAKING_GATE_ERROR.insufficientQuota]: (t) => t.staking.gates.insufficientQuota,
  [XMINE_GATE_ERROR.insufficientQuota]: (t) => t.staking.gates.insufficientQuota,
  [STAKING_GATE_ERROR.poolPaused]: (t) => t.staking.gates.poolPaused,
  [BOND_ZAP_GATE_ERROR.depositoryNotAuth]: (t) => t.staking.gates.depositoryNotAuth,
  [STAKING_GATE_ERROR.zeroAmount]: (t) => t.staking.gates.zeroAmount,
  [BOND_ZAP_GATE_ERROR.zeroAmount]: (t) => t.staking.gates.zeroAmount,
  [XMINE_GATE_ERROR.zeroAmount]: (t) => t.staking.gates.zeroAmount,
  [STAKING_GATE_ERROR.unavailable]: (t) => t.staking.gates.unavailable,
  [BOND_ZAP_GATE_ERROR.unavailable]: (t) => t.staking.gates.unavailable,
  [XMINE_GATE_ERROR.unavailable]: (t) => t.staking.gates.unavailable,

  // —— assets ——
  [ASSETS_GATE_ERROR.zeroAmount]: (t) => t.assets.gates.zeroAmount,
  [ASSETS_GATE_ERROR.insufficientReward]: (t) => t.assets.gates.insufficientReward,
  [ASSETS_GATE_ERROR.insufficientContribution]: (t) => t.assets.gates.insufficientContribution,
  [ASSETS_GATE_ERROR.releasePlanUnresolved]: (t) => t.assets.gates.planUnresolved,
  [ASSETS_GATE_ERROR.restakePlanUnresolved]: (t) => t.assets.gates.planUnresolved,
  [ASSETS_GATE_ERROR.nothingToRedeem]: (t) => t.assets.gates.nothingToRedeem,
  [ASSETS_GATE_ERROR.warmupActive]: (t) => t.assets.gates.warmupActive,
  [ASSETS_GATE_ERROR.warmupNotEnded]: (t) => t.assets.gates.warmupNotEnded,
  [ASSETS_GATE_ERROR.noWarmup]: (t) => t.assets.gates.noWarmup,
  [ASSETS_GATE_ERROR.unavailable]: (t) => t.assets.gates.unavailable,

  // —— release ——
  [RELEASE_GATE_ERROR.zeroAmount]: (t) => t.assets.gates.zeroAmount,
  [RELEASE_GATE_ERROR.planUnresolved]: (t) => t.assets.gates.planUnresolved,
  [RELEASE_GATE_ERROR.lockedUnknown]: (t) => t.assets.gates.unavailable,
  [RELEASE_GATE_ERROR.unavailable]: (t) => t.assets.gates.unavailable,

  // —— rewards soft gates ——
  [REWARDS_GATE_ERROR.insufficientContribution]: (t) => t.rewards.mixed.insufficientContribution,
  [REWARDS_GATE_ERROR.luckyPaused]: (t) => t.rewards.mixed.luckyPaused,
  [REWARDS_GATE_ERROR.luckyNotClaimable]: (t) => t.rewards.mixed.luckyNotClaimable,
  [REWARDS_GATE_ERROR.zeroAmount]: (t) => t.rewards.claimErrors.zeroAmount,
  [REWARDS_GATE_ERROR.signatureExpired]: (t) => t.rewards.claimErrors.expired,
  [REWARDS_GATE_ERROR.insufficientReward]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_GATE_ERROR.releasePlanUnresolved]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_GATE_ERROR.restakePlanUnresolved]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_GATE_ERROR.unavailable]: (t) => t.rewards.claimErrors.failed,
  [CLAIM_CONFIRM_SYNC_FAILED]: (t) =>
    t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimErrors.failed,

  // —— genesis soft gates ——
  [GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1]: (t) => t.genesis.insufficientUsd1,
  [GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE]: (t) => t.genesis.insufficientAllowance,
  [GENESIS_PURCHASE_ERROR.UNAVAILABLE]: (t) => t.genesis.purchaseUnavailable,
  [GENESIS_PURCHASE_ERROR.NOT_BOUND]: (t) => t.genesis.errors.notBound,

  // —— wallet / exchange soft gates ——
  [WALLET_GATE_ERROR.NOT_CONNECTED]: (t) => t.errors.walletNotConnected,
  [WALLET_GATE_ERROR.PENDING_UNKNOWN]: (t) =>
    t.wallet.transactionErrors.transactionUnknown ?? t.errors.chain.fallback,
  [WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED]: (t) => t.wallet.transactionErrors.gasEstimateFailed,
  [WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH]: (t) =>
    t.wallet.transactionErrors.transactionUnknown ?? t.errors.chain.fallback,
  [WALLET_WRITE_ERROR.WRONG_CHAIN]: (t) =>
    t.wallet.transactionErrors.transactionUnknown ?? t.errors.chain.fallback,
  [WALLET_WRITE_ERROR.SUBMIT_UNKNOWN]: (t) =>
    t.wallet.transactionErrors.transactionUnknown ?? t.errors.chain.fallback,
  [EXCHANGE_QUOTE_FAILED]: (t) => t.errors.quoteFailed,
  [EXCHANGE_SUBMIT_GATE_FAILED]: (t) => t.errors.quoteFailed,

  // —— flash / burn soft gates ——
  [FLASH_USD1_GATE_ERROR.paused]: (t) => t.exchange.flash.gates.paused,
  [FLASH_USD1_GATE_ERROR.belowMin]: (t) => t.exchange.flash.gates.belowMin,
  [FLASH_USD1_GATE_ERROR.aboveMax]: (t) => t.exchange.flash.gates.aboveMax,
  [FLASH_USD1_GATE_ERROR.insufficientReserve]: (t) => t.exchange.flash.gates.insufficientReserve,
  [FLASH_USD1_GATE_ERROR.zeroRate]: (t) => t.exchange.flash.gates.zeroRate,
  [BURN_GATE_ERROR.paused]: (t) => t.exchange.burn.gates.paused,
  [BURN_GATE_ERROR.belowMin]: (t) => t.exchange.burn.gates.belowMin,
  [BURN_GATE_ERROR.aboveMax]: (t) => t.exchange.burn.gates.aboveMax,
  [BURN_GATE_ERROR.zeroRate]: (t) => t.exchange.burn.gates.zeroRate,

  // —— referral soft gates ——
  [REFERRAL_BIND_ERROR.INVALID_PARENT]: (t) => t.community.bindErrors.invalidParent,
  [REFERRAL_BIND_ERROR.PARENT_NOT_BOUND]: (t) => t.community.bindErrors.parentNotBound,
}

type MatchRule = {
  /** Docs / tests id */
  id: string
  match: (text: ErrorText, error: unknown) => boolean
  message: MessageFn
}

/**
 * On-chain revert name / selector / fuzzy text → i18n.
 * Order: more specific first. Duplicate names: handbook contract semantics win
 * (§19 summary bunches some names; contract docs override when they disagree).
 */
export const REVERT_MATCH_RULES: MatchRule[] = [
  // —— ERC20 ——
  {
    id: 'erc20-insufficient-balance',
    match: ({ raw }) => raw.includes('0xe450d38c') || /ERC20InsufficientBalance/i.test(raw),
    message: (t) => t.genesis.insufficientUsd1,
  },
  {
    id: 'erc20-insufficient-allowance',
    match: ({ raw }) => raw.includes('0xfb8f41b2') || /ERC20InsufficientAllowance/i.test(raw),
    message: (t) => t.genesis.insufficientAllowance,
  },

  // —— PreSale (presale.md) ——
  {
    id: 'presale-user-limit',
    match: nameOrSelector(/PreSaleUserPurchaseLimitExceeded/i, '0x43f81a81'),
    message: (t) => t.genesis.errors.userLimitExceeded,
  },
  {
    id: 'presale-not-bound',
    match: nameOrSelector(/PreSaleUserNotBound/i, '0x3bdd728c'),
    message: (t) => t.genesis.errors.notBound,
  },
  {
    id: 'presale-phase-oob',
    match: nameOrSelector(/PreSalePhaseIndexOutOfBounds/i, '0x71c4dee5'),
    message: (t) => t.genesis.errors.invalidPhase,
  },
  {
    id: 'presale-phase-inactive',
    match: nameOrSelector(/PreSalePhaseNotActive/i, '0x9d024615'),
    message: (t) => t.genesis.errors.phaseInactive,
  },
  {
    id: 'presale-sold-out',
    match: nameOrSelector(/PreSalePhaseSoldOut/i, '0x9e6594e8'),
    message: (t) => t.genesis.errors.soldOut,
  },
  {
    id: 'presale-below-min',
    match: nameOrSelector(/PreSaleBelowMin/i, '0x9468590f'),
    message: (t) => t.genesis.errors.belowMin,
  },
  {
    id: 'presale-exceeds-max',
    match: nameOrSelector(/PreSaleExceedsMax/i),
    message: (t) => t.errors.chain.reverts.exceedsMax,
  },
  {
    id: 'presale-invalid-amount',
    match: nameOrSelector(/PreSaleInvalidAmount/i, '0x52d905be'),
    message: (t) => t.genesis.errors.invalidAmount,
  },
  {
    id: 'presale-paused',
    match: nameOrSelector(/PreSalePaused/i, '0x307f3ea1'),
    message: (t) => t.genesis.errors.paused,
  },
  {
    id: 'presale-migrated',
    match: nameOrSelector(/PreSaleMigratedAccount/i),
    message: (t) => t.staking.gates.accountMigrated,
  },
  {
    id: 'presale-system-config',
    match: ({ raw, lower }) =>
      /PreSale(ZeroAddress|InvalidDiscount|InvalidAirdropValueRatio|InvalidAgxPrice|NotMigrationManager)/i.test(
        raw,
      ) ||
      hasSelector(lower, '0xf367a6ee', '0xfa2d446e', '0x84db0e97', '0x76019f9f') ||
      /MigrationManagerImmutable/i.test(raw),
    message: (t) => t.genesis.errors.systemConfig,
  },

  // —— Referral (referral.md) ——
  {
    id: 'referral-already-bound',
    match: nameOrSelector(/Referral__AlreadyBound|AlreadyBound/i, '0xd242113b'),
    message: (t) => t.community.bindErrors.alreadyBound,
  },
  {
    id: 'referral-parent-not-bound',
    match: nameOrSelector(/Referral__ParentNotBound|ParentNotBound/i, '0x3d50dfd5'),
    message: (t) => t.community.bindErrors.parentNotBound,
  },
  {
    id: 'referral-self',
    match: nameOrSelector(/Referral__SelfReferral|SelfReferral/i, '0xa7e9b6d3'),
    message: (t) => t.community.bindErrors.selfReferral,
  },
  {
    id: 'referral-migrated',
    match: nameOrSelector(/Referral__MigratedAccount|MigratedAccount/i, '0xc6dbe929'),
    message: (t) => t.community.bindErrors.migratedAccount,
  },
  {
    id: 'referral-invalid-parent',
    match: nameOrSelector(/Referral__(ParentZero|UserZero)/i, '0x841bf48a', '0x55bc9184'),
    message: (t) => t.community.bindErrors.invalidParent,
  },
  {
    id: 'referral-system',
    match: nameOrSelector(/Referral__(RootZero|NotMigrationManager)/i, '0xc77b7954', '0x209f9827'),
    message: (t) => t.community.bindErrors.systemConfig,
  },

  // —— RewardClaimer / MarketFund / Incentive (§19 + reward.md) ——
  {
    id: 'claim-already-used',
    match: nameOrSelector(/ErrorAlreadyUsed|AlreadyUsed|already.?(used|claimed)/i, '0xd7003173'),
    message: (t) => t.rewards.claimErrors.alreadyUsed,
  },
  {
    id: 'claim-expired',
    match: nameOrSelector(/ErrorSignatureExpired|SignatureExpired/i, '0x66e6698b'),
    message: (t) => t.rewards.claimErrors.expired,
  },
  {
    id: 'claim-invalid-signer',
    match: nameOrSelector(/ErrorInvalidSigner|InvalidSigner|invalid.?sign/i, '0xab3834a6'),
    message: (t) => t.rewards.claimErrors.invalidSigner,
  },
  // Before claim-no-order: `/no.?pending/i` would falsely match `AM__NotPending`.
  {
    id: 'am-migration',
    match: ({ raw }) => /\bAM__/i.test(raw),
    message: (t) => t.staking.gates.accountMigrated,
  },
  {
    id: 'claim-no-order',
    match: (text, error) => {
      const code = readErrorCode(error)
      return (
        code === 404 ||
        /no\s*(team\s*)?reward|available\s*to\s*claim|未?待领取|无可领取|not\s*found/i.test(
          text.raw,
        )
      )
    },
    message: (t) => t.rewards.claimErrors.noOrder,
  },

  // —— Handbook §19 shared tips (user-facing) ——
  // ErrorStakeNotApproved = not bound (liquid/locked staking docs).
  // ErrorNotApproved = bond not authorized (bondhelper.md) — §19 incorrectly bunches them.
  {
    id: 'stake-not-approved',
    match: nameOrSelector(/ErrorStakeNotApproved/i),
    message: (t) => t.staking.gates.notBound,
  },
  {
    id: 'not-approved-plain',
    match: ({ raw }) => /^Not approved$/i.test(raw.trim()),
    message: (t) => t.staking.gates.notBound,
  },
  {
    id: 'bond-not-approved',
    match: nameOrSelector(/^ErrorNotApproved\b/i),
    message: (t) => t.staking.gates.depositoryNotAuth,
  },
  {
    id: 'zero-amount',
    match: nameOrSelector(/Error(ZeroAmount|AmountZero|StakeAmount)\b/i, '0xc91787e4'),
    message: (t) => t.errors.chain.reverts.zeroAmount,
  },
  {
    id: 'insufficient-balance',
    match: nameOrSelector(
      /Error(InsufficientBalance|ExceedsBalance|InvalidBalance|StakeAmountExceedsBalance)\b/i,
    ),
    message: (t) => t.staking.gates.insufficientBalance,
  },
  {
    id: 'stake-amount-limit',
    match: nameOrSelector(/ErrorStakeAmountLimit\b/i),
    message: (t) => t.errors.chain.reverts.stakeAmountLimit,
  },
  {
    id: 'warmup-or-lock',
    match: nameOrSelector(
      /Error(StakeWarmupNotEnded|StillLocked|WarmupPending|StakeWarmupPeriod|WarmupActive)\b/i,
    ),
    message: (t) => t.assets.gates.warmupNotEnded,
  },
  {
    id: 'no-warmup',
    match: nameOrSelector(/ErrorNoWarmup\b/i),
    message: (t) => t.assets.gates.noWarmup,
  },
  {
    id: 'reward-already-claimed',
    match: nameOrSelector(/ErrorRewardAlreadyClaimed\b/i),
    message: (t) => t.errors.chain.reverts.rewardAlreadyClaimed,
  },
  {
    id: 'insufficient-contribution',
    match: nameOrSelector(/ErrorInsufficientContribution\b/i),
    message: (t) => t.rewards.mixed.insufficientContribution,
  },
  {
    id: 'restake-or-queue-unset',
    match: nameOrSelector(
      /Error(RestakeConfigNotSet|RewardQueueNotSet|PrincipalReleaseVaultNotSet)\b/i,
    ),
    message: (t) => t.errors.chain.reverts.configNotReady,
  },
  {
    id: 'not-winner',
    match: nameOrSelector(/ErrorNotWinner\b/i),
    message: (t) => t.errors.chain.reverts.notWinner,
  },
  {
    id: 'debt-capacity',
    match: nameOrSelector(/ErrorDebtCapacityReached\b/i),
    message: (t) => t.errors.chain.reverts.debtCapacityReached,
  },
  {
    id: 'mining-quota',
    match: nameOrSelector(/ErrorMiningQuotaExceeded\b/i),
    message: (t) => t.staking.gates.insufficientQuota,
  },
  {
    id: 'bond-too-small',
    match: nameOrSelector(/ErrorBondTooSmall\b/i),
    message: (t) => t.errors.chain.reverts.bondTooSmall,
  },
  {
    id: 'bond-too-large',
    match: nameOrSelector(/ErrorBondTooLarge\b/i),
    message: (t) => t.errors.chain.reverts.bondTooLarge,
  },
  {
    id: 'invalid-bond-amount',
    match: nameOrSelector(/ErrorInvalidBondAmount\b/i),
    message: (t) => t.staking.gates.zeroAmount,
  },
  {
    id: 'stake-not-exist',
    match: nameOrSelector(/ErrorStakeNotExists?\b/i),
    message: (t) => t.errors.chain.reverts.stakeNotExist,
  },
  {
    id: 'yield-unavailable',
    match: nameOrSelector(
      /Error(StakeAmountExceedsInterest|StakeInterestAmountZero|ExtraAmount|NotPrincipal|ProfitExceedsAmount|ProfitNotAvailable)\b/i,
    ),
    message: (t) => t.errors.chain.reverts.yieldUnavailable,
  },
  {
    id: 'nothing-to-claim',
    match: nameOrSelector(
      /Error(NothingToClaim|IndexOutOfBounds|NoSilenceBalance|NotAvailable)\b/i,
    ),
    message: (t) => t.assets.gates.nothingToRedeem,
  },
  {
    id: 'turbine-cooldown',
    match: nameOrSelector(/Error(SilentTime|InvalidAmount)\b/i),
    message: (t) => t.errors.chain.reverts.turbineCooldown,
  },
  {
    id: 'pair-not-exist',
    match: nameOrSelector(/ErrorPairNotExist\b/i),
    message: (t) => t.errors.chain.reverts.pairNotExist,
  },
  {
    id: 'account-migrated',
    match: nameOrSelector(/Error(AccountMigrated|AlreadyMigrated)\b/i),
    message: (t) => t.staking.gates.accountMigrated,
  },

  // —— Shared Error* names (flash Usd1Swap + burn AgxContributionSwap collide on selector) ——
  {
    id: 'shared-paused',
    match: nameOrSelector(/^ErrorPaused\b/i),
    message: (t) => t.errors.chain.reverts.operationPaused,
  },
  {
    id: 'flash-insufficient-usd1',
    match: nameOrSelector(/^ErrorInsufficientUsd1\b/i),
    message: (t) => t.exchange.flash.gates.insufficientReserve,
  },
  {
    id: 'shared-below-min',
    match: nameOrSelector(/^ErrorBelowMin\b/i),
    message: (t) => t.errors.chain.reverts.belowMinAmount,
  },
  {
    id: 'shared-above-max',
    match: nameOrSelector(/^ErrorAboveMax\b/i),
    message: (t) => t.errors.chain.reverts.aboveMaxAmount,
  },
  {
    id: 'flash-insufficient-output',
    match: nameOrSelector(/^ErrorInsufficientOutput\b/i),
    message: (t) => t.exchange.flash.gates.insufficientOutput,
  },
  {
    id: 'flash-transfer-mismatch',
    match: nameOrSelector(/^ErrorTransferAmountMismatch\b/i),
    message: (t) => t.exchange.flash.gates.transferMismatch,
  },
  {
    id: 'flash-zero-address',
    match: nameOrSelector(/^ErrorZeroAddress\b/i),
    message: (t) => t.exchange.flash.gates.zeroAddress,
  },
  {
    id: 'flash-same-token',
    match: nameOrSelector(/^ErrorSameToken\b/i),
    message: (t) => t.exchange.flash.gates.sameToken,
  },
  {
    id: 'shared-zero-rate',
    match: nameOrSelector(/^ErrorZeroRate\b/i),
    message: (t) => t.errors.chain.reverts.zeroRate,
  },
  {
    id: 'flash-not-authorized',
    match: nameOrSelector(/^Error(CallerNotAuthorized|NotAuthorized|Unauthorized)\b/i),
    message: (t) => t.exchange.flash.gates.notAuthorized,
  },
  {
    id: 'flash-invalid-limits',
    match: nameOrSelector(/^ErrorInvalidLimits\b/i),
    message: (t) => t.exchange.flash.gates.invalidLimits,
  },

  // —— wallet gas / send (prior wallet-error.ts) ——
  {
    id: 'wallet-gas-estimate',
    match: ({ raw }) => /Failed to estimate gas for transaction/i.test(raw),
    message: (t) => t.wallet.transactionErrors.gasEstimateFailed,
  },
  {
    id: 'wallet-gas-too-low',
    match: ({ raw }) =>
      /gasLimit is too low|given 0|intrinsic gas too low|gas required exceeds allowance/i.test(
        raw,
      ) ||
      /signer error.*gas/i.test(raw) ||
      (/gas/i.test(raw) && /too low|given 0/i.test(raw)),
    message: (t) => t.wallet.transactionErrors.gasLimitTooLow,
  },
  {
    id: 'wallet-insufficient-funds',
    match: ({ raw }) =>
      /insufficient funds for gas|insufficient funds|insufficient balance for transfer/i.test(raw),
    message: (t) => t.wallet.transactionErrors.insufficientFunds,
  },
]

export function matchSentinelMessage(raw: string, t: AppMessagesBundle): string | null {
  if (!raw) return null
  const exact = SENTINEL_MESSAGES[raw]
  if (exact) return exact(t)
  // Flash soft gates may be thrown as `SENTINEL detail`
  for (const [sentinel, message] of Object.entries(SENTINEL_MESSAGES)) {
    if (raw.startsWith(`${sentinel} `)) return message(t)
  }
  return null
}

export function matchRevertMessage(
  error: unknown,
  raw: string,
  t: AppMessagesBundle,
): string | null {
  const text = toErrorText(raw)
  for (const rule of REVERT_MATCH_RULES) {
    if (rule.match(text, error)) return rule.message(t)
  }
  return null
}
