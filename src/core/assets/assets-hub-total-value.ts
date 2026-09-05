function amountOrZero(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0
}

export type AssetsHubPiePositions = {
  stake: number
  lpbond: number
  burnbond: number
  xmine: number
}

/**
 * 资产 Hub「总持仓」数量：持仓分布四卡仓位相加（质押 / LP / 销毁 / X 挖矿）。
 *
 * X 的 gAGX 按 1:1 当 AGX。不含缓冲池、不含可领取收益。非法或负数按 0。
 *
 * @returns 四卡数量之和（AGX 口径）
 * @see src/views/dapp/assets/hub/use-hub.ts
 */
export function assetsHubPieHoldingsAmount(args: AssetsHubPiePositions): number {
  return (
    amountOrZero(args.stake) +
    amountOrZero(args.lpbond) +
    amountOrZero(args.burnbond) +
    amountOrZero(args.xmine)
  )
}

/**
 * 资产 Hub「总资产价值」美元数：持仓分布四卡仓位 + 可领取收益，按 AGX 现价估值。
 *
 * 四卡与环形图同源（质押 / LP / 销毁 / X 挖矿仓位）。可领 gAGX 与 AGX 1:1。
 * 不含缓冲池、不含 X 待领。无有效价格或非法数量无法估值 → `null`；单价 0 估值为 0。
 *
 * @param args.stake 质押仓位（AGX）
 * @param args.lpbond LP 债券仓位（AGX）
 * @param args.burnbond 销毁债券仓位（AGX）
 * @param args.xmine X 挖矿仓位（gAGX）
 * @param args.claimable 可领取收益（gAGX）
 * @param args.priceUsd AGX 美元价；缺失或非正则无法估值
 * @returns 美元估值；无法估值时 `null`
 * @see src/views/dapp/assets/hub/use-hub.ts
 */
export function assetsHubTotalValueUsd(
  args: AssetsHubPiePositions & {
    claimable: number
    priceUsd: number | null | undefined
  },
): number | null {
  if (args.priceUsd == null || !Number.isFinite(args.priceUsd) || args.priceUsd < 0) return null
  return (assetsHubPieHoldingsAmount(args) + amountOrZero(args.claimable)) * args.priceUsd
}
