/**
 * 幸运奖详情页
 *
 * 顶部展示今日奖池、参与资格与累计中奖；
 * 中部为 Chainlink VRF 随机开奖说明卡；
 * 下方按开奖日期查看中奖名单与我的参与记录，底部为 FAQ。
 */
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { SelectMenu } from '~/shared/components/select-menu'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { RewardsLuckyVrfCard } from '~/views/dapp/rewards/detail/rewards-lucky-vrf-card'
import { useRewardsLuckyDetail } from '~/views/dapp/rewards/detail/use-rewards-lucky-detail'

export function RewardsLuckyDetail() {
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
  } = useRewardsLuckyDetail()

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
        <Grid columns={3}>
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
        </Grid>
      </Section>

      <Section>
        <RewardsLuckyVrfCard
          body={lucky.vrfBody}
          title={lucky.vrfTitle}
          verifyTutorial={lucky.verifyTutorial}
        />
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
        <Faq items={lucky.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
