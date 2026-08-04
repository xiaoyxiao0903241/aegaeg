import type { SeasonOption } from '~/core/presale/genesis-promo-types'

/**
 * 共建计划是否已全部结束：无进行中 phase，且无 Upcoming。
 * loading 中 fail-closed 为未结束，避免 CTA/空态闪成「已结束」。
 */
export function isGenesisProgramEnded(args: {
  isLoading: boolean
  activePhase: unknown | null
  seasonOptions: ReadonlyArray<Pick<SeasonOption, 'status'>>
}): boolean {
  if (args.isLoading) return false
  if (args.activePhase !== null) return false
  return !args.seasonOptions.some((season) => season.status === 'Upcoming')
}
