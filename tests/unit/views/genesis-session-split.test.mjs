import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('genesis purchase must not revive retired genesisPurchaseBlock helper', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/genesis/use-genesis-purchase-actions.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /genesisPurchaseBlock/)
  assert.doesNotMatch(source, /createWalletReadClient/)
  assert.doesNotMatch(source, /fetchQuery/)
})

test('genesis post-approve live gate reads chain time, not wall clock', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/genesis/fetch-live-genesis-post-approve.ts', import.meta.url),
    'utf8',
  )
  assert.match(source, /bscReadClient\.getBlock/)
  assert.doesNotMatch(source, /Date\.now/)
})

test('genesis session must not inline purchase writes (actions own money path)', async () => {
  const source = await readFile(
    new URL('../../../src/views/dapp/genesis/use-genesis-session.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /approveUsd1ForPresaleIfNeeded/)
  assert.doesNotMatch(source, /purchasePresale/)
})
