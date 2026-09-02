/**
 * 运行时颜色帮助常量
 *
 * 从生成好的 tokens 里取 hex 色值供 JS 使用；CSS / Tailwind 侧在 theme.css。
 * thirdweb Connect 弹窗需要 JS 对象形式的色值，故单独维护一份。
 */
import { colorHex } from '~/shared/styles/tokens/tokens'

/** 品牌 / 外观色值：仅保留现有 JS 消费方（home meta · thirdweb）。 */
export const themeHex = {
  card: colorHex.card,
  success: colorHex.success,
  metaTheme: colorHex.background,
  coralEmphasis: colorHex['coral-emphasis'],
  modalOverlayStrong: colorHex['modal-overlay-strong'],
} as const

/**
 * thirdweb Connect 弹窗配色
 *
 * 与产品 token 一一对应的别名直接用主题色；其余是弹窗专属色值（不属产品色板）。
 */
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
  primaryText: colorHex.dark,
  secondaryButtonBg: '#F4F6F8',
  secondaryButtonHoverBg: '#EEF1F5',
  secondaryButtonText: colorHex.dark,
  secondaryIconColor: '#6B7280',
  secondaryIconHoverBg: '#F4F6F8',
  secondaryIconHoverColor: colorHex.dark,
  secondaryText: '#6B7280',
  selectedTextBg: themeHex.coralEmphasis,
  selectedTextColor: '#3A201A',
  separatorLine: '#E3E8ED',
  skeletonBg: '#EEF1F5',
  success: themeHex.success,
  tertiaryBg: '#F4F6F8',
  tooltipBg: colorHex.dark,
  tooltipText: colorHex.inverse,
} as const
