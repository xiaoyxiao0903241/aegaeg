import { useState } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { useTeamOverview, useTeamReferrals } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'

/**
 * 社区正文数据组装
 *
 * 汇总团队概览、共建等级与邀请明细分页数据；
 * 分页状态在本地维护，取数均要求登录会话就绪。
 */
export function useCommunityContentView() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const [invitesPage, setInvitesPage] = useState(1)
  const { data: overview, isLoading: overviewLoading } = useTeamOverview(sessionReady)
  const { displayRank, isRankLoading } = useShareholderRank(sessionReady)
  const { data: referrals, isLoading: referralsLoading } = useTeamReferrals(
    tablePageQuery(invitesPage),
    sessionReady,
  )

  return {
    t,
    sessionReady,
    walletReady,
    isMobileViewport,
    isLoggingIn,
    invitesPage,
    setInvitesPage,
    overview,
    overviewLoading,
    displayRank,
    isRankLoading,
    referrals,
    referralsLoading,
  }
}
