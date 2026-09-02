import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

function memoryStorage() {
  /** @type {Map<string, string>} */
  const map = new Map()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
    map,
  }
}

test('claimable seen persistence is per address and source', async () => {
  const { CLAIMABLE_SEEN_STORAGE_KEY, readClaimableSeen, writeClaimableSeen } = await loadModule(
    '/src/shared/lib/claimable-seen-storage.ts',
  )

  const storage = memoryStorage()
  const addr = '0xabc'

  assert.equal(CLAIMABLE_SEEN_STORAGE_KEY, 'aegis.claimable-seen.v1')
  assert.equal(readClaimableSeen(addr, 'exchange.turbine', storage), null)

  writeClaimableSeen(addr, 'exchange.turbine', '1|3', storage)
  assert.equal(readClaimableSeen(addr, 'exchange.turbine', storage), '1|3')
  assert.equal(readClaimableSeen(addr, 'release.queue', storage), null)
  assert.equal(readClaimableSeen('0xdef', 'exchange.turbine', storage), null)

  writeClaimableSeen(addr, 'exchange.turbine', '', storage)
  assert.equal(readClaimableSeen(addr, 'exchange.turbine', storage), '')
})

test('claimable seen ignores corrupt json', async () => {
  const { CLAIMABLE_SEEN_STORAGE_KEY, readClaimableSeen } = await loadModule(
    '/src/shared/lib/claimable-seen-storage.ts',
  )
  const storage = memoryStorage()
  storage.setItem(CLAIMABLE_SEEN_STORAGE_KEY, '{not-json')
  assert.equal(readClaimableSeen('0xabc', 'exchange.turbine', storage), null)
})
