/**
 * 共建级别阶梯与下一档条件
 *
 * A1–A5 看持仓、有效账户、总业绩；A6–A9 在双线之外再开「其他线业绩」第二条路径；
 * A10 起只保留双线。当前已是终身成就则没有下一档。
 *
 * @see docs/backend-api/api.md #rank-reward/summary
 */

export const COBUILD_NAMED_LEVELS = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'A9',
  'A10',
  'A11',
  'A12',
  'A13',
] as const

export const COBUILD_LIFETIME_ID = 'LIFETIME'
export const COBUILD_NONE_ID = 'NONE'
export const COBUILD_DUAL_LINE_TARGET = 2

export type CobuildNamedLevel = (typeof COBUILD_NAMED_LEVELS)[number]
export type CobuildLevelId = typeof COBUILD_NONE_ID | CobuildNamedLevel | typeof COBUILD_LIFETIME_ID

type VolumeTeam = { kind: 'volume'; usd: number }
type DualTeam = { kind: 'dual'; lineLevel: CobuildNamedLevel; otherUsd?: number }

export type CobuildTierDef = {
  id: CobuildNamedLevel | typeof COBUILD_LIFETIME_ID
  holdingUsd: number
  accounts: number
  team: VolumeTeam | DualTeam
}

export const COBUILD_TIER_LADDER: readonly CobuildTierDef[] = [
  { id: 'A1', holdingUsd: 100, accounts: 2, team: { kind: 'volume', usd: 6_000 } },
  { id: 'A2', holdingUsd: 100, accounts: 2, team: { kind: 'volume', usd: 20_000 } },
  { id: 'A3', holdingUsd: 100, accounts: 2, team: { kind: 'volume', usd: 60_000 } },
  { id: 'A4', holdingUsd: 500, accounts: 5, team: { kind: 'volume', usd: 180_000 } },
  { id: 'A5', holdingUsd: 1_000, accounts: 5, team: { kind: 'volume', usd: 550_000 } },
  {
    id: 'A6',
    holdingUsd: 2_000,
    accounts: 5,
    team: { kind: 'dual', lineLevel: 'A5', otherUsd: 1_000_000 },
  },
  {
    id: 'A7',
    holdingUsd: 3_000,
    accounts: 10,
    team: { kind: 'dual', lineLevel: 'A6', otherUsd: 2_000_000 },
  },
  {
    id: 'A8',
    holdingUsd: 5_000,
    accounts: 10,
    team: { kind: 'dual', lineLevel: 'A7', otherUsd: 4_000_000 },
  },
  {
    id: 'A9',
    holdingUsd: 10_000,
    accounts: 10,
    team: { kind: 'dual', lineLevel: 'A8', otherUsd: 8_000_000 },
  },
  { id: 'A10', holdingUsd: 20_000, accounts: 15, team: { kind: 'dual', lineLevel: 'A9' } },
  { id: 'A11', holdingUsd: 30_000, accounts: 15, team: { kind: 'dual', lineLevel: 'A10' } },
  { id: 'A12', holdingUsd: 40_000, accounts: 15, team: { kind: 'dual', lineLevel: 'A11' } },
  { id: 'A13', holdingUsd: 50_000, accounts: 20, team: { kind: 'dual', lineLevel: 'A12' } },
  { id: 'LIFETIME', holdingUsd: 100_000, accounts: 20, team: { kind: 'dual', lineLevel: 'A13' } },
]

export type CobuildReqSpec =
  | { kind: 'holding'; targetUsd: number }
  | { kind: 'accounts'; target: number }
  | { kind: 'volume'; targetUsd: number }
  | { kind: 'dual'; lineLevel: CobuildNamedLevel; target: number }
  | { kind: 'otherLine'; lineLevel: CobuildNamedLevel; targetUsd: number }

/**
 * 接口 `making_rank` → 共建级别。1–13 为 A 档；≥14 为终身成就；其余视为无级别。
 *
 * @param rank `POST /rank-reward/summary` 的 `making_rank`
 * @returns 级别 id
 */
export function cobuildLevelFromRank(rank: number | null | undefined): CobuildLevelId {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return COBUILD_NONE_ID
  const n = Math.trunc(rank)
  if (n >= 14) return COBUILD_LIFETIME_ID
  return COBUILD_NAMED_LEVELS[n - 1] ?? COBUILD_NONE_ID
}

export function cobuildLevelIndex(id: CobuildLevelId): number {
  if (id === COBUILD_NONE_ID) return -1
  return COBUILD_TIER_LADDER.findIndex((row) => row.id === id)
}

export function cobuildNextTier(current: CobuildLevelId): CobuildTierDef | null {
  return COBUILD_TIER_LADDER[cobuildLevelIndex(current) + 1] ?? null
}

/**
 * 下一档晋升条件。无下一档时返回空数组。
 *
 * @param current 当前级别（含「没有级别」）
 * @returns 条件列表；A6–A9 为 4 条（含其他线），其余有下一档时为 3 条
 */
export function cobuildNextReqSpecs(current: CobuildLevelId): CobuildReqSpec[] {
  const next = cobuildNextTier(current)
  if (next == null) return []
  const specs: CobuildReqSpec[] = [
    { kind: 'holding', targetUsd: next.holdingUsd },
    { kind: 'accounts', target: next.accounts },
  ]
  if (next.team.kind === 'volume') {
    specs.push({ kind: 'volume', targetUsd: next.team.usd })
    return specs
  }
  specs.push({
    kind: 'dual',
    lineLevel: next.team.lineLevel,
    target: COBUILD_DUAL_LINE_TARGET,
  })
  if (next.team.otherUsd != null) {
    specs.push({
      kind: 'otherLine',
      lineLevel: next.team.lineLevel,
      targetUsd: next.team.otherUsd,
    })
  }
  return specs
}

export function cobuildReqGridCols(reqCount: number): 2 | 3 {
  return reqCount === 4 ? 2 : 3
}
