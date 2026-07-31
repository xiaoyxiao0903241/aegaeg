import { toast } from 'sonner'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useReferral } from '~/views/dapp/community/use-referral'
import { formatReferralLinkDisplay } from '~/views/dapp/community/community-display'
import { referralSharePath } from '~/shared/config/referral'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { communityQuickLinkItems } from '~/shared/config/community-links'

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
