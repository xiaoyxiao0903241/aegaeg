import { dappAssets } from '~/app/assets'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { useRewardsGenesisContentView } from '~/views/dapp/rewards/detail/use-rewards-genesis-content-view'

export function RewardsGenesisContent() {
  const vm = useRewardsGenesisContentView()
  const t = vm.t
  const banner = dappDarkBanner()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{t.rewards.heroTitle}</DappContentHeading>
        <div
          className={banner.root({
            className: 'mt-4 min-h-34 overflow-visible p-6 max-dapp:p-4.5',
          })}
        >
          <div className={banner.content({ className: 'min-w-0 flex-1 pr-36 max-dapp:pr-0' })}>
            <Text as="span" className="text-primary" variant="caption">
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
                    <Text as="span" className="text-primary" variant="caption">
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
          <img
            alt=""
            className="pointer-events-none absolute -top-10.75 right-3 z-0 hidden h-48 w-32 max-w-32 -scale-x-100 object-contain select-none md:block"
            height="156"
            loading="lazy"
            src={dappAssets.rewardsCharacter}
            width="104"
          />
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.allTiers}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['230px', '190px', '190px', '1fr']}
            headers={[...vm.g.tierColumns]}
            highlightedRows={vm.highlightedRows}
            rows={vm.tierRows}
          />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.history}</DappContentHeading>
        <DappTableCard
          className="mt-4"
          header={
            <DappPillTabs
              activeTone="coral"
              ariaLabel={vm.g.recordsTabsAria}
              className="flex items-center justify-start gap-2"
              items={vm.historyTabOptions.map((option) => ({
                active: option.value === vm.historyTab,
                label: option.label,
              }))}
              onSelect={(index) => {
                const next = vm.historyTabOptions[index]
                if (next) vm.setHistoryTab(next.value)
              }}
            />
          }
        >
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...vm.g.recordsColumns]}
            isLoading={vm.sessionReady && vm.historyLoading}
            loadingRowCount={4}
            rows={vm.historyRows}
          />
          {!vm.sessionReady || (!vm.historyLoading && vm.historyRows.length === 0) ? (
            <DappTableEmptyMessage
              body={!vm.sessionReady ? undefined : vm.historyEmpty.body}
              embedded
              title={!vm.sessionReady ? t.rewards.hub.signInForBalance : vm.historyEmpty.title}
            />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{vm.g.faq.title}</DappContentHeading>
        <FaqList items={vm.g.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
