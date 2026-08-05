/**
 * 奖励域共享领取壳：SimpleClaimDock / MixedClaimDock。
 *
 * 供 referral / participate / grant / lucky / cobuild 等 mode dock 组装；
 * 禁止再扩成域级 mega primitives。
 */
import { ChevronDown } from 'lucide-react'

import { dappAssets } from '~/app/assets'
import { CtaButton } from '~/app/shell/cta-button'
import { TabHeader } from '~/app/shell/tab-header'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useAppShell } from '~/app/use-app-shell'
import type { ReleaseDurationDays, RestakeDurationDays } from '~/core/assets/claim-plans'
import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { ClaimSplitSlider } from '~/shared/components/claim-split-slider'
import { Segment } from '~/shared/components/segment'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { RewardsGagxAmount } from '~/views/dapp/rewards/claim-gagx-amount'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/claim-token-row'
import { RewardsDestinationCard } from '~/views/dapp/rewards/rewards-destination-card'
import { formatApiDecimalAmount, type MixedClaimView } from '~/views/dapp/rewards/rewards-display'
import { useMixedClaim } from '~/views/dapp/rewards/use-mixed-claim'
import { type SimpleClaimView, useSimpleClaim } from '~/views/dapp/rewards/use-simple-claim'

/**
 * 简单领取左栏面板（发展津贴 / 参与奖 / 推荐奖）
 *
 * 发展津贴先展示待审批金额，再展示可领取额；
 * 参与奖与推荐奖直接按签名将奖励领取至钱包。
 *
 * @param view 子视图类型
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
      <WidgetStack>
        {view === 'grant' ? (
          <>
            {/* 待审批卡：金额 + 客服链接与说明 */}
            <Card surface="outlined">
              <div className="flex items-start justify-between gap-3">
                <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                  {vm.grant.pendingLabel}
                </Text>
                <Text
                  as="p"
                  className="max-w-40 text-right leading-4 text-foreground/40"
                  variant="copy"
                >
                  {vm.grant.pendingHint}
                </Text>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <RewardsGagxAmount textVariant="copy">{vm.tokenGagx}</RewardsGagxAmount>
                <Text as="p" className="text-2xl leading-none font-semibold" variant="headline">
                  {vm.pendingAmount}
                </Text>
              </div>
              <div className="mt-1.5 grid gap-1">
                {/* 客服外链：用 ↗ 箭头（非折叠 chevron） */}
                <a
                  className="inline-flex w-fit items-center gap-1 font-medium text-coral-emphasis underline"
                  href={COMMUNITY_SOCIAL_LINKS.telegram}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Text as="span" className="font-medium text-coral-emphasis" variant="copy">
                    {vm.grant.contactSupport}
                  </Text>
                  <img
                    alt=""
                    aria-hidden
                    className="size-2.5 shrink-0"
                    src={dappAssets.arrowUpRight}
                  />
                </a>
                <Text as="p" className="leading-none text-foreground/40" variant="copy">
                  {vm.grant.pendingBody}
                </Text>
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <span className="inline-flex size-8.5 items-center justify-center rounded-control border border-border bg-card shadow-sm">
                {/* 静态分隔箭头（仅示意，无开合交互） */}
                <ChevronDown
                  aria-hidden
                  className="size-2.5 text-foreground/40"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </>
        ) : null}

        {/* 可领取卡：三种类型共用，领取至钱包 */}
        <div className="grid gap-2 rounded-2xl border border-primary/35 bg-primary-soft p-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" className="leading-5 text-foreground" variant="copy">
              {t.rewards.detail.claimable}
            </Text>
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              {vm.claimIntoWallet}
            </Text>
          </div>
          {vm.showTokenChip ? (
            <RewardsClaimTokenRow amountText={vm.claimableText} tokenLabel={vm.tokenGagx} />
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="font-semibold" variant="detail">
                {t.rewards.detail.usdLabel}
              </Text>
              <Text as="span" className="text-2xl font-semibold" variant="headline">
                {vm.claimableText}
              </Text>
            </div>
          )}
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
        </div>

        {walletReady ? (
          <CtaButton
            className="min-h-13 py-2 text-sm/4"
            density="external"
            disabled={!vm.canSubmit}
            loading={vm.isClaiming}
            onClick={vm.onClaim}
          >
            {vm.ctaLabel}
          </CtaButton>
        ) : (
          <WidgetConnectPromo />
        )}
      </WidgetStack>
    </>
  )
}

/**
 * 混合领取左栏面板（幸运奖 / 共建奖）
 *
 * 顶部展示可领金额与所需贡献，贡献不足时给出提醒并引导去销毁；
 * 下方为领取 / 复投比例滑块、释放与复投计划卡，最后是双行提交按钮。
 *
 * @param view 子视图类型（lucky / cobuild）
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
      <WidgetStack>
        {vm.showCobuildRewardType ? (
          <Segment
            aria-label={t.rewards.cobuild.recordsTabsAria}
            onChange={(value) => vm.setCobuildRewardType(value as 'RANK_REWARD' | 'SURPASS_REWARD')}
            options={vm.cobuildRewardTypeOptions}
            value={vm.cobuildRewardType}
          />
        ) : null}
        <Card surface="outlined">
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
          <CtaButton
            className="min-h-13 py-2! font-normal!"
            density="external"
            disabled={!vm.canConfirm}
            loading={vm.submitting}
            onClick={vm.onConfirm}
          >
            {/* 提交按钮：双行文案（释放 + 复投） */}
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
          </CtaButton>
        ) : (
          <WidgetConnectPromo />
        )}
      </WidgetStack>
    </>
  )
}
