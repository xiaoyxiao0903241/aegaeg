/**
 * 质押仓位「已释放 / 待释放」聚合（活期不套锁定期公式）。
 *
 * Liquid 链上无 getReleasedPrincipal：本金在池内，claimPrincipal 后进 Splitter。
 * 活期对这两格贡献 0；锁定期用 releasedPrincipal 与 principal−released。
 *
 * @see 手册 LiquidStaking / LockedStaking.getReleasedPrincipal
 */

export type StakeReleaseRow = {
  kind: 'liquid' | 'locked'
  principal: bigint
  releasedPrincipal: bigint
}

export type StakeReleaseAggregate = {
  released: bigint
  pending: bigint
}

/**
 * 聚合已释放与待释放本金；跳过 liquid 行。
 */
export function aggregateStakeRelease(rows: ReadonlyArray<StakeReleaseRow>): StakeReleaseAggregate {
  let released = 0n
  let pending = 0n
  for (const row of rows) {
    if (row.kind === 'liquid') continue
    released += row.releasedPrincipal
    pending += row.principal > row.releasedPrincipal ? row.principal - row.releasedPrincipal : 0n
  }
  return { released, pending }
}
