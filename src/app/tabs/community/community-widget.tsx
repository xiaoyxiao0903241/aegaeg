import { Wallet } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { useReferral } from '~/hooks/use-referral'
import { formatReferralLinkDisplay } from '~/lib/api/format-display'
import { buildReferralSharePath } from '~/config/referral'
import { useDappShell } from '~/app/dapp-shell-context'
import type { DappTab } from '~/app/types'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/components/dapp-action-button'
import {
  DappReferrerBoundCard,
  DappSideCard,
  SideHint,
  SideLabel,
  SideValue,
} from '~/app/components/dapp-card'
import { ReferrerAddressRow } from '~/app/components/referrer-address-row'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { QuickLinks } from '~/app/components/quick-links'
import { buildCommunityQuickLinkItems } from '~/config/community-links'
import { toast } from 'sonner'
import { toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import {
  REFERRAL_CARD_CLASS,
  SHAREHOLDER_ACTION_CLASS,
} from '~/app/tabs/community/community-shared'

export function CommunityWidget({
  onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
  const { sessionReady } = useDappShell()
  return sessionReady ? (
    <CommunityConnectedWidget onSelectTab={onSelectTab} />
  ) : (
    <CommunityDisconnectedWidget onSelectTab={onSelectTab} />
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
  const referralLink = account ? formatReferralLinkDisplay(account.address) : '—'

  const copyReferralLink = useCallback(async () => {
    if (!account) return
    const url = `${window.location.origin}${window.location.pathname}${buildReferralSharePath(account.address)}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t.wallet.copied)
    } catch {
      // Clipboard permission denied — no success toast.
    }
  }, [account, t.wallet.copied])

  const copyReferrerAddress = useCallback(async () => {
    if (!referral.referrer) return
    try {
      await navigator.clipboard.writeText(referral.referrer)
      toast.success(t.wallet.copied)
    } catch {
      // Clipboard permission denied — no success toast.
    }
  }, [referral.referrer, t.wallet.copied])

  useEffect(() => {
    if (!referral.error) return
    const message = toWalletUserFacingMessage(referral.error)
    if (message) toast.error(message)
  }, [referral.error])

  return (
    <DappWidgetFrame subtitle={t.community.intro} title={t.community.title}>
      {referral.isBound ? (
        <DappSideCard className={REFERRAL_CARD_CLASS}>
          <SideLabel>{t.community.referralLink}</SideLabel>
          <SideValue className="text-sm max-dapp:text-xs tracking-tight">{referralLink}</SideValue>
          <DappActionButton
            className="max-dapp:min-h-11 max-dapp:text-sm"
            disabled={!account}
            onClick={() => void copyReferralLink()}
          >
            {t.community.shareReferral}
          </DappActionButton>
        </DappSideCard>
      ) : null}

      {referral.isBound ? (
        <DappReferrerBoundCard className="rounded-2xl px-4 py-3.5">
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referrer}
          </p>
          <ReferrerAddressRow>
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-6 flex-none place-items-center rounded-full bg-accent text-primary"
              >
                <Wallet className={dappIconClass.xs} strokeWidth={1.75} />
              </span>
              <strong className="truncate text-sm font-semibold leading-[1.2] tracking-[-0.28px] text-foreground">
                {referral.referrerLabel ?? '—'}
              </strong>
            </div>
            {referral.referrer ? (
              <button
                aria-label={t.common.copy}
                className="grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-transparent"
                onClick={() => void copyReferrerAddress()}
                type="button"
              >
                <DappIcon alt="" size="base" src={dappAssets.copy} />
              </button>
            ) : null}
          </ReferrerAddressRow>
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referralBondPermanent}
          </p>
        </DappReferrerBoundCard>
      ) : (
        <DappSideCard className={cn(REFERRAL_CARD_CLASS, 'grid gap-2')}>
          <SideLabel tone="muted">{t.community.referrer}</SideLabel>
          <div className="grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-sm border border-border bg-card px-3.5 text-xs tracking-[-0.26px] text-muted-foreground outline-0 max-dapp:h-11"
              onChange={(event) => referral.setReferrerInput(event.currentTarget.value)}
              placeholder={t.community.referrerPlaceholder}
              value={referral.referrerInput}
            />
            <DappActionButton
              disabled={!referral.canBind}
              loading={referral.isSubmitting}
              onClick={() =>
                void referral.bind().then((ok) => ok && toast.success(t.community.bindReferrerSuccess))
              }
              shape="inline"
              variant="secondary"
            >
              {t.community.bindReferrer}
            </DappActionButton>
          </div>
          <SideHint>{t.community.referrerHint}</SideHint>
        </DappSideCard>
      )}

      <CommunityQuickLinks />

      <DappActionButton
        className={SHAREHOLDER_ACTION_CLASS}
        onClick={() => onSelectTab('genesis')}
      >
        {t.community.shareholder}
      </DappActionButton>
    </DappWidgetFrame>
  )
}

function CommunityDisconnectedWidget({
  onSelectTab: _onSelectTab,
}: {
  onSelectTab: (tab: DappTab) => void
}) {
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
