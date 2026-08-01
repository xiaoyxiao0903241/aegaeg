/**
 * Metric flash guard: empty string = "unknown / still loading" → keep last text.
 * Settled zero must be an explicit `'0'` / `'0.00'` / `≈ $0.00`, not `''`.
 */
export function resolveMetricDisplayText(
  next: string,
  retained: string | null,
): { display: string; retain: string | null } {
  if (next.trim() === '') {
    return { display: retained ?? '0', retain: retained }
  }
  return { display: next, retain: next }
}
