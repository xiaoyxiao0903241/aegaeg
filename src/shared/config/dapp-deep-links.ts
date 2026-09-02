import { type DappTab, tabOrder } from '~/shared/config/dapp-tabs'

/**
 * DApp Tab 与子视图的深链接解析。
 *
 * 统一处理 `#tab` / `#tab/view` 的解析、旧版 `#swap` 兼容，
 * 并为每个子视图生成可写回 URL 的 hash。
 */

export type ExchangeView = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'
export type StakingView = 'hub' | 'stake' | 'lpbond' | 'burnbond' | 'xmine' | 'calc'
export type AssetsView = 'hub' | 'stake' | 'lpbond' | 'burnbond' | 'xmine'
export type RewardsView =
  'hub' | 'lucky' | 'referral' | 'participate' | 'cobuild' | 'grant' | 'genesis'
export type ReleaseView = 'hub' | 'queue' | 'buffer'

const EXCHANGE_VIEWS = new Set<ExchangeView>(['hub', 'flash', 'trade', 'burn', 'turbine'])
const STAKING_VIEWS = new Set<StakingView>(['hub', 'stake', 'lpbond', 'burnbond', 'xmine', 'calc'])
const ASSETS_VIEWS = new Set<AssetsView>(['hub', 'stake', 'lpbond', 'burnbond', 'xmine'])
const REWARDS_VIEWS = new Set<RewardsView>([
  'hub',
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
])
const RELEASE_VIEWS = new Set<ReleaseView>(['hub', 'queue', 'buffer'])

function isDappTab(value: string): value is DappTab {
  return tabOrder.includes(value as DappTab)
}

export function isExchangeView(value: string): value is ExchangeView {
  return EXCHANGE_VIEWS.has(value as ExchangeView)
}

export function isStakingView(value: string): value is StakingView {
  return STAKING_VIEWS.has(value as StakingView)
}

export function isAssetsView(value: string): value is AssetsView {
  return ASSETS_VIEWS.has(value as AssetsView)
}

export function isRewardsView(value: string): value is RewardsView {
  return REWARDS_VIEWS.has(value as RewardsView)
}

export function isReleaseView(value: string): value is ReleaseView {
  return RELEASE_VIEWS.has(value as ReleaseView)
}

function hashForTabView(tab: DappTab, view: string, hub: string): string {
  return view === hub ? `#${tab}` : `#${tab}/${view}`
}

export function exchangeHashForView(view: ExchangeView): string {
  return hashForTabView('exchange', view, 'hub')
}

export function stakingHashForView(view: StakingView): string {
  return hashForTabView('staking', view, 'hub')
}

export function assetsHashForView(view: AssetsView): string {
  return hashForTabView('assets', view, 'hub')
}

export function rewardsHashForView(view: RewardsView): string {
  return hashForTabView('rewards', view, 'hub')
}

export function releaseHashForView(view: ReleaseView): string {
  return hashForTabView('release', view, 'hub')
}

/** 奖励卡片 → 对应合约 key 的映射。 */
export const REWARDS_CARD_CONTRACT = {
  lucky: 'LuckyPool',
  referral: 'CommunityFund',
  participate: 'DaoPool',
  cobuild: 'DaoPool',
  grant: 'MarketFund',
  genesis: 'RewardClaimer',
} as const satisfies Record<Exclude<RewardsView, 'hub'>, string>

type DappLocation = {
  tab: DappTab
  exchangeView: ExchangeView | null
  stakingView: StakingView | null
  assetsView: AssetsView | null
  rewardsView: RewardsView | null
  releaseView: ReleaseView | null
}

function emptyViews(tab: DappTab, patch: Partial<DappLocation> = {}): DappLocation {
  return {
    tab,
    exchangeView: null,
    stakingView: null,
    assetsView: null,
    rewardsView: null,
    releaseView: null,
    ...patch,
  }
}

/**
 * 各 Tab 子视图的深链接解析（exchange / staking / assets / rewards / release）。
 * hash 形式：`#exchange` | `#exchange/burn` | `#staking/stake` | `#assets/lpbond` | `#rewards/lucky` | `#release/queue` | …
 * 旧版：`#swap` 映射到 exchange hub。
 * release 子视图只有 `hub|queue|buffer`，不接受 `rewards`。
 */
export function dappLocationFromHash(hash: string): DappLocation | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return null
  if (raw === 'swap') return emptyViews('exchange', { exchangeView: 'hub' })

  const parts = raw.split('/')
  const tabPart = parts[0]
  const viewPart = parts[1]
  if (!tabPart || !isDappTab(tabPart)) return null

  if (tabPart === 'exchange') {
    if (!viewPart) return emptyViews('exchange')
    if (!isExchangeView(viewPart)) return emptyViews('exchange', { exchangeView: 'hub' })
    return emptyViews('exchange', { exchangeView: viewPart })
  }

  if (tabPart === 'staking') {
    if (!viewPart) return emptyViews('staking')
    if (!isStakingView(viewPart)) return emptyViews('staking', { stakingView: 'hub' })
    return emptyViews('staking', { stakingView: viewPart })
  }

  if (tabPart === 'assets') {
    if (!viewPart) return emptyViews('assets')
    if (!isAssetsView(viewPart)) return emptyViews('assets', { assetsView: 'hub' })
    return emptyViews('assets', { assetsView: viewPart })
  }

  if (tabPart === 'rewards') {
    if (!viewPart) return emptyViews('rewards')
    if (!isRewardsView(viewPart)) return emptyViews('rewards', { rewardsView: 'hub' })
    return emptyViews('rewards', { rewardsView: viewPart })
  }

  if (tabPart === 'release') {
    if (!viewPart) return emptyViews('release')
    // 拒绝旧命名 `rewards` 作为 release 子视图
    if (viewPart === 'rewards' || !isReleaseView(viewPart)) {
      return emptyViews('release', { releaseView: 'hub' })
    }
    return emptyViews('release', { releaseView: viewPart })
  }

  return emptyViews(tabPart)
}

/** 从 `window.location.hash` 得到初始 Tab（仅浏览器环境）。 */
export function getInitialTab(): DappTab {
  return dappLocationFromHash(window.location.hash.slice(1))?.tab ?? 'exchange'
}
