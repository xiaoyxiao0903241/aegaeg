/**
 * JS/TS 色值 SSOT — hex 与 theme.css :root 回退行对齐。
 * Tailwind 语义色以 theme.css 为准；此处供 thirdweb 主题与 runtime 读取。
 */
export const themeHex = {
  background: '#f7f8f9',
  foreground: '#0b0e14',
  card: '#ffffff',
  primary: '#e86a43',
  primaryForeground: '#ffffff',
  secondary: '#f0f1f3',
  border: '#f0f0f2',
  success: '#2bab6a',
  onDark: '#b8c0ce',
  faq: '#5b6472',
  /** @deprecated use `faq` */
  faqText: '#5b6472',
  metaTheme: '#f7f8f9',
  coral: '#c85c3f',
  coralEmphasis: '#e9785a',
  warning: '#ff9500',
  footer: '#161514',
  modalOverlay: 'oklch(13% 0.02 264 / 45%)',
  modalOverlayStrong: 'oklch(13% 0.02 264 / 50%)',
} as const

/** thirdweb Connect Modal — 对齐 AEGIS 珊瑚色 + 白底卡片 */
export const thirdwebConnectHex = {
  accentButtonBg: themeHex.coralEmphasis,
  accentButtonText: '#3A201A',
  accentText: themeHex.coralEmphasis,
  borderColor: '#E3E8ED',
  connectedButtonBg: themeHex.card,
  connectedButtonBgHover: '#F4F6F8',
  modalBg: themeHex.card,
  modalOverlayBg: themeHex.modalOverlayStrong,
  primaryButtonBg: themeHex.coralEmphasis,
  primaryButtonText: '#3A201A',
  primaryText: '#111625',
  secondaryButtonBg: '#F4F6F8',
  secondaryButtonHoverBg: '#EEF1F5',
  secondaryButtonText: '#111625',
  secondaryIconColor: '#6B7280',
  secondaryIconHoverBg: '#F4F6F8',
  secondaryIconHoverColor: '#111625',
  secondaryText: '#6B7280',
  selectedTextBg: themeHex.coralEmphasis,
  selectedTextColor: '#3A201A',
  separatorLine: '#E3E8ED',
  skeletonBg: '#EEF1F5',
  success: '#22A06B',
  tertiaryBg: '#F4F6F8',
  tooltipBg: '#111625',
  tooltipText: '#FFFFFF',
} as const
