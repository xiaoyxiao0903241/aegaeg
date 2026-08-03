import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { FaqList } from '~/shared/ui/faq-list'
import { SelectMenu } from '~/shared/ui/select-menu'
import { Text } from '~/shared/ui/text'
import { useRewardsLuckyContentView } from '~/views/dapp/rewards/detail/use-rewards-lucky-content-view'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

export function RewardsLuckyContent() {
  const {
    lucky,
    todayPool,
    todayPoolHint,
    eligibility,
    eligibilityHint,
    cumulativeWins,
    dateOptions,
    drawDate,
    onDrawDateChange,
    showResultsChrome,
    resultsSummary,
    verifyHash,
    winnerRows,
    winnersLoading,
    winnersPage,
    setWinnersPage,
    winnersTotal,
    historyRows,
    historyLoading,
    historyPage,
    setHistoryPage,
    historyTotal,
  } = useRewardsLuckyContentView()

  const dateMenu =
    dateOptions.length > 0 ? (
      <SelectMenu
        align="start"
        ariaLabel={lucky.dateFilterAria}
        onSelect={onDrawDateChange}
        options={dateOptions}
        value={drawDate || dateOptions[0]?.value || ''}
        variant="pill"
      />
    ) : null

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{lucky.dataTitle}</DappContentHeading>
        {/* Figma 4395:223 tiles：label copy13 medium body70 · value headline16 */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RewardsStatCard label={lucky.todayPool}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {lucky.todayPool}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {todayPool}
              </Text>
              {todayPoolHint ? (
                <Text
                  as="p"
                  className="leading-none wrap-break-word text-foreground/40"
                  variant="copy"
                >
                  {todayPoolHint}
                </Text>
              ) : null}
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={lucky.eligibility}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {lucky.eligibility}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                tone={eligibility === lucky.eligibilityYes ? 'primary' : undefined}
                variant="headline"
              >
                {eligibility}
              </Text>
              {eligibilityHint ? (
                <Text
                  as="p"
                  className="leading-none wrap-break-word text-foreground/40"
                  variant="copy"
                >
                  {eligibilityHint}
                </Text>
              ) : null}
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={lucky.cumulativeWins}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {lucky.cumulativeWins}
            </Text>
            <Text
              as="p"
              className="mt-1.5 leading-none font-semibold wrap-break-word"
              variant="headline"
            >
              {cumulativeWins}
            </Text>
          </RewardsStatCard>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        {/* Figma 4395:236：#1c2234 → token dark-panel（≠ Card inverse 的 dark #111625） */}
        <Card
          surface="inverse"
          className="flex flex-col gap-3.5 rounded-2xl bg-dark-panel px-5.5 py-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-7.5 shrink-0 items-center justify-center rounded-control bg-white">
                <img
                  alt=""
                  className="size-4.5 object-contain"
                  src={dappAssets.rewardsHubChainlink}
                />
              </span>
              <Text as="p" className="font-semibold text-white" variant="detail">
                {lucky.vrfTitle}
              </Text>
            </div>
            <Button
              className="h-7.5 min-h-0 w-auto shrink-0 rounded-full border border-white/25 bg-transparent px-4 text-white hover:bg-white/10"
              disabled
              type="button"
              variant="secondary"
            >
              <Text as="span" className="font-semibold text-white" variant="copy">
                {lucky.verifyTutorial}
              </Text>
            </Button>
          </div>
          <Text as="p" className="text-white/65" variant="support">
            {lucky.vrfBody}
          </Text>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DappContentHeading>{lucky.resultsTitle}</DappContentHeading>
        </div>
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(winnersTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setWinnersPage}
                page={winnersPage}
                total={winnersTotal}
              />
            ) : undefined
          }
        >
          {showResultsChrome ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {dateMenu}
                <Text as="span" className="font-semibold" variant="copy">
                  {resultsSummary}
                </Text>
              </div>
              <Text as="span" className="text-primary underline" variant="copy">
                {verifyHash}
              </Text>
            </div>
          ) : null}
          <ResponsiveTable
            colWidths={['5.625rem', '15.9375rem', '10.9375rem', '1fr']}
            emphasisColumns={[2, 3]}
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
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(historyTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setHistoryPage}
                page={historyPage}
                total={historyTotal}
              />
            ) : undefined
          }
        >
          <ResponsiveTable
            colWidths={['9.375rem', '9.25rem', '14.6875rem', '1fr']}
            emphasisColumns={[1]}
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
