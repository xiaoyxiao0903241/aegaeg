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
