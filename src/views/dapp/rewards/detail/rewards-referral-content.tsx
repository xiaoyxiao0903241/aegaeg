import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useRewardsReferralContentView } from '~/views/dapp/rewards/detail/use-rewards-referral-content-view'

export function RewardsReferralContent() {
  const {
    referral,
    totalRewards,
    myPosition,
    referralCount,
    contributionValue,
    nextPayout,
    recordRows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    referralRows,
    referralsLoading,
    referralsPage,
    setReferralsPage,
    referralsTotal,
  } = useRewardsReferralContentView()

  const topTiles = [
    { key: 'totalRewards', label: referral.totalRewards, value: totalRewards },
    { key: 'myPosition', label: referral.myPosition, value: myPosition },
    { key: 'directCount', label: referral.directCount, value: referralCount },
  ]
  const bottomTiles = [
    {
      key: 'contribution',
      label: referral.contribution,
      value: contributionValue,
      valueHint: referral.contributionHint,
    },
    { key: 'nextPayout', label: referral.nextPayout, value: nextPayout },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        {/* Figma 4404:223 · elevated tiles · 3+2 */}
        {/* jscpd:ignore-start — 右栏 Tile 页内组合（禁 *OverviewTiles） */}
        <OverviewGrid className="mt-4" columns={3}>
          {topTiles.map((item) => (
            <Tile key={item.key}>
              <Tile.Label>{item.label}</Tile.Label>
              <Text
                as="strong"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                <CountValue text={item.value} />
              </Text>
            </Tile>
          ))}
        </OverviewGrid>
        <OverviewGrid className="mt-3" columns={2}>
          {bottomTiles.map((item) => (
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
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
        {/* jscpd:ignore-start — 组合式 Table 页内拼装（禁再抽薄包装） */}
        <Table className="mt-4">
          <Table.Body
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            emphasisColumns={[1]}
            empty={referral.emptyRecords}
            headers={[...referral.recordsColumns]}
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
        {/* jscpd:ignore-end */}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        {/* jscpd:ignore-start — 组合式 Table 页内拼装（禁再抽薄包装） */}
        <Table className="mt-4">
          <Table.Body
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2]}
            empty={referral.emptyReferrals}
            headers={[...referral.referralsColumns]}
            isLoading={referralsLoading}
            rows={referralRows}
          />
          {shouldShowTablePagination(referralsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setReferralsPage}
                page={referralsPage}
                total={referralsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
        {/* jscpd:ignore-end */}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
