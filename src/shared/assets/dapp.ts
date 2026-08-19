import { homeAssets } from '~/shared/assets/home'
import type { DappTab } from '~/shared/config/dapp-tabs'

/** 首页代币转轮图标（供 dapp 侧引用）。 */
const tokenFlywheelIcons = homeAssets.token

/** 兑换页轮播代币图标。 */
export const tokenCarouselIcons = {
  agxIcon: '/assets/figma/dapp/carousel/token-agx.png',
  usd1Icon: '/assets/figma/dapp/carousel/token-usd1.png',
  xIcon: '/assets/figma/dapp/carousel/token-x.png',
  gagxIcon: '/assets/figma/dapp/carousel/token-gagx.png',
} as const

/** 闪电兑换图标。 */
export const flashExchangeAssets = {
  flowDivider: '/assets/figma/dapp/flash/ic-flow-divider.svg',
} as const

/** 销毁兑换图标。 */
export const burnExchangeAssets = {
  flowDown: '/assets/figma/dapp/burn/ic-flow-down.svg',
} as const

/** Turbine 兑换图标。 */
export const turbineExchangeAssets = {
  /** 市价买入行右侧珊瑚色箭头。 */
  eqBuyArrow: '/assets/figma/dapp/turbine/ic-eq-buy-arrow.svg',
} as const

/** 兑换中心图标。 */
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

/** 质押中心各模式图标。 */
export const stakingHubAssets = {
  modeStake: '/assets/figma/dapp/staking/ic-mode-stake.svg',
  modeLpBond: '/assets/figma/dapp/staking/ic-mode-lpbond.svg',
  modeBurnBond: '/assets/figma/dapp/staking/ic-mode-burnbond.svg',
  modeXmine: '/assets/figma/dapp/staking/ic-mode-xmine.svg',
  modeCalc: '/assets/figma/dapp/staking/ic-mode-calc.svg',
} as const

/** X 长期价值轮播格子图标（原型 SVG，与导航 / Hub 图标不是同一套）。 */
export const xmineValueAssets = {
  mine: '/assets/figma/dapp/xmine/ic-mine.svg',
  rewards: '/assets/figma/dapp/xmine/ic-rewards.svg',
  genesis: '/assets/figma/dapp/xmine/ic-genesis.svg',
  community: '/assets/figma/dapp/xmine/ic-community.svg',
  swap: '/assets/figma/dapp/xmine/ic-swap.svg',
  burn: '/assets/figma/dapp/xmine/ic-burn.svg',
  vault: '/assets/figma/dapp/xmine/ic-vault.svg',
  globe: '/assets/figma/dapp/xmine/ic-globe.svg',
} as const

/** 资产中心各模式图标（与质押中心图标不是同一套）。 */
export const assetsHubAssets = {
  modeStake: '/assets/figma/dapp/assets-hub/ic-mode-stake.svg',
  modeLpBond: '/assets/figma/dapp/assets-hub/ic-mode-lpbond.svg',
  modeBurnBond: '/assets/figma/dapp/assets-hub/ic-mode-burnbond.svg',
  modeXmine: '/assets/figma/dapp/assets-hub/ic-mode-xmine.svg',
  /** 缓冲池币种切换图标（深色描边，勿用珊瑚色 exchangeFlip）。 */
  bufferSwap: '/assets/figma/dapp/assets-hub/ic-buffer-swap.svg',
} as const

export const dappAssets = {
  bsc: '/assets/figma/dapp/ic-bsc.svg',
  copy: '/assets/figma/dapp/ic-copy.svg',
  copyWhite: '/assets/figma/dapp/ic-copy-white.svg',
  docs: '/assets/figma/dapp/ic-docs.svg',
  check: '/assets/figma/dapp/ic-check.svg',
  community: '/assets/figma/dapp/ic-community.svg',
  genesis: '/assets/figma/dapp/ic-genesis.svg',
  globe: '/assets/figma/dapp/ic-globe.svg',
  menu: '/assets/figma/dapp/ic-menu.svg',
  rewards: '/assets/figma/dapp/ic-rewards.svg',
  setting: '/assets/figma/dapp/ic-setting.svg',
  /** 主色描边齿轮（用于滑点等 CTA；`ic-setting` 为黑色，供中心筛选使用）。 */
  settingPrimary: '/assets/figma/dapp/ic-setting-primary.svg',
  arrowUpRight: '/assets/figma/dapp/ic-arrow-up-right.svg',
  /** 兑换页导航图标（文件名沿用旧命名）。 */
  exchange: '/assets/figma/dapp/ic-swap.svg',
  assets: '/assets/figma/dapp/ic-assets.svg',
  staking: '/assets/figma/dapp/ic-staking.svg',
  release: '/assets/figma/dapp/ic-release.svg',
  /** 市价交易的方向切换按钮（文件名沿用旧命名）。 */
  exchangeFlip: '/assets/figma/dapp/ic-swap-exchange.svg',
  telegram: '/assets/figma/dapp/ic-telegram.svg',
  twitter: '/assets/figma/dapp/ic-twitter.svg',
  youtube: '/assets/figma/dapp/ic-youtube.svg',
  medium: '/assets/figma/dapp/ic-medium.svg',
  tokenCardRays: '/assets/figma/dapp/token-card-rays.svg',
  tokenCardCorner: '/assets/figma/dapp/token-card-corner.svg',
  /** 奖励关于轮播人物。 */
  aboutCarouselRewardsMascot: '/assets/figma/dapp/about-carousel/rewards-mascot.webp',
  aboutCarouselReleaseDeco: '/assets/figma/dapp/about-carousel/release-deco.jpg',
  releasePool: '/assets/figma/dapp/release/ic-release-pool.svg',
  bufferPool: '/assets/figma/dapp/release/ic-buffer-pool.svg',
  /** 缓冲池机制说明四步图标。 */
  releaseBufferMechLock: '/assets/figma/dapp/release/ic-mech-lock.svg',
  releaseBufferMechWaves: '/assets/figma/dapp/release/ic-mech-waves.svg',
  releaseBufferMechClock: '/assets/figma/dapp/release/ic-mech-clock.svg',
  releaseBufferMechTrending: '/assets/figma/dapp/release/ic-mech-trending.svg',
  releaseBufferMechArrow: '/assets/figma/dapp/release/ic-mech-arrow.svg',
  releaseBufferMechCheck: '/assets/figma/dapp/release/ic-mech-check.svg',
  /** 资产中心总览黑卡右侧几何底纹。 */
  assetsHubOverviewDeco: '/assets/figma/dapp/assets-hub/overview-deco.svg',
  /** Rebase 标签实心珊瑚勾。 */
  assetsHubCheckBadge: '/assets/figma/dapp/assets-hub/ic-check-badge.svg',
  /** 资产仓位空状态插画。 */
  assetsPositionEmptyArt: '/assets/figma/dapp/assets-hub/stake-position-empty-art.webp',
  /** 仓位本金徽标锁。 */
  assetsPositionLock: '/assets/figma/dapp/assets-hub/ic-position-lock-12.svg',
  /** 仓位加成徽标双上箭头。 */
  assetsPositionBoost: '/assets/figma/dapp/assets-hub/ic-position-boost-12.svg',
  tokenAgx: tokenCarouselIcons.agxIcon,
  tokenGagx: tokenCarouselIcons.gagxIcon,
  /** 与 `tokenGagx` 同一张图，保留给旧涡轮调用处。 */
  tokenGagxMark: tokenCarouselIcons.gagxIcon,
  tokenUsd1: tokenFlywheelIcons.usd1Icon,
  tokenX: tokenFlywheelIcons.xIcon,
  usdt: '/assets/figma/dapp/token-usdt.svg',
  usd1: '/assets/figma/dapp/token-usd1.svg',
  genesisGlobe: '/assets/figma/dapp/genesis-globe.webp',
  rewardsCharacter: '/assets/figma/dapp/rewards-character.webp',
  /** 奖励中心各奖励卡片图标。 */
  rewardsHubLucky: '/assets/figma/dapp/rewards-hub/ic-mode-lucky.svg',
  rewardsHubReferral: '/assets/figma/dapp/rewards-hub/ic-mode-referral.svg',
  rewardsHubParticipate: '/assets/figma/dapp/rewards-hub/ic-mode-participate.svg',
  rewardsHubCobuild: '/assets/figma/dapp/rewards-hub/ic-mode-cobuild.svg',
  rewardsHubGrant: '/assets/figma/dapp/rewards-hub/ic-mode-grant.svg',
  rewardsHubGenesis: '/assets/figma/dapp/rewards-hub/ic-mode-genesis.svg',
  rewardsHubEnterClaim: '/assets/figma/dapp/rewards-hub/ic-enter-claim.svg',
  /** 总奖励卡 gAGX 圆标。 */
  rewardsHubGagxDot: '/assets/figma/dapp/rewards-hub/ic-gagx-ellipse.svg',
  /** 共建级别卡右侧角色装饰。 */
  rewardsHubTierDeco: '/assets/figma/dapp/rewards-hub/deco-character.png',
  /** 贡献点数「去销毁」箭头。 */
  rewardsHubGoBurnChevron: '/assets/figma/dapp/rewards-hub/ic-go-burn-chevron.svg',
  /** 抽奖 Chainlink VRF 标识。 */
  rewardsHubChainlink: '/assets/figma/dapp/rewards-hub/ic-chainlink.svg',
  /** 共建机制表 A6–A9 团队业绩切换。 */
  rewardsHubTierToggle: '/assets/figma/dapp/rewards-hub/ic-tier-toggle.svg',
  /** 社区等级暗色卡片插画。 */
  communityRankDeco: '/assets/figma/dapp/community/rank-deco.png',
  /** 生态支持·创世火箭。 */
  communityProgramRocket: '/assets/figma/dapp/community/program-rocket.png',
  /** 生态支持·X 学院星。 */
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
