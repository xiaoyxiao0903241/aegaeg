import { parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { formatNumber } from '~/shared/presenters/format'
import { ERC20_METHODS, X_STAKING_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const overviewAbi = parseAbi([X_STAKING_POOL_METHODS.xPerAgx, X_STAKING_POOL_METHODS.yieldRateBP])
const gagxBalanceAbi = parseAbi([ERC20_METHODS.balanceOf])

/** `xPerAgx` 存储标度：1e18 → 人类可读「X per AGX」。 */
const X_PER_AGX_SCALE = 10n ** 18n
/** AGX 9 decimals — 「每 X 的 AGX」链上量。 */
const AGX_DECIMALS_FACTOR = 10n ** 9n

export type XmineOverview = {
  xPerAgx: bigint
  yieldRateBP: bigint
  /**
   * 协议内 X 挖矿总质押（gAGX）：`RewardGAGX.balanceOf(XStakingPool)`。
   * 含 active + warmup 锁在池内的 gAGX；勿用 `activeGons` 冒充金额。
   */
  totalStakedGagx: bigint
}

/**
 * 读取 Xmine 概览（公开，无钱包依赖）
 *
 * 并行读取 xPerAgx、日收益率基点与池内 gAGX 余额，供 X 挖矿页展示。
 *
 * @returns xPerAgx / yieldRateBP / totalStakedGagx
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function readXmineOverview(): Promise<XmineOverview> {
  const [xPerAgx, yieldRateBP, totalStakedGagx] = await Promise.all([
    bscReadClient.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: overviewAbi,
      functionName: 'xPerAgx',
    }),
    bscReadClient.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: overviewAbi,
      functionName: 'yieldRateBP',
    }),
    bscReadClient.readContract({
      address: BSC_CONTRACTS.gagx,
      abi: gagxBalanceAbi,
      functionName: 'balanceOf',
      args: [BSC_CONTRACTS.xStakingPool],
    }),
  ])
  return {
    xPerAgx: xPerAgx as bigint,
    yieldRateBP: yieldRateBP as bigint,
    totalStakedGagx: totalStakedGagx as bigint,
  }
}

/** 日收益率：yieldRateBP / 100 → %（1 BP = 0.01%；公式分母 10000）。 */
export function formatXmineDailyYieldLabel(yieldRateBP: bigint): string {
  const pct = Number(yieldRateBP) / 100
  if (!Number.isFinite(pct)) {
    return `${formatNumber(0, { digits: 2 })}%`
  }
  return `${formatNumber(pct, { digits: 2 })}%`
}

/**
 * 1 X 折合 AGX（9 decimals）。
 * `xPerAgx` = 1e18 标度 X-per-AGX → AGX-per-X = 1e18 / xPerAgx（× 1e9）。
 */
export function agxAmountPerXFromXPerAgx(xPerAgx: bigint): bigint {
  if (xPerAgx === 0n) return 0n
  return (X_PER_AGX_SCALE * AGX_DECIMALS_FACTOR) / xPerAgx
}
