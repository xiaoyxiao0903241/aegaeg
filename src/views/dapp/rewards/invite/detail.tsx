/**
 * 邀请奖详情
 *
 * 总奖励、直推认购总额、活动倒计时，以及邀请奖记录和我的直推。
 */
import { interpolate } from '~/i18n/interpolate'
import { dappAssets } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { useInviteDetail } from '~/views/dapp/rewards/invite/use-invite'
import { HideZeroToggle, LimitedCapsule } from '~/views/dapp/rewards/primitives'

export function InviteDetail() {
  const {
    invite,
    totalRewards,
    totalRewardsApprox,
    deposit,
    countdownLabel,
    rows,
    recordsLoading,
    recordsPage,
    setRecordsPage,
    recordsTotal,
    referralCount,
    referralRows,
    referralsLoading,
    referralsPage,
    setReferralsPage,
    referralsTotal,
    hideZeroPosition,
    setHideZeroPosition,
  } = useInviteDetail()

  return (
    <Detail>
      <Section>
        <Section.Title>{invite.dataTitle}</Section.Title>
        <Grid columns={3}>
          <Tile>
            <Tile.Label>{invite.totalRewards}</Tile.Label>
            <span className="flex items-center gap-1.5">
              <Icon alt="" shape="circle" size="lg" src={dappAssets.tokenAgx} />
              <Text
                as="strong"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                <CountValue text={totalRewards} />
              </Text>
            </span>
            <Tile.Note>
              <CountValue text={totalRewardsApprox} />
            </Tile.Note>
          </Tile>
          <Tile>
            <Tile.Label>{invite.depositTitle}</Tile.Label>
            <Text
              as="strong"
              className="leading-none font-semibold wrap-break-word"
              variant="headline"
            >
              <CountValue text={deposit} />
            </Text>
            <Tile.Note>{invite.depositNote}</Tile.Note>
          </Tile>
          <Tile>
            <Tile.Label>
              {invite.countdownTitle}
              <LimitedCapsule placement="inline">{invite.limited}</LimitedCapsule>
            </Tile.Label>
            <Text
              as="strong"
              className="leading-none font-semibold wrap-break-word text-primary"
              variant="headline"
            >
              <CountValue animate={false} text={countdownLabel} />
            </Text>
            <Tile.Note>{invite.countdownPeriod}</Tile.Note>
          </Tile>
        </Grid>
      </Section>

      <Section>
        <Section.Title>{invite.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            compact
            empty={invite.emptyRecords}
            headers={[...invite.recordsColumns]}
            isLoading={recordsLoading}
            mutedColumns={[0]}
            primaryColumns={[6]}
            rows={rows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              total={recordsTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <div className="flex items-center justify-between gap-3">
          <Section.Title>
            {interpolate(invite.referralsTitle, { count: referralCount })}
          </Section.Title>
          <HideZeroToggle
            checked={hideZeroPosition}
            label={invite.hideZeroPosition}
            onChange={setHideZeroPosition}
          />
        </div>
        <Table>
          <Table.Body
            emphasisColumns={[3]}
            empty={invite.emptyReferrals}
            headers={[...invite.referralsColumns]}
            isLoading={referralsLoading}
            mutedColumns={[0]}
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
      </Section>

      <Section collapsible>
        <Section.Title>{invite.faq.title}</Section.Title>
        <Faq items={invite.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
