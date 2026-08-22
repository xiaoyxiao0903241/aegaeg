import { encodeFunctionData, parseAbi } from 'viem'

import { ZERO_ADDRESS } from '~/core/constants'
import type { BurnContributionSwapConfig } from '~/core/exchange/burn-contribution-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AGX_CONTRIBUTION_SWAP_METHODS, ERC20_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const burnSwapReadAbi = parseAbi([
  AGX_CONTRIBUTION_SWAP_METHODS.getConfig,
  AGX_CONTRIBUTION_SWAP_METHODS.getSplitConfig,
  AGX_CONTRIBUTION_SWAP_METHODS.contributionDivisor,
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
 * Multicall3 同批：`getConfig` / `getSplitConfig` / `contributionDivisor`。
 * 返回汇率、暂停、上下限、累计销毁、分配比例与领取消耗除数。
 *
 * @returns 销毁配置（含 agxToken 地址）
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export async function readBurnContributionSwapConfig(): Promise<
  BurnContributionSwapConfig & { agxToken: `0x${string}` }
> {
  const target = BSC_CONTRACTS.agxContributionSwap
  const results = await readAggregate3([
    {
      target,
      callData: encodeFunctionData({ abi: burnSwapReadAbi, functionName: 'getConfig' }),
    },
    {
      target,
      callData: encodeFunctionData({ abi: burnSwapReadAbi, functionName: 'getSplitConfig' }),
    },
    {
      target,
      callData: encodeFunctionData({
        abi: burnSwapReadAbi,
        functionName: 'contributionDivisor',
      }),
    },
  ])
  const result = decodeAggregate3Result<
    readonly [string, number, bigint, boolean, bigint, bigint, bigint, bigint]
  >(results, 0, burnSwapReadAbi, 'getConfig', 'BURN_SWAP_GET_CONFIG_FAILED')
  const split = decodeAggregate3Result<readonly [string, bigint, bigint, bigint, bigint]>(
    results,
    1,
    burnSwapReadAbi,
    'getSplitConfig',
    'BURN_SWAP_GET_SPLIT_FAILED',
  )
  const contributionDivisor = decodeAggregate3Result<bigint>(
    results,
    2,
    burnSwapReadAbi,
    'contributionDivisor',
    'BURN_SWAP_CONTRIBUTION_DIVISOR_FAILED',
  )
  const [, decimals_, rateBps_, isPaused, minIn, maxIn, totalBurned, totalContribution] = result
  const [, splitBps] = split
  return {
    agxToken: result[0] as `0x${string}`,
    decimals: Number(decimals_),
    rateBps: rateBps_,
    isPaused,
    minIn,
    maxIn,
    totalBurned,
    totalContribution,
    splitBps,
    contributionDivisor,
  }
}

/**
 * 估算销毁 AGX 可获得的贡献值数量
 *
 * 调用 `quoteContributionOut`；数量为 0 时直接返回 0，不发起链上读取。
 *
 * @param agxAmount 拟销毁的 AGX 数量
 * @returns 预期贡献值数量；agxAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export async function readBurnContributionQuote(agxAmount: bigint): Promise<bigint> {
  if (agxAmount === 0n) return 0n
  return bscReadClient.readContract({
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
 * @returns 贡献值余额 / 已销毁 AGX / 已消耗 / 已得贡献值
 * @see 手册 §9.2 贡献值页面
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export async function readBurnUserStats(user: string): Promise<BurnUserStats> {
  const userAddress = user as `0x${string}`
  const root = await bscReadClient.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: burnSwapReadAbi,
    functionName: 'originalOf',
    args: [userAddress],
  })
  // originalOf 返回零地址时与资产页 readContributionSnapshot 同口径：回退当前用户
  const contributionRoot =
    root.toLowerCase() === ZERO_ADDRESS ? userAddress : (root as `0x${string}`)

  const [contributionBalance, agxBurned, contributionConsumed] = await Promise.all([
    bscReadClient.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userContribution',
      args: [contributionRoot],
    }),
    bscReadClient.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: burnSwapReadAbi,
      functionName: 'userAgxBurned',
      args: [userAddress],
    }),
    bscReadClient.readContract({
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
 * @returns AGX 余额与授权额度
 */
export async function readBurnExchangeBalances(owner: string) {
  const ownerAddress = owner as `0x${string}`
  const [sell, approved] = await Promise.all([
    bscReadClient.readContract({
      address: BSC_CONTRACTS.agx,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    bscReadClient.readContract({
      address: BSC_CONTRACTS.agx,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.agxContributionSwap],
    }),
  ])
  return { sell, approved }
}
