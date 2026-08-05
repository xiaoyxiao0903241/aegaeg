import {
  formatGroupedNumber,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
  TABLE_EMPTY,
} from '~/shared/api/format-display'
import type { TeamReferralItem } from '~/shared/api/types'
import { getRuntimeHost } from '~/shared/lib/runtime-host'

/**
 * 把团队邀请项映射为表格行
 *
 * 按列序输出注册时间、地址、业绩、等级与直邀数；
 * 业绩等数值无效时显示为空表标记。
 */
export function mapTeamReferralToCompactRow(item: TeamReferralItem): string[] {
  const volume = Number(item.presale_volume)
  const teamMarket = Number(item.sales_team_market)

  return [
    formatRegisterDate(item.register_time),
    formatShortAddress(item.address, { head: 4, tail: 4 }),
    Number.isFinite(volume) && volume > 0
      ? formatGroupedNumber(volume, { prefix: '$' })
      : TABLE_EMPTY,
    formatTableGenesisRank(item.presale_rank),
    formatGroupedNumber(item.direct_referral_count ?? 0, { digits: 0, trimZeros: true }),
    Number.isFinite(teamMarket)
      ? formatGroupedNumber(teamMarket, { digits: 0, trimZeros: true })
      : TABLE_EMPTY,
  ]
}

/** 侧栏展示用推荐链接：站点域名 + 缩短地址 */
export function formatReferralLinkDisplay(address: string): string {
  return `${getRuntimeHost()}/r/${formatShortAddress(address)}`
}
