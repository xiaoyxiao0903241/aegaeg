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

/** 新手引导完成状态的 localStorage 键。 */
export const ONBOARDING_STORAGE_KEY = 'aegis.onboarding.v1'

export type OnboardingPersistence = {
  /** 本版本是否已完成（或跳过）引导。 */
  done: boolean
}

/**
 * 读取引导完成状态。
 *
 * 读取异常、内容不合法或从未写入时一律视为未完成。
 *
 * @param storage 存储对象，默认 localStorage
 * @returns 引导完成状态
 */
export function readOnboardingPersistence(
  storage: Pick<Storage, 'getItem'> = localStorage,
): OnboardingPersistence {
  try {
    const raw = storage.getItem(ONBOARDING_STORAGE_KEY)
    if (!raw) return { done: false }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { done: false }
    return { done: Boolean((parsed as { done?: unknown }).done) }
  } catch {
    return { done: false }
  }
}

/**
 * 写入引导完成状态。
 *
 * @param done 是否已完成
 * @param storage 存储对象，默认 localStorage
 */
export function writeOnboardingDone(
  done: boolean,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ done } satisfies OnboardingPersistence))
}
