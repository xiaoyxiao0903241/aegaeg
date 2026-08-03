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
import { SelectMenu } from '~/shared/ui/select-menu'
import { Text } from '~/shared/ui/text'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/detail/rewards-claim-token-row'
import { RewardsGagxAmount } from '~/views/dapp/rewards/detail/rewards-gagx-amount'
import { useRewardsMixedClaimView } from '~/views/dapp/rewards/detail/use-rewards-mixed-claim-view'
import { formatApiDecimalAmount, type MixedClaimView } from '~/views/dapp/rewards/rewards-display'

/**
 * Mixed 领取左栏 — Figma lucky/referral/participate/cobuild 同构
 *（可领卡 · 贡献 warning · 双色 slider · 领取/复投卡 · 双行 CTA）。
 */
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
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                {t.rewards.detail.claimable}
              </Text>
              <RewardsGagxAmount textVariant="headline">
                {vm.amountKnown ? `${vm.amountText} ${vm.mixed.tokenGagx}` : vm.amountText}
              </RewardsGagxAmount>
            </div>
            <div className="grid gap-1.5 text-right">
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                {vm.mixed.requiredContributionLabel}
              </Text>
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {view === 'lucky' && vm.amount > 0n
                  ? vm.requiredText
                  : formatApiDecimalAmount(null)}
              </Text>
            </div>
          </div>
        </Card>

        {vm.luckyPaused ? (
          <Text as="p" className="text-destructive" variant="copy">
            {vm.mixed.luckyPaused}
          </Text>
        ) : null}
        {vm.luckyNotClaimable ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            {vm.mixed.luckyNotClaimable}
          </Text>
        ) : null}

        {vm.showContributionShort ? (
          <div className="rounded-2xl bg-primary-soft px-4 py-3">
            <Text as="p" className="leading-5" variant="copy">
              <span className="text-foreground">
                {vm.mixed.insufficientContributionDetail
                  .replace('{need}', vm.requiredText)
                  .replace('{have}', vm.haveText)}
              </span>{' '}
              <Button
                className="inline text-coral-emphasis underline"
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
            <Text as="span" className="leading-4 font-semibold text-primary" variant="detail">
              {vm.mixed.releasePct.replace('{pct}', String(vm.releasePct))}
            </Text>
            <Text as="span" className="leading-4 font-semibold text-claim-restake" variant="detail">
              {vm.mixed.restakePct.replace('{pct}', String(vm.restakePct))}
            </Text>
          </div>
        </Card>

        {/* Figma 4393:244 领取卡：coral-soft + border 35% · gap8 · p16 · 标题 body16 */}
        <div className="grid min-h-33.75 gap-2 rounded-2xl border border-primary/35 bg-primary-soft p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-5 font-normal text-primary" variant="headline">
              {t.rewards.claim}
            </Text>
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.mixed.releaseInto}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.releaseAmountText} tokenLabel={vm.mixed.tokenGagx} />
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.mixed.releasePeriod}
            </Text>
            <SelectMenu
              ariaLabel={vm.mixed.releaseAria}
              onSelect={(value) => vm.setReleaseDays(Number(value) as ReleaseDurationDays)}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
              variant="pill"
            />
          </div>
        </div>

        {/* Figma 4394:233 复投卡：mint #f3fdf6 + success 边/字 */}
        <div className="grid min-h-33.75 gap-2 rounded-2xl border border-success/35 bg-success-soft p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-5 font-normal text-success" variant="headline">
              {vm.mixed.restakeLabel}
            </Text>
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.mixed.restakeInto}
            </Text>
          </div>
          <RewardsClaimTokenRow amountText={vm.restakeAmountText} tokenLabel={vm.mixed.tokenGagx} />
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.mixed.restakePeriod}
            </Text>
            <SelectMenu
              ariaLabel={vm.mixed.restakeAria}
              onSelect={(value) => vm.setRestakeDays(Number(value) as RestakeDurationDays)}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
              variant="pill"
            />
          </div>
        </div>

        {vm.walletReady ? (
          <DappActionButton
            className="min-h-13 !py-2 !font-normal"
            density="external"
            disabled={!vm.canConfirm}
            loading={vm.submitting}
            onClick={vm.onConfirm}
          >
            {/* Figma 4394:248：高 52 · 双行；detail + leading-4（标准刻度，禁任意 rem） */}
            <span className="flex flex-col items-start gap-0.5 text-left !font-normal text-white">
              <Text as="span" className="leading-4 !font-normal text-white" variant="detail">
                {vm.mixed.ctaReleaseLine.replace(
                  '{amount}',
                  `${vm.releaseAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
              <Text as="span" className="leading-4 !font-normal text-white" variant="detail">
                {vm.mixed.ctaRestakeLine.replace(
                  '{amount}',
                  `${vm.restakeAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
            </span>
          </DappActionButton>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
