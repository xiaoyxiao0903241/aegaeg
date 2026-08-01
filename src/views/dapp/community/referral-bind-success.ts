/**
 * Bind CTA success for community toast — set only from envelope `onSuccess`.
 * Do not infer success from `mutate()`'s return (void writes resolve `undefined`).
 */
export function readAndClearBindSuccess(flag: { current: boolean }): boolean {
  const ok = flag.current
  flag.current = false
  return ok
}
