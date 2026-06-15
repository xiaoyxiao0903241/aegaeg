import type { PaginationParams } from '../api/types'

export const queryKeys = {
  api: {
    all: ['api'] as const,
    performance: ['api', 'performance'] as const,
    salesLogs: (params: PaginationParams = {}) =>
      ['api', 'salesLogs', params.page ?? 1, params.page_size ?? 20] as const,
    rewardLogs: (params: PaginationParams = {}) =>
      ['api', 'rewardLogs', params.page ?? 1, params.page_size ?? 20] as const,
    referralTotal: ['api', 'referralTotal'] as const,
    teamRewardTotal: ['api', 'teamRewardTotal'] as const,
    teamReferrals: (params: PaginationParams = {}) =>
      ['api', 'teamReferrals', params.page ?? 1, params.page_size ?? 20] as const,
  },
  chain: {
    presalePhases: ['chain', 'presale', 'phases'] as const,
    presaleActivePhase: ['chain', 'presale', 'activePhase'] as const,
    presaleAgxPrice: ['chain', 'presale', 'agxPrice'] as const,
    presaleUserTotal: (address: string) => ['chain', 'presale', 'userTotal', address] as const,
    erc20Balance: (token: string, address: string) =>
      ['chain', 'erc20', 'balance', token, address] as const,
    erc20Allowance: (token: string, owner: string, spender: string) =>
      ['chain', 'erc20', 'allowance', token, owner, spender] as const,
    referral: (address: string) => ['chain', 'referral', address] as const,
    pairSpotRate: ['chain', 'swap', 'pairSpotRate'] as const,
    swapQuote: (tokenIn: string, tokenOut: string, amountIn: string) =>
      ['chain', 'swap', 'quote', tokenIn, tokenOut, amountIn] as const,
    walletBalances: (address: string) => ['chain', 'wallet', 'balances', address] as const,
    swapBalances: (address: string, sellToken: string, buyToken: string) =>
      ['chain', 'swap', 'balances', address, sellToken, buyToken] as const,
  },
} as const
