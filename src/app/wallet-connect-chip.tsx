import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { toast } from 'sonner'
import { useI18n } from '../i18n/use-i18n'
import { useAuth } from '../providers/auth-provider'
import { hasWalletAccount } from '../lib/web3/wallet-connection-state'
import { toWalletUserFacingMessage } from '../lib/web3/resolve-contract-error-message'
import { formatAddress } from './utils'
import { cn } from '~/lib/utils'
import { WalletDetailsModal } from './components/wallet-details-modal'
import { WalletConnectModal } from './components/wallet-connect-modal'

const walletLabelClass = 'inline-flex min-w-0 items-center gap-1.5'

const walletGlyphClass = cn(
  'relative aspect-[16/13] w-4 shrink-0 rounded border-[1.5px] border-primary',
  'after:absolute after:right-0.5 after:top-[3px] after:aspect-square after:w-[5px] after:rounded-full after:bg-primary after:content-[""]',
)

function ConnectedWalletChip() {
  const account = useActiveAccount()
  const { session, isAuthenticated, isLoggingIn, loginError, retryLogin, login } = useAuth()
  const { messages: t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)

  const walletReady = hasWalletAccount(account)
  const needsReconnect = isAuthenticated && !walletReady && !loginError
  const needsSignIn = walletReady && !isAuthenticated && !isLoggingIn && !loginError
  const address = account?.address ?? session?.address

  if (!address) {
    return null
  }

  const addressLabel = needsReconnect
    ? t.wallet.reconnectWallet
    : needsSignIn
      ? t.wallet.signInRequired
      : formatAddress(address)

  async function handleClick() {
    if (loginError) {
      try {
        await retryLogin()
      } catch (error) {
        const message = toWalletUserFacingMessage(error)
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    if (needsReconnect) {
      setConnectOpen(true)
      return
    }

    if (needsSignIn) {
      try {
        await login()
      } catch (error) {
        const message = toWalletUserFacingMessage(error)
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    if (isAuthenticated && walletReady) {
      setMenuOpen(true)
    }
  }

  return (
    <>
      <button
        aria-busy={isLoggingIn}
        aria-label={addressLabel}
        className={cn(
          'aegis-connected-wallet-chip',
          (needsReconnect || needsSignIn) && 'aegis-connected-wallet-chip--reconnect',
        )}
        onClick={() => void handleClick()}
        type="button"
      >
        <span className="aegis-connected-wallet-chip__status" aria-hidden="true" />
        <span className="truncate">{addressLabel}</span>
      </button>
      {isAuthenticated && walletReady && menuOpen ? (
        <WalletDetailsModal onOpenChange={setMenuOpen} open={menuOpen} />
      ) : null}
      {needsReconnect ? (
        <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
      ) : null}
    </>
  )
}

function WalletConnectButton({
  label,
  variant = 'pill',
  fullWidth = false,
}: {
  label?: string
  variant?: 'pill' | 'primary' | 'inline'
  fullWidth?: boolean
}) {
  const { messages: t } = useI18n()
  const [connectOpen, setConnectOpen] = useState(false)
  const connectLabel = label ?? t.common.connectWallet

  const connectButtonClassName =
    variant === 'primary'
      ? 'aegis-thirdweb-button aegis-thirdweb-button-primary'
      : variant === 'inline'
        ? 'aegis-thirdweb-button aegis-thirdweb-button-inline'
        : 'aegis-thirdweb-button'

  return (
    <div className={cn(fullWidth ? 'flex w-full' : 'inline-flex items-center')}>
      <button
        className={cn(connectButtonClassName, fullWidth && 'aegis-thirdweb-button-full')}
        onClick={() => setConnectOpen(true)}
        type="button"
      >
        <span className={walletLabelClass}>
          {variant !== 'primary' ? (
            <span className={walletGlyphClass} aria-hidden="true" />
          ) : null}
          {connectLabel}
        </span>
      </button>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </div>
  )
}

export function WalletConnectChip({
  label,
  variant = 'pill',
  fullWidth = false,
}: {
  label?: string
  variant?: 'pill' | 'primary' | 'inline' | 'connected'
  fullWidth?: boolean
}) {
  if (variant === 'connected') {
    return <ConnectedWalletChip />
  }

  return <WalletConnectButton fullWidth={fullWidth} label={label} variant={variant} />
}
