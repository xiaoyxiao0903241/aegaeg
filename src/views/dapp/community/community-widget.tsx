import { useEffect, useEffectEvent } from 'react'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useReferral } from '~/views/dapp/community/use-referral'
import { formatReferralLinkDisplay } from '~/views/dapp/community/community-display'
import { buildReferralSharePath } from '~/shared/config/referral'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'
import { useDappShell } from '~/app/use-dapp-shell'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { QuickLinks } from '~/app/shell/quick-links'
import { buildCommunityQuickLinkItems } from '~/shared/config/community-links'
import { toast } from 'sonner'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { resolveApiUserFacingError } from '~/shared/api/resolve-api-user-facing-error'
import {
  resolveReferralBindError,
  resolveWalletTransactionError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import {
  CommunityReferralLinkCard,
  CommunityReferrerBindCard,
  CommunityReferrerBoundPanel,
  communityGenesisCta,
} from '~/views/dapp/community/community-widget-primitives'

export function CommunityWidget({
  onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
  const { sessionReady } = useDappShell()
  return sessionReady ? (
    <CommunityConnectedWidget onSelectTab={onSelectTab} />
  ) : (
    <CommunityDisconnectedWidget />
  )
}

function CommunityConnectedWidget({
  onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()
  const referral = useReferral(true)
  const { error: referralError, clearError: clearReferralError } = referral
  const referralLink = account ? formatReferralLinkDisplay(account.address) : '—'

  async function copyReferralLink() {
    if (!account) return
    const url = `${getRuntimeOrigin()}${window.location.pathname}${buildReferralSharePath(account.address)}`
    const result = await copyTextToClipboard(url)
    if (result === 'copied') toast.success(t.wallet.copied)
    else if (result === 'failed') toast.error(t.wallet.copyFailed)
  }

  async function copyReferrerAddress() {
    if (!referral.referrer) return
    const result = await copyTextToClipboard(referral.referrer)
    if (result === 'copied') toast.success(t.wallet.copied)
    else if (result === 'failed') toast.error(t.wallet.copyFailed)
  }

  const presentReferralError = useEffectEvent((error: unknown) => {
    presentUserFacingError(
      error,
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ??
        resolveReferralBindError(err, t.community.bindErrors) ??
        resolveApiUserFacingError(err, t.errors.api) ??
        t.community.bindErrors.failed,
      { id: 'community-referral-error' },
    )
    clearReferralError()
  })

  useEffect(() => {
    if (!referralError) return
    presentReferralError(referralError)
  }, [referralError])

  return (
    <DappWidgetFrame subtitle={t.community.intro} title={t.community.title}>
      {referral.isBound ? (
        <CommunityReferralLinkCard
          copyLabel={t.community.shareReferral}
          disabled={!account}
          linkLabel={t.community.referralLink}
          onCopy={() => void copyReferralLink()}
          referralLink={referralLink}
        />
      ) : null}

      {referral.isBound ? (
        <CommunityReferrerBoundPanel
          addressLabel={t.community.referrer}
          copyLabel={t.common.copy}
          note={t.community.referralBondPermanent}
          onCopy={() => void copyReferrerAddress()}
          referrer={referral.referrer}
          referrerLabel={referral.referrerLabel}
        />
      ) : (
        <CommunityReferrerBindCard
          bindLabel={t.community.bindReferrer}
          canBind={referral.canBind}
          hint={t.community.referrerHint}
          inputLabel={t.community.referrerPlaceholder}
          isSubmitting={referral.isSubmitting}
          onBind={() =>
            void referral.bind().then((ok) => ok && toast.success(t.community.bindReferrerSuccess))
          }
          onInputChange={referral.setReferrerInput}
          placeholder={t.community.referrerPlaceholder}
          referrerLabel={t.community.referrer}
          value={referral.referrerInput}
        />
      )}

      <CommunityQuickLinks />

      <DappActionButton
        className={communityGenesisCta()}
        density="hero"
        onClick={() => onSelectTab('genesis')}
      >
        {t.community.shareholder}
      </DappActionButton>
    </DappWidgetFrame>
  )
}

function CommunityDisconnectedWidget() {
  const { messages: t } = useI18n()

  return (
    <DappWidgetFrame subtitle={t.community.disconnectedIntro} title={t.community.title}>
      <CommunityQuickLinks />
      <DappWidgetConnectPromo />
    </DappWidgetFrame>
  )
}

function CommunityQuickLinks({ className }: { className?: string }) {
  const { locale, messages: t } = useI18n()

  return (
    <QuickLinks
      className={className}
      items={buildCommunityQuickLinkItems(
        {
          docs: t.community.docs,
          youtube: t.community.youtube,
          medium: t.community.medium,
          twitter: t.community.twitter,
          telegram: t.community.telegram,
        },
        locale,
      )}
    />
  )
}
