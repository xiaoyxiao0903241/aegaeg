import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { ProgressMeter } from '~/app/shell/progress-meter'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { darkBanner } from '~/shared/components/dark-banner'
import { Text } from '~/shared/components/text'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { useRewardsGenesisView } from '~/views/dapp/rewards/detail/use-rewards-genesis-view'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'

/**
 * 创世左栏面板
 *
 * 深色等级卡展示当前等级与个人 / 团队进度，
 * 下方为直推奖励、等级奖励、发展基金三张领取卡；未连接钱包时显示引导。
 */
export function RewardsGenesisClaimWidget() {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useRewardsGenesisView()
  const banner = darkBanner()

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.g.pageSubtitle}
        title={vm.g.pageTitle}
      />
      <DappWidgetStack className="gap-4">
        <div className={banner.root({ className: 'flex flex-col gap-3.5 p-4' })}>
          <div className="grid gap-1.5">
            <Text as="p" className="font-medium" tone="primary-bright" variant="caption">
              {t.rewards.heroKicker}
            </Text>
            <div className="flex items-center justify-between gap-3">
              <Text as="p" className="m-0 leading-none font-semibold text-white" variant="section">
                {vm.rankBusy ? '0' : vm.rankLabel || t.rewards.shareholderNoRankTitle}
              </Text>
              {vm.hasRank && vm.isSuperCommunity ? (
                <Text
                  as="p"
                  className="shrink-0 leading-none font-semibold"
                  tone="primary-bright"
                  variant="support"
                >
                  {t.rewards.superCommunityBadge}
                </Text>
              ) : null}
            </div>
            {vm.hasRank ? (
              <Text as="p" className="leading-none text-white/60" variant="support">
                {vm.teamRewardRatePrefix}{' '}
                <Text as="span" className="text-coral-emphasis" variant="support">
                  {vm.teamRewardRate}
                </Text>
              </Text>
            ) : (
              <Text as="p" className="leading-none text-white/60" variant="support">
                {vm.sessionReady ? t.rewards.shareholderNoRankBody : t.rewards.hub.sessionHint}
              </Text>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="leading-none text-white/55" variant="support">
                {vm.personalProgressLabel}
              </Text>
              <Text as="span" className="leading-none text-white/80" variant="support">
                {vm.rankBusy ? '0' : vm.personalProgressValue}
              </Text>
            </div>
            <ProgressMeter
              className="bg-white/12"
              label={vm.personalProgressLabel}
              value={vm.personalProgressPercent}
            />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="leading-none text-white/55" variant="support">
                {t.rewards.teamVolume}
              </Text>
              <Text as="span" className="leading-none text-white/80" variant="support">
                {vm.rankBusy ? '0' : vm.teamProgressValue}
              </Text>
            </div>
            <ProgressMeter
              className="bg-white/12"
              label={t.rewards.teamVolume}
              value={vm.teamProgressPercent}
            />
          </div>
        </div>

        {/* 直推奖励卡：自动支付 */}
        <Card surface="outlined" className="rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
              {t.rewards.referralRewards}
            </Text>
            <Text as="p" className="leading-4 font-semibold text-primary" variant="support">
              {t.rewards.autoPaidLabel}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {vm.referralValue}
          </Text>
          <Text as="p" className="mt-2 leading-4" tone="muted-foreground" variant="support">
            {t.rewards.autoPaid}
          </Text>
        </Card>

        {/* 等级奖励卡：右侧显示累计已领金额 */}
        <Card surface="outlined" className="rounded-2xl px-5 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
              {t.rewards.teamRewards}
            </Text>
            <Text as="p" className="leading-4 text-foreground/70" variant="support">
              {vm.teamMeta}
            </Text>
          </div>
          <Text as="p" className="mt-1.5 font-semibold" variant="headline">
            {vm.teamClaimable}
          </Text>
          {vm.walletReady ? (
            <DappActionButton
              className="mt-2.5"
              density="inverse"
              disabled={
                !vm.sessionReady ||
                vm.teamClaimableValue <= 0 ||
                vm.teamLoading ||
                vm.teamClaimIsClaiming ||
                !vm.teamClaimCanClaim
              }
              loading={vm.teamClaimIsClaiming}
              onClick={vm.onClaimTeamReward}
            >
              {vm.g.claimToWallet}
            </DappActionButton>
          ) : null}
        </Card>

        {/* 发展基金卡：仅超级社区可领取，其余显示锁定金额 */}
        <Card surface="outlined" className="rounded-2xl px-5 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
              {t.rewards.communityFund}
            </Text>
            <Text as="p" className="leading-4 text-foreground/70" variant="support">
              {vm.communityLockedMeta}
            </Text>
          </div>
          <Text as="p" className="mt-1.5 font-semibold" variant="headline">
            {vm.isSuperCommunity || !vm.sessionReady
              ? vm.communityClaimable
              : formatApiDecimalAmount(null)}
          </Text>
          {vm.walletReady ? (
            <DappActionButton
              className="mt-2.5"
              density="inverse"
              disabled={
                !vm.sessionReady ||
                !vm.isSuperCommunity ||
                !(vm.communityClaimableValue > 0) ||
                vm.communityFundLoading ||
                vm.communityFundClaimIsClaiming ||
                !vm.communityFundClaimCanClaim
              }
              loading={vm.communityFundClaimIsClaiming}
              onClick={vm.onClaimCommunityFund}
            >
              {vm.g.claimToWallet}
            </DappActionButton>
          ) : null}
        </Card>

        {!vm.walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
