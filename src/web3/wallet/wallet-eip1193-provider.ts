import type { WalletId } from 'thirdweb/wallets'
import { EIP1193, injectedProvider, type Wallet } from 'thirdweb/wallets'
import type { EIP1193Provider } from 'viem'

import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

const METAMASK_WALLET_ID = 'io.metamask' as WalletId

/**
 * 与浏览器注入 provider 永远不对应的钱包 id。
 * 把这些钱包的写请求路由到 `window.ethereum` 会指向别的钱包
 * （如已装 MetaMask 时，WalletConnect 会话被错误替换）。
 */
const NON_INJECTED_WALLET_IDS = new Set<string>(['walletConnect', 'inApp', 'embedded', 'smart'])

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

  return undefined
}

function thirdwebWalletProvider(wallet: Wallet): EIP1193Provider {
  return EIP1193.toProvider({
    wallet,
    chain: defaultChain,
    client: thirdwebClient,
  }) as EIP1193Provider
}

async function providerOwnsAccount(provider: EIP1193Provider, address: string): Promise<boolean> {
  try {
    const accounts = await provider.request({ method: 'eth_accounts' })
    if (!Array.isArray(accounts)) return false
    const wanted = address.toLowerCase()
    return accounts.some((item) => typeof item === 'string' && item.toLowerCase() === wanted)
  } catch {
    return false
  }
}

async function legacyInjectedProvider(wallet: Wallet): Promise<EIP1193Provider> {
  const account = wallet.getAccount()?.address
  if (!account) {
    return thirdwebWalletProvider(wallet)
  }

  const candidates: EIP1193Provider[] = []
  const fromPicker = pickWindowEthereum(wallet)
  if (fromPicker) candidates.push(fromPicker)

  if (typeof window !== 'undefined') {
    const { ethereum } = window as EthereumWindow
    if (ethereum?.request) {
      candidates.push(ethereum)
    }
  }

  for (const candidate of candidates) {
    if (await providerOwnsAccount(candidate, account)) {
      return candidate
    }
  }

  return thirdwebWalletProvider(wallet)
}

const deferredResolutions = new WeakMap<Wallet, Promise<EIP1193Provider>>()

function createDeferredWalletProvider(wallet: Wallet): EIP1193Provider {
  const request = async (args: { method: string; params?: unknown }): Promise<unknown> => {
    let pending = deferredResolutions.get(wallet)
    if (!pending) {
      pending = legacyInjectedProvider(wallet)
      deferredResolutions.set(wallet, pending)
    }
    const provider = await pending
    const bound = provider.request.bind(provider) as (args: {
      method: string
      params?: unknown
    }) => Promise<unknown>
    return bound(args)
  }

  // 只暴露最小 EIP-1193 面：钱包写仅用到 `request`。
  // viem 完整 `EIP1193Provider` 是很大的方法联合类型，在适配边界放宽类型。
  return { request } as unknown as EIP1193Provider
}

/**
 * 解析钱包的 EIP-1193 provider（用于合约写）
 *
 * 注入式钱包优先 EIP-6963 provider；仅当 `eth_accounts` 含已连接地址时才
 * 回退使用 `window.ethereum`；否则经 thirdweb 适配器走当前会话。
 *
 * @param wallet 当前钱包
 * @returns 可用于请求的 EIP-1193 provider
 */
export function walletEip1193Provider(wallet: Wallet): EIP1193Provider {
  if (NON_INJECTED_WALLET_IDS.has(wallet.id)) {
    return thirdwebWalletProvider(wallet)
  }

  const injected = pickInjectedProvider(wallet.id)
  if (injected) {
    return injected
  }

  return createDeferredWalletProvider(wallet)
}
