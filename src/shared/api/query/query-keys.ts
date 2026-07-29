import type { PaginationParams } from '~/shared/api/types'

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
    // Root keys cover every query under a prefix — the single source of truth
    // for broad invalidation (never spell these out as inline literals).
    erc20Root: ['chain', 'erc20'] as const,
    referralRoot: ['chain', 'referral'] as const,
    swapRoot: ['chain', 'swap'] as const,
    flashSwapQuoteRoot: ['chain', 'flashSwap', 'quote'] as const,
    flashSwapRoot: ['chain', 'flashSwap'] as const,
    burnSwapQuoteRoot: ['chain', 'burnSwap', 'quote'] as const,
    burnSwapRoot: ['chain', 'burnSwap'] as const,
    presaleUserTotalRoot: ['chain', 'presale', 'userTotal'] as const,
    presaleUserPhaseRemainingRoot: ['chain', 'presale', 'userPhaseRemaining'] as const,
    presalePhases: ['chain', 'presale', 'phases'] as const,
    presaleActivePhase: ['chain', 'presale', 'activePhase'] as const,
    presaleAgxPrice: ['chain', 'presale', 'agxPrice'] as const,
    presaleTotalPurchased: ['chain', 'presale', 'totalPurchased'] as const,
    presaleAirdropThreshold: ['chain', 'presale', 'airdropThreshold'] as const,
    presalePaused: ['chain', 'presale', 'paused'] as const,
    presaleUserTotal: (address: string) =>
      ['chain', 'presale', 'userTotal', address.toLowerCase()] as const,
    presaleUserPhaseRemainingByUser: (address: string) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase()] as const,
    presaleUserPhaseRemaining: (address: string, phaseIndex: number) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase(), phaseIndex] as const,
    erc20Balance: (token: string, address: string) =>
      ['chain', 'erc20', 'balance', token.toLowerCase(), address.toLowerCase()] as const,
    erc20Allowance: (token: string, owner: string, spender: string) =>
      [
        'chain',
        'erc20',
        'allowance',
        token.toLowerCase(),
        owner.toLowerCase(),
        spender.toLowerCase(),
      ] as const,
    referral: (address: string) => ['chain', 'referral', address.toLowerCase()] as const,
    referralIsBound: (address: string) =>
      ['chain', 'referral', 'isBound', address.toLowerCase()] as const,
    pairSpotRate: ['chain', 'swap', 'pairSpotRate'] as const,
    swapPoolMetadata: ['chain', 'swap', 'poolMetadata'] as const,
    swapPoolSpot: ['chain', 'swap', 'poolSpot'] as const,
    swapQuote: (tokenIn: string, tokenOut: string, amountIn: string) =>
      ['chain', 'swap', 'quote', tokenIn.toLowerCase(), tokenOut.toLowerCase(), amountIn] as const,
    swapBalances: (address: string, sellToken: string, buyToken: string) =>
      [
        'chain',
        'swap',
        'balances',
        address.toLowerCase(),
        sellToken.toLowerCase(),
        buyToken.toLowerCase(),
      ] as const,
    flashSwapQuote: (pairId: string, direction: string, amountIn: string) =>
      ['chain', 'flashSwap', 'quote', pairId, direction, amountIn] as const,
    flashSwapBalances: (pairId: string, direction: string, address: string) =>
      ['chain', 'flashSwap', 'balances', pairId, direction, address.toLowerCase()] as const,
    flashUsd1SwapConfig: ['chain', 'flashSwap', 'usd1Config'] as const,
    burnSwapConfig: ['chain', 'burnSwap', 'config'] as const,
    burnSwapQuote: (amountIn: string) => ['chain', 'burnSwap', 'quote', amountIn] as const,
    burnSwapBalances: (address: string) =>
      ['chain', 'burnSwap', 'balances', address.toLowerCase()] as const,
    burnSwapUserStats: (address: string) =>
      ['chain', 'burnSwap', 'userStats', address.toLowerCase()] as const,
    turbineRoot: ['chain', 'turbine'] as const,
    turbineCooldown: ['chain', 'turbine', 'cooldown'] as const,
    turbineQuota: (address: string) =>
      ['chain', 'turbine', 'quota', address.toLowerCase()] as const,
    turbineUsd1Balances: (address: string) =>
      ['chain', 'turbine', 'usd1Balances', address.toLowerCase()] as const,
    turbineSilences: (address: string) =>
      ['chain', 'turbine', 'silences', address.toLowerCase()] as const,
    turbineUsdQuote: (agxAmount: string) => ['chain', 'turbine', 'usdQuote', agxAmount] as const,
    turbineClaimable: (address: string) =>
      ['chain', 'turbine', 'claimable', address.toLowerCase()] as const,
    stakingRoot: ['chain', 'staking'] as const,
    stakeOpenPreflight: (pool: string, address: string) =>
      ['chain', 'staking', 'open', pool.toLowerCase(), address.toLowerCase()] as const,
    bondZapPreflight: (depository: string, address: string) =>
      ['chain', 'staking', 'bondZap', depository.toLowerCase(), address.toLowerCase()] as const,
    xminePreflight: (address: string) =>
      ['chain', 'staking', 'xmine', address.toLowerCase()] as const,
    assetsRoot: ['chain', 'assets'] as const,
    assetsStakePositions: (address: string) =>
      ['chain', 'assets', 'stake', address.toLowerCase()] as const,
    assetsBondPositions: (kind: string, address: string) =>
      ['chain', 'assets', 'bond', kind, address.toLowerCase()] as const,
    assetsXminePosition: (address: string) =>
      ['chain', 'assets', 'xmine', address.toLowerCase()] as const,
    assetsClaimPlans: ['chain', 'assets', 'claimPlans'] as const,
    assetsContribution: (address: string) =>
      ['chain', 'assets', 'contribution', address.toLowerCase()] as const,
    releaseRoot: ['chain', 'release'] as const,
    releaseQueue: (address: string) =>
      ['chain', 'release', 'queue', address.toLowerCase()] as const,
    releaseBuffer: (address: string) =>
      ['chain', 'release', 'buffer', address.toLowerCase()] as const,
    releaseClaimable: (address: string) =>
      ['chain', 'release', 'claimable', address.toLowerCase()] as const,
  },
} as const
