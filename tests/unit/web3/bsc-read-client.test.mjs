import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

function walletStub(chainId, hasAccount = true, id = 'io.metamask') {
  return {
    id,
    getAccount: () =>
      hasAccount ? { address: '0x1111111111111111111111111111111111111111' } : null,
    getChain: () => (chainId == null ? undefined : { id: chainId }),
  }
}

test('shouldUseWalletReadRpc: public until a BSC wallet is connected', async () => {
  const { shouldUseWalletReadRpc, setConnectedReadWallet } = await loadModule(
    '/src/web3/bsc-read-client.ts',
  )
  const { defaultChain } = await loadModule('/src/web3/thirdweb.ts')
  const bscId = defaultChain.id

  setConnectedReadWallet(null)
  assert.equal(shouldUseWalletReadRpc(), false)
  assert.equal(shouldUseWalletReadRpc(null), false)
  assert.equal(shouldUseWalletReadRpc(walletStub(bscId, false)), false)
  assert.equal(shouldUseWalletReadRpc(walletStub(1)), false)
  assert.equal(shouldUseWalletReadRpc(walletStub(bscId)), true)

  setConnectedReadWallet(walletStub(bscId))
  assert.equal(shouldUseWalletReadRpc(), true)
  setConnectedReadWallet(walletStub(1))
  assert.equal(shouldUseWalletReadRpc(), false)
  setConnectedReadWallet(null)
  assert.equal(shouldUseWalletReadRpc(), false)
})

test('shouldUseWalletReadRpc: OKX on BSC uses wallet RPC unless desktop-extension public is forced', async () => {
  const { shouldUseWalletReadRpc, setConnectedReadWallet } = await loadModule(
    '/src/web3/bsc-read-client.ts',
  )
  const { defaultChain } = await loadModule('/src/web3/thirdweb.ts')
  const bscId = defaultChain.id
  const okx = walletStub(bscId, true, 'com.okex.wallet')

  assert.equal(shouldUseWalletReadRpc(okx), true)

  setConnectedReadWallet(okx)
  assert.equal(shouldUseWalletReadRpc(), true)
  setConnectedReadWallet(null)
})

const DESKTOP_CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const OKX_APP_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 OKApp'
const ANDROID_CHROME_UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

test('shouldForceOkxPublicReadRpc only for PC OKX extension when enabled', async () => {
  const { shouldForceOkxPublicReadRpc } = await loadModule('/src/web3/bsc-read-client.ts')
  const okx = 'com.okex.wallet'

  assert.equal(
    shouldForceOkxPublicReadRpc({ walletId: okx, enabled: false, userAgent: DESKTOP_CHROME_UA }),
    false,
  )
  assert.equal(
    shouldForceOkxPublicReadRpc({ walletId: okx, enabled: true, userAgent: DESKTOP_CHROME_UA }),
    true,
  )
  assert.equal(
    shouldForceOkxPublicReadRpc({ walletId: okx, enabled: true, userAgent: OKX_APP_UA }),
    false,
  )
  assert.equal(
    shouldForceOkxPublicReadRpc({ walletId: okx, enabled: true, userAgent: ANDROID_CHROME_UA }),
    false,
  )
  assert.equal(
    shouldForceOkxPublicReadRpc({
      walletId: 'io.metamask',
      enabled: true,
      userAgent: DESKTOP_CHROME_UA,
    }),
    false,
  )
  assert.equal(shouldForceOkxPublicReadRpc({ walletId: okx, enabled: true, userAgent: '' }), false)
})

test('chainReadClient: unbound and wrong-chain wallets are the public client', async () => {
  const { chainReadClient, setConnectedReadWallet } = await loadModule(
    '/src/web3/bsc-read-client.ts',
  )
  const { defaultChain } = await loadModule('/src/web3/thirdweb.ts')
  const bscId = defaultChain.id

  setConnectedReadWallet(null)
  const publicClient = chainReadClient(null)
  assert.equal(chainReadClient(), publicClient)
  assert.equal(chainReadClient(walletStub(1)), publicClient)
  assert.equal(chainReadClient(walletStub(bscId, false)), publicClient)

  setConnectedReadWallet(walletStub(1))
  assert.equal(chainReadClient(), publicClient)
  assert.equal(chainReadClient(walletStub(1)), publicClient)

  setConnectedReadWallet(walletStub(bscId, false))
  assert.equal(chainReadClient(), publicClient)

  setConnectedReadWallet(null)
})
