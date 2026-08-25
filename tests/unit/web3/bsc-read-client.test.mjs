import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

function walletStub(chainId, hasAccount = true) {
  return {
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
