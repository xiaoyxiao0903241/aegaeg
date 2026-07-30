import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveMigrationUserGate + migrationWritesAllowed', async () => {
  const { resolveMigrationUserGate, migrationWritesAllowed } = await loadModule(
    '/src/core/migration/resolve-migration-user-gate.ts',
  )

  assert.equal(resolveMigrationUserGate(null), 'migration_writes_closed')
  assert.equal(resolveMigrationUserGate(undefined), 'migration_writes_closed')

  assert.equal(
    resolveMigrationUserGate({ migrationEnabled: false, isOldAccount: false }),
    'migration_writes_closed',
  )
  assert.equal(
    resolveMigrationUserGate({ migrationEnabled: true, isOldAccount: true }),
    'account_migrated',
  )
  assert.equal(
    resolveMigrationUserGate({ migrationEnabled: false, isOldAccount: true }),
    'account_migrated',
  )
  assert.equal(resolveMigrationUserGate({ migrationEnabled: true, isOldAccount: false }), null)

  assert.equal(migrationWritesAllowed({ migrationEnabled: true, isOldAccount: false }), true)
  assert.equal(migrationWritesAllowed({ migrationEnabled: false, isOldAccount: false }), false)
  assert.equal(migrationWritesAllowed({ migrationEnabled: true, isOldAccount: true }), false)
  assert.equal(migrationWritesAllowed(undefined), false)
})
