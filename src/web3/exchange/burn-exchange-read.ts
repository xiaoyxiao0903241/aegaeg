import { parseAbi } from 'viem'

import { ZERO_ADDRESS } from '~/core/constants'
import type { BurnContributionSwapConfig } from '~/core/exchange/burn-contribution-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AGX_CONTRIBUTION_SWAP_METHODS, ERC20_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

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

/**
 * 读取销毁换贡献值的全局配置
 *
 * 调用 AgxContributionSwap.getConfig / getSplitConfig，
 * 返回汇率、暂停、上下限、累计销毁与分配比例等展示与预检所需字段。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 销毁配置（含 agxToken 地址）
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
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

/**
 * 估算销毁 AGX 可获得的贡献值数量
 *
 * 调用 `quoteContributionOut`；数量为 0 时直接返回 0，不发起链上读取。
 *
 * @param agxAmount 拟销毁的 AGX 数量
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 预期贡献值数量；agxAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
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

/**
 * 读取用户销毁页统计
 *
 * 先经 `originalOf` 解析迁移根地址（别名感知），再按根地址读贡献值、
 * 按原地址读已销毁 AGX 与已消耗贡献值；已得贡献值 = 余额 + 已消耗。
 *
 * @param user 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 贡献值余额 / 已销毁 AGX / 已消耗 / 已得贡献值
 * @see 手册 §9.2 贡献值页面
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
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
  // originalOf==0 与资产页 readContributionSnapshot 一致：回退当前用户
  const contributionRoot =
    root.toLowerCase() === ZERO_ADDRESS ? userAddress : (root as `0x${string}`)

  const [contributionBalance, agxBurned, contributionConsumed] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userContribution',
      args: [contributionRoot],
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

/**
 * 读取销毁页 AGX 余额与授权
 *
 * 返回 AGX 可卖余额与对 AgxContributionSwap 的授权额度，
 * 供输入上限与 approve 判断使用。
 *
 * @param owner 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns AGX 余额与授权额度
 */
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
