import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('genesis purchase must not revive retired genesisPurchaseBlock helper', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/genesis/use-genesis-purchase-actions.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /genesisPurchaseBlock/)
})

test('genesis session must not inline purchase writes (actions own money path)', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/genesis/use-genesis-session.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /approveUsd1ForPresaleIfNeeded/)
  assert.doesNotMatch(source, /purchasePresale/)
})
