/** Prototype Shell `tourSteps[].id` — keep stable for selectors. */
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

export function isOnboardingNavStep(id: OnboardingStepId): boolean {
  return NAV_STEP_IDS.has(id)
}

export function tourSelector(id: OnboardingStepId): string {
  return `[data-tour-id="${id}"]`
}
