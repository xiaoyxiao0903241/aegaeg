import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('assertWriteIntentMatches fails closed on address or chain drift', async () => {
  const { assertWriteIntentMatches, createWriteIntent } = await loadModule(
    '/src/web3/wallet/assert-write-intent.ts',
  )

  const intent = createWriteIntent('0x1111111111111111111111111111111111111111', 56)

  assert.doesNotThrow(() =>
    assertWriteIntentMatches({
      intent,
      liveAddress: '0x1111111111111111111111111111111111111111',
      liveChainId: 56,
    }),
  )

  assert.throws(
    () =>
      assertWriteIntentMatches({
        intent,
        liveAddress: '0x2222222222222222222222222222222222222222',
        liveChainId: 56,
      }),
    /WALLET_INTENT_ADDRESS_MISMATCH/,
  )

  assert.throws(
    () =>
      assertWriteIntentMatches({
        intent,
        liveAddress: '0x1111111111111111111111111111111111111111',
        liveChainId: 1,
      }),
    /WALLET_WRONG_CHAIN/,
  )
})
