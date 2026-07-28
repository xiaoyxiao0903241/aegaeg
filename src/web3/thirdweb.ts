import { createThirdwebClient, defineChain } from 'thirdweb'
import { createWallet } from 'thirdweb/wallets'
import { bsc as bscBase } from 'thirdweb/chains'
import type { WalletId } from 'thirdweb/wallets'
import { aegisConnectTheme } from '~/web3/connect-theme'
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

const THIRDWEB_SETUP_HINT = [
  '未配置 VITE_THIRDWEB_CLIENT_ID，钱包连接会出现 401。',
  '1. 复制 .env.example 为 .env',
  '2. 在 https://thirdweb.com/dashboard/settings/api-keys 创建 Client ID',
  '3. 写入 VITE_THIRDWEB_CLIENT_ID=你的ClientId',
  '4. 重启 pnpm dev',
].join('\n')

/**
 * Production boot: require an explicit `VITE_THIRDWEB_CLIENT_ID` (not only the code fallback).
 * Dev: log once so local work is not blocked.
 */
export function assertWeb3EnvConfigured() {
  const fromEnv =
    typeof import.meta.env.VITE_THIRDWEB_CLIENT_ID === 'string'
      ? import.meta.env.VITE_THIRDWEB_CLIENT_ID.trim()
      : ''

  if (import.meta.env.PROD && !fromEnv) {
    throw new Error(
      'VITE_THIRDWEB_CLIENT_ID is required in production builds. Set it in .env before `pnpm build`.',
    )
  }

  if (web3EnvWarningsLogged || !import.meta.env.DEV) return
  web3EnvWarningsLogged = true

  if (!fromEnv) {
    console.error(THIRDWEB_SETUP_HINT)
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
