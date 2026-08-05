import { tv } from 'tailwind-variants'

import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { Icon } from '~/shared/components/icon'
import { Tooltip } from '~/shared/components/tooltip'
import { dappAssets } from '~/shared/config/assets'
import { WalletConnectChip } from '~/views/dapp/host/wallet/wallet-connect-chip'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const networkPill = tv({
  base: [
    // 网络胶囊：PC 与 H5 通用，白色底圆角，高度 36
    'inline-flex h-9 min-h-9 cursor-default items-center justify-center gap-2 rounded-full border border-border bg-card px-3.5',
    'text-xs leading-[1.2] font-semibold shadow-none',
    'max-dapp:px-3 max-dapp:text-xs',
  ],
})

/**
 * 顶部栏钱包区
 *
 * 会话就绪时展示当前网络胶囊与已连接钱包入口；
 * 否则展示连接 / 登录按钮，按登录态切换文案。
 */
export function WalletTopbarActions() {
  const account = useActiveAccount()
  const { sessionReady, needsSignIn, isLoggingIn } = useAuth()
  const { messages: t } = useI18n()
  const walletReady = hasWalletAccount(account)
  const fullyConnected = walletReady && sessionReady

  if (fullyConnected) {
    return (
      <>
        <Tooltip content={t.nav.bscTooltip} position="bottom">
          <div className={networkPill()} aria-label={t.topbar.currentNetwork}>
            <Icon alt="" className="rounded-full" size="lg" src={dappAssets.bsc} />
            {t.common.bsc}
          </div>
        </Tooltip>
        <WalletConnectChip variant="connected" />
      </>
    )
  }

  const label = needsSignIn
    ? isLoggingIn
      ? t.wallet.connecting
      : t.wallet.signInRequired
    : t.common.connectWallet

  return <WalletConnectChip className="min-h-9" label={label} variant="primary" />
}
