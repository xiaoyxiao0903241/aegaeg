import { homeAssets as canonicalHomeAssets } from '~/shared/assets/home'
import type { DappTab } from '~/shared/config/dapp-tabs'

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

/** Burn exchange icons. */
export const burnExchangeAssets = {
  flowDown: '/assets/figma/dapp/burn/ic-flow-down.svg',
} as const

/** Turbine exchange icons. */
export const turbineExchangeAssets = {
  /** Figma `4435:445` eqBuy row arrow (coral right). */
  eqBuyArrow: '/assets/figma/dapp/turbine/ic-eq-buy-arrow.svg',
} as const

/** Exchange hub icons. */
export const exchangeHubAssets = {
  modeFlash: '/assets/figma/dapp/hub/ic-hub-mode-flash.svg',
  modeTrade: '/assets/figma/dapp/hub/ic-hub-mode-trade.svg',
  modeBurn: '/assets/figma/dapp/hub/ic-hub-mode-burn.svg',
  modeTurbine: '/assets/figma/dapp/hub/ic-hub-mode-turbine.svg',
  programUsdt: '/assets/figma/dapp/token-usdt.svg',
  programUsd1: '/assets/figma/dapp/hub/program-usd1.png',
  programAgx: '/assets/figma/dapp/hub/program-agx.png',
  programPancake: '/assets/figma/dapp/hub/program-pancake.png',
  programX: '/assets/figma/dapp/hub/program-x.png',
  programGagx: '/assets/figma/dapp/hub/program-gagx.png',
} as const

/** Staking hub mode icons. */
export const stakingHubAssets = {
  modeStake: '/assets/figma/dapp/staking/ic-mode-stake.svg',
  modeLpBond: '/assets/figma/dapp/staking/ic-mode-lpbond.svg',
  modeBurnBond: '/assets/figma/dapp/staking/ic-mode-burnbond.svg',
  modeXmine: '/assets/figma/dapp/staking/ic-mode-xmine.svg',
  modeCalc: '/assets/figma/dapp/staking/ic-mode-calc.svg',
} as const

/** Assets hub — Figma `asset/*` leaf icons（与质押 hub mode 图标不同稿）. */
export const assetsHubAssets = {
  modeStake: '/assets/figma/dapp/assets-hub/ic-mode-stake.svg',
  modeLpBond: '/assets/figma/dapp/assets-hub/ic-mode-lpbond.svg',
  modeBurnBond: '/assets/figma/dapp/assets-hub/ic-mode-burnbond.svg',
  modeXmine: '/assets/figma/dapp/assets-hub/ic-mode-xmine.svg',
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
  /** Figma `4518:7176` — 排序等 pill trigger 下箭头 10. */
  chevronDown: '/assets/figma/dapp/ic-chevron-down.svg',
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
  /** Assets hub 总览黑卡右侧几何底纹 · Figma `4284:215`. */
  assetsHubOverviewDeco: '/assets/figma/dapp/assets-hub/overview-deco.svg',
  /** Rebase tags 实心珊瑚勾 · Figma `4285:233`. */
  assetsHubCheckBadge: '/assets/figma/dapp/assets-hub/ic-check-badge.svg',
  /** 资产仓位空态插画 · HTML 原型 `r23` / `ip-gift`. */
  assetsPositionEmptyArt: '/assets/figma/dapp/assets-hub/stake-position-empty-art.webp',
  /** 仓位本金 chip 锁 · Figma `4525:242` 12. */
  assetsPositionLock: '/assets/figma/dapp/assets-hub/ic-position-lock-12.svg',
  /** 仓位加成 chip 双上箭头 · Figma `4525:253` 12. */
  assetsPositionBoost: '/assets/figma/dapp/assets-hub/ic-position-boost-12.svg',
  tokenAgx: tokenFlywheelIcons.agxIcon,
  tokenGagx: tokenFlywheelIcons.gagxIcon,
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
