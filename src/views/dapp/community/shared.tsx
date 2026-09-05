import type { ReactNode } from 'react'

import type { TeamReferralItem } from '~/shared/api/types'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { getRuntimeHost } from '~/shared/lib/runtime-host'
import {
  formatApiDateTime,
  formatDecimal,
  formatMakingRankLabel,
  formatShortAddress,
  TABLE_EMPTY,
} from '~/shared/presenters/format'

/**
 * 把团队邀请项映射为表格行
 *
 * 列序：注册时间、地址、持仓 USD、共建级别、直邀数、团队业绩 USD。
 *
 * @param item `/team/referrals` 直推项
 * @see docs/backend-api/api.md #team/referrals
 */
export function mapTeamReferralToCompactRow(item: TeamReferralItem): ReactNode[] {
  return [
    formatApiDateTime(item.register_time),
    <ExplorerLink key={item.address} shortOptions={{ head: 4, tail: 4 }} value={item.address} />,
    formatDecimal(item.active_stake_balance_usd, { prefix: '$' }),
    formatMakingRankLabel(item.making_rank, TABLE_EMPTY, item),
    formatDecimal(item.direct_referral_count, { digits: 0, fraction: 'natural' }),
    formatDecimal(item.making_market_usd, { digits: 0, fraction: 'natural', prefix: '$' }),
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
