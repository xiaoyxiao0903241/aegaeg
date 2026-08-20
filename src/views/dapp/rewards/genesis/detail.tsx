/**
 * 创世荣誉详情页
 *
 * 顶部深色横幅展示当前股东等级与超级社区徽章，
 * 下方为全档位荣誉表与可切换（推荐 / 团队 / 社区基金）的历史记录。
 * 未登录时历史表显示登录引导，荣誉档位表仍完整展示。
 */
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { GenesisBanner } from '~/views/dapp/rewards/genesis/primitives'
import { useRewardsGenesisDetail } from '~/views/dapp/rewards/genesis/use-genesis-detail'
import { rewardsRecordsChipTabsHeader } from '~/views/dapp/rewards/primitives'

export function GenesisDetail() {
  const vm = useRewardsGenesisDetail()
  const t = vm.t

  return (
    <Detail>
      <Section>
        <Section.Title>{t.rewards.heroTitle}</Section.Title>
        <GenesisBanner>
          <Text as="span" tone="primary-bright" variant="caption">
            {t.rewards.heroKicker}
          </Text>
          {vm.showHeroSkeleton ? (
            <Text as="p" className="mt-2 text-white/70" variant="copy">
              …
            </Text>
          ) : (
            <>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Text as="h3" className="m-0 font-semibold text-white" variant="brand">
                  {vm.heroTitle || t.rewards.shareholderNoRankTitle}
                </Text>
                {vm.hasRank && vm.isSuperCommunity ? (
                  <Text as="span" tone="primary-bright" variant="caption">
                    {t.rewards.superCommunityBadge}
                  </Text>
                ) : null}
              </div>
              <Text as="p" className="mt-2 text-white/65" variant="caption">
                {vm.heroBody}
              </Text>
              {vm.hasRank && vm.isSuperCommunity ? (
                <Text as="p" className="mt-1 text-white/65" variant="caption">
                  {t.rewards.superCommunityBenefitBody}
                </Text>
              ) : null}
            </>
          )}
        </GenesisBanner>
      </Section>

      <Section>
        <Section.Title>{t.rewards.allTiers}</Section.Title>
        {/* 静态荣誉档位表 · 非动态列表 · 不分页 */}
        <Table>
          <Table.Body
            endColumns={[3]}
            headers={[...vm.g.tierColumns]}
            highlightedRows={vm.highlightedRows}
            rows={vm.tierRows}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.rewards.history}</Section.Title>
        <Table>
          <Table.Header>
            {rewardsRecordsChipTabsHeader({
              ariaLabel: vm.g.recordsTabsAria,
              options: vm.historyTabOptions,
              value: vm.historyTab,
              onChange: (next) => vm.setHistoryTab(next as typeof vm.historyTab),
            })}
          </Table.Header>
          <Table.Body
            emphasisColumns={[2]}
            empty={!vm.sessionReady ? t.rewards.hub.signInForBalance : vm.historyEmpty.title}
            mutedColumns={[0]}
            headers={[...vm.g.recordsColumns]}
            isLoading={vm.sessionReady && vm.historyLoading}
            rows={vm.historyRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={vm.setHistoryPage}
              page={vm.historyPage}
              total={vm.historyTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{vm.g.faq.title}</Section.Title>
        <Faq items={vm.g.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
