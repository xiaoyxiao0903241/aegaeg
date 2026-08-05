import { useAuth } from '~/hooks/use-auth'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useActiveAccount, useIsAutoConnecting } from '~/web3/thirdweb-react'
import { hasWalletAccount, isWalletRestorePending } from '~/web3/wallet/wallet-connection-state'

export interface DappShellState {
  tab: DappTab
  /** SIWE 会话已就绪——决定接口数据与登录态界面。 */
  sessionReady: boolean
  /** 钱包已连接但缺少 JWT——需要展示登录引导。 */
  needsSignIn: boolean
  /** thirdweb 当前账户——用于签名与交易，由钱包 SDK 实时提供。 */
  walletReady: boolean
  /** 自动连接仍在恢复上一次钱包会话。 */
  isWalletConnecting: boolean
  /** 右侧详情面板是否折叠。 */
  detailCollapsed: boolean
}

/**
 * 汇总 DApp 外壳当前所需的连接与会话状态。
 *
 * 同时读取钱包 SDK 的实时账户、登录状态仓库与外壳状态仓库，
 * 把「钱包已连接 / 会话就绪 / 需要登录」等布尔值一次集齐。
 *
 * @returns 连接与会话状态，各字段语义见 {@link DappShellState}
 */
export function useDappShell(): DappShellState {
  const account = useActiveAccount()
  const isAutoConnecting = useIsAutoConnecting()
  const { sessionReady, needsSignIn } = useAuth()
  const tab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const walletReady = hasWalletAccount(account)
  const isWalletConnecting = isWalletRestorePending(account, isAutoConnecting)

  return {
    tab,
    sessionReady,
    needsSignIn,
    walletReady,
    isWalletConnecting,
    detailCollapsed,
  }
}
