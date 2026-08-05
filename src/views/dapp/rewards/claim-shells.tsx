/**
 * 奖励域共享领取壳：SimpleClaimDock / MixedClaimDock。
 *
 * 供 referral / participate / grant / lucky / cobuild 等 mode dock 组装；
 * 禁止再扩成域级 mega primitives。
 */
import { useAppShell } from '~/app/use-app-shell'
import type { ReleaseDurationDays, RestakeDurationDays } from '~/core/assets/claim-plans'
import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { MainButton } from '~/shared/components/main-button'
import { Segment } from '~/shared/components/segment'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import {
  ClaimStackDivider,
  ContributionShortBanner,
  GrantPendingCard,
  MixedClaimSummaryCard,
  RewardsDestinationCard,
  SimpleClaimableCard,
} from '~/views/dapp/rewards/claim-primitives'
import { formatApiDecimalAmount, type MixedClaimView } from '~/views/dapp/rewards/shared'
import { useMixedClaim } from '~/views/dapp/rewards/use-mixed-claim'
import { type SimpleClaimView, useSimpleClaim } from '~/views/dapp/rewards/use-simple-claim'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

/**
 * 简单领取左栏面板（发展津贴 / 参与奖 / 推荐奖）
 */
export function SimpleClaimDock({ view }: { view: SimpleClaimView }) {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const { walletReady, sessionReady } = useAppShell()
  const vm = useSimpleClaim(view, sessionReady)

  return (
    <>
      <TabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.card.body}
        title={vm.card.title}
      />
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
          claimableLabel={t.rewards.detail.claimable}
          showTokenChip={vm.showTokenChip}
          tokenGagx={vm.tokenGagx}
          usdLabel={t.rewards.detail.usdLabel}
        >
          {view === 'participate' ? (
            <Text as="p" className="leading-4 text-foreground/40" variant="copy">
              {vm.participate.simpleHint}
            </Text>
          ) : null}
          {view === 'referral' ? (
            <Text as="p" className="leading-4 text-foreground/40" variant="copy">
              {vm.referral.simpleHint}
            </Text>
          ) : null}
          {vm.showEmptyReferral || vm.showEmptyParticipate ? (
            <Text as="p" className="leading-4 text-foreground/40" variant="copy">
              {t.rewards.detail.emptyClaimable}
            </Text>
          ) : null}
        </SimpleClaimableCard>

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
    </>
  )
}

/**
 * 混合领取左栏面板（幸运奖 / 共建奖）
 */
export function MixedClaimDock({ view }: { view: MixedClaimView }) {
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useMixedClaim(view)
  const t = vm.t

  return (
    <>
      <TabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.card.body}
        title={vm.card.title}
      />
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
          claimableLabel={t.rewards.detail.claimable}
          requiredContributionLabel={vm.mixed.requiredContributionLabel}
          requiredText={
            view === 'lucky' && vm.amount > 0n ? vm.requiredText : formatApiDecimalAmount(null)
          }
          tokenGagx={vm.mixed.tokenGagx}
        />

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
          <ContributionShortBanner>
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
          </ContributionShortBanner>
        ) : null}

        <Card surface="outlined">
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
              onSelect={(value) => vm.setReleaseDays(Number(value) as ReleaseDurationDays)}
              options={vm.releaseOptions}
              value={String(vm.releaseDays)}
              variant="pill"
            />
          </RewardsDestinationCard.Period>
        </RewardsDestinationCard>

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
              onSelect={(value) => vm.setRestakeDays(Number(value) as RestakeDurationDays)}
              options={vm.restakeOptions}
              value={String(vm.restakeDays)}
              variant="pill"
            />
          </RewardsDestinationCard.Period>
        </RewardsDestinationCard>

        {vm.walletReady ? (
          <MainButton
            className="min-h-13 py-2! font-normal!"
            density="external"
            disabled={!vm.canConfirm}
            loading={vm.submitting}
            onClick={vm.onConfirm}
          >
            <span className="flex flex-col items-start gap-0.5 text-left font-normal! text-white">
              <Text as="span" className="leading-4 font-normal! text-white" variant="detail">
                {vm.mixed.ctaReleaseLine.replace(
                  '{amount}',
                  `${vm.releaseAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
              <Text as="span" className="leading-4 font-normal! text-white" variant="detail">
                {vm.mixed.ctaRestakeLine.replace(
                  '{amount}',
                  `${vm.restakeAmountText} ${vm.mixed.tokenGagx}`,
                )}
              </Text>
            </span>
          </MainButton>
        ) : (
          <DockConnectPromo />
        )}
      </DockStack>
    </>
  )
}
