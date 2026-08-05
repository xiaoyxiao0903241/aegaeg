import { evaluateMigrationUser, migrationWritesAllowed } from '~/core/migration/migration-user'
import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readMigrationStatus } from '~/web3/migration/migration-read'

/**
 * 跨模块的迁移状态查询（只读）。
 *
 * 迁移开关关闭期间写操作保持延后。钱包作用域：address 仅控制是否启用查询，
 * 实际查询用当前活动钱包。
 *
 * @param address 钱包地址，用于控制查询启用
 * @param options 查询选项
 * @see 手册 §17 账户迁移
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
 * 写资金前的快速检查。
 *
 * 状态未知或查询出错时 isOldAccount 返回 null，调用方不得把 null 当作
 * false——未知状态按「可能是旧地址」处理，不放行写操作。
 *
 * @param address 钱包地址，用于控制查询启用
 * @param options 查询选项
 */
export function useMigrationUser(address?: string, options?: ChainQueryOptions) {
  const query = useMigrationStatusQuery(address, options)
  const status = query.isSuccess ? query.data : undefined
  return {
    /** 仅状态已知时为 true/false；未知或出错为 null。 */
    isOldAccount: status ? status.isOldAccount : null,
    statusKnown: status !== undefined,
    blockReason: evaluateMigrationUser(status),
    writesAllowed: migrationWritesAllowed(status),
  }
}
