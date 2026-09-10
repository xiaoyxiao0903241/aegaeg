import assert from 'node:assert/strict'
import test from 'node:test'

import { createPublicClient, custom, fallback } from 'viem'
import { bsc } from 'viem/chains'

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

test('eip1193WithTimeout rejects hung request and forwards success/errors', async () => {
  const { WALLET_RPC_TIMEOUT_ERROR, eip1193WithTimeout } = await loadModule(
    '/src/web3/bsc-read-client.ts',
  )
  const hanging = { request: () => new Promise(() => {}) }
  const started = Date.now()
  await assert.rejects(
    () => eip1193WithTimeout(hanging, 40).request({ method: 'eth_blockNumber' }),
    (err) => err instanceof Error && err.message === WALLET_RPC_TIMEOUT_ERROR,
  )
  assert.ok(Date.now() - started < 500)

  const ok = { request: async () => '0x1' }
  assert.equal(await eip1193WithTimeout(ok, 100).request({ method: 'eth_blockNumber' }), '0x1')

  const boom = {
    request: async () => {
      throw new Error('Failed to fetch')
    },
  }
  await assert.rejects(
    () => eip1193WithTimeout(boom, 100).request({ method: 'eth_blockNumber' }),
    /Failed to fetch/,
  )
})

test('wallet RPC timeout and network errors fall through; revert and user reject do not', async () => {
  const { eip1193WithTimeout, walletReadShouldThrow } = await loadModule(
    '/src/web3/bsc-read-client.ts',
  )
  const client = (wallet, publicResult, timeoutMs = 100) =>
    createPublicClient({
      chain: bsc,
      transport: fallback(
        [
          custom(eip1193WithTimeout(wallet, timeoutMs), { retryCount: 0 }),
          custom({ request: async () => publicResult }, { retryCount: 0 }),
        ],
        { retryCount: 0, shouldThrow: walletReadShouldThrow },
      ),
    })

  const hanging = { request: () => new Promise(() => {}) }
  assert.equal(await client(hanging, '0xabc', 30).request({ method: 'eth_blockNumber' }), '0xabc')

  const netDown = {
    request: async () => {
      throw new Error('Failed to fetch')
    },
  }
  assert.equal(await client(netDown, '0xdef').request({ method: 'eth_blockNumber' }), '0xdef')

  const reverted = {
    request: async () => {
      throw new Error('execution reverted: InsufficientBalance')
    },
  }
  await assert.rejects(
    () => client(reverted, '0xnever').request({ method: 'eth_blockNumber' }),
    /execution reverted/,
  )

  const userReject = {
    request: async () => {
      const err = new Error('User rejected the request.')
      err.code = 4001
      throw err
    },
  }
  await assert.rejects(
    () => client(userReject, '0xnever').request({ method: 'eth_blockNumber' }),
    /User rejected/,
  )
})
