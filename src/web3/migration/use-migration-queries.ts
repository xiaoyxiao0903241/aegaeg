import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { migrationWritesAllowed, evaluateMigrationUser } from '~/core/migration/migration-user'

type MigrationQueryOptions = {
  enabled?: boolean
}

/** Cross-rail migration status — §17 read; writes stay DEFER while migrationEnabled=false. */
export function useMigrationStatusQuery(address?: string, options?: MigrationQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.migrationStatusOf(address ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(address),
    queryFn: () => readMigrationStatus(address),
  })
}

/**
 * Thin check for money writes: `isOldAccount` is `null` until status is known (fail-closed).
 * Query error → `null` (call sites must not treat as false).
 */
export function useMigrationUser(address?: string, options?: MigrationQueryOptions) {
  const query = useMigrationStatusQuery(address, options)
  const status = query.isSuccess ? query.data : undefined
  return {
    /** `true`/`false` only when status known; otherwise `null` (unknown / error). */
    isOldAccount: status ? status.isOldAccount : null,
    statusKnown: status !== undefined,
    blockReason: evaluateMigrationUser(status),
    writesAllowed: migrationWritesAllowed(status),
  }
}
