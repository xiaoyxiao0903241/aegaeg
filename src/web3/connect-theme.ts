import { lightTheme } from '~/web3/thirdweb-react'
import { thirdwebConnectHex } from '~/shared/styles/theme'

/** thirdweb Connect Modal 主题 — 对齐 AEGIS 珊瑚色 + 白底卡片 */
export const aegisConnectTheme = lightTheme({
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
