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
      <DappSideCard className={REFERRAL_CARD_CLASS}>
        <SideLabel>{t.community.referralLink}</SideLabel>
        <SideValue className="text-[13px] tracking-[-0.26px]">{referralLink}</SideValue>
        <DappActionButton
          className="max-dapp:min-h-11 max-dapp:text-sm"
          disabled={!account}
          onClick={() => void copyReferralLink()}
        >
          {t.community.shareReferral}
        </DappActionButton>
      </DappSideCard>

      {referral.isBound ? (
        <DappReferrerBoundCard className="rounded-2xl px-4 py-3.5">
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referrer}
          </p>
          <ReferrerAddressRow>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-6 flex-none place-items-center rounded-full bg-accent text-[10px] font-semibold leading-[1.2] text-primary">
                R
              </span>
              <strong className="truncate text-sm font-semibold leading-[1.2] tracking-[-0.28px] text-foreground">
                {referral.referrerLabel ?? '—'}
              </strong>
            </div>
            {referral.referrer ? (
              <button
                aria-label={t.common.copy}
                className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-[8px] bg-transparent"
                onClick={() => void copyReferrerAddress()}
                type="button"
              >
                <img alt="" height="16" src={dappAssets.copy} width="16" />
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
              className="w-full min-h-11 rounded-[11px] border border-border bg-card px-[14px] text-[13px] tracking-[-0.26px] text-muted-foreground outline-0 max-dapp:h-11"
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
  const { messages: t } = useI18n()

  return (
    <QuickLinks
      className={className}
      items={[
        {
          href: '#docs',
          icon: dappAssets.docs,
          label: t.community.docs,
        },
        {
          href: '#twitter',
          icon: dappAssets.twitter,
          iconTone: 'dark',
          label: t.community.twitter,
          size: 14,
        },
        {
          href: '#telegram',
          icon: dappAssets.telegram,
          iconTone: 'plain',
          label: t.community.telegram,
          size: 30,
        },
      ]}
    />
  )
}
