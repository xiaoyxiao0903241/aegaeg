/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ThirdwebProvider, useConnectModal } from 'thirdweb/react'
import {
  appMetadata,
  defaultChain,
  supportedChains,
  thirdwebClient,
  walletConnectProjectId,
} from './web3/thirdweb'

let openModal: (() => Promise<void>) | undefined
let readyPromise: Promise<void> | undefined
let resolveReady: (() => void) | undefined
let root: Root | undefined

function WalletModalController() {
  const { connect } = useConnectModal()

  const open = useCallback(async () => {
    await connect({
      appMetadata,
      chain: defaultChain,
      chains: [...supportedChains],
      client: thirdwebClient,
      hiddenWallets: ['inApp'],
      showAllWallets: false,
      size: 'compact',
      theme: 'light',
      title: 'Connect Wallet',
      titleIcon: '',
      walletConnect: walletConnectProjectId
        ? { projectId: walletConnectProjectId }
        : undefined,
    })
  }, [connect])

  useEffect(() => {
    openModal = open
    resolveReady?.()
    resolveReady = undefined

    return () => {
      if (openModal === open) {
        openModal = undefined
      }
    }
  }, [open])

  return null
}

function mountWalletIsland() {
  if (root) {
    return
  }

  const host = document.getElementById('wallet-root')
  if (!host) {
    throw new Error('Missing #wallet-root')
  }

  root = createRoot(host)
  root.render(
    <ThirdwebProvider>
      <WalletModalController />
    </ThirdwebProvider>,
  )
}

export async function openWalletModal() {
  mountWalletIsland()

  if (!openModal) {
    readyPromise ??= new Promise((resolve) => {
      resolveReady = resolve
    })
    await readyPromise
  }

  const open = openModal
  if (!open) {
    throw new Error('Wallet modal was not initialized')
  }

  await open()
}
