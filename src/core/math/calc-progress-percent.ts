/** Clamp current/target ratio to 0..100 for progress bars. */
export function calcProgressPercent(current: string | number, target: string | number): number {
  const currentNum = Number(current)
  const targetNum = Number(target)
  if (!Number.isFinite(currentNum) || !Number.isFinite(targetNum) || targetNum <= 0) {
    return 0
  }

  return Math.min(100, (currentNum / targetNum) * 100)
}
