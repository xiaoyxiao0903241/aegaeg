/**
 * 推荐奖详情页
 *
 * 顶部五张统计卡（总奖励、我的位置、直推数、贡献、下次发放），
 * 下方为奖励记录表与我的推荐表，底部为 FAQ。
 */
import { interpolate } from '~/i18n/interpolate'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { HideZeroToggle } from '~/views/dapp/rewards/primitives'
import { useRewardsReferral } from '~/views/dapp/rewards/referral/use-referral'
import {
  mapFaqWithContributionRatio,
  withContributionRatio,
} from '~/views/dapp/shared/contribution-claim-ratio'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'

export function ReferralDetail() {
  const {
    referral,
    totalRewards,
    totalRewardsApprox,
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
    hideZeroPosition,
    setHideZeroPosition,
  } = useRewardsReferral()
  const claimRatio = useContributionClaimRatioLabel()
  const contributionHint = withContributionRatio(referral.contributionHint, claimRatio)
  const faqItems = mapFaqWithContributionRatio(referral.faq.items, claimRatio)

  const topTiles = [
    {
      key: 'totalRewards',
      label: referral.totalRewards,
      value: totalRewards,
      note: totalRewardsApprox,
    },
    { key: 'myPosition', label: referral.myPosition, value: myPosition },
    { key: 'directCount', label: referral.directCount, value: referralCount },
  ]
  const bottomTiles = [
    {
      key: 'contribution',
      label: referral.contribution,
      value: contributionValue,
      valueHint: contributionHint,
    },
    { key: 'nextPayout', label: referral.nextPayout, value: nextPayout },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title>{referral.dataTitle}</Section.Title>
        {/* 统计卡：上方三张 + 下方两张 */}
        {/* jscpd:ignore-start — Tile 页内拼装（禁再抽统一包装） */}
        <Grid columns={3}>
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
              {'note' in item && item.note != null ? <Tile.Note>{item.note}</Tile.Note> : null}
            </Tile>
          ))}
        </Grid>
        <Grid className="mt-3" columns={2}>
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
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{referral.recordsTitle}</Section.Title>
        {/* jscpd:ignore-start — Table 页内拼装（禁再抽薄包装） */}
        <Table>
          <Table.Body
            emphasisColumns={[1]}
            empty={referral.emptyRecords}
            mutedColumns={[0, 3]}
            headers={[...referral.recordsColumns]}
            isLoading={recordsLoading}
            rows={recordRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              total={recordsTotal}
            />
          </Table.Footer>
        </Table>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <div className="flex items-center justify-between gap-3">
          <Section.Title>
            {interpolate(referral.referralsTitle, { count: referralCount })}
          </Section.Title>
          <HideZeroToggle
            checked={hideZeroPosition}
            label={referral.hideZeroPosition}
            onChange={setHideZeroPosition}
          />
        </div>
        {/* jscpd:ignore-start — Table 页内拼装（禁再抽薄包装） */}
        <Table>
          <Table.Body
            emphasisColumns={[3]}
            empty={referral.emptyReferrals}
            mutedColumns={[0]}
            headers={[...referral.referralsColumns]}
            isLoading={referralsLoading}
            rows={referralRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setReferralsPage}
              page={referralsPage}
              total={referralsTotal}
            />
          </Table.Footer>
        </Table>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{referral.faq.title}</Section.Title>
        <Faq items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
