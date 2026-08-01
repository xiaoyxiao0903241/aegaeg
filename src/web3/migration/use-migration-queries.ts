import { useChainQuery, type ChainQueryOptions } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { migrationWritesAllowed, evaluateMigrationUser } from '~/core/migration/migration-user'

/**
 * Cross-rail migration status — §17 read; writes stay DEFER while migrationEnabled=false.
 * Wallet-scoped: `address` only gates enablement; queryFn uses the active wallet.
 */
export function useMigrationStatusQuery(address?: string, options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.migrationStatus,
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(address),
    queryFn: (walletAddress) => readMigrationStatus(walletAddress),
  })
}

/**
 * Thin check for money writes: `isOldAccount` is `null` until status is known (fail-closed).
 * Query error → `null` (call sites must not treat as false).
 */
export function useMigrationUser(address?: string, options?: ChainQueryOptions) {
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
