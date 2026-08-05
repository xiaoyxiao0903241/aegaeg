import type { SeasonOption } from '~/core/presale/genesis-promo-types'

/**
 * 创世预售计划是否已全部结束：无进行中阶段，且无 Upcoming 季节。
 *
 * 加载中按「未结束」返回，避免页面 CTA / 空态短暂闪现成「已结束」。
 *
 * @param args.isLoading 数据加载中
 * @param args.activePhase 当前进行中阶段；null 表示无
 * @param args.seasonOptions 各季节的状态（只读 status）
 * @returns 全部结束返回 true
 * @see 手册 §6.1 页面用途
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
