import assert from 'node:assert/strict'
import test from 'node:test'

import { createConnectionManager } from '../../../node_modules/thirdweb/dist/esm/wallets/manager/index.js'

function createMemoryStorage() {
  const data = new Map()
  return {
    getItem: async (key) => (data.has(key) ? data.get(key) : null),
    setItem: async (key, value) => {
      data.set(key, value)
    },
    removeItem: async (key) => {
      data.delete(key)
    },
  }
}

function createMockWallet() {
  const listeners = new Map()
  let account = { address: '0xaaa' }
  const chain = { id: 56 }

  return {
    id: 'io.metamask',
    getAccount: () => account,
    getChain: () => chain,
    getConfig: () => undefined,
    disconnect: async () => {},
    switchChain: async () => {},
    setAccount(next) {
      account = next
    },
    listenerCount(event) {
      return listeners.get(event)?.size ?? 0
    },
    subscribe(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event).add(cb)
      return () => listeners.get(event)?.delete(cb)
    },
    emit(event, data) {
      for (const cb of [...(listeners.get(event) ?? [])]) {
        cb(data)
      }
    },
  }
}

async function settle() {
  for (let i = 0; i < 12; i += 1) {
    await Promise.resolve()
    await new Promise((resolve) => setImmediate(resolve))
  }
}

test('thirdweb connection manager does not multiply wallet listeners on accountChanged', async () => {
  const manager = createConnectionManager(createMemoryStorage())
  const wallet = createMockWallet()

  await manager.connect(wallet, { client: { clientId: 'test' } })

  const afterConnect = {
    accountChanged: wallet.listenerCount('accountChanged'),
    chainChanged: wallet.listenerCount('chainChanged'),
    disconnect: wallet.listenerCount('disconnect'),
  }

  assert.equal(afterConnect.accountChanged, 2)
  assert.equal(afterConnect.chainChanged, 1)
  assert.equal(afterConnect.disconnect, 1)

  for (let i = 0; i < 8; i += 1) {
    const next = { address: `0xacc${i}` }
    wallet.setAccount(next)
    wallet.emit('accountChanged', next)
    await settle()
  }

  assert.equal(wallet.listenerCount('accountChanged'), afterConnect.accountChanged)
  assert.equal(wallet.listenerCount('chainChanged'), afterConnect.chainChanged)
  assert.equal(wallet.listenerCount('disconnect'), afterConnect.disconnect)
  assert.equal(manager.activeAccountStore.getValue()?.address, '0xacc7')
})
