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
    if (!enabled) return

    const providers = getWalletProviders()
    if (providers.length === 0) return

    // Active query: some wallets (notably MetaMask) do not emit accountsChanged
    // when the user switches to an account that is not authorized for the current
    // site. Querying eth_accounts on mount gives us the actual provider state.
    providers.forEach((provider) => {
      if (!provider.request) return
      provider
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          const accountList = Array.isArray(accounts) ? accounts : []
          const providerAddress = normalizeWalletAddress(accountList[0])
          if (!providerAddress) return
          const currentActive = normalizeWalletAddress(activeAddress)
          if (providerAddress === currentActive) return
          onMismatchRef.current(providerAddress, activeAddress)
        })
        .catch(() => {
          // ignore provider query errors
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

    providers.forEach((provider) => {
      if (!provider?.on || !provider.removeListener) return

      const accountsHandler = (...args: unknown[]) => {
        const accounts = Array.isArray(args[0]) ? args[0] : []
        const providerAddress = normalizeWalletAddress(accounts[0])
        if (!providerAddress) return

        const currentActive = normalizeWalletAddress(activeAddress)
        if (providerAddress === currentActive) return

        onMismatchRef.current(providerAddress, activeAddress)
      }

      const chainHandler = () => undefined
      const connectHandler = () => undefined
      const disconnectHandler = () => undefined

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
    })

    return () => {
      handlersByProvider.forEach((handlers, provider) => {
        provider.removeListener?.('accountsChanged', handlers.accounts)
        provider.removeListener?.('chainChanged', handlers.chain)
        provider.removeListener?.('connect', handlers.connect)
        provider.removeListener?.('disconnect', handlers.disconnect)
      })
    }
  }, [activeAddress, enabled])
}
