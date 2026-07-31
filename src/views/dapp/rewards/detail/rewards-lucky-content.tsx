import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { Button } from '~/shared/ui/button'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
import { useRewardsLuckyContentView } from '~/views/dapp/rewards/detail/use-rewards-lucky-content-view'

export function RewardsLuckyContent() {
  const {
    lucky,
    todayPool,
    eligibility,
    cumulativeWins,
    dateLabel,
    resultsSummary,
    verifyHash,
    winnerRows,
    winnersLoading,
    historyRows,
    historyLoading,
  } = useRewardsLuckyContentView()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{lucky.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={lucky.todayPool} value={todayPool} />
          <RewardsStatCard label={lucky.eligibility} value={eligibility} />
          <RewardsStatCard label={lucky.cumulativeWins} value={cumulativeWins} />
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
          <button
            aria-label={lucky.dateFilterAria}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-[7px] pr-3 pl-3.5 disabled:opacity-100"
            disabled
            type="button"
          >
            <Text as="span" className="text-[13px] font-semibold" variant="caption">
              {dateLabel}
            </Text>
            <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
          </button>
        </div>
        <DappTableCard className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Text as="span" className="font-semibold" variant="caption">
              {resultsSummary}
            </Text>
            <Text as="span" className="text-primary underline" variant="caption">
              {verifyHash}
            </Text>
          </div>
          <ResponsiveTable
            colWidths={['90px', '255px', '175px', '1fr']}
            headers={[...lucky.resultsColumns]}
            isLoading={winnersLoading}
            rows={winnerRows}
          />
          {!winnersLoading && winnerRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={lucky.emptyResults} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.historyTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['150px', '148px', '235px', '1fr']}
            headers={[...lucky.historyColumns]}
            isLoading={historyLoading}
            rows={historyRows}
          />
          {!historyLoading && historyRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={lucky.emptyHistory} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.faq.title}</DappContentHeading>
        <FaqList items={lucky.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
