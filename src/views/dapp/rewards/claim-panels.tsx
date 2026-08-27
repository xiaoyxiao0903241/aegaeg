/**
 * 奖励域共享领取面板：SimpleClaimDock / MixedClaimDock。
 *
 * 供 referral / participate / grant / lucky / cobuild 等 mode dock 组装；
 * 禁止再扩成域级 mega primitives。
 */
import { ZERO_BI } from '~/core/constants'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { claimSplitCtaStyle, ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { MainButton } from '~/shared/components/main-button'
import { Reveal } from '~/shared/components/reveal'
import { Segment } from '~/shared/components/segment'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import {
  ClaimStackDivider,
  GrantPendingCard,
  MixedClaimSummaryCard,
  RewardsDestinationCard,
  SimpleClaimableCard,
} from '~/views/dapp/rewards/claim-primitives'
import { formatApiAmount, type MixedClaimView } from '~/views/dapp/rewards/shared'
import { useMixedClaim } from '~/views/dapp/rewards/use-mixed-claim'
import { type SimpleClaimView, useSimpleClaim } from '~/views/dapp/rewards/use-simple-claim'
import { withContributionRatio } from '~/views/dapp/shared/contribution-claim-ratio'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { openExchangeView } from '~/views/dapp/shared/navigation'
import { TabHeader } from '~/views/dapp/shared/tab-header'

/**
 * 简单领取左栏面板（发展津贴）
 */
export function SimpleClaimDock({ view }: { view: SimpleClaimView }) {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const { walletReady, sessionReady } = useDappHost()
  const vm = useSimpleClaim(view, sessionReady)

  return (
    <TabHeader
      backText={t.rewards.backToHub}
      onBack={() => setView('hub')}
      subtitle={vm.card.body}
      title={vm.card.title}
    >
      <DockStack>
        {view === 'grant' ? (
          <>
            <GrantPendingCard
              contactSupport={vm.grant.contactSupport}
              pendingAmount={vm.pendingAmount}
              pendingBody={vm.grant.pendingBody}
              pendingHint={vm.grant.pendingHint}
              pendingLabel={vm.grant.pendingLabel}
              tokenGagx={vm.tokenGagx}
            />
            <ClaimStackDivider />
          </>
        ) : null}

        <SimpleClaimableCard
          amountText={vm.claimableText}
          claimIntoWallet={vm.claimIntoWallet}
          claimableLabel={vm.hasGrantClaimable ? t.rewards.detail.claimable : ''}
          showTokenChip={vm.showTokenChip}
          tokenGagx={vm.tokenGagx}
          usdLabel={t.rewards.detail.usdLabel}
        />

        {walletReady ? (
          <MainButton
            className="min-h-13 py-2 text-sm/4"
            density="external"
            disabled={!vm.canSubmit}
            loading={vm.isClaiming}
            onClick={vm.onClaim}
          >
            {vm.ctaLabel}
          </MainButton>
        ) : (
          <DockConnectPromo />
        )}
      </DockStack>
    </TabHeader>
  )
}

/**
 * 混合领取左栏面板（幸运奖 / 共建奖 / 推荐奖 / 参与奖）
 */
export function MixedClaimDock({ view }: { view: MixedClaimView }) {
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useMixedClaim(view)
  const t = vm.t
  const splitCtaActive = vm.canConfirm && !vm.submitting

  return (
    <TabHeader
      backText={t.rewards.backToHub}
      onBack={() => setView('hub')}
      subtitle={withContributionRatio(vm.card.body)}
      title={vm.card.title}
    >
      <DockStack>
        {vm.showCobuildRewardType ? (
          <Segment
            aria-label={t.rewards.cobuild.recordsTabsAria}
            onChange={(value) => vm.setCobuildRewardType(value as 'RANK_REWARD' | 'SURPASS_REWARD')}
            options={vm.cobuildRewardTypeOptions}
            value={vm.cobuildRewardType}
          />
        ) : null}
        <MixedClaimSummaryCard
          amountKnown={vm.amountKnown}
          amountText={vm.amountText}
          claimableLabel={
            view === 'lucky' || vm.hasClaimablePreview ? t.rewards.detail.claimable : ''
          }
          requiredContributionLabel={vm.mixed.requiredContributionLabel}
          requiredText={
            view === 'lucky'
              ? vm.amount > ZERO_BI
                ? vm.requiredText
                : formatApiAmount(null)
              : vm.hasClaimablePreview
                ? vm.requiredText
                : formatApiAmount(null)
          }
          tokenGagx={vm.mixed.tokenGagx}
        />
        {vm.showSignedAmountHint ? (
          <Text as="p" className="leading-4 text-foreground/40" variant="copy">
            {t.rewards.detail.signedAmountHint}
          </Text>
        ) : null}

        <Reveal open={vm.luckyPaused}>
          <Text as="p" className="text-destructive" variant="copy">
            {vm.mixed.luckyPaused}
          </Text>
        </Reveal>
        <Reveal open={vm.luckyNotClaimable}>
          <Text as="p" tone="muted-foreground" variant="copy">
            {vm.mixed.luckyNotClaimable}
          </Text>
        </Reveal>

        <Reveal open={vm.showContributionShort}>
          <div className="rounded-2xl bg-accent px-4 py-3">
            <Text as="p" className="leading-5" variant="copy">
              <span className="text-foreground">
                {interpolate(vm.mixed.insufficientContributionDetail, {
                  need: vm.requiredText,
                  have: vm.haveText,
                })}
              </span>{' '}
              <Button
                className="inline h-auto w-auto! p-0 align-baseline text-[length:inherit] leading-[inherit] font-semibold text-primary underline"
                onClick={() => openExchangeView('burn')}
                shape="rounded"
                size="sm"
                type="button"
                variant="link"
              >
                {vm.mixed.goBurnInline}
              </Button>
              <span className="text-foreground">{vm.mixed.getContributionSuffix}</span>
            </Text>
          </div>
        </Reveal>

        <Card surface="outlined">
          <ClaimSplitSlider
            aria-label={vm.mixed.splitAria}
            className="max-w-none"
            onChange={vm.setReleasePct}
            value={vm.releasePct}
          />
          <div className="mt-1 flex justify-between gap-2">
            <Text as="span" className="leading-4 font-semibold text-primary" variant="detail">
              {interpolate(vm.mixed.restakePct, { pct: vm.restakePct })}
            </Text>
            <Text as="span" className="leading-4 font-semibold text-claim" variant="detail">
              {interpolate(vm.mixed.releasePct, { pct: vm.releasePct })}
            </Text>
          </div>
        </Card>

        <RewardsDestinationCard tone="restake">
          <RewardsDestinationCard.Header
            title={vm.mixed.restakeLabel}
            tone="restake"
            trailing={vm.mixed.restakeInto}
          />
          <RewardsDestinationCard.Amount
            amountText={vm.restakeAmountText}
            tokenLabel={vm.mixed.tokenGagx}
          />
          <RewardsDestinationCard.Period label={vm.mixed.restakePeriod}>
            <SelectMenu
              ariaLabel={vm.mixed.restakeAria}
              onSelect={(value) => vm.setRestakeDays(Number(value))}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
              variant="pill"
            />
          </RewardsDestinationCard.Period>
        </RewardsDestinationCard>

        <RewardsDestinationCard tone="release">
          <RewardsDestinationCard.Header
            title={t.rewards.claim}
            tone="release"
            trailing={vm.mixed.releaseInto}
          />
          <RewardsDestinationCard.Amount
            amountText={vm.releaseAmountText}
            tokenLabel={vm.mixed.tokenGagx}
          />
          <RewardsDestinationCard.Period label={vm.mixed.releasePeriod}>
            <SelectMenu
              ariaLabel={vm.mixed.releaseAria}
              onSelect={(value) => vm.setReleaseDays(Number(value))}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
              variant="pill"
            />
          </RewardsDestinationCard.Period>
        </RewardsDestinationCard>

        {vm.walletReady ? (
          <MainButton
            className={cn(
              'min-h-13 py-2! font-normal!',
              splitCtaActive && [
                'border-0 bg-transparent text-primary-foreground shadow-none',
                'hover:bg-transparent hover:shadow-none focus-visible:shadow-none',
                'transition-[border-color,box-shadow,transform,opacity,color]',
              ],
            )}
            density="external"
            disabled={!vm.canConfirm}
            loading={vm.submitting}
            onClick={vm.onConfirm}
            style={claimSplitCtaStyle(vm.releasePct, splitCtaActive)}
          >
            <span
              className={cn(
                'flex flex-col items-start gap-0.5 text-left font-normal!',
                splitCtaActive && 'text-white',
              )}
            >
              <Text
                as="span"
                className={cn('leading-4 font-normal!', splitCtaActive && 'text-white')}
                variant="detail"
              >
                {vm.mixed.ctaRestakeLine.replace(
                  '{amount}',
                  `${vm.restakeAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
              <Text
                as="span"
                className={cn('leading-4 font-normal!', splitCtaActive && 'text-white')}
                variant="detail"
              >
                {vm.mixed.ctaReleaseLine.replace(
                  '{amount}',
                  `${vm.releaseAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
            </span>
          </MainButton>
        ) : (
          <DockConnectPromo />
        )}
      </DockStack>
    </TabHeader>
  )
}
