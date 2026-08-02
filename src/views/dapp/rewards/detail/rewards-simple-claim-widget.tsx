import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { Card } from '~/shared/ui/card'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { Text } from '~/shared/ui/text'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/detail/rewards-claim-token-row'
import { RewardsGagxAmount } from '~/views/dapp/rewards/detail/rewards-gagx-amount'
import {
  type SimpleClaimView,
  useRewardsSimpleClaimView,
} from '~/views/dapp/rewards/detail/use-rewards-simple-claim-view'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'

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
        {/* Figma 待审批 124：p-4 + 顶行 + mt-1.5 + 底栏 35（禁 h-[124px]） */}
        <Card surface="outlined" className="min-h-31 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                {vm.grant.pendingLabel}
              </Text>
              <RewardsGagxAmount textVariant="headline">{vm.tokenGagx}</RewardsGagxAmount>
            </div>
            <div className="grid gap-1.5 text-right">
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                {vm.grant.pendingHint}
              </Text>
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {formatApiDecimalAmount(null)}
              </Text>
            </div>
          </div>
          <div className="mt-1.5 grid gap-1">
            <a
              className="inline-flex h-4 w-fit items-center gap-1 font-medium text-primary underline"
              href={COMMUNITY_SOCIAL_LINKS.telegram}
              rel="noreferrer"
              target="_blank"
            >
              <Text as="span" className="font-medium text-primary" variant="detail">
                {vm.grant.contactSupport}
              </Text>
              <ChevronIcon className="size-2.5 -rotate-90 opacity-80" direction="up" />
            </a>
            <Text as="p" className="leading-none text-foreground/40" variant="copy">
              {vm.grant.pendingBody}
            </Text>
          </div>
        </Card>

        <div className="flex h-11.5 items-center justify-center">
          <span className="inline-flex size-8.5 items-center justify-center rounded-control border border-border bg-card shadow-sm">
            <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
          </span>
        </div>

        {/* Figma 可领取卡：primary-soft + border */}
        <div className="grid min-h-23.25 gap-2 rounded-2xl border border-primary/35 bg-primary-soft p-4">
          <div className="flex h-5 items-center justify-between gap-2">
            <Text as="span" className="leading-5 text-primary" variant="copy">
              {t.rewards.detail.claimable}
            </Text>
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.copy.claimIntoWallet}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.claimableText} tokenLabel={vm.tokenGagx} />
        </div>

        {walletReady ? (
          <DappActionButton
            className="min-h-13 py-2 text-sm leading-4"
            density="external"
            disabled={!vm.canSubmit}
            loading={vm.isClaiming}
            onClick={vm.onClaim}
          >
            {vm.ctaLabel}
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
