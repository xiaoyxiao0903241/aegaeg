import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { useDappShell } from '~/app/use-dapp-shell'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/core/presale/tier-table'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
  getPresaleRankHighlightedRows,
} from '~/shared/api/format-display'
import {
  useCommunityFundLogs,
  useCommunityFundTotal,
  useRewardLogs,
  useTeamRewardClaimLogs,
} from '~/hooks/use-api-data'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
  REWARDS_DASH,
} from '~/views/dapp/rewards/rewards-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'

type GenesisHistoryTab = 'referral' | 'team' | 'communityFund'

function formatGenesisTierTeamCell(
  rankLabel: string,
  totalVolumeValue: string,
  tierDualLegRequirement: string,
): string {
  const rank = Number.parseInt(rankLabel.replace(/^S/i, ''), 10)
  const legRank = getTeamRequirementLegRank(rank)
  if (legRank == null) return totalVolumeValue
  return tierDualLegRequirement.replace('{rank}', formatPresaleRank(legRank))
}

export function RewardsGenesisContent() {
  const { messages: t } = useI18n()
  const g = t.rewards.genesisDetail
  const { sessionReady } = useDappShell()
  const { displayRank, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true
  const hasRank = displayRank > 0
  const [historyTab, setHistoryTab] = useState<GenesisHistoryTab>('referral')

  const { data: rewardLogs, isLoading: rewardLogsLoading } = useRewardLogs(
    { page: 1, page_size: 20 },
    sessionReady,
  )
  const { data: teamClaimLogs, isLoading: teamLogsLoading } = useTeamRewardClaimLogs(
    { page: 1, page_size: 20 },
    sessionReady,
  )
  const { data: communityFundLogs, isLoading: communityLogsLoading } = useCommunityFundLogs(
    { page: 1, page_size: 20 },
    sessionReady && isSuperCommunity,
  )

  const heroBody = hasRank
    ? formatShareholderHintForRank(
        displayRank,
        t.rewards.heroTierRewardBody,
        t.rewards.shareholderNoRankBody,
        buildRewardTierRows(),
      )
    : t.rewards.shareholderNoRankBody

  const rewardTiers = buildRewardTierRows()
  const highlightedRows = getPresaleRankHighlightedRows(displayRank, rewardTiers.length)
  const tierRows = rewardTiers.map((row, rowIndex) => {
    const rankLabel = row[0] ?? ''
    const personal = row[1] ?? ''
    const team = formatGenesisTierTeamCell(
      rankLabel,
      row[2] ?? '',
      t.rewards.tierDualLegRequirement,
    )
    const rate = row[3] ?? ''
    const levelCell = highlightedRows.includes(rowIndex)
      ? `${rankLabel} · ${t.rewards.currentTierSuffix}`
      : rankLabel
    return [levelCell, personal, team, rate]
  })

  const historyStatusLabels = t.rewards.logStatus
  const typeReferral = t.rewards.rewardType.referralPaid
  const typeTeam = t.rewards.rewardType.presaleTeam
  const typeFund = t.rewards.communityFund

  const historyRows =
    historyTab === 'referral'
      ? (rewardLogs?.items.map((item) => {
          const mapped = mapRewardLogToRow(item, historyStatusLabels)
          return [
            mapped[0] ?? REWARDS_DASH,
            typeReferral,
            mapped[1] ?? REWARDS_DASH,
            mapped[4] ?? REWARDS_DASH,
          ]
        }) ?? [])
      : historyTab === 'team'
        ? (teamClaimLogs?.items.map((item) => {
            const mapped = mapTeamRewardClaimLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? REWARDS_DASH,
              typeTeam,
              mapped[1] ?? REWARDS_DASH,
              mapped[3] ?? REWARDS_DASH,
            ]
          }) ?? [])
        : (communityFundLogs?.items.map((item) => {
            const mapped = mapCommunityFundLogToRow(item, historyStatusLabels)
            return [
              mapped[0] ?? REWARDS_DASH,
              typeFund,
              mapped[1] ?? REWARDS_DASH,
              mapped[2] ?? REWARDS_DASH,
            ]
          }) ?? [])

  const historyLoading =
    historyTab === 'referral'
      ? rewardLogsLoading
      : historyTab === 'team'
        ? teamLogsLoading
        : communityLogsLoading

  const historyEmpty =
    historyTab === 'referral'
      ? t.rewards.referralHistoryEmpty
      : historyTab === 'team'
        ? t.rewards.teamHistoryEmpty
        : t.rewards.communityFundHistoryEmpty

  const historyTabOptions: Array<{ label: string; value: GenesisHistoryTab }> = [
    { label: t.rewards.referralRewards, value: 'referral' },
    { label: t.rewards.teamRewards, value: 'team' },
    { label: t.rewards.communityFundHistory, value: 'communityFund' },
  ]

  const banner = dappDarkBanner()
  const showHeroSkeleton = sessionReady && isRankLoading

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{t.rewards.heroTitle}</DappContentHeading>
        <div
          className={banner.root({
            className: 'mt-4 min-h-34 overflow-visible p-6 max-dapp:p-4.5',
          })}
        >
          <div className={banner.content({ className: 'min-w-0 flex-1 pr-36 max-dapp:pr-0' })}>
            <Text as="span" className="text-primary" variant="caption">
              {t.rewards.heroKicker}
            </Text>
            {showHeroSkeleton ? (
              <Text as="p" className="mt-2 text-white/70" variant="copy">
                …
              </Text>
            ) : (
              <>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Text as="h3" className="m-0 font-semibold text-white" variant="brand">
                    {heroTitle || t.rewards.shareholderNoRankTitle}
                  </Text>
                  {hasRank && isSuperCommunity ? (
                    <Text as="span" className="text-primary" variant="caption">
                      {t.rewards.superCommunityBadge}
                    </Text>
                  ) : null}
                </div>
                <Text as="p" className="mt-2 text-white/65" variant="caption">
                  {heroBody}
                </Text>
                {hasRank && isSuperCommunity ? (
                  <Text as="p" className="mt-1 text-white/65" variant="caption">
                    {t.rewards.superCommunityBenefitBody}
                  </Text>
                ) : null}
              </>
            )}
          </div>
          <img
            alt=""
            className="pointer-events-none absolute -top-10.75 right-3 z-0 hidden h-48 w-32 max-w-32 -scale-x-100 object-contain select-none md:block"
            height="156"
            loading="lazy"
            src={dappAssets.rewardsCharacter}
            width="104"
          />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.allTiers}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['230px', '190px', '190px', '1fr']}
            headers={[...g.tierColumns]}
            highlightedRows={highlightedRows}
            rows={tierRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.history}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={g.recordsTabsAria}
              className="flex items-center justify-start gap-2"
              items={historyTabOptions.map((option) => ({
                active: option.value === historyTab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = historyTabOptions[index]
                if (next) setHistoryTab(next.value)
              }}
            />
          }
        >
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...g.recordsColumns]}
            isLoading={sessionReady && historyLoading}
            loadingRowCount={4}
            rows={historyRows}
          />
          {!sessionReady || (!historyLoading && historyRows.length === 0) ? (
            <DappTableEmptyMessage
              body={!sessionReady ? undefined : historyEmpty.body}
              embedded
              title={!sessionReady ? t.rewards.hub.signInForBalance : historyEmpty.title}
            />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{g.faq.title}</DappContentHeading>
        <FaqList items={g.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
