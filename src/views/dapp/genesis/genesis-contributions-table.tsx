/**
 * 创世贡献记录表
 *
 * 含进度表头、登录引导、同步提示与分页；数据由调用方传入视图模型。
 */
import { genesisContributionsColWidths } from '~/app/shell/table-columns'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Table } from '~/shared/components/table'
import {
  GenesisContributionsProgressHeader,
  GenesisContributionsReveal,
  GenesisContributionsSyncHint,
} from '~/views/dapp/genesis/genesis-contributions-primitives'
import type { useGenesisContributionsView } from '~/views/dapp/genesis/use-genesis-contributions-view'

type GenesisContributionsView = ReturnType<typeof useGenesisContributionsView>

export function GenesisContributionsTable({
  cumulativeLabel,
  syncPendingLabel,
  totalContributedLabel,
  connectBody,
  connectTitle,
  vm,
}: {
  cumulativeLabel: string
  syncPendingLabel: string
  totalContributedLabel: string
  connectBody: string
  connectTitle: string
  vm: GenesisContributionsView
}) {
  return (
    <GenesisContributionsReveal>
      {vm.showSalesSyncHint ? (
        <GenesisContributionsSyncHint>{syncPendingLabel}</GenesisContributionsSyncHint>
      ) : null}
      <Table>
        {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
          <Table.Header>
            <GenesisContributionsProgressHeader
              contributedLabel={vm.contributedLabel}
              label={totalContributedLabel}
              progress={vm.contributionProgress}
            />
          </Table.Header>
        ) : null}
        {vm.contributionsTable.requiresAuth ? (
          <Table.Auth body={connectBody} embedded title={connectTitle}>
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
              summary={`${cumulativeLabel}${formatGroupedNumber(vm.cumulativeContributedUsd, { prefix: '$' })}`}
              total={vm.contributionsTotal}
            />
          </Table.Footer>
        ) : null}
      </Table>
    </GenesisContributionsReveal>
  )
}
