/**
 * 提交 / 下单判断用的金额取值。
 *
 * react-query 的占位数据（keepPreviousData 场景）视为未知：既不能当作 0，
 * 也不能当作已加载的新值；展示层可继续用 query.data。
 *
 * @param data 查询数据
 * @param isPlaceholderData 是否占位数据
 * @returns 非占位数据时返回原值，占位时返回 undefined
 */
export function decisionBigint(
  data: bigint | undefined,
  isPlaceholderData: boolean,
): bigint | undefined {
  if (isPlaceholderData) return undefined
  return data
}

/**
 * 提交判断是否已有新鲜数据（非占位且已定义）。
 *
 * @param isPlaceholderData 是否占位数据
 * @param data 查询数据
 * @returns 新鲜返回 true
 */
export function isDecisionFresh(isPlaceholderData: boolean, data: unknown): boolean {
  return !isPlaceholderData && data !== undefined
}
