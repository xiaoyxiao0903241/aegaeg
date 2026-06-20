/** Personal contribution USD thresholds for S1–S10 (aligned with Rewards tier table). */
export const PERSONAL_PRESALE_RANK_THRESHOLDS_USD = [
  500,
  1000,
  2000,
  3000,
  5000,
  10_000,
  10_000,
  10_000,
  10_000,
  20_000,
] as const

export const MAX_PRESALE_RANK = PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length

/** Normalize API `presale_rank` (S1=1 …) for display; no client-side inference. */
export function resolveDisplayPresaleRank(apiRank: number): number {
  if (!Number.isFinite(apiRank) || apiRank <= 0) return 0
  return Math.min(MAX_PRESALE_RANK, Math.trunc(apiRank))
}
