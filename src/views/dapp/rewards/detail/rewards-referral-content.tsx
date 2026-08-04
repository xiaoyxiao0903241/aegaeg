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
            <Tile key={item.key} label={item.label}>
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
            <Tile key={item.key} label={item.label}>
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
            emptyTitle={referral.emptyRecords}
            headers={[...referral.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          footer={
            shouldShowTablePagination(referralsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setReferralsPage}
                page={referralsPage}
                total={referralsTotal}
              />
            ) : undefined
          }
        >
          <DappTableBody
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2]}
            emptyTitle={referral.emptyReferrals}
            headers={[...referral.referralsColumns]}
            isLoading={referralsLoading}
            rows={referralRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
