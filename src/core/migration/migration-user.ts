import { ZERO_ADDRESS } from '~/core/address'

/**
 * 账户迁移的用户侧校验（纯函数）。
 *
 * 旧地址不得继续写入（手册 §17）；迁移未开启时写入口同样关闭，
 * 本轮发布迁移默认未启用。
 */

export type MigrationUserBlockReason = 'account_migrated' | 'migration_writes_closed'

export type MigrationStatus = {
  migrationEnabled: boolean
  isOldAccount: boolean
}

/**
 * 解析 stake 等公开映射的读取根地址。
 *
 * 迁移后映射以首次 root 为准：migratedFrom(current) 非零时用首次地址，
 * 否则用当前地址；多跳迁移 A→B→C 仍指向首次 root。
 *
 * @param current 当前查询地址
 * @param migratedFrom 当前地址的首次迁移来源；零地址视为未迁移
 * @returns 用于读取映射的根地址
 * @see 手册 §17.3 展示字段
 */
export function migrationStakeRoot(current: string, migratedFrom: string): string {
  if (!migratedFrom || migratedFrom.toLowerCase() === ZERO_ADDRESS) return current
  return migratedFrom
}

/**
 * 用户侧迁移校验：是否禁止写入。
 *
 * 旧地址继续写会被合约拒绝或写入错误账户；迁移未开启时写入口关闭。
 * 状态未知按禁止写处理，宁可多拦也不放行。
 *
 * @param status 迁移状态；null / undefined 视为未知
 * @returns 阻断原因
 * @see 手册 §17.1 页面用途
 */
export function evaluateMigrationUser(
  status: MigrationStatus | null | undefined,
): MigrationUserBlockReason | null {
  if (!status) return 'migration_writes_closed'
  if (status.isOldAccount) return 'account_migrated'
  if (!status.migrationEnabled) return 'migration_writes_closed'
  return null
}

/**
 * 迁移写是否允许：迁移开启且当前地址不是旧地址。
 *
 * @param status 迁移状态；null / undefined 视为不允许
 * @returns 允许写返回 true
 * @see 手册 §17.1 页面用途
 */
export function migrationWritesAllowed(status: MigrationStatus | null | undefined): boolean {
  return status?.migrationEnabled === true && status.isOldAccount !== true
}
