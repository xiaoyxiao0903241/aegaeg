import { parseAbi } from 'viem'

import { formatGroupedNumber } from '~/shared/api/format-display'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { X_STAKING_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const overviewAbi = parseAbi([
  X_STAKING_POOL_METHODS.xPerAgx,
  X_STAKING_POOL_METHODS.yieldRateBP,
  X_STAKING_POOL_METHODS.activeGons,
])

/** `xPerAgx` 存储标度：1e18 → 人类可读「X per AGX」。 */
const X_PER_AGX_SCALE = 10n ** 18n
/** AGX 9 decimals — 「每 X 的 AGX」链上量。 */
const AGX_DECIMALS_FACTOR = 10n ** 9n

export type XmineOverview = {
  xPerAgx: bigint
  yieldRateBP: bigint
  activeGons: bigint
}

/** 公共读 — Xmine 概览/meta（手册 contracts/xstakingpool 管理员视图）。 */
export async function readXmineOverview(
  client: ChainReadClient = bscReadClient,
): Promise<XmineOverview> {
  const [xPerAgx, yieldRateBP, activeGons] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: overviewAbi,
      functionName: 'xPerAgx',
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: overviewAbi,
      functionName: 'yieldRateBP',
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: overviewAbi,
      functionName: 'activeGons',
    }),
  ])
  return {
    xPerAgx: xPerAgx as bigint,
    yieldRateBP: yieldRateBP as bigint,
    activeGons: activeGons as bigint,
  }
}

/** 日收益率：yieldRateBP / 100 → %（1 BP = 0.01%；公式分母 10000）。 */
export function formatXmineDailyYieldLabel(yieldRateBP: bigint): string {
  const pct = Number(yieldRateBP) / 100
  if (!Number.isFinite(pct)) {
    return `${formatGroupedNumber(0, { digits: 2 })}%`
  }
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}

/**
 * 1 X 折合 AGX（9 decimals）。
 * `xPerAgx` = 1e18 标度 X-per-AGX → AGX-per-X = 1e18 / xPerAgx（× 1e9）。
 */
export function agxAmountPerXFromXPerAgx(xPerAgx: bigint): bigint {
  if (xPerAgx === 0n) return 0n
  return (X_PER_AGX_SCALE * AGX_DECIMALS_FACTOR) / xPerAgx
}
