import { createThirdwebClient, defineChain } from 'thirdweb'
import { createWallet } from 'thirdweb/wallets'
import { bsc as bscBase } from 'thirdweb/chains'
import type { WalletId } from 'thirdweb/wallets'
import { aegisConnectTheme } from '~/views/dapp/web3/connect-theme'
import { appEnv } from '~/shared/config/env'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'

/** Public BSC RPC — disconnected reads only; connected wallet uses EIP-1193 provider. */
export const BSC_RPC_URL = appEnv.bscRpcUrl

export const bsc = defineChain({
  ...bscBase,
  rpc: BSC_RPC_URL,
})

export const thirdwebClientId = appEnv.thirdwebClientId

/** thirdweb ConnectButton / SDK — env override with code fallback in `env.ts`. */
export const isThirdwebConfigured = thirdwebClientId.length > 0

export const thirdwebClient = createThirdwebClient({
  clientId: thirdwebClientId,
})

export const walletConnectProjectId = appEnv.walletConnectProjectId

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
        '未配置 VITE_THIRDWEB_CLIENT_ID，钱包连接会出现 401。',
        '1. 复制 .env.example 为 .env',
        '2. 在 https://thirdweb.com/dashboard/settings/api-keys 创建 Client ID',
        '3. 写入 VITE_THIRDWEB_CLIENT_ID=你的ClientId',
        '4. 重启 pnpm dev',
      ].join('\n'),
    )
  }

}

export const walletConnectConfig = { projectId: walletConnectProjectId }

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
  url: getRuntimeOrigin(),
  description: 'AEGIS X BSC DApp',
}
