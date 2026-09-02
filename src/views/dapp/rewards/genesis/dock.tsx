/**
 * 创世左栏面板
 *
 * 深色等级卡展示当前等级与个人 / 团队进度，
 * 下方为直推奖励、等级奖励、发展基金三张领取卡；未连接钱包时显示引导。
 */
import { useI18n } from '~/i18n/use-i18n'
import { darkBanner } from '~/shared/components/dark-banner'
import { ProgressBar } from '~/shared/components/progress-bar'
import { Text } from '~/shared/components/text'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { GenesisClaimCard } from '~/views/dapp/rewards/genesis/primitives'
import { useGenesisDock } from '~/views/dapp/rewards/genesis/use-genesis'
import { formatApiAmount } from '~/views/dapp/rewards/shared'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function GenesisDock() {
  const { messages: t } = useI18n()
  const setView = useRewardsViewStore((state) => state.setView)
  const vm = useGenesisDock()
  const banner = darkBanner()

  return (
    <TabHeader
      backText={t.rewards.backToHub}
      onBack={() => setView('hub')}
      subtitle={vm.g.pageSubtitle}
      title={vm.g.pageTitle}
    >
      <DockStack className="gap-4">
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
            ) : vm.sessionReady ? (
              <Text as="p" className="leading-none text-white/60" variant="support">
                {t.rewards.shareholderNoRankBody}
              </Text>
            ) : null}
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
            <ProgressBar
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
            <ProgressBar
              className="bg-white/12"
              label={t.rewards.teamVolume}
              value={vm.teamProgressPercent}
            />
          </div>
        </div>

        <GenesisClaimCard className="py-4">
          <GenesisClaimCard.Header
            label={t.rewards.referralRewards}
            meta={t.rewards.autoPaidLabel}
            metaTone="primary"
          />
          <GenesisClaimCard.Value className="mt-2">{vm.referralValue}</GenesisClaimCard.Value>
          <GenesisClaimCard.Note>{t.rewards.autoPaid}</GenesisClaimCard.Note>
        </GenesisClaimCard>

        <GenesisClaimCard className="py-3.5">
          <GenesisClaimCard.Header label={t.rewards.teamRewards} meta={vm.teamMeta} />
          <GenesisClaimCard.Value className="mt-1.5">{vm.teamClaimable}</GenesisClaimCard.Value>
          {vm.walletReady ? (
            <GenesisClaimCard.Action
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
            </GenesisClaimCard.Action>
          ) : null}
        </GenesisClaimCard>

        <GenesisClaimCard className="py-3.5">
          <GenesisClaimCard.Header label={t.rewards.communityFund} meta={vm.communityLockedMeta} />
          <GenesisClaimCard.Value className="mt-1.5">
            {vm.isSuperCommunity || !vm.sessionReady
              ? vm.communityClaimable
              : formatApiAmount(null)}
          </GenesisClaimCard.Value>
          {vm.walletReady ? (
            <GenesisClaimCard.Action
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
            </GenesisClaimCard.Action>
          ) : null}
        </GenesisClaimCard>

        {!vm.walletReady ? <DockConnectPromo /> : null}
      </DockStack>
    </TabHeader>
  )
}
