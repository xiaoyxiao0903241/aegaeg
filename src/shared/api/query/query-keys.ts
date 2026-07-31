import type { PaginationParams } from '~/shared/api/types'
import { chainWalletQueryKey } from '~/shared/api/query/chain-wallet-query-key'

const erc20BalancePrefix = (token: string) =>
  ['chain', 'erc20', 'balance', token.toLowerCase()] as const
const flashSwapBalancesPrefix = (pairId: string, direction: string) =>
  ['chain', 'flashSwap', 'balances', pairId, direction] as const
const stakeOpenPrefix = (pool: string) => ['chain', 'staking', 'open', pool.toLowerCase()] as const
const bondZapPrefix = (depository: string) =>
  ['chain', 'staking', 'bondZap', depository.toLowerCase()] as const
const assetsBondPrefix = (kind: string) => ['chain', 'assets', 'bond', kind] as const

export const queryKeys = {
  api: {
    all: ['api'] as const,
    performance: ['api', 'performance'] as const,
    salesLogsRoot: ['api', 'salesLogs'] as const,
    salesLogs: (params: PaginationParams = {}) =>
      ['api', 'salesLogs', params.page ?? 1, params.page_size ?? 20] as const,
    rewardLogsRoot: ['api', 'rewardLogs'] as const,
    rewardLogs: (params: PaginationParams = {}) =>
      ['api', 'rewardLogs', params.page ?? 1, params.page_size ?? 20] as const,
    referralTotal: ['api', 'referralTotal'] as const,
    teamRewardTotal: ['api', 'teamRewardTotal'] as const,
    communityFundTotal: ['api', 'communityFundTotal'] as const,
    communityFundLogsRoot: ['api', 'communityFundLogs'] as const,
    communityFundLogs: (params: PaginationParams = {}) =>
      ['api', 'communityFundLogs', params.page ?? 1, params.page_size ?? 20] as const,
    teamRewardClaimLogsRoot: ['api', 'teamRewardClaimLogs'] as const,
    teamRewardClaimLogs: (params: PaginationParams = {}) =>
      ['api', 'teamRewardClaimLogs', params.page ?? 1, params.page_size ?? 20] as const,
    teamReferralsRoot: ['api', 'teamReferrals'] as const,
    teamReferrals: (params: PaginationParams = {}) =>
      ['api', 'teamReferrals', params.page ?? 1, params.page_size ?? 20] as const,
    teamOverview: ['api', 'teamOverview'] as const,
    qualifiedPartitions: ['api', 'performance', 'qualified-partitions'] as const,
    homePopupNotices: (locale: string) => ['api', 'home', 'popupNotices', locale] as const,
  },
  chain: {
    erc20Root: ['chain', 'erc20'] as const,
    referralRoot: ['chain', 'referral'] as const,
    swapRoot: ['chain', 'swap'] as const,
    flashSwapRoot: ['chain', 'flashSwap'] as const,
    burnSwapRoot: ['chain', 'burnSwap'] as const,
    presaleUserPhaseRemainingRoot: ['chain', 'presale', 'userPhaseRemaining'] as const,
    presalePhases: ['chain', 'presale', 'phases'] as const,
    presaleAgxPrice: ['chain', 'presale', 'agxPrice'] as const,
    presaleTotalPurchased: ['chain', 'presale', 'totalPurchased'] as const,
    presaleAirdropThreshold: ['chain', 'presale', 'airdropThreshold'] as const,
    presalePaused: ['chain', 'presale', 'paused'] as const,
    /** Wallet prefix — useChainQuery appends address. */
    presaleUserTotal: ['chain', 'presale', 'userTotal'] as const,
    presaleUserTotalOf: (address: string) =>
      chainWalletQueryKey(['chain', 'presale', 'userTotal'], address),
    presaleUserPhaseRemainingByUser: (address: string) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase()] as const,
    presaleUserPhaseRemaining: (address: string, phaseIndex: number) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase(), phaseIndex] as const,
    erc20Balance: erc20BalancePrefix,
    erc20BalanceOf: (token: string, address: string) =>
      chainWalletQueryKey(erc20BalancePrefix(token), address),
    erc20Allowance: (token: string, owner: string, spender: string) =>
      [
        'chain',
        'erc20',
        'allowance',
        token.toLowerCase(),
        owner.toLowerCase(),
        spender.toLowerCase(),
      ] as const,
    referral: ['chain', 'referral'] as const,
    referralOf: (address: string) => chainWalletQueryKey(['chain', 'referral'], address),
    referralIsBound: ['chain', 'referral', 'isBound'] as const,
    referralIsBoundOf: (address: string) =>
      chainWalletQueryKey(['chain', 'referral', 'isBound'], address),
    migrationRoot: ['chain', 'migration'] as const,
    migrationStatus: ['chain', 'migration', 'status'] as const,
    migrationStatusOf: (address: string) =>
      chainWalletQueryKey(['chain', 'migration', 'status'], address),
    swapPoolMetadata: ['chain', 'swap', 'poolMetadata'] as const,
    swapPoolSpot: ['chain', 'swap', 'poolSpot'] as const,
    swapQuote: (tokenIn: string, tokenOut: string, amountIn: string, pathKey = '') =>
      pathKey
        ? ([
            'chain',
            'swap',
            'quote',
            tokenIn.toLowerCase(),
            tokenOut.toLowerCase(),
            amountIn,
            pathKey,
          ] as const)
        : ([
            'chain',
            'swap',
            'quote',
            tokenIn.toLowerCase(),
            tokenOut.toLowerCase(),
            amountIn,
          ] as const),
    flashSwapQuote: (pairId: string, direction: string, amountIn: string) =>
      ['chain', 'flashSwap', 'quote', pairId, direction, amountIn] as const,
    flashSwapBalances: flashSwapBalancesPrefix,
    flashSwapBalancesOf: (pairId: string, direction: string, address: string) =>
      chainWalletQueryKey(flashSwapBalancesPrefix(pairId, direction), address),
    flashUsd1SwapConfig: ['chain', 'flashSwap', 'usd1Config'] as const,
    burnSwapConfig: ['chain', 'burnSwap', 'config'] as const,
    burnSwapQuote: (amountIn: string) => ['chain', 'burnSwap', 'quote', amountIn] as const,
    burnSwapBalances: ['chain', 'burnSwap', 'balances'] as const,
    burnSwapBalancesOf: (address: string) =>
      chainWalletQueryKey(['chain', 'burnSwap', 'balances'], address),
    burnSwapUserStats: ['chain', 'burnSwap', 'userStats'] as const,
    burnSwapUserStatsOf: (address: string) =>
      chainWalletQueryKey(['chain', 'burnSwap', 'userStats'], address),
    turbineRoot: ['chain', 'turbine'] as const,
    turbineCooldown: ['chain', 'turbine', 'cooldown'] as const,
    turbineQuota: ['chain', 'turbine', 'quota'] as const,
    turbineQuotaOf: (address: string) =>
      chainWalletQueryKey(['chain', 'turbine', 'quota'], address),
    turbineUsd1Balances: ['chain', 'turbine', 'usd1Balances'] as const,
    turbineUsd1BalancesOf: (address: string) =>
      chainWalletQueryKey(['chain', 'turbine', 'usd1Balances'], address),
    turbineSilences: ['chain', 'turbine', 'silences'] as const,
    turbineSilencesOf: (address: string) =>
      chainWalletQueryKey(['chain', 'turbine', 'silences'], address),
    turbineUsdQuote: (agxAmount: string) => ['chain', 'turbine', 'usdQuote', agxAmount] as const,
    turbineClaimable: ['chain', 'turbine', 'claimable'] as const,
    turbineClaimableOf: (address: string) =>
      chainWalletQueryKey(['chain', 'turbine', 'claimable'], address),
    stakingRoot: ['chain', 'staking'] as const,
    stakeOpenPreflight: stakeOpenPrefix,
    stakeOpenPreflightOf: (pool: string, address: string) =>
      chainWalletQueryKey(stakeOpenPrefix(pool), address),
    bondZapPreflight: bondZapPrefix,
    bondZapPreflightOf: (depository: string, address: string) =>
      chainWalletQueryKey(bondZapPrefix(depository), address),
    bondMarketMeta: (depository: string) =>
      ['chain', 'staking', 'bondMarket', depository.toLowerCase()] as const,
    bondZapAgxPreview: (kind: string, depository: string, amount: string) =>
      ['chain', 'staking', 'bondZapPreview', kind, depository.toLowerCase(), amount] as const,
    bondHelperSlippage: ['chain', 'staking', 'bondHelper', 'slippage'] as const,
    xminePreflight: ['chain', 'staking', 'xmine'] as const,
    xminePreflightOf: (address: string) =>
      chainWalletQueryKey(['chain', 'staking', 'xmine'], address),
    assetsRoot: ['chain', 'assets'] as const,
    assetsStakePositions: ['chain', 'assets', 'stake'] as const,
    assetsStakePositionsOf: (address: string) =>
      chainWalletQueryKey(['chain', 'assets', 'stake'], address),
    assetsBondPositions: assetsBondPrefix,
    assetsBondPositionsOf: (kind: string, address: string) =>
      chainWalletQueryKey(assetsBondPrefix(kind), address),
    assetsXminePosition: ['chain', 'assets', 'xmine'] as const,
    assetsXminePositionOf: (address: string) =>
      chainWalletQueryKey(['chain', 'assets', 'xmine'], address),
    assetsClaimPlans: ['chain', 'assets', 'claimPlans'] as const,
    assetsContribution: ['chain', 'assets', 'contribution'] as const,
    assetsContributionOf: (address: string) =>
      chainWalletQueryKey(['chain', 'assets', 'contribution'], address),
    assetsContributionForAmount: (address: string, amount: string) =>
      ['chain', 'assets', 'contribution', address.toLowerCase(), amount] as const,
    rewardsRoot: ['chain', 'rewards'] as const,
    rewardsLuckyClaim: ['chain', 'rewards', 'lucky'] as const,
    rewardsLuckyClaimOf: (address: string) =>
      chainWalletQueryKey(['chain', 'rewards', 'lucky'], address),
    rewardsReferralCount: ['chain', 'rewards', 'referralCount'] as const,
    rewardsReferralCountOf: (address: string) =>
      chainWalletQueryKey(['chain', 'rewards', 'referralCount'], address),
    rewardsCobuildCount: ['chain', 'rewards', 'cobuildCount'] as const,
    rewardsCobuildCountOf: (address: string) =>
      chainWalletQueryKey(['chain', 'rewards', 'cobuildCount'], address),
    releaseRoot: ['chain', 'release'] as const,
    releaseQueue: ['chain', 'release', 'queue'] as const,
    releaseQueueOf: (address: string) =>
      chainWalletQueryKey(['chain', 'release', 'queue'], address),
    releaseBuffer: ['chain', 'release', 'buffer'] as const,
    releaseBufferOf: (address: string) =>
      chainWalletQueryKey(['chain', 'release', 'buffer'], address),
    releaseClaimable: ['chain', 'release', 'claimable'] as const,
    releaseClaimableOf: (address: string) =>
      chainWalletQueryKey(['chain', 'release', 'claimable'], address),
  },
} as const
