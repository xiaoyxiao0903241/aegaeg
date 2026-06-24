import { useEffect, useRef } from 'react'

export type WalletProvider = {
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
  addListener?: (event: string, handler: (...args: unknown[]) => void) => void
  selectedAddress?: string
  isMetaMask?: boolean
  isCoinbaseWallet?: boolean
  isRabby?: boolean
  isOkxWallet?: boolean
  isTrust?: boolean
}

export function getWindowEthereum(): WalletProvider | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as { ethereum?: WalletProvider }).ethereum
}

export function getWalletProviders(): WalletProvider[] {
  const ethereum = getWindowEthereum()
  if (!ethereum) return []

  const providers = (ethereum as unknown as { providers?: WalletProvider[] }).providers
  if (Array.isArray(providers) && providers.length > 0) {
    return providers
  }

  return [ethereum]
}

export function normalizeWalletAddress(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const lower = value.toLowerCase()
  return /^0x[a-f0-9]{40}$/.test(lower) ? lower : undefined
}

function describeProvider(provider: WalletProvider, index: number): Record<string, unknown> {
  return {
    index,
    selectedAddress: provider.selectedAddress,
    isMetaMask: provider.isMetaMask,
    isCoinbaseWallet: provider.isCoinbaseWallet,
    isRabby: provider.isRabby,
    isOkxWallet: provider.isOkxWallet,
    isTrust: provider.isTrust,
    hasOn: Boolean(provider.on),
  }
}

export interface UseWalletProviderAccountChangeOptions {
  activeAddress: string | undefined
  /** Only run the fallback listener for injected wallets. Defaults to true. */
  enabled?: boolean
  /**
   * Called when the injected provider reports a different address than
   * `activeAddress`. The consumer can decide to disconnect, refresh data, or
   * ignore the event.
   */
  onMismatch: (providerAddress: string, activeAddress: string | undefined) => void
}

/**
 * Fallback listener for wallet account changes.
 *
 * thirdweb v5's `useActiveAccount()` is supposed to update when the wallet emits
 * `accountsChanged`, but some injected wallets / browser extensions do not
 * propagate the event through thirdweb's connection manager. This hook listens
 * directly to every available EIP-1193 / EIP-6963 provider as a safety net.
 */
export function useWalletProviderAccountChange(options: UseWalletProviderAccountChangeOptions) {
  const { activeAddress, enabled = true, onMismatch } = options
  const onMismatchRef = useRef(onMismatch)

  useEffect(() => {
    onMismatchRef.current = onMismatch
  }, [onMismatch])

  useEffect(() => {
    if (!enabled) {
      console.log('[AEGIS] provider listener disabled (not an injected wallet)')
      return
    }

    const providers = getWalletProviders()
    console.log('[AEGIS] discovered wallet providers:', {
      count: providers.length,
      providers: providers.map(describeProvider),
      activeAddress,
    })

    if (providers.length === 0) {
      console.log('[AEGIS] no wallet providers found')
      return
    }

    // Active query: some wallets (notably MetaMask) do not emit accountsChanged
    // when the user switches to an account that is not authorized for the current
    // site. Querying eth_accounts on mount gives us the actual provider state.
    providers.forEach((provider, index) => {
      if (!provider.request) return
      provider
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          console.log('[AEGIS] eth_accounts query result:', {
            index,
            accounts,
            activeAddress,
          })
          const accountList = Array.isArray(accounts) ? accounts : []
          const providerAddress = normalizeWalletAddress(accountList[0])
          if (!providerAddress) return
          const currentActive = normalizeWalletAddress(activeAddress)
          if (providerAddress === currentActive) {
            console.log('[AEGIS] eth_accounts matches active address')
            return
          }
          console.log('[AEGIS] eth_accounts mismatch, notify consumer:', {
            index,
            providerAddress,
            activeAddress,
          })
          onMismatchRef.current(providerAddress, activeAddress)
        })
        .catch((error) => {
          console.log('[AEGIS] eth_accounts query failed:', { index, error })
        })
    })

    const handlersByProvider = new Map<
      WalletProvider,
      {
        accounts: (...args: unknown[]) => void
        chain: (...args: unknown[]) => void
        connect: (...args: unknown[]) => void
        disconnect: (...args: unknown[]) => void
      }
    >()

    providers.forEach((provider, index) => {
      if (!provider?.on || !provider.removeListener) {
        console.log('[AEGIS] provider has no event API, skip:', { index })
        return
      }

      const accountsHandler = (...args: unknown[]) => {
        const accounts = Array.isArray(args[0]) ? args[0] : []
        console.log('[AEGIS] provider accountsChanged:', {
          index,
          accounts,
          activeAddress,
        })
        const providerAddress = normalizeWalletAddress(accounts[0])
        if (!providerAddress) return

        const currentActive = normalizeWalletAddress(activeAddress)
        if (providerAddress === currentActive) {
          console.log('[AEGIS] provider address matches active, skip')
          return
        }

        console.log('[AEGIS] provider mismatch, notify consumer:', {
          index,
          providerAddress,
          activeAddress,
        })
        onMismatchRef.current(providerAddress, activeAddress)
      }

      const chainHandler = (...args: unknown[]) => {
        console.log('[AEGIS] provider chainChanged:', { index, chainId: args[0], activeAddress })
      }

      const connectHandler = (...args: unknown[]) => {
        console.log('[AEGIS] provider connect:', { index, info: args[0], activeAddress })
      }

      const disconnectHandler = (...args: unknown[]) => {
        console.log('[AEGIS] provider disconnect:', { index, error: args[0], activeAddress })
      }

      provider.on('accountsChanged', accountsHandler)
      provider.on('chainChanged', chainHandler)
      provider.on('connect', connectHandler)
      provider.on('disconnect', disconnectHandler)

      handlersByProvider.set(provider, {
        accounts: accountsHandler,
        chain: chainHandler,
        connect: connectHandler,
        disconnect: disconnectHandler,
      })

      console.log('[AEGIS] provider listeners attached:', { index })
    })

    return () => {
      console.log('[AEGIS] detaching provider listeners:', { count: handlersByProvider.size })
      handlersByProvider.forEach((handlers, provider) => {
        provider.removeListener?.('accountsChanged', handlers.accounts)
        provider.removeListener?.('chainChanged', handlers.chain)
        provider.removeListener?.('connect', handlers.connect)
        provider.removeListener?.('disconnect', handlers.disconnect)
      })
    }
  }, [activeAddress, enabled])
}
