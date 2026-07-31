import { useState } from 'react'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/hooks/use-auth'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import {
  ACCOUNT_BANNED_SENTINEL,
  LOGIN_ERROR,
  isAccountBannedError,
  authLoginErrorMessage,
} from '~/shared/api/account-banned'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import { isUserRejectedWalletError, toWalletUserFacingMessage } from '~/web3/contract-error-message'
import { useAuthStore } from '~/stores/auth-store'
import { formatShortAddress } from '~/shared/api/format-display'
import { Text } from '~/shared/ui/text'
import { Button } from '~/shared/ui/button'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { WalletDetailsModal } from '~/app/shell/wallet-details-modal'
import { WalletConnectModal } from '~/app/shell/wallet-connect-modal'

const walletConnectChip = tv({
  slots: {
    label: 'inline-flex min-w-0 items-center gap-1.5',
    glyph: [
      'relative aspect-16/13 w-4 shrink-0 rounded-sm border-[1.5px] border-primary',
      'after:absolute after:top-0.5 after:right-0.5 after:aspect-square after:w-px after:rounded-full after:bg-primary after:content-[""]',
    ],
    connected: 'aegis-connected-wallet-chip',
    shell: '',
    action: '',
  },
  variants: {
    reconnect: {
      true: {
        connected: 'aegis-connected-wallet-chip--reconnect',
      },
    },
    fullWidth: {
      true: {
        shell: 'flex w-full',
        action: 'w-full',
      },
      false: {
        shell: 'inline-flex items-center',
        action: 'w-auto',
      },
    },
  },
  defaultVariants: {
    reconnect: false,
    fullWidth: false,
  },
})

function loginToastMessage(
  error: unknown,
  loginError: string | null,
  messages: {
    accountBanned: string
    walletNotConnected: string
    loginFailed: string
    loginSignatureRejected: string
    api: {
      network: string
      timeout: string
      unavailable: string
      badResponse: string
      fallback: string
    }
  },
): string | null {
  if (isAccountBannedError(error) || loginError === ACCOUNT_BANNED_SENTINEL) {
    return null
  }
  if (isUserRejectedWalletError(error) || loginError === LOGIN_ERROR.USER_REJECTED) {
    return null
  }

  const fromLogin = authLoginErrorMessage(loginError, messages)
  if (fromLogin) return fromLogin

  return (
    apiUserFacingError(error, messages.api) ??
    toWalletUserFacingMessage(error, messages.loginFailed)
  )
}

function loginToastCopy(t: ReturnType<typeof useI18n>['messages']) {
  return {
    accountBanned: t.wallet.accountBanned,
    walletNotConnected: t.errors.walletNotConnected,
    loginFailed: t.errors.loginFailed,
    loginSignatureRejected: t.errors.loginSignatureRejected,
    api: t.errors.api,
  }
}

function ConnectedWalletChip() {
  const account = useActiveAccount()
  const { session, sessionReady, loginError, login } = useAuth()
  const { messages: t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const styles = walletConnectChip({ reconnect: Boolean(loginError) })

  const walletReady = hasWalletAccount(account)
  const address = account?.address ?? session?.address

  if (!sessionReady || !walletReady || !address) {
    return null
  }

  async function handleClick() {
    if (loginError) {
      try {
        await login()
      } catch (error) {
        const message = loginToastMessage(
          error,
          useAuthStore.getState().loginError,
          loginToastCopy(t),
        )
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
        aria-label={formatShortAddress(address)}
        className={styles.connected()}
        onClick={() => void handleClick()}
        type="button"
      >
        <span className="aegis-connected-wallet-chip__status" aria-hidden="true" />
        <Text
          as="span"
          variant="copy"
          className="truncate text-xs leading-[1.2] font-semibold tracking-[-0.01em]"
        >
          {formatShortAddress(address)}
        </Text>
      </button>
      {/* Keep mounted so Radix can play the closed-state exit animation (same as connect modal). */}
      <WalletDetailsModal onOpenChange={setMenuOpen} open={menuOpen} />
    </>
  )
}

function WalletConnectButton({
  className,
  label,
  variant = 'pill',
  fullWidth = false,
  density = 'card',
}: {
  className?: string
  label?: string
  variant?: 'pill' | 'primary' | 'inline'
  fullWidth?: boolean
  /** primary only — inverse = dark promo 38; card = white-card 42; external = Button md 44 */
  density?: 'card' | 'external' | 'inverse'
}) {
  const { isLoggingIn, login, loginError, needsSignIn } = useAuth()
  const { messages: t } = useI18n()
  const [connectOpen, setConnectOpen] = useState(false)
  const styles = walletConnectChip({ fullWidth })

  const connectLabel = label ?? (needsSignIn ? t.wallet.signInRequired : t.common.connectWallet)

  async function handleClick() {
    if (loginError) {
      try {
        await login()
      } catch (error) {
        const message = loginToastMessage(
          error,
          useAuthStore.getState().loginError,
          loginToastCopy(t),
        )
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
        const message = loginToastMessage(
          error,
          useAuthStore.getState().loginError,
          loginToastCopy(t),
        )
        if (message) {
          toast.error(message)
        }
      }
      return
    }

    setConnectOpen(true)
  }

  const labelNode = (
    <span className={styles.label()}>
      {variant !== 'primary' && !needsSignIn ? (
        <span className={styles.glyph()} aria-hidden="true" />
      ) : null}
      <span className="truncate">{isLoggingIn ? t.wallet.connecting : connectLabel}</span>
    </span>
  )

  return (
    <div className={styles.shell()}>
      {variant === 'primary' ? (
        <DappActionButton
          aria-busy={isLoggingIn || undefined}
          className={styles.action({ class: className })}
          density={density}
          disabled={isLoggingIn}
          onClick={() => void handleClick()}
          type="button"
        >
          {labelNode}
        </DappActionButton>
      ) : (
        <Button
          aria-busy={isLoggingIn || undefined}
          className={styles.action({ class: className })}
          disabled={isLoggingIn}
          onClick={() => void handleClick()}
          shape="pill"
          size="sm"
          type="button"
          variant={variant === 'inline' ? 'ghost' : 'secondary'}
        >
          {labelNode}
        </Button>
      )}
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
  density = 'card',
}: {
  className?: string
  label?: string
  variant?: 'pill' | 'primary' | 'inline' | 'connected'
  fullWidth?: boolean
  density?: 'card' | 'external' | 'inverse'
}) {
  const account = useActiveAccount()
  const { sessionReady } = useAuth()
  const walletReady = hasWalletAccount(account)

  if (variant === 'connected' || (walletReady && sessionReady)) {
    if (walletReady && sessionReady) {
      return <ConnectedWalletChip />
    }
  }

  return (
    <WalletConnectButton
      className={className}
      density={density}
      fullWidth={fullWidth}
      label={label}
      variant={variant === 'connected' ? 'primary' : variant}
    />
  )
}
