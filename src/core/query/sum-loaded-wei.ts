/**
 * 已加载列表的 wei 合计。
 *
 * 没拉到（null/undefined）→ `null`，展示 `--`。
 * 拉到空列表 → `0n`，真零。
 *
 * @param rows 查询结果列表；尚未返回时为 null/undefined
 * @param pick 从一行取出 wei
 */
export function sumLoadedWei<T>(
  rows: readonly T[] | null | undefined,
  pick: (row: T) => bigint,
): bigint | null {
  if (rows == null) return null
  let sum = 0n
  for (const row of rows) sum += pick(row)
  return sum
}

/**
 * 一组可选 wei 全到齐才加总。任一缺数 → `null`（展示 `--`）。
 * 全到齐且皆为 `0n` → `0n`。
 *
 * @param values 各来源的 wei；尚未返回的项为 null/undefined
 */
export function sumOptionalWei(values: readonly (bigint | null | undefined)[]): bigint | null {
  let sum = 0n
  for (const value of values) {
    if (value == null) return null
    sum += value
  }
  return sum
}
