import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('evaluateMigrationUser + migrationWritesAllowed', async () => {
  const { evaluateMigrationUser, migrationWritesAllowed } = await loadModule(
    '/src/core/migration/migration-user.ts',
  )

  assert.equal(evaluateMigrationUser(null), 'migration_writes_closed')
  assert.equal(evaluateMigrationUser(undefined), 'migration_writes_closed')

  assert.equal(
    evaluateMigrationUser({ migrationEnabled: false, isOldAccount: false }),
    'migration_writes_closed',
  )
  assert.equal(
    evaluateMigrationUser({ migrationEnabled: true, isOldAccount: true }),
    'account_migrated',
  )
  assert.equal(
    evaluateMigrationUser({ migrationEnabled: false, isOldAccount: true }),
    'account_migrated',
  )
  assert.equal(evaluateMigrationUser({ migrationEnabled: true, isOldAccount: false }), null)

  assert.equal(migrationWritesAllowed({ migrationEnabled: true, isOldAccount: false }), true)
  assert.equal(migrationWritesAllowed({ migrationEnabled: false, isOldAccount: false }), false)
  assert.equal(migrationWritesAllowed({ migrationEnabled: true, isOldAccount: true }), false)
  assert.equal(migrationWritesAllowed(undefined), false)
})
