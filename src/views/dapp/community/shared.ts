import type { TeamReferralItem } from '~/shared/api/types'
import { getRuntimeHost } from '~/shared/lib/runtime-host'
import {
  formatNumber,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
} from '~/shared/presenters/format'

/**
 * 把团队邀请项映射为表格行
 *
 * 按列序输出注册时间、地址、业绩、等级与直邀数；
 * 数字空结果显示 0（不用「—」）。
 */
export function mapTeamReferralToCompactRow(item: TeamReferralItem): string[] {
  const volume = Number(item.presale_volume)
  const teamMarket = Number(item.sales_team_market)

  return [
    formatRegisterDate(item.register_time),
    formatShortAddress(item.address, { head: 4, tail: 4 }),
    Number.isFinite(volume)
      ? formatNumber(volume, { prefix: '$' })
      : formatNumber(0, { prefix: '$' }),
    formatTableGenesisRank(item.presale_rank),
    formatNumber(item.direct_referral_count ?? 0, { digits: 0, trimZeros: true }),
    Number.isFinite(teamMarket)
      ? formatNumber(teamMarket, { digits: 0, trimZeros: true })
      : formatNumber(0, { digits: 0, trimZeros: true }),
  ]
}

/** 侧栏展示用推荐链接：站点域名 + 缩短地址 */
export function formatReferralLinkDisplay(address: string): string {
  return `${getRuntimeHost()}/r/${formatShortAddress(address)}`
}

/**
 * 读取并清除推荐绑定成功标记
 *
 * 标记只在绑定写操作的成功回调里置位；
 * 不能从写操作返回值推断是否成功（void 写成功也可能是 undefined）。
 *
 * @param flag 可变成功标记
 */
export function readAndClearBindSuccess(flag: { current: boolean }): boolean {
  const ok = flag.current
  flag.current = false
  return ok
}

/** 社区邀请表列宽预设（16px 根字号）。 */
export const communityInviteColWidths = [
  '6.5rem',
  '6.5rem',
  '6.5rem',
  '5.5rem',
  '6rem',
  '7.5rem',
] as const
