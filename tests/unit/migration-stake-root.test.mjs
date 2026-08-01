import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('migrationStakeRoot uses migratedFrom when non-zero', async () => {
  const { migrationStakeRoot } = await loadModule('/src/core/migration/migration-user.ts')
  const current = '0x1111111111111111111111111111111111111111'
  const root = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  assert.equal(migrationStakeRoot(current, root), root)
  assert.equal(migrationStakeRoot(current, '0x0000000000000000000000000000000000000000'), current)
})
