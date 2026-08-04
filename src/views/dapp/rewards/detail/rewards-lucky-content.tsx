import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Tile } from '~/app/shell/tile'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { SelectMenu } from '~/shared/components/select-menu'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useRewardsLuckyContentView } from '~/views/dapp/rewards/detail/use-rewards-lucky-content-view'

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

  const overviewTiles = [
    {
      key: 'todayPool',
      label: lucky.todayPool,
      value: todayPool,
      valueHint: todayPoolHint || undefined,
      animateValue: true as const,
    },
    {
      key: 'eligibility',
      label: lucky.eligibility,
      value: eligibility,
      animateValue: false as const,
      valueTone: (eligibility === lucky.eligibilityYes ? 'primary' : undefined) as
        'primary' | undefined,
      valueHint: eligibilityHint || undefined,
    },
    {
      key: 'cumulativeWins',
      label: lucky.cumulativeWins,
      value: cumulativeWins,
      animateValue: true as const,
    },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{lucky.dataTitle}</DappContentHeading>
        {/* Figma 4395:223 tiles：label copy13 medium body70 · value headline16 */}
        <OverviewGrid className="mt-4" columns={3}>
          {overviewTiles.map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <Text
                  as="strong"
                  className="leading-none font-semibold wrap-break-word"
                  tone={'valueTone' in item ? item.valueTone : undefined}
                  variant="headline"
                >
                  {item.animateValue === false ? item.value : <CountValue text={item.value} />}
                </Text>
                {'valueHint' in item && item.valueHint != null ? (
                  <Text
                    as="span"
                    className="leading-none wrap-break-word text-foreground/40"
                    variant="copy"
                  >
                    {item.valueHint}
                  </Text>
                ) : null}
              </span>
            </Tile>
          ))}
        </OverviewGrid>
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
              className="w-auto shrink-0 rounded-full border border-white/25 bg-transparent px-4 text-white hover:bg-white/10"
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
