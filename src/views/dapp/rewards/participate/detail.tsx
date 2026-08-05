/**
 * 参与奖详情页
 *
 * 顶部统计卡（总奖励、我的位置、贡献、下次发放），
 * 下方为参与奖励记录表、邀请人信息表与 FAQ。
 */
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { useParticipate } from '~/views/dapp/rewards/participate/use-participate'

export function ParticipateDetail() {
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
  } = useParticipate()

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
    <Detail>
      <Section>
        <Section.Title>{participate.dataTitle}</Section.Title>
        {/* jscpd:ignore-start — Tile 页内拼装（禁再抽统一包装） */}
        <Grid columns={2}>
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
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{participate.recordsTitle}</Section.Title>
        {/* jscpd:ignore-start — Table 页内拼装（禁再抽薄包装） */}
        <Table>
          <Table.Body
            colWidths={['11.875rem', '10rem', '10rem', '1fr']}
            emphasisColumns={[1]}
            empty={participate.emptyRecords}
            headers={[...participate.recordsColumns]}
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
      </Section>

      <Section>
        <Section.Title>{participate.inviterTitle}</Section.Title>
        {/* 邀请人 API 单条 · 无分页 */}
        <Table>
          <Table.Body
            colWidths={['12.5rem', '10.625rem', '6.875rem', '1fr']}
            emphasisColumns={[2, 3]}
            empty={participate.emptyInviter}
            headers={[...participate.inviterColumns]}
            isLoading={inviterLoading}
            rows={inviterRows}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{participate.faq.title}</Section.Title>
        <Faq items={participate.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
