import type { ReactNode } from 'react'

import type { TeamReferralItem } from '~/shared/api/types'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { Text } from '~/shared/components/text'
import { rewardsHashForView } from '~/shared/config/dapp-deep-links'
import { getRuntimeHost } from '~/shared/lib/runtime-host'
import {
  formatApiDateTime,
  formatNumber,
  formatShortAddress,
  formatTableGenesisRank,
} from '~/shared/presenters/format'

/**
 * 把团队邀请项映射为表格行
 *
 * 按列序输出注册时间、地址、业绩、等级与直邀数；
 * 数字空结果显示 0（不用「—」）。
 */
export function mapTeamReferralToCompactRow(item: TeamReferralItem): ReactNode[] {
  const volume = Number(item.presale_volume)
  const teamMarket = Number(item.sales_team_market)

  return [
    formatApiDateTime(item.register_time),
    <ExplorerLink key={item.address} shortOptions={{ head: 4, tail: 4 }} value={item.address} />,
    Number.isFinite(volume)
      ? formatNumber(volume, { prefix: '$' })
      : formatNumber(0, { prefix: '$' }),
    formatTableGenesisRank(item.presale_rank),
    formatNumber(item.direct_referral_count ?? 0, { digits: 0, trimZeros: true }),
    Number.isFinite(teamMarket)
      ? formatNumber(teamMarket, { digits: 0, trimZeros: true, prefix: '$' })
      : formatNumber(0, { digits: 0, trimZeros: true, prefix: '$' }),
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

/** 社区统计卡共建等级：有做市档显示 A#，否则 —。 */
export function formatCommunityMakingRank(rank: number | null | undefined): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return '—'
  return `A${Math.trunc(rank)}`
}

/** 把步骤正文里的 `{link}` 换成跳转奖励/共建奖的链接。 */
export function communityInviteRewardBody(template: string, linkLabel: string): ReactNode {
  const marker = '{link}'
  const idx = template.indexOf(marker)
  if (idx < 0) return template
  return (
    <>
      {template.slice(0, idx)}
      <Text as="a" className="text-primary" href={rewardsHashForView('cobuild')}>
        {linkLabel}
      </Text>
      {template.slice(idx + marker.length)}
    </>
  )
}

/** 社区邀请表列宽预设（16px 根字号）。 */
export const communityInviteColWidths = [
  '9.5rem',
  '6.5rem',
  '6.5rem',
  '5.5rem',
  '6rem',
  '7.5rem',
] as const
