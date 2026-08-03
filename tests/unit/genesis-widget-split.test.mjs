import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('genesis purchase actions keep post-approve live checks', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-purchase-actions.ts', import.meta.url),
    'utf8',
  )

  assert.doesNotMatch(source, /genesisPurchaseBlock/)
  assert.match(source, /fetchLiveGenesisPostApprove/)
  assert.match(source, /staleTime:\s*0/)
  assert.match(source, /submitPurchase/)
  assert.match(source, /GENESIS_PURCHASE_ERROR\.NOT_BOUND/)
})

test('useGenesisWidget assembles reads, countdown leaf, display model, and purchase actions', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-widget.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /useGenesisChainReads/)
  assert.match(source, /useGenesisCountdownClock/)
  assert.match(source, /genesisPurchaseSummary/)
  assert.match(source, /useGenesisPurchaseActions/)
  assert.doesNotMatch(source, /approveUsd1ForPresaleIfNeeded/)
  assert.doesNotMatch(source, /purchasePresale/)
  assert.doesNotMatch(source, /estimateAgxFromUsd1/)
})

test('genesisPurchaseSummary owns display and purchase gates without clock', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/genesis-purchase-summary.ts', import.meta.url),
    'utf8',
  )

  assert.match(source, /canPurchaseGenesis/)
  assert.match(source, /estimateAgxFromUsd1/)
  assert.match(source, /previewAddedAirdropValueWei/)
  assert.doesNotMatch(source, /estimateXTokenAirdropUsd/)
  assert.doesNotMatch(source, /formatPhaseCountdown/)
  assert.doesNotMatch(source, /nowSeconds/)
})

test('useGenesisChainReads does not subscribe to nowSeconds', async () => {
  const source = await readFile(
    new URL('../../src/views/dapp/genesis/use-genesis-chain-reads.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /nowSeconds/)
  assert.doesNotMatch(source, /countdownTarget/)
})
