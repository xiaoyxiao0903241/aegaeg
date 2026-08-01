import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('parseTeamRewardClaim accepts hex signature and salt', async () => {
  const { parseTeamRewardClaim } = await loadModule('/src/shared/api/parse-team-reward-claim.ts')

  const parsed = parseTeamRewardClaim({
    signature: '0xabcdef',
    salt: '0x01',
    amountWei: '1000',
    signType: 1,
    expireTime: 1_700_000_000,
  })
  assert.equal(parsed.signature, '0xabcdef')
  assert.equal(parsed.salt, '0x01')
  assert.equal(parsed.amountWei, 1000n)
})

test('parseTeamRewardClaim rejects non-hex signature or salt', async () => {
  const { parseTeamRewardClaim } = await loadModule('/src/shared/api/parse-team-reward-claim.ts')

  assert.throws(
    () =>
      parseTeamRewardClaim({
        signature: 'not-hex',
        salt: '0x01',
        amountWei: '1000',
        signType: 1,
        expireTime: 1_700_000_000,
      }),
    /signature/,
  )
  assert.throws(
    () =>
      parseTeamRewardClaim({
        signature: '0xab',
        salt: 'garbage',
        amountWei: '1000',
        signType: 1,
        expireTime: 1_700_000_000,
      }),
    /salt/,
  )
})
