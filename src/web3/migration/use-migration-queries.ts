import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import {
  migrationWritesAllowed,
  resolveMigrationUserGate,
} from '~/core/migration/resolve-migration-user-gate'

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
 * Thin gate for money writes: `isOldAccount` is `null` until status is known (fail-closed).
 * Query error → `null` (call sites must not treat as false).
 */
export function useMigrationUserGate(address?: string, options?: MigrationQueryOptions) {
  const query = useMigrationStatusQuery(address, options)
  const status = query.isSuccess ? query.data : undefined
  return {
    /** `true`/`false` only when status known; otherwise `null` (unknown / error). */
    isOldAccount: status ? status.isOldAccount : null,
    statusKnown: status !== undefined,
    gate: resolveMigrationUserGate(status),
    writesAllowed: migrationWritesAllowed(status),
  }
}
