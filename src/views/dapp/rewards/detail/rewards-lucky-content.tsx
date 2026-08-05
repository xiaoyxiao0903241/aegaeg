import { dappAssets } from '~/app/assets'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { SelectMenu } from '~/shared/components/select-menu'
import { Table } from '~/shared/components/table'
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
    <Detail>
      <Section>
        <Section.Title>{lucky.dataTitle}</Section.Title>
        {/* Figma 4395:223 tiles：label copy13 medium body70 · value headline16 */}
        <OverviewGrid columns={3}>
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
      </Section>

      <Section>
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
      </Section>

      <Section>
        <Section.Title>{lucky.resultsTitle}</Section.Title>
        <Table>
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
          <Table.Body
            colWidths={['5.625rem', '15.9375rem', '10.9375rem', '1fr']}
            emphasisColumns={[2, 3]}
            empty={lucky.emptyResults}
            headers={[...lucky.resultsColumns]}
            isLoading={winnersLoading}
            rows={winnerRows}
          />
          {shouldShowTablePagination(winnersTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setWinnersPage}
                page={winnersPage}
                total={winnersTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{lucky.historyTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['9.375rem', '9.25rem', '14.6875rem', '1fr']}
            emphasisColumns={[1]}
            empty={lucky.emptyHistory}
            headers={[...lucky.historyColumns]}
            isLoading={historyLoading}
            rows={historyRows}
          />
          {shouldShowTablePagination(historyTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setHistoryPage}
                page={historyPage}
                total={historyTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{lucky.faq.title}</Section.Title>
        <FaqList items={lucky.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
