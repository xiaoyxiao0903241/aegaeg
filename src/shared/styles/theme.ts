/**
 * JS runtime color helpers — hex from tokens.json via generated `colorHex`.
 * CSS / Tailwind SSOT remains theme.css. thirdweb Connect needs a JS object.
 */
import { colorHex } from '~/shared/styles/tokens/tokens'

/** Brand / chrome hex for meta theme-color and non-CSS consumers. */
export const themeHex = {
  background: colorHex.background,
  foreground: colorHex.foreground,
  card: colorHex.card,
  primary: colorHex.primary,
  primaryForeground: colorHex['primary-foreground'],
  secondary: colorHex.secondary,
  border: colorHex.border,
  success: colorHex.success,
  onDark: colorHex['inverse-muted'],
  faq: colorHex.faq,
  metaTheme: colorHex.background,
  coral: colorHex.coral,
  coralEmphasis: colorHex['coral-emphasis'],
  warning: colorHex.warning,
  footer: colorHex.footer,
  modalOverlay: colorHex['modal-overlay'],
  modalOverlayStrong: colorHex['modal-overlay-strong'],
} as const

/**
 * thirdweb Connect Modal palette.
 * Token aliases where 1:1; remaining hexes are Connect-chrome-only (not product axes).
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
