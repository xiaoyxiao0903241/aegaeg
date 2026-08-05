import { useState } from 'react'
import { toast } from 'sonner'

import { useAppShell } from '~/app/use-app-shell'
import { useTeamOverview, useTeamReferrals } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import { useI18n } from '~/i18n/use-i18n'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import { communityQuickLinkItems } from '~/shared/config/community-links'
import { referralSharePath } from '~/shared/config/referral'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatReferralLinkDisplay } from '~/views/dapp/community/community-display'
import { useReferral } from '~/views/dapp/community/use-referral'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 社区侧栏数据组装
 *
 * 汇总推荐关系、推荐链接与复制/绑定操作；
 * 链上错误统一通过全局提示展示，复制结果用 toast 反馈。
 */
export function useCommunityConnectedView() {
  const { locale, messages: t } = useI18n()
  const account = useActiveAccount()
  const referral = useReferral()
  const referralLink = account ? formatReferralLinkDisplay(account.address) : '—'

  usePresentUserFacingError(referral.error, {
    id: 'community-referral-error',
    onPresented: referral.clearError,
    messageFor: (err) =>
      getErrorMessage(err, t) ??
      apiUserFacingError(err, t.errors.api) ??
      t.community.bindErrors.failed,
  })

  async function onCopyReferralLink() {
    if (!account) return
    const url = `${getRuntimeOrigin()}${window.location.pathname}${referralSharePath(account.address)}`
    const result = await copyTextToClipboard(url)
    if (result === 'copied') toast.success(t.wallet.copied)
    else if (result === 'failed') toast.error(t.wallet.copyFailed)
  }

  async function onCopyReferrerAddress() {
    if (!referral.referrer) return
    const result = await copyTextToClipboard(referral.referrer)
    if (result === 'copied') toast.success(t.wallet.copied)
    else if (result === 'failed') toast.error(t.wallet.copyFailed)
  }

  async function onBind() {
    const ok = await referral.bind()
    if (ok) toast.success(t.community.bindReferrerSuccess)
  }

  const quickLinkItems = communityQuickLinkItems(
    {
      docs: t.community.docs,
      youtube: t.community.youtube,
      medium: t.community.medium,
      twitter: t.community.twitter,
      telegram: t.community.telegram,
    },
    locale,
  )

  return {
    t,
    account,
    referral,
    referralLink,
    quickLinkItems,
    onCopyReferralLink,
    onCopyReferrerAddress,
    onBind,
  }
}

/**
 * 社区正文数据组装
 *
 * 汇总团队概览、共建等级与邀请明细分页数据；
 * 分页状态在本地维护，取数均要求登录会话就绪。
 */
export function useCommunityDetail() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useAppShell()
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
