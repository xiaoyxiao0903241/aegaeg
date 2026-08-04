/**
 * 指标闪动守卫：空串视为「未知 / 仍在加载」→ 保留上次文案。
 * 已结算零值须显式 `'0'` / `'0.00'` / `≈ $0.00`，禁用 `''`。
 */
export function metricDisplayText(
  next: string,
  retained: string | null,
): { display: string; retain: string | null } {
  if (next.trim() === '') {
    return { display: retained ?? '0', retain: retained }
  }
  return { display: next, retain: next }
}
