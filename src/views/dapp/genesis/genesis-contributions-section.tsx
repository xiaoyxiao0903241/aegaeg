import { useI18n } from '~/i18n/use-i18n'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { DappSection } from '~/app/shell/dapp-section'
import { DappTableAuthPrompt } from '~/app/shell/dapp-table-auth-prompt'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { genesisContributionsColWidths } from '~/app/shell/dapp-table-columns'
import { formatGroupedNumber } from '~/shared/api/format-display'
import {
  GenesisContributionsProgressHeader,
  GenesisContributionsReveal,
  GenesisContributionsSyncHint,
} from '~/views/dapp/genesis/genesis-contributions-primitives'
import { Text } from '~/shared/ui/text'
import { useGenesisContributionsView } from '~/views/dapp/genesis/use-genesis-contributions-view'

export function GenesisContributionsSection({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const vm = useGenesisContributionsView(genesis)

  return (
    <DappSection title={t.genesis.myContributions}>
      <GenesisContributionsReveal>
        {vm.showSalesSyncHint ? (
          <GenesisContributionsSyncHint>
            {t.genesis.contributionsSyncPending}
          </GenesisContributionsSyncHint>
        ) : null}
        <DappTableCard
          footer={
            vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
              <DappTablePagination
                embedded
                onPageChange={vm.setContributionsPage}
                page={vm.contributionsPage}
                summary={`${t.genesis.cumulativeContributed}${formatGroupedNumber(vm.cumulativeContributedUsd, { prefix: '$' })}`}
                total={vm.contributionsTotal}
              />
            ) : undefined
          }
          header={
            vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
              <GenesisContributionsProgressHeader
                contributedLabel={vm.contributedLabel}
                label={t.genesis.totalContributed}
                progress={vm.contributionProgress}
              />
            ) : undefined
          }
        >
          {vm.contributionsTable.requiresAuth ? (
            <DappTableAuthPrompt body={t.dapp.connect.recordsBodyGenesis} embedded />
          ) : vm.contributionsTable.queryEmpty && !vm.showSalesSyncHint ? (
            <div className="flex min-h-[108px] items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 py-10">
              <Text
                as="p"
                className="text-center text-[13px]"
                tone="muted-foreground"
                variant="detail"
              >
                {`${t.genesis.contributionsEmpty.title}，${t.genesis.contributionsEmpty.body}`}
              </Text>
            </div>
          ) : (
            <ResponsiveTable
              colWidths={[...genesisContributionsColWidths]}
              compact
              headers={vm.tableHeaders}
              isLoading={vm.showContributionsSkeleton}
              loadingRowCount={4}
              positiveColumns={[2]}
              rows={vm.desktopRows}
            />
          )}
        </DappTableCard>
      </GenesisContributionsReveal>
    </DappSection>
  )
}
