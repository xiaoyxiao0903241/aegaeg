import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import type { ReleaseDurationDays, RestakeDurationDays } from '~/core/assets/claim-plans'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { ClaimSplitSlider } from '~/shared/ui/claim-split-slider'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/detail/rewards-claim-token-row'
import { RewardsGagxAmount } from '~/views/dapp/rewards/detail/rewards-gagx-amount'
import { RewardsPlanPicker } from '~/views/dapp/rewards/detail/rewards-plan-picker'
import { useRewardsMixedClaimView } from '~/views/dapp/rewards/detail/use-rewards-mixed-claim-view'
import { formatApiDecimalAmount, type MixedClaimView } from '~/views/dapp/rewards/rewards-display'

export function RewardsMixedClaimWidget({ view }: { view: MixedClaimView }) {
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useRewardsMixedClaimView(view)
  const t = vm.t

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.card.body}
        title={vm.card.title}
      />
      <DappWidgetStack>
        {vm.showCobuildRewardType ? (
          <Segment
            aria-label={t.rewards.cobuild.recordsTabsAria}
            onChange={(value) => vm.setCobuildRewardType(value as 'RANK_REWARD' | 'SURPASS_REWARD')}
            options={vm.cobuildRewardTypeOptions}
            value={vm.cobuildRewardType}
          />
        ) : null}
        <Card surface="outlined" className="min-h-19.75 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
                {t.rewards.detail.claimable}
              </Text>
              <RewardsGagxAmount>
                {vm.amountKnown ? `${vm.amountText} ${vm.mixed.tokenGagx}` : vm.amountText}
              </RewardsGagxAmount>
            </div>
            <div className="grid gap-1 text-right">
              <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
                {vm.mixed.requiredContributionLabel}
              </Text>
              <Text as="p" className="leading-5 font-semibold" variant="copy">
                {view === 'lucky' && vm.amount > 0n
                  ? vm.requiredText
                  : formatApiDecimalAmount(null)}
              </Text>
            </div>
          </div>
        </Card>

        {vm.luckyPaused ? (
          <Text as="p" className="text-destructive" variant="caption">
            {vm.mixed.luckyPaused}
          </Text>
        ) : null}
        {vm.luckyNotClaimable ? (
          <Text as="p" tone="muted-foreground" variant="caption">
            {vm.mixed.luckyNotClaimable}
          </Text>
        ) : null}

        {vm.showContributionShort ? (
          <div className="rounded-2xl bg-primary/10 px-3.5 py-3">
            <Text as="p" className="leading-4" variant="caption">
              <span className="text-foreground">
                {vm.mixed.insufficientContributionDetail
                  .replace('{need}', vm.requiredText)
                  .replace('{have}', vm.haveText)}
              </span>{' '}
              <Button
                className="inline underline"
                onClick={() => openExchangeView('burn')}
                size="sm"
                type="button"
                variant="link"
              >
                {vm.mixed.goBurnInline}
              </Button>
              <span className="text-foreground">{vm.mixed.getContributionSuffix}</span>
            </Text>
          </div>
        ) : null}

        <Card surface="outlined" className="rounded-2xl p-4">
          <ClaimSplitSlider
            aria-label={vm.mixed.splitAria}
            className="max-w-none"
            onChange={vm.setReleasePct}
            value={vm.releasePct}
          />
          <div className="mt-1 flex justify-between gap-2">
            <Text as="span" className="leading-4 font-semibold text-primary" variant="support">
              {vm.mixed.releasePct.replace('{pct}', String(vm.releasePct))}
            </Text>
            <Text
              as="span"
              className="leading-4 font-semibold text-(--app-claim-restake)"
              variant="support"
            >
              {vm.mixed.restakePct.replace('{pct}', String(vm.restakePct))}
            </Text>
          </div>
        </Card>

        {/* Figma 领取/复投卡 135：p-4 + gap-2 合成（禁 h-[135px]） */}
        <div className="grid min-h-33.75 gap-1.5 rounded-2xl border border-primary/35 bg-primary/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-5 text-primary" variant="copy">
              {t.rewards.claim}
            </Text>
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              {vm.mixed.releaseInto}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.releaseAmountText} tokenLabel={vm.mixed.tokenGagx} />
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              {vm.mixed.releasePeriod}
            </Text>
            <RewardsPlanPicker
              ariaLabel={vm.mixed.releaseAria}
              onSelect={(value) => vm.setReleaseDays(Number(value) as ReleaseDurationDays)}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
            />
          </div>
        </div>

        <div className="grid min-h-33.75 gap-1.5 rounded-2xl border border-[color-mix(in_oklab,var(--app-claim-restake)_35%,transparent)] bg-[color-mix(in_oklab,var(--app-claim-restake)_8%,white)] p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-5 text-(--app-claim-restake)" variant="copy">
              {vm.mixed.restakeLabel}
            </Text>
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              {vm.mixed.restakeInto}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.restakeAmountText} tokenLabel={vm.mixed.tokenGagx} />
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              {vm.mixed.restakePeriod}
            </Text>
            <RewardsPlanPicker
              ariaLabel={vm.mixed.restakeAria}
              onSelect={(value) => vm.setRestakeDays(Number(value) as RestakeDurationDays)}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
            />
          </div>
        </div>

        {vm.walletReady ? (
          <DappActionButton
            className="min-h-13 py-2 text-sm leading-4"
            density="external"
            disabled={!vm.canConfirm}
            loading={vm.submitting}
            onClick={vm.onConfirm}
          >
            <span className="flex flex-col items-start gap-0.5 leading-tight">
              <span>
                {vm.mixed.ctaReleaseLine.replace(
                  '{amount}',
                  `${vm.releaseAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </span>
              <span>
                {vm.mixed.ctaRestakeLine.replace(
                  '{amount}',
                  `${vm.restakeAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </span>
            </span>
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
