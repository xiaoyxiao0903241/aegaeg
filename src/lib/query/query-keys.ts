import type { PaginationParams } from '~/lib/api/types'

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
    teamRewardClaimLogsRoot: ['api', 'teamRewardClaimLogs'] as const,
    teamRewardClaimLogs: (params: PaginationParams = {}) =>
      ['api', 'teamRewardClaimLogs', params.page ?? 1, params.page_size ?? 20] as const,
    teamReferralsRoot: ['api', 'teamReferrals'] as const,
    teamReferrals: (params: PaginationParams = {}) =>
      ['api', 'teamReferrals', params.page ?? 1, params.page_size ?? 20] as const,
    teamOverview: ['api', 'teamOverview'] as const,
    qualifiedPartitions: ['api', 'performance', 'qualified-partitions'] as const,
  },
  chain: {
    presalePhases: ['chain', 'presale', 'phases'] as const,
    presaleActivePhase: ['chain', 'presale', 'activePhase'] as const,
    presaleAgxPrice: ['chain', 'presale', 'agxPrice'] as const,
    presaleTotalPurchased: ['chain', 'presale', 'totalPurchased'] as const,
    presaleAirdropThreshold: ['chain', 'presale', 'airdropThreshold'] as const,
    presaleUserTotal: (address: string) =>
      ['chain', 'presale', 'userTotal', address.toLowerCase()] as const,
    presaleUserPhaseRemaining: (address: string, phaseIndex: number) =>
      ['chain', 'presale', 'userPhaseRemaining', address.toLowerCase(), phaseIndex] as const,
    erc20Balance: (token: string, address: string) =>
      ['chain', 'erc20', 'balance', token.toLowerCase(), address.toLowerCase()] as const,
    erc20Allowance: (token: string, owner: string, spender: string) =>
      ['chain', 'erc20', 'allowance', token.toLowerCase(), owner.toLowerCase(), spender.toLowerCase()] as const,
    referral: (address: string) => ['chain', 'referral', address.toLowerCase()] as const,
    referralIsBound: (address: string) =>
      ['chain', 'referral', 'isBound', address.toLowerCase()] as const,
    pairSpotRate: ['chain', 'swap', 'pairSpotRate'] as const,
    swapQuote: (tokenIn: string, tokenOut: string, amountIn: string) =>
      ['chain', 'swap', 'quote', tokenIn.toLowerCase(), tokenOut.toLowerCase(), amountIn] as const,
    swapBalances: (address: string, sellToken: string, buyToken: string) =>
      ['chain', 'swap', 'balances', address.toLowerCase(), sellToken.toLowerCase(), buyToken.toLowerCase()] as const,
    flashSwapQuote: (usdtAmount: string) =>
      ['chain', 'flashSwap', 'quote', usdtAmount] as const,
    flashSwapBalances: (address: string) =>
      ['chain', 'flashSwap', 'balances', address.toLowerCase()] as const,
    flashSwapRate: ['chain', 'flashSwap', 'rate'] as const,
  },
} as const
