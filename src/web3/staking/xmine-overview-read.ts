import { encodeFunctionData, parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { formatNumber } from '~/shared/presenters/format'
import { ERC20_METHODS, X_STAKING_POOL_METHODS } from '~/web3/abis'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

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
 * 并行读取 xPerAgx、日收益率基点与池内 gAGX 余额（一次 Multicall3），供 X 挖矿页展示。
 *
 * @returns xPerAgx / yieldRateBP / totalStakedGagx
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function readXmineOverview(): Promise<XmineOverview> {
  const pool = BSC_CONTRACTS.xStakingPool
  const results = await readAggregate3([
    {
      target: pool,
      callData: encodeFunctionData({ abi: overviewAbi, functionName: 'xPerAgx' }),
    },
    {
      target: pool,
      callData: encodeFunctionData({ abi: overviewAbi, functionName: 'yieldRateBP' }),
    },
    {
      target: BSC_CONTRACTS.gagx,
      callData: encodeFunctionData({
        abi: gagxBalanceAbi,
        functionName: 'balanceOf',
        args: [pool],
      }),
    },
  ])
  return {
    xPerAgx: decodeAggregate3Result<bigint>(
      results,
      0,
      overviewAbi,
      'xPerAgx',
      'XMINE_OVERVIEW_MULTICALL_FAILED:xPerAgx',
    ),
    yieldRateBP: decodeAggregate3Result<bigint>(
      results,
      1,
      overviewAbi,
      'yieldRateBP',
      'XMINE_OVERVIEW_MULTICALL_FAILED:yieldRateBP',
    ),
    totalStakedGagx: decodeAggregate3Result<bigint>(
      results,
      2,
      gagxBalanceAbi,
      'balanceOf',
      'XMINE_OVERVIEW_MULTICALL_FAILED:totalStakedGagx',
    ),
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

/**
 * 用 AGX 现价和链上 xPerAgx 折 X 美元价。
 *
 * @param spotUsd AGX 现价
 * @param xPerAgx 1e18 标度 X-per-AGX
 * @returns X 美元价；缺数或无效为 null
 */
export function xUsdFromAgxSpot(spotUsd: number, xPerAgx: bigint): number | null {
  const agxPerX = agxAmountPerXFromXPerAgx(xPerAgx)
  if (!(spotUsd > 0) || agxPerX <= 0n) return null
  const px = (spotUsd * Number(agxPerX)) / Number(AGX_DECIMALS_FACTOR)
  return Number.isFinite(px) && px > 0 ? px : null
}
