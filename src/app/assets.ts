import type { DappTab } from '~/shared/config/dapp-tabs'
import { homeAssets as canonicalHomeAssets } from '~/views/home/assets'

/** Homepage token flywheel icons. */
const tokenFlywheelIcons = canonicalHomeAssets.token

/** DApp exchange carousel icons. */
export const tokenCarouselIcons = {
  agxIcon: '/assets/figma/dapp/carousel/token-agx.png',
  usd1Icon: '/assets/figma/dapp/carousel/token-usd1.png',
  xIcon: '/assets/figma/dapp/carousel/token-x.png',
  gagxIcon: '/assets/figma/dapp/carousel/token-gagx.png',
} as const

/** Flash exchange icons. */
export const flashExchangeAssets = {
  backArrow: '/assets/figma/dapp/flash/ic-back-arrow.svg',
  flowDivider: '/assets/figma/dapp/flash/ic-flow-divider.svg',
  externalLink: '/assets/figma/dapp/flash/ic-external-link.svg',
} as const

/** Exchange hub icons. */
export const exchangeHubAssets = {
  modeFlash: '/assets/figma/dapp/hub/ic-hub-mode-flash.svg',
  modeTrade: '/assets/figma/dapp/hub/ic-hub-mode-trade.svg',
  modeBurn: '/assets/figma/dapp/hub/ic-hub-mode-burn.svg',
  modeTurbine: '/assets/figma/dapp/hub/ic-hub-mode-turbine.svg',
  programUsdt: '/assets/figma/dapp/hub/program-usdt.svg',
  programUsd1: '/assets/figma/dapp/hub/program-usd1.svg',
  programAgx: '/assets/figma/dapp/hub/program-agx.png',
  programX: '/assets/figma/dapp/hub/program-x.png',
  programGagx: '/assets/figma/dapp/carousel/token-gagx.png',
  aboutRays: '/assets/figma/dapp/hub/token-card-rays-hub.svg',
} as const

export const homeAssets = {
  logoMark: canonicalHomeAssets.logoMark,
  heroCharacterTall: '/assets/figma/home/hero-character-tall.webp',
  heroCharacterFull: '/assets/figma/home/hero-character-full.webp',
  heroSparkle: '/assets/figma/home/hero-character.png',
  engineMarketMaker: canonicalHomeAssets.engine.marketMaker,
  engineVolatility: canonicalHomeAssets.engine.volatility,
  engineRebase: canonicalHomeAssets.engine.rebase,
  engineTurbo: canonicalHomeAssets.engine.turbo,
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
  /** H5 Exchange pager — double chevron (down); rotate 180° for previous page. */
  swipeChevronDouble: '/assets/figma/dapp/ic-swipe-chevron-double.svg',
  community: '/assets/figma/dapp/ic-community.svg',
  genesis: '/assets/figma/dapp/ic-genesis.svg',
  globe: '/assets/figma/dapp/ic-globe.svg',
  menu: '/assets/figma/dapp/ic-menu.svg',
  rewards: '/assets/figma/dapp/ic-rewards.svg',
  setting: '/assets/figma/dapp/ic-setting.svg',
  infoHint: '/assets/figma/dapp/ic-info-hint.svg',
  arrowUpRight: '/assets/figma/dapp/ic-arrow-up-right.svg',
  /** Rail icon for exchange tab (glyph file name historical). */
  exchange: '/assets/figma/dapp/ic-swap.svg',
  assets: '/assets/figma/dapp/ic-assets.svg',
  staking: '/assets/figma/dapp/ic-staking.svg',
  release: '/assets/figma/dapp/ic-release.svg',
  /** Direction flip control in market trade (glyph file name historical). */
  exchangeFlip: '/assets/figma/dapp/ic-swap-exchange.svg',
  telegram: '/assets/figma/dapp/ic-telegram.svg',
  twitter: '/assets/figma/dapp/ic-twitter.svg',
  youtube: '/assets/figma/dapp/ic-youtube.svg',
  medium: '/assets/figma/dapp/ic-medium.svg',
  tokenCardRays: '/assets/figma/dapp/token-card-rays.svg',
  tokenCardCorner: '/assets/figma/dapp/token-card-corner.svg',
  tokenAgx: tokenFlywheelIcons.agxIcon,
  tokenGagx: tokenCarouselIcons.gagxIcon,
  tokenUsd1: tokenFlywheelIcons.usd1Icon,
  tokenX: tokenFlywheelIcons.xIcon,
  usdt: '/assets/figma/dapp/token-usdt.svg',
  usd1: '/assets/figma/dapp/token-usd1.svg',
  genesisGlobe: '/assets/figma/dapp/genesis-globe.webp',
  rewardsCharacter: '/assets/figma/dapp/rewards-character.webp',
} as const

export const railItems: Array<{
  id: DappTab
  icon: string
}> = [
  { id: 'exchange', icon: dappAssets.exchange },
  { id: 'assets', icon: dappAssets.assets },
  { id: 'staking', icon: dappAssets.staking },
  { id: 'rewards', icon: dappAssets.rewards },
  { id: 'release', icon: dappAssets.release },
  { id: 'community', icon: dappAssets.community },
  { id: 'genesis', icon: dappAssets.genesis },
]
