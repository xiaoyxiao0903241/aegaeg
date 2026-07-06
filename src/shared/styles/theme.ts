/**
 * JS/TS 色值 SSOT — hex 与 theme.css :root 回退行对齐。
 * Tailwind 语义色以 theme.css 为准；此处供 thirdweb 主题与 runtime 读取。
 */
export const themeHex = {
  background: '#f7f8f9',
  foreground: '#252628',
  card: '#ffffff',
  primary: '#e86a43',
  primaryForeground: '#ffffff',
  secondary: '#f0f1f3',
  border: '#f0f0f2',
  success: '#22a06b',
  onDark: '#b8c0ce',
  faqText: '#5b6472',
  metaTheme: '#f5f6f8',
} as const

/** thirdweb Connect Modal — 对齐 AEGIS 珊瑚色 + 白底卡片 */
export const thirdwebConnectHex = {
  accentButtonBg: '#E9785A',
  accentButtonText: '#3A201A',
  accentText: '#E9785A',
  borderColor: '#E3E8ED',
  connectedButtonBg: '#FFFFFF',
  connectedButtonBgHover: '#F4F6F8',
  modalBg: '#FFFFFF',
  modalOverlayBg: 'oklch(13% 0.02 264 / 50%)',
  primaryButtonBg: '#E9785A',
  primaryButtonText: '#3A201A',
  primaryText: '#111625',
  secondaryButtonBg: '#F4F6F8',
  secondaryButtonHoverBg: '#EEF1F5',
  secondaryButtonText: '#111625',
  secondaryIconColor: '#6B7280',
  secondaryIconHoverBg: '#F4F6F8',
  secondaryIconHoverColor: '#111625',
  secondaryText: '#6B7280',
  selectedTextBg: '#E9785A',
  selectedTextColor: '#3A201A',
  separatorLine: '#E3E8ED',
  skeletonBg: '#EEF1F5',
  success: '#22A06B',
  tertiaryBg: '#F4F6F8',
  tooltipBg: '#111625',
  tooltipText: '#FFFFFF',
} as const
