/** localStorage key for DApp onboarding completion — grilling 04 / Spec. */
export const ONBOARDING_STORAGE_KEY = 'aegis.onboarding.v1'

export type OnboardingPersistence = {
  /** Completed or skipped for this version. */
  done: boolean
}

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

export function writeOnboardingDone(
  done: boolean,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ done } satisfies OnboardingPersistence))
}
