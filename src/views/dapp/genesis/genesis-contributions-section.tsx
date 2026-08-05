import { genesisContributionsColWidths } from '~/app/shell/table-columns'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import {
  GenesisContributionsProgressHeader,
  GenesisContributionsReveal,
  GenesisContributionsSyncHint,
} from '~/views/dapp/genesis/genesis-contributions-primitives'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { useGenesisContributionsView } from '~/views/dapp/genesis/use-genesis-contributions-view'

export function GenesisContributionsSection({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const vm = useGenesisContributionsView(genesis)

  return (
    <Section reveal>
      <Section.Title>{t.genesis.myContributions}</Section.Title>
      <GenesisContributionsReveal>
        {vm.showSalesSyncHint ? (
          <GenesisContributionsSyncHint>
            {t.genesis.contributionsSyncPending}
          </GenesisContributionsSyncHint>
        ) : null}
        <Table>
          {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
            <Table.Header>
              <GenesisContributionsProgressHeader
                contributedLabel={vm.contributedLabel}
                label={t.genesis.totalContributed}
                progress={vm.contributionProgress}
              />
            </Table.Header>
          ) : null}
          {vm.contributionsTable.requiresAuth ? (
            <Table.Auth
              body={t.dapp.connect.recordsBodyGenesis}
              embedded
              title={t.dapp.connect.recordsTitle}
            >
              <WalletConnectChip variant="primary" />
            </Table.Auth>
          ) : vm.contributionsTable.queryEmpty && !vm.showSalesSyncHint ? (
            <Table.Empty body={vm.emptyBody} embedded title={vm.emptyTitle} />
          ) : (
            <Table.Body
              colWidths={[...genesisContributionsColWidths]}
              compact
              headers={vm.tableHeaders}
              isLoading={vm.showContributionsSkeleton}
              loadingRowCount={4}
              positiveColumns={[2]}
              rows={vm.desktopRows}
            />
          )}
          {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={vm.setContributionsPage}
                page={vm.contributionsPage}
                summary={`${t.genesis.cumulativeContributed}${formatGroupedNumber(vm.cumulativeContributedUsd, { prefix: '$' })}`}
                total={vm.contributionsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </GenesisContributionsReveal>
    </Section>
  )
}
