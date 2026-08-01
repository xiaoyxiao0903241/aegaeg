import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { dappAssets } from '~/app/assets'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/detail/rewards-claim-token-row'
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import {
  useRewardsSimpleClaimView,
  type SimpleClaimView,
} from '~/views/dapp/rewards/detail/use-rewards-simple-claim-view'

export function RewardsSimpleClaimWidget({ view }: { view: SimpleClaimView }) {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const { walletReady, sessionReady } = useDappShell()
  const vm = useRewardsSimpleClaimView(view, sessionReady)

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.card.body}
        title={vm.card.title}
      />
      <DappWidgetStack>
        <Card surface="outlined" className="rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Text as="p" tone="muted-foreground" variant="caption">
                {vm.grant.pendingLabel}
              </Text>
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-[18px] rounded-full"
                  loading="lazy"
                  size="token"
                  src={dappAssets.tokenGagx}
                />
                <Text as="p" className="font-semibold" variant="copy">
                  {vm.tokenGagx}
                </Text>
              </div>
            </div>
            <div className="grid gap-1.5 text-right">
              <Text as="p" tone="muted-foreground" variant="caption">
                {vm.grant.pendingHint}
              </Text>
              <Text as="p" className="font-semibold" variant="headline">
                {REWARDS_DASH}
              </Text>
            </div>
          </div>
          <div className="mt-2.5 grid gap-1">
            <a
              className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-primary underline"
              href={COMMUNITY_SOCIAL_LINKS.telegram}
              rel="noreferrer"
              target="_blank"
            >
              <Text as="span" className="text-[13px] font-medium text-primary" variant="detail">
                {vm.grant.contactSupport}
              </Text>
              <ChevronIcon className="size-2.5 -rotate-90 opacity-80" direction="up" />
            </a>
            <Text as="p" tone="muted-foreground" variant="caption">
              {vm.grant.pendingBody}
            </Text>
          </div>
        </Card>

        <div className="flex items-center justify-center py-1.5">
          <span className="inline-flex size-[34px] items-center justify-center rounded-[10px] border border-border bg-card shadow-sm">
            <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
          </span>
        </div>

        <div className="grid gap-2 rounded-2xl border border-primary/35 bg-primary/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" variant="copy">
              {t.rewards.detail.claimable}
            </Text>
            <Text as="span" tone="muted-foreground" variant="caption">
              {vm.copy.claimIntoWallet}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.claimableText} tokenLabel={vm.tokenGagx} />
        </div>

        {walletReady ? (
          <DappActionButton disabled={!vm.canSubmit} loading={vm.isClaiming} onClick={vm.onClaim}>
            {vm.ctaLabel}
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
