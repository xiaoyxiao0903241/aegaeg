import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * Turbine 解锁预览：预期实得 AGX
 *
 * 链上 `buyAgxAndStartCooldown` 实际消耗配额 = min(swap 实得, 当前 quota)；
 * swap 按 `swapSlippageBP` 预留下限，预览用同口径，避免把输入配额原样当实得。
 *
 * @param args.unlockAmountIn 用户拟解锁的 AGX 数量
 * @param args.swapSlippageBP 合约 `swapSlippageBP`（BPS）
 * @param args.quota 当前 `turbineBalances` 配额
 * @returns 预览实得 AGX；输入为 0 时返回 0
 * @see docs/onchain-manual/contracts/turbine.md
 */
export function previewTurbineExpectedAgx(args: {
  unlockAmountIn: bigint
  swapSlippageBP: bigint
  quota: bigint
}): bigint {
  const { unlockAmountIn, swapSlippageBP, quota } = args
  if (unlockAmountIn <= 0n) return 0n
  // 非法滑点不在 render 抛错；预览置 0（fail-closed）
  if (swapSlippageBP < 0n || swapSlippageBP >= BPS_DENOM) return 0n
  const afterSlippage = (unlockAmountIn * (BPS_DENOM - swapSlippageBP)) / BPS_DENOM
  return afterSlippage < quota ? afterSlippage : quota
}
