/** 引导步骤 id 列表，顺序即引导顺序；值需与 DOM 的 data-tour-id 保持一致。 */
export const ONBOARDING_STEP_IDS = [
  'nav-swap',
  'swap-trade',
  'nav-staking',
  'stake-mode-stake',
  'nav-assets',
  'asset-mode-stake',
  'nav-release',
  'release-pool-card',
  'buffer-pool-card',
  'swap-turbine',
  'nav-rewards',
  'nav-community',
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEP_IDS)[number]

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEP_IDS.length

const NAV_STEP_IDS = new Set<OnboardingStepId>([
  'nav-swap',
  'nav-staking',
  'nav-assets',
  'nav-release',
  'nav-rewards',
  'nav-community',
])

/** 该步是否属于导航条步骤（需要打开抽屉 / 高亮导航项）。 */
export function isOnboardingNavStep(id: OnboardingStepId): boolean {
  return NAV_STEP_IDS.has(id)
}

/** 根据步骤 id 生成 DOM 选择器。 */
export function tourSelector(id: OnboardingStepId): string {
  return `[data-tour-id="${id}"]`
}
