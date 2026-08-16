/**
 * 计算进度百分比（current / target），夹取到 0–100。
 *
 * target 非正或任一输入非有限数时返回 0，避免除零与异常输入。
 *
 * @param current 当前值
 * @param target 目标值
 * @returns 0–100 的百分比
 */
export function calcProgressPercent(current: string | number, target: string | number): number {
  const currentNum = Number(current)
  const targetNum = Number(target)
  if (!Number.isFinite(currentNum) || !Number.isFinite(targetNum) || targetNum <= 0) {
    return 0
  }

  return Math.min(100, (currentNum / targetNum) * 100)
}
