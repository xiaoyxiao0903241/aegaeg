import { readErrorText } from '~/web3/errors/error-text'

/**
 * Map known soft-gate / domain sentinels to user copy, else `fallback`.
 * Call sites pass locale strings; this stays locale-free.
 */
export function messageFromSentinels(
  error: unknown,
  pairs: ReadonlyArray<readonly [sentinel: string, message: string]>,
  fallback: (error: unknown) => string,
): string {
  const raw = readErrorText(error)
  if (raw) {
    for (const [sentinel, message] of pairs) {
      if (raw === sentinel) return message
    }
  }
  return fallback(error)
}
