import { type ReactNode, useEffect, useState } from 'react'

import { inviteCampaignCountdown } from '~/core/rewards/invite-campaign'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useDirectReferralDirects,
  useDirectReferralPaidLogs,
  useDirectReferralSummary,
} from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import type { DirectReferralDirectItem } from '~/shared/api/types'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import {
  formatApiAmount,
  formatBlockTime,
  formatDecimal,
  formatShortAddress,
  formatUtcBlockTime,
  parseApiAmount,
  TABLE_EMPTY,
} from '~/shared/presenters/format'
import {
  formatApiCountLabel,
  formatApiGagxApproxUsd,
  formatApiStatLabel,
} from '~/views/dapp/rewards/shared'

/**
 * 直推成员 → 我的直推行。
 *
 * 加入时间用最近一笔发放时间。持仓是美元；累计贡献奖励是 AGX。
 */
function mapDirectReferralDirectToRow(item: DirectReferralDirectItem): ReactNode[] {
  return [
    formatBlockTime(item.last_paid_time),
    <ExplorerLink key={item.address} value={item.address} />,
    formatApiAmount(item.active_stake_balance, { digits: 2, prefix: '$' }),
    formatApiStatLabel(item.contributed_reward_total, { suffix: ' AGX' }),
  ]
}

/**
 * 邀请奖详情：总奖励、认购总额、活动倒计时、发放记录、我的直推。
 */
export function useInviteDetail() {
  const { messages: t } = useI18n()
  const invite = t.rewards.invite
  const { sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const [referralsPage, setReferralsPage] = useState(1)
  const [hideZeroPosition, setHideZeroPosition] = useState(true)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const summaryQuery = useDirectReferralSummary(sessionReady)
  const logsQuery = useDirectReferralPaidLogs(tablePageQuery(recordsPage), sessionReady)
  const directsQuery = useDirectReferralDirects(
    {
      ...tablePageQuery(referralsPage),
      hide_zero_position: hideZeroPosition ? 1 : null,
    },
    sessionReady,
  )
  // 标题人数是全部直推，不随「隐藏 0 持仓」变化；汇总接口没有这个计数。
  const directsCountQuery = useDirectReferralDirects(
    { page: 1, page_size: 1, hide_zero_position: null },
    sessionReady,
  )
  const countdown = inviteCampaignCountdown(nowMs)

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), 60_000)
    return () => window.clearInterval(timerId)
  }, [])

  const summary = summaryQuery.data
  const rows = (logsQuery.data?.items ?? []).map((item) => [
    formatUtcBlockTime(item.paid_time),
    formatShortAddress(item.referee_address),
    item.product_type === 'LP_BOND'
      ? invite.product.lp
      : item.product_type === 'BURN_BOND'
        ? invite.product.burn
        : TABLE_EMPTY,
    item.term_days == null ? TABLE_EMPTY : interpolate(invite.termDays, { days: item.term_days }),
    formatDecimal(parseApiAmount(item.subscribe_amount_usd), { digits: 2, prefix: '$' }),
    formatDecimal(parseApiAmount(item.reward_rate), { digits: 0, suffix: '%' }),
    formatApiStatLabel(item.reward_amount, { suffix: ' AGX' }),
    item.claim_status === 1
      ? invite.claimStatus.claimed
      : item.claim_status === 0
        ? invite.claimStatus.unclaimed
        : TABLE_EMPTY,
  ])

  return {
    invite,
    totalRewards: formatApiStatLabel(summary?.total, { suffix: ' AGX' }),
    totalRewardsApprox: formatApiGagxApproxUsd(summary?.total, priceUsd),
    deposit: formatApiStatLabel(summary?.direct_deposit_total, { suffix: ' AGX' }),
    countdownLabel: interpolate(invite.countdownValue, countdown),
    rows,
    recordsLoading: sessionReady && logsQuery.isLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal: logsQuery.data?.total ?? 0,
    referralCount: formatApiCountLabel(directsCountQuery.data?.total),
    referralRows: (directsQuery.data?.items ?? []).map(mapDirectReferralDirectToRow),
    referralsLoading: sessionReady && directsQuery.isLoading,
    referralsPage,
    setReferralsPage,
    referralsTotal: directsQuery.data?.total ?? 0,
    hideZeroPosition,
    setHideZeroPosition: (hide: boolean) => {
      setHideZeroPosition(hide)
      setReferralsPage(1)
    },
  }
}
