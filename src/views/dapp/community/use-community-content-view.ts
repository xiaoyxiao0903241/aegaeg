import { useState } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { useTeamOverview, useTeamReferrals } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'

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
