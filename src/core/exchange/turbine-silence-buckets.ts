/**
 * 按链上 isVested 把 silence 余额拆成冷却中 / 可领取两组。
 *
 * 冷却中：`!vested`；可领取：`vested`（可 claimCooledGagx）。
 * 两桶互斥，合计应等于仍在 silences 中的总额。
 *
 * @param rows silence 行（至少含余额与 vested）
 * @returns cooling / claimable 合计（wei）
 * @see 手册 §16 Turbine · isVested / claimCooledGagx
 */
export function sumTurbineSilenceBuckets(
  rows: ReadonlyArray<{ silenceBalance: bigint; vested: boolean }>,
): { cooling: bigint; claimable: bigint } {
  let cooling = 0n
  let claimable = 0n
  for (const row of rows) {
    if (row.vested) claimable += row.silenceBalance
    else cooling += row.silenceBalance
  }
  return { cooling, claimable }
}
