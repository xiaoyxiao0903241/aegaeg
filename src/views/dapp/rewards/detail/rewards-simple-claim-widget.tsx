import { ChevronDown } from 'lucide-react'

import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/detail/rewards-claim-token-row'
import { RewardsGagxAmount } from '~/views/dapp/rewards/detail/rewards-gagx-amount'
import {
  type SimpleClaimView,
  useRewardsSimpleClaimView,
} from '~/views/dapp/rewards/detail/use-rewards-simple-claim-view'

/**
 * 简单领取左栏面板（发展津贴 / 参与奖 / 推荐奖）
 *
 * 发展津贴先展示待审批金额，再展示可领取额；
 * 参与奖与推荐奖直接按签名将奖励领取至钱包。
 *
 * @param view 子视图类型
 */
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
          <DappActionButton
            className="min-h-13 py-2 text-sm/4"
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
