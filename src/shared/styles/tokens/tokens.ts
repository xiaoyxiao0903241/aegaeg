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
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "success",
  "dark",
  "inverse",
  "token-usd1",
  "token-agx",
  "token-gagx",
  "token-x"
] as const

export type ColorToken = (typeof colors)[number]

export const typeVariants = [
  "caption",
  "eyebrow",
  "copy",
  "detail",
  "question",
  "headline",
  "brand",
  "section",
  "panel",
  "figure"
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
  "modal"
] as const

export type ShadowToken = (typeof shadows)[number]
