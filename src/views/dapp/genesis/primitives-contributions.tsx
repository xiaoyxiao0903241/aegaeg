/**
 * 创世贡献表与进度头
 */

import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { ProgressBar } from '~/shared/components/progress-bar'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { cn, revealClass } from '~/shared/lib/utils'
import { formatDecimal } from '~/shared/presenters/format'
import type { useGenesisDetail } from '~/views/dapp/genesis/use-genesis-detail'
import { WalletConnectChip } from '~/views/dapp/host/wallet/wallet-connect-chip'

const genesisContributionsSection = tv({
  slots: {
    root: cn(revealClass(), 'flex flex-col gap-3'),
    syncHint: 'm-0',
    progressHeader: 'grid gap-2.5',
    progressRow: 'flex items-center justify-between gap-3',
    progressValue: 'mt-0 text-right',
  },
})

export function GenesisContributionsReveal({ children }: { children: ReactNode }) {
  const styles = genesisContributionsSection()
  return (
    <div className={styles.root()} data-reveal>
      {children}
    </div>
  )
}

export function GenesisContributionsSyncHint({ children }: { children: string }) {
  const styles = genesisContributionsSection()
  return (
    <Text as="p" className={styles.syncHint()} tone="muted-foreground" variant="support">
      {children}
    </Text>
  )
}

export function GenesisContributionsProgressHeader({
  contributedLabel,
  label,
  progress,
}: {
  contributedLabel: string
  label: string
  progress: number
}) {
  const styles = genesisContributionsSection()

  return (
    <div className={styles.progressHeader()}>
      <div className={styles.progressRow()}>
        <Text className="leading-[1.2] font-semibold" tone="foreground" variant="support">
          {label}
        </Text>
        <Text
          as="strong"
          className={cn(styles.progressValue(), 'leading-[1.2] font-semibold')}
          tone="foreground"
          variant="support"
        >
          {contributedLabel}
        </Text>
      </div>
      <ProgressBar label={label} value={progress} />
    </div>
  )
}

// --- from genesis-contributions-table.tsx ---
type GenesisContributionsView = ReturnType<typeof useGenesisDetail>

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
            compact
            headers={vm.tableHeaders}
            isLoading={vm.showContributionsSkeleton}
            loadingRowCount={4}
            mutedColumns={[0]}
            primaryColumns={[2]}
            rows={vm.desktopRows}
          />
        )}
        {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
          <Table.Footer>
            <Table.Pagination
              onPageChange={vm.setContributionsPage}
              page={vm.contributionsPage}
              summary={`${cumulativeLabel}${formatDecimal(vm.cumulativeContributedUsd, { prefix: '$' })}`}
              total={vm.contributionsTotal}
            />
          </Table.Footer>
        ) : null}
      </Table>
    </GenesisContributionsReveal>
  )
}
