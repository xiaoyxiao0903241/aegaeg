import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/core/presale/tier-table'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
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
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import { readReferralCount } from '~/web3/referral/referral-read'
import { Button } from '~/shared/ui/button'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import type { RewardsView } from '~/shared/config/rewards-deep-link'
import {
  mapCommunityFundLogToRow,
  mapRewardLogToRow,
  mapTeamRewardClaimLogToRow,
} from '~/views/dapp/rewards/rewards-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'

type CobuildRecordsTab = 'cobuild' | 'equalize'
type GrantRecordsTab = 'issue' | 'claim'
type GenesisHistoryTab = 'referral' | 'team' | 'communityFund'

const DASH = '—'
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

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

function RewardsGenesisContent() {
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
          return [mapped[0] ?? DASH, typeReferral, mapped[1] ?? DASH, mapped[4] ?? DASH]
        }) ?? [])
      : historyTab === 'team'
        ? (teamClaimLogs?.items.map((item) => {
            const mapped = mapTeamRewardClaimLogToRow(item, historyStatusLabels)
            return [mapped[0] ?? DASH, typeTeam, mapped[1] ?? DASH, mapped[3] ?? DASH]
          }) ?? [])
        : (communityFundLogs?.items.map((item) => {
            const mapped = mapCommunityFundLogToRow(item, historyStatusLabels)
            return [mapped[0] ?? DASH, typeFund, mapped[1] ?? DASH, mapped[2] ?? DASH]
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

function RewardsLuckyContent() {
  const { messages: t } = useI18n()
  const lucky = t.rewards.lucky

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{lucky.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.todayPool}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.eligibility}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.cumulativeWins}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-col gap-3.5 rounded-2xl bg-[#1c2234] px-5.5 py-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text as="p" className="font-semibold text-white" variant="detail">
              {lucky.vrfTitle}
            </Text>
            <Button
              className="rounded-full border border-white/25 bg-transparent px-4 py-1.5 text-white hover:bg-white/10"
              disabled
              type="button"
              variant="secondary"
            >
              {lucky.verifyTutorial}
            </Button>
          </div>
          <Text as="p" className="text-[12.5px] leading-[21px] text-white/65" variant="caption">
            {lucky.vrfBody}
          </Text>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DappContentHeading>{lucky.resultsTitle}</DappContentHeading>
          {/* Figma `4396:225` date pill — shell only until draw indexer exists */}
          <button
            aria-label={lucky.dateFilterAria}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-[7px] pr-3 pl-3.5 disabled:opacity-100"
            disabled
            type="button"
          >
            <Text as="span" className="text-[13px] font-semibold" variant="caption">
              {DASH}
            </Text>
            <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
          </button>
        </div>
        <DappTableCard className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Text as="span" className="font-semibold" variant="caption">
              {lucky.resultsSummary.replace('{count}', DASH)}
            </Text>
            <Text as="span" className="text-primary underline" variant="caption">
              {lucky.verifyHash.replace('{hash}', DASH)}
            </Text>
          </div>
          <ResponsiveTable
            colWidths={['90px', '255px', '175px', '1fr']}
            headers={[...lucky.resultsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={lucky.emptyResults} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.historyTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['150px', '148px', '235px', '1fr']}
            headers={[...lucky.historyColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={lucky.emptyHistory} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.faq.title}</DappContentHeading>
        <FaqList items={lucky.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function RewardsReferralContent() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const countQuery = useQuery({
    queryKey: queryKeys.chain.rewardsReferralCount(address ?? ''),
    queryFn: () => readReferralCount(address as Address, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const contribQuery = useQuery({
    queryKey: queryKeys.chain.assetsContribution(address ?? ''),
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const referralCount =
    !walletReady || !address
      ? DASH
      : countQuery.isPending
        ? '…'
        : countQuery.data != null
          ? String(countQuery.data)
          : DASH

  const contributionValue =
    !walletReady || !address
      ? DASH
      : contribQuery.isPending
        ? '…'
        : contribQuery.data
          ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS, 2)
          : DASH

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.myPosition}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.directCount}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {referralCount}
            </Text>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {referral.contributionHint}
              </Text>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.nextPayout}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...referral.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyRecords} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '170px', '110px', '1fr']}
            headers={[...referral.referralsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyReferrals} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function RewardsParticipateContent() {
  const { messages: t } = useI18n()
  const participate = t.rewards.participate
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const contribQuery = useQuery({
    queryKey: queryKeys.chain.assetsContribution(address ?? ''),
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const contributionValue =
    !walletReady || !address
      ? DASH
      : contribQuery.isPending
        ? '…'
        : contribQuery.data
          ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS, 2)
          : DASH

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{participate.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.myPosition}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {participate.contributionHint}
              </Text>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {participate.nextPayout}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...participate.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={participate.emptyRecords} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.inviterTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '170px', '110px', '1fr']}
            headers={[...participate.inviterColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={participate.emptyInviter} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.faq.title}</DappContentHeading>
        <FaqList items={participate.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function RewardsCobuildContent() {
  const { messages: t } = useI18n()
  const cobuild = t.rewards.cobuild
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const [recordsTab, setRecordsTab] = useState<CobuildRecordsTab>('cobuild')

  const countQuery = useQuery({
    queryKey: queryKeys.chain.rewardsCobuildCount(address ?? ''),
    queryFn: () => readReferralCount(address as Address, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const contribQuery = useQuery({
    queryKey: queryKeys.chain.assetsContribution(address ?? ''),
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const referralCount =
    !walletReady || !address
      ? DASH
      : countQuery.isPending
        ? '…'
        : countQuery.data != null
          ? String(countQuery.data)
          : DASH

  const contributionValue =
    !walletReady || !address
      ? DASH
      : contribQuery.isPending
        ? '…'
        : contribQuery.data
          ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS, 2)
          : DASH

  const recordsTabOptions: Array<{ label: string; value: CobuildRecordsTab }> = [
    { label: cobuild.recordsTabCobuild, value: 'cobuild' },
    { label: cobuild.recordsTabEqualize, value: 'equalize' },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{cobuild.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.totalPerformance}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.myPosition}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.directCount}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {referralCount}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.contributionHint}
              </Text>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {cobuild.nextPayout}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.tierTitle}</DappContentHeading>
        <div className="mt-4 rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.tierCurrent}
              </Text>
              <Text as="p" className="mt-1" variant="figure">
                {t.rewards.hub.stats.tierEmpty}
              </Text>
            </div>
            <div className="text-right">
              <Text as="p" tone="muted-foreground" variant="caption">
                {cobuild.tierNext}
              </Text>
              <Text as="p" className="mt-1 font-semibold" variant="copy">
                {DASH}
              </Text>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(
              [
                [cobuild.reqHolding, cobuild.reqHoldingHint],
                [cobuild.reqAccounts, cobuild.reqAccountsHint],
                [cobuild.reqPerformance, cobuild.reqPerformanceHint],
              ] as const
            ).map(([label, hint]) => (
              <div className="rounded-2xl border border-border p-4" key={label}>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {label}
                </Text>
                <Text as="p" className="mt-2 font-semibold" variant="copy">
                  {DASH}
                </Text>
                <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
                  {hint}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.recordsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={cobuild.recordsTabsAria}
              className="flex items-center justify-start gap-2"
              items={recordsTabOptions.map((option) => ({
                active: option.value === recordsTab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = recordsTabOptions[index]
                if (next) setRecordsTab(next.value)
              }}
            />
          }
        >
          <ResponsiveTable
            colWidths={['190px', '70px', '140px', '110px', '1fr']}
            headers={[...cobuild.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage
            embedded
            title={
              recordsTab === 'cobuild' ? cobuild.emptyRecordsCobuild : cobuild.emptyRecordsEqualize
            }
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.directsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '200px', '130px', '1fr']}
            headers={[...cobuild.directsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={cobuild.emptyDirects} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.faq.title}</DappContentHeading>
        <FaqList items={cobuild.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function RewardsGrantContent() {
  const { messages: t } = useI18n()
  const grant = t.rewards.grant
  const [recordsTab, setRecordsTab] = useState<GrantRecordsTab>('issue')

  const recordsTabOptions: Array<{ label: string; value: GrantRecordsTab }> = [
    { label: grant.recordsTabIssue, value: 'issue' },
    { label: grant.recordsTabClaim, value: 'claim' },
  ]

  const isIssue = recordsTab === 'issue'

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{grant.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {grant.tier}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {t.rewards.hub.stats.tierEmpty}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {grant.totalClaimed}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{grant.recordsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={grant.recordsTabsAria}
              className="flex items-center justify-start gap-2"
              items={recordsTabOptions.map((option) => ({
                active: option.value === recordsTab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = recordsTabOptions[index]
                if (next) setRecordsTab(next.value)
              }}
            />
          }
        >
          <ResponsiveTable
            colWidths={
              isIssue
                ? ['160px', '140px', '60px', '130px', '70px', '1fr']
                : ['190px', '160px', '1fr']
            }
            headers={[...(isIssue ? grant.issueColumns : grant.claimColumns)]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={isIssue ? grant.emptyIssue : grant.emptyClaim} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{grant.faq.title}</DappContentHeading>
        <FaqList items={grant.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  if (view === 'lucky') return <RewardsLuckyContent />
  if (view === 'referral') return <RewardsReferralContent />
  if (view === 'participate') return <RewardsParticipateContent />
  if (view === 'cobuild') return <RewardsCobuildContent />
  if (view === 'grant') return <RewardsGrantContent />
  return <RewardsGenesisContent />
}
