/** Personal contribution USD thresholds for S1–S6 (aligned with Rewards tier table). */
export const PERSONAL_PRESALE_RANK_THRESHOLDS_USD = [500, 1000, 2000, 3000, 5000, 10000] as const

export function inferPersonalPresaleRank(personalVolumeUsd: number): number {
  if (!Number.isFinite(personalVolumeUsd) || personalVolumeUsd <= 0) return 0
  let rank = 0
  for (let index = 0; index < PERSONAL_PRESALE_RANK_THRESHOLDS_USD.length; index += 1) {
    if (personalVolumeUsd >= PERSONAL_PRESALE_RANK_THRESHOLDS_USD[index]) {
      rank = index + 1
    }
  }
  return rank
}

/** Prefer API rank; fall back to personal volume when backend has not indexed rank yet. */
export function resolveDisplayPresaleRank(apiRank: number, personalVolumeUsd: number): number {
  const normalizedApiRank = Number.isFinite(apiRank) ? Math.max(0, Math.trunc(apiRank)) : 0
  return Math.max(normalizedApiRank, inferPersonalPresaleRank(personalVolumeUsd))
}
