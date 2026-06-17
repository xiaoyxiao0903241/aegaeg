import { createThirdwebClient, defineChain } from 'thirdweb'
import { createWallet } from 'thirdweb/wallets'
import { bsc as bscBase } from 'thirdweb/chains'
import type { WalletId } from 'thirdweb/wallets'
import { aegisConnectTheme } from '~/web3/connect-theme'

/** 公开 BSC RPC — 链上读写走此 URL，不依赖 thirdweb RPC */
export const BSC_RPC_URL =
  import.meta.env.VITE_BSC_RPC_URL ?? 'https://bsc-dataseed.binance.org'

export const bsc = defineChain({
  ...bscBase,
  rpc: BSC_RPC_URL,
})

const PLACEHOLDER_CLIENT_IDS = new Set([
  '',
  'YOUR_CLIENT_ID',
  'replace-with-thirdweb-client-id',
])

function resolveThirdwebClientId(): string {
  return import.meta.env.VITE_THIRDWEB_CLIENT_ID?.trim() ?? ''
}

export const thirdwebClientId = resolveThirdwebClientId()

/** thirdweb ConnectButton / SDK 需要有效的 Dashboard Client ID */
export const isThirdwebConfigured =
  thirdwebClientId.length > 0 && !PLACEHOLDER_CLIENT_IDS.has(thirdwebClientId)

export const thirdwebClient = createThirdwebClient({
  clientId: isThirdwebConfigured ? thirdwebClientId : 'MISSING_VITE_THIRDWEB_CLIENT_ID',
})

export const walletConnectProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim() || undefined

let web3EnvWarningsLogged = false

/** DEV：缺失 Web3 环境变量时提示一次（避免模块加载即刷屏）。 */
export function warnMissingWeb3EnvConfigOnce() {
  if (web3EnvWarningsLogged || !import.meta.env.DEV) {
    return
  }
  web3EnvWarningsLogged = true

  if (!isThirdwebConfigured) {
    console.error(
      [
        '[AEGIS] 未配置 VITE_THIRDWEB_CLIENT_ID，钱包连接会出现 401。',
        '1. 复制 .env.example 为 .env',
        '2. 在 https://thirdweb.com/dashboard/settings/api-keys 创建 Client ID',
        '3. 写入 VITE_THIRDWEB_CLIENT_ID=你的ClientId',
        '4. 重启 pnpm dev',
      ].join('\n'),
    )
  }

  if (!walletConnectProjectId) {
    console.warn(
      [
        '[AEGIS] 未配置 VITE_WALLETCONNECT_PROJECT_ID，WalletConnect 与移动端 deep link 可能不可用。',
        '在 https://cloud.walletconnect.com/ 创建 Project ID 后写入 .env。',
      ].join('\n'),
    )
  }
}

export const walletConnectConfig = walletConnectProjectId
  ? { projectId: walletConnectProjectId }
  : undefined

const hiddenWalletIds = ['inApp'] satisfies WalletId[]

/** ConnectButton / 连接弹窗共用的钱包列表策略：展示全部外部钱包 + WalletConnect */
export const walletListOptions = {
  hiddenWallets: hiddenWalletIds,
  showAllWallets: true as const,
  walletConnect: walletConnectConfig,
}

export const supportedChains = [bsc] as const

export const defaultChain = bsc

/** 连接弹窗共用配置（外壳自定义 + ConnectEmbed 内嵌） */
export const connectModalOptions = {
  hiddenWallets: [...walletListOptions.hiddenWallets],
  recommendedWallets: [
    createWallet('org.base.account'),
    createWallet('com.coinbase.wallet'),
    createWallet('walletConnect'),
    createWallet('com.binance.wallet'),
  ],
  showAllWallets: walletListOptions.showAllWallets,
  showThirdwebBranding: false as const,
  size: 'compact' as const,
  theme: aegisConnectTheme,
  titleIcon: '',
  walletConnect: walletListOptions.walletConnect,
}

/** ConnectEmbed props — 由 WalletConnectModal 外壳承载，不另开 thirdweb modal */
export const connectEmbedProps = {
  chain: defaultChain,
  chains: [...supportedChains],
  client: thirdwebClient,
  hiddenWallets: connectModalOptions.hiddenWallets,
  modalSize: connectModalOptions.size,
  recommendedWallets: connectModalOptions.recommendedWallets,
  showAllWallets: connectModalOptions.showAllWallets,
  showThirdwebBranding: connectModalOptions.showThirdwebBranding,
  theme: connectModalOptions.theme,
  walletConnect: connectModalOptions.walletConnect,
}

export type SupportedChainId = (typeof supportedChains)[number]['id']

export const appMetadata = {
  name: 'AEGIS X',
  url:
    typeof window === 'undefined' ? 'https://aegis.example' : window.location.origin,
  description: 'AEGIS X BSC DApp',
}
