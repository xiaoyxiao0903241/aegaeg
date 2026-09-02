import { createThirdwebClient, defineChain } from 'thirdweb'
import { bsc as bscBase } from 'thirdweb/chains'
import type { WalletId } from 'thirdweb/wallets'
import { createWallet } from 'thirdweb/wallets'

import { appEnv } from '~/shared/config/env'
import { getRuntimeOrigin } from '~/shared/lib/runtime-host'
import { thirdwebConnectHex } from '~/shared/styles/theme'
import { lightTheme } from '~/web3/thirdweb-react'

/** thirdweb Connect Modal 主题 — 对齐 AEGIS 珊瑚色 + 白底卡片 */
const aegisConnectTheme = lightTheme({
  fontFamily: 'inherit',
  colors: {
    accentButtonBg: thirdwebConnectHex.accentButtonBg,
    accentButtonText: thirdwebConnectHex.accentButtonText,
    accentText: thirdwebConnectHex.accentText,
    borderColor: thirdwebConnectHex.borderColor,
    connectedButtonBg: thirdwebConnectHex.connectedButtonBg,
    connectedButtonBgHover: thirdwebConnectHex.connectedButtonBgHover,
    modalBg: thirdwebConnectHex.modalBg,
    modalOverlayBg: thirdwebConnectHex.modalOverlayBg,
    primaryButtonBg: thirdwebConnectHex.primaryButtonBg,
    primaryButtonText: thirdwebConnectHex.primaryButtonText,
    primaryText: thirdwebConnectHex.primaryText,
    secondaryButtonBg: thirdwebConnectHex.secondaryButtonBg,
    secondaryButtonHoverBg: thirdwebConnectHex.secondaryButtonHoverBg,
    secondaryButtonText: thirdwebConnectHex.secondaryButtonText,
    secondaryIconColor: thirdwebConnectHex.secondaryIconColor,
    secondaryIconHoverBg: thirdwebConnectHex.secondaryIconHoverBg,
    secondaryIconHoverColor: thirdwebConnectHex.secondaryIconHoverColor,
    secondaryText: thirdwebConnectHex.secondaryText,
    selectedTextBg: thirdwebConnectHex.selectedTextBg,
    selectedTextColor: thirdwebConnectHex.selectedTextColor,
    separatorLine: thirdwebConnectHex.separatorLine,
    skeletonBg: thirdwebConnectHex.skeletonBg,
    success: thirdwebConnectHex.success,
    tertiaryBg: thirdwebConnectHex.tertiaryBg,
    tooltipBg: thirdwebConnectHex.tooltipBg,
    tooltipText: thirdwebConnectHex.tooltipText,
  },
})

/** 公共 BSC RPC——仅未连接钱包时用于只读；已连接时走钱包的 EIP-1193 provider。 */
export const BSC_RPC_URL = appEnv.bscRpcUrl

export const defaultChain = defineChain({
  ...bscBase,
  rpc: BSC_RPC_URL,
})

export const thirdwebClientId = appEnv.thirdwebClientId

/** 缺配置即失败：`appEnv` 未配置会直接抛错，因此模块加载时这里恒为 true。 */
export const isThirdwebConfigured = thirdwebClientId.length > 0

export const thirdwebClient = createThirdwebClient({
  clientId: thirdwebClientId,
})

export const walletConnectProjectId = appEnv.walletConnectProjectId

const THIRDWEB_SETUP_HINT = [
  '未配置 VITE_THIRDWEB_CLIENT_ID，钱包连接会出现 401。',
  '1. 复制 .env.example 为 .env 并填入全部必填项（无代码 fallback）',
  '2. 在 https://thirdweb.com/dashboard/settings/api-keys 创建 Client ID',
  '3. 写入 VITE_THIRDWEB_CLIENT_ID=你的ClientId',
  '4. 重启 pnpm dev',
].join('\n')

/**
 * 启动守卫：二次核对原始环境变量
 *
 * `appEnv` 已缺配置即抛错，这里再从 import.meta.env 复核一遍，作为纵深防御。
 * 仍未配置时抛出带排障步骤的报错。
 */
export function assertWeb3EnvConfigured() {
  const fromEnv =
    typeof import.meta.env.VITE_THIRDWEB_CLIENT_ID === 'string'
      ? import.meta.env.VITE_THIRDWEB_CLIENT_ID.trim()
      : ''

  if (!fromEnv) {
    throw new Error(
      `VITE_THIRDWEB_CLIENT_ID is required (no code fallback).\n${THIRDWEB_SETUP_HINT}`,
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

export const supportedChains = [defaultChain] as const

/** 连接弹窗共用配置（自定义外观 + ConnectEmbed 内嵌） */
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

/** ConnectEmbed props — 供 WalletConnectModal 内嵌使用，不另开 thirdweb 弹窗 */
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
