import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AGX_CONTRIBUTION_SWAP_METHODS, ERC20_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { BurnContributionSwapConfig } from '~/core/exchange/burn-contribution-swap'

const burnSwapReadAbi = parseAbi([
  AGX_CONTRIBUTION_SWAP_METHODS.getConfig,
  AGX_CONTRIBUTION_SWAP_METHODS.getSplitConfig,
  AGX_CONTRIBUTION_SWAP_METHODS.quoteContributionOut,
  AGX_CONTRIBUTION_SWAP_METHODS.originalOf,
  AGX_CONTRIBUTION_SWAP_METHODS.userContribution,
  AGX_CONTRIBUTION_SWAP_METHODS.userAgxBurned,
  AGX_CONTRIBUTION_SWAP_METHODS.userContributionConsumed,
])

const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export type BurnUserStats = {
  contributionBalance: bigint
  agxBurned: bigint
  contributionConsumed: bigint
  contributionEarned: bigint
}

export async function readBurnContributionSwapConfig(
  client: ChainReadClient = bscReadClient,
): Promise<BurnContributionSwapConfig & { agxToken: `0x${string}` }> {
  const [result, split] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'getConfig',
    }),
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'getSplitConfig',
    }),
  ])
  const [, decimals_, rateBps_, isPaused, minIn, maxIn, totalBurned, totalContribution] = result
  const [, splitBps] = split
  return {
    agxToken: result[0],
    decimals: Number(decimals_),
    rateBps: rateBps_,
    isPaused,
    minIn,
    maxIn,
    totalBurned,
    totalContribution,
    splitBps,
  }
}

export async function readBurnContributionQuote(
  agxAmount: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (agxAmount === 0n) return 0n
  return client.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: burnSwapReadAbi,
    functionName: 'quoteContributionOut',
    args: [agxAmount],
  })
}

export async function readBurnUserStats(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<BurnUserStats> {
  const userAddress = user as `0x${string}`
  const root = await client.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: burnSwapReadAbi,
    functionName: 'originalOf',
    args: [userAddress],
  })

  const [contributionBalance, agxBurned, contributionConsumed] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userContribution',
      args: [root],
    }),
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userAgxBurned',
      args: [userAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userContributionConsumed',
      args: [userAddress],
    }),
  ])

  return {
    contributionBalance,
    agxBurned,
    contributionConsumed,
    contributionEarned: contributionBalance + contributionConsumed,
  }
}

export async function readBurnExchangeBalances(
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const [sell, approved] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.agx,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.agx,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.agxContributionSwap],
    }),
  ])
  return { sell, approved }
}
