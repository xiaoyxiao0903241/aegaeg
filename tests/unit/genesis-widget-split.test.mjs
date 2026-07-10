import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('genesis purchase actions keep post-approve gate and in-flight latch', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-purchase-actions.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /genesisPurchaseGate/)
  assert.match(source, /evaluateGenesisPostApproveGate/)
  assert.match(source, /submitPurchase/)
  assert.match(source, /GENESIS_PURCHASE_ERROR\.NOT_BOUND/)
})

test('useGenesisWidget assembles reads, display model, and purchase actions', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-widget.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /useGenesisChainReads/)
  assert.match(source, /buildGenesisWidgetModel/)
  assert.match(source, /useGenesisPurchaseActions/)
  assert.doesNotMatch(source, /approveUsd1ForPresaleIfNeeded/)
  assert.doesNotMatch(source, /purchasePresale/)
  assert.doesNotMatch(source, /estimateAgxFromUsd1/)
})

test('buildGenesisWidgetModel owns display and purchase gates', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/build-genesis-widget-model.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /canPurchaseGenesis/)
  assert.match(source, /estimateAgxFromUsd1/)
  assert.match(source, /formatPhaseCountdown/)
})
