import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('consumeLogPurposeKey: sign_type then contract; unknown is null', async () => {
  const { consumeLogPurposeKey } = await loadModule('/src/shared/presenters/consume-log-purpose.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  assert.equal(consumeLogPurposeKey({ sign_type: 41, contract_address: '0x1' }), 'rank')
  assert.equal(consumeLogPurposeKey({ sign_type: '42' }), 'referral')
  assert.equal(consumeLogPurposeKey({ sign_type: 43 }), 'participation')
  assert.equal(consumeLogPurposeKey({ sign_type: 44 }), 'surpass')
  assert.equal(consumeLogPurposeKey({ sign_type: 45 }), 'lifetime')
  assert.equal(consumeLogPurposeKey({ sign_type: 51 }), 'market')

  assert.equal(
    consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.liquidStaking }),
    'stakeYield',
  )
  assert.equal(
    consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.lockedStaking540d.toUpperCase() }),
    'stakeYield',
  )
  assert.equal(
    consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.bondDepository180d }),
    'lpBondYield',
  )
  assert.equal(
    consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.burnBondDepository360d }),
    'burnBondYield',
  )
  assert.equal(consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.luckyPool }), 'lucky')
  assert.equal(consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.marketFund }), 'market')
  assert.equal(consumeLogPurposeKey({ contract_address: BSC_CONTRACTS.daoPool }), null)

  assert.equal(consumeLogPurposeKey({ sign_type: 99, contract_address: '0xdead' }), null)
  assert.equal(consumeLogPurposeKey({ contract_address: '0x1' }), null)
  assert.equal(consumeLogPurposeKey({ sign_type: '', contract_address: '' }), null)
})
