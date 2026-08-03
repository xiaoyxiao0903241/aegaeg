// Auto-generated from src/shared/styles/tokens/tokens.json
// Do not edit manually. Run: pnpm build:tokens

export const colors = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-soft",
  "primary-foreground",
  "primary-bright",
  "coral",
  "coral-emphasis",
  "band",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "placeholder",
  "amount-muted",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "success",
  "claim-restake",
  "dark",
  "inverse",
  "inverse-muted",
  "token-usd1",
  "token-agx",
  "token-gagx",
  "token-x",
  "border-subtle",
  "surface-glass",
  "surface-wash-strong",
  "pill-muted-bg",
  "coral-hover-border",
  "status-success-bg",
  "success-soft",
  "faq",
  "skeleton",
  "skeleton-on-dark",
  "modal-overlay",
  "modal-overlay-strong",
  "coral-wash",
  "modal-overlay-dim",
  "warning",
  "footer"
] as const

export type ColorToken = (typeof colors)[number]

/** Hex (or rgba) from tokens.json — JS runtime SSOT; CSS prefers oklch in theme.css */
export const colorHex = {
  "background": "#f7f8f9",
  "foreground": "#0b0e14",
  "card": "#fff",
  "card-foreground": "#0b0e14",
  "popover": "#fff",
  "popover-foreground": "#0b0e14",
  "primary": "#e86a43",
  "primary-soft": "#fceae2",
  "primary-foreground": "#fff",
  "primary-bright": "#f4a98f",
  "coral": "#c85c3f",
  "coral-emphasis": "#e9785a",
  "band": "#ebeef3",
  "secondary": "#f0f1f3",
  "secondary-foreground": "#0b0e14",
  "muted": "#f0f1f3",
  "muted-foreground": "rgba(0, 0, 0, 0.7)",
  "placeholder": "#cfd3db",
  "amount-muted": "#c9cfda",
  "accent": "#fceae2",
  "accent-foreground": "#e86a43",
  "destructive": "#dc2626",
  "destructive-foreground": "#fff",
  "border": "#f0f0f2",
  "input": "#f0f0f2",
  "ring": "#e86a43",
  "success": "#2bab6a",
  "claim-restake": "#4a7bec",
  "dark": "#111625",
  "inverse": "#fff",
  "inverse-muted": "#b8c0ce",
  "token-usd1": "#e86a43",
  "token-agx": "#232833",
  "token-gagx": "#7c6230",
  "token-x": "#5e2a40",
  "border-subtle": "#e8eaef",
  "surface-glass": "rgba(255, 255, 255, 0.82)",
  "surface-wash-strong": "rgba(255, 255, 255, 0.62)",
  "pill-muted-bg": "#f4f5f7",
  "coral-hover-border": "rgba(232, 106, 67, 0.38)",
  "status-success-bg": "rgba(43, 171, 106, 0.7)",
  "success-soft": "rgba(43, 171, 106, 0.12)",
  "faq": "#5b6472",
  "skeleton": "#eef0f3",
  "skeleton-on-dark": "rgba(255, 255, 255, 0.18)",
  "modal-overlay": "rgba(18, 22, 37, 0.45)",
  "modal-overlay-strong": "rgba(18, 22, 37, 0.5)",
  "coral-wash": "#faf3ef",
  "modal-overlay-dim": "rgba(0, 0, 0, 0.35)",
  "warning": "#ff9500",
  "footer": "#161514"
} as const

export type ColorHexToken = keyof typeof colorHex

export const typeVariants = [
  "caption",
  "eyebrow",
  "support",
  "copy",
  "detail",
  "question",
  "headline",
  "brand",
  "section",
  "panel",
  "figure",
  "stat"
] as const

export type TypeVariant = (typeof typeVariants)[number]

export const space = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
] as const

export type SpaceToken = (typeof space)[number]

export const radii = [
  "tight",
  "chip",
  "control",
  "faq",
  "sm",
  "md",
  "lg",
  "xl",
  "full"
] as const

export type RadiusToken = (typeof radii)[number]

export const shadows = [
  "faq",
  "card",
  "subtle",
  "elevated-strong",
  "window",
  "modal",
  "modal-panel",
  "tooltip",
  "menu",
  "dropdown",
  "outlined"
] as const

export type ShadowToken = (typeof shadows)[number]
