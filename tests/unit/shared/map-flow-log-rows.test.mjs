import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('flow log rows use i18n ops labels, term suffix, and token units', async () => {
  const { default: zh } = await loadModule('/src/i18n/messages/app/zh.ts')
  const {
    mapStakeFlowLogToOpsRow,
    mapBondFlowLogToOpsRow,
    mapX0MiningLogToOpsRow,
    mapBufferPoolLogToRow,
    mapReleasePoolLogToRow,
    mapTurbineLogToOpsRow,
    mapStakePositionToAsideRow,
    mapBondPurchaseToAsideRow,
    mapAgxContributionConsumeLogToRow,
  } = await loadModule('/src/shared/presenters/map-flow-log-rows.tsx')

  const copy = zh.flowOps

  const missing = mapStakeFlowLogToOpsRow(
    {
      operation: 'STAKE',
      term_days: 540,
      amount: 'not-a-number',
      block_time: 1_700_000_000,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(missing[1], '质押（540天）')
  assert.equal(missing[2], '0.00 AGX')
  assert.equal(missing[3], '-')

  const liquid = mapStakeFlowLogToOpsRow(
    {
      operation: 'STAKE',
      term_days: 0,
      amount: '25',
      block_time: 1_700_000_000,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(liquid[1], '质押（活期）')
  assert.equal(liquid[2], '25.00 AGX')

  const reward = mapStakeFlowLogToOpsRow(
    {
      operation: 'REWARD',
      term_days: 5,
      amount: '1.24',
      block_time: 1_700_000_000,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(reward[1], '奖励领取（5天）')
  assert.equal(reward[2], '1.2400 gAGX')

  const extra = mapStakeFlowLogToOpsRow(
    {
      operation: 'EXTRA_REWARD',
      term_days: 20,
      amount: '0.5',
      block_time: 1_700_000_000,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(extra[1], '额外奖励领取（20天）')

  const purchase = mapBondFlowLogToOpsRow(
    {
      user_address: '0x1',
      operation: 'PURCHASE',
      term_days: 360,
      payout: '66.89',
      block_time: 1_700_000_000,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(purchase[1], '购买（360天）')
  assert.equal(purchase[2], '66.89 AGX')

  const xClaim = mapX0MiningLogToOpsRow(
    {
      operation: 'REWARD',
      amount: '412.5',
      tx_hash: null,
      block_time: 1_700_000_000,
    },
    copy,
  )
  assert.equal(xClaim[1], '领取')
  assert.equal(xClaim[2], '412.5000 X')

  const xUnstake = mapX0MiningLogToOpsRow(
    {
      operation: 'REDEEM',
      amount: '2',
      tx_hash: null,
      block_time: 1_700_000_000,
    },
    copy,
  )
  assert.equal(xUnstake[1], '解押')
  assert.equal(xUnstake[2], '2.0000 gAGX')

  const buffer = mapBufferPoolLogToRow(
    {
      block_time: 1_700_000_000,
      event_type: 'RELEASE_CREATED',
      amount: '12',
      contract_address: '0x1',
      tx_hash: null,
    },
    copy,
  )
  assert.equal(buffer[1], '进入')
  assert.equal(buffer[2], '12.00')

  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const bufferAgx = mapBufferPoolLogToRow(
    {
      block_time: 1_700_000_000,
      event_type: 'RELEASE_CREATED',
      amount: '12',
      contract_address: BSC_CONTRACTS.principalReleaseVault,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(bufferAgx[2], '12.00 AGX')

  const bufferGagx = mapBufferPoolLogToRow(
    {
      block_time: 1_700_000_000,
      event_type: 'RELEASE_CREATED',
      amount: '2',
      contract_address: BSC_CONTRACTS.gagx,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(bufferGagx[2], '2.00 gAGX')

  const bufferUsd1 = mapBufferPoolLogToRow(
    {
      block_time: 1_700_000_000,
      event_type: 'RELEASE_CREATED',
      amount: '12',
      contract_address: BSC_CONTRACTS.usd1,
      tx_hash: null,
    },
    copy,
  )
  assert.equal(bufferUsd1[2], '12.00')

  const queue = mapReleasePoolLogToRow(
    {
      event_time: 1_700_000_000,
      event_type: 'entered_queue',
      amount: '1.24',
      tx_hash: null,
      plan_index: 0,
    },
    copy,
  )
  assert.equal(queue[1], '进入队列（5天）')
  assert.equal(queue[2], '1.2400 gAGX')

  const turbine = mapTurbineLogToOpsRow(
    {
      id: 1,
      turbine_type: 'received',
      amount: '3.2',
      usdt_amount: null,
      tx_hash: null,
      block_number: 1,
      block_time: 1_700_000_000,
      status: 1,
      created_at: null,
    },
    copy,
  )
  assert.equal(turbine[1], '进入')
  assert.equal(turbine[2], '3.2000 gAGX')

  const aside = mapStakePositionToAsideRow(
    {
      stake_category: 'LOCKED',
      block_time: 1_700_000_000,
      term_days: 180,
      amount: 'bad',
      expire_at: 0,
      released_pct: '45.67',
      tx_hash: null,
    },
    copy,
  )
  assert.equal(aside[1], '180 天')
  assert.equal(aside[2], '0.00 AGX')
  assert.equal(aside[3], '45.67%')

  const bondAside = mapBondPurchaseToAsideRow(
    {
      block_time: 1_700_000_000,
      term_days: 360,
      deposit_amount: '1200',
      discount_bp: 8800,
      payout: '20.98',
      tx_hash: null,
    },
    copy,
  )
  assert.equal(bondAside[1], '360 天')
  assert.equal(bondAside[2], '$1,200')
  assert.equal(bondAside[3], '88%')
  assert.equal(bondAside[4], '20.98 AGX')

  const purpose = zh.exchange.burn.history.purpose
  const consume = mapAgxContributionConsumeLogToRow(
    {
      block_time: 1_700_000_000,
      claim_amount: '2.15',
      contribution_consumed: '2.15',
      contract_address: '0x1',
      tx_hash: null,
    },
    purpose,
  )
  assert.equal(consume.length, 5)
  assert.equal(consume[1], '-')
  assert.equal(consume[2], '2.1500 gAGX')
  assert.equal(consume[3], '2.15')
  assert.equal(consume[4], '-')

  const ranked = mapAgxContributionConsumeLogToRow(
    {
      block_time: 1_700_000_000,
      claim_amount: '1',
      contribution_consumed: '1',
      contract_address: '0x1',
      sign_type: 41,
      tx_hash: null,
    },
    purpose,
  )
  assert.equal(ranked[1], '等级奖')
})
