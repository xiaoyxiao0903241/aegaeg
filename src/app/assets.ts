import type { DappTab } from './types'

export const homeAssets = {
  logoMark: '/assets/figma/home/logo-mark.png',
  heroCharacterTall: '/assets/figma/home/hero-character-tall.png',
  heroCharacterFull: '/assets/figma/home/hero-character-full.png',
  heroSparkle: '/assets/figma/home/hero-character.png',
  engineMarketMaker: '/assets/figma/home/engine-market-maker.png',
  engineVolatility: '/assets/figma/home/engine-volatility.png',
  engineRebase: '/assets/figma/home/engine-rebase.png',
  engineTurbo: '/assets/figma/home/engine-turbo.png',
  tokenAgxIcon: '/assets/figma/home/icons/token-agx-icon.svg',
  tokenAgxShape: '/assets/figma/home/icons/token-agx-shape.svg',
  tokenUsd1Icon: '/assets/figma/home/icons/token-usd1-icon.svg',
  tokenUsd1Shape: '/assets/figma/home/icons/token-usd1-shape.svg',
  tokenXIcon: '/assets/figma/home/icons/token-x-icon.svg',
  tokenXShape: '/assets/figma/home/icons/token-x-shape.svg',
  tokenGagxIcon: '/assets/figma/home/icons/token-gagx-icon.svg',
  tokenGagxShape: '/assets/figma/home/icons/token-gagx-shape.svg',
} as const

export const dappAssets = {
  bsc: '/assets/figma/dapp/ic-bsc.svg',
  copy: '/assets/figma/dapp/ic-copy.svg',
  docs: '/assets/figma/dapp/ic-docs.svg',
  check: '/assets/figma/dapp/ic-check.svg',
  chevron: '/assets/figma/dapp/ic-chevron.svg',
  chevronUp: '/assets/figma/dapp/ic-chevron-up.svg',
  community: '/assets/figma/dapp/ic-community.svg',
  genesis: '/assets/figma/dapp/ic-genesis.svg',
  globe: '/assets/figma/dapp/ic-globe.svg',
  menu: '/assets/figma/dapp/ic-menu.svg',
  rewards: '/assets/figma/dapp/ic-rewards.svg',
  setting: '/assets/figma/dapp/ic-setting.svg',
  swapConnectPrompt: '/assets/figma/dapp/ic-swap-connect-prompt.svg',
  arrowUpRight: '/assets/figma/dapp/ic-arrow-up-right.svg',
  swap: '/assets/figma/dapp/ic-swap.svg',
  telegram: '/assets/figma/dapp/ic-telegram.svg',
  twitter: '/assets/figma/dapp/ic-twitter.svg',
  tokenCardRays: '/assets/figma/dapp/token-card-rays.svg',
  tokenCardCorner: '/assets/figma/dapp/token-card-corner.svg',
  tokenAgx: '/assets/figma/home/icons/token-agx-mark.webp',
  tokenGagx: '/assets/figma/home/icons/token-gagx-icon.svg',
  tokenX: '/assets/figma/home/icons/token-x-mark.webp',
  usdt: '/assets/figma/dapp/token-usdt.svg',
  usd1: '/assets/figma/dapp/token-usd1.svg',
  genesisGlobe: '/assets/figma/dapp/genesis-globe.png',
  rewardsCharacter: '/assets/figma/dapp/rewards-character.png',
} as const

export const railItems: Array<{
  id: DappTab
  icon: string
}> = [
  { id: 'swap', icon: dappAssets.swap },
  { id: 'genesis', icon: dappAssets.genesis },
  { id: 'rewards', icon: dappAssets.rewards },
  { id: 'community', icon: dappAssets.community },
]
