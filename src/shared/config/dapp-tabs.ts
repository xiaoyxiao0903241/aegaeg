/** Tab 顺序——叶子模块，不引入 Tab 组件（避免工具库/注册表循环依赖）。 */
export const tabOrder = [
  'exchange',
  'assets',
  'staking',
  'rewards',
  'release',
  'community',
  'genesis',
] as const

export type DappTab = (typeof tabOrder)[number]

/** 点导航项时相对当前 Tab / 子页应采取的动作。 */
export type DappTabSelectIntent = 'switch-tab' | 'back-to-hub' | 'noop'

/**
 * 点侧栏或抽屉里的 Tab 时，决定切走、回到列表，还是什么都不做。
 *
 * 已在该 Tab 的子页时，再点同一项应回到 hub 列表；已在列表或没有子页时保持空操作。
 *
 * @param input 点选的 Tab、当前激活 Tab，以及该 Tab 当前子页（无子视图仓库时不传）
 * @returns 切 Tab、回到该 Tab 的 hub，或空操作
 */
export function resolveDappTabSelect(input: {
  tab: DappTab
  activeTab: DappTab
  subview?: string
}): DappTabSelectIntent {
  if (input.tab !== input.activeTab) return 'switch-tab'
  if (input.subview !== undefined && input.subview !== 'hub') return 'back-to-hub'
  return 'noop'
}
