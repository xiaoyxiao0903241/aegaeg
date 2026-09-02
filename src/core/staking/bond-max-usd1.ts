import { BPS_DENOM } from '~/core/exchange/bps'
import {
  computeBondPoolAgxPrice,
  computeBurnBondGrossPayout,
  computeGrossBondPayout,
  computeNetBondPayout,
  quoteZapLpAmount,
} from '~/core/staking/bond-payout'
import { bondPurchaseCapAgx } from '~/core/staking/format-bond-debt-remaining'
import type { BondKind } from '~/core/staking/staking-period'

/** Pancake V2 手续费 0.25% → 输入乘 9975 / 10000。 */
const PANCAKE_V2_FEE_NUM = 9975n

export type BondZapPoolSnapshot = {
  reserveU: bigint
  reserveAGX: bigint
  totalSupply: bigint
}

/**
 * Pancake V2 `getAmountOut`（单跳）。
 *
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export function pancakeV2AmountOut(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
): bigint {
  if (amountIn === 0n || reserveIn === 0n || reserveOut === 0n) return 0n
  const amountInWithFee = amountIn * PANCAKE_V2_FEE_NUM
  return (amountInWithFee * reserveOut) / (reserveIn * BPS_DENOM + amountInWithFee)
}

/**
 * Pancake V2 `getAmountIn`（单跳）。输出不少于储备时无法成交，返回 0。
 *
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export function pancakeV2AmountIn(
  amountOut: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
): bigint {
  if (amountOut === 0n || reserveIn === 0n || reserveOut === 0n || amountOut >= reserveOut) {
    return 0n
  }
  return (reserveIn * amountOut * BPS_DENOM) / ((reserveOut - amountOut) * PANCAKE_V2_FEE_NUM) + 1n
}

/**
 * 修复后 calculator `getTotalValue`：`2 × reserveU / 1e9`（USD1 18 / AGX 9）。
 * `valuation` = 该值 × lpAmount / totalSupply。
 *
 * @see docs/onchain-manual/contracts/aegislpbondingcalculator.md
 */
export function lpBondValuationFromReserves(
  lpAmount: bigint,
  reserveU: bigint,
  totalSupply: bigint,
): bigint {
  if (lpAmount === 0n || reserveU === 0n || totalSupply === 0n) return 0n
  const totalValue = (2n * reserveU) / 1_000_000_000n
  return (totalValue * lpAmount) / totalSupply
}

/**
 * 链下复算一笔 USD1 zap 的毛 / 净 AGX（与手册 §10.6 方法二同构）。
 */
export function quoteBondZapPayoutLocal(args: {
  kind: BondKind
  usd1Amount: bigint
  discountRateBP: bigint
  feeBps: bigint
  pool: BondZapPoolSnapshot
}): { grossPayout: bigint; netPayout: bigint } {
  const { kind, usd1Amount, discountRateBP, feeBps, pool } = args
  if (usd1Amount === 0n) return { grossPayout: 0n, netPayout: 0n }

  if (kind === 'burn') {
    const agxOut = pancakeV2AmountOut(usd1Amount, pool.reserveU, pool.reserveAGX)
    const grossPayout = computeBurnBondGrossPayout(agxOut, discountRateBP)
    return { grossPayout, netPayout: computeNetBondPayout(grossPayout, feeBps) }
  }

  const halfUsd = usd1Amount / 2n
  if (halfUsd === 0n) return { grossPayout: 0n, netPayout: 0n }
  const agxOut = pancakeV2AmountOut(halfUsd, pool.reserveU, pool.reserveAGX)
  const lpAmount = quoteZapLpAmount({
    usd1Amount,
    agxOut,
    reserveU: pool.reserveU,
    reserveAGX: pool.reserveAGX,
    totalSupply: pool.totalSupply,
  })
  const value = lpBondValuationFromReserves(lpAmount, pool.reserveU, pool.totalSupply)
  const grossPayout = computeGrossBondPayout({
    value,
    agxPrice: computeBondPoolAgxPrice(pool.reserveU, pool.reserveAGX),
    discountRateBP,
  })
  return { grossPayout, netPayout: computeNetBondPayout(grossPayout, feeBps) }
}

/**
 * 单笔最多可投入的 USD1（使毛发放 ≤ maxPayout 且净发放不超过债务剩余）。
 *
 * `maxDebt === 0` 时债务层不限。池子 AGX 侧将被抽干时，上限止于还能换出的数量。
 *
 * @returns USD1 wei；无法成交时 0
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function maxUsd1ForBondPurchase(args: {
  kind: BondKind
  maxPayoutAmount: bigint
  maxDebt: bigint
  totalDeposit: bigint
  feeBps: bigint
  discountRateBP: bigint
  pool: BondZapPoolSnapshot
}): bigint {
  const { kind, maxPayoutAmount, maxDebt, totalDeposit, feeBps, discountRateBP, pool } = args
  if (pool.reserveU === 0n || pool.reserveAGX <= 1n) return 0n
  if (
    bondPurchaseCapAgx({
      maxPayoutAmount,
      maxDebt,
      totalDeposit,
      feeBps,
    }) === 0n
  ) {
    return 0n
  }

  const remainingNet = maxDebt === 0n ? null : maxDebt - totalDeposit

  function fits(usd1: bigint): boolean {
    if (usd1 === 0n) return true
    const { grossPayout, netPayout } = quoteBondZapPayoutLocal({
      kind,
      usd1Amount: usd1,
      discountRateBP,
      feeBps,
      pool,
    })
    if (grossPayout > maxPayoutAmount) return false
    if (remainingNet != null && netPayout > remainingNet) return false
    return true
  }

  const maxOut = pool.reserveAGX - 1n
  const maxSwapUsd = pancakeV2AmountIn(maxOut, pool.reserveU, pool.reserveAGX)
  if (maxSwapUsd === 0n) return 0n
  const hiStart = kind === 'lp' ? maxSwapUsd * 2n : maxSwapUsd
  if (hiStart === 0n) return 0n
  if (fits(hiStart)) return hiStart

  let lo = 0n
  let hi = hiStart
  while (lo < hi) {
    const mid = (lo + hi + 1n) / 2n
    if (fits(mid)) lo = mid
    else hi = mid - 1n
  }
  return lo
}
