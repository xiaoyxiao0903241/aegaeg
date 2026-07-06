import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/app/bootstrap/auth-provider'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import {
  ACCOUNT_BANNED_SENTINEL,
  isAccountBannedError,
  resolveAuthLoginErrorMessage,
} from '~/shared/api/account-banned'
import { toWalletUserFacingMessage } from '~/views/dapp/web3/resolve-contract-error-message'
import { formatAddress } from '~/app/utils'
import { cn } from '~/shared/lib/utils'
import { WalletDetailsModal } from '~/app/components/wallet-details-modal'
import { WalletConnectModal } from '~/app/components/wallet-connect-modal'

const walletLabelClass = 'inline-flex min-w-0 items-center gap-1.5'

const walletGlyphClass = cn(
  'relative aspect-[16/13] w-4 shrink-0 rounded border-[1.5px] border-primary',
  'after:absolute after:right-0.5 after:top-0.5 after:aspect-square after:w-px after:rounded-full after:bg-primary after:content-[""]',
)

function resolveLoginToastMessage(
  error: unknown,
  loginError: string | null,
  accountBannedMessage: string,
): string | null {
  if (isAccountBannedError(error) || loginError === ACCOUNT_BANNED_SENTINEL) {
    return null
  }

  return (
    resolveAuthLoginErrorMessage(error instanceof Error ? error.message : null, accountBannedMessage) ??
    toWalletUserFacingMessage(error)
  )
}

function ConnectedWalletChip() {
  const account = useActiveAccount()
  const { session, isAuthenticated, loginError, retryLogin } = useAuth()
  const { messages: t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  const walletReady = hasWalletAccount(account)
  const address = account?.address ?? session?.address

  if (!isAuthenticated || !walletReady || !address) {
    return null
  }

  async function handleClick() {
    if (loginError) {
      try {
        await retryLogin()
      } catch (error) {
        const message = resolveLoginToastMessage(error, loginError, t.wallet.accountBanned)
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    setMenuOpen(true)
  }

  return (
    <>
      <button
        aria-label={formatAddress(address)}
        className={cn(
          'aegis-connected-wallet-chip',
          loginError && 'aegis-connected-wallet-chip--reconnect',
        )}
        onClick={() => void handleClick()}
        type="button"
      >
        <span className="aegis-connected-wallet-chip__status" aria-hidden="true" />
        <span className="truncate">{formatAddress(address)}</span>
      </button>
      {menuOpen ? <WalletDetailsModal onOpenChange={setMenuOpen} open={menuOpen} /> : null}
    </>
  )
}

function WalletConnectButton({
  className,
  label,
  variant = 'pill',
  fullWidth = false,
}: {
  className?: string
  label?: string
  variant?: 'pill' | 'primary' | 'inline'
  fullWidth?: boolean
}) {
  const { isLoggingIn, login, loginError, retryLogin, needsSignIn } = useAuth()
  const { messages: t } = useI18n()
  const [connectOpen, setConnectOpen] = useState(false)

  const connectLabel =
    label ??
    (needsSignIn ? t.wallet.signInRequired : t.common.connectWallet)

  const connectButtonClassName =
    variant === 'primary'
      ? 'aegis-thirdweb-button aegis-thirdweb-button-primary'
      : variant === 'inline'
        ? 'aegis-thirdweb-button aegis-thirdweb-button-inline'
        : 'aegis-thirdweb-button'

  async function handleClick() {
    if (loginError) {
      try {
        await retryLogin()
      } catch (error) {
        const message = resolveLoginToastMessage(error, loginError, t.wallet.accountBanned)
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    if (needsSignIn) {
      try {
        await login()
      } catch (error) {
        const message = resolveLoginToastMessage(error, loginError, t.wallet.accountBanned)
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    setConnectOpen(true)
  }

  return (
    <div className={cn(fullWidth ? 'flex w-full' : 'inline-flex items-center')}>
      <button
        aria-busy={isLoggingIn}
        className={cn(connectButtonClassName, fullWidth && 'aegis-thirdweb-button-full', className)}
        disabled={isLoggingIn}
        onClick={() => void handleClick()}
        type="button"
      >
        <span className={walletLabelClass}>
          {variant !== 'primary' && !needsSignIn ? (
            <span className={walletGlyphClass} aria-hidden="true" />
          ) : null}
          {isLoggingIn ? t.wallet.connecting : connectLabel}
        </span>
      </button>
      {!needsSignIn ? (
        <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
      ) : null}
    </div>
  )
}

export function WalletConnectChip({
  className,
  label,
  variant = 'pill',
  fullWidth = false,
}: {
  className?: string
  label?: string
  variant?: 'pill' | 'primary' | 'inline' | 'connected'
  fullWidth?: boolean
}) {
  const account = useActiveAccount()
  const { isAuthenticated } = useAuth()
  const walletReady = hasWalletAccount(account)

  if (variant === 'connected' || (walletReady && isAuthenticated)) {
    if (walletReady && isAuthenticated) {
      return <ConnectedWalletChip />
    }
  }

  return (
    <WalletConnectButton
      className={className}
      fullWidth={fullWidth}
      label={label}
      variant={variant === 'connected' ? 'primary' : variant}
    />
  )
}
