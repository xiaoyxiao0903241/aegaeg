import type { QueryKey } from '@tanstack/react-query'

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

/** React Query 缓存键的唯一构造点：API 查询、链上读取与失效共用。 */

/** 追加小写钱包地址——钱包作用域链上查询缓存键。 */
export function chainWalletQueryKey(prefix: QueryKey, address: string): QueryKey {
  return [...prefix, address.toLowerCase()]
}

/** 分页查询键尾段：page / page_size 默认 1 / 20。 */
function paginated<const P extends readonly unknown[]>(
  prefix: P,
  params: PaginationParams = {},
  ...extra: unknown[]
) {
  return [...prefix, params.page ?? 1, params.page_size ?? 20, ...extra] as const
}

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
    makingOverview: ['api', 'performance', 'makingOverview'] as const,
    stakeAddressCount: ['api', 'performance', 'stakeAddressCount'] as const,
    protocolMarketStatsSeriesRoot: ['api', 'protocolMarketStats', 'series'] as const,
    protocolMarketStatsSeries: (range: string, metric: string) =>
      ['api', 'protocolMarketStats', 'series', range, metric] as const,
    salesLogsRoot: ['api', 'salesLogs'] as const,
    salesLogs: (params: PaginationParams = {}) => paginated(['api', 'salesLogs'] as const, params),
    rewardLogsRoot: ['api', 'rewardLogs'] as const,
    rewardLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'rewardLogs'] as const, params),
    referralTotal: ['api', 'referralTotal'] as const,
    teamRewardTotal: ['api', 'teamRewardTotal'] as const,
    communityFundTotal: ['api', 'communityFundTotal'] as const,
    communityFundLogsRoot: ['api', 'communityFundLogs'] as const,
    communityFundLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'communityFundLogs'] as const, params),
    teamRewardClaimLogsRoot: ['api', 'teamRewardClaimLogs'] as const,
    teamRewardClaimLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'teamRewardClaimLogs'] as const, params),
    teamReferralsRoot: ['api', 'teamReferrals'] as const,
    teamReferrals: (params: PaginationParams = {}) =>
      paginated(['api', 'teamReferrals'] as const, params),
    teamOverview: ['api', 'teamOverview'] as const,
    qualifiedPartitions: ['api', 'performance', 'qualified-partitions'] as const,
    homePopupNotices: (locale: string) => ['api', 'home', 'popupNotices', locale] as const,
    agxContributionSummary: ['api', 'agxContribution', 'summary'] as const,
    agxContributionBurnLogsRoot: ['api', 'agxContribution', 'burnLogs'] as const,
    agxContributionBurnLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'agxContribution', 'burnLogs'] as const, params),
    agxContributionConsumeLogsRoot: ['api', 'agxContribution', 'consumeLogs'] as const,
    agxContributionConsumeLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'agxContribution', 'consumeLogs'] as const, params),
    assetsHoldingsDistribution: ['api', 'assets', 'holdingsDistribution'] as const,
    assetsHoldingsSummary: ['api', 'assets', 'holdingsSummary'] as const,
    assetsRewardSummary: ['api', 'assets', 'rewardSummary'] as const,
    bondFlowLpLogsRoot: ['api', 'bondFlow', 'lpLogs'] as const,
    bondFlowLpLogs: (params: BondFlowLogsParams = {}) =>
      paginated(['api', 'bondFlow', 'lpLogs'] as const, params, params.operation ?? null),
    bondFlowBurnLogsRoot: ['api', 'bondFlow', 'burnLogs'] as const,
    bondFlowBurnLogs: (params: BondFlowLogsParams = {}) =>
      paginated(['api', 'bondFlow', 'burnLogs'] as const, params, params.operation ?? null),
    bondFlowLpPurchasesRoot: ['api', 'bondFlow', 'lpPurchases'] as const,
    bondFlowLpPurchases: (params: PaginationParams = {}) =>
      paginated(['api', 'bondFlow', 'lpPurchases'] as const, params),
    bondFlowBurnPurchasesRoot: ['api', 'bondFlow', 'burnPurchases'] as const,
    bondFlowBurnPurchases: (params: PaginationParams = {}) =>
      paginated(['api', 'bondFlow', 'burnPurchases'] as const, params),
    bufferPoolSummary: ['api', 'bufferPool', 'summary'] as const,
    bufferPoolLogsRoot: ['api', 'bufferPool', 'logs'] as const,
    bufferPoolLogs: (params: BufferPoolLogsParams = {}) =>
      paginated(['api', 'bufferPool', 'logs'] as const, params, params.event_type ?? null),
    luckyRewardSummary: ['api', 'luckyReward', 'summary'] as const,
    luckyRewardMyRoundsRoot: ['api', 'luckyReward', 'myRounds'] as const,
    luckyRewardMyRounds: (params: PaginationParams = {}) =>
      paginated(['api', 'luckyReward', 'myRounds'] as const, params),
    luckyRewardWinnersRoot: ['api', 'luckyReward', 'winners'] as const,
    luckyRewardWinners: (date: string) => ['api', 'luckyReward', 'winners', date] as const,
    marketAllowanceSummary: ['api', 'marketAllowance', 'summary'] as const,
    marketAllowanceClaimLogsRoot: ['api', 'marketAllowance', 'claimLogs'] as const,
    marketAllowanceClaimLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'marketAllowance', 'claimLogs'] as const, params),
    marketAllowancePaidLogsRoot: ['api', 'marketAllowance', 'paidLogs'] as const,
    marketAllowancePaidLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'marketAllowance', 'paidLogs'] as const, params),
    participationAwardSummary: ['api', 'participationAward', 'summary'] as const,
    participationAwardLogsRoot: ['api', 'participationAward', 'logs'] as const,
    participationAwardLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'participationAward', 'logs'] as const, params),
    participationAwardInviter: ['api', 'participationAward', 'inviter'] as const,
    rankRewardSummary: ['api', 'rankReward', 'summary'] as const,
    rankRewardLogsRoot: ['api', 'rankReward', 'logs'] as const,
    rankRewardLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'rankReward', 'logs'] as const, params),
    rankRewardPeerSurpassLogsRoot: ['api', 'rankReward', 'peerSurpassLogs'] as const,
    rankRewardPeerSurpassLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'rankReward', 'peerSurpassLogs'] as const, params),
    rankRewardTeamMembersRoot: ['api', 'rankReward', 'teamMembers'] as const,
    rankRewardTeamMembers: (params: RankRewardTeamMembersParams = {}) =>
      paginated(
        ['api', 'rankReward', 'teamMembers'] as const,
        params,
        params.sort_time ?? null,
        params.hide_zero_market ?? null,
      ),
    referralAwardSummary: ['api', 'referralAward', 'summary'] as const,
    referralAwardLogsRoot: ['api', 'referralAward', 'logs'] as const,
    referralAwardLogs: (params: PaginationParams = {}) =>
      paginated(['api', 'referralAward', 'logs'] as const, params),
    referralAwardDirectReferralsRoot: ['api', 'referralAward', 'directReferrals'] as const,
    referralAwardDirectReferrals: (params: ReferralAwardDirectReferralsParams = {}) =>
      paginated(
        ['api', 'referralAward', 'directReferrals'] as const,
        params,
        params.hide_zero_position ?? null,
      ),
    releasePoolSummary: ['api', 'releasePool', 'summary'] as const,
    releasePoolLogsRoot: ['api', 'releasePool', 'logs'] as const,
    releasePoolLogs: (params: ReleasePoolLogsParams = {}) =>
      paginated(['api', 'releasePool', 'logs'] as const, params, params.event_type ?? null),
    stakeFlowLogsRoot: ['api', 'stakeFlow', 'logs'] as const,
    stakeFlowLogs: (params: StakeFlowLogsParams = {}) =>
      paginated(['api', 'stakeFlow', 'logs'] as const, params, params.operation ?? null),
    stakeFlowPositionsRoot: ['api', 'stakeFlow', 'positions'] as const,
    stakeFlowPositions: (params: PaginationParams = {}) =>
      paginated(['api', 'stakeFlow', 'positions'] as const, params),
    turbineSummary: ['api', 'turbine', 'summary'] as const,
    turbineLogsRoot: ['api', 'turbine', 'logs'] as const,
    turbineLogs: (params: TurbineLogsParams = {}) =>
      paginated(['api', 'turbine', 'logs'] as const, params, params.turbine_type ?? null),
    x0MiningLogsRoot: ['api', 'x0Mining', 'logs'] as const,
    x0MiningLogs: (params: X0MiningLogsParams = {}) =>
      paginated(['api', 'x0Mining', 'logs'] as const, params, params.operation ?? null),
    /** 用户 REWARD 流水翻页累加（终身产出）；与单页 logs 键分离 */
    x0MiningLifetimeReward: ['api', 'x0Mining', 'lifetimeReward'] as const,
    x0MiningPositionsRoot: ['api', 'x0Mining', 'positions'] as const,
    x0MiningPositions: (params: PaginationParams = {}) =>
      paginated(['api', 'x0Mining', 'positions'] as const, params),
  },
  chain: {
    erc20Root: ['chain', 'erc20'] as const,
    referralRoot: ['chain', 'referral'] as const,
    swapRoot: ['chain', 'swap'] as const,
    flashSwapRoot: ['chain', 'flashSwap'] as const,
    burnSwapRoot: ['chain', 'burnSwap'] as const,
    presaleUserPhaseRemainingRoot: ['chain', 'presale', 'userPhaseRemaining'] as const,
    presalePhases: ['chain', 'presale', 'phases'] as const,
    /** 最新块 timestamp（秒）；创世阶段门闸用，展示倒计时仍可用墙钟。 */
    latestBlockTimestamp: ['chain', 'block', 'latestTimestamp'] as const,
    presaleAgxPrice: ['chain', 'presale', 'agxPrice'] as const,
    presaleTotalPurchased: ['chain', 'presale', 'totalPurchased'] as const,
    presaleAirdropThreshold: ['chain', 'presale', 'airdropThreshold'] as const,
    presalePaused: ['chain', 'presale', 'paused'] as const,
    /** 钱包前缀键——useChainQuery 自动追加地址。 */
    presaleUserTotal: ['chain', 'presale', 'userTotal'] as const,
    presaleUserTotalOf: (address: string) =>
      chainWalletQueryKey(['chain', 'presale', 'userTotal'], address),
    presaleUserPhaseRemainingByUser: (address: string) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase()] as const,
    presaleUserPhaseRemaining: (address: string, phaseIndex: number) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase(), phaseIndex] as const,
    presalePreviewAirdropValue: (user: string, phaseIndex: number, purchaseAmount: string) =>
      [
        'chain',
        'presale',
        'previewAirdropValue',
        user.toLowerCase(),
        phaseIndex,
        purchaseAmount,
      ] as const,
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
    /** AGX/USD1 V2 即时价——每 1 AGX 对应 USD1 wei 数（展示/估值用；非 PreSale 定价）。 */
    agxUsd1SpotPrice: ['chain', 'swap', 'agxUsd1SpotPrice'] as const,
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
    turbineSwapSlippage: ['chain', 'turbine', 'swapSlippageBP'] as const,
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
    /** 公开键——xPerAgx / yieldRateBP / totalStakedGagx 概览数据。 */
    xmineOverview: ['chain', 'staking', 'xmine', 'overview'] as const,
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
    /** 钱包前缀键——金额不同键不同；useChainQuery 自动追加地址。 */
    assetsContributionForAmount: (amount: string) =>
      ['chain', 'assets', 'contribution', amount] as const,
    rewardsRoot: ['chain', 'rewards'] as const,
    rewardsLuckyClaim: ['chain', 'rewards', 'lucky'] as const,
    rewardsLuckyClaimOf: (address: string) =>
      chainWalletQueryKey(['chain', 'rewards', 'lucky'], address),
    rewardsLuckyRoundDisplay: ['chain', 'rewards', 'luckyRound'] as const,
    rewardsLuckyRoundDisplayOf: (address: string) =>
      chainWalletQueryKey(['chain', 'rewards', 'luckyRound'], address),
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
    releaseDuration: ['chain', 'release', 'duration'] as const,
    releaseQueuePlans: ['chain', 'release', 'queuePlans'] as const,
  },
} as const
