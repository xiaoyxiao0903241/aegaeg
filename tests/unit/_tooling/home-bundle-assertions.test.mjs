import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectHomeBundleFailures,
  HOME_MAX_SYNC_KB,
  HOME_WEB3_POLLUTION_MARKERS,
  matchBundleMarkers,
} from '../../../scripts/lib/home-bundle-assertions.mjs'

test('matchBundleMarkers ignores thirdwebClientId env key false positive', () => {
  const envOnly = 'var Y={thirdwebClientId:J(`VITE_THIRDWEB_CLIENT_ID`,`a2`)}'
  assert.deepEqual(matchBundleMarkers(envOnly, HOME_WEB3_POLLUTION_MARKERS), [])
})

test('matchBundleMarkers catches viem and wallet pollution', () => {
  const polluted = [
    'https://viem.sh/docs',
    'version:`viem@2.54.0`',
    'WalletConnect',
    'createWallet(',
    'from "thirdweb/react"',
  ].join('\n')
  const ids = matchBundleMarkers(polluted, HOME_WEB3_POLLUTION_MARKERS)
  assert.ok(ids.includes('viem-docs'))
  assert.ok(ids.includes('viem-version'))
  assert.ok(ids.includes('walletconnect'))
  assert.ok(ids.includes('create-wallet'))
  assert.ok(ids.includes('thirdweb-react-path'))
})

test('collectHomeBundleFailures fails closed on pollution, copy leak, and size', () => {
  assert.deepEqual(
    collectHomeBundleFailures({
      syncScriptsKb: 490,
      syncContainsJapaneseCopy: false,
      syncContainsSlippage: false,
      matchedPollutionMarkers: [],
    }),
    [],
  )

  const failures = collectHomeBundleFailures({
    syncScriptsKb: HOME_MAX_SYNC_KB + 1,
    syncContainsJapaneseCopy: true,
    syncContainsSlippage: true,
    matchedPollutionMarkers: ['viem-docs'],
  })
  assert.equal(failures.length, 4)
  assert.match(failures.join('\n'), /viem-docs/)
  assert.match(failures.join('\n'), /slippage/)
  assert.match(failures.join('\n'), /Japanese/)
  assert.match(failures.join('\n'), new RegExp(String(HOME_MAX_SYNC_KB)))
})
