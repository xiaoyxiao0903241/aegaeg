import { EIP1193, injectedProvider, type Wallet } from 'thirdweb/wallets'
import type { WalletId } from 'thirdweb/wallets'
import type { EIP1193Provider } from 'viem'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

const METAMASK_WALLET_ID = 'io.metamask' as WalletId

type EthereumWindow = Window & {
  ethereum?: EIP1193Provider & { isMetaMask?: boolean; providers?: EIP1193Provider[] }
}

function pickInjectedProvider(walletId: WalletId): EIP1193Provider | undefined {
  const direct = injectedProvider(walletId)
  if (direct?.request) {
    return direct as EIP1193Provider
  }

  if (walletId === METAMASK_WALLET_ID || walletId.includes('metamask')) {
    const metamask = injectedProvider(METAMASK_WALLET_ID)
    if (metamask?.request) {
      return metamask as EIP1193Provider
    }
  }

  return undefined
}

function pickWindowEthereum(wallet: Wallet): EIP1193Provider | undefined {
  if (typeof window === 'undefined') return undefined

  const { ethereum } = window as EthereumWindow
  if (!ethereum?.request) return undefined

  const providers = ethereum.providers?.filter((provider) => provider?.request) ?? []
  if (providers.length > 0) {
    if (wallet.id === METAMASK_WALLET_ID || wallet.id.includes('metamask')) {
      const metamask = providers.find(
        (provider) => (provider as EIP1193Provider & { isMetaMask?: boolean }).isMetaMask,
      )
      if (metamask) return metamask
    }

    const matched = providers.find((provider) => injectedProvider(wallet.id) === provider)
    if (matched) return matched
  }

  if (wallet.id === METAMASK_WALLET_ID && ethereum.isMetaMask) {
    return ethereum
  }

  return ethereum
}

/**
 * Resolves the wallet's EIP-1193 provider for contract writes.
 * Prefer the injected MetaMask / EIP-6963 provider so rejections surface directly.
 * WalletConnect falls back to thirdweb's adapter when no injected provider exists.
 */
export function resolveWalletEip1193Provider(wallet: Wallet): EIP1193Provider {
  const injected = pickInjectedProvider(wallet.id)
  if (injected) {
    return injected
  }

  const legacy = pickWindowEthereum(wallet)
  if (legacy) {
    return legacy
  }

  return EIP1193.toProvider({
    wallet,
    chain: defaultChain,
    client: thirdwebClient,
  }) as EIP1193Provider
}
