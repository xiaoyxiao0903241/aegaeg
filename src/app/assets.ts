import type { DappTab } from './types'
import { homeAssets as canonicalHomeAssets } from '../home/assets'

/** Homepage token flywheel icons — SSOT for carousel / about cards. */
export const tokenFlywheelIcons = canonicalHomeAssets.token

/** DApp swap carousel icons — exported from Figma `130:792` / `144:20` / `130:824` / `130:840`. */
export const tokenCarouselIcons = {
  agxIcon: '/assets/figma/dapp/carousel/token-agx.png',
  usd1Icon: '/assets/figma/dapp/carousel/token-usd1.png',
  xIcon: '/assets/figma/dapp/carousel/token-x.png',
  gagxIcon: '/assets/figma/dapp/carousel/token-gagx.png',
} as const

export const homeAssets = {
  logoMark: canonicalHomeAssets.logoMark,
  heroCharacterTall: '/assets/figma/home/hero-character-tall.png',
  heroCharacterFull: '/assets/figma/home/hero-character-full.png',
  heroSparkle: '/assets/figma/home/hero-character.png',
  engineMarketMaker: '/assets/figma/home/engine-market-maker.png',
  engineVolatility: '/assets/figma/home/engine-volatility.png',
  engineRebase: '/assets/figma/home/engine-rebase.png',
  engineTurbo: '/assets/figma/home/engine-turbo.png',
  tokenAgxIcon: tokenFlywheelIcons.agxIcon,
  tokenAgxShape: tokenFlywheelIcons.agxShape,
  tokenUsd1Icon: tokenFlywheelIcons.usd1Icon,
  tokenUsd1Shape: tokenFlywheelIcons.usd1Shape,
  tokenXIcon: tokenFlywheelIcons.xIcon,
  tokenXShape: tokenFlywheelIcons.xShape,
  tokenGagxIcon: tokenFlywheelIcons.gagxIcon,
  tokenGagxShape: tokenFlywheelIcons.gagxShape,
} as const

export const dappAssets = {
  bsc: '/assets/figma/dapp/ic-bsc.svg',
  copy: '/assets/figma/dapp/ic-copy.svg',
  copyWhite: '/assets/figma/dapp/ic-copy-white.svg',
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
  tokenAgx: tokenFlywheelIcons.agxIcon,
  tokenGagx: tokenCarouselIcons.gagxIcon,
  tokenUsd1: tokenFlywheelIcons.usd1Icon,
  tokenX: tokenFlywheelIcons.xIcon,
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
