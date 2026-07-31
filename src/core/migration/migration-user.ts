/** Handbook §17 — old address must not keep writing; migration writes DEFER this round. */
export type MigrationUserBlockReason = 'account_migrated' | 'migration_writes_closed'

export type MigrationStatus = {
  migrationEnabled: boolean
  isOldAccount: boolean
}

/**
 * User-facing migration check (not admin).
 * - Unknown status → fail-closed (`migration_writes_closed`)
 * - Old account → fail-closed writes
 * - migrationEnabled=false → no request/activate UI (writes closed)
 */
export function evaluateMigrationUser(
  status: MigrationStatus | null | undefined,
): MigrationUserBlockReason | null {
  if (!status) return 'migration_writes_closed'
  if (status.isOldAccount) return 'account_migrated'
  if (!status.migrationEnabled) return 'migration_writes_closed'
  return null
}

export function migrationWritesAllowed(status: MigrationStatus | null | undefined): boolean {
  return status?.migrationEnabled === true && status.isOldAccount !== true
}
