import { useState } from 'react'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import {
  ACCOUNT_BANNED_SENTINEL,
  authLoginErrorMessage,
  isAccountBannedError,
  LOGIN_ERROR,
} from '~/shared/api/account-banned'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import { Button } from '~/shared/components/button'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { formatShortAddress } from '~/shared/presenters/format'
import { useAuthStore } from '~/stores/auth-store'
import { WalletConnectModal } from '~/views/dapp/host/wallet/wallet-connect-modal'
import { WalletDetailsModal } from '~/views/dapp/host/wallet/wallet-details-modal'
import { isUserRejectedWalletError, toWalletUserFacingMessage } from '~/web3/contract-error-message'
import { useActiveAccount } from '~/web3/thirdweb-react'

const walletConnectChip = tv({
  slots: {
    label: 'inline-flex min-w-0 items-center gap-1.5',
    glyph: [
      'relative aspect-16/13 w-4 shrink-0 rounded-sm border-[0.09375rem] border-primary',
      'after:absolute after:top-0.5 after:right-0.5 after:aspect-square after:w-px after:rounded-full after:bg-primary after:content-[""]',
    ],
    connected: 'aegis-connected-wallet-chip',
    root: '',
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
        root: 'flex w-full',
        action: 'w-full',
      },
      false: {
        root: 'inline-flex items-center',
        action: 'w-auto',
      },
    },
  },
  defaultVariants: {
    reconnect: false,
    fullWidth: false,
  },
})

/**
 * 计算登录失败时展示的错误提示文案。
 *
 * 账号封禁与用户主动拒绝签名不弹提示（前者由全局通知处理，后者静默）；
 * 其余错误优先取登录接口返回码，再退回通用接口 / 钱包错误文案。
 *
 * @param error 登录抛出的原始错误
 * @param loginError 登录状态仓库中的错误标记
 * @param messages 各错误文案
 * @returns 需要展示的错误提示文案
 */
function loginToastMessage(
  error: unknown,
  loginError: string | null,
  messages: {
    accountBanned: string
    walletNotConnected: string
    loginFailed: string
    loginSignatureRejected: string
    loginWrongNetwork: string
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
  // 异网不落 loginError；手动登录 throw 哨兵时仍要 toast
  if (error === LOGIN_ERROR.WRONG_NETWORK) {
    return messages.loginWrongNetwork
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
    loginWrongNetwork: t.topbar.switchToBsc,
    api: t.errors.api,
  }
}

async function loginWithErrorToast(
  login: () => Promise<unknown>,
  messages: ReturnType<typeof loginToastCopy>,
) {
  try {
    await login()
  } catch (error) {
    const message = loginToastMessage(error, useAuthStore.getState().loginError, messages)
    if (message) {
      toast.error(message)
    }
  }
}

function ConnectedWalletChip() {
  const account = useActiveAccount()
  const { session, sessionReady, loginError, login } = useAuth()
  const { messages: t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const styles = walletConnectChip({ reconnect: Boolean(loginError) })

  const address = account?.address ?? session?.address

  if (!sessionReady || !address) {
    return null
  }

  async function handleClick() {
    if (loginError) {
      await loginWithErrorToast(login, loginToastCopy(t))
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
      {/* 保持挂载，让 Radix 能播放关闭态退场动画（与连接弹窗一致）。 */}
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
  /** 高度档位：inverse 深色促销 38 · card 白卡 42 · external 外部链接 44 */
  density?: 'card' | 'external' | 'inverse'
}) {
  const { isLoggingIn, login, loginError, needsSignIn } = useAuth()
  const { messages: t } = useI18n()
  const [connectOpen, setConnectOpen] = useState(false)
  const styles = walletConnectChip({ fullWidth })

  const connectLabel = label ?? (needsSignIn ? t.wallet.signInRequired : t.common.connectWallet)

  async function handleClick() {
    if (loginError || needsSignIn) {
      await loginWithErrorToast(login, loginToastCopy(t))
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
    <div className={styles.root()}>
      {variant === 'primary' ? (
        <Button
          aria-busy={isLoggingIn || undefined}
          className={cn(
            'gap-2',
            density === 'card' && 'min-h-10.5',
            density === 'inverse' && 'min-h-9.5 text-xs',
            density === 'external' && 'min-h-0 py-4 text-base/5',
            styles.action({ class: className }),
          )}
          disabled={isLoggingIn}
          onClick={() => void handleClick()}
          size={density === 'external' ? 'lg' : 'sm'}
          type="button"
          variant="primary"
        >
          {labelNode}
        </Button>
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

/**
 * 钱包连接入口
 *
 * 已连接且会话就绪时渲染地址胶囊（点击打开钱包详情）；
 * 否则渲染连接 / 登录按钮，登录失败或需要登录时点击直接触发登录。
 * 支持 pill（胶囊）与 primary（主按钮）等外观变体。
 */
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
  const { sessionReady } = useAuth()

  if (sessionReady) {
    return <ConnectedWalletChip />
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
