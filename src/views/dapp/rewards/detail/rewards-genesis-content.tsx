import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { darkBanner } from '~/shared/components/dark-banner'
import { FaqList } from '~/shared/components/faq-list'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { rewardsRecordsPillTabsHeader } from '~/views/dapp/rewards/detail/rewards-records-pill-tabs'
import { useRewardsGenesisContentView } from '~/views/dapp/rewards/detail/use-rewards-genesis-content-view'

export function RewardsGenesisContent() {
  const vm = useRewardsGenesisContentView()
  const t = vm.t
  const banner = darkBanner()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{t.rewards.heroTitle}</DappContentHeading>
        <div
          className={banner.root({
            className: 'mt-4 overflow-visible p-6 max-dapp:p-4.5',
          })}
        >
          <div className={banner.content({ className: 'min-w-0 flex-1 pr-36 max-dapp:pr-0' })}>
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
          </div>
          {/* Figma 4719:2483 IP动作3 · 103×155 → rem；无镜像；素材 2026-08-03 自稿重导 */}
          <img
            alt=""
            className="pointer-events-none absolute top-1.5 right-6.5 z-0 hidden w-25.75 object-contain select-none md:block"
            height="155"
            loading="lazy"
            src={dappAssets.rewardsCharacter}
            width="103"
          />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.allTiers}</DappContentHeading>
        {/* 静态荣誉档位表 · 非动态列表 · 不分页 */}
        <Table className="mt-4">
          <Table.Body
            colWidths={['14.375rem', '11.875rem', '11.875rem', '7.875rem']}
            headers={[...vm.g.tierColumns]}
            highlightedRows={vm.highlightedRows}
            rows={vm.tierRows}
          />
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.history}</DappContentHeading>
        <Table className="mt-4">
          <Table.Header>
            {rewardsRecordsPillTabsHeader({
              ariaLabel: vm.g.recordsTabsAria,
              options: vm.historyTabOptions,
              value: vm.historyTab,
              onChange: (next) => vm.setHistoryTab(next as typeof vm.historyTab),
            })}
          </Table.Header>
          <Table.Body
            colWidths={['16.75rem', '8.375rem', '9.8125rem', '1fr']}
            emphasisColumns={[2]}
            empty={!vm.sessionReady ? t.rewards.hub.signInForBalance : vm.historyEmpty.title}
            headers={[...vm.g.recordsColumns]}
            isLoading={vm.sessionReady && vm.historyLoading}
            rows={vm.historyRows}
          />
          {shouldShowTablePagination(vm.historyTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={vm.setHistoryPage}
                page={vm.historyPage}
                total={vm.historyTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{vm.g.faq.title}</DappContentHeading>
        <FaqList items={vm.g.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
