import { toast } from 'sonner'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useReferral } from '~/views/dapp/community/use-referral'
import { formatReferralLinkDisplay } from '~/views/dapp/community/community-display'
import { buildReferralSharePath } from '~/shared/config/referral'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { resolveApiUserFacingError } from '~/shared/api/resolve-api-user-facing-error'
import {
  resolveReferralBindError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { buildCommunityQuickLinkItems } from '~/shared/config/community-links'

export function useCommunityConnectedView() {
  const { locale, messages: t } = useI18n()
  const account = useActiveAccount()
  const referral = useReferral()
  const referralLink = account ? formatReferralLinkDisplay(account.address) : '—'

  usePresentUserFacingError(
    referral.error,
    (err) =>
      resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
      resolveReferralBindError(err, t.community.bindErrors) ??
      resolveApiUserFacingError(err, t.errors.api) ??
      t.community.bindErrors.failed,
    {
      id: 'community-referral-error',
      onPresented: referral.clearError,
    },
  )

  async function onCopyReferralLink() {
    if (!account) return
    const url = `${getRuntimeOrigin()}${window.location.pathname}${buildReferralSharePath(account.address)}`
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

  const quickLinkItems = buildCommunityQuickLinkItems(
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
