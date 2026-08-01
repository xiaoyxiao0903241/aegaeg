import { chainWalletQueryKey } from '~/shared/api/query/chain-wallet-query-key'
import type {
  BondFlowLogsParams,
  BufferPoolLogsParams,
  PaginationParams,
  RankRewardTeamMembersParams,
  ReferralAwardDirectReferralsParams,
  ReleasePoolLogsParams,
  StakeFlowLogsParams,
  TurbineLogsParams,
  X0MiningLogsParams,
} from '~/shared/api/types'

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
    searchPerformance: (address: string) =>
      ['api', 'search', 'performance', address.toLowerCase()] as const,
    makingOverview: ['api', 'performance', 'makingOverview'] as const,
    stakeAddressCount: ['api', 'performance', 'stakeAddressCount'] as const,
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
    agxContributionSummary: ['api', 'agxContribution', 'summary'] as const,
    agxContributionBurnLogsRoot: ['api', 'agxContribution', 'burnLogs'] as const,
    agxContributionBurnLogs: (params: PaginationParams = {}) =>
      ['api', 'agxContribution', 'burnLogs', params.page ?? 1, params.page_size ?? 20] as const,
    agxContributionConsumeLogsRoot: ['api', 'agxContribution', 'consumeLogs'] as const,
    agxContributionConsumeLogs: (params: PaginationParams = {}) =>
      ['api', 'agxContribution', 'consumeLogs', params.page ?? 1, params.page_size ?? 20] as const,
    assetsHoldingsDistribution: ['api', 'assets', 'holdingsDistribution'] as const,
    assetsHoldingsSummary: ['api', 'assets', 'holdingsSummary'] as const,
    assetsRewardSummary: ['api', 'assets', 'rewardSummary'] as const,
    bondFlowLpLogsRoot: ['api', 'bondFlow', 'lpLogs'] as const,
    bondFlowLpLogs: (params: BondFlowLogsParams = {}) =>
      [
        'api',
        'bondFlow',
        'lpLogs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.operation ?? null,
      ] as const,
    bondFlowBurnLogsRoot: ['api', 'bondFlow', 'burnLogs'] as const,
    bondFlowBurnLogs: (params: BondFlowLogsParams = {}) =>
      [
        'api',
        'bondFlow',
        'burnLogs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.operation ?? null,
      ] as const,
    bondFlowLpPurchasesRoot: ['api', 'bondFlow', 'lpPurchases'] as const,
    bondFlowLpPurchases: (params: PaginationParams = {}) =>
      ['api', 'bondFlow', 'lpPurchases', params.page ?? 1, params.page_size ?? 20] as const,
    bondFlowBurnPurchasesRoot: ['api', 'bondFlow', 'burnPurchases'] as const,
    bondFlowBurnPurchases: (params: PaginationParams = {}) =>
      ['api', 'bondFlow', 'burnPurchases', params.page ?? 1, params.page_size ?? 20] as const,
    bufferPoolSummary: ['api', 'bufferPool', 'summary'] as const,
    bufferPoolLogsRoot: ['api', 'bufferPool', 'logs'] as const,
    bufferPoolLogs: (params: BufferPoolLogsParams = {}) =>
      [
        'api',
        'bufferPool',
        'logs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.event_type ?? null,
      ] as const,
    luckyRewardSummary: ['api', 'luckyReward', 'summary'] as const,
    luckyRewardMyRoundsRoot: ['api', 'luckyReward', 'myRounds'] as const,
    luckyRewardMyRounds: (params: PaginationParams = {}) =>
      ['api', 'luckyReward', 'myRounds', params.page ?? 1, params.page_size ?? 20] as const,
    luckyRewardWinnersRoot: ['api', 'luckyReward', 'winners'] as const,
    luckyRewardWinners: (date: string) => ['api', 'luckyReward', 'winners', date] as const,
    marketAllowanceSummary: ['api', 'marketAllowance', 'summary'] as const,
    marketAllowanceClaimLogsRoot: ['api', 'marketAllowance', 'claimLogs'] as const,
    marketAllowanceClaimLogs: (params: PaginationParams = {}) =>
      ['api', 'marketAllowance', 'claimLogs', params.page ?? 1, params.page_size ?? 20] as const,
    marketAllowancePaidLogsRoot: ['api', 'marketAllowance', 'paidLogs'] as const,
    marketAllowancePaidLogs: (params: PaginationParams = {}) =>
      ['api', 'marketAllowance', 'paidLogs', params.page ?? 1, params.page_size ?? 20] as const,
    participationAwardSummary: ['api', 'participationAward', 'summary'] as const,
    participationAwardLogsRoot: ['api', 'participationAward', 'logs'] as const,
    participationAwardLogs: (params: PaginationParams = {}) =>
      ['api', 'participationAward', 'logs', params.page ?? 1, params.page_size ?? 20] as const,
    participationAwardInviter: ['api', 'participationAward', 'inviter'] as const,
    rankRewardSummary: ['api', 'rankReward', 'summary'] as const,
    rankRewardLogsRoot: ['api', 'rankReward', 'logs'] as const,
    rankRewardLogs: (params: PaginationParams = {}) =>
      ['api', 'rankReward', 'logs', params.page ?? 1, params.page_size ?? 20] as const,
    rankRewardPeerSurpassLogsRoot: ['api', 'rankReward', 'peerSurpassLogs'] as const,
    rankRewardPeerSurpassLogs: (params: PaginationParams = {}) =>
      ['api', 'rankReward', 'peerSurpassLogs', params.page ?? 1, params.page_size ?? 20] as const,
    rankRewardTeamMembersRoot: ['api', 'rankReward', 'teamMembers'] as const,
    rankRewardTeamMembers: (params: RankRewardTeamMembersParams = {}) =>
      [
        'api',
        'rankReward',
        'teamMembers',
        params.page ?? 1,
        params.page_size ?? 20,
        params.sort_time ?? null,
        params.hide_zero_market ?? null,
      ] as const,
    referralAwardSummary: ['api', 'referralAward', 'summary'] as const,
    referralAwardLogsRoot: ['api', 'referralAward', 'logs'] as const,
    referralAwardLogs: (params: PaginationParams = {}) =>
      ['api', 'referralAward', 'logs', params.page ?? 1, params.page_size ?? 20] as const,
    referralAwardDirectReferralsRoot: ['api', 'referralAward', 'directReferrals'] as const,
    referralAwardDirectReferrals: (params: ReferralAwardDirectReferralsParams = {}) =>
      [
        'api',
        'referralAward',
        'directReferrals',
        params.page ?? 1,
        params.page_size ?? 20,
        params.hide_zero_position ?? null,
      ] as const,
    releasePoolSummary: ['api', 'releasePool', 'summary'] as const,
    releasePoolLogsRoot: ['api', 'releasePool', 'logs'] as const,
    releasePoolLogs: (params: ReleasePoolLogsParams = {}) =>
      [
        'api',
        'releasePool',
        'logs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.event_type ?? null,
      ] as const,
    stakeFlowLogsRoot: ['api', 'stakeFlow', 'logs'] as const,
    stakeFlowLogs: (params: StakeFlowLogsParams = {}) =>
      [
        'api',
        'stakeFlow',
        'logs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.operation ?? null,
      ] as const,
    stakeFlowPositionsRoot: ['api', 'stakeFlow', 'positions'] as const,
    stakeFlowPositions: (params: PaginationParams = {}) =>
      ['api', 'stakeFlow', 'positions', params.page ?? 1, params.page_size ?? 20] as const,
    turbineSummary: ['api', 'turbine', 'summary'] as const,
    turbineLogsRoot: ['api', 'turbine', 'logs'] as const,
    turbineLogs: (params: TurbineLogsParams = {}) =>
      [
        'api',
        'turbine',
        'logs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.turbine_type ?? null,
      ] as const,
    x0MiningLogsRoot: ['api', 'x0Mining', 'logs'] as const,
    x0MiningLogs: (params: X0MiningLogsParams = {}) =>
      [
        'api',
        'x0Mining',
        'logs',
        params.page ?? 1,
        params.page_size ?? 20,
        params.operation ?? null,
      ] as const,
    x0MiningPositionsRoot: ['api', 'x0Mining', 'positions'] as const,
    x0MiningPositions: (params: PaginationParams = {}) =>
      ['api', 'x0Mining', 'positions', params.page ?? 1, params.page_size ?? 20] as const,
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
    stakingHubOverview: ['chain', 'staking', 'hubOverview'] as const,
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
    /** Wallet prefix — amount varies; useChainQuery appends address. */
    assetsContributionForAmount: (amount: string) =>
      ['chain', 'assets', 'contribution', amount] as const,
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
