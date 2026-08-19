/**
 * 幸运奖详情页
 *
 * 顶部展示今日奖池、参与资格与累计中奖；
 * 中部为 Chainlink VRF 随机开奖说明卡，可展开验证教程；
 * 下方按开奖日期查看中奖名单与我的参与记录，底部为 FAQ。
 */
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { SelectMenu } from '~/shared/components/select-menu'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { LuckyVrfCard } from '~/views/dapp/rewards/lucky/primitives'
import { useLucky } from '~/views/dapp/rewards/lucky/use-lucky'
import { mapFaqWithContributionRatio } from '~/views/dapp/shared/contribution-claim-ratio'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'

export function LuckyDetail() {
  const {
    lucky,
    todayPool,
    todayPoolHint,
    eligibility,
    eligibilityHint,
    cumulativeWins,
    cumulativeWinsHint,
    dateOptions,
    drawDate,
    onDrawDateChange,
    resultsSummary,
    verifyChrome,
    winnerRows,
    highlightedWinnerRows,
    winnersLoading,
    winnersTotal,
    historyRows,
    historyLoading,
    historyPage,
    setHistoryPage,
    historyTotal,
  } = useLucky()
  const claimRatio = useContributionClaimRatioLabel()
  const faqItems = mapFaqWithContributionRatio(lucky.faq.items, claimRatio)

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
      valueHint: cumulativeWinsHint,
    },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{lucky.dataTitle}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
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
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <LuckyVrfCard
          body={lucky.vrfBody}
          collapseTutorial={lucky.collapseTutorial}
          guideSteps={[lucky.vrfGuideStep1, lucky.vrfGuideStep2, lucky.vrfGuideStep3]}
          title={lucky.vrfTitle}
          verifyTutorial={lucky.verifyTutorial}
        />
      </Section>

      <Section>
        <Section.Title>{lucky.resultsTitle}</Section.Title>
        <Table contentClassName="px-2.5 py-1.5 max-dapp:px-2.5">
          <Table.Header className="px-4.5 pt-3.5 pb-[13px] max-dapp:px-4.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {dateMenu}
                {winnersTotal > 0 ? (
                  <Text as="span" className="font-semibold" variant="copy">
                    {resultsSummary}
                  </Text>
                ) : null}
              </div>
              {verifyChrome}
            </div>
          </Table.Header>
          <Table.Body
            colWidths={['5.625rem', '15.9375rem', '10.9375rem', '1fr']}
            emphasisColumns={[0, 3]}
            empty={lucky.emptyResults}
            endColumns={[3]}
            mutedColumns={[2]}
            headers={[...lucky.resultsColumns]}
            highlightedRows={highlightedWinnerRows}
            isLoading={winnersLoading}
            rows={winnerRows}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{lucky.historyTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['9.375rem', '9.25rem', '14.6875rem', '1fr']}
            emphasisColumns={[1]}
            empty={lucky.emptyHistory}
            mutedColumns={[0]}
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
        <Faq items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
