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
