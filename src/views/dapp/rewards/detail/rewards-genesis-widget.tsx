import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ProgressMeter } from '~/app/shell/progress-meter'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'
import { useRewardsGenesisView } from '~/views/dapp/rewards/detail/use-rewards-genesis-view'

export function RewardsGenesisClaimWidget() {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useRewardsGenesisView()
  const banner = dappDarkBanner()

  return (
    <>
      <DappTabHeader
        backText={t.rewards.backToHub}
        onBack={() => setView('hub')}
        subtitle={vm.g.pageSubtitle}
        title={vm.g.pageTitle}
      />
      <DappWidgetStack>
        <div className={banner.root({ className: 'gap-3.5 p-4' })}>
          <div className="grid gap-1.5">
            <Text as="p" className="text-primary" variant="caption">
              {t.rewards.heroKicker}
            </Text>
            <div className="flex items-start justify-between gap-3">
              <Text as="p" className="font-semibold text-white" variant="detail">
                {vm.rankBusy ? '0' : vm.rankLabel || t.rewards.shareholderNoRankTitle}
              </Text>
              {vm.hasRank && vm.isSuperCommunity ? (
                <Text as="p" className="shrink-0 text-primary" variant="caption">
                  {t.rewards.superCommunityBadge}
                </Text>
              ) : null}
            </div>
            {vm.hasRank ? (
              <Text as="p" className="text-white/60" variant="caption">
                {vm.teamRewardRateLabel}
              </Text>
            ) : (
              <Text as="p" className="text-white/60" variant="caption">
                {vm.sessionReady ? t.rewards.shareholderNoRankBody : t.rewards.hub.sessionHint}
              </Text>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="text-white/55" variant="caption">
                {vm.personalProgressLabel}
              </Text>
              <Text as="span" className="text-white/80" variant="caption">
                {vm.rankBusy ? '0' : vm.personalProgressValue}
              </Text>
            </div>
            <ProgressMeter label={vm.personalProgressLabel} value={vm.personalProgressPercent} />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="text-white/55" variant="caption">
                {t.rewards.teamVolume}
              </Text>
              <Text as="span" className="text-white/80" variant="caption">
                {vm.rankBusy ? '0' : vm.teamProgressValue}
              </Text>
            </div>
            <ProgressMeter label={t.rewards.teamVolume} value={vm.teamProgressPercent} />
          </div>
        </div>

        <Card surface="outlined" className="rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.referralRewards}
            </Text>
            <Text as="p" className="font-semibold text-primary" variant="caption">
              {t.rewards.autoPaidLabel}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {vm.referralValue}
          </Text>
          <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
            {t.rewards.autoPaid}
          </Text>
        </Card>

        <Card surface="outlined" className="rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.teamRewards}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {vm.teamMeta}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {vm.teamClaimable}
          </Text>
          {vm.walletReady ? (
            <DappActionButton
              className="mt-3"
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

        <Card surface="outlined" className="rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.communityFund}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {vm.communityLockedMeta}
            </Text>
          </div>
          <Text as="p" className="mt-2 font-semibold" variant="headline">
            {vm.isSuperCommunity || !vm.sessionReady
              ? vm.communityClaimable
              : formatApiDecimalAmount(null)}
          </Text>
          {vm.walletReady ? (
            <DappActionButton
              className="mt-3"
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
