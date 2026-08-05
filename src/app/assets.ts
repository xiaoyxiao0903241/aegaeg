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
  flowDivider: '/assets/figma/dapp/flash/ic-flow-divider.svg',
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
  /** 缓冲池币种切换 · Figma `4424:49` stroke `#0B0E14`（勿用珊瑚色 exchangeFlip） */
  bufferSwap: '/assets/figma/dapp/assets-hub/ic-buffer-swap.svg',
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
  community: '/assets/figma/dapp/ic-community.svg',
  genesis: '/assets/figma/dapp/ic-genesis.svg',
  globe: '/assets/figma/dapp/ic-globe.svg',
  menu: '/assets/figma/dapp/ic-menu.svg',
  rewards: '/assets/figma/dapp/ic-rewards.svg',
  setting: '/assets/figma/dapp/ic-setting.svg',
  /** 滑点等 CTA 齿轮 · 同叶 primary 描边（`ic-setting` 为黑，供 Hub 筛选） */
  settingPrimary: '/assets/figma/dapp/ic-setting-primary.svg',
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
  /** 奖励 about 轮播人物 · Figma `4585:1026` */
  aboutCarouselRewardsMascot: '/assets/figma/dapp/about-carousel/rewards-mascot.webp',
  aboutCarouselReleaseDeco: '/assets/figma/dapp/about-carousel/release-deco.jpg',
  releasePool: '/assets/figma/dapp/release/ic-release-pool.svg',
  bufferPool: '/assets/figma/dapp/release/ic-buffer-pool.svg',
  /** 缓冲池机制四步 · Figma `4470:331` */
  releaseBufferMechLock: '/assets/figma/dapp/release/ic-mech-lock.svg',
  releaseBufferMechWaves: '/assets/figma/dapp/release/ic-mech-waves.svg',
  releaseBufferMechClock: '/assets/figma/dapp/release/ic-mech-clock.svg',
  releaseBufferMechTrending: '/assets/figma/dapp/release/ic-mech-trending.svg',
  releaseBufferMechArrow: '/assets/figma/dapp/release/ic-mech-arrow.svg',
  releaseBufferMechCheck: '/assets/figma/dapp/release/ic-mech-check.svg',
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
  tokenAgx: tokenCarouselIcons.agxIcon,
  tokenGagx: tokenCarouselIcons.gagxIcon,
  /** 与 `tokenGagx` 同图（carousel 128²）；旧涡轮引用保留 */
  tokenGagxMark: tokenCarouselIcons.gagxIcon,
  tokenUsd1: tokenFlywheelIcons.usd1Icon,
  tokenX: tokenFlywheelIcons.xIcon,
  usdt: '/assets/figma/dapp/token-usdt.svg',
  usd1: '/assets/figma/dapp/token-usd1.svg',
  genesisGlobe: '/assets/figma/dapp/genesis-globe.webp',
  rewardsCharacter: '/assets/figma/dapp/rewards-character.webp',
  /** Hub reward/* 分卡图标 · Figma `4291:212` 左栏直拉 */
  rewardsHubLucky: '/assets/figma/dapp/rewards-hub/ic-mode-lucky.svg',
  rewardsHubReferral: '/assets/figma/dapp/rewards-hub/ic-mode-referral.svg',
  rewardsHubParticipate: '/assets/figma/dapp/rewards-hub/ic-mode-participate.svg',
  rewardsHubCobuild: '/assets/figma/dapp/rewards-hub/ic-mode-cobuild.svg',
  rewardsHubGrant: '/assets/figma/dapp/rewards-hub/ic-mode-grant.svg',
  rewardsHubGenesis: '/assets/figma/dapp/rewards-hub/ic-mode-genesis.svg',
  rewardsHubEnterClaim: '/assets/figma/dapp/rewards-hub/ic-enter-claim.svg',
  /** tile/总奖励 gAGX 圆标 · `4296:214` */
  rewardsHubGagxDot: '/assets/figma/dapp/rewards-hub/ic-gagx-ellipse.svg',
  /** tile/共建级别 右侧角色 · `4585:1024` */
  rewardsHubTierDeco: '/assets/figma/dapp/rewards-hub/deco-character.png',
  /** 贡献点数「去销毁」chevron · `4629:934` */
  rewardsHubGoBurnChevron: '/assets/figma/dapp/rewards-hub/ic-go-burn-chevron.svg',
  /** Lucky Chainlink VRF 标 · `4395:240` */
  rewardsHubChainlink: '/assets/figma/dapp/rewards-hub/ic-chainlink.svg',
  /** 社区等级暗卡 IP · Figma `4794:3809` */
  communityRankDeco: '/assets/figma/dapp/community/rank-deco.png',
  /** 生态支持 · 创世火箭 · `4794:3841` */
  communityProgramRocket: '/assets/figma/dapp/community/program-rocket.png',
  /** 生态支持 · X 学院星 · `4794:3838` */
  communityProgramStar: '/assets/figma/dapp/community/program-star.png',
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
