import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('invite countdown counts down to 2026-11-20 UTC and clamps at zero', async () => {
  const { inviteCampaignCountdown } = await loadModule('/src/core/rewards/invite-campaign.ts')
  const end = Date.parse('2026-11-20T00:00:00Z')
  assert.deepEqual(inviteCampaignCountdown(end - 86_400_000 - 3_600_000 - 60_000), {
    days: 1,
    clock: '01:01',
  })
  assert.deepEqual(inviteCampaignCountdown(end + 5_000), { days: 0, clock: '00:00' })
})
