import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsCobuildContentView } from '~/views/dapp/rewards/detail/use-rewards-cobuild-content-view'
import { NON_NUMERIC_EMPTY } from '~/views/dapp/rewards/rewards-display'

/** Figma 4408:631 levelcard — 当前级 coral rate · 下级 muted rate · req 卡徽章+/目标 */

export function RewardsCobuildContent() {
  const {
    cobuild,
    recordsTab,
    setRecordsTab,
    contributionValue,
    referralCount,
    totalRewards,
    totalPerformance,
    myPosition,
    nextPayout,
    tierCurrent,
    tierNext,
    tierCurrentRate,
    tierNextRate,
    achievedLabel,
    tierReqs,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    directRows,
    directsLoading,
    directsPage,
    setDirectsPage,
    directsTotal,
    recordsTabOptions,
  } = useRewardsCobuildContentView()

  const overviewTiles = [
    { key: 'totalRewards', label: cobuild.totalRewards, value: totalRewards },
    { key: 'totalPerformance', label: cobuild.totalPerformance, value: totalPerformance },
    { key: 'myPosition', label: cobuild.myPosition, value: myPosition },
    { key: 'directCount', label: cobuild.directCount, value: referralCount },
    {
      key: 'contribution',
      label: cobuild.contribution,
      value: contributionValue,
      valueHint: cobuild.contributionHint,
    },
    { key: 'nextPayout', label: cobuild.nextPayout, value: nextPayout },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{cobuild.dataTitle}</DappContentHeading>
        {/* jscpd:ignore-start — 右栏 Tile 页内组合（禁 *OverviewTiles） */}
        <OverviewGrid className="mt-4" columns={3}>
          {overviewTiles.map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <Text
                  as="strong"
                  className="leading-none font-semibold wrap-break-word"
                  variant="headline"
                >
                  <CountValue text={item.value} />
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
        {/* jscpd:ignore-end */}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.tierTitle}</DappContentHeading>
        {/* Figma 4408:631 — flex+gap-4.5(18) 标题区↔req；req 横 gap-3(12)；req 内 gap-1.5(6) */}
        <Card
          surface="elevated"
          className="mt-4 flex flex-col gap-4.5 overflow-visible rounded-2xl p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {cobuild.tierCurrent}
              </Text>
              <div className="flex items-center gap-2.5">
                <Text
                  as="p"
                  className="leading-none font-semibold"
                  variant={tierCurrentRate !== NON_NUMERIC_EMPTY ? 'figure' : 'headline'}
                >
                  {tierCurrent}
                </Text>
                {tierCurrentRate !== NON_NUMERIC_EMPTY ? (
                  <Text
                    as="span"
                    className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                    variant="caption"
                  >
                    {tierCurrentRate}
                  </Text>
                ) : null}
              </div>
            </div>
            <div className="grid gap-1 text-right">
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {cobuild.tierNext}
              </Text>
              <div className="flex items-center justify-end gap-2">
                <Text as="p" className="leading-none font-semibold" variant="headline">
                  {tierNext}
                </Text>
                {tierNextRate !== NON_NUMERIC_EMPTY ? (
                  <Text
                    as="span"
                    className="leading-none font-semibold text-foreground/40"
                    variant="caption"
                  >
                    {tierNextRate}
                  </Text>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {tierReqs.map((req) => (
              <div
                className="flex flex-col gap-1.5 rounded-control bg-muted px-4 py-3.5"
                key={req.label}
              >
                <div className="flex items-center justify-between gap-2">
                  <Text as="p" className="leading-none text-foreground/40" variant="caption">
                    {req.label}
                  </Text>
                  {req.badge.kind === 'achieved' ? (
                    <Text
                      as="span"
                      className="rounded-full bg-success-soft px-2 py-0.5 leading-none font-semibold text-success"
                      variant="caption"
                    >
                      {achievedLabel}
                    </Text>
                  ) : req.badge.kind === 'pct' ? (
                    <Text
                      as="span"
                      className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                      variant="caption"
                    >
                      {req.badge.value}
                    </Text>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <Text as="p" className="leading-none font-semibold" variant="headline">
                    {req.value}
                  </Text>
                  <Text as="p" className="leading-none text-foreground/40" variant="caption">
                    {req.target}
                  </Text>
                </div>
                <Text as="p" className="leading-none text-foreground/40" variant="caption">
                  {req.hint}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.recordsTitle}</DappContentHeading>
        <Table className="mt-4">
          <Table.Header>
            {rewardsRecordsPillTabsHeader({
              ariaLabel: cobuild.recordsTabsAria,
              options: recordsTabOptions,
              value: recordsTab,
              onChange: (next) => setRecordsTab(next as typeof recordsTab),
            })}
          </Table.Header>
          <Table.Body
            colWidths={['12.0625rem', '3.9375rem', '9.1875rem', '6.125rem', '1fr']}
            empty={
              recordsTab === 'cobuild' ? cobuild.emptyRecordsCobuild : cobuild.emptyRecordsEqualize
            }
            headers={[...cobuild.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          {shouldShowTablePagination(recordsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={recordsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.directsTitle}</DappContentHeading>
        <Table className="mt-4">
          <Table.Body
            colWidths={['12.5rem', '12.5rem', '8.125rem', '1fr']}
            emphasisColumns={[2]}
            empty={cobuild.emptyDirects}
            headers={[...cobuild.directsColumns]}
            isLoading={directsLoading}
            rows={directRows}
          />
          {shouldShowTablePagination(directsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setDirectsPage}
                page={directsPage}
                total={directsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{cobuild.faq.title}</DappContentHeading>
        <FaqList items={cobuild.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
