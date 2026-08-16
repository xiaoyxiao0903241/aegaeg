import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('assetsHubNeedsChainFallback: API path skips full-table chain reads', async () => {
  const { assetsHubNeedsChainFallback } = await loadModule(
    '/src/core/assets/assets-hub-chain-fallback.ts',
  )
  const base = {
    walletReady: true,
    hasAddress: true,
    sessionReady: true,
    apiPending: false,
    apiReady: false,
  }
  assert.equal(assetsHubNeedsChainFallback({ ...base, apiReady: true }), false)
  assert.equal(assetsHubNeedsChainFallback({ ...base, apiPending: true }), false)
  assert.equal(assetsHubNeedsChainFallback(base), true)
  assert.equal(assetsHubNeedsChainFallback({ ...base, sessionReady: false }), true)
  assert.equal(
    assetsHubNeedsChainFallback({ ...base, sessionReady: false, walletReady: false }),
    false,
  )
})

test('hub overview sources assetsHubNeedsChainFallback for chain query enabled', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/hub/use-hub.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /assetsHubNeedsChainFallback/)
  assert.match(src, /enabled:\s*chainFallbackEnabled/)
})

test('wallet A→B: query keys diverge; placeholder balance must not decide', async () => {
  const { chainWalletQueryKey } = await loadModule('/src/shared/api/query/query-keys.ts')
  const { decisionBigint, isDecisionFresh } = await loadModule(
    '/src/core/query/decision-freshness.ts',
  )
  const { liveQuotedOut } = await loadModule('/src/core/exchange/live-quoted-out.ts')

  const prefix = ['chain', 'erc20', 'balance', 'agx']
  const keyA = chainWalletQueryKey(prefix, '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  const keyB = chainWalletQueryKey(prefix, '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')
  assert.notDeepEqual(keyA, keyB)

  // B 的新 key 短暂 keepPreviousData=A 余额：决策轴必须当未知。
  const previousA = 9_999n
  assert.equal(decisionBigint(previousA, true), undefined)
  assert.equal(isDecisionFresh(true, previousA), false)
  assert.equal(liveQuotedOut(true, previousA), 0n)
})

test('money decision call sites wire decisionBigint / isDecisionFresh / liveQuotedOut', () => {
  const files = [
    '../../../src/views/dapp/exchange/market-trade/use-market-trade-balances.ts',
    '../../../src/views/dapp/exchange/flash-exchange/use-flash-exchange-session.ts',
    '../../../src/views/dapp/exchange/burn/use-burn-exchange-session.ts',
    '../../../src/views/dapp/staking/stake/use-stake-session.ts',
    '../../../src/views/dapp/staking/bond/use-bond-session.ts',
  ]
  for (const rel of files) {
    const src = readFileSync(new URL(rel, import.meta.url), 'utf8')
    assert.match(
      src,
      /decisionBigint|isDecisionFresh|liveQuotedOut/,
      `${rel} must gate decisions on freshness`,
    )
  }
})

test('submitMixedClaim / redeem reject capturedAddress mismatch before chain reads', async () => {
  const { submitMixedClaim, submitStakeRedeem } = await loadModule(
    '/src/views/dapp/assets/submit-assets.ts',
  )
  const { ASSETS_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  let readCalls = 0
  const session = {
    wallet: {},
    address: '0x1111111111111111111111111111111111111111',
    readClient: {
      async readContract() {
        readCalls += 1
        throw new Error('should not read')
      },
    },
  }

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: '0x2222222222222222222222222222222222222222',
        target: { source: 'liquid', amount: 1n },
        releaseDays: 5,
        restakeDays: 540,
        restakePct: 50,
      }),
    (err) => err === ASSETS_BLOCKED.unavailable,
  )
  assert.equal(readCalls, 0)

  await assert.rejects(
    () =>
      submitStakeRedeem({
        session,
        capturedAddress: '0x2222222222222222222222222222222222222222',
        row: {
          id: 'liquid',
          kind: 'liquid',
          period: 'liquid',
          pool: '0x0C5173c87aB8684eEc028a2bF56061a37415d224',
          stakeIndex: null,
          principal: 1n,
          releasedPrincipal: 0n,
          blockReward: 0n,
          extraInterest: 0n,
          claimableBalance: 0n,
          expiry: 0n,
        },
      }),
    (err) => err === ASSETS_BLOCKED.unavailable,
  )
  assert.equal(readCalls, 0)
})

test('submitMixedClaim treats session address match as case-insensitive', async () => {
  const { submitMixedClaim } = await loadModule('/src/views/dapp/assets/submit-assets.ts')

  let readCalls = 0
  const session = {
    wallet: {},
    address: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
    readClient: {
      async readContract() {
        readCalls += 1
        throw new Error('gate passed')
      },
    },
  }

  await assert.rejects(
    () =>
      submitMixedClaim({
        session,
        capturedAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        target: { source: 'liquid', amount: 1n },
        releaseDays: 5,
        restakeDays: 540,
        restakePct: 50,
      }),
    (err) => err instanceof Error && err.message === 'gate passed',
  )
  assert.ok(readCalls > 0)
})

test('assets claim modal closes when wallet address drifts from capturedAddress', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/claim-modal/use-claim-modal.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /account\?\.address/)
  assert.match(src, /capturedAddress\.toLowerCase\(\)/)
  assert.match(src, /onOpenChange\(false\)/)
})
