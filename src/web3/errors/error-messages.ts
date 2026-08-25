import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import {
  type ErrorText,
  hasSelector,
  nameOrSelector,
  readErrorCode,
  toErrorText,
} from '~/web3/errors/error-text'
import {
  type ErrorMessageContext,
  messageForErc20InsufficientAllowance,
  messageForErc20InsufficientBalance,
} from '~/web3/errors/path-scoped-erc20'
import {
  CLAIM_CONFIRM_SYNC_FAILED,
  EXCHANGE_QUOTE_FAILED,
  EXCHANGE_SUBMIT_BLOCKED,
  FLASH_USD1_BLOCKED,
  GENESIS_PURCHASE_ERROR,
  REFERRAL_BIND_ERROR,
  WALLET_BLOCKED,
  WALLET_WRITE_ERROR,
} from '~/web3/errors/sentinels'
import {
  ASSETS_BLOCKED,
  BOND_ZAP_BLOCKED,
  BURN_BLOCKED,
  RELEASE_BLOCKED,
  REWARDS_BLOCKED,
  STAKING_BLOCKED,
  XMINE_BLOCKED,
} from '~/web3/errors/write-block-errors'
import { WRITE_PATH } from '~/web3/wallet/write-path'

export type { ErrorMessageContext }

type MessageFn = (t: AppMessagesBundle, ctx?: ErrorMessageContext, error?: unknown) => string

/**
 * 精确域哨兵 → i18n。
 * 阻断码本身无 locale；用户文案只在此表。
 */
export const SENTINEL_MESSAGES: Record<string, MessageFn> = {
  // —— 质押 / bond / xmine ——
  [STAKING_BLOCKED.accountMigrated]: (t) => t.staking.blocked.accountMigrated,
  [BOND_ZAP_BLOCKED.accountMigrated]: (t) => t.staking.blocked.accountMigrated,
  [STAKING_BLOCKED.notBound]: (t) => t.staking.blocked.notBound,
  [BOND_ZAP_BLOCKED.notBound]: (t) => t.staking.blocked.notBound,
  [STAKING_BLOCKED.insufficientBalance]: (t) => t.staking.blocked.insufficientBalance,
  [BOND_ZAP_BLOCKED.insufficientBalance]: (t) => t.staking.blocked.insufficientBalance,
  [XMINE_BLOCKED.insufficientBalance]: (t) => t.staking.blocked.insufficientGagx,
  [XMINE_BLOCKED.accountMigrated]: (t) => t.staking.blocked.accountMigrated,
  [STAKING_BLOCKED.insufficientAllowance]: (t) => t.staking.blocked.insufficientAllowance,
  [BOND_ZAP_BLOCKED.insufficientAllowance]: (t) => t.staking.blocked.insufficientAllowance,
  [XMINE_BLOCKED.insufficientAllowance]: (t) => t.staking.blocked.insufficientAllowance,
  [STAKING_BLOCKED.insufficientQuota]: (t) => t.staking.blocked.insufficientQuota,
  [XMINE_BLOCKED.insufficientQuota]: (t) => t.staking.blocked.insufficientQuota,
  [STAKING_BLOCKED.poolPaused]: (t) => t.staking.blocked.poolPaused,
  [BOND_ZAP_BLOCKED.depositoryNotAuth]: (t) => t.staking.blocked.depositoryNotAuth,
  [BOND_ZAP_BLOCKED.insufficientDebtCapacity]: (t) => t.staking.blocked.insufficientDebtCapacity,
  [BOND_ZAP_BLOCKED.bondTooSmall]: (t) => t.errors.chain.reverts.bondTooSmall,
  [BOND_ZAP_BLOCKED.bondTooLarge]: (t) => t.errors.chain.reverts.bondTooLarge,
  [STAKING_BLOCKED.zeroAmount]: (t) => t.staking.blocked.zeroAmount,
  [BOND_ZAP_BLOCKED.zeroAmount]: (t) => t.staking.blocked.zeroAmount,
  [XMINE_BLOCKED.zeroAmount]: (t) => t.staking.blocked.zeroAmount,
  [STAKING_BLOCKED.unavailable]: (t) => t.staking.blocked.unavailable,
  [BOND_ZAP_BLOCKED.unavailable]: (t) => t.staking.blocked.unavailable,
  [XMINE_BLOCKED.unavailable]: (t) => t.staking.blocked.unavailable,

  // —— 资产 ——
  [ASSETS_BLOCKED.zeroAmount]: (t) => t.assets.blocked.zeroAmount,
  [ASSETS_BLOCKED.insufficientReward]: (t) => t.assets.blocked.insufficientReward,
  [ASSETS_BLOCKED.insufficientContribution]: (t) => t.assets.blocked.insufficientContribution,
  [ASSETS_BLOCKED.releasePlanUnresolved]: (t) => t.assets.blocked.planUnresolved,
  [ASSETS_BLOCKED.restakePlanUnresolved]: (t) => t.assets.blocked.planUnresolved,
  [ASSETS_BLOCKED.nothingToRedeem]: (t) => t.assets.blocked.nothingToRedeem,
  [ASSETS_BLOCKED.warmupActive]: (t) => t.assets.blocked.warmupActive,
  [ASSETS_BLOCKED.warmupNotEnded]: (t) => t.assets.blocked.warmupNotEnded,
  [ASSETS_BLOCKED.noWarmup]: (t) => t.assets.blocked.noWarmup,
  [ASSETS_BLOCKED.unavailable]: (t) => t.assets.blocked.unavailable,

  // —— 释放 ——
  [RELEASE_BLOCKED.zeroAmount]: (t) => t.assets.blocked.zeroAmount,
  [RELEASE_BLOCKED.accountMigrated]: (t) => t.staking.blocked.accountMigrated,
  [RELEASE_BLOCKED.planUnresolved]: (t) => t.assets.blocked.planUnresolved,
  [RELEASE_BLOCKED.unavailable]: (t) => t.assets.blocked.unavailable,

  // —— 奖励阻断 ——
  [REWARDS_BLOCKED.insufficientContribution]: (t) => t.rewards.mixed.insufficientContribution,
  [REWARDS_BLOCKED.luckyPaused]: (t) => t.rewards.mixed.luckyPaused,
  [REWARDS_BLOCKED.luckyNotClaimable]: (t) => t.rewards.mixed.luckyNotClaimable,
  [REWARDS_BLOCKED.zeroAmount]: (t) => t.rewards.claimErrors.zeroAmount,
  [REWARDS_BLOCKED.signatureExpired]: (t) => t.rewards.claimErrors.expired,
  [REWARDS_BLOCKED.insufficientReward]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_BLOCKED.releasePlanUnresolved]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_BLOCKED.restakePlanUnresolved]: (t) => t.rewards.claimErrors.failed,
  [REWARDS_BLOCKED.unavailable]: (t) => t.rewards.claimErrors.failed,
  [CLAIM_CONFIRM_SYNC_FAILED]: (t) =>
    t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimErrors.failed,

  // —— Genesis 阻断 ——
  [GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1]: (t) => t.genesis.insufficientUsd1,
  [GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE]: (t) => t.genesis.insufficientAllowance,
  [GENESIS_PURCHASE_ERROR.UNAVAILABLE]: (t) => t.genesis.purchaseUnavailable,
  [GENESIS_PURCHASE_ERROR.NOT_BOUND]: (t) => t.genesis.errors.notBound,

  // —— 钱包 / 兑换阻断 ——
  [WALLET_BLOCKED.NOT_CONNECTED]: (t) => t.errors.walletNotConnected,
  [WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED]: (t) => t.wallet.transactionErrors.gasEstimateFailed,
  [WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH]: (t) => t.wallet.transactionErrors.accountChanged,
  [WALLET_WRITE_ERROR.WRONG_CHAIN]: (t) => t.wallet.transactionErrors.wrongChain,
  [WALLET_WRITE_ERROR.STALE_ALLOWANCE_READ]: (t) => t.errors.chain.fallback,
  [EXCHANGE_QUOTE_FAILED]: (t) => t.errors.quoteFailed,
  [EXCHANGE_SUBMIT_BLOCKED]: (t) => t.errors.quoteFailed,
  TURBINE_QUOTE_EXCEEDS_APPROVAL: (t) => t.exchange.flash.blocked.insufficientOutput,
  TURBINE_ZERO_AMOUNT: (t) => t.errors.chain.reverts.zeroAmount,
  TURBINE_QUOTA_EXCEEDED: (t) => t.exchange.flash.blocked.aboveMax,
  TURBINE_INSUFFICIENT_USD1: (t) => t.errors.chain.reverts.walletUsd1Insufficient,
  TURBINE_INSUFFICIENT_ALLOWANCE: (t) => t.errors.chain.reverts.insufficientAllowance,
  TURBINE_NOT_VESTED: (t) => t.errors.chain.reverts.turbineCooldown,

  // —— flash / burn 阻断 ——
  [FLASH_USD1_BLOCKED.paused]: (t) => t.exchange.flash.blocked.paused,
  [FLASH_USD1_BLOCKED.belowMin]: (t) => t.exchange.flash.blocked.belowMin,
  [FLASH_USD1_BLOCKED.aboveMax]: (t) => t.exchange.flash.blocked.aboveMax,
  [FLASH_USD1_BLOCKED.insufficientReserve]: (t) => t.exchange.flash.blocked.insufficientReserve,
  [FLASH_USD1_BLOCKED.zeroRate]: (t) => t.exchange.flash.blocked.zeroRate,
  [FLASH_USD1_BLOCKED.zeroUsdtToken]: (t) => t.exchange.flash.blocked.zeroAddress,
  [BURN_BLOCKED.paused]: (t) => t.exchange.burn.blocked.paused,
  [BURN_BLOCKED.belowMin]: (t) => t.exchange.burn.blocked.belowMin,
  [BURN_BLOCKED.aboveMax]: (t) => t.exchange.burn.blocked.aboveMax,
  [BURN_BLOCKED.zeroRate]: (t) => t.exchange.burn.blocked.zeroRate,
  [BURN_BLOCKED.zeroAmount]: (t) => t.exchange.burn.blocked.zeroAmount,

  // —— 推荐阻断 ——
  [REFERRAL_BIND_ERROR.INVALID_PARENT]: (t) => t.community.bindErrors.invalidParent,
  [REFERRAL_BIND_ERROR.PARENT_NOT_BOUND]: (t) => t.community.bindErrors.parentNotBound,
  [REFERRAL_BIND_ERROR.SELF_REFERRAL]: (t) => t.community.bindErrors.selfReferral,
}

type MatchRule = {
  /** 文档 / 单测用 id。 */
  id: string
  match: (text: ErrorText, error: unknown) => boolean
  message: MessageFn
}

/**
 * 链上 revert 名 / selector / 模糊文本 → i18n
 *
 * 更具体的规则在前；重名时以合约文档语义为准，盖过 §19 的笼统归并。
 *
 * @see 手册 §19 常见错误与前端提示
 */
export const REVERT_MATCH_RULES: MatchRule[] = [
  // —— ERC20（按 WritePath / 缺余额账户消歧；禁止绑死 Genesis 认购）——
  {
    id: 'erc20-insufficient-balance',
    match: ({ raw }) => raw.includes('0xe450d38c') || /ERC20InsufficientBalance/i.test(raw),
    message: (t, ctx, error) => messageForErc20InsufficientBalance(t, ctx, error),
  },
  {
    id: 'erc20-insufficient-allowance',
    match: ({ raw }) => raw.includes('0xfb8f41b2') || /ERC20InsufficientAllowance/i.test(raw),
    message: (t, ctx) => messageForErc20InsufficientAllowance(t, ctx),
  },

  // —— PreSale ——
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
    message: (t) => t.staking.blocked.accountMigrated,
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

  // —— Referral ——
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
    match: nameOrSelector(/Referral__MigratedAccount/i, '0xc6dbe929'),
    message: (t) => t.community.bindErrors.migratedAccount,
  },
  {
    // Bond / staking / xmine / turbine 等 *MigratedAccount（非 Referral__ 前缀）
    id: 'domain-migrated-account',
    match: ({ raw }) => /MigratedAccount/i.test(raw) && !/Referral__/i.test(raw),
    message: (t) => t.staking.blocked.accountMigrated,
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

  // —— RewardClaimer / MarketFund / Incentive ——
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
  // claim-no-order 须先于通用 pending：否则 `/no.?pending/i` 会误中 `AM__NotPending`。
  {
    id: 'am-migration',
    match: ({ raw }) => /\bAM__/i.test(raw),
    message: (t) => t.staking.blocked.accountMigrated,
  },
  {
    id: 'claim-no-order',
    match: (text, error) => {
      const raw = text.raw
      // 仅奖励/领取语义；裸 not found / HTML 404 不得抢其他域。
      const claimShaped =
        /no\s*(team\s*)?reward|available\s*to\s*claim|未?待领取|无可领取/i.test(raw) ||
        (/not\s*found/i.test(raw) && /reward|claim|order/i.test(raw))
      if (claimShaped) return true
      const code = readErrorCode(error)
      return code === 404 && /reward|claim|order/i.test(raw)
    },
    message: (t) => t.rewards.claimErrors.noOrder,
  },

  // —— 手册 §19 共用提示（用户可见）——
  // ErrorStakeNotApproved = 未绑定（活期/锁仓质押）。
  // ErrorNotApproved = bond 未授权；与 §19 笼统归并不同，按合约文档分别归类。
  // 钱包只回传 revert hex、没有 errorName 时，按 selector 兜底归类，避免误判为未匹配。
  {
    id: 'stake-not-approved',
    match: nameOrSelector(/ErrorStakeNotApproved/i, '0xaa6a22bc'),
    message: (t) => t.staking.blocked.notBound,
  },
  {
    id: 'not-approved-plain',
    match: ({ raw }) => /^Not approved$/i.test(raw.trim()),
    message: (t, ctx) =>
      ctx?.path === WRITE_PATH.BOND_ZAP
        ? t.staking.blocked.depositoryNotAuth
        : t.staking.blocked.notBound,
  },
  {
    id: 'bond-not-approved',
    match: nameOrSelector(/^ErrorNotApproved\b/i, '0x5e23f093'),
    message: (t) => t.staking.blocked.depositoryNotAuth,
  },
  {
    id: 'zero-amount',
    match: nameOrSelector(
      /Error(ZeroAmount|AmountZero|StakeAmount)\b/i,
      '0xc91787e4', // ErrorZeroAmount()
      '0xbc8ab109', // ErrorAmountZero()
      '0x5d9fe13e', // ErrorStakeAmount()
    ),
    message: (t) => t.errors.chain.reverts.zeroAmount,
  },
  {
    id: 'insufficient-balance',
    match: nameOrSelector(
      /Error(InsufficientBalance|ExceedsBalance|InvalidBalance|StakeAmountExceedsBalance)\b/i,
      '0x0f9aedb5',
      '0xbd99182f',
      '0xbacf057c',
      '0x30adcb59',
    ),
    message: (t, ctx) => {
      if (ctx?.path === WRITE_PATH.XMINE) return t.staking.blocked.insufficientGagx
      if (ctx?.path === WRITE_PATH.STAKING) return t.staking.blocked.insufficientBalance
      return t.errors.chain.reverts.walletTokenInsufficient
    },
  },
  {
    id: 'stake-amount-limit',
    match: nameOrSelector(/ErrorStakeAmountLimit\b/i, '0xed35817b'),
    message: (t) => t.errors.chain.reverts.stakeAmountLimit,
  },
  {
    id: 'warmup-or-lock',
    match: nameOrSelector(
      /Error(StakeWarmupNotEnded|StillLocked|WarmupPending|StakeWarmupPeriod|WarmupActive)\b/i,
      '0xf5c34c55',
      '0x70b1cae9',
      '0x0f095e78',
      '0x9111ff2c',
    ),
    message: (t) => t.errors.chain.reverts.warmupOrLockActive,
  },
  {
    id: 'no-warmup',
    match: nameOrSelector(/ErrorNoWarmup\b/i, '0xa20249b0'),
    message: (t) => t.assets.blocked.noWarmup,
  },
  {
    id: 'no-unclaimed-lucky-reward',
    match: nameOrSelector(/ErrorNoUnclaimedReward\b/i, '0x60aea18d'),
    message: (t) => t.rewards.mixed.luckyNotClaimable,
  },
  {
    id: 'insufficient-contribution',
    match: nameOrSelector(/ErrorInsufficientContribution\b/i, '0x76427e88'),
    message: (t) => t.rewards.mixed.insufficientContribution,
  },
  {
    id: 'restake-or-queue-unset',
    match: nameOrSelector(
      /Error(RestakeConfigNotSet|RewardQueueNotSet|PrincipalReleaseVaultNotSet)\b/i,
      '0x43f1293c',
      '0x8748477e',
      '0xb0f1e580',
    ),
    message: (t) => t.errors.chain.reverts.configNotReady,
  },
  {
    id: 'debt-capacity',
    match: nameOrSelector(/ErrorDebtCapacityReached\b/i, '0xd63b4733'),
    message: (t) => t.errors.chain.reverts.debtCapacityReached,
  },
  {
    id: 'mining-quota',
    match: nameOrSelector(/ErrorMiningQuotaExceeded\b/i, '0xeabda292'),
    message: (t) => t.staking.blocked.insufficientQuota,
  },
  {
    id: 'bond-too-small',
    match: nameOrSelector(/ErrorBondTooSmall\b/i, '0xad13455f'),
    message: (t) => t.errors.chain.reverts.bondTooSmall,
  },
  {
    id: 'bond-too-large',
    match: nameOrSelector(/ErrorBondTooLarge\b/i, '0xcc326f21'),
    message: (t) => t.errors.chain.reverts.bondTooLarge,
  },
  {
    id: 'invalid-bond-amount',
    match: nameOrSelector(/ErrorInvalidBondAmount\b/i, '0x0e26005a'),
    message: (t) => t.staking.blocked.zeroAmount,
  },
  {
    id: 'stake-not-exist',
    match: nameOrSelector(/ErrorStakeNotExists?\b/i, '0x91962c02', '0x47046b36'),
    message: (t) => t.errors.chain.reverts.stakeNotExist,
  },
  {
    id: 'yield-unavailable',
    match: nameOrSelector(
      /Error(StakeAmountExceedsInterest|StakeInterestAmountZero|ExtraAmount|NotPrincipal|ProfitExceedsAmount|ProfitNotAvailable)\b/i,
      '0xad4f2d5b',
      '0xbeda8a6f',
      '0xf72a7795',
      '0xac49be17',
    ),
    message: (t) => t.errors.chain.reverts.yieldUnavailable,
  },
  {
    id: 'turbine-no-silence-balance',
    match: nameOrSelector(/ErrorNoSilenceBalance\b/i),
    message: (t) => t.errors.chain.reverts.turbineNoSilenceBalance,
  },
  {
    id: 'nothing-to-claim',
    match: nameOrSelector(
      /Error(NothingToClaim|IndexOutOfBounds|NotAvailable)\b/i,
      '0x253fa28b',
      '0x0715b4d9',
    ),
    message: (t) => t.errors.chain.reverts.nothingToClaim,
  },
  {
    id: 'turbine-cooldown',
    match: nameOrSelector(/ErrorSilentTime\b/i, '0x60977553'),
    message: (t) => t.errors.chain.reverts.turbineCooldown,
  },
  {
    id: 'invalid-amount',
    match: nameOrSelector(/ErrorInvalidAmount\b/i, '0xd27def68'),
    message: (t) => t.errors.chain.reverts.invalidAmount,
  },
  {
    id: 'pair-not-exist',
    match: nameOrSelector(/ErrorPairNotExist\b/i, '0xd7660b05'),
    message: (t) => t.errors.chain.reverts.pairNotExist,
  },
  {
    id: 'account-migrated',
    match: nameOrSelector(/Error(AccountMigrated|AlreadyMigrated)\b/i, '0x28b83a9a'),
    message: (t) => t.staking.blocked.accountMigrated,
  },

  // —— 共用 Error* 名（flash 与 burn selector 碰撞）——
  {
    id: 'shared-paused',
    match: nameOrSelector(/^ErrorPaused\b/i, '0xbc2c67a6'),
    message: (t) => t.errors.chain.reverts.operationPaused,
  },
  {
    id: 'flash-insufficient-usd1',
    match: nameOrSelector(/^ErrorInsufficientUsd1\b/i, '0x0422c7a7'),
    message: (t) => t.exchange.flash.blocked.insufficientReserve,
  },
  {
    id: 'shared-below-min',
    match: nameOrSelector(/^ErrorBelowMin\b/i, '0x92882673'),
    message: (t) => t.errors.chain.reverts.belowMinAmount,
  },
  {
    id: 'shared-above-max',
    match: nameOrSelector(/^ErrorAboveMax\b/i, '0x1f2fef9c'),
    message: (t) => t.errors.chain.reverts.aboveMaxAmount,
  },
  {
    id: 'flash-insufficient-output',
    match: nameOrSelector(/^ErrorInsufficientOutput\b/i),
    message: (t) => t.exchange.flash.blocked.insufficientOutput,
  },
  {
    id: 'flash-transfer-mismatch',
    match: nameOrSelector(/^ErrorTransferAmountMismatch\b/i),
    message: (t) => t.exchange.flash.blocked.transferMismatch,
  },
  {
    id: 'shared-zero-address',
    match: nameOrSelector(/^ErrorZeroAddress\b/i),
    message: (t) => t.errors.chain.reverts.zeroAddress,
  },
  {
    id: 'flash-same-token',
    match: nameOrSelector(/^ErrorSameToken\b/i),
    message: (t) => t.exchange.flash.blocked.sameToken,
  },
  {
    id: 'shared-zero-rate',
    match: nameOrSelector(/^ErrorZeroRate\b/i, '0x8eb37bb5'),
    message: (t) => t.errors.chain.reverts.zeroRate,
  },
  {
    id: 'shared-not-authorized',
    match: nameOrSelector(/^Error(CallerNotAuthorized|NotAuthorized|Unauthorized)\b/i),
    message: (t) => t.errors.chain.reverts.notAuthorized,
  },
  {
    id: 'shared-invalid-limits',
    match: nameOrSelector(/^ErrorInvalidLimits\b/i),
    message: (t) => t.errors.chain.reverts.invalidLimits,
  },

  // —— 钱包 gas / 发送 ——
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

/**
 * 按原始错误文本匹配已定义哨兵并返回用户文案。
 *
 * 先查精确值，再处理 `SENTINEL detail` 这类带附加信息的抛出形式。
 *
 * @param raw 读取到的错误文本
 * @param t 当前 i18n 文案包
 * @returns 用户文案；未命中哨兵时返回 null
 * @see 手册 §19 常见错误与前端提示
 */
export function matchSentinelMessage(raw: string, t: AppMessagesBundle): string | null {
  if (!raw) return null
  const exact = SENTINEL_MESSAGES[raw]
  if (exact) return exact(t)
  // Flash 阻断可能以 `SENTINEL detail` 抛出。
  for (const [sentinel, message] of Object.entries(SENTINEL_MESSAGES)) {
    if (raw.startsWith(`${sentinel} `)) return message(t)
  }
  return null
}

/**
 * 按错误名 / selector / 模糊文本规则匹配合约 revert 并返回用户文案。
 *
 * 规则按更具体到更笼统排列，匹配第一条即返回。
 *
 * @param error 原始错误，供规则读取错误码等字段
 * @param raw 读取到的错误文本
 * @param t 当前 i18n 文案包
 * @param ctx 可选写路径 / 钱包，用于共享 selector 消歧
 * @returns 用户文案；未命中任何规则时返回 null
 * @see 手册 §19 常见错误与前端提示
 */
export function matchRevertMessage(
  error: unknown,
  raw: string,
  t: AppMessagesBundle,
  ctx?: ErrorMessageContext,
): string | null {
  const text = toErrorText(raw)
  for (const rule of REVERT_MATCH_RULES) {
    if (rule.match(text, error)) return rule.message(t, ctx, error)
  }
  return null
}
