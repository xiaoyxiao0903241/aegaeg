import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableBody } from '~/app/shell/dapp-table-body'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useRewardsParticipateContentView } from '~/views/dapp/rewards/detail/use-rewards-participate-content-view'

export function RewardsParticipateContent() {
  const {
    participate,
    totalRewards,
    myPosition,
    contributionValue,
    nextPayout,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    inviterRows,
    inviterLoading,
  } = useRewardsParticipateContentView()

  const overviewTiles = [
    { key: 'totalRewards', label: participate.totalRewards, value: totalRewards },
    { key: 'myPosition', label: participate.myPosition, value: myPosition },
    {
      key: 'contribution',
      label: participate.contribution,
      value: contributionValue,
      valueHint: participate.contributionHint,
    },
    { key: 'nextPayout', label: participate.nextPayout, value: nextPayout },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{participate.dataTitle}</DappContentHeading>
        {/* jscpd:ignore-start — 右栏 Tile 页内组合（禁 *OverviewTiles） */}
        <OverviewGrid className="mt-4" columns={2}>
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
        <DappContentHeading>{participate.recordsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(recordsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={recordsTotal}
              />
            ) : undefined
          }
        >
          <DappTableBody
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            emphasisColumns={[1]}
            emptyTitle={participate.emptyRecords}
            headers={[...participate.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.inviterTitle}</DappContentHeading>
        {/* 邀请人 API 单条 · 无分页 */}
        <DappTableCard className="mt-4">
          <DappTableBody
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2, 3]}
            emptyTitle={participate.emptyInviter}
            headers={[...participate.inviterColumns]}
            isLoading={inviterLoading}
            rows={inviterRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{participate.faq.title}</DappContentHeading>
        <FaqList items={participate.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
